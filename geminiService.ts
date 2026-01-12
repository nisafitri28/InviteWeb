
import { GoogleGenAI } from "@google/genai";

export async function generateInvitationMessage(params: {
  eventType: string;
  eventName: string;
  organizerName: string;
}) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
    const prompt = `
      Bertindaklah sebagai penulis undangan profesional. 
      Buatkan teks undangan digital untuk acara ${params.eventType}.
      Nama Acara: ${params.eventName}
      Penyelenggara: ${params.organizerName}
      
      Struktur teks:
      1. Pembukaan (Salam hangat/puitis)
      2. Inti pesan (Mengajak dengan penuh hormat)
      3. Penutup (Harapan kehadiran dan doa)
      
      Gunakan Bahasa Indonesia yang sangat elegan, menyentuh hati, dan eksklusif. 
      Maksimal 150 kata. Jangan gunakan format markdown (seperti ** atau #).
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: prompt }] }],
    });

    return response.text || "Dengan penuh rasa syukur, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada momen berharga kami. Kehadiran Anda adalah kebahagiaan yang tak terhingga bagi kami.";
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "Kehadiran Anda adalah kehormatan bagi kami. Kami mengundang Anda untuk merayakan momen spesial ini bersama-sama dalam suasana yang penuh kehangatan dan kekeluargaan.";
  }
}
