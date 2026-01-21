
/**
 * DATABASE ORDERS
 * Logic untuk Pembuatan Order, Status, dan Riwayat
 */
import { sendToBackend, fetchFromBackend } from './core';

export const dbCreateOrder = async (order: any, userEmail: string, userName: string) => {
  if (!userEmail || !order.partner || !order.item) {
    return { success: false, message: 'Data order tidak lengkap' };
  }

  // Matches 'create_order' payload in backend script
  const payload = {
    userName: userName || "Guest",
    userEmail: userEmail,
    userId: userEmail, // Add userId for notification mapping
    partner: order.partner || "",
    partnerId: order.partnerId || "",
    item: order.item || "",
    itemId: order.itemId || "",
    quantity: order.quantity || 1,
    status: order.status || "Pending",
    totalPrice: order.totalPrice || "0",
    deliveryAddress: order.deliveryAddress || "",
    paymentMethod: order.paymentMethod || "CASH"
  };
  
  const response = await sendToBackend('create_order', payload);
  
  if (response && (response.success === true || response.status === 'success')) {
    return { 
      success: true, 
      message: response.message || "Order created successfully",
      orderId: response.orderId,
      pickupCode: response.pickupCode,
      status: response.status
    };
  }
  
  return { success: false, message: response?.message || "Gagal membuat order" };
};

export const dbUpdateOrderStatus = async (orderId: string, status: string, userEmail?: string) => {
  const payload: any = { orderId, status };
  if (userEmail) payload.userEmail = userEmail;
  
  const response = await sendToBackend('update_order_status', payload);
  
  if (response && (response.success === true || response.status === 'success')) {
    return { success: true, message: response.message, orderId: response.orderId, newStatus: response.newStatus };
  }
  
  return { success: false, message: response?.message || "Gagal update status order" };
};

export const dbFetchHistory = async (role: 'USER' | 'PARTNER', identifier: string) => {
  const response = await fetchFromBackend({ action: 'get_history', role, identifier });
  if (response && (response.success === true || response.status === 'success') && Array.isArray(response.data)) {
    return response.data.map((order: any) => ({
      id: order.id,
      userName: order.userName || "",
      userEmail: order.userEmail || "",
      partner: order.partner || "",
      partnerId: order.partnerId || "",
      item: order.item || "",
      itemId: order.itemId || "",
      quantity: order.quantity || 0,
      status: order.status || "",
      pickupCode: order.pickupCode || "",
      totalPrice: order.totalPrice || "",
      deliveryAddress: order.deliveryAddress || "",
      paymentMethod: order.paymentMethod || "",
      timestamp: order.timestamp || new Date().toISOString()
    }));
  }
  return [];
};
