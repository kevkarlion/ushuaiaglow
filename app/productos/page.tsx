'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/product';
import { trackViewItemList, buildGA4Item } from '@/lib/ga4-ecommerce';
import { Search, Grid3X3, LayoutGrid, X, SlidersHorizontal } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [gridCols, setGridCols] = useState(2); // 2 = mobile, 3 = desktop

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        
        if (!res.ok) {
          setProducts([]);
          setLoading(false);
          return;
        }
        
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
        
        if (Array.isArray(data) && data.length > 0) {
          trackViewItemList({
            item_list_id: 'products_all',
            item_list_name: 'Todos los productos',
            items: data.map((p: Product, idx: number) => 
              buildGA4Item(p.id, p.title, p.price, 1, p.category, p.brand)
            )
          });
        }
      } catch (error) {
        setProducts([]);
      } finally {
        setLoading(false);
        setHasLoaded(true);
      }
    }
    fetchProducts();
  }, []);

  // Extraer categorías únicas de los productos, normalizadas
  const rawCategories = products.map(p => p.category).filter((c): c is string => !!c);
  const normalizedCategories = rawCategories.map(c => {
    const lower = c.toLowerCase();
    if (lower === 'combo' || lower === 'combos') return 'Combos';
    if (lower === 'cuidado facial') return 'Cuidado Facial';
    if (lower === 'accesorios') return 'Accesorios';
    return c.charAt(0).toUpperCase() + c.slice(1).toLowerCase();
  });
  const uniqueCategories = [...new Set(normalizedCategories)];
  // Solo mostrar categorías válidas
  const validCategories = ['Combos', 'Cuidado Facial', 'Accesorios'].filter(c => uniqueCategories.includes(c));
  const categories = ['all', ...validCategories];

  // Filtrar productos
  const filteredProducts = products.filter(p => {
    // Filtro por categoría
    const categoryMatch = selectedCategory === 'all' 
      ? true 
      : selectedCategory === 'Combos' 
        ? p.isCombo === true
        : p.category?.toLowerCase() === selectedCategory.toLowerCase();
    
    // Filtro por búsqueda
    const searchMatch = !searchQuery || 
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatch && searchMatch;
  });

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.08 } }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border-b border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-[#222222] leading-[1.1] tracking-tight">
                Productos
              </h1>
              {hasLoaded ? (
                <p className="text-[#222222]/40 text-sm mt-1">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'} disponibles
                </p>
              ) : (
                <div className="h-5 w-32 bg-black/5 rounded animate-pulse mt-1" />
              )}
            </div>

            {/* Search bar */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#222222]/40" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-black/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#222222] placeholder-[#222222]/40 focus:outline-none focus:border-primary/50 transition-colors duration-300 ease-premium"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#222222]/40 hover:text-[#222222]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block lg:w-56 flex-shrink-0">
            {loading ? (
              <div className="sticky top-24 space-y-6 animate-pulse">
                <div>
                  <div className="h-3 w-20 bg-black/5 rounded mb-3"></div>
                  <div className="space-y-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-8 bg-black/5 rounded-lg"></div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="sticky top-24 space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="text-xs font-semibold text-[#222222]/60 uppercase tracking-wider mb-3">Categorías</h3>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`block w-full text-left px-3 py-2 text-sm rounded-xl transition-all duration-300 ease-premium ${
                          selectedCategory === category
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-[#222222]/60 hover:text-[#222222] hover:bg-black/5'
                        }`}
                      >
                        {category === 'all' ? 'Todos' : category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile: Category Pills + Filter Button */}
            <div className="lg:hidden mb-4">
              <div className="flex items-center gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                {loading ? (
                  <>
                    <div className="flex-shrink-0 w-20 h-9 bg-black/5 rounded-full animate-pulse"></div>
                    <div className="flex-shrink-0 w-16 h-9 bg-black/5 rounded-full animate-pulse"></div>
                    <div className="flex-shrink-0 w-20 h-9 bg-black/5 rounded-full animate-pulse"></div>
                    <div className="flex-shrink-0 w-20 h-9 bg-black/5 rounded-full animate-pulse"></div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setShowMobileFilters(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-black/[0.06] rounded-full text-sm text-[#222222]/80 whitespace-nowrap"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                      Filtros
                    </button>
                    
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                          selectedCategory === category
                            ? 'bg-primary text-black font-medium'
                            : 'bg-white text-[#222222]/60 border border-black/[0.06]'
                        }`}
                      >
                        {category === 'all' ? 'Todos' : category}
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Grid toggle (desktop) */}
            <div className="hidden lg:flex items-center justify-between mb-4">
              {hasLoaded ? (
                <span className="text-sm text-[#222222]/40">
                  {filteredProducts.length} productos
                </span>
              ) : (
                <div className="h-4 w-20 bg-black/5 rounded animate-pulse" />
              )}
              <div className="flex items-center gap-1 bg-white rounded-xl p-1">
                <button
                  onClick={() => setGridCols(2)}
                  className={`p-2 rounded-lg ${gridCols === 2 ? 'bg-black/10 text-[#222222]' : 'text-[#222222]/40'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setGridCols(3)}
                  className={`p-2 rounded-lg ${gridCols === 3 ? 'bg-black/10 text-[#222222]' : 'text-[#222222]/40'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className={`grid gap-6 ${
                gridCols === 2 
                  ? 'grid-cols-2 md:grid-cols-3' 
                  : 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
              }`}>
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white/50 rounded-2xl overflow-hidden animate-pulse">
                    <div className="aspect-square bg-black/5"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-3 bg-black/5 rounded w-1/3"></div>
                      <div className="h-4 bg-black/5 rounded w-2/3"></div>
                      <div className="h-5 bg-black/5 rounded w-1/3"></div>
                      <div className="h-10 bg-black/5 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className={`grid gap-6 ${
                gridCols === 2 
                  ? 'grid-cols-2 md:grid-cols-3' 
                  : 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
              }`}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-[#222222]/20" />
                </div>
                <p className="text-[#222222]/40 mb-2">No se encontraron productos</p>
                <p className="text-[#222222]/20 text-sm">
                  {searchQuery ? `No hay resultados para "${searchQuery}"` : 'No hay productos en esta categoría'}
                </p>
                {(searchQuery || selectedCategory !== 'all') && (
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="mt-4 text-primary hover:text-primary/80 text-sm transition-all duration-300 ease-premium"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setShowMobileFilters(false)} />
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} className="absolute bottom-0 left-0 right-0 bg-surface-darker rounded-t-3xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-surface-darker border-b border-white/[0.06] p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Filtros</h2>
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="p-2 text-white/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">Categorías</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setShowMobileFilters(false);
                      }}
                      className={`px-4 py-2 rounded-full text-sm transition-all ${
                        selectedCategory === category
                          ? 'bg-primary text-black font-medium'
                          : 'bg-white/[0.04] text-white/60 border border-white/[0.06]'
                      }`}
                    >
                      {category === 'all' ? 'Todos' : category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
