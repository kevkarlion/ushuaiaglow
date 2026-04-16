import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: 'Todos los productos', href: '/products' },
      { name: 'Categorías', href: '/categories' },
      { name: 'Ofertas', href: '/offers' },
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
    { name: 'Twitter', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
    { name: 'Facebook', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.383H7.078v-3.471h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.383C19.612 23.027 24 18.062 24 12.073z' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand & Social */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold text-white">Ushuaia</span>
            </Link>
            <p className="text-sm text-gray-400 mb-6">
              Productos premium para tu estilo de vida.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Tienda</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Empresa</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Ayuda</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © {currentYear} Ushuaia. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
              Privacidad
            </Link>
            <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}