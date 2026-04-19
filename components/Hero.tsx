import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative bg-black overflow-hidden py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Text Content - Left */}
          <div className="flex items-center order-2 lg:order-1">
            <div className="space-y-6">
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 bg-white/10 text-primary text-xs font-medium rounded-full">
                  Nueva Colección 2026
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-[1.07] tracking-tight">
                  Cuidado exclusivo para tu <span className="text-primary">belleza natural</span>
                </h1>
                <p className="text-base md:text-lg text-gray-400 max-w-lg leading-relaxed">
                  Descubrí nuestra selección de productos premium para el cuidado de tu piel. Fórmulas suaves, ingredientes seleccionados.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-normal rounded-lg transition-all duration-200"
                >
                  Ver Productos
                </Link>
                <Link
                  href="/categories"
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-transparent border border-white/20 hover:border-white/40 text-white text-sm font-normal rounded-full transition-all duration-200"
                >
                  Explorar
                </Link>
              </div>
            </div>
          </div>

          {/* Image - Right half - full column */}
          <div className="flex items-center justify-center order-1 lg:order-2 h-full min-h-[400px]">
            <Image
              src="/hero.png"
              alt="Ushuaia belleza natural"
              width={600}
              height={600}
              className="object-contain w-full max-w-lg"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}