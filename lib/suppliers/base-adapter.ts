import { SupplierProduct, SupplierOrderInput, SupplierOrderResult, SupplierTrackingInfo, ImportResult, SyncResult } from "./types";

export abstract class BaseSupplierAdapter {
  abstract readonly supplier: string;
  abstract readonly name: string;
  abstract readonly baseUrl: string;

  abstract importProduct(url: string): Promise<ImportResult>;
  abstract syncInventory(supplierProductId: string): Promise<SyncResult>;
  abstract createOrder(input: SupplierOrderInput): Promise<SupplierOrderResult>;
  abstract getTracking(supplierOrderId: string): Promise<SupplierTrackingInfo>;
  abstract validateUrl(url: string): boolean;

  protected async fetch(url: string, options?: RequestInit): Promise<Response> {
    const res = await fetch(url, {
      ...options,
      headers: { "User-Agent": "KAIRO-Dropship/1.0", ...options?.headers },
    });
    if (!res.ok) throw new Error(`Supplier API error: ${res.status} ${res.statusText}`);
    return res;
  }

  protected log(type: string, action: string, status: string, message: string, metadata?: Record<string, any>): void {
    // optional hook for logging
  }
}
