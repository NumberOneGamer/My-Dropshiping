type JobHandler = (job: any) => Promise<void>;
type JobQueue = { id: string; type: string; data: any; timestamp: number }[];

interface QueueConfig {
  concurrency?: number;
  retries?: number;
  backoff?: number;
}

const handlers = new Map<string, JobHandler>();
const queues = new Map<string, JobQueue>();
const processing = new Map<string, boolean>();

let redisClient: any = null;

function getRedis() {
  if (!redisClient && process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      const { Redis } = require("@upstash/redis");
      redisClient = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });
    } catch { /* fallback to in-memory */ }
  }
  return redisClient;
}

function generateId(): string {
  return `job_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function registerQueue(name: string, handler: JobHandler, config?: QueueConfig): void {
  handlers.set(name, handler);
  if (!queues.has(name)) queues.set(name, []);
}

export async function enqueue<T = any>(queueName: string, data: T, options?: { delay?: number }): Promise<string> {
  const id = generateId();
  const job = { id, type: queueName, data, timestamp: Date.now() + (options?.delay || 0) };

  const redis = getRedis();
  if (redis) {
    const payload = JSON.stringify(job);
    if (options?.delay) {
      await redis.zadd(`queue:${queueName}:delayed`, { score: job.timestamp, member: payload });
    } else {
      await redis.lpush(`queue:${queueName}`, payload);
    }
  } else {
    const queue = queues.get(queueName);
    if (queue) queue.push(job);
  }

  if (!options?.delay) processQueue(queueName).catch(() => {});

  return id;
}

async function processQueue(queueName: string): Promise<void> {
  if (processing.get(queueName)) return;
  processing.set(queueName, true);

  try {
    const handler = handlers.get(queueName);
    if (!handler) return;

    const redis = getRedis();

    while (true) {
      let jobData: string | null = null;

      if (redis) {
        jobData = await redis.rpop(`queue:${queueName}`);
      } else {
        const queue = queues.get(queueName);
        const job = queue?.shift();
        jobData = job ? JSON.stringify(job) : null;
      }

      if (!jobData) break;

      try {
        const job = JSON.parse(jobData);
        await handler(job);
      } catch (err) {
        console.error(`[Queue] Failed job in ${queueName}:`, err);
      }
    }
  } finally {
    processing.set(queueName, false);
  }
}

export async function getQueueLength(queueName: string): Promise<number> {
  const redis = getRedis();
  if (redis) {
    return await redis.llen(`queue:${queueName}`);
  }
  return queues.get(queueName)?.length || 0;
}

export async function getQueueJobs(queueName: string): Promise<any[]> {
  const redis = getRedis();
  if (redis) {
    const jobs = await redis.lrange(`queue:${queueName}`, 0, -1);
    return jobs.map((j: string) => JSON.parse(j));
  }
  return queues.get(queueName) || [];
}
