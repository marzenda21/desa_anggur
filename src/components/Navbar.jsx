import React, { useState, useEffect } from 'react';
import { Leaf, Home, BookOpen, Map, Image as ImageIcon, FileText, User, LogIn, Settings } from 'lucide-react';

export default function Navbar({ isLoggedIn, onLoginClick, onDashboardClick, onLogout }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('#home');

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

  // IntersectionObserver to auto-highlight active bottom bar tabs based on scrolling position
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-80px 0px -50% 0px', // Adjust to trigger when section passes the top menu offset
      threshold: 0.1
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveTab(`#${entry.target.id}`);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = ['home', 'profile', 'gis-map', 'gallery', 'articles', 'contact'];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setActiveTab(href);
    const targetElement = document.querySelector(href);
    if (targetElement) {
      const offset = 80; // height of sticky navbar
      const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navLinks = [
    { name: 'Beranda', href: '#home', icon: <Home className="h-5 w-5" /> },
    { name: 'Profil', href: '#profile', icon: <BookOpen className="h-5 w-5" /> },
    { name: 'Peta GIS', href: '#gis-map', icon: <Map className="h-5 w-5" /> },
    { name: 'Galeri', href: '#gallery', icon: <ImageIcon className="h-5 w-5" /> },
    { name: 'Artikel', href: '#articles', icon: <FileText className="h-5 w-5" /> },
  ];

  return (
    <>
      {/* 1. TOP HEADER MOBILE (Branding Only) */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-purple-50 z-[9999] flex items-center justify-between px-4 shadow-sm">
        <a href="#home" onClick={(e) => handleLinkClick(e, '#home')} className="flex items-center space-x-2">
          <div className="p-1.5 bg-gradient-to-tr from-primary to-leaf rounded-lg shadow-sm">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-display font-black text-sm tracking-tight text-primary uppercase">
              Krejengan
            </span>
            <span className="font-sans block text-[9px] font-bold text-leaf tracking-widest -mt-0.5 uppercase">
              Desa Anggur
            </span>
          </div>
        </a>
        
        {isLoggedIn ? (
          <button
            onClick={onDashboardClick}
            className="flex items-center space-x-1 px-3 py-1.5 bg-purple-50 text-primary rounded-xl text-xs font-bold border border-purple-100 cursor-pointer"
          >
            <Settings className="h-3.5 w-3.5" />
            <span>Panel</span>
          </button>
        ) : (
          <button
            onClick={onLoginClick}
            className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Masuk</span>
          </button>
        )}
      </header>

      {/* 2. DESKTOP HEADER (Top Sticky Navbar) */}
      <nav
        className={`hidden md:block fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${
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
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    activeTab === link.href
                      ? 'text-primary bg-purple-50/50 font-bold'
                      : 'text-slate-700 hover:text-primary hover:bg-purple-50/30'
                  }`}
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
          </div>
        </div>
      </nav>

      {/* 3. MOBILE BOTTOM NAVIGATION BAR */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-purple-100 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] z-[9999] select-none"
        style={{ paddingBottom: 'calc(0.25rem + env(safe-area-inset-bottom))' }}
      >
        <div className="flex justify-around items-center h-16 px-1">
          {navLinks.map((link) => {
            const isActive = activeTab === link.href;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all ${
                  isActive ? 'text-primary scale-105' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-purple-50 text-primary' : 'bg-transparent'}`}>
                  {link.icon}
                </div>
                <span className={`text-[10px] font-bold mt-0.5 tracking-tight ${isActive ? 'text-primary font-extrabold' : 'text-slate-500 font-semibold'}`}>
                  {link.name}
                </span>
              </a>
            );
          })}
          
          {/* Mobile bottom bar user action */}
          {isLoggedIn ? (
            <button
              onClick={onDashboardClick}
              className="flex flex-col items-center justify-center flex-1 h-full py-1 text-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <div className="p-1 rounded-xl bg-transparent">
                <User className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold mt-0.5 text-slate-500 font-semibold tracking-tight">
                Admin
              </span>
            </button>
          ) : (
            <button
              onClick={onLoginClick}
              className="flex flex-col items-center justify-center flex-1 h-full py-1 text-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <div className="p-1 rounded-xl bg-transparent">
                <User className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold mt-0.5 text-slate-500 font-semibold tracking-tight">
                Masuk
              </span>
            </button>
          )}
        </div>
      </nav>
    </>
  );
}
