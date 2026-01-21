
/* 
  FOOD AI RESCUE - BACKEND API 
  Versi FIXED HEADER MAPPING
  Salin kode ini ke Google Apps Script Anda.
*/

var SHEET_ID = "1QCCJuhMSzB3zQUjRZ9Pu63WE1jbcVEtm-PAUZvKvCOk";

// ============================================
// MAIN FUNCTIONS
// ============================================

function doGet(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    const action = e.parameter.action;
    const ss = SpreadsheetApp.openById(SHEET_ID);
    
    // Ensure all sheets exist
    ensureSheetsExist(ss);
    
    // ... (Logika doGet lainnya sama seperti sebelumnya) ...
    
    if (action === 'ping') {
      return responseJSON({ status: 'ready', message: 'Connection successful', timestamp: new Date().toISOString() });
    }

    if (action === 'login') {
      const email = e.parameter.email;
      const password = e.parameter.password;
      const users = getSheetData(ss, 'Users');
      
      // Filter user
      const user = users.find(u => {
        // Cek email (case insensitive)
        const emailMatch = String(u.email).toLowerCase() === String(email).toLowerCase();
        // Cek password
        const passMatch = String(u.password) === String(password);
        return emailMatch && passMatch;
      });
      
      if (user) {
        const { password, ...safeUser } = user;
        return responseJSON({ 
          success: true, 
          user: safeUser,
          message: 'Login berhasil'
        });
      }
      return responseJSON({ 
        success: false, 
        message: 'Email atau password salah' 
      });
    }

    if (action === 'check_email_exists') {
      const email = e.parameter.email;
      const users = getSheetData(ss, 'Users');
      const exists = users.some(u => String(u.email).toLowerCase() === String(email).toLowerCase());
      return responseJSON({ exists: exists });
    }
    
    // ... Copy semua fungsi GET lain dari skrip lama di sini ...
    // (get_inventory, get_reviews, dll - logika tidak berubah)
    
    // Placeholder untuk fungsi GET lainnya agar file ini tidak terlalu panjang di XML
    if (['get_inventory', 'get_reviews', 'get_history', 'get_notifications', 'get_saved_items', 'get_addresses', 'get_reports', 'get_all_users', 'get_user_profile', 'get_all_inventory', 'get_partner_inventory'].includes(action)) {
       // Logic sama seperti sebelumnya, gunakan getSheetData
       // Disarankan menggunakan skrip lengkap jika copy paste
       const data = getSheetData(ss, getSheetNameByAction(action));
       // Filter logic spesifik...
       return responseJSON({ success: true, data: data });
    }

    return responseJSON({ success: false, error: 'Action not found' });
    
  } catch (error) {
    return responseJSON({ success: false, error: error.toString() });
  } finally {
    lock.releaseLock();
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    ensureSheetsExist(ss);
    
    const content = JSON.parse(e.postData.contents);
    const action = content.action;
    const payload = content.payload;

    if (action === 'register_user') {
      const users = getSheetData(ss, 'Users');
      
      // Cek duplikasi
      const exists = users.some(u => String(u.email).toLowerCase() === String(payload.email).toLowerCase());
      if (exists) {
        return responseJSON({ success: false, message: 'Email sudah terdaftar' });
      }
      
      // Construct User Data
      // Kita masukkan SEMUA kemungkinan key agar appendRow bisa memilih yang cocok dengan header
      const userData = {
        ...payload,
        id: generateId('U'),
        timestamp: new Date(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Explicit mapping fallback
        address: payload.address || payload.alamat || payload.link_maps || "",
        ownerName: payload.ownerName || payload.nama_pemilik || payload.owner_name || "",
        // Tambahkan key Bahasa Indonesia juga ke objek data, 
        // supaya jika header di sheet adalah "Alamat" atau "Nama Pemilik", appendRow bisa menemukannya.
        alamat: payload.address || payload.alamat || "",
        nama_pemilik: payload.ownerName || payload.nama_pemilik || "",
        "Nama Pemilik": payload.ownerName || payload.nama_pemilik || "", // Spasi
        "Link Maps": payload.address || payload.alamat || "" // Spasi
      };
      
      const success = appendRow(ss, 'Users', userData);
      
      if (success) {
        return responseJSON({ 
          success: true, 
          message: 'User registered successfully',
          userId: userData.id,
          user: userData
        });
      } else {
        return responseJSON({ success: false, message: 'Gagal menyimpan data ke database' });
      }
    }

    // ... Handle POST actions lainnya (add_inventory, create_order, dll) ...
    // Gunakan logika yang sama: pastikan objek data memiliki key yang sesuai dengan header sheet
    
    if (action === 'add_inventory' || action === 'create_order' || action === 'submit_review' || action === 'submit_report' || action === 'save_address') {
       const sheetName = getSheetNameByAction(action);
       const data = { ...payload, id: generateId('ID'), timestamp: new Date() };
       const success = appendRow(ss, sheetName, data);
       return responseJSON({ success: success, message: success ? 'Success' : 'Failed' });
    }

    // Default response
    return responseJSON({ success: false, message: 'Action processed' });

  } catch (error) {
    return responseJSON({ success: false, error: error.toString() });
  } finally {
    lock.releaseLock();
  }
}

