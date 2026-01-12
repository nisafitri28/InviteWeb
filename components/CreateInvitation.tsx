
import React, { useState } from 'react';
import { User, EventType, Invitation } from '../types';
import { storage } from '../storage';
import { generateInvitationMessage } from '../geminiService';

interface Props {
  user: User;
  onNavigate: (to: string) => void;
}

const CreateInvitation: React.FC<Props> = ({ user, onNavigate }) => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    eventType: 'wedding' as EventType,
    eventName: '',
    organizerName: '',
    eventDate: '',
    eventTime: '',
    eventLocation: '',
    eventMessage: '',
    photos: [] as string[]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeSelect = (type: EventType) => {
    setFormData(prev => ({ ...prev, eventType: type, photos: [] }));
    setStep(2);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1.5 * 1024 * 1024) {
        alert("Ukuran foto maksimal 1.5MB untuk performa terbaik.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const newPhotos = [...formData.photos];
        newPhotos[index] = base64String;
        setFormData(prev => ({ ...prev, photos: newPhotos }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateAI = async () => {
    if (!formData.eventName || !formData.organizerName) {
      alert("Isi Nama Acara dan Penyelenggara terlebih dahulu agar AI bisa bekerja maksimal.");
      return;
    }
    setIsGenerating(true);
    const msg = await generateInvitationMessage({
      eventType: formData.eventType,
      eventName: formData.eventName,
      organizerName: formData.organizerName
    });
    setFormData(prev => ({ ...prev, eventMessage: msg }));
    setIsGenerating(false);
  };

  const handleSubmit = () => {
    if (!formData.eventName || !formData.eventDate || !formData.eventLocation) {
      alert("Harap lengkapi informasi utama sebelum menerbitkan.");
      return;
    }
    const newInv: Invitation = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      ...formData,
      createdAt: new Date().toISOString()
    };
    storage.addInvitation(newInv);
    onNavigate('#/dashboard');
  };

  return (
    <div className="min-h-screen bg-cream py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <button onClick={() => step === 1 ? onNavigate('#/dashboard') : setStep(step - 1)} className="text-slate-600 font-bold hover:text-gold transition flex items-center gap-2">
            <i className="fas fa-arrow-left"></i> Kembali
          </button>
          <div className="flex gap-3">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={`w-10 h-1.5 rounded-full transition-all duration-500 ${step >= s ? 'bg-gold' : 'bg-gold/10'}`}></div>
            ))}
          </div>
        </header>

        {step === 1 && (
          <div className="animate-fade-up">
            <h1 className="text-4xl font-bold font-serif text-center mb-4">Pilih Kategori Acara</h1>
            <p className="text-center text-slate-400 mb-12">Setiap kategori memiliki desain eksklusif yang berbeda.</p>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { type: 'wedding', icon: 'fa-heart', label: 'Pernikahan', color: 'bg-gold' },
                { type: 'birthday', icon: 'fa-birthday-cake', label: 'Ulang Tahun', color: 'bg-pink-500' },
                { type: 'tahlilan', icon: 'fa-mosque', label: 'Tahlilan', color: 'bg-emerald-700' },
                { type: 'umkm', icon: 'fa-store', label: 'Bisnis/UMKM', color: 'bg-blue-700' }
              ].map(item => (
                <button 
                  key={item.type}
                  onClick={() => handleTypeSelect(item.type as EventType)}
                  className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:border-gold hover:shadow-2xl transition-all duration-500 group text-left"
                >
                  <div className={`w-16 h-16 ${item.color} text-white rounded-2xl flex items-center justify-center mb-8 text-2xl group-hover:scale-110 transition-transform shadow-lg`}>
                    <i className={`fas ${item.icon}`}></i>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{item.label}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Template premium dengan fitur RSVP otomatis untuk acara {item.label.toLowerCase()}.</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl animate-fade-up">
            <h2 className="text-3xl font-bold font-serif mb-10">Informasi Dasar</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nama Acara</label>
                  <input name="eventName" value={formData.eventName} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-gold transition-all outline-none" placeholder="Contoh: Pernikahan A & B" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Penyelenggara</label>
                  <input name="organizerName" value={formData.organizerName} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-gold transition-all outline-none" placeholder="Keluarga Besar..." />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Lokasi Lengkap</label>
                  <input name="eventLocation" value={formData.eventLocation} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-gold transition-all outline-none" placeholder="Gedung/Alamat..." />
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tanggal Acara</label>
                  <input type="date" name="eventDate" value={formData.eventDate} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-gold transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Waktu (WIB)</label>
                  <input type="time" name="eventTime" value={formData.eventTime} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-gold transition-all outline-none" />
                </div>
              </div>
            </div>
            <div className="mt-12 flex justify-end">
              <button onClick={() => setStep(3)} className="bg-gold text-white px-12 py-4 rounded-2xl font-bold hover:bg-opacity-90 shadow-xl transition active:scale-95">Lanjutkan ke Pesan</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl animate-fade-up">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-bold font-serif">Pesan Undangan</h2>
              <button 
                onClick={handleGenerateAI}
                disabled={isGenerating}
                className="bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-gold transition flex items-center gap-2 shadow-lg"
              >
                <i className={isGenerating ? "fas fa-spinner fa-spin" : "fas fa-wand-magic-sparkles"}></i>
                {isGenerating ? "AI Sedang Menulis..." : "Sempurnakan dengan AI"}
              </button>
            </div>
            <textarea 
              name="eventMessage" 
              value={formData.eventMessage} 
              onChange={handleInputChange} 
              rows={8}
              className="w-full px-8 py-6 rounded-[2rem] bg-slate-50 border-2 border-transparent focus:border-gold transition-all outline-none resize-none leading-relaxed italic text-lg shadow-inner"
              placeholder="Tuliskan pesan personal atau biarkan AI menuliskan untuk Anda..."
            ></textarea>
            <div className="mt-12 flex justify-between items-center">
              <button onClick={() => setStep(2)} className="text-slate-400 font-bold hover:text-slate-600 transition">Kembali</button>
              <button onClick={() => setStep(4)} className="bg-gold text-white px-12 py-4 rounded-2xl font-bold hover:bg-opacity-90 shadow-xl transition active:scale-95">Lanjutkan ke Foto</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl animate-fade-up">
            <h2 className="text-3xl font-bold font-serif mb-4">Galeri Foto Utama</h2>
            <p className="text-slate-400 mb-10">Upload foto terbaik Anda untuk dipajang di halaman depan undangan.</p>
            
            <div className="flex justify-center">
              <div className="w-full max-w-sm">
                <div className="relative aspect-[3/4] bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 overflow-hidden group hover:border-gold transition-all cursor-pointer">
                  {formData.photos[0] ? (
                    <>
                      <img src={formData.photos[0]} className="w-full h-full object-cover" alt="Cover Preview" />
                      <button 
                        onClick={() => setFormData({...formData, photos: []})}
                        className="absolute top-4 right-4 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </>
                  ) : (
                    <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <i className="fas fa-camera text-gold text-2xl"></i>
                      </div>
                      <span className="text-xs font-bold text-slate-400 tracking-[0.2em]">PILIH FOTO SAMPUL</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoUpload(e, 0)} />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-16 pt-8 border-t border-slate-50 flex justify-between items-center">
              <button onClick={() => setStep(3)} className="text-slate-400 font-bold hover:text-slate-600 transition">Kembali</button>
              <button 
                onClick={handleSubmit}
                className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-bold hover:bg-gold transition shadow-2xl transform hover:-translate-y-1 active:scale-95"
              >
                Terbitkan Undangan <i className="fas fa-paper-plane ml-2"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateInvitation;
