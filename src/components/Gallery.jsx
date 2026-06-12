import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Eye, Sparkles } from 'lucide-react';

export default function Gallery({ gallery = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedImage, setSelectedImage] = useState(null);

  const categories = ['Semua', 'Kebun', 'Varietas', 'Kegiatan'];

  const filteredItems = selectedCategory === 'Semua'
    ? gallery
    : gallery.filter(item => item.category === selectedCategory);

  return (
    <section id="gallery" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-leaf uppercase tracking-widest mb-3">Dokumentasi Visual</h2>
          <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
            Galeri Budidaya Anggur Desa
          </h3>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-leaf mx-auto mt-4 rounded-full" />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-purple-500/20'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid Images */}
        <motion.div
          layout
          className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="break-inside-avoid relative bg-white p-3 rounded-3xl shadow-md border border-slate-100/60 overflow-hidden group cursor-pointer"
                onClick={() => setSelectedImage(item)}
              >
                <div className="relative overflow-hidden rounded-2xl bg-slate-900">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-primary-dark/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <ZoomIn className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  {/* Category Tag */}
                  <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-white/90 backdrop-blur-md border border-purple-50 rounded-full text-[10px] font-bold text-slate-800 shadow-sm uppercase tracking-wide">
                    {item.category}
                  </span>
                </div>

                <div className="p-3 space-y-1">
                  <h4 className="font-display font-extrabold text-sm sm:text-base text-slate-800">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl border border-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Image panel */}
                <div className="relative bg-slate-900">
                  <img
                    src={selectedImage.image}
                    alt={selectedImage.title}
                    className="w-full h-auto max-h-[50vh] sm:max-h-[60vh] object-contain mx-auto"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/85 text-white rounded-full transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <span className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-[10px] font-bold uppercase tracking-wider">
                    {selectedImage.category}
                  </span>
                </div>

                {/* Details panel */}
                <div className="p-6 sm:p-8 space-y-3 bg-white">
                  <div className="flex items-center space-x-2 text-primary font-bold text-xs sm:text-sm">
                    <Sparkles className="h-4 w-4" />
                    <span>Dokumentasi KOMPAK</span>
                  </div>
                  <h3 className="font-display font-extrabold text-lg sm:text-2xl text-slate-900 leading-tight">
                    {selectedImage.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {selectedImage.description}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
