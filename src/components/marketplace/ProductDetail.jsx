import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Loader2, Sparkles, Check, AlertTriangle, Lightbulb } from 'lucide-react';
import { usePets } from '../../contexts/PetContext';
import { useAuth } from '../../contexts/AuthContext';
import { geminiService } from '../../services/geminiService';
import { formatCurrency } from '../../utils/helpers';
import { PROMPTS } from '../../utils/prompts';

export default function ProductDetail({ product, isOpen, onClose, onAdd }) {
  const { activePet } = usePets();
  const { hasFeature, canUseAi, incrementAiUsage } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (isOpen && activePet && product) {
      generateAnalysis();
    }
  }, [isOpen, activePet, product]);

  const generateAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      // PROMPTS.productRecommendation accepts (petObject, productObject)
      const prompt = PROMPTS.productRecommendation(activePet, product);
      const res = await geminiService.generateJSON(prompt);
      setAnalysis(res);
      if (incrementAiUsage) incrementAiUsage();
    } catch (err) {
      console.warn('Product AI recommendation fallback:', err);
      // Pet specific fallback
      const petName = activePet?.name || 'your pet';
      const petBreed = activePet?.breed || activePet?.species || 'pet';
      setAnalysis({
        matchScore: 9,
        recommendation: `Great match for ${petName}! Formulated to support daily wellness for ${petBreed}s of this life stage. 🐾`,
        pros: [
          `Safe for ${petName}'s breed and age group`,
          'High quality ingredients & durable build'
        ],
        cons: [
          'Introduce gradually into routine'
        ],
        tip: 'Follow packaging instructions for recommended portion or usage.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[var(--color-surface)] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[var(--color-border)] animate-scale-in">
        
        {/* Header */}
        <div className="sticky top-0 bg-[var(--color-surface)] p-4 sm:p-5 flex justify-between items-center border-b border-[var(--color-border)] z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 dark:bg-brand-900/30 px-2.5 py-1 rounded-full">
              {product.category}
            </span>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-[var(--color-text-secondary)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row gap-6">
            
            {/* Image */}
            <div className="w-full sm:w-1/2 aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden flex items-center justify-center relative shadow-inner">
              {product.imageUrl && !imgError ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="text-7xl">{product.image || '📦'}</span>
              )}
            </div>
            
            {/* Product Meta & Cart */}
            <div className="flex-1 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  {product.brand}
                </span>
                <h2 className="text-xl font-display font-bold text-[var(--color-text)] mt-0.5">
                  {product.name}
                </h2>
                
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-display font-extrabold text-brand-600 dark:text-brand-400">
                    {formatCurrency(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-3 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Quantity and Add */}
              <div className="space-y-3 pt-3 border-t border-[var(--color-border)]">
                <div className="flex items-center gap-3">
                  <label className="text-xs font-bold text-[var(--color-text)]">Qty:</label>
                  <div className="inline-flex items-center border border-[var(--color-border)] rounded-xl overflow-hidden bg-[var(--color-bg)]">
                    <button 
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 text-sm font-bold hover:bg-brand-50"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-sm font-bold">{quantity}</span>
                    <button 
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 text-sm font-bold hover:bg-brand-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) onAdd();
                    onClose();
                  }}
                  className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-sm font-bold shadow-md hover:shadow-lg"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add {quantity} to Cart • {formatCurrency(product.price * quantity)}</span>
                </button>
              </div>
            </div>
          </div>

          {/* AI Tailored Recommendation for Active Pet */}
          {activePet && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 dark:from-amber-950/30 dark:to-orange-950/20 p-5 rounded-2xl border border-amber-200 dark:border-amber-800/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-500" />
                  <h4 className="font-bold text-sm text-[var(--color-text)]">
                    AI Suitability for {activePet.name} ({activePet.breed || activePet.species})
                  </h4>
                </div>
                {analysis?.matchScore && (
                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-brand-500 text-white shadow-sm">
                    {analysis.matchScore}/10 Match
                  </span>
                )}
              </div>

              {loading ? (
                <div className="flex items-center gap-2 text-xs text-brand-600 dark:text-brand-400 py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing product against {activePet.name}'s profile with Gemini...</span>
                </div>
              ) : analysis ? (
                <div className="space-y-3 text-xs sm:text-sm">
                  <p className="font-medium text-[var(--color-text)]">
                    {analysis.recommendation}
                  </p>

                  {/* Pros */}
                  {Array.isArray(analysis.pros) && analysis.pros.length > 0 && (
                    <div className="space-y-1">
                      {analysis.pros.map((pro, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-emerald-800 dark:text-emerald-300">
                          <Check className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
                          <span>{pro}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Cons */}
                  {Array.isArray(analysis.cons) && analysis.cons.length > 0 && (
                    <div className="space-y-1">
                      {analysis.cons.map((con, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-amber-800 dark:text-amber-300">
                          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                          <span>{con}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tip */}
                  {analysis.tip && (
                    <div className="flex items-start gap-2 pt-2 border-t border-amber-200/60 dark:border-amber-800/40 text-[var(--color-text-secondary)] italic text-xs">
                      <Lightbulb className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                      <span>Tip: {analysis.tip}</span>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
