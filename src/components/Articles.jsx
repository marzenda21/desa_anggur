import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, BookOpen, User, ChevronRight } from 'lucide-react';

export default function Articles({ articles = [] }) {
  const [selectedArticle, setSelectedArticle] = useState(null);

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Edukasi': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Proteksi': return 'bg-red-100 text-red-800 border-red-200';
      case 'Tips Tani': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <section id="articles" className="py-24 bg-purple-50/20 border-t border-purple-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-leaf uppercase tracking-widest mb-3">Pusat Informasi</h2>
          <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
            Artikel & Panduan Budidaya
          </h3>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-leaf mx-auto mt-4 rounded-full" />
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <motion.article
              key={article.id}
              whileHover={{ y: -6 }}
              className="bg-white rounded-3xl overflow-hidden shadow-md border border-slate-100 hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
              onClick={() => setSelectedArticle(article)}
            >
              {/* Image Header */}
              <div className="relative h-48 overflow-hidden bg-slate-950">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                <span className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-[10px] font-bold border shadow-sm uppercase tracking-wide bg-white/95 backdrop-blur-md ${getCategoryColor(article.category)}`}>
                  {article.category}
                </span>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  {/* Meta */}
                  <div className="flex items-center space-x-4 text-slate-400 text-xs font-semibold">
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{article.date}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{article.readTime}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="font-display font-extrabold text-slate-800 text-base sm:text-lg hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h4>

                  {/* Summary */}
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                {/* Footer read action */}
                <div className="flex items-center justify-between text-xs font-extrabold text-primary pt-6 mt-4 border-t border-slate-50">
                  <span className="flex items-center space-x-1">
                    <User className="h-3.5 w-3.5 text-slate-400 font-normal" />
                    <span className="text-slate-500 font-semibold">Oleh: {article.author}</span>
                  </span>
                  <span className="flex items-center space-x-1 hover:translate-x-0.5 transition-transform group">
                    <span>Baca Selengkapnya</span>
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Modal Reader */}
        <AnimatePresence>
          {selectedArticle && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
              onClick={() => setSelectedArticle(null)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="bg-white rounded-3xl overflow-hidden max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header Image inside Modal */}
                <div className="relative h-44 sm:h-60 shrink-0 bg-slate-950">
                  <img
                    src={selectedArticle.image}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/85 text-white rounded-full transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  
                  {/* Article Title inside Image */}
                  <div className="absolute bottom-4 left-6 right-6 text-white space-y-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-white/40 uppercase bg-black/30 backdrop-blur-md tracking-wider">
                      {selectedArticle.category}
                    </span>
                    <h3 className="font-display font-extrabold text-base sm:text-2xl leading-tight">
                      {selectedArticle.title}
                    </h3>
                  </div>
                </div>

                {/* Meta details & Content scroll area */}
                <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-6">
                  {/* Meta info */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 border-b border-slate-100 pb-4">
                    <span className="flex items-center space-x-1.5">
                      <User className="h-4 w-4 text-slate-400" />
                      <span>Penulis: {selectedArticle.author}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1.5">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span>{selectedArticle.date}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1.5">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span>Estimasi Baca: {selectedArticle.readTime}</span>
                    </span>
                  </div>

                  {/* Body Content */}
                  <div
                    className="text-sm sm:text-base text-slate-700 leading-relaxed space-y-4 font-sans"
                    dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                  ></div>
                </div>

                {/* Footer buttons */}
                <div className="p-4 sm:px-8 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold text-sm rounded-xl transition-colors cursor-pointer"
                  >
                    Tutup Artikel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
