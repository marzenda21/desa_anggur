import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Search, Filter, RefreshCw, User, Grape, Layers, MapPin, Heart, AlertTriangle, Compass, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Custom Marker styling based on condition
const createCustomMarker = (condition, isSelected) => {
  let color = '#7d1de3'; // default
  if (condition === 'Sehat') color = '#10b981'; // emerald green
  if (condition === 'Penyembuhan') color = '#fbbf24'; // amber gold
  if (condition === 'Tidak Sehat') color = '#f97316'; // orange
  if (condition === 'Mati') color = '#ef4444'; // red

  const borderClass = isSelected ? 'border-4 border-slate-900 scale-125 z-[999]' : 'border-2 border-white scale-100';

  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="relative flex items-center justify-center transition-all duration-300">
        ${isSelected ? `<span class="absolute inline-flex h-12 w-12 animate-ping rounded-full opacity-45" style="background-color: ${color}"></span>` : `<span class="absolute inline-flex h-8 w-8 animate-pulse rounded-full opacity-25" style="background-color: ${color}"></span>`}
        <div class="h-10 w-10 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 ${borderClass}" style="background-color: ${color}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -15]
  });
};

function MapController({ activePoint }) {
  const map = useMap();
  useEffect(() => {
    if (activePoint) {
      map.flyTo(activePoint.position, 16, {
        duration: 1.2
      });
    }
  }, [activePoint, map]);
  return null;
}

