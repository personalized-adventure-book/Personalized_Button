// Utility functions for managing completed orders in cookies

export interface CompletedOrder {
  orderNumber: string;
  orderData: any;
  timestamp: string;
  id: string;
}

const ORDERS_COOKIE_KEY = 'completed_orders';
const MAX_ORDERS = 10; // Keep only the last 10 orders

export const orderStorage = {
  // Save a completed order to cookies
  saveCompletedOrder: (orderNumber: string, orderData: any, id: string) => {
    try {
      const newOrder: CompletedOrder = {
        orderNumber,
        orderData,
        timestamp: new Date().toISOString(),
        id
      };

      // Get existing orders
      const existingOrders = orderStorage.getCompletedOrders();
      
      // Add new order at the beginning
      const updatedOrders = [newOrder, ...existingOrders];
      
      // Keep only the latest orders (prevent cookie from getting too large)
      const trimmedOrders = updatedOrders.slice(0, MAX_ORDERS);
      
      // Save to cookies (expires in 30 days)
      const expires = new Date();
      expires.setDate(expires.getDate() + 30);
      
      document.cookie = `${ORDERS_COOKIE_KEY}=${encodeURIComponent(JSON.stringify(trimmedOrders))}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
      
      console.log('✅ Order saved to cookies:', orderNumber);
      return true;
    } catch (error) {
      console.error('❌ Error saving order to cookies:', error);
      return false;
    }
  },

  // Get all completed orders from cookies
  getCompletedOrders: (): CompletedOrder[] => {
    try {
      if (typeof document === 'undefined') return []; // SSR safety
      
      const cookies = document.cookie.split(';');
      const ordersCookie = cookies.find(cookie => 
        cookie.trim().startsWith(`${ORDERS_COOKIE_KEY}=`)
      );
      
      if (ordersCookie) {
        const cookieValue = ordersCookie.split('=')[1];
        const orders = JSON.parse(decodeURIComponent(cookieValue));
        return Array.isArray(orders) ? orders : [];
      }
      
      return [];
    } catch (error) {
      console.error('❌ Error reading orders from cookies:', error);
      return [];
    }
  },

  // Get orders for a specific ID
  getOrdersForId: (id: string): CompletedOrder[] => {
    const allOrders = orderStorage.getCompletedOrders();
    return allOrders.filter(order => order.id === id);
  },

  // Clear all orders (for testing/debugging)
  clearAllOrders: () => {
    document.cookie = `${ORDERS_COOKIE_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    console.log('🗑️ All orders cleared from cookies');
  }
};
