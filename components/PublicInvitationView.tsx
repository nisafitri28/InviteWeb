
import React, { useState, useEffect } from 'react';
import { Invitation, RSVP } from '../types';
import { storage } from '../storage';

interface Props {
  invitationId: string;
  onNavigate: (to: string) => void;
}

const PublicInvitationView: React.FC<Props> = ({ invitationId, onNavigate }) => {
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [isRsvped, setIsRsvped] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  const [rsvpData, setRsvpData] = useState({
    guestName: '',
    guestEmail: '',
    status: 'hadir' as 'hadir' | 'tidak',
    message: ''
  });

  useEffect(() => {
    const inv = storage.getInvitations().find(i => i.id === invitationId);
    if (inv) {
      setInvitation(inv);
      setRsvps(storage.getRSVPs().filter(r => r.invitationId === invitationId));
      
      const timer = setInterval(() => {
        const eventDate = new Date(`${inv.eventDate}T${inv.eventTime}`).getTime();
        const now = new Date().getTime();
        const distance = eventDate - now;

        if (distance < 0) {
          clearInterval(timer);
        } else {
          setTimeLeft({
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000)
          });
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [invitationId]);

  const handleRSVP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitation) return;

    const newRsvp: RSVP = {
      id: Math.random().toString(36).substr(2, 9),
      invitationId: invitation.id,
      guestName: rsvpData.guestName,
      guestEmail: rsvpData.guestEmail,
      status: rsvpData.status,
      message: rsvpData.message,
      createdAt: new Date().toISOString()
    };
    storage.addRSVP(newRsvp);
    setRsvps([newRsvp, ...rsvps]);
    setIsRsvped(true);

    const phoneNumber = "6285782559412";
    const statusText = rsvpData.status === 'hadir' ? 'bersedia hadir' : 'belum bisa hadir';
    const waMessage = `saya ${rsvpData.guestName} ${statusText}`;
    const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(waMessage)}`;
    
    window.open(waUrl, '_blank');
  };

  if (!invitation) return <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] font-serif text-[#D4AF37] text-xl animate-pulse">Menyiapkan Pengalaman Eksklusif...</div>;

  const themes = {
    wedding: {
      bg: 'bg-[#000000]',
      pattern: 'opacity-5 pointer-events-none absolute inset-0 bg-[url("https://www.transparenttextures.com/patterns/black-paper.png")]',
      card: 'bg-[#0a0a0a] border-x border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.9)]',
      accent: 'text-[#D4AF37]',
      accentBg: 'bg-[#D4AF37]',
      accentBorder: 'border-[#D4AF37]',
      fontTitle: 'font-script',
      imgStyle: 'w-full h-[400px] object-cover rounded-[2.5rem]',
      ornamentTop: (
        <div className="absolute top-0 right-0 p-2 opacity-30 pointer-events-none z-20">
          <img src="https://www.transparentpng.com/download/gold-leaf/gold-leaf-flower-vector-design-8.png" className="w-40 h-40 object-contain filter brightness-125" alt="ornament" />
        </div>
      ),
      ornamentBottom: (
        <div className="absolute bottom-0 left-0 p-2 opacity-30 pointer-events-none rotate-180 z-20">
          <img src="https://www.transparentpng.com/download/gold-leaf/gold-leaf-flower-vector-design-8.png" className="w-40 h-40 object-contain filter brightness-125" alt="ornament" />
        </div>
      )
    },
    birthday: {
      bg: 'bg-rose-50',
      pattern: 'opacity-10 absolute inset-0 bg-[url("https://www.transparenttextures.com/patterns/cubes.png")]',
      card: 'bg-white shadow-2xl',
      accent: 'text-rose-500',
      accentBg: 'bg-rose-500',
      accentBorder: 'border-rose-500',
      fontTitle: 'font-serif',
      imgStyle: 'w-full h-80 object-cover rounded-[2rem]',
      ornamentTop: null, ornamentBottom: null
    },
    tahlilan: {
      bg: 'bg-[#F9F7F2]',
      pattern: 'opacity-40 pointer-events-none absolute inset-0 bg-[url("https://www.transparenttextures.com/patterns/pinstriped-suit.png")]',
      card: 'bg-[#FDFBF7] border-white shadow-2xl',
      accent: 'text-[#9C7F48]',
      accentBg: 'bg-[#9C7F48]',
      accentBorder: 'border-[#9C7F48]',
      fontTitle: 'font-script',
      imgStyle: 'w-48 h-48 md:w-64 md:h-64 object-cover rounded-full border-4 border-[#D4AF37]/20 shadow-xl mx-auto',
      ornamentTop: (
        <div className="absolute top-0 left-0 p-0 opacity-80 pointer-events-none z-20">
          <img src="https://images.unsplash.com/photo-1596135248967-0c7f897b5f92?q=80&w=200&auto=format&fit=crop" className="w-32 h-32 object-contain filter hue-rotate-[250deg] saturate-150 rotate-[-45deg]" alt="floral" />
        </div>
      ),
      ornamentBottom: (
        <div className="absolute bottom-0 right-0 p-0 opacity-80 pointer-events-none z-20">
          <img src="https://images.unsplash.com/photo-1596135248967-0c7f897b5f92?q=80&w=200&auto=format&fit=crop" className="w-32 h-32 object-contain filter hue-rotate-[250deg] saturate-150 rotate-[135deg]" alt="floral" />
        </div>
      ),
      customIntro: (inv: Invitation, mainImg: string, onOpen: () => void) => (
        <div className="max-w-md w-full text-center z-10 animate-fade-up px-4">
          <div className="bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-[2rem] shadow-2xl border border-slate-100 relative overflow-hidden">
             {/* Corner Florals */}
             <img src="https://images.unsplash.com/photo-1596135248967-0c7f897b5f92?q=80&w=200&auto=format&fit=crop" className="absolute top-0 left-0 w-24 h-24 filter hue-rotate-[250deg] opacity-60" alt="flower" />
             <img src="https://images.unsplash.com/photo-1596135248967-0c7f897b5f92?q=80&w=200&auto=format&fit=crop" className="absolute top-0 right-0 w-24 h-24 filter hue-rotate-[250deg] opacity-60 rotate-90" alt="flower" />
             
             <p className="text-[10px] font-bold text-slate-500 tracking-[0.4em] mb-4 uppercase">Undangan Tasyakuran</p>
             
             <div className="mb-8 relative inline-block">
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-2 border-[#D4AF37]/30 p-2 overflow-hidden bg-white">
                  <img src={mainImg} className="w-full h-full object-cover rounded-full" alt="Almarhum/ah" />
                </div>
                {/* Sparkles */}
                <div className="absolute top-0 right-0 text-[#D4AF37] opacity-60 animate-pulse">✦</div>
                <div className="absolute bottom-4 left-0 text-[#D4AF37] opacity-60 animate-pulse delay-500">✦</div>
             </div>

             <p className="text-slate-600 text-[11px] mb-2 font-serif italic">Mengenang 100 Hari Kepergian</p>
             <h2 className={`text-4xl md:text-5xl font-script text-[#9C7F48] mb-8 leading-tight`}>{inv.eventName}</h2>
             
             <p className="text-slate-400 mb-2 text-[9px] uppercase tracking-[0.3em]">Kepada Yth. Bapak/Ibu/Saudara/i,</p>
             <h3 className="text-lg font-bold text-slate-800 mb-10">Tamu Undangan</h3>
             
             <button 
                onClick={onOpen}
                className="bg-[#9C7F48] text-white w-full py-4 rounded-full font-bold uppercase tracking-widest text-xs shadow-xl hover:scale-105 transition transform active:scale-95"
              >
                BUKA UNDANGAN
              </button>
              <p className="mt-6 text-[8px] text-slate-400 italic">Mohon maaf jika ada kesalahan penulisan nama & gelar</p>
          </div>
        </div>
      )
    },
    umkm: {
      bg: 'bg-blue-50',
      pattern: 'opacity-5 absolute inset-0 bg-[url("https://www.transparenttextures.com/patterns/diagmonds-light.png")]',
      card: 'bg-white shadow-xl',
      accent: 'text-blue-900',
      accentBg: 'bg-blue-900',
      accentBorder: 'border-blue-900',
      fontTitle: 'font-sans',
      imgStyle: 'w-full h-80 object-cover rounded-[2rem]',
      ornamentTop: null, ornamentBottom: null
    }
  };

  const theme = themes[invitation.eventType] || themes.wedding;
  const mainImg = invitation.photos?.[0] || (invitation.eventType === 'tahlilan' 
    ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=688&auto=format&fit=crop'
    : 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop');

  if (!isOpen) {
    if (invitation.eventType === 'tahlilan' && themes.tahlilan.customIntro) {
      return (
        <div className={`min-h-screen flex items-center justify-center ${theme.bg} relative overflow-hidden`}>
          <div className={theme.pattern}></div>
          {themes.tahlilan.customIntro(invitation, mainImg, () => setIsOpen(true))}
        </div>
      );
    }

    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${theme.bg} relative overflow-hidden`}>
        <div className={theme.pattern}></div>
        {theme.ornamentTop}
        <div className="max-w-md w-full text-center z-10 animate-fade-up">
          <div className={`${invitation.eventType === 'wedding' ? 'bg-[#111111]/90' : 'bg-white/90'} backdrop-blur-xl p-10 md:p-14 rounded-[3.5rem] shadow-2xl border border-white/10`}>
            <div className="mb-10 relative">
                <img src={mainImg} className="w-52 h-72 object-cover rounded-[2.5rem] mx-auto shadow-2xl border-2 border-[#D4AF37]/30" alt="Cover" />
                <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-12 ${theme.accentBg} rounded-full flex items-center justify-center shadow-lg`}>
                  <i className={`fas ${invitation.eventType === 'wedding' ? 'fa-heart' : 'fa-envelope'} text-black`}></i>
                </div>
            </div>
            <h2 className={`text-4xl md:text-5xl ${theme.fontTitle} ${theme.accent} mb-8`}>{invitation.eventName}</h2>
            <p className="text-slate-400 mb-2 text-[10px] uppercase tracking-[0.3em]">Kepada Yth. Bapak/Ibu/Saudara/i,</p>
            <h3 className="text-xl font-bold text-white mb-10">Tamu Undangan</h3>
            
            <button 
              onClick={() => setIsOpen(true)}
              className={`${theme.accentBg} text-black w-full py-4 rounded-full font-bold uppercase tracking-widest text-xs shadow-xl hover:scale-105 transition transform active:scale-95`}
            >
              <i className="fas fa-arrow-right mr-2"></i> BUKA UNDANGAN
            </button>
          </div>
        </div>
        {theme.ornamentBottom}
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-6 md:py-12 px-4 ${theme.bg} relative overflow-x-hidden transition-colors duration-700`}>
      <div className={theme.pattern}></div>
      <div className={`max-w-md mx-auto rounded-[3rem] overflow-hidden relative z-10 animate-fade-up ${theme.card}`}>
        <div className="p-8 md:p-10 text-center relative">
          {theme.ornamentTop}
          
          <div className="mb-12">
            <div className="mb-8 relative">
                <img src={mainImg} className={theme.imgStyle} alt="Main Image" />
                {invitation.eventType === 'tahlilan' && (
                    <div className="mt-6 space-y-2">
                        <h1 className={`text-5xl md:text-6xl ${theme.fontTitle} ${theme.accent} leading-tight`}>{invitation.eventName}</h1>
                    </div>
                )}
            </div>
            
            {invitation.eventType !== 'tahlilan' && (
                <h1 className={`text-5xl md:text-6xl ${theme.fontTitle} ${theme.accent} mb-4 leading-tight`}>{invitation.eventName}</h1>
            )}
            
            <div className="w-12 h-0.5 bg-[#D4AF37]/30 mx-auto mb-6"></div>
            <p className="text-slate-500 text-sm leading-relaxed italic px-4">"{invitation.eventMessage}"</p>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-16 bg-white/10 p-5 rounded-[2rem] border border-white/5 shadow-inner">
            {[
              { val: timeLeft.days, label: 'HARI' },
              { val: timeLeft.hours, label: 'JAM' },
              { val: timeLeft.minutes, label: 'MENIT' },
              { val: timeLeft.seconds, label: 'DETIK' }
            ].map(t => (
              <div key={t.label}>
                <p className="text-xl font-bold text-[#D4AF37]">{t.val}</p>
                <p className="text-[7px] tracking-widest text-slate-500 font-bold">{t.label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-12 mb-20 text-left relative z-20">
            <div className="relative pl-6 border-l-2 border-[#D4AF37]/30 group">
              <h4 className={`text-4xl ${theme.fontTitle} ${theme.accent} mb-6`}>Detail Acara</h4>
              
              <div className="space-y-6">
                <div>
                  <p className="text-[11px] uppercase font-black tracking-widest text-[#D4AF37] mb-1">Lokasi</p>
                  <p className={`${invitation.eventType === 'wedding' ? 'text-white' : 'text-slate-800'} font-semibold text-sm leading-relaxed`}>{invitation.eventLocation}</p>
                </div>
                
                <div>
                  <p className="text-[11px] uppercase font-black tracking-widest text-[#D4AF37] mb-1">Tanggal & Waktu</p>
                  <p className={`${invitation.eventType === 'wedding' ? 'text-white' : 'text-slate-800'} font-semibold text-sm`}>{invitation.eventDate}</p>
                  <p className="text-slate-400 text-sm">{invitation.eventTime} WIB - Selesai</p>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(invitation.eventLocation)}`} 
                    target="_blank"
                    className={`${theme.accentBg} text-white py-3 rounded-full font-bold text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-lg hover:brightness-110 transition`}
                  >
                    <i className="fas fa-location-dot"></i> GOOGLE MAP
                  </a>
                </div>
              </div>
            </div>

            <div className="relative pl-6 border-l-2 border-[#D4AF37]/30">
               <h4 className={`text-4xl ${theme.fontTitle} ${theme.accent} mb-4`}>Penyelenggara</h4>
               <p className={`text-2xl font-bold ${invitation.eventType === 'wedding' ? 'text-white' : 'text-slate-800'} mb-2`}>{invitation.organizerName}</p>
               <p className="text-slate-500 text-xs italic">Mengharapkan kehadiran serta doa dari Bapak/Ibu/Saudara/i.</p>
            </div>
          </div>

          {invitation.eventType !== 'tahlilan' && (
            <>
              <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 mb-16 shadow-inner text-left">
                {!isRsvped ? (
                  <form onSubmit={handleRSVP} className="space-y-5">
                    <h4 className={`text-2xl font-bold ${theme.accent} mb-6 text-center font-serif`}>Konfirmasi RSVP</h4>
                    <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-4">Nama Lengkap</label>
                        <input 
                        placeholder="Masukkan nama Anda" 
                        required 
                        className="w-full px-6 py-4 rounded-xl bg-white text-slate-800 border border-slate-200 outline-none focus:border-[#D4AF37] text-sm"
                        value={rsvpData.guestName}
                        onChange={(e) => setRsvpData({...rsvpData, guestName: e.target.value})}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-4">Pesan Singkat</label>
                        <textarea 
                        placeholder="Tulis ucapan/doa..." 
                        className="w-full px-6 py-4 rounded-xl bg-white text-slate-800 border border-slate-200 outline-none focus:border-[#D4AF37] h-24 resize-none text-sm"
                        value={rsvpData.message}
                        onChange={(e) => setRsvpData({...rsvpData, message: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        type="button" 
                        onClick={() => setRsvpData({...rsvpData, status: 'hadir'})} 
                        className={`py-3 rounded-xl font-bold text-[11px] transition-all tracking-widest ${rsvpData.status === 'hadir' ? 'bg-[#9C7F48] text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'}`}
                      >
                        HADIR
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setRsvpData({...rsvpData, status: 'tidak'})} 
                        className={`py-3 rounded-xl font-bold text-[11px] transition-all tracking-widest ${rsvpData.status === 'tidak' ? 'bg-red-800 text-white' : 'bg-white text-slate-400 border border-slate-100'}`}
                      >
                        ABSEN
                      </button>
                    </div>
                    <button type="submit" className="w-full py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] bg-[#9C7F48] text-white shadow-2xl active:scale-95 transition">Kirim Konfirmasi</button>
                  </form>
                ) : (
                  <div className="text-center py-6 animate-fade-up">
                    <div className="w-14 h-14 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-check text-xl text-emerald-500"></i>
                    </div>
                    <h4 className="text-xl font-bold text-slate-800 mb-2">Terima Kasih!</h4>
                    <p className="text-slate-500 text-xs">Konfirmasi Anda telah terkirim via WhatsApp.</p>
                  </div>
                )}
              </div>

              <div className="text-left mb-16">
                <h4 className={`text-4xl ${theme.fontTitle} ${theme.accent} mb-8 border-b border-slate-100 pb-4`}>Buku Tamu</h4>
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  {rsvps.map(r => (
                    <div key={r.id} className="bg-white p-5 rounded-2xl border border-slate-50 shadow-sm animate-fade-up">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-bold text-slate-800 text-xs">{r.guestName}</p>
                        <span className={`text-[7px] px-2 py-0.5 rounded-full uppercase font-black ${r.status === 'hadir' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                          {r.status === 'hadir' ? 'Hadir' : 'Absen'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 italic">"{r.message || 'Semoga acara berjalan lancar dan penuh berkah.'}"</p>
                    </div>
                  ))}
                  {rsvps.length === 0 && <p className="text-center text-slate-300 text-[10px] py-10 tracking-widest uppercase">Belum ada ucapan</p>}
                </div>
              </div>
            </>
          )}

          <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col items-center">
             <div className="flex gap-6 mb-8">
                <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent('Saya mengundang Anda ke acara tasyakuran: ' + window.location.href)}`)} 
                        className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition">
                    <i className="fab fa-whatsapp text-lg"></i>
                </button>
                <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Link disalin!"); }} 
                        className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-lg hover:scale-110 transition">
                    <i className="fas fa-link text-lg"></i>
                </button>
             </div>
             <p className="text-[8px] uppercase font-black text-slate-300 tracking-[0.6em]">Powered by InviteWeb Pro</p>
          </div>
        </div>
        {theme.ornamentBottom}
      </div>
    </div>
  );
};

export default PublicInvitationView;
