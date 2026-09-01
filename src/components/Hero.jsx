import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Play, Eye } from 'lucide-react';

export default function Hero() {
  const scrollToSection = (e, href) => {
    e.preventDefault();
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen pt-28 pb-16 flex items-center overflow-hidden bg-gradient-to-b from-purple-50/70 via-purple-50/20 to-white"
    >
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-leaf/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Left */}
          <motion.div
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center space-x-2 px-3 py-1.5 bg-purple-100/80 border border-purple-200/50 rounded-full text-primary text-xs font-extrabold tracking-wider uppercase backdrop-blur-sm shadow-sm"
            >
              <MapPin className="h-3.5 w-3.5 text-primary-dark" />
              <span>Desa Krejengan, Probolinggo</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight"
            >
              Monitoring <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">Pertumbuhan Anggur</span> Desa Krejengan
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Selamat datang di portal resmi pemantauan budidaya anggur KOMPAK (Komunitas Pembudidaya Anggur Krejengan). Kami menyajikan transparansi data pertumbuhan anggur dari kebun petani lokal di setiap sudut wilayah desa secara real-time.
            </motion.p>

            {/* Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
            >
              <a
                href="#gis-map"
                onClick={(e) => scrollToSection(e, '#gis-map')}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary to-primary-dark hover:from-primary/95 hover:to-primary-dark/95 text-white font-extrabold rounded-2xl shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <span>Lihat Peta GIS</span>
                <ArrowRight className="h-4.5 w-4.5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#profile"
                onClick={(e) => scrollToSection(e, '#profile')}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-2xl shadow-md border border-slate-100 hover:border-slate-200 hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <Eye className="h-4.5 w-4.5 text-slate-500 group-hover:text-primary transition-colors" />
                <span>Pelajari Profil Desa</span>
              </a>
            </motion.div>

            {/* Statistics */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-4 sm:gap-6 pt-8 max-w-md sm:max-w-xl mx-auto lg:mx-0 border-t border-purple-100"
            >
              <div className="text-center lg:text-left">
                <span className="block text-2xl sm:text-3xl font-display font-extrabold text-primary">10+</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Varietas Anggur</span>
              </div>
              <div className="text-center lg:text-left border-x border-purple-100 px-2">
                <span className="block text-2xl sm:text-3xl font-display font-extrabold text-leaf">5+</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Titik Kebun</span>
              </div>
              <div className="text-center lg:text-left">
                <span className="block text-2xl sm:text-3xl font-display font-extrabold text-gold">10+</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Petani Anggur</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Graphic/Image Right */}
          <motion.div
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Ambient Background Behind Image */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-primary to-leaf rounded-3xl blur-xl opacity-30 animate-pulse-slow" />
            
            <div className="relative bg-white p-3 rounded-3xl shadow-2xl border border-white/40 overflow-hidden group">
              <div className="absolute top-6 right-6 z-10 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full shadow-md text-xs font-bold text-slate-800 border border-purple-100">
                🍇 Panen Anggur Desa
              </div>
              <img
                src="/pahuda.png"
                alt="Kebun Anggur Desa Krejengan"
                className="w-full h-[320px] sm:h-[400px] object-cover rounded-2xl group-hover:scale-102 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/40 via-transparent to-transparent pointer-events-none rounded-2xl" />
            </div>
            
            {/* Small floating tag */}
            
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Inline fallback Leaf icon if it was missing from Lucide
function Leaf(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-9 8.2z" />
      <path d="M9 22v-4h-4" />
    </svg>
  );
}
