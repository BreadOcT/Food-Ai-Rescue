
import { GoogleGenAI, Type } from "@google/genai";

export interface DetectedItem {
  name: string;
  category: 'Buah' | 'Sayur' | 'Protein' | 'Karbohidrat' | 'Olahan' | 'Roti' | 'Bumbu' | 'Lainnya';
}

export interface QualityAnalysisResult {
  isSafe: boolean;
  isHalal: boolean;
  halalReasoning: string;
  reasoning: string;
  allergens: string[];
  shelfLifePrediction: string; 
  hygieneScore: number;
  qualityPercentage: number;
  detectedItems: DetectedItem[];
  groundingSources?: { title: string; uri: string }[];
  storageTips: string[];
  environmentalImpact: {
    co2Saved: string;
    waterSaved: string;
  };
}

export interface RecipeSuggestion {
  id: string;
  title: string;
  ingredientsUsed: string[];
  instructions: string[];
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  sourceUrl?: string;
}

export interface LocationInfo {
  address: string;
  placeName: string;
  mapUrl?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  rt?: string;
  rw?: string;
}

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Langkah 2: Mengurai string alamat mentah menjadi objek JSON terstruktur
 * Ini aman karena tidak menggunakan tools, sehingga responseSchema diizinkan.
 */
export const parseRawAddress = async (rawAddress: string): Promise<Partial<LocationInfo>> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Uraikan alamat berikut ke dalam komponen terpisah: "${rawAddress}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            city: { type: Type.STRING },
            province: { type: Type.STRING },
            postalCode: { type: Type.STRING },
            rt: { type: Type.STRING },
            rw: { type: Type.STRING },
            streetName: { type: Type.STRING }
          },
          required: ["city", "province"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Parser Error:", error);
    return {};
  }
};

/**
 * Langkah 1: Mendapatkan alamat mentah dari Google Maps Grounding
 */
export const searchLocationByCoords = async (lat: number, lng: number): Promise<LocationInfo> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Bantu saya identifikasi detail lokasi untuk koordinat latitude: ${lat}, longitude: ${lng}. Berikan nama tempat, jalan, kota, provinsi, dan kode pos.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: { latitude: lat, longitude: lng }
          }
        },
      },
    });

    const text = response.text || "";
    const metadata = response.candidates?.[0]?.groundingMetadata;
    const mapsChunk = metadata?.groundingChunks?.find(c => c.maps)?.maps;

    // Panggil Parser Langkah 2 untuk mendapatkan detail form
    const parsed = await parseRawAddress(text || mapsChunk?.title || "");

    return {
      placeName: mapsChunk?.title || "Lokasi Saya",
      address: text || mapsChunk?.title || `Koordinat: ${lat}, ${lng}`,
      city: parsed.city || "",
      province: parsed.province || "",
      postalCode: parsed.postalCode || "",
      rt: parsed.rt || "",
      rw: parsed.rw || "",
      mapUrl: mapsChunk?.uri
    };
  } catch (error) {
    console.error("Critical Location Extraction Error:", error);
    return { 
      address: `Koordinat: ${lat.toFixed(6)}, ${lng.toFixed(6)}`, 
      placeName: "Titik Lokasi"
    };
  }
};

export const searchLocationByQuery = async (query: string, userLat?: number, userLng?: number): Promise<LocationInfo[]> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Cari lokasi untuk: "${query}".`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: userLat && userLng ? {
          retrievalConfig: {
            latLng: { latitude: userLat, longitude: userLng }
          }
        } : undefined
      },
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return chunks.map((c: any) => ({
      address: c.maps?.title || "Alamat ditemukan",
      placeName: c.maps?.title || "Hasil Pencarian",
      mapUrl: c.maps?.uri
    })).filter(loc => loc.mapUrl);
  } catch (error) {
    console.error("Maps Search Error:", error);
    return [];
  }
};

export const analyzeFoodQuality = async (
  ingredients: string[],
  imageBase64?: string
): Promise<QualityAnalysisResult> => {
  try {
    const ai = getAI();
    const parts: any[] = [];
    if (imageBase64) {
      const base64Data = imageBase64.split(',')[1] || imageBase64;
      parts.push({
        inlineData: { mimeType: 'image/jpeg', data: base64Data }
      });
    }

    const prompt = `Analisis kualitas bahan surplus ini secara profesional. 
