import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OrdersPage } from './pages/OrdersPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminProductsPage } from './pages/AdminProductsPage';
import { AdminOrdersPage } from './pages/AdminOrdersPage';
import { Product } from './types';
import { api } from './services/api';
import { ShieldAlert } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [highlightOrderId, setHighlightOrderId] = useState<string | undefined>(undefined);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('All');

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('[App] Failed to fetch products:', err);
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleNavigate = (tab: string, param?: string) => {
    if (tab === 'products' && param) {
      setProductCategoryFilter(param);
    } else if (tab === 'products') {
      setProductCategoryFilter('All');
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDetails = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentTab('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderPlaced = (orderId: string) => {
    setHighlightOrderId(orderId);
    setCurrentTab('orders');
    fetchProducts(); // Refresh stock
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedProduct = products.find((p) => p._id === selectedProductId) || products[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      <Navbar currentTab={currentTab} onNavigate={handleNavigate} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Route switcher */}
        {currentTab === 'home' && (
          <HomePage
            products={products}
            isLoading={productsLoading}
            onNavigate={handleNavigate}
            onViewDetails={handleViewDetails}
          />
        )}

        {currentTab === 'products' && (
          <ProductsPage
            products={products}
            isLoading={productsLoading}
            initialCategory={productCategoryFilter}
            onViewDetails={handleViewDetails}
          />
        )}

        {currentTab === 'product-details' && selectedProduct && (
          <ProductDetailsPage
            product={selectedProduct}
            onBack={() => handleNavigate('products')}
            onNavigateToCart={() => handleNavigate('cart')}
          />
        )}

        {currentTab === 'cart' && (
          <CartPage
            onNavigateToProducts={() => handleNavigate('products')}
            onNavigateToCheckout={() => handleNavigate('checkout')}
          />
        )}

        {currentTab === 'checkout' && (
          <CheckoutPage
            onBackToCart={() => handleNavigate('cart')}
            onOrderPlaced={handleOrderPlaced}
            onNavigateToLogin={() => handleNavigate('login')}
          />
        )}

        {currentTab === 'login' && (
          <LoginPage
            onNavigateToRegister={() => handleNavigate('register')}
            onLoginSuccess={() => handleNavigate('home')}
          />
        )}

        {currentTab === 'register' && (
          <RegisterPage
            onNavigateToLogin={() => handleNavigate('login')}
            onRegisterSuccess={() => handleNavigate('home')}
          />
        )}

        {currentTab === 'orders' && (
          user ? (
            <OrdersPage
              onNavigateToProducts={() => handleNavigate('products')}
              highlightOrderId={highlightOrderId}
            />
          ) : (
            <div className="max-w-md mx-auto py-16 text-center space-y-4 bg-white rounded-2xl border border-slate-200 p-8">
              <h2 className="text-xl font-bold text-slate-900">Sign in to view orders</h2>
              <p className="text-xs text-slate-500">
                Please log in to your account to review your purchases and track delivery progress.
              </p>
              <button
                onClick={() => handleNavigate('login')}
                className="px-5 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
              >
                Sign In Now
              </button>
            </div>
          )
        )}

        {currentTab === 'profile' && (
          user ? (
            <ProfilePage />
          ) : (
            <div className="max-w-md mx-auto py-16 text-center space-y-4 bg-white rounded-2xl border border-slate-200 p-8">
              <h2 className="text-xl font-bold text-slate-900">Sign in to view profile</h2>
              <p className="text-xs text-slate-500">
                Manage your credentials and shipping defaults.
              </p>
              <button
                onClick={() => handleNavigate('login')}
                className="px-5 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
              >
                Sign In Now
              </button>
            </div>
          )
        )}

        {/* Admin Protected Routes */}
        {currentTab === 'admin-dashboard' && (
          isAdmin ? (
            <AdminDashboardPage onNavigateToTab={handleNavigate} />
          ) : (
            <div className="max-w-md mx-auto py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Administrator Access Required</h2>
              <p className="text-xs text-slate-500">
                You must be logged in as an administrator to access store management panels.
              </p>
              <button
                onClick={() => handleNavigate('login')}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
              >
                Switch to Admin Account
              </button>
            </div>
          )
        )}

        {currentTab === 'admin-products' && (
          isAdmin ? (
            <AdminProductsPage
              products={products}
              onRefreshProducts={fetchProducts}
            />
          ) : (
            <div className="max-w-md mx-auto py-16 text-center bg-white rounded-2xl border border-slate-200 p-8">
              <ShieldAlert className="w-8 h-8 text-rose-500 mx-auto mb-2" />
              <p className="text-xs text-slate-600">Access denied: Requires administrator privilege.</p>
            </div>
          )
        )}

        {currentTab === 'admin-orders' && (
          isAdmin ? (
            <AdminOrdersPage />
          ) : (
            <div className="max-w-md mx-auto py-16 text-center bg-white rounded-2xl border border-slate-200 p-8">
              <ShieldAlert className="w-8 h-8 text-rose-500 mx-auto mb-2" />
              <p className="text-xs text-slate-600">Access denied: Requires administrator privilege.</p>
            </div>
          )
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
