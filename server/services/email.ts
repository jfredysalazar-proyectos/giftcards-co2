/**
 * Email Service for Giftcards.Co
 * 
 * This service handles sending email notifications for:
 * - Order confirmations
 * - Order status updates
 * - Gift card delivery
 * 
 * To use this service, you need to configure email credentials:
 * - SMTP_HOST: Your SMTP server host (e.g., smtp.gmail.com)
 * - SMTP_PORT: SMTP port (usually 587 for TLS)
 * - SMTP_USER: Your email address
 * - SMTP_PASS: Your email password or app-specific password
 * - FROM_EMAIL: The "from" email address for notifications
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

interface OrderEmailData {
  orderId: number;
  customerName: string;
  customerEmail: string;
  totalAmount: string;
  items: Array<{
    productName: string;
    amount: string;
    quantity: number;
    price: string;
  }>;
}

interface StatusUpdateEmailData {
  orderId: number;
  customerName: string;
  customerEmail: string;
  status: string;
  totalAmount: string;
}

/**
 * Send a generic email
 * Note: This is a placeholder implementation. In production, you should:
 * 1. Install nodemailer: pnpm add nodemailer @types/nodemailer
 * 2. Configure SMTP credentials in environment variables
 * 3. Implement actual email sending logic
 */
async function sendEmail(options: EmailOptions): Promise<boolean> {
  // Log email for development
  console.log("📧 Email would be sent:");
  console.log(`To: ${options.to}`);
  console.log(`Subject: ${options.subject}`);
  console.log(`Body: ${options.html.substring(0, 200)}...`);

  // In production, implement actual email sending:
  /*
  const nodemailer = require('nodemailer');
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
  */

  return true; // Simulate success
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<boolean> {
  const itemsHtml = data.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.productName}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.amount}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${parseFloat(item.price).toFixed(2)}</td>
        </tr>
      `
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmación de Pedido - Giftcards.Co</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #374151; background-color: #f9fafb; margin: 0; padding: 0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(to right, #9333ea, #06b6d4); padding: 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Giftcards.Co</h1>
          <p style="color: #ffffff; margin: 8px 0 0 0; opacity: 0.9;">Tu Centro de Tarjetas de Regalo Digitales</p>
        </div>

        <!-- Content -->
        <div style="padding: 32px;">
          <h2 style="color: #111827; margin: 0 0 16px 0; font-size: 24px;">¡Gracias por tu pedido!</h2>
          <p style="color: #6b7280; margin: 0 0 24px 0;">Hola ${data.customerName},</p>
          <p style="color: #6b7280; margin: 0 0 24px 0;">
            Hemos recibido tu pedido <strong>#${data.orderId}</strong> y lo estamos procesando. 
            Recibirás tus códigos de tarjetas de regalo por WhatsApp una vez que se complete el pago.
          </p>

          <!-- Order Summary -->
          <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
            <h3 style="color: #111827; margin: 0 0 16px 0; font-size: 18px;">Resumen del Pedido</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #e5e7eb;">
                  <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151;">Producto</th>
                  <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151;">Monto</th>
                  <th style="padding: 12px; text-align: center; font-weight: 600; color: #374151;">Cantidad</th>
                  <th style="padding: 12px; text-align: right; font-weight: 600; color: #374151;">Precio</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="padding: 16px 12px; text-align: right; font-weight: 600; color: #111827; font-size: 18px;">Total:</td>
                  <td style="padding: 16px 12px; text-align: right; font-weight: bold; color: #9333ea; font-size: 18px;">$${parseFloat(data.totalAmount).toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Next Steps -->
          <div style="background: linear-gradient(to right, #ede9fe, #cffafe); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h3 style="color: #111827; margin: 0 0 12px 0; font-size: 16px;">Próximos Pasos:</h3>
            <ol style="color: #374151; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Completa el pago a través de WhatsApp</li>
              <li style="margin-bottom: 8px;">Recibirás una confirmación de pago</li>
              <li style="margin-bottom: 8px;">Tus códigos de tarjetas de regalo serán enviados instantáneamente</li>
            </ol>
          </div>

          <!-- Support -->
          <p style="color: #6b7280; margin: 0 0 16px 0;">
            Si tienes alguna pregunta, no dudes en contactarnos por WhatsApp.
          </p>
          <p style="color: #6b7280; margin: 0;">
            Saludos,<br>
            <strong>El equipo de Giftcards.Co</strong>
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; margin: 0; font-size: 14px;">
            © 2025 Giftcards.Co. Todos los derechos reservados.
          </p>
          <p style="color: #9ca3af; margin: 8px 0 0 0; font-size: 12px;">
            Este es un correo automático, por favor no respondas a este mensaje.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: data.customerEmail,
    subject: `Confirmación de Pedido #${data.orderId} - Giftcards.Co`,
    html,
  });
}