export default function GisMap({ growths = [], farmers = [], grapes = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVariety, setSelectedVariety] = useState('Semua');
  const [selectedCondition, setSelectedCondition] = useState('Semua');
  const [activePoint, setActivePoint] = useState(null);
  
  const mapCenter = [-7.7928, 113.4072]; // Desa Krejengan center
  const markerRefs = useRef({});

  // Resolve relational data for map rendering
  const resolvedPoints = growths.map((g) => {
    const farmer = farmers.find(f => f.id === g.farmerId) || {};
    const grape = grapes.find(gr => gr.id === g.grapeId) || {};
    return {
      ...g,
      farmerName: farmer.name || 'Petani Tidak Terdaftar',
      farmerPhone: farmer.phone || '',
      farmerGroup: farmer.description || 'KOMPAK Desa Krejengan',
      grapeName: grape.name || 'Varietas Tidak Terdaftar',
      position: [g.latitude, g.longitude]
    };
  });

  const filteredPoints = resolvedPoints.filter((point) => {
    const matchSearch = point.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        point.farmerGroup.toLowerCase().includes(searchTerm.toLowerCase());
    const matchVariety = selectedVariety === 'Semua' || point.grapeName === selectedVariety;
    const matchCondition = selectedCondition === 'Semua' || point.condition === selectedCondition;
    return matchSearch && matchVariety && matchCondition;
  });

  // Dynamic filter lists from database
  const uniqueVarieties = ['Semua', ...new Set(grapes.map(g => g.name))];
  const conditionsList = ['Semua', 'Sehat', 'Penyembuhan', 'Tidak Sehat', 'Mati'];

  const getConditionColor = (cond) => {
    switch (cond) {
      case 'Sehat': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Penyembuhan': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Tidak Sehat': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Mati': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getProgressBarColor = (cond) => {
    switch (cond) {
      case 'Sehat': return 'bg-emerald-500';
      case 'Penyembuhan': return 'bg-amber-500';
      case 'Tidak Sehat': return 'bg-orange-500';
      case 'Mati': return 'bg-red-500';
      default: return 'bg-primary';
    }
  };

  const handlePointSelect = (point) => {
    setActivePoint(point);
    const marker = markerRefs.current[point.id];
    if (marker) {
      marker.openPopup();
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedVariety('Semua');
    setSelectedCondition('Semua');
    setActivePoint(null);
  };

  const villageBoundary = [
    [-7.788, 113.400],
    [-7.788, 113.414],
    [-7.794, 113.415],
    [-7.799, 113.410],
    [-7.799, 113.402],
    [-7.794, 113.399]
  ];

  return (
    <section id="gis-map" className="py-20 bg-purple-50/30 border-y border-purple-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold text-leaf uppercase tracking-widest mb-3">Sistem Informasi Geografis (GIS)</h2>
          <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
            Peta Sebaran & Status Pertumbuhan Anggur
          </h3>
          <p className="text-slate-600 mt-3 text-sm sm:text-base">
            Gunakan fitur peta di bawah untuk memantau detail varietas, progres pertumbuhan, dan lokasi kebun petani KOMPAK secara spasial di Desa Krejengan.
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-leaf mx-auto mt-4 rounded-full" />
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
          
          {/* Sidebar (List & Filter) */}
          <div className="lg:col-span-4 border-r border-slate-100 flex flex-col h-[500px] lg:h-[650px] bg-slate-50/30 order-2 lg:order-1">
            
            {/* Search and Filters */}
            <div className="p-5 border-b border-slate-100 bg-white space-y-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama petani atau kelompok..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-primary/50 rounded-2xl text-sm focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Variety Filter */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                    <Grape className="h-3 w-3 text-primary" />
                    <span>Varietas</span>
                  </label>
                  <select
                    value={selectedVariety}
                    onChange={(e) => setSelectedVariety(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-primary/30 rounded-xl text-xs font-semibold focus:outline-none"
                  >
                    {uniqueVarieties.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>

                {/* Condition Filter */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                    <Layers className="h-3 w-3 text-leaf" />
                    <span>Kondisi</span>
                  </label>
                  <select
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-primary/30 rounded-xl text-xs font-semibold focus:outline-none"
                  >
                    {conditionsList.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status Indicator/Reset */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="font-bold text-slate-500">
                  Ditemukan: <span className="text-primary">{filteredPoints.length}</span> kebun
                </span>
                <button
                  onClick={resetFilters}
                  className="flex items-center space-x-1 text-primary hover:text-primary-dark font-extrabold cursor-pointer transition-colors"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredPoints.length > 0 ? (
                filteredPoints.map((point) => (
                  <div
                    key={point.id}
                    onClick={() => handlePointSelect(point)}
                    className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      activePoint?.id === point.id
                        ? 'bg-purple-50/80 border-primary shadow-sm shadow-purple-500/10'
                        : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border mb-1.5 uppercase tracking-wide bg-slate-100 text-slate-600">
                          {point.farmerGroup}
                        </span>
                        <h4 className="font-display font-bold text-slate-800 text-sm sm:text-base flex items-center space-x-1.5">
                          <User className="h-4.5 w-4.5 text-slate-400" />
                          <span>{point.farmerName}</span>
                        </h4>
                        <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                          <span className="font-extrabold text-primary">{point.grapeName}</span>
                          <span>•</span>
                          <span>Update: {point.date}</span>
                        </div>
                      </div>
                      
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getConditionColor(point.condition)}`}>
                        {point.condition}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 font-semibold">Progres Tumbuh</span>
                        <span className="font-bold text-slate-700">{point.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(point.condition)}`}
                          style={{ width: `${point.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400 text-sm">
                  Tidak ada data kebun yang cocok.
                </div>
              )}
            </div>
          </div>

          {/* Map Section */}
          <div className="lg:col-span-8 h-[400px] lg:h-[650px] relative z-20 order-1 lg:order-2">
            {/* Map Cover Overlay */}
            <div className="absolute top-4 right-4 z-[999] bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-lg border border-slate-100 text-[10px] font-bold text-slate-700 space-y-1.5 pointer-events-auto">
              <div className="flex items-center space-x-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                <span>Kondisi Sehat</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
                <span>Kondisi Penyembuhan</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-500"></span>
                <span>Kondisi Tidak Sehat</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
                <span>Mati</span>
              </div>
            </div>

            <MapContainer
              center={mapCenter}
              zoom={15}
              className="w-full h-full"
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <Polygon
                positions={villageBoundary}
                pathOptions={{
                  color: '#7d1de3',
                  fillColor: '#7d1de3',
                  fillOpacity: 0.05,
                  dashArray: '5, 10',
                  weight: 2
                }}
              />

              <MapController activePoint={activePoint} />

              {filteredPoints.map((point) => (
                <Marker
                  key={point.id}
                  position={point.position}
                  icon={createCustomMarker(point.condition, activePoint?.id === point.id)}
                  ref={(el) => {
                    if (el) markerRefs.current[point.id] = el;
                  }}
                  eventHandlers={{
                    click: () => {
                      setActivePoint(point);
                    }
                  }}
                >
                  <Popup>
                    <div className="p-3 space-y-3">
                      {/* Popup Header */}
                      <div className="flex items-start justify-between border-b border-slate-100 pb-2 gap-2">
                        <div>
                          <h4 className="font-display font-extrabold text-sm text-slate-800 leading-tight">
                            {point.farmerName}
                          </h4>
                          <span className="text-[10px] text-slate-500 font-semibold">{point.farmerGroup}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border shrink-0 ${getConditionColor(point.condition)}`}>
                          {point.condition}
                        </span>
                      </div>

                      {/* Image and quick stats */}
                      <div className="grid grid-cols-3 gap-2 items-center">
                        <img
                          src={point.photo}
                          alt="kebun"
                          className="col-span-1 h-12 w-full object-cover rounded-lg border border-slate-100"
                        />
                        <div className="col-span-2 text-[10px] space-y-0.5">
                          <div className="flex justify-between">
                            <span className="text-slate-400 font-semibold">Varietas:</span>
                            <span className="font-bold text-primary">{point.grapeName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400 font-semibold">Progres:</span>
                            <span className="font-bold text-slate-700">{point.progress}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400 font-semibold">Update:</span>
                            <span className="font-bold text-slate-700">{point.date}</span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-[10px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 leading-normal italic">
                        "{point.description}"
                      </p>

                      {/* Progress bar in popup */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[9px]">
                          <span className="text-slate-400 font-semibold">Progres Tumbuh</span>
                          <span className="font-bold text-slate-700">{point.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${getProgressBarColor(point.condition)}`}
                            style={{ width: `${point.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Direction CTA */}
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${point.position[0]},${point.position[1]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center space-x-1.5 py-1.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg text-[10px] font-bold shadow-md hover:-translate-y-0.5 transition-transform"
                      >
                        <MapPin className="h-3 w-3" />
                        <span>Petunjuk Lokasi (Google Maps)</span>
                      </a>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

        </div>

      </div>
    </section>
  );
}
