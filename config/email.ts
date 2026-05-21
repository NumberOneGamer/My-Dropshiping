export const emailConfig = {
  from: process.env.EMAIL_FROM || "KAIRO <noreply@kairo.com>",
  adminEmail: process.env.ADMIN_EMAIL || "admin@kairo.com",
  orderConfirmationSubject: "Order Confirmed — KAIRO",
  shippingUpdateSubject: "Shipping Update — KAIRO",
  trackingSubject: "Your Package is on the Way — KAIRO",
};
