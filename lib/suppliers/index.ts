import { BaseSupplierAdapter } from "./base-adapter";
import { CJAdapter } from "./adapters/cj-adapter";
import { AliExpressAdapter } from "./adapters/aliexpress-adapter";
import { AmazonAdapter } from "./adapters/amazon-adapter";
import { SupplierType } from "./types";

const adapters: Record<string, BaseSupplierAdapter> = {};

export function registerAdapter(adapter: BaseSupplierAdapter): void {
  adapters[adapter.supplier] = adapter;
}

export function getAdapter(supplier: string): BaseSupplierAdapter {
  const adapter = adapters[supplier];
  if (!adapter) throw new Error(`No adapter found for supplier: ${supplier}`);
  return adapter;
}

export function getAdapterForUrl(url: string): BaseSupplierAdapter | null {
  for (const adapter of Object.values(adapters)) {
    if (adapter.validateUrl(url)) return adapter;
  }
  return null;
}

export function getAllAdapters(): BaseSupplierAdapter[] {
  return Object.values(adapters);
}

export function getSupplierList(): { id: string; name: string }[] {
  return Object.values(adapters).map((a) => ({ id: a.supplier, name: a.name }));
}

// Register built-in adapters
registerAdapter(new CJAdapter());
registerAdapter(new AliExpressAdapter());
registerAdapter(new AmazonAdapter());

export { BaseSupplierAdapter } from "./base-adapter";
export * from "./types";
