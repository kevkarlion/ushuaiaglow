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
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.012-3.584.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
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