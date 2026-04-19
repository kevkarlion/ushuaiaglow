import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: 'Todos los productos', href: '/products' },
      { name: 'Cuidado Facial', href: '/categories/facial' },
      { name: 'Cuidado Corporal', href: '/categories/body' },
      { name: 'Novedades', href: '/new' },
    ],
    company: [
      { name: 'Sobre nosotros', href: '/about' },
      { name: 'Contacto', href: '/contact' },
      { name: 'Trabaja con nosotros', href: '/careers' },
    ],
    support: [
      { name: 'Ayuda', href: '/help' },
      { name: 'Envíos', href: '/shipping' },
      { name: 'Devoluciones', href: '/returns' },
      { name: 'FAQ', href: '/faq' },
    ],
  };

  const socialLinks = [
    { name: 'Instagram', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.69 4.919 5.342.024.91.069 2.058.069 3.127 0 .998.012 2.167.012 3.127 0 3.652-.667 5.194-4.919 5.342-1.265.058-2.646.07-4.85.07-.999 0-2.167-.012-3.127-.012-1.265 0-2.646-.058-4.85-.07-3.652-.148-4.771-1.69-4.919-5.342-.024-.91-.069-2.058-.069-3.127 0-.998.012-2.167.012-3.127 0-3.652.667-5.194 4.919-5.342 1.265-.058 2.646-.07 4.85-.07zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.14 2.335.044 5.046.014 6.555.014 7.175 0 8.333c0 1.158.014 2.778.044 4.987.096 2.711 2.651 4.774 5.01 4.974 1.28.058 2.646.07 4.85.07 1.158 0 2.778-.012 4.987-.044 2.711-.096 4.774-2.65 4.974-5.01.058-1.28.07-2.646.07-4.85 0-1.158-.012-2.778-.044-4.987-.096-2.711-2.65-4.774-5.01-4.974-1.28-.058-2.646-.07-4.85-.07zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
    { name: 'TikTok', icon: 'M12.525.00c-6.79 0-6.944.002-9.359.078-5.702.187-7.664 3.327-7.851 7.111-.043.81-.048 1.622-.048 2.433 0 6.801.047 6.941.096 9.387.196 3.454 2.906 5.843 7.142 6.031 2.348.089 4.659.091 7.022.089 2.363 0 4.674-.089 7.022-.091 4.234-.188 5.935-2.562 6.129-6.111.05-3.448.095-6.587.095-9.387 0-6.801-.047-6.941-.096-9.387-.187-3.454-2.888-6.843-7.142-6.03-2.348-.089-4.659-.091-7.021-.091zM9.602 16.641V8.989c0-.553.448-.999 1.001-.999h2.794c.552 0 1 .447.999 1v7.652c-.428.267-1.143.439-2.001.439-.928 0-1.793-.232-2.793-.469zm7.797-7.652c-.553 0-1 .447-1 1v8.89c0 .553.447 1 1 1h1.502c.553 0 1-.447 1-1v-2.62c.553 1.035 1.503 1.62 2.503 1.62 2.215 0 3.996-1.793 3.996-4.001 0-2.205-1.782-4-3.996-4-1.001 0-1.951.585-2.504 1.62v-2.511c0-.553-.447-1-1-1h-1.502z' },
  ];

  return (
    <footer className="bg-surface-darker text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand & Social */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image 
                src="/us-logo.png" 
                alt="Ushuaia" 
                width={192} 
                height={192} 
                className="w-48 h-48 object-contain"
              />
            </Link>
            <p className="text-sm text-white/60 mb-6">
              Cuidado exclusivo para tu belleza natural.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href="#"
                  className="text-white/60 hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
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

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Ayuda</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40">
            {currentYear} Ushuaia. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-white/40 hover:text-white/60 transition-colors">
              Privacidad
            </Link>
            <Link href="/terms" className="text-xs text-white/40 hover:text-white/60 transition-colors">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}