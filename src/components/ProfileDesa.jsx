import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, BookOpen, Users } from 'lucide-react';

// Custom inline Youtube icon since brand icons are deprecated in newer lucide versions
const YoutubeIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.53 3.5 12 3.5 12 3.5s-7.53 0-9.388.555A3.003 3.003 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.47 20.5 12 20.5 12 20.5s7.53 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.93 24 12 24 12s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export default function ProfileDesa() {
  // Sample Youtube video ID about grape farming. Can be replaced by the user.
  const youtubeVideoId = "g0U2wVw4_mY"; 

  return (
    <section id="profile" className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-purple-50/30" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-leaf uppercase tracking-widest mb-3">Selayang Pandang</h2>
          <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
            Profil Desa Anggur Krejengan
          </h3>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-leaf mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Panel: Profile Description */}
          <motion.div 
            className="lg:col-span-6 space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h4 className="font-display text-2xl font-bold text-slate-800 leading-tight">
              Mengembalikan Kejayaan Anggur Probolinggo Melalui Inovasi Desa
            </h4>
            
            <p className="text-slate-600 leading-relaxed">
              Kabupaten Probolinggo sejak lama dikenal sebagai ikon penghasil buah anggur berkualitas. Namun, seiring waktu, populasi tanaman anggur sempat menyusut. Desa Krejengan mengambil langkah berani dengan mencanangkan gerakan budidaya anggur secara masif sejak beberapa tahun lalu.
            </p>

            <p className="text-slate-600 leading-relaxed">
              Dipusatkan di sekitar Perpustakaan Desa Aqila, program ini melahirkan KOMPAK (Komunitas Pembudidaya Anggur Krejengan). Komunitas ini menjadi wadah edukasi warga dalam membudidayakan lebih dari 10 varietas anggur di pekarangan rumah, dengan bimbingan teknologi modern dan pemantauan terstruktur.
            </p>

            {/* Quick highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="flex items-center space-x-3 p-3 bg-purple-50/50 rounded-2xl border border-purple-100/50">
                <BookOpen className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <span className="block text-xs font-extrabold text-slate-800">Pusat Edukasi</span>
                  <span className="text-[10px] text-slate-500">Perpus Aqila</span>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                <Users className="h-5 w-5 text-leaf shrink-0" />
                <div>
                  <span className="block text-xs font-extrabold text-slate-800">Komunitas</span>
                  <span className="text-[10px] text-slate-500">KOMPAK Desa</span>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-amber-50/50 rounded-2xl border border-amber-100/50">
                <Calendar className="h-5 w-5 text-amber-500 shrink-0" />
                <div>
                  <span className="block text-xs font-extrabold text-slate-800">Agrowisata</span>
                  <span className="text-[10px] text-slate-500">Petik Mandiri</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Panel: YouTube Video Embed */}
          <motion.div 
            className="lg:col-span-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative bg-slate-900 p-2 rounded-3xl shadow-xl border border-slate-100 overflow-hidden group">
              {/* Outer frame */}
              <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-bold">
                <YoutubeIcon className="h-4 w-4 text-red-500" />
                <span>Dokumentasi Desa Krejenggan</span>
              </div>
              
              {/* Responsive Iframe Container */}
              <div className="relative pb-[56.25%] h-0 rounded-2xl overflow-hidden shadow-inner bg-slate-950">
                <iframe
                  className="absolute top-0 left-0 w-full h-full border-0"
                  src={`https://www.youtube.com/embed/AKjXdIeiT9s?si=6UnlDUPVgMwwbtAB`}
                  title="Dokumentasi Budidaya Anggur Desa Krejengan"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            <p className="text-center text-xs text-slate-500 mt-3 italic">
              *Tonton video profile desa Krejengan.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
