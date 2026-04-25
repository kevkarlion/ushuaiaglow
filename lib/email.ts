import nodemailer, { Transporter } from 'nodemailer';
import { MongoClient, ObjectId } from 'mongodb';

// Singleton transporter
let transporter: Transporter | null = null;

export async function getTransporter(): Promise<Transporter> {
  if (transporter) return transporter;

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || '587');
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || 'Ushuaia <noreply@ushuaiaglow.com>';

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.error('❌ SMTP no configurado');
    throw new Error('SMTP no configurado');
  }

  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  // Verify connection
  try {
    await transporter.verify();
    console.log('✅ SMTP conectado');
  } catch (error) {
    console.error('❌ Error al conectar SMTP:', error);
    throw error;
  }

  return transporter;
}

// ===== Email Types =====
type EmailType = 'payment_success' | 'payment_pending' | 'payment_failed';

interface EmailData {
  buyerEmail: string;
  buyerName: string;
  orderId: string;
  total: number;
  items: Array<{
    title: string;
    quantity: number;
    price: number;
  }>;
  paymentMethod?: string;
  paymentId?: string;
}

// ===== Email Templates =====
function getEmailTemplate(type: EmailType, data: EmailData): { subject: string; html: string; text: string } {
  const itemsList = data.items
    .map((item) => `• ${item.title} x${item.quantity} - $${item.price.toLocaleString('es-AR')}`)
    .join('\n');

  const itemsListHtml = data.items
    .map((item) => `<tr><td>${item.title} x${item.quantity}</td><td>$${item.price.toLocaleString('es-AR')}</td></tr>`)
    .join('');

  const templates = {
    payment_success: {
      subject: '✅ ¡Tu compra fue confirmada! - Ushuaia',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Compra Confirmada</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background-color:#ffffff;">
    <!-- Header -->
    <div style="background-color:#000000;padding:30px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:24px;">Ushuaia</h1>
      <p style="color:#888888;margin:5px 0 0;font-size:14px;">Cuidado exclusivo para tu belleza natural</p>
    </div>
    
    <!-- Success Banner -->
    <div style="background-color:#22c55e;padding:20px;text-align:center;">
      <h2 style="color:#ffffff;margin:0;font-size:20px;">¡Tu compra está confirmada!</h2>
    </div>
    
    <!-- Content -->
    <div style="padding:30px;">
      <p style="color:#333333;font-size:16px;margin:0 0 20px;">Hola <strong>${data.buyerName}</strong>,</p>
      <p style="color:#666666;font-size:14px;margin:0 0 20px;">Gracias por tu compra. Tu pedido ha sido confirmado y está siendo preparado.</p>
      
      <!-- Order Info -->
      <div style="background-color:#f9f9f9;border-radius:8px;padding:20px;margin:20px 0;">
        <h3 style="color:#333333;margin:0 0 15px;font-size:16px;">Detalles del pedido</h3>
        <p style="color:#666666;font-size:14px;margin:0;"><strong>N° de pedido:</strong> ${data.orderId}</p>
        <p style="color:#666666;font-size:14px;margin:5px 0;"><strong>Total:</strong> $${data.total.toLocaleString('es-AR')}</p>
      </div>
      
      <!-- Items -->
      <table style="width:100%;border-collapse:collapse;margin:20px 0;">
        <thead>
          <tr style="background-color:#f5f5f5;">
            <th style="text-align:left;padding:10px;color:#333333;font-size:14px;">Producto</th>
            <th style="text-align:right;padding:10px;color:#333333;font-size:14px;">Importe</th>
          </tr>
        </thead>
        <tbody>
          ${itemsListHtml}
        </tbody>
        <tfoot>
          <tr style="border-top:2px solid #000000;">
            <td style="padding:10px;color:#333333;font-size:14px;font-weight:bold;">Total</td>
            <td style="text-align:right;padding:10px;color:#333333;font-size:14px;font-weight:bold;">$${data.total.toLocaleString('es-AR')}</td>
          </tr>
        </tfoot>
      </table>
      
      <!-- Timeline -->
      <div style="margin-top:30px;padding:20px;background-color:#f9f9f9;border-radius:8px;">
        <h3 style="color:#333333;margin:0 0 15px;font-size:16px;">¿Qué sigue?</h3>
        <ul style="color:#666666;font-size:14px;margin:0;padding-left:20px;">
          <li style="margin-bottom:10px;">Estamos preparando tu pedido (24-48hs hábiles)</li>
          <li style="margin-bottom:10px;">Te enviaremos el código de seguimiento cuando esté enviado</li>
          <li> Cualquier consulta, escribinos a info@ushuaiaglow.com</li>
        </ul>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="background-color:#f5f5f5;padding:20px;text-align:center;">
      <p style="color:#999999;font-size:12px;margin:0;">© ${new Date().getFullYear()} Ushuaia. General Roca, Río Negro, Argentina.</p>
      <p style="color:#999999;font-size:12px;margin:5px 0 0;">
        <a href="https://ushuaiaglow.com" style="color:#666666;text-decoration:none;">ushuaiaglow.com</a>
      </p>
    </div>
  </div>
</body>
</html>`,
      text: `
¡Tu compra fue confirmada!

Hola ${data.buyerName},

Gracias por tu compra. Tu pedido ha sido confirmado.

N° de pedido: ${data.orderId}
Total: $${data.total.toLocaleString('es-AR')}

Productos:
${itemsList}

¿Qué sigue?
- Estamos preparando tu pedido (24-48hs hábiles)
- Te enviaremos el código de seguimiento cuando esté enviado
- Cualquier consulta, escribinos a info@ushuaiaglow.com

© ${new Date().getFullYear()} Ushuaia
`,
    },

    payment_pending: {
      subject: '⏳ Tu pago está siendo procesado - Ushuaia',
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Pago en proceso</title></head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background-color:#ffffff;">
    <div style="background-color:#000000;padding:30px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:24px;">Ushuaia</h1>
    </div>
    <div style="background-color:#f59e0b;padding:20px;text-align:center;">
      <h2 style="color:#ffffff;margin:0;font-size:20px;">Pago en proceso</h2>
    </div>
    <div style="padding:30px;">
      <p style="color:#333333;font-size:16px;">Hola <strong>${data.buyerName}</strong>,</p>
      <p style="color:#666666;font-size:14px;">Tu pago está siendo procesado. Te notificaremos cuando se apruebe.</p>
      <div style="background-color:#f9f9f9;border-radius:8px;padding:20px;margin:20px 0;">
        <p><strong>N° de pedido:</strong> ${data.orderId}</p>
        <p><strong>Total:</strong> $${data.total.toLocaleString('es-AR')}</p>
      </div>
    </div>
    <div style="background-color:#f5f5f5;padding:20px;text-align:center;">
      <p style="color:#999999;font-size:12px;margin:0;">© ${new Date().getFullYear()} Ushuaia</p>
    </div>
  </div>
</body>
</html>`,
      text: `Pago en proceso - ${data.orderId}`,
    },

    payment_failed: {
      subject: '❌ Tu pago no fue aprobado - Ushuaia',
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Pago rechazado</title></head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background-color:#ffffff;">
    <div style="background-color:#000000;padding:30px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:24px;">Ushuaia</h1>
    </div>
    <div style="background-color:#ef4444;padding:20px;text-align:center;">
      <h2 style="color:#ffffff;margin:0;font-size:20px;">Pago no aprobado</h2>
    </div>
    <div style="padding:30px;">
      <p style="color:#333333;font-size:16px;">Hola <strong>${data.buyerName}</strong>,</p>
      <p style="color:#666666;font-size:14px;">Tu pago no fue aprobado. Podés intentar nuevamente.</p>
      <div style="background-color:#f9f9f9;border-radius:8px;padding:20px;margin:20px 0;">
        <p><strong>N° de pedido:</strong> ${data.orderId}</p>
      </div>
      <p style="color:#666666;font-size:14px;">¿Necesitás ayuda? Escribinos a info@ushuaiaglow.com</p>
    </div>
    <div style="background-color:#f5f5f5;padding:20px;text-align:center;">
      <p style="color:#999999;font-size:12px;margin:0;">© ${new Date().getFullYear()} Ushuaia</p>
    </div>
  </div>
</body>
</html>`,
      text: `Pago no aprobado - ${data.orderId}`,
    },
  };

  return templates[type];
}

// ===== Send Email =====
export async function sendEmail(type: EmailType, data: EmailData): Promise<boolean> {
  let transporter: Transporter;
  try {
    transporter = await getTransporter();
  } catch (err) {
    console.error('❌ Error getTransporter:', err);
    return false;
  }
  
  const { subject, html, text } = getEmailTemplate(type, data);
  const smtpFrom = process.env.SMTP_FROM || 'Ushuaia <noreply@ushuaiaglow.com>';

  console.log('📧 Intentando enviar email:', { to: data.buyerEmail, from: smtpFrom, subject });

  try {
    const result = await transporter.sendMail({
      from: smtpFrom,
      to: data.buyerEmail,
      subject,
      text,
      html,
    });

    console.log('📧 Email sendMail result:', {
      messageId: result.messageId,
      envelope: result.envelope,
      accepted: result.accepted,
      rejected: result.rejected,
    });

    // Verificar que realmente fue aceptado
    if (!result.accepted || result.accepted.length === 0) {
      console.error('❌ Email no aceptado:', result.rejected);
      return false;
    }

    return true;
  } catch (error) {
    console.error('❌ Error sendMail:', error);
    return false;
  }
}

// ===== Health Check =====
export async function checkEmailConfig(): Promise<{ configured: boolean; error?: string }> {
  try {
    await getTransporter();
    return { configured: true };
  } catch (error) {
    return { configured: false, error: String(error) };
  }
}