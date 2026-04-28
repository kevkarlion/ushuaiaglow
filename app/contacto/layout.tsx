import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contactanos',
  description: 'Contactános para consultas sobre skincare. WhatsApp: 2984210435. Email: info@ushuaiaglow.com. Estamos en General Roca, Río Negro.',
  keywords: ['contacto skincare', 'whatsapp belleza', 'consulta skincare'],
};

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return children;
}