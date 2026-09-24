import {
  AuthResponse,
  User,
  Product,
  Order,
  ShippingAddress,
  OrderItem,
  AdminStats,
} from '../types';

const BASE_URL = '/api';

const getHeaders = (token?: string | null) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const activeToken = token || localStorage.getItem('shopease_token');
  if (activeToken) {
    headers['Authorization'] = `Bearer ${activeToken}`;
  }
  return headers;
};

const handleResponse = async <T>(res: Response): Promise<T> => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data?.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }
  return data as T;
};

export const api = {
  // Auth
  async register(name: string, email: string, password: string, role?: 'user' | 'admin'): Promise<AuthResponse> {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ name, email, password, role }),
    });
    return handleResponse<AuthResponse>(res);
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return handleResponse<AuthResponse>(res);
  },

  async getProfile(): Promise<User> {
    const res = await fetch(`${BASE_URL}/auth/profile`, {
      headers: getHeaders(),
    });
    return handleResponse<User>(res);
  },

  async updateProfile(name?: string, email?: string, password?: string): Promise<User> {
    const res = await fetch(`${BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ name, email, password }),
    });
    return handleResponse<User>(res);
  },

  // Products
  async getProducts(params?: { category?: string; search?: string }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'All') {
      query.append('category', params.category);
    }
    if (params?.search) {
      query.append('search', params.search);
    }
    const url = `${BASE_URL}/products${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url, {
      headers: getHeaders(),
    });
    return handleResponse<Product[]>(res);
  },

  async getProductById(id: string): Promise<Product> {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse<Product>(res);
  },

  async createProduct(product: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(product),
    });
    return handleResponse<Product>(res);
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(product),
    });
    return handleResponse<Product>(res);
  },

  async deleteProduct(id: string): Promise<{ message: string }> {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse<{ message: string }>(res);
  },

  // Orders
  async createOrder(data: {
    products: OrderItem[];
    shippingAddress: ShippingAddress;
    totalAmount: number;
  }): Promise<Order> {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Order>(res);
  },

  async getOrders(): Promise<Order[]> {
    const res = await fetch(`${BASE_URL}/orders`, {
      headers: getHeaders(),
    });
    return handleResponse<Order[]>(res);
  },

  async getOrderById(id: string): Promise<Order> {
    const res = await fetch(`${BASE_URL}/orders/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse<Order>(res);
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    const res = await fetch(`${BASE_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse<Order>(res);
  },

  // Admin Stats
  async getAdminStats(): Promise<AdminStats> {
    const res = await fetch(`${BASE_URL}/users/admin/stats`, {
      headers: getHeaders(),
    });
    return handleResponse<AdminStats>(res);
  },
};
