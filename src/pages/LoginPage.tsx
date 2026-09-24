import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, Shield, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface LoginPageProps {
  onNavigateToRegister: () => void;
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateToRegister,
  onLoginSuccess,
}) => {
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please fill in both email and password');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      await login(email, password);
      showToast('Successfully signed in!', 'success');
      onLoginSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoUser = async () => {
    setEmail('user@shopease.com');
    setPassword('user123');
    setIsLoading(true);
    setErrorMessage('');
    try {
      await login('user@shopease.com', 'user123');
      showToast('Logged in as Demo User!', 'success');
      onLoginSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAdmin = async () => {
    setEmail('admin@shopease.com');
    setPassword('admin123');
    setIsLoading(true);
    setErrorMessage('');
    try {
      await login('admin@shopease.com', 'admin123');
      showToast('Logged in as Store Administrator!', 'success');
      onLoginSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome Back</h1>
          <p className="text-xs text-slate-500">Sign in to your ShopEase account</p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <span>Signing In...</span> : <span>Sign In</span>}
          </button>
        </form>

        {/* Quick Demo Credentials Box for College Assignment Grading */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 text-center">
            Instant Demo Logins (College Evaluation)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillDemoUser}
              disabled={isLoading}
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-left transition-colors flex items-center gap-2"
            >
              <User className="w-4 h-4 text-slate-500 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-800 leading-tight">Demo User</p>
                <p className="text-[10px] text-slate-400 font-mono">user123</p>
              </div>
            </button>

            <button
              type="button"
              onClick={fillDemoAdmin}
              disabled={isLoading}
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-left transition-colors flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-slate-700 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-800 leading-tight">Store Admin</p>
                <p className="text-[10px] text-slate-400 font-mono">admin123</p>
              </div>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 pt-2">
          Don't have an account?{' '}
          <button
            onClick={onNavigateToRegister}
            className="font-semibold text-slate-900 hover:underline"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
};
