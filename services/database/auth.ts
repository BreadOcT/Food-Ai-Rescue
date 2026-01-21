
/**
 * DATABASE AUTH
 * Logic untuk User, Login, Register, dan Profil
 */
import { sendToBackend, fetchFromBackend } from './core';

export const dbCheckEmailExists = async (email: string) => {
  const response = await fetchFromBackend({ action: 'check_email_exists', email });
  return response?.exists === true;
};

export const dbRegisterUser = async (user: any) => {
  // 1. Validasi Input Dasar
  if (!user.email || !user.password) {
    return { 
      success: false, 
      message: 'Email dan password wajib diisi' 
    };
  }

  const now = new Date().toISOString();

  // 2. Prepare Payload Lengkap
  // PENTING: Kita kirim dengan beberapa variasi nama key agar backend
  // bisa menangkap data meskipun nama kolom di Sheet berubah-ubah (Smart Mapping).
  const payload = {
    // Data User Utama
    id: user.id || "", 
    name: user.name || "", // Nama Toko (Mitra) atau Nama User
    email: user.email,
    password: user.password,
    role: user.role || "USER",
    
    // Data Kontak
    phone: String(user.phone || ""), 
    avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=random`,
    
    // Data Khusus Mitra & Mapping ke Kolom Indonesia (Spreadsheet Headers)
    // Variasi Case untuk memastikan masuk ke kolom yang benar
    address: user.address || "", 
    ownerName: user.ownerName || "",
    
    "Nama Pemilik": user.ownerName || "",
    "nama_pemilik": user.ownerName || "",
    "owner_name": user.ownerName || "",
    
    "Alamat": user.address || "",
    "alamat": user.address || "",
    "Link Maps": user.address || "", // Sering digunakan untuk lokasi mitra
    "link_maps": user.address || "",
    
    "Nama Toko": user.name || "",
    "nama_toko": user.name || "",

    // Timestamps
    status: "ACTIVE",
    createdAt: now,
    updatedAt: now,
    "Created At": now,
    "Updated At": now
  };

  console.log("📤 Register Payload:", payload);

  // 4. Kirim ke Backend
  const response = await sendToBackend('register_user', payload);

  // 5. Handle Response
  if (response && (response.success === true || response.status === 'success')) {
    return { 
      success: true, 
      message: response.message || "Registrasi berhasil",
      userId: response.userId || response.id,
      email: response.email,
      name: response.name,
      user: { ...payload, id: response.userId || response.id } 
    };
  }

  return { 
    success: false, 
    message: response?.message || "Registrasi Gagal. Cek koneksi internet.",
    error: response?.error,
    details: response
  };
};

export const dbLoginUser = async (email: string, password: string) => {
  if (!email || !password) {
    return { 
      success: false, 
      message: 'Email dan password wajib diisi' 
    };
  }
  
  const response = await fetchFromBackend({ action: 'login', email, password });
  
  if (response && (response.success === true || response.status === 'success') && response.user) {
    const rawUser = response.user;
    return { 
      success: true, 
      user: {
        id: rawUser.id || "0",
        name: rawUser.name,
        email: rawUser.email,
        role: rawUser.role,
        phone: String(rawUser.phone || ""),
        avatar: rawUser.avatar || "",
        // Handle alias response dari Backend Getter
        address: rawUser.address || rawUser.alamat || rawUser["Link Maps"] || rawUser["Alamat"] || "", 
        ownerName: rawUser.ownerName || rawUser.nama_pemilik || rawUser["Nama Pemilik"] || "", 
        status: rawUser.status || "Active",
        createdAt: rawUser.createdAt || "",
      },
      message: response.message || "Login berhasil"
    };
  }
  
  return { 
    success: false, 
    message: response?.message || "Email atau password salah" 
  };
};

export const dbUpdateUserProfile = async (user: any) => {
  if (!user.email) {
    return { success: false, message: 'Email wajib diisi' };
  }

  const now = new Date().toISOString();

  const payload = {
    email: user.email,
    name: user.name,
    phone: String(user.phone || ""),
    avatar: user.avatar,
    address: user.address || "",
    ownerName: user.ownerName || "",
    
    // Alias untuk update (Memastikan kolom Indo terupdate)
    "Nama Pemilik": user.ownerName || "",
    "nama_pemilik": user.ownerName || "",
    
    "Alamat": user.address || "",
    "alamat": user.address || "",
    "Link Maps": user.address || "",
    
    "Nama Toko": user.name || "",
    
    updatedAt: now,
    "Updated At": now
  };
  
  const response = await sendToBackend('update_profile', payload);
  
  if (response && (response.success === true || response.status === 'success')) {
    return { 
      success: true, 
      message: response.message || "Profile updated successfully",
      email: user.email
    };
  }
  
  return { 
    success: false, 
    message: response?.message || "Gagal update profile"
  };
};

export const dbGetUserProfile = async (email: string) => {
  const response = await fetchFromBackend({ action: 'get_user_profile', email });
  if (response?.success === true && response.user) {
    return { success: true, user: response.user };
  }
  return { success: false, message: response?.message || "User tidak ditemukan" };
};

export const dbFetchAddresses = async (email: string) => {
  const response = await fetchFromBackend({ action: 'get_addresses', email });
  if (response && (response.success === true || response.status === 'success') && Array.isArray(response.data)) return response.data;
  return [];
};

export const dbSaveAddress = async (address: any, userEmail: string) => {
  if (!userEmail || !address.address) return { success: false };
  const payload = { ...address, userEmail };
  const response = await sendToBackend('save_address', payload);
  if (response && (response.success === true || response.status === 'success')) return { success: true };
  return { success: false };
};

export const dbFetchAllUsers = async () => {
  const response = await fetchFromBackend({ action: 'get_all_users' });
  if (response && (response.success === true || response.status === 'success') && Array.isArray(response.data)) return response.data;
  return [];
};