Bahan: ${ingredients.join(', ')}.`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        isSafe: { type: Type.BOOLEAN },
        isHalal: { type: Type.BOOLEAN },
        halalReasoning: { type: Type.STRING },
        reasoning: { type: Type.STRING },
        allergens: { type: Type.ARRAY, items: { type: Type.STRING } },
        shelfLifePrediction: { type: Type.STRING },
        hygieneScore: { type: Type.INTEGER },
        qualityPercentage: { type: Type.INTEGER },
        detectedItems: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              category: { 
                type: Type.STRING, 
                enum: ['Buah', 'Sayur', 'Protein', 'Karbohidrat', 'Olahan', 'Roti', 'Bumbu', 'Lainnya'] 
              }
            },
            required: ["name", "category"]
          }
        },
        storageTips: { type: Type.ARRAY, items: { type: Type.STRING } },
        environmentalImpact: {
          type: Type.OBJECT,
          properties: {
            co2Saved: { type: Type.STRING },
            waterSaved: { type: Type.STRING }
          },
          required: ["co2Saved", "waterSaved"]
        }
      },
      required: ["isSafe", "isHalal", "halalReasoning", "reasoning", "hygieneScore", "qualityPercentage", "detectedItems", "shelfLifePrediction", "allergens", "storageTips", "environmentalImpact"]
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [...parts, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    return JSON.parse(response.text || '{}') as QualityAnalysisResult;
  } catch (error: any) {
    console.error("Quality Analysis Error:", error);
    throw error;
  }
};

export const extractFoodMetadata = async (promptText: string, imageBase64: string): Promise<{ category: string, tags: string[] }> => {
  try {
    const ai = getAI();
    const base64Data = imageBase64.split(',')[1] || imageBase64;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
          { text: `${promptText}. Ekstrak kategori (Makanan Berat, Minuman, Roti & Kue, Buah & Sayur) dan bahan-bahan utama sebagai tags.` }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["category", "tags"]
        }
      }
    });

    return JSON.parse(response.text || '{"category": "Makanan Berat", "tags": []}');
  } catch (error) {
    console.error("Extract Metadata Error:", error);
    return { category: "Makanan Berat", tags: [] };
  }
};

export const generateRecipesFromSurplus = async (
  items: DetectedItem[], 
  excludeTitles: string[] = [],
  iteration: number = 1
): Promise<RecipeSuggestion[]> => {
  try {
    const ai = getAI();
    const itemNames = items.map(i => i.name).join(', ');

    const prompt = `Temukan resep unik di Cookpad Indonesia menggunakan Google Search.
Bahan tersedia: ${itemNames}. Berikan daftar resep dalam format JSON terstruktur.`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        recipes: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              ingredientsUsed: { type: Type.ARRAY, items: { type: Type.STRING } },
              instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
              difficulty: { type: Type.STRING, enum: ['Mudah', 'Sedang', 'Sulit'] },
              sourceUrl: { type: Type.STRING }
            },
            required: ["id", "title", "ingredientsUsed", "instructions", "difficulty", "sourceUrl"]
          }
        }
      },
      required: ["recipes"]
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const data = JSON.parse(response.text || '{"recipes":[]}');
    
    if (data.recipes && data.recipes.length > 0 && groundingChunks.length > 0) {
      data.recipes = data.recipes.map((r: any, idx: number) => ({
        ...r,
        sourceUrl: r.sourceUrl || groundingChunks[idx]?.web?.uri || groundingChunks[0]?.web?.uri
      }));
    }

    return data.recipes;
  } catch (error) {
    console.error("Recipe Search Error:", error);
    return [];
  }
};

export const detectIngredientsFromImage = async (imageBase64: string): Promise<string> => {
  try {
    const ai = getAI();
    const base64Data = imageBase64.split(',')[1] || imageBase64;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
          { text: "Identifikasi bahan-bahan makanan utama yang terlihat dalam gambar ini. Berikan jawaban hanya berupa daftar bahan yang dipisahkan dengan koma dalam Bahasa Indonesia. Contoh: 'Ayam, Nasi, Selada, Timun'." }
        ]
      }
    });

    return response.text || "";
  } catch (error) {
    console.error("Ingredient Detection Error:", error);
    return "";
  }
};
