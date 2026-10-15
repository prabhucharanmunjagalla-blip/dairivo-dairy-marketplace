import { DairyProduct, Order, PaymentTransaction, SupportedLanguage, UserProfile, OrderStatus } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_TRANSACTIONS, INITIAL_FARMERS } from './mockData';

const STORAGE_KEYS = {
  USER: 'dairivo_current_user',
  LANGUAGE: 'dairivo_language',
  PRODUCTS: 'dairivo_products',
  ORDERS: 'dairivo_orders',
  TRANSACTIONS: 'dairivo_transactions',
  ALL_USERS: 'dairivo_all_users',
};

export const storage = {
  // Language
  getLanguage: (): SupportedLanguage => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as SupportedLanguage | null;
      if (saved) return saved;
    } catch {
      // ignore
    }
    return 'en';
  },

  setLanguage: (lang: SupportedLanguage): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    } catch {
      // ignore
    }
  },

  // User
  getCurrentUser: (): UserProfile | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return null;
  },

  setCurrentUser: (user: UserProfile | null): void => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        // Also persist to all_users registry
        const all = storage.getAllUsers();
        const existingIdx = all.findIndex((u) => u.id === user.id || u.phone === user.phone);
        if (existingIdx >= 0) {
          all[existingIdx] = user;
        } else {
          all.push(user);
        }
        localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(all));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch {
      // ignore
    }
  },

  getAllUsers: (): UserProfile[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ALL_USERS);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return [...INITIAL_FARMERS];
  },

  findUserByPhone: (phone: string, role?: 'farmer' | 'buyer'): UserProfile | null => {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const users = storage.getAllUsers();
    return users.find((u) => u.phone.replace(/\D/g, '').slice(-10) === cleanPhone && (!role || u.role === role)) || null;
  },

  // Products
  getProducts: (): DairyProduct[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return [...INITIAL_PRODUCTS];
  },

  saveProducts: (products: DairyProduct[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch {
      // ignore
    }
  },

  addProduct: (product: DairyProduct): DairyProduct[] => {
    const list = storage.getProducts();
    const updated = [product, ...list];
    storage.saveProducts(updated);
    return updated;
  },

  updateProduct: (product: DairyProduct): DairyProduct[] => {
    const list = storage.getProducts();
    const updated = list.map((p) => (p.id === product.id ? product : p));
    storage.saveProducts(updated);
    return updated;
  },

  deleteProduct: (productId: string): DairyProduct[] => {
    const list = storage.getProducts();
    const updated = list.filter((p) => p.id !== productId);
    storage.saveProducts(updated);
    return updated;
  },

  // Orders
  getOrders: (): Order[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return [...INITIAL_ORDERS];
  },

  saveOrders: (orders: Order[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch {
      // ignore
    }
  },

  createOrder: (order: Order): { success: boolean; error?: string; orders: Order[] } => {
    const products = storage.getProducts();
    const product = products.find((p) => p.id === order.productId);

    if (!product) {
      return { success: false, error: 'Product not found', orders: storage.getOrders() };
    }

    if (product.availableQuantity < order.quantity) {
      return { success: false, error: 'Quantity exceeds available stock', orders: storage.getOrders() };
    }

    // Deduct stock safely
    product.availableQuantity -= order.quantity;
    storage.saveProducts(products);

    const orders = [order, ...storage.getOrders()];
    storage.saveOrders(orders);

    return { success: true, orders };
  },

  updateOrderStatus: (orderId: string, status: OrderStatus): Order[] => {
    const orders = storage.getOrders();
    const orderIndex = orders.findIndex((o) => o.id === orderId);
    if (orderIndex === -1) return orders;

    const order = orders[orderIndex];
    const previousStatus = order.status;
    order.status = status;
    order.updatedAt = new Date().toISOString();

    // If order was cancelled and was not already delivered or cancelled, restore product stock
    if (status === 'cancelled' && previousStatus !== 'cancelled') {
      const products = storage.getProducts();
      const product = products.find((p) => p.id === order.productId);
      if (product) {
        product.availableQuantity += order.quantity;
        storage.saveProducts(products);
      }
    }

    // If order is delivered, automatically record completed transaction for farmer
    if (status === 'delivered') {
      order.paymentStatus = 'completed';
      const transactions = storage.getTransactions();
      const existingTxn = transactions.find((t) => t.orderId === order.id);
      if (!existingTxn) {
        const newTxn: PaymentTransaction = {
          id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
          orderId: order.id,
          farmerId: order.farmerId,
          buyerName: order.buyerName,
          productName: `${order.productName} (${order.quantity} ${order.unit})`,
          amount: order.totalPrice,
          status: 'completed',
          method: order.paymentMethod,
          date: new Date().toISOString(),
          referenceNo: `${order.paymentMethod.toUpperCase()}/${Date.now().toString().slice(-8)}/SUCCESS`,
        };
        storage.addTransaction(newTxn);
      }
    }

    storage.saveOrders(orders);
    return orders;
  },

  // Transactions
  getTransactions: (): PaymentTransaction[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return [...INITIAL_TRANSACTIONS];
  },

  addTransaction: (txn: PaymentTransaction): PaymentTransaction[] => {
    const list = storage.getTransactions();
    const updated = [txn, ...list];
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));
    } catch {
      // ignore
    }
    return updated;
  },

  // Reset to initial mock state
  resetAll: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
      localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(INITIAL_FARMERS));
    } catch {
      // ignore
    }
  },
};
