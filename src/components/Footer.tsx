import React from 'react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-200 bg-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-900 inline-block"></span>
              <span className="text-base font-bold text-slate-900">ShopEase</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Full-Stack E-Commerce web application built with React, Vite, Node.js, Express, MongoDB, and JWT authentication for college development portfolio.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 tracking-wider uppercase mb-3">
              Explore Store
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-slate-900 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-slate-900 transition-colors">
                  All Products
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('cart')} className="hover:text-slate-900 transition-colors">
                  Shopping Cart
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('orders')} className="hover:text-slate-900 transition-colors">
                  Order Tracking
                </button>
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 tracking-wider uppercase mb-3">
              Tech Stack
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-500">
              <li>• React.js & Vite (TypeScript)</li>
              <li>• Tailwind CSS & Lucide Icons</li>
              <li>• Node.js & Express REST APIs</li>
              <li>• MongoDB & Mongoose ORM</li>
              <li>• JWT & Bcrypt Authentication</li>
            </ul>
          </div>

          {/* Roles & Security */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 tracking-wider uppercase mb-3">
              Account Roles
            </h4>
            <div className="text-xs text-slate-500 space-y-2">
              <p>
                <strong className="text-slate-800">Admin:</strong> Product CRUD, order status tracking, platform analytics.
              </p>
              <p>
                <strong className="text-slate-800">User:</strong> Product browsing, cart management, simulated checkout, order history.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} ShopEase. College Full-Stack Web Development Project.</p>
          <div className="flex items-center gap-4 text-slate-500">
            <span>RESTful APIs Verified</span>
            <span>·</span>
            <span>Role-Based Access Control</span>
            <span>·</span>
            <span>MongoDB Schema Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
