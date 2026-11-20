import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { formatCurrency, truncateText } from '../../utils/helpers';

export default function ProductCard({ product, onView, onAdd }) {
  const [imgError, setImgError] = useState(false);

  const renderStars = (rating) => {
    const rounded = Math.round(rating || 4.5);
    return '★'.repeat(rounded) + '☆'.repeat(5 - rounded);
  };

  return (
    <div 
      className="glass-card card-hover flex flex-col p-3.5 rounded-3xl cursor-pointer border border-[var(--color-border)] shadow-sm hover:border-brand-300 transition-all duration-300 group"
      onClick={onView}
    >
      {/* Product Image */}
      <div className="aspect-square bg-gray-100 dark:bg-gray-800/60 rounded-2xl overflow-hidden flex items-center justify-center relative mb-3">
        {product.imageUrl && !imgError ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="text-5xl">{product.image || '📦'}</div>
        )}

        {product.originalPrice && product.originalPrice > product.price && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-brand-500 to-orange-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md">
            SALE
          </div>
        )}
      </div>
      
      {/* Details */}
      <div className="flex-1 flex flex-col">
        <span className="text-[11px] text-[var(--color-text-secondary)] font-bold uppercase tracking-wider mb-0.5">
          {product.brand}
        </span>

        <h3 className="font-bold text-[var(--color-text)] text-sm mb-1 line-clamp-2 leading-snug">
          {truncateText(product.name, 48)}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2.5">
          <span className="text-amber-400 text-xs tracking-tighter">
            {renderStars(product.rating)}
          </span>
          <span className="text-[11px] text-[var(--color-text-secondary)] font-medium">
            ({product.reviews || product.reviewCount || 120})
          </span>
        </div>
        
        {/* Price & Add to cart */}
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-[var(--color-border)]/50">
          <div>
            <div className="font-display font-extrabold text-base text-brand-600 dark:text-brand-400">
              {formatCurrency(product.price)}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="text-[11px] text-gray-400 line-through">
                {formatCurrency(product.originalPrice)}
              </div>
            )}
          </div>
          
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
            className="p-2.5 bg-brand-50 hover:bg-brand-500 text-brand-600 hover:text-white dark:bg-brand-900/30 dark:hover:bg-brand-500 dark:text-brand-300 rounded-xl transition-all duration-300 shadow-sm active:scale-95"
            title="Add to Cart"
            aria-label="Add to Cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
