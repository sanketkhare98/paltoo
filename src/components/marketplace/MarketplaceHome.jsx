import React, { useState, useMemo } from 'react';
import { Search, ShoppingCart, Sparkles, Filter } from 'lucide-react';
import { usePets } from '../../contexts/PetContext';
import { useCart } from '../../contexts/CartContext';
import { marketplaceProducts } from '../../data/marketplaceProducts';
import CategoryFilter from './CategoryFilter';
import ProductCard from './ProductCard';
import ProductDetail from './ProductDetail';
import Cart from './Cart';

export default function MarketplaceHome() {
  const { activePet } = usePets();
  const { 
    cart, 
    addToCart, 
    cartItemCount, 
    isCartOpen, 
    setIsCartOpen 
  } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = useMemo(() => {
    let products = [...(marketplaceProducts || [])];
    
    if (selectedCategory !== 'All') {
      products = products.filter((p) => p.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      products = products.filter(
        (p) => p.name?.toLowerCase().includes(query) || 
               p.brand?.toLowerCase().includes(query) ||
               p.description?.toLowerCase().includes(query)
      );
    }

    return products.sort((a, b) => {
      if (sortBy === 'price_asc') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price_desc') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0; // popular/default
    });
  }, [selectedCategory, searchQuery, sortBy]);

  const aiPicks = useMemo(() => {
    if (!activePet || !marketplaceProducts || marketplaceProducts.length === 0) return [];
    // Prioritize products matching pet species
    const speciesMatches = marketplaceProducts.filter(p => 
      !p.targetSpecies || p.targetSpecies.toLowerCase() === activePet.species?.toLowerCase()
    );
    return speciesMatches.slice(0, 4);
  }, [activePet]);

  const handleAddToCart = (product, quantity = 1) => {
    addToCart(product, quantity);
  };

  return (
    <div className="page-container p-4 md:p-6 pb-24 max-w-7xl mx-auto animate-fade-in">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-display font-black text-[var(--color-text)] flex items-center gap-2">
            <span>Pet Marketplace</span>
            <span>🛒</span>
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-0.5">
            Vet-approved foods, treats, grooming essentials & accessories
          </p>
        </div>

        {/* Cart Drawer Trigger */}
        <button 
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="relative p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm hover:shadow-md hover:border-brand-400 transition-all active:scale-95 flex items-center gap-2"
          aria-label="Open Shopping Cart"
        >
          <ShoppingCart className="w-5 h-5 text-brand-500" />
          <span className="hidden sm:inline font-bold text-xs text-[var(--color-text)]">Cart</span>
          {cartItemCount > 0 && (
            <span className="bg-gradient-to-r from-brand-500 to-orange-500 text-white text-[11px] font-black rounded-full px-2 py-0.5 min-w-[20px] text-center shadow-sm">
              {cartItemCount}
            </span>
          )}
        </button>
      </div>

      {/* Category Pills */}
      <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

      {/* Search & Sort Controls */}
      <div className="my-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search premium kibble, dental chews, toys, harness..."
            className="input-field pl-10 w-full text-sm rounded-2xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400 hidden sm:block" />
          <select 
            className="input-field md:w-52 text-sm rounded-2xl cursor-pointer"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="popular">Sort: Most Popular</option>
            <option value="rating">Sort: Top Rated ⭐</option>
            <option value="price_asc">Price: Low to High 🏷️</option>
            <option value="price_desc">Price: High to Low 🏷️</option>
          </select>
        </div>
      </div>

      {/* AI Recommendations Section */}
      {activePet && aiPicks.length > 0 && !searchQuery && selectedCategory === 'All' && (
        <div className="mb-10 p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-amber-50/70 via-orange-50/50 to-brand-50/30 dark:from-amber-950/20 dark:via-orange-950/10 dark:to-brand-950/20 border border-amber-200/70 dark:border-amber-800/40">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-display font-bold text-[var(--color-text)] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-500" />
              <span>AI Handpicked for {activePet.name} ({activePet.breed || activePet.species})</span>
            </h2>
            <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 bg-white/80 dark:bg-black/30 px-2.5 py-1 rounded-full">
              Personalized
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {aiPicks.map((product) => (
              <ProductCard 
                key={`ai-${product.id}`} 
                product={product} 
                onView={() => setSelectedProduct(product)}
                onAdd={() => handleAddToCart(product, 1)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main Catalog Grid */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-display font-bold text-[var(--color-text)]">
            {selectedCategory === 'All' ? 'All Products' : `${selectedCategory} Collection`}
          </h2>
          <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
            {filteredProducts.length} items found
          </span>
        </div>
        
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onView={() => setSelectedProduct(product)}
                onAdd={() => handleAddToCart(product, 1)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)]">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-base font-bold text-[var(--color-text)] mb-1">No products found</h3>
            <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mx-auto">
              We couldn't find matches for "{searchQuery}". Try searching for generic terms like "chew", "shampoo", or "leash".
            </p>
          </div>
        )}
      </div>

      {/* Cart Drawer Modal */}
      <Cart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)} 
      />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetail 
          product={selectedProduct} 
          isOpen={!!selectedProduct} 
          onClose={() => setSelectedProduct(null)}
          onAdd={(qty) => handleAddToCart(selectedProduct, qty || 1)}
        />
      )}

    </div>
  );
}
