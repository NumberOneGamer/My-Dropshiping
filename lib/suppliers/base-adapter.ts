import { SupplierOrderInput, SupplierOrderResult, SupplierTrackingInfo, ImportResult, SyncResult } from "./types";

export abstract class BaseSupplierAdapter {
  abstract readonly supplier: string;
  abstract readonly name: string;
  abstract readonly baseUrl: string;

  abstract importProduct(url: string): Promise<ImportResult>;
  abstract syncInventory(supplierProductId: string): Promise<SyncResult>;
  abstract createOrder(input: SupplierOrderInput): Promise<SupplierOrderResult>;
  abstract getTracking(supplierOrderId: string): Promise<SupplierTrackingInfo>;
  abstract validateUrl(url: string): boolean;

  get displayName(): string {
    return this.name;
  }

  get isConfigured(): boolean {
    return false;
  }

  protected async fetch(url: string, options?: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "User-Agent": "KAIRO-Dropship/1.0",
          ...options?.headers,
        },
      });
      if (!res.ok) throw new Error(`Supplier API error: ${res.status} ${res.statusText}`);
      return res;
    } finally {
      clearTimeout(timeout);
    }
  }

  protected requireCredentials(): void {
    if (!this.isConfigured) {
      throw new Error(
        `${this.name} is not configured. Set the required environment variables ` +
        `in your Cloudflare Dashboard or .env.local file. Currently using mock data.`
      );
    }
  }
}