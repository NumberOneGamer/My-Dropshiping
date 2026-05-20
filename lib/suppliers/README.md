# Supplier Integration Architecture

## Structure

```
lib/
  suppliers/
    types.ts          # Common supplier interfaces
    base.ts           # Abstract base supplier class
    cj-dropshipping/  # CJdropshipping integration
    aliexpress/       # AliExpress / DSers integration
    sync.ts           # Product sync orchestrator
```

## Base Interface

```typescript
interface SupplierProduct {
  supplierId: string;
  supplierName: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  variants: { name: string; price?: number; stock: number }[];
  category: string;
  weight?: number;
}

interface SupplierService {
  importProduct(url: string): Promise<SupplierProduct>;
  syncInventory(): Promise<void>;
  getTracking(orderId: string): Promise<string>;
}
```

## Implementation example for CJdropshipping

```typescript
// lib/suppliers/cj-dropshipping/index.ts
export class CJDropshippingService implements SupplierService {
  async importProduct(url: string): Promise<SupplierProduct> {
    // CJ API integration
    // POST /api/products/import
    return {
      supplierId: "cj_" + crypto.randomUUID(),
      supplierName: "CJdropshipping",
      // ... map response fields
    };
  }
}
```

## Product Import Flow

1. Admin enters a supplier product URL
2. System fetches product data via supplier API
3. Maps supplier fields to local schema
4. Creates/updates product with supplier reference
5. Schedules periodic inventory sync
6. Orders auto-forward to supplier on confirmation

## Sync Architecture

- CRON job every 6 hours
- Syncs inventory levels
- Updates pricing
- Fetches tracking numbers
- Handles supplier stockouts
