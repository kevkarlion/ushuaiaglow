import { NextResponse } from 'next/server';
import { getTransporter } from '@/lib/email';

// GET - Check SMTP config
export async function GET() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS ? '*** configurado ***' : 'NO CONFIGURADO';
  const smtpFrom = process.env.SMTP_FROM;

  return NextResponse.json({
    smtpHost,
    smtpPort,
    smtpUser,
    smtpPass,
    smtpFrom,
    baseUrl: process.env.NEXT_PUBLIC_URL,
  });
}

// POST - Send test email con má详细信息
export async function POST(request: Request) {
  let transporter;
  try {
    transporter = await getTransporter();
  } catch (err) {
    return NextResponse.json({ error: 'Transporter error: ' + String(err) }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { email } = body as { email?: string };
    const testEmail = email || 'info@ushuaiaglow.com';
    const smtpFrom = process.env.SMTP_FROM || 'Ushuaia <info@ushuaiaglow.com>';

    const result = await transporter.sendMail({
      from: smtpFrom,
      to: testEmail,
      subject: 'Test Email Ushuaia - ' + Date.now(),
      text: 'Test email exitosa',
      html: '<p>Test email exitosa</p>',
    });

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      accepted: result.accepted,
      rejected: result.rejected,
      envelope: result.envelope,
      testEmail: testEmail,
    });
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}