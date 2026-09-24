import React, { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle2, Truck, XCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Order } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface OrdersPageProps {
  onNavigateToProducts: () => void;
  highlightOrderId?: string;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({
  onNavigateToProducts,
  highlightOrderId,
}) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const data = await api.getOrders();
        setOrders(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'Confirmed':
        return <CheckCircle2 className="w-4 h-4 text-sky-500" />;
      case 'Shipped':
        return <Truck className="w-4 h-4 text-indigo-500" />;
      case 'Delivered':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'Cancelled':
        return <XCircle className="w-4 h-4 text-rose-500" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    const colors: Record<Order['status'], string> = {
      Pending: 'text-amber-700 bg-amber-50 border-amber-200',
      Confirmed: 'text-sky-700 bg-sky-50 border-sky-200',
      Shipped: 'text-indigo-700 bg-indigo-50 border-indigo-200',
      Delivered: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      Cancelled: 'text-rose-700 bg-rose-50 border-rose-200',
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${colors[status]}`}>
        {getStatusIcon(status)}
        <span>{status}</span>
      </span>
    );
  };

  if (isLoading) {
    return <LoadingSpinner message="Retrieving your orders..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          My Orders & Tracking
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review recent transactions, current shipping status, and receipt summaries.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No orders placed yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            When you purchase items from our catalog, your order status and shipping history will appear here.
          </p>
          <button
            onClick={onNavigateToProducts}
            className="mt-6 px-5 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const isHighlighted = order._id === highlightOrderId;
            const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={order._id}
                className={`bg-white rounded-xl border transition-all ${
                  isHighlighted
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                    : 'border-slate-200'
                }`}
              >
                {/* Order Header */}
                <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 rounded-t-xl">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 font-mono">
                        Order #{order._id.substring(order._id.length - 8).toUpperCase()}
                      </span>
                      {isHighlighted && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                          Just Placed
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">{formattedDate}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[10px] uppercase text-slate-400 font-medium block">
                        Total
                      </span>
                      <span className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                        ${order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4 sm:p-5 divide-y divide-slate-100">
                  {order.products.map((item, idx) => (
                    <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center gap-4">
                      <div className="w-14 h-14 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">{item.name}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Quantity: {item.quantity} · Unit Price: ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right font-mono text-xs font-bold text-slate-800 tabular-nums">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Information Footer */}
                <div className="px-4 sm:px-5 py-3 border-t border-slate-100 bg-slate-50/30 rounded-b-xl flex flex-col sm:flex-row justify-between text-xs text-slate-500 gap-2">
                  <div className="truncate">
                    <strong className="text-slate-700">Delivering to:</strong>{' '}
                    <span>
                      {order.shippingAddress.name} ({order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode})
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Status: <span className="text-slate-700 font-medium">{order.status}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
