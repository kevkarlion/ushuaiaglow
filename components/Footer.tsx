import Image from 'next/image';
import Link from 'next/link';
import { LucideMessageCircle as WhatsAppIcon, LucideMail as MailIcon, LucideMapPin as PinIcon } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: 'Productos', href: '/productos' },
      { name: 'Combos', href: '/combos' },
      { name: 'Categorías', href: '/categorias' },
    ],
    company: [
      { name: 'Nosotros', href: '/nosotros' },
      { name: 'Contacto', href: '/contacto' },
    ],
    legal: [
      { name: 'Políticas de Privacidad', href: '/privacidad' },
      { name: 'Términos y Condiciones', href: '/terminos' },
    ],
  };

  return (
    <footer className="bg-surface-darker text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand & Social */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image 
                src="/us-logo-final.png" 
                alt="Ushuaia" 
                width={192} 
                height={192} 
                className="w-40 h-40 object-contain"
              />
            </Link>
            <p className="text-sm text-white/60 mb-6">
              Cuidado exclusivo para tu belleza natural.
            </p>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/ushuaia_07?igsh=d2licTc0a25zbHB1" target="_blank" rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-primary rounded-lg transition-colors text-white">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="18" cy="6" r="1" fill="currentColor" />
                </svg>
              </a>
              <a href="https://wa.me/5492984210435" target="_blank" rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-primary rounded-lg transition-colors text-white flex items-center justify-center">
                <WhatsAppIcon className="w-4 h-4" />
              </a>
              <a href="mailto:info@ushuaiaglow.com" target="_blank" rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-primary rounded-lg transition-colors text-white flex items-center justify-center">
                <MailIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Tienda</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Empresa</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto directo */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Contactanos</h3>
            <div className="space-y-3">
              <a href="https://wa.me/5492984210435" className="flex items-center gap-2 text-sm text-white/60 hover:text-primary transition-colors">
                <WhatsAppIcon className="w-4 h-4" />
                <span>+54 9 2984-210435</span>
              </a>
              <a href="mailto:info@ushuaiaglow.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white/60 hover:text-primary transition-colors">
                <MailIcon className="w-4 h-4" />
                <span>info@ushuaiaglow.com</span>
              </a>
              <div className="flex items-start gap-2 text-sm text-white/60">
                <PinIcon className="w-4 h-4 mt-0.5" />
                <span>General Roca, Río Negro, Argentina</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40">
            {currentYear} Ushuaia. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <Link href="/privacidad" className="text-xs text-white/40 hover:text-white/60 transition-colors">
              Privacidad
            </Link>
            <Link href="/terminos" className="text-xs text-white/40 hover:text-white/60 transition-colors">
              Términos
            </Link>
          </div>
          <a href="https://devwebpatagonia.com" target="_blank" rel="noopener noreferrer" className="text-xs text-white/40 hover:text-white/60 transition-colors">
            Diseño y desarrollo DevWebPatagonia
          </a>
        </div>
      </div>
    </footer>
  );
}