import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, CheckCircle2, Package, CreditCard } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import { useCart } from '../../contexts/CartContext';
import { useNotifications } from '../../contexts/NotificationContext';

export default function Cart({ isOpen, onClose }) {
  const { cart, removeFromCart, updateQuantity, clearCart, cartSubtotal } = useCart();
  const { showToast } = useNotifications();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [address, setAddress] = useState('Flat 402, Sunshine Heights, Mumbai 400050');
  const [paymentMethod, setPaymentMethod] = useState('upi');

  if (!isOpen) return null;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setOrderComplete(true);
    clearCart();
    showToast('Order placed successfully! 🎉', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[var(--color-surface)] h-full shadow-2xl flex flex-col border-l border-[var(--color-border)] animate-slide-left">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-surface)]">
          <h2 className="text-xl font-display font-bold flex items-center gap-2 text-[var(--color-text)]">
            <ShoppingBag className="w-5 h-5 text-brand-500" /> 
            <span>Your Pet Cart</span>
            {cart.length > 0 && (
              <span className="text-xs bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 font-bold px-2 py-0.5 rounded-full">
                {cart.length}
              </span>
            )}
          </h2>
          <button 
            type="button"
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-[var(--color-text-secondary)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {orderComplete ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 p-4">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-display font-bold text-[var(--color-text)]">
                Order Confirmed! 🐾
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] max-w-xs leading-relaxed">
                Thank you! Your furry friend's goodies have been ordered. Estimated delivery in 2-3 business days.
              </p>
              <div className="p-3 bg-brand-50/50 dark:bg-brand-900/20 rounded-2xl border border-brand-200 text-xs font-medium text-brand-700 dark:text-brand-300">
                Order ID: #PLT-{Math.floor(100000 + Math.random() * 900000)}
              </div>
              <button 
                type="button"
                onClick={() => {
                  setOrderComplete(false);
                  setIsCheckingOut(false);
                  onClose();
                }}
                className="btn-primary py-2.5 px-6 rounded-xl text-sm font-bold mt-4"
              >
                Continue Browsing
              </button>
            </div>
          ) : isCheckingOut ? (
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-[var(--color-text)]">Checkout Details</h3>
                <button 
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="text-xs text-brand-600 font-bold hover:underline"
                >
                  ← Back to Cart
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">
                  Delivery Address
                </label>
                <textarea 
                  rows={3}
                  className="input-field text-xs sm:text-sm" 
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">
                  Payment Method
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'upi', label: 'UPI / Google Pay / PhonePe' },
                    { id: 'card', label: 'Credit / Debit Card' },
                    { id: 'cod', label: 'Cash on Delivery' },
                  ].map(method => (
                    <label 
                      key={method.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === method.id 
                          ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 font-bold' 
                          : 'border-[var(--color-border)] text-[var(--color-text)]'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="payment" 
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                        className="text-brand-500"
                      />
                      <span className="text-xs sm:text-sm">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--color-border)] space-y-2 text-xs">
                <div className="flex justify-between text-[var(--color-text-secondary)]">
                  <span>Items total</span>
                  <span>{formatCurrency(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-[var(--color-text-secondary)]">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[var(--color-text)] pt-1">
                  <span>Total Amount</span>
                  <span className="text-brand-600 dark:text-brand-400 font-display font-extrabold">{formatCurrency(cartSubtotal)}</span>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full btn-primary py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 mt-4"
              >
                <span>Confirm & Place Order</span>
                <ArrowRight size={16} />
              </button>
            </form>
          ) : cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-[var(--color-text-secondary)] space-y-4 py-16">
              <div className="w-16 h-16 rounded-full bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-3xl">
                🛒
              </div>
              <p className="text-base font-bold text-[var(--color-text)]">Your cart is currently empty</p>
              <p className="text-xs max-w-xs text-center">Add toys, nutrition treats, or grooming accessories from the marketplace!</p>
              <button 
                type="button"
                onClick={onClose} 
                className="btn-secondary py-2 px-5 text-xs font-bold rounded-xl"
              >
                Browse Products
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div 
                key={item.id} 
                className="flex gap-3.5 p-3 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm hover:border-brand-200 transition-all"
              >
                {/* Product Photo */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 border border-black/5">
                  {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl">{item.image || '📦'}</span>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <div className="truncate">
                      <h4 className="font-bold text-xs sm:text-sm text-[var(--color-text)] truncate">{item.name}</h4>
                      <p className="text-[11px] text-[var(--color-text-secondary)]">{formatCurrency(item.price)} each</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-rose-500 p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors shrink-0"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    {/* Stepper */}
                    <div className="inline-flex items-center gap-2 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] px-1.5 py-0.5">
                      <button 
                        type="button"
                        className="w-5 h-5 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-brand-100 rounded-lg transition-colors"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button 
                        type="button"
                        className="w-5 h-5 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-brand-100 rounded-lg transition-colors"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    <span className="font-display font-extrabold text-xs sm:text-sm text-brand-600 dark:text-brand-400">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Bar */}
        {!orderComplete && !isCheckingOut && cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[var(--color-border)] bg-[var(--color-surface)] space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Subtotal</span>
              <span className="text-xl font-display font-black text-[var(--color-text)]">
                {formatCurrency(cartSubtotal)}
              </span>
            </div>
            
            <button 
              type="button"
              onClick={() => setIsCheckingOut(true)}
              className="w-full btn-primary py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
