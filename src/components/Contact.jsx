import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

// Custom pin for headquarters location
const createHqMarker = () => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="relative flex items-center justify-center">
        <span class="absolute inline-flex h-12 w-12 animate-ping rounded-full bg-primary opacity-25"></span>
        <div class="h-10 w-10 rounded-full border-2 border-white flex items-center justify-center shadow-lg bg-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -15]
  });
};

// Inline SVG Icons for Brand Logos (Lucide deprecated brand icons)
const WhatsappIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.45 5.277.002 9.571-4.287 9.574-9.569.001-2.559-1.002-4.966-2.825-6.789C16.3 2.424 13.9 1.42 11.343 1.42 6.062 1.42 1.768 5.711 1.765 10.99c-.001 1.636.43 3.23 1.25 4.636l-.994 3.635 3.722-.977zm11.905-6.84c-.266-.134-1.579-.78-1.823-.867-.243-.088-.42-.132-.596.134-.176.265-.683.864-.838 1.04-.155.177-.31.199-.576.066-.266-.134-1.12-.413-2.133-1.32-.788-.702-1.32-1.57-1.474-1.836-.155-.266-.017-.41.117-.543.12-.12.266-.31.399-.464.133-.155.177-.265.266-.442.088-.177.044-.332-.022-.464-.067-.133-.596-1.437-.817-1.968-.215-.518-.451-.448-.619-.456-.16-.008-.343-.01-.527-.01-.184 0-.485.07-.74.354-.253.283-.968.947-.968 2.31 0 1.36 1.002 2.67 1.135 2.85.132.18 1.96 3.012 4.748 4.21.663.287 1.18.458 1.583.587.668.213 1.278.183 1.758.11.536-.08 1.579-.646 1.8-.1237.222-.593.222-1.101.155-1.189-.066-.088-.243-.133-.509-.267z"/>
  </svg>
);

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TiktokIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.21 1.02 1.25 2.5 2.05 4.04 2.27v3.74c-1.63-.09-3.23-.7-4.48-1.78-.17-.15-.33-.31-.49-.47v6.62c0 1.91-.56 3.82-1.63 5.4-1.28 1.89-3.4 3.19-5.71 3.54-2.58.4-5.26-.26-7.3-1.87-2.19-1.73-3.4-4.52-3.19-7.3.2-2.73 1.91-5.22 4.41-6.32 1.58-.7 3.33-.92 5.04-.64V11.2c-1.24-.26-2.55-.07-3.66.57-1.12.65-1.92 1.77-2.18 3.04-.37 1.83.6 3.75 2.29 4.54 1.58.74 3.55.43 4.8-.75.76-.72 1.16-1.75 1.15-2.8V.02h.01z"/>
  </svg>
);

export default function Contact() {
  const hqPosition = [-7.7928, 113.4072]; // Coordinate of Perpustakaan Desa Aqila / Kompak HQ

  return (
    <section id="contact" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-leaf uppercase tracking-widest mb-3">Hubungi Kami</h2>
          <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
            Lokasi Kebun & Kontak
          </h3>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-leaf mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Map Left */}
          <motion.div 
            className="lg:col-span-7 h-[350px] sm:h-[450px] rounded-3xl overflow-hidden shadow-lg border border-slate-100 flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            {/* Embedded Leaflet Map for Secretariat Location */}
            <div className="flex-1 h-full w-full relative z-10">
              <MapContainer
                center={hqPosition}
                zoom={16}
                className="w-full h-full"
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={hqPosition} icon={createHqMarker()}>
                  <Popup>
                    <div className="p-2 text-center space-y-1">
                      <h4 className="font-display font-extrabold text-sm text-slate-800">Sekretariat KOMPAK</h4>
                      <p className="text-[10px] text-slate-500">Sebelah Perpustakaan Desa Aqila, Krejengan</p>
                      <a
                        href="https://www.google.com/maps/dir/?api=1&destination=-7.7928,113.4072"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 px-3 py-1 bg-primary text-white rounded-lg text-[9px] font-bold shadow-md"
                      >
                        Buka Google Maps
                      </a>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
            
            {/* Info label under map */}
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center space-x-3 text-xs text-slate-600">
              <MapPin className="h-4.5 w-4.5 text-primary shrink-0" />
              <span>
                <strong>Alamat:</strong> Jl. Raya Krejengan (Sebelah Perpustakaan Aqila), Desa Krejengan, Kec. Krejengan, Kab. Probolinggo, Jawa Timur 67284.
              </span>
            </div>
          </motion.div>

          {/* Social Links / WA Right */}
          <motion.div 
            className="lg:col-span-5 flex flex-col justify-between gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="space-y-4">
              <h4 className="font-display font-extrabold text-slate-800 text-xl sm:text-2xl leading-snug">
                Mari Berdiskusi & Kunjungi Kebun Kami
              </h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Tertarik untuk belajar budidaya anggur, membeli bibit unggul berkualitas, atau ingin melakukan kunjungan edukasi kelompok? Hubungi pengurus KOMPAK secara langsung melalui media di bawah.
              </p>
            </div>

            {/* Premium Interactive Widgets */}
            <div className="space-y-4">
              {/* WhatsApp Widget */}
              <a
                href="https://wa.me/6285233753564"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-5 bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100 hover:border-emerald-200 rounded-3xl transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3.5 bg-emerald-500 text-white rounded-2xl group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
                    <WhatsappIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="block text-xs font-extrabold text-emerald-800 uppercase tracking-wider">WhatsApp Pengurus</span>
                    <span className="font-display font-extrabold text-sm sm:text-base text-slate-800">+62 812-3456-789</span>
                  </div>
                </div>
                <div className="p-2 bg-white rounded-full text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
              </a>

              {/* Instagram Widget */}
              <a
                href="https://www.instagram.com/krejengansmart?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-5 bg-rose-50/50 hover:bg-rose-50 border border-rose-100 hover:border-rose-200 rounded-3xl transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3.5 bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 text-white rounded-2xl group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-rose-500/25 flex items-center justify-center">
                    <InstagramIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="block text-xs font-extrabold text-rose-800 uppercase tracking-wider">Instagram Desa</span>
                    <span className="font-display font-extrabold text-sm sm:text-base text-slate-800">@kompak_krejengan</span>
                  </div>
                </div>
                <div className="p-2 bg-white rounded-full text-slate-400 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
              </a>

              {/* TikTok Widget */}
              <a
                href="https://www.tiktok.com/@anggurkrejengan?is_from_webapp=1&sender_device=pc"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-5 bg-slate-50/70 hover:bg-slate-50 border border-slate-200/60 rounded-3xl transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3.5 bg-slate-900 text-white rounded-2xl group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-slate-900/20 flex items-center justify-center">
                    <TiktokIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="block text-xs font-extrabold text-slate-600 uppercase tracking-wider">TikTok Budidaya</span>
                    <span className="font-display font-extrabold text-sm sm:text-base text-slate-800">@anggur_krejengan</span>
                  </div>
                </div>
                <div className="p-2 bg-white rounded-full text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
              </a>
            </div>

            {/* Quick Contact Footer */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 pt-4 font-semibold px-2">
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
