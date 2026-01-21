
/**
 * DATABASE INVENTORY
 * Logic untuk Produk, Stok, dan Item Tersimpan
 */
import { sendToBackend, fetchFromBackend } from './core';

export const dbFetchInventory = async () => {
  const response = await fetchFromBackend({ action: 'get_inventory' });
  
  if (response && (response.success === true || response.status === 'success') && Array.isArray(response.data)) {
    return response.data.map((item: any) => {
      let amountValue = 0;
      let amountUnit = "Porsi";
      
      // Backend script stores amount as combined string "5 Porsi"
      const amountStr = String(item.amount || "");

      if (amountStr) {
        // Regex to separate value and unit
        const match = amountStr.match(/(\d+)\s*(.+)?/);
        if (match) {
          amountValue = parseInt(match[1]) || 0;
          amountUnit = match[2] || "Porsi";
        } else {
             // Fallback if only number
             amountValue = parseInt(amountStr.replace(/\D/g,'')) || 0;
        }
      }
      
      return {
        id: item.id,
        partnerName: item.partnerName || "",
        name: item.name || "",
        category: item.category || "",
        amount: amountStr,
        amountValue: amountValue,
        amountUnit: amountUnit,
        status: item.status || "Buka",
        qualityPercentage: item.qualityPercentage || "N/A",
        image: item.image || "",
        price: item.price || "",
        description: item.description || "",
        shelfLife: item.shelfLife || "",
        location: item.location || "",
        timestamp: item.timestamp || new Date().toISOString()
      };
    });
  }
  
  return [];
};

export const dbFetchAllInventory = async () => {
  const response = await fetchFromBackend({ action: 'get_all_inventory' });
  return response?.data || [];
};

export const dbFetchPartnerInventory = async (partnerName: string) => {
  const response = await fetchFromBackend({ action: 'get_partner_inventory', partnerName });
  return response?.data || [];
};

export const dbAddInventory = async (item: any, partnerName: string) => {
  if (!item.name || !partnerName) {
    return { success: false, message: 'Nama produk dan partner wajib diisi' };
  }

  // Payload structure must match what 'add_inventory' in backend script expects
  const payload = {
    partnerName: partnerName,
    name: item.name || "",
    category: item.category || "Makanan",
    amountValue: item.amountValue || 0,
    amountUnit: item.amountUnit || "Porsi",
    // Backend will combine amountValue + amountUnit into 'amount' column
    status: item.status || "Buka",
    qualityPercentage: item.qualityPercentage || "N/A",
    image: item.image || "",
    price: item.price || "",
    description: item.description || "",
    shelfLife: item.shelfLife || "",
    location: item.location || ""
  };
  
  const response = await sendToBackend('add_inventory', payload);
  
  if (response && (response.success === true || response.status === 'success')) {
    return { 
      success: true, 
      message: response.message || "Inventory added successfully",
      inventoryId: response.inventoryId || response.id,
      itemName: response.itemName
    };
  }
  
  return { success: false, message: response?.message || "Gagal menambahkan inventory" };
};

export const dbDeleteInventory = async (id: string) => {
  const response = await sendToBackend('delete_inventory', { id });
  
  if (response && (response.success === true || response.status === 'success')) {
    return { 
      success: true, 
      message: response.message || "Inventory deleted successfully",
      deletedId: response.deletedId
    };
  }
  
  return { success: false, message: response?.message || "Gagal menghapus inventory" };
};

export const dbUpdateInventoryStatus = async (id: string, status: string) => {
  const response = await sendToBackend('update_inventory_status', { id, status });
  if (response && (response.success === true || response.status === 'success')) {
    return { success: true, message: response.message, inventoryId: response.inventoryId, newStatus: response.newStatus };
  }
  return { success: false, message: response?.message || "Gagal update status" };
};

export const dbFetchSavedItems = async (email: string) => {
  const response = await fetchFromBackend({ action: 'get_saved_items', email });
  if (response && (response.success === true || response.status === 'success') && Array.isArray(response.data)) return response.data;
  return [];
};

export const dbSyncSavedItems = async (email: string, itemIds: any[]) => {
  const response = await sendToBackend('sync_saved_items', { email, itemIds });
  return response && (response.success === true || response.status === 'success');
};
