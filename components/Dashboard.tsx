
import React, { useState, useEffect } from 'react';
import { User, Invitation, RSVP } from '../types';
import { storage } from '../storage';

interface Props {
  user: User;
  onLogout: () => void;
  onNavigate: (to: string) => void;
}

const Dashboard: React.FC<Props> = ({ user, onLogout, onNavigate }) => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [allRsvps, setAllRsvps] = useState<RSVP[]>([]);

  useEffect(() => {
    setInvitations(storage.getInvitations().filter(i => i.userId === user.id));
    setAllRsvps(storage.getRSVPs());
  }, [user.id]);

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus undangan ini? Seluruh data RSVP juga akan dihapus.')) {
      storage.deleteInvitation(id);
      setInvitations(invitations.filter(i => i.id !== id));
    }
  };

  const getRSVPStats = (invitationId: string) => {
    const rsvps = allRsvps.filter(r => r.invitationId === invitationId);
    const attending = rsvps.filter(r => r.status === 'hadir').length;
    const pending = rsvps.filter(r => r.status === 'tidak').length;
    return { attending, pending };
  };

  const handleShare = (invitation: Invitation) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#/invite/${invitation.id}`;
    const shareText = `Halo! Saya mengundang Anda ke acara "${invitation.eventName}". Lihat detailnya di sini: ${shareUrl}`;
    
    if (navigator.share) {
      navigator.share({
        title: invitation.eventName,
        text: shareText,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Link undangan berhasil disalin ke clipboard!');
    }
  };

  const typeStyles = {
    wedding: 'from-[#C5A059] to-[#E2C285] text-white',
    birthday: 'from-pink-500 to-rose-400 text-white',
    tahlilan: 'from-emerald-800 to-emerald-600 text-white',
    umkm: 'from-blue-900 to-blue-700 text-white'
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#FDFBF7]">
      {/* Sidebar */}
      <div className="w-full md:w-72 bg-white shadow-[10px_0_30px_rgba(0,0,0,0.02)] p-8 flex flex-col z-20">
        <h2 className="text-3xl font-bold font-serif text-gold mb-16 flex items-center gap-3">
          <i className="fas fa-envelope-open-text"></i> InviteWeb
        </h2>
        <div className="mb-10">
          <p className="text-slate-300 text-[10px] uppercase font-black mb-6 tracking-[0.2em]">Menu Utama</p>
          <ul className="space-y-4">
            <li className="bg-gold/5 text-gold font-bold p-4 rounded-2xl flex items-center gap-4 cursor-default border border-gold/10">
              <i className="fas fa-th-large"></i> Undangan Saya
            </li>
            <li 
              onClick={() => onNavigate('#/create')}
              className="text-slate-500 hover:text-gold hover:bg-gold/5 transition p-4 rounded-2xl flex items-center gap-4 cursor-pointer group"
            >
              <i className="fas fa-plus-circle group-hover:scale-110 transition"></i> Buat Baru
            </li>
          </ul>
        </div>
        
        <div className="mt-auto pt-8 border-t border-slate-50">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold font-bold text-xl">
                    {user.name.charAt(0)}
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-800 leading-none mb-1">{user.name}</p>
                    <p className="text-[10px] text-slate-400 truncate w-32 uppercase tracking-tighter">{user.email}</p>
                </div>
            </div>
            <button 
                onClick={onLogout}
                className="w-full bg-slate-50 text-slate-400 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition duration-300"
            >
                Logout <i className="fas fa-sign-out-alt ml-2"></i>
            </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold font-serif text-slate-800 mb-2">Workspace Anda</h1>
            <p className="text-slate-400 text-sm">Anda memiliki {invitations.length} undangan aktif</p>
          </div>
          <button 
            onClick={() => onNavigate('#/create')}
            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition shadow-xl flex items-center gap-3 active:scale-95 transform"
          >
            <i className="fas fa-magic"></i> Buat Undangan Baru
          </button>
        </header>

        {invitations.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-24 text-center border-2 border-dashed border-slate-100 shadow-sm animate-in fade-in duration-700">
            <div className="w-24 h-24 bg-cream rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
              <i className="fas fa-feather-alt text-4xl text-gold/40"></i>
            </div>
            <h3 className="text-2xl font-bold font-serif mb-4">Mulai Perjalanan Anda</h3>
            <p className="text-slate-400 max-w-sm mx-auto mb-10 leading-relaxed text-sm">Buat undangan digital pertama Anda hari ini dan rasakan kemudahan mengelola acara secara profesional.</p>
            <button 
                onClick={() => onNavigate('#/create')}
                className="bg-gold text-white px-10 py-4 rounded-2xl font-bold hover:brightness-110 transition shadow-xl"
            >
                Mulai Sekarang
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {invitations.map((inv) => {
              const stats = getRSVPStats(inv.id);
              return (
                <div key={inv.id} className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-slate-50 hover:border-gold/30 hover:shadow-xl hover:shadow-gold/5 transition-all duration-500 group relative overflow-hidden">
                  {/* Category Badge Floating */}
                  <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-3xl bg-gradient-to-r ${typeStyles[inv.eventType] || typeStyles.wedding} text-[10px] font-black uppercase tracking-widest shadow-sm`}>
                    {inv.eventType}
                  </div>

                  <h3 className="text-2xl font-bold mb-4 text-slate-800 font-serif leading-tight pr-10">{inv.eventName}</h3>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                        <i className="fas fa-calendar-alt text-gold"></i>
                      </div>
                      <span className="font-medium">{inv.eventDate} • {inv.eventTime}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                        <i className="fas fa-map-marker-alt text-gold"></i>
                      </div>
                      <span className="font-medium truncate max-w-[200px]">{inv.eventLocation}</span>
                    </div>
                  </div>
                  
                  {/* Stats Card */}
                  <div className="grid grid-cols-2 gap-px bg-slate-100 rounded-3xl overflow-hidden mb-8 border border-slate-100">
                    <div className="bg-slate-50/50 p-4 text-center">
                      <p className="text-2xl font-black text-slate-800">{stats.attending}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Confirmed</p>
                    </div>
                    <div className="bg-slate-50/50 p-4 text-center">
                      <p className="text-2xl font-black text-slate-400">{stats.pending}</p>
                      <p className="text-[10px] text-slate-300 uppercase font-black tracking-widest">Declined</p>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="flex gap-3">
                    <button 
                      onClick={() => onNavigate(`#/invite/${inv.id}`)}
                      className="flex-1 bg-white border-2 border-slate-100 text-slate-700 py-3 rounded-2xl font-bold hover:border-gold hover:text-gold transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                    >
                      Preview <i className="fas fa-external-link-alt text-xs group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition transform"></i>
                    </button>
                    <button 
                      onClick={() => handleShare(inv)}
                      className="w-12 h-12 flex items-center justify-center bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all duration-300"
                      title="Share Link"
                    >
                      <i className="fas fa-share-nodes"></i>
                    </button>
                    <button 
                      onClick={() => handleDelete(inv.id)}
                      className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300"
                      title="Delete"
                    >
                      <i className="fas fa-trash-can text-sm"></i>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
