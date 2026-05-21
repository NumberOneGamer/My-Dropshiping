// Edge-safe email service
// Uses Resend for email delivery

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.EMAIL_FROM || "KAIRO <noreply@kairo.com>";
const FROM_NAME = "KAIRO";

let resend: any = null;

function getClient() {
  if (!resend && RESEND_API_KEY) {
    try {
      const { Resend } = require("resend");
      resend = new Resend(RESEND_API_KEY);
    } catch {
      console.warn("[Email] Resend client could not be initialized");
    }
  }
  return resend;
}

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
  const client = getClient();
  if (!client) {
    console.warn("[Email] No email client configured — email not sent");
    return { success: false, error: "Email service not configured" };
  }

  try {
    const { data, error } = await client.emails.send({
      from: FROM_EMAIL,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    if (error) return { success: false, error: error.message };
    return { success: true, id: data?.id };
  } catch (err: any) {
    console.error("[Email] Failed to send:", err);
    return { success: false, error: err.message };
  }
}

// --- EMAIL TEMPLATES ---

export function orderConfirmationEmail(params: {
  customerName: string;
  orderNumber: string;
  items: { name: string; quantity: number; price: string; image?: string }[];
  total: string;
  orderUrl: string;
}): string {
  const itemsHtml = params.items.map((item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">
        <img src="${item.image || "https://via.placeholder.com/48"}" alt="${item.name}" width="48" height="48" style="border-radius: 4px;">
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #1a1a2e;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #1a1a2e;">x${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #1a1a2e;">${item.price}</td>
    </tr>
  `).join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8f9fa; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="font-size: 24px; font-weight: 700; letter-spacing: 4px; color: #1a1a2e; margin: 0;">KAIRO</h1>
    </div>
    <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <h2 style="font-size: 20px; font-weight: 600; color: #1a1a2e; margin: 0 0 8px;">Order Confirmed</h2>
      <p style="color: #64748b; margin: 0 0 24px;">Thank you, ${params.customerName}! Your order has been received.</p>
      
      <div style="background: #f1f5f9; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <p style="margin: 0 0 4px; color: #64748b; font-size: 14px;">Order Number</p>
        <p style="margin: 0; font-size: 18px; font-weight: 600; color: #1a1a2e;">${params.orderNumber}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <thead>
          <tr style="background: #f8f9fa;">
            <th style="padding: 10px; text-align: left; color: #64748b; font-size: 12px; text-transform: uppercase;">Item</th>
            <th style="padding: 10px; text-align: left; color: #64748b; font-size: 12px; text-transform: uppercase;">Name</th>
            <th style="padding: 10px; text-align: left; color: #64748b; font-size: 12px; text-transform: uppercase;">Qty</th>
            <th style="padding: 10px; text-align: left; color: #64748b; font-size: 12px; text-transform: uppercase;">Price</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <div style="text-align: right; padding-top: 16px; border-top: 2px solid #e2e8f0;">
        <p style="margin: 0; font-size: 20px; font-weight: 700; color: #1a1a2e;">Total: ${params.total}</p>
      </div>

      <a href="${params.orderUrl}" style="display: block; text-align: center; margin-top: 24px; padding: 14px; background: #1a1a2e; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">View Order</a>
    </div>
    <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 24px;">KAIRO — Premium quality, delivered.</p>
  </div>
</body>
</html>`;
}

export function shippingUpdateEmail(params: {
  customerName: string;
  orderNumber: string;
  status: string;
  trackingNumber?: string;
  trackingUrl?: string;
  carrier?: string;
  orderUrl: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8f9fa; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="font-size: 24px; font-weight: 700; letter-spacing: 4px; color: #1a1a2e; margin: 0;">KAIRO</h1>
    </div>
    <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <h2 style="font-size: 20px; font-weight: 600; color: #1a1a2e; margin: 0 0 8px;">Shipping Update</h2>
      <p style="color: #64748b; margin: 0 0 24px;">Hi ${params.customerName}, your order #${params.orderNumber} has been updated.</p>
      
      <div style="background: #f1f5f9; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <p style="margin: 0 0 4px; color: #64748b; font-size: 14px;">Current Status</p>
        <p style="margin: 0; font-size: 18px; font-weight: 600; color: #1a1a2e;">${params.status}</p>
      </div>

      ${params.trackingNumber ? `
      <div style="background: #f1f5f9; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <p style="margin: 0 0 4px; color: #64748b; font-size: 14px;">Tracking Number</p>
        <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1a1a2e;">${params.carrier ? params.carrier + " — " : ""}${params.trackingNumber}</p>
      </div>` : ""}

      ${params.trackingUrl ? `<a href="${params.trackingUrl}" style="display: block; text-align: center; padding: 14px; background: #1a1a2e; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin-bottom: 12px;">Track Package</a>` : ""}
      
      <a href="${params.orderUrl}" style="display: block; text-align: center; padding: 14px; background: transparent; color: #1a1a2e; text-decoration: none; border: 2px solid #1a1a2e; border-radius: 8px; font-weight: 600;">View Order Details</a>
    </div>
    <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 24px;">KAIRO — Premium quality, delivered.</p>
  </div>
</body>
</html>`;
}

export function trackingConfirmationEmail(params: {
  customerName: string;
  orderNumber: string;
  trackingNumber: string;
  trackingUrl?: string;
  carrier: string;
  orderUrl: string;
}): string {
  return shippingUpdateEmail({ ...params, status: "SHIPPED" });
}