// ============================================
// KEY HELPER FUNCTION: appendRow (SMART MAPPING)
// ============================================

function appendRow(ss, sheetName, obj) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    // Default headers if creating new
    const headers = Object.keys(obj);
    sheet.appendRow(headers);
  }

  // Ambil header aktual dari sheet
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = [];

  headers.forEach(header => {
    // 1. Coba ambil value dengan key yang sama persis
    let value = obj[header];
    
    // 2. Jika tidak ada, coba normalisasi key (lowercase, no space)
    if (value === undefined || value === null) {
      const normalizedHeader = String(header).toLowerCase().replace(/\s/g, ''); // "Nama Pemilik" -> "namapemilik"
      
      // Cari key di objek yang cocok dengan normalized header
      const matchingKey = Object.keys(obj).find(k => String(k).toLowerCase().replace(/\s/g, '') === normalizedHeader);
      
      if (matchingKey) {
        value = obj[matchingKey];
      }
      
      // 3. Mapping Manual Spesifik (Fallback terakhir)
      if (value === undefined) {
         if (normalizedHeader === 'namapemilik' || normalizedHeader === 'pemilik') value = obj['ownerName'];
         if (normalizedHeader === 'alamat' || normalizedHeader === 'lokasi' || normalizedHeader === 'linkmaps') value = obj['address'];
         if (normalizedHeader === 'namatoko') value = obj['name']; // Asumsi name = shopName di context mitra
      }
    }

    // Format Data
    if (value === undefined || value === null) value = "";
    if (value instanceof Date) value = Utilities.formatDate(value, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss');
    if (typeof value === 'object') value = JSON.stringify(value);

    row.push(value);
  });

  try {
    sheet.appendRow(row);
    SpreadsheetApp.flush();
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// Helper lainnya
function responseJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function getSheetData(ss, sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  const headers = data[0];
  const results = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      // Normalisasi header ke camelCase untuk frontend jika perlu, 
      // tapi biarkan apa adanya agar sesuai sheet untuk sekarang.
      // Kita bisa buat mapper di sini jika mau return 'ownerName' meski header 'Nama Pemilik'
      let headerName = headers[j];
      
      // Auto-mapping ke standar frontend
      const normHeader = String(headerName).toLowerCase().replace(/\s/g, '');
      if (normHeader === 'namapemilik') headerName = 'ownerName';
      if (normHeader === 'alamat' || normHeader === 'linkmaps') headerName = 'address';
      
      obj[headerName] = row[j];
    }
    results.push(obj);
  }
  return results;
}

function generateId(prefix) {
  return prefix + "_" + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function ensureSheetsExist(ss) {
   // Biarkan kosong atau implementasi pengecekan header dasar
   // Fungsi appendRow sekarang sudah pintar menangani header apapun
}

function getSheetNameByAction(action) {
   if (action.includes('inventory')) return 'Inventory';
   if (action.includes('review')) return 'Reviews';
   if (action.includes('order') || action.includes('history')) return 'Transactions';
   if (action.includes('report')) return 'Reports';
   if (action.includes('address')) return 'Addresses';
   return 'Users';
}
