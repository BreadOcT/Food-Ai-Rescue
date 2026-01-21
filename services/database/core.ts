
/**
 * DATABASE CORE
 * Konfigurasi dasar dan helper untuk komunikasi ke Google Apps Script
 */

// URL Apps Script Deployment yang Valid
export const GAS_API_URL = "https://script.google.com/macros/s/AKfycbz1F4nRKEcMId1Gob84nif_AY2uNOIlu8ZSaqn-oKXr3Uv4wi7zWJ59IvtenAXctdscNQ/exec";

// Helper retry untuk mengatasi flakiness jaringan/server
async function fetchWithRetry(url: string, options: RequestInit, retries = 2): Promise<Response> {
  try {
    const response = await fetch(url, options);
    // GAS sometimes returns 200 even for errors (HTML error pages), 
    // but typically fetch() only throws on network error.
    return response;
  } catch (err) {
    if (retries > 0) {
      console.log(`Retrying fetch... (${retries} left)`);
      await new Promise(res => setTimeout(res, 1500));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw err;
  }
}

// Helper untuk fetch POST
export const sendToBackend = async (action: string, payload: any): Promise<any> => {
  try {
    console.log(`📡 Sending [${action}]...`, payload);
    
    // Gunakan POST dengan text/plain untuk menghindari preflight OPTIONS CORS issue pada Google Apps Script
    const response = await fetchWithRetry(GAS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" }, 
      body: JSON.stringify({ action, payload }),
    });

    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log(`✅ Response [${action}]:`, result);
    return result;
  } catch (error) {
    console.error(`❌ Error [${action}]:`, error);
    // Return format error yang konsisten
    return { success: false, error: String(error), message: "Gagal terhubung ke server. Pastikan koneksi internet stabil." };
  }
};

// Helper untuk fetch GET
export const fetchFromBackend = async (params: Record<string, string>): Promise<any> => {
  try {
    const queryParams = new URLSearchParams({ ...params, _: Date.now().toString() }).toString();
    const url = `${GAS_API_URL}?${queryParams}`;
    
    const response = await fetchWithRetry(url, { method: "GET" });
    
    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`❌ Fetch Error [${params.action}]:`, error);
    return { success: false, error: String(error), data: [] }; // Return empty data on fail
  }
};

// System Check
export const dbCheckConnection = async () => {
  const result = await fetchFromBackend({ action: 'ping' });
  return !!result && (result.status === 'ready' || result.success === true);
};
