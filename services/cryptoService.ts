
/**
 * CRYPTO SERVICE
 * Layanan untuk mengenkripsi dan mendekripsi password sebelum dikirim ke database.
 * Menggunakan teknik XOR Cipher + Base64 Encoding dengan Salt Key statis.
 */

const SECRET_KEY = "FOOD_AI_RESCUE_SECURE_KEY_2025";

/**
 * Mengubah password asli menjadi kode terenkripsi.
 * Digunakan saat Registrasi dan Login (sebelum dikirim ke DB).
 */
export const encryptPassword = (text: string): string => {
  try {
    // 1. XOR Cipher
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length));
    }
    // 2. Base64 Encoding (agar aman dikirim via HTTP/JSON)
    return btoa(result);
  } catch (error) {
    console.error("Encryption failed:", error);
    return text; // Fallback jika gagal
  }
};

/**
 * Mengembalikan kode terenkripsi menjadi password asli.
 * Digunakan jika Anda perlu melihat password asli (misal: fitur 'Show Password' admin atau verifikasi manual).
 */
export const decryptPassword = (encryptedText: string): string => {
  try {
    // 1. Base64 Decoding
    const text = atob(encryptedText);
    // 2. XOR Cipher Reverse (XOR is symmetric)
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length));
    }
    return result;
  } catch (error) {
    console.error("Decryption failed:", error);
    return "";
  }
};
