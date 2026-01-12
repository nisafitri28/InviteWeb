
import React from 'react';

interface Props {
  onNavigate: (to: string) => void;
}

const LandingPage: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="bg-[#FDFBF7] min-h-screen selection:bg-gold selection:text-white">
      <nav className="fixed w-full bg-white/70 backdrop-blur-2xl py-5 px-8 flex justify-between items-center z-50 border-b border-white/50">
        <h1 className="text-3xl font-bold font-serif text-gold flex items-center gap-3">
          <i className="fas fa-envelope-open-text"></i> InviteWeb
        </h1>
        <div className="flex items-center gap-8">
          <button onClick={() => onNavigate('#/login')} className="text-slate-500 font-bold uppercase tracking-widest text-[10px] hover:text-gold transition hidden md:block">Login Member</button>
          <button onClick={() => onNavigate('#/register')} className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-gold transition shadow-xl shadow-slate-900/10 text-xs uppercase tracking-widest">Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 container mx-auto text-center overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-gold/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl -z-10 animate-pulse delay-700"></div>

        <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <p className="text-gold font-black uppercase tracking-[0.5em] text-[10px] mb-8">Digital Invitation Platform</p>
            <h2 className="text-6xl md:text-8xl font-bold font-serif text-slate-900 mb-8 leading-[1.1]">
              Elevate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-[#B8941F]">Celebration.</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-14 leading-relaxed font-light">
              InviteWeb Pro menghadirkan pengalaman undangan digital termewah untuk momen paling berharga dalam hidup Anda. Didukung oleh AI, dikelola dengan sempurna.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <button 
                  onClick={() => onNavigate('#/register')}
                  className="bg-gold text-white px-12 py-5 rounded-2xl text-sm font-black uppercase tracking-widest hover:scale-105 transition transform shadow-[0_20px_50px_rgba(212,175,55,0.3)] active:scale-95"
                >
                  Create Your Invitation
                </button>
                <button 
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white text-slate-800 px-12 py-5 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-slate-50 transition border border-slate-100 shadow-sm"
                >
                  Explore Features
                </button>
            </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 bg-white relative z-10 rounded-t-[5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.02)]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <p className="text-gold font-black uppercase tracking-[0.3em] text-[10px] mb-4">Kenapa Kami?</p>
            <h3 className="text-4xl md:text-5xl font-bold font-serif text-slate-800">Kualitas Tanpa Kompromi</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="p-12 rounded-[3rem] bg-[#FDFBF7] border border-slate-50 hover:shadow-2xl hover:shadow-gold/10 transition-all duration-500 group">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-gold group-hover:text-white transition-all duration-500 text-gold text-2xl">
                <i className="fas fa-wand-magic-sparkles"></i>
              </div>
              <h4 className="text-xl font-bold mb-6 font-serif">AI Magic Text</h4>
              <p className="text-slate-500 leading-relaxed text-sm">Bingung merangkai kata? AI kami akan menuliskan pesan undangan yang puitis dan personal hanya untuk Anda.</p>
            </div>
            
            <div className="p-12 rounded-[3rem] bg-[#FDFBF7] border border-slate-50 hover:shadow-2xl hover:shadow-gold/10 transition-all duration-500 group">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-gold group-hover:text-white transition-all duration-500 text-gold text-2xl">
                <i className="fas fa-fingerprint"></i>
              </div>
              <h4 className="text-xl font-bold mb-6 font-serif">Smart RSVP Hub</h4>
              <p className="text-slate-500 leading-relaxed text-sm">Kelola daftar tamu dari satu dashboard pusat. Dapatkan notifikasi kehadiran secara instan dan akurat.</p>
            </div>

            <div className="p-12 rounded-[3rem] bg-[#FDFBF7] border border-slate-50 hover:shadow-2xl hover:shadow-gold/10 transition-all duration-500 group">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-gold group-hover:text-white transition-all duration-500 text-gold text-2xl">
                <i className="fas fa-gem"></i>
              </div>
              <h4 className="text-xl font-bold mb-6 font-serif">Premium Themes</h4>
              <p className="text-slate-500 leading-relaxed text-sm">Koleksi desain eksklusif yang dirancang oleh desainer profesional untuk menjamin estetika undangan Anda.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-slate-950 text-white">
        <div className="container mx-auto px-8 text-center">
            <h4 className="text-3xl font-serif font-bold text-gold mb-8">InviteWeb Pro</h4>
            <p className="text-slate-500 max-w-lg mx-auto mb-12 text-sm">Platform undangan digital nomor #1 di Indonesia untuk kualitas dan kemudahan.</p>
            <div className="flex justify-center gap-8 mb-16">
                <i className="fab fa-instagram text-2xl text-slate-600 hover:text-gold transition cursor-pointer"></i>
                <i className="fab fa-facebook text-2xl text-slate-600 hover:text-gold transition cursor-pointer"></i>
                <i className="fab fa-twitter text-2xl text-slate-600 hover:text-gold transition cursor-pointer"></i>
            </div>
            <p className="text-[10px] text-slate-700 uppercase tracking-widest">&copy; 2024 InviteWeb Pro. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
