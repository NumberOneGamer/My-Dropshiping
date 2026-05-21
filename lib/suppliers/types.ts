export type SupplierType = "aliexpress" | "cjdropshipping" | "amazon" | "manual";

export interface SupplierProduct {
  supplier: SupplierType;
  supplierProductId: string;
  supplierUrl?: string;
  title: string;
  description?: string;
  images: string[];
  price: number;
  comparePrice?: number;
  costPrice?: number;
  currency: string;
  variants: SupplierVariant[];
  categoryName?: string;
  tags: string[];
  weight?: number;
  sku?: string;
  stock: number;
  attributes: Record<string, any>;
}

export interface SupplierVariant {
  name: string;
  sku?: string;
  price: number;
  stock: number;
  options?: Record<string, string>;
  images?: string[];
}

export interface SupplierOrderInput {
  items: { supplierProductId: string; variantId?: string; quantity: number; price: number }[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    zip: string;
    country: string;
    phone?: string;
  };
}

export interface SupplierOrderResult {
  supplierOrderId: string;
  status: string;
  trackingNumber?: string;
  trackingUrl?: string;
  carrier?: string;
  cost: number;
  currency: string;
  estimatedDelivery?: Date;
  rawResponse: Record<string, any>;
}

export interface SupplierTrackingInfo {
  trackingNumber: string;
  trackingUrl?: string;
  carrier: string;
  status: string;
  updates: { status: string; location?: string; description: string; timestamp: Date }[];
  estimatedDelivery?: Date;
}

export interface ImportResult {
  success: boolean;
  product?: SupplierProduct;
  error?: string;
}

export interface SyncResult {
  success: boolean;
  updatedPrice?: number;
  updatedStock?: number;
  isAvailable: boolean;
  error?: string;
}
