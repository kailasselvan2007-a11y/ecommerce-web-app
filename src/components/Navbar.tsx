import React, { useState } from 'react';
import { ShoppingBag, User as UserIcon, Menu, X, Shield, Package, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, param?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const { user, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNav = (tab: string, param?: string) => {
    onNavigate(tab, param);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text wordmark */}
        <button
          onClick={() => handleNav('home')}
          className="text-xl font-bold tracking-tight text-slate-900 hover:opacity-90 transition-opacity flex items-center gap-1.5 focus-visible:outline-none"
        >
          <span className="w-2 h-2 rounded-full bg-slate-900 inline-block"></span>
          <span>ShopEase</span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button
            onClick={() => handleNav('home')}
            className={`transition-colors hover:text-slate-900 ${
              currentTab === 'home' ? 'text-slate-900 font-semibold' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNav('products')}
            className={`transition-colors hover:text-slate-900 ${
              currentTab === 'products' ? 'text-slate-900 font-semibold' : ''
            }`}
          >
            Products
          </button>
          {user && (
            <button
              onClick={() => handleNav('orders')}
              className={`transition-colors hover:text-slate-900 ${
                currentTab === 'orders' ? 'text-slate-900 font-semibold' : ''
              }`}
            >
              My Orders
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => handleNav('admin-dashboard')}
              className={`transition-colors hover:text-slate-900 flex items-center gap-1.5 ${
                currentTab.startsWith('admin') ? 'text-slate-900 font-semibold' : ''
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-slate-700" />
              <span>Admin Panel</span>
            </button>
          )}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* Cart Icon with Counter */}
          <button
            onClick={() => handleNav('cart')}
            className="relative p-2 text-slate-700 hover:text-slate-900 transition-colors focus-visible:outline-none rounded-lg hover:bg-slate-100"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-[20px] px-1 text-[11px] font-bold text-white bg-slate-900 rounded-full font-mono tabular-nums shadow-sm">
                {itemCount}
              </span>
            )}
          </button>

          {/* User Account / Dropdown */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors text-sm font-medium focus-visible:outline-none"
              >
                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline-block max-w-[120px] truncate text-xs font-medium">
                  {user.name}
                </span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-slate-200/80 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-mono">
                      Role: {user.role}
                    </p>
                  </div>
                  <button
                    onClick={() => handleNav('profile')}
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => handleNav('orders')}
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2"
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>Order Tracking</span>
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleNav('admin-dashboard')}
                      className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2 border-t border-slate-100"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Admin Dashboard</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                      handleNav('home');
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-slate-100"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNav('login')}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNav('register')}
                className="px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap"
              >
                Register
              </button>
            </div>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <button
            onClick={() => handleNav('home')}
            className={`block w-full text-left px-3 py-2 text-sm font-medium rounded-lg ${
              currentTab === 'home' ? 'bg-slate-100 text-slate-950 font-semibold' : 'text-slate-600'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNav('products')}
            className={`block w-full text-left px-3 py-2 text-sm font-medium rounded-lg ${
              currentTab === 'products' ? 'bg-slate-100 text-slate-950 font-semibold' : 'text-slate-600'
            }`}
          >
            Products Catalog
          </button>
          {user && (
            <>
              <button
                onClick={() => handleNav('orders')}
                className={`block w-full text-left px-3 py-2 text-sm font-medium rounded-lg ${
                  currentTab === 'orders' ? 'bg-slate-100 text-slate-950 font-semibold' : 'text-slate-600'
                }`}
              >
                My Orders
              </button>
              <button
                onClick={() => handleNav('profile')}
                className={`block w-full text-left px-3 py-2 text-sm font-medium rounded-lg ${
                  currentTab === 'profile' ? 'bg-slate-100 text-slate-950 font-semibold' : 'text-slate-600'
                }`}
              >
                Profile Settings
              </button>
            </>
          )}
          {isAdmin && (
            <div className="pt-2 border-t border-slate-100">
              <p className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Admin Area
              </p>
              <button
                onClick={() => handleNav('admin-dashboard')}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                Dashboard Overview
              </button>
              <button
                onClick={() => handleNav('admin-products')}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                Manage Products
              </button>
              <button
                onClick={() => handleNav('admin-orders')}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                Manage Orders
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
