import React, { useState } from 'react';
import { ArrowLeft, ShoppingBag, Check, ShieldCheck, Truck, RotateCcw, Package } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductDetailsPageProps {
  product: Product;
  onBack: () => void;
  onNavigateToCart: () => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  product,
  onBack,
  onNavigateToCart,
}) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const isOutOfStock = product.stock <= 0;

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const ok = addToCart(product, quantity);
    if (ok) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Products</span>
      </button>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8">
        {/* Product Media Column */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square w-full rounded-xl bg-[#F8F9FA] overflow-hidden border border-slate-100 flex items-center justify-center">
            {!imageError ? (
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-slate-400">
                <Package className="w-16 h-16 stroke-[1.5] mb-3 text-slate-300" />
                <span className="text-sm font-medium text-slate-600 text-center">{product.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Purchase Module Column */}
        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            {/* Zero-Pill Unboxed Metadata */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700 uppercase tracking-wider">{product.category}</span>
              <span aria-hidden="true">·</span>
              {isOutOfStock ? (
                <span className="text-rose-600 font-semibold">Out of Stock</span>
              ) : (
                <span className="text-emerald-700 font-medium">
                  {product.stock} units in stock
                </span>
              )}
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl font-bold text-slate-900 tabular-nums font-mono">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400">Taxes calculated at checkout</span>
            </div>

            {/* Description */}
            <div className="pt-3 border-t border-slate-100">
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
                Overview
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity Stepper & Add to Cart */}
            {!isOutOfStock ? (
              <div className="pt-6 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-medium text-slate-700">Quantity</span>
                  <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                    <button
                      onClick={handleDecrement}
                      disabled={quantity <= 1}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-semibold font-mono text-slate-900 tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncrement}
                      disabled={quantity >= product.stock}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400">Max available: {product.stock}</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`flex-1 py-3 px-6 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Cart (${(product.price * quantity).toFixed(2)})</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      addToCart(product, quantity);
                      onNavigateToCart();
                    }}
                    className="py-3 px-6 rounded-lg text-xs font-semibold border border-slate-300 text-slate-800 hover:bg-slate-50 transition-colors whitespace-nowrap"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-6">
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium">
                  This item is currently sold out. Check back soon for restock updates.
                </div>
              </div>
            )}
          </div>

          {/* Guarantee Badges */}
          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-slate-700 shrink-0" />
              <span>Free Delivery over $100</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-700 shrink-0" />
              <span>Authentic Guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