/**
 * Send order status update email
 */
export async function sendOrderStatusUpdateEmail(data: StatusUpdateEmailData): Promise<boolean> {
  const statusMessages: Record<string, { title: string; message: string; color: string }> = {
    pending: {
      title: "Pedido Pendiente",
      message: "Tu pedido está pendiente de confirmación de pago.",
      color: "#f59e0b",
    },
    processing: {
      title: "Pedido en Proceso",
      message: "Estamos procesando tu pedido. Recibirás tus códigos pronto.",
      color: "#3b82f6",
    },
    completed: {
      title: "Pedido Completado",
      message: "¡Tu pedido ha sido completado! Tus códigos de tarjetas de regalo han sido enviados por WhatsApp.",
      color: "#10b981",
    },
    cancelled: {
      title: "Pedido Cancelado",
      message: "Tu pedido ha sido cancelado. Si tienes preguntas, contáctanos por WhatsApp.",
      color: "#ef4444",
    },
  };

  const statusInfo = statusMessages[data.status] || statusMessages.pending;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Actualización de Pedido - Giftcards.Co</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #374151; background-color: #f9fafb; margin: 0; padding: 0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(to right, #9333ea, #06b6d4); padding: 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Giftcards.Co</h1>
          <p style="color: #ffffff; margin: 8px 0 0 0; opacity: 0.9;">Tu Centro de Tarjetas de Regalo Digitales</p>
        </div>

        <!-- Content -->
        <div style="padding: 32px;">
          <h2 style="color: #111827; margin: 0 0 16px 0; font-size: 24px;">Actualización de Pedido #${data.orderId}</h2>
          <p style="color: #6b7280; margin: 0 0 24px 0;">Hola ${data.customerName},</p>

          <!-- Status Badge -->
          <div style="background-color: ${statusInfo.color}; color: #ffffff; padding: 16px 24px; border-radius: 8px; text-align: center; margin-bottom: 24px;">
            <h3 style="margin: 0; font-size: 20px; font-weight: bold;">${statusInfo.title}</h3>
          </div>

          <p style="color: #374151; margin: 0 0 24px 0; font-size: 16px;">
            ${statusInfo.message}
          </p>

          <!-- Order Details -->
          <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <p style="color: #6b7280; margin: 0 0 8px 0;"><strong>Número de Pedido:</strong> #${data.orderId}</p>
            <p style="color: #6b7280; margin: 0 0 8px 0;"><strong>Estado:</strong> ${statusInfo.title}</p>
            <p style="color: #6b7280; margin: 0;"><strong>Total:</strong> $${parseFloat(data.totalAmount).toFixed(2)}</p>
          </div>

          <!-- Support -->
          <p style="color: #6b7280; margin: 0 0 16px 0;">
            Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos por WhatsApp.
          </p>
          <p style="color: #6b7280; margin: 0;">
            Saludos,<br>
            <strong>El equipo de Giftcards.Co</strong>
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; margin: 0; font-size: 14px;">
            © 2025 Giftcards.Co. Todos los derechos reservados.
          </p>
          <p style="color: #9ca3af; margin: 8px 0 0 0; font-size: 12px;">
            Este es un correo automático, por favor no respondas a este mensaje.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: data.customerEmail,
    subject: `Actualización de Pedido #${data.orderId} - ${statusInfo.title}`,
    html,
  });
}
