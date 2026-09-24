import React from 'react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartPageProps {
  onNavigateToProducts: () => void;
  onNavigateToCheckout: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  onNavigateToProducts,
  onNavigateToCheckout,
}) => {
  const { items, updateQuantity, removeFromCart, subtotal, shipping, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center bg-white border border-slate-200 rounded-2xl p-8">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Your shopping cart is empty</h2>
        <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto">
          Discover our curated collection of workspace accessories, audio equipment, and essentials.
        </p>
        <button
          onClick={onNavigateToProducts}
          className="mt-6 px-6 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Shopping Cart
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review your selected products and proceed to checkout.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-slate-400 hover:text-rose-600 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Itemized List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
            {items.map(({ product, quantity }) => (
              <div key={product._id} className="p-4 sm:p-5 flex gap-4 items-center">
                {/* Thumbnail */}
                <div className="w-20 h-20 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] text-slate-500">{product.category}</div>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                    {product.name}
                  </h4>
                  <div className="mt-1 text-xs font-bold text-slate-900 font-mono tabular-nums">
                    ${product.price.toFixed(2)}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                  <button
                    onClick={() => updateQuantity(product._id, quantity - 1)}
                    className="p-1.5 text-slate-600 hover:text-slate-900"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2.5 text-xs font-semibold font-mono text-slate-900 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(product._id, quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="p-1.5 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Line Item Total */}
                <div className="text-right shrink-0 min-w-[70px]">
                  <div className="text-xs sm:text-sm font-bold text-slate-900 font-mono tabular-nums">
                    ${(product.price * quantity).toFixed(2)}
                  </div>
                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="text-[11px] text-slate-400 hover:text-rose-600 mt-1 inline-flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs text-slate-500 px-2">
            <button
              onClick={onNavigateToProducts}
              className="text-slate-700 hover:text-slate-900 font-medium hover:underline"
            >
              ← Continue Shopping
            </button>
            <span>{items.reduce((s, i) => s + i.quantity, 0)} total items</span>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600 divide-y divide-slate-100">
              <div className="flex justify-between pt-1">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 font-mono tabular-nums">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between pt-2.5">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-slate-900 font-mono tabular-nums">
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between pt-3 text-sm font-bold text-slate-900">
                <span>Total Amount</span>
                <span className="font-mono tabular-nums">${total.toFixed(2)}</span>
              </div>
            </div>

            {shipping > 0 && (
              <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                Add ${(100 - subtotal).toFixed(2)} more to your cart to qualify for free shipping!
              </p>
            )}

            <button
              onClick={onNavigateToCheckout}
              className="w-full py-3 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Simulated checkout for college project — no real payment card required.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
