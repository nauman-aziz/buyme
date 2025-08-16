import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export { resend };

export const EMAIL_TEMPLATES = {
  ORDER_CONFIRMATION: 'order-confirmation',
  ORDER_STATUS_UPDATE: 'order-status-update',
  ADMIN_NEW_ORDER: 'admin-new-order',
} as const;

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    variant: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    fullName: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  return resend.emails.send({
    from: `${process.env.STORE_NAME} <${process.env.STORE_SUPPORT_EMAIL}>`,
    to: data.customerEmail,
    subject: `Order Confirmation - ${data.orderNumber}`,
    html: generateOrderConfirmationHtml(data),
  });
}

export async function sendAdminNewOrderEmail(data: OrderEmailData) {
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  
  return resend.emails.send({
    from: `${process.env.STORE_NAME} <${process.env.STORE_SUPPORT_EMAIL}>`,
    to: adminEmails,
    subject: `New Order Received - ${data.orderNumber}`,
    html: generateAdminOrderHtml(data),
  });
}

function generateOrderConfirmationHtml(data: OrderEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }
        .header { background: #f8f9fa; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .order-items { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .order-items th, .order-items td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .order-items th { background-color: #f2f2f2; }
        .totals { text-align: right; margin-top: 20px; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${process.env.STORE_NAME}</h1>
        <h2>Order Confirmation</h2>
      </div>
      
      <div class="content">
        <p>Hi ${data.customerName},</p>
        <p>Thank you for your order! Your order <strong>${data.orderNumber}</strong> has been received and is being processed.</p>
        
        <h3>Order Details</h3>
        <table class="order-items">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            ${data.items.map(item => `
              <tr>
                <td>${item.name} - ${item.variant}</td>
                <td>${item.quantity}</td>
                <td>$${(item.price / 100).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="totals">
          <p>Subtotal: $${(data.subtotal / 100).toFixed(2)}</p>
          <p>Shipping: $${(data.shipping / 100).toFixed(2)}</p>
          <p>Tax: $${(data.tax / 100).toFixed(2)}</p>
          <p><strong>Total: $${(data.total / 100).toFixed(2)}</strong></p>
        </div>
        
        <h3>Shipping Address</h3>
        <p>
          ${data.shippingAddress.fullName}<br>
          ${data.shippingAddress.line1}<br>
          ${data.shippingAddress.line2 ? data.shippingAddress.line2 + '<br>' : ''}
          ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.postalCode}<br>
          ${data.shippingAddress.country}
        </p>
        
        <p>We'll send you updates as your order progresses. If you have any questions, please contact us at ${process.env.STORE_SUPPORT_EMAIL}.</p>
      </div>
      
      <div class="footer">
        <p>© 2024 ${process.env.STORE_NAME}. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
}

function generateAdminOrderHtml(data: OrderEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Order - ${data.orderNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }
        .header { background: #1f2937; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .order-items { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .order-items th, .order-items td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .order-items th { background-color: #f2f2f2; }
        .totals { text-align: right; margin-top: 20px; }
        .alert { background: #fef3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 4px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 New Order Received!</h1>
        <h2>Order ${data.orderNumber}</h2>
      </div>
      
      <div class="content">
        <div class="alert">
          <strong>Action Required:</strong> Please review and process this order in the admin dashboard.
        </div>
        
        <h3>Customer Information</h3>
        <p><strong>Name:</strong> ${data.customerName}</p>
        <p><strong>Email:</strong> ${data.customerEmail}</p>
        
        <h3>Order Items</h3>
        <table class="order-items">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            ${data.items.map(item => `
              <tr>
                <td>${item.name} - ${item.variant}</td>
                <td>${item.quantity}</td>
                <td>$${(item.price / 100).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="totals">
          <p><strong>Total: $${(data.total / 100).toFixed(2)}</strong></p>
        </div>
        
        <p><a href="${process.env.NEXTAUTH_URL}/admin/orders/${data.orderNumber}" style="background: #1f2937; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View Order in Admin</a></p>
      </div>
    </body>
    </html>
  `;
}