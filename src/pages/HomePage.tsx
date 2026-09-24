import React from 'react';
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface HomePageProps {
  products: Product[];
  isLoading: boolean;
  onNavigate: (tab: string, param?: string) => void;
  onViewDetails: (productId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  isLoading,
  onNavigate,
  onViewDetails,
}) => {
  const featuredProducts = products.slice(0, 6);

  return (
    <div className="space-y-16">
      {/* Editorial Storefront Hero Banner */}
      <section className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white overflow-hidden p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 tracking-wider uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Full-Stack College E-Commerce Project</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white text-balance leading-tight">
            Curated essentials engineered for modern living.
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
            Explore our premium collection of audio gear, workspace tools, smart wearables, and travel accessories powered by Express & MongoDB.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onNavigate('products')}
              className="px-6 py-3 bg-white text-slate-900 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors flex items-center gap-2 shadow-sm"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('products', 'Workspace')}
              className="px-5 py-3 border border-slate-700 hover:border-slate-500 text-slate-200 rounded-lg text-sm font-medium transition-colors"
            >
              Workspace Setup
            </button>
          </div>
        </div>

        {/* Subtle geometric backdrop pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none hidden lg:block">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="0,0 100,0 100,100" fill="currentColor" />
          </svg>
        </div>
      </section>

      {/* Trust & Guarantee Markers */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-y border-slate-200">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-900">Complimentary Shipping</h4>
            <p className="text-xs text-slate-500 mt-0.5">Free standard shipping on orders over $100</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-900">Secure JWT Authentication</h4>
            <p className="text-xs text-slate-500 mt-0.5">Bcrypt password hashing & role authorization</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-900">Live Order Tracking</h4>
            <p className="text-xs text-slate-500 mt-0.5">Track shipment states from Pending to Delivered</p>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Featured Products
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Hand-picked studio pieces with verified inventory in MongoDB.
            </p>
          </div>

          <button
            onClick={() => onNavigate('products')}
            className="text-xs font-semibold text-slate-900 hover:text-slate-600 flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>View All ({products.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {isLoading ? (
          <LoadingSpinner message="Loading catalog..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
