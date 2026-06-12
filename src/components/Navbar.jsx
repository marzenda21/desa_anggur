import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Leaf } from 'lucide-react';

const navLinks = [
  { name: 'Beranda', href: '#home' },
  { name: 'Profil', href: '#profile' },
  { name: 'Peta GIS', href: '#gis-map' },
  { name: 'Galeri', href: '#gallery' },
  { name: 'Artikel', href: '#articles' },
  { name: 'Kontak', href: '#contact' },
];

export default function Navbar({ isLoggedIn, onLoginClick, onDashboardClick, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    
    const targetElement = document.querySelector(href);
    if (targetElement) {
      const offset = 80; // tinggi sticky navbar
      const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }

    // Berikan sedikit jeda sebelum menutup drawer agar propagasi event touch
    // tidak dibatalkan secara prematur oleh beberapa peramban mobile (seperti Android Chrome)
    setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-md shadow-md py-3 border-b border-purple-100'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => handleLinkClick(e, '#home')}
            className="flex items-center space-x-2 group"
          >
            <div className="p-2 bg-gradient-to-tr from-primary to-leaf rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="font-display font-extrabold text-xl tracking-tight text-primary bg-clip-text">
                KREJENGAN
              </span>
              <span className="font-sans block text-xs font-semibold text-leaf tracking-wider -mt-1 uppercase">
                Monitoring Anggur
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-primary hover:bg-purple-50/50 transition-all duration-200"
              >
                {link.name}
              </a>
            ))}
            {isLoggedIn ? (
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={onDashboardClick}
                  className="px-5 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/35 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                >
                  Dashboard
                </button>
                <button
                  onClick={onLogout}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-all cursor-pointer"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="ml-4 px-5 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/35 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                Masuk
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-700 hover:text-primary hover:bg-purple-50/50 focus:outline-none transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-lg border-b border-purple-100 overflow-hidden shadow-inner"
          >
            <div className="px-4 pt-3 pb-6 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="block px-4 py-3 rounded-xl text-base font-semibold text-slate-700 hover:text-primary hover:bg-purple-50 transition-colors"
                >
                  {link.name}
                </a>
              ))}
              {isLoggedIn ? (
                <div className="space-y-2 pt-2 border-t border-purple-100/50">
                  <button
                    onClick={onDashboardClick}
                    className="block w-full text-center px-5 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl text-base font-bold shadow-md cursor-pointer"
                  >
                    Dashboard Admin
                  </button>
                  <button
                    onClick={onLogout}
                    className="block w-full text-center px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-base font-bold cursor-pointer"
                  >
                    Keluar
                  </button>
                </div>
              ) : (
                <button
                  onClick={onLoginClick}
                  className="block w-full text-center mt-4 px-5 py-3.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl text-base font-bold shadow-md cursor-pointer"
                >
                  Masuk
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
