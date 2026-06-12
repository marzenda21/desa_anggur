import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  LayoutDashboard, User, Grape, Activity, Image as ImageIcon, FileText, LogOut, Globe,
  Menu, X, Plus, Edit2, Trash2, Calendar, Phone, MapPin, Check, AlertTriangle, XCircle, Heart, Upload, Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Custom Map Controller to center map
function MapController({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 15);
    }
  }, [center, map]);
  return null;
}

// Leaflet click handler to select coordinates in forms
function LocationSelector({ position, onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect([e.latlng.lat, e.latlng.lng]);
    }
  });

  return position ? <Marker position={position} /> : null;
}

export default function AdminDashboard({
  farmers, setFarmers,
  grapes, setGrapes,
  growths, setGrowths,
  gallery, setGallery,
  articles, setArticles,
  onLogout, onBackToPublic
}) {
  const [activeMenu, setActiveMenu] = useState('overview'); // 'overview', 'farmers', 'grapes', 'growth', 'gallery', 'articles'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // CRUD state management
  const [editingItem, setEditingItem] = useState(null); // stores item being edited
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form Fields State
  const [farmerForm, setFarmerForm] = useState({ name: '', phone: '', address: '', photo: '', date: '', description: '' });
  const [grapeForm, setGrapeForm] = useState({ name: '', photo: '', initialLocation: '', date: '', description: '' });
  const [growthForm, setGrowthForm] = useState({ farmerId: '', grapeId: '', photo: '', latitude: '', longitude: '', condition: 'Sehat', progress: 50, date: '', description: '' });
  const [galleryForm, setGalleryForm] = useState({ title: '', category: 'Kebun', description: '', image: '' });
  const [articleForm, setArticleForm] = useState({ title: '', category: 'Edukasi', summary: '', content: '', image: '', author: 'Admin', readTime: '5 Menit', date: '' });

  // Map coordinates state for selector map
  const [formCoordinate, setFormCoordinate] = useState([-7.7928, 113.4072]);

  // Clean form states when changing menus or closing forms
  const closeForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
    setFarmerForm({ name: '', phone: '', address: '', photo: '', date: '', description: '' });
    setGrapeForm({ name: '', photo: '', initialLocation: '', date: '', description: '' });
    setGrowthForm({ farmerId: '', grapeId: '', photo: '', latitude: '', longitude: '', condition: 'Sehat', progress: 50, date: '', description: '' });
    setGalleryForm({ title: '', category: 'Kebun', description: '', image: '' });
    setArticleForm({ title: '', category: 'Edukasi', summary: '', content: '', image: '', author: 'Admin', readTime: '5 Menit', date: '' });
    setFormCoordinate([-7.7928, 113.4072]);
  };

  // Helper for reading image files as Base64 strings (offline uploads)
  const handleImageUpload = (e, setPhotoCallback) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoCallback(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // CRUD actions for Farmers
  const handleFarmerSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      // Edit
      setFarmers(farmers.map(f => f.id === editingItem.id ? { ...f, ...farmerForm } : f));
    } else {
      // Create
      const newId = farmers.length > 0 ? Math.max(...farmers.map(f => f.id)) + 1 : 1;
      setFarmers([...farmers, { id: newId, ...farmerForm }]);
    }
    closeForm();
  };

  const handleFarmerEdit = (farmer) => {
    setEditingItem(farmer);
    setFarmerForm({ ...farmer });
    setIsFormOpen(true);
  };

  const handleFarmerDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data petani ini?')) {
      setFarmers(farmers.filter(f => f.id !== id));
      // Also clean up dependent growth records
      setGrowths(growths.filter(g => g.farmerId !== id));
    }
  };

  // CRUD actions for Grapes
  const handleGrapeSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      setGrapes(grapes.map(g => g.id === editingItem.id ? { ...g, ...grapeForm } : g));
    } else {
      const newId = grapes.length > 0 ? Math.max(...grapes.map(g => g.id)) + 1 : 1;
      setGrapes([...grapes, { id: newId, ...grapeForm }]);
    }
    closeForm();
  };

  const handleGrapeEdit = (grape) => {
    setEditingItem(grape);
    setGrapeForm({ ...grape });
    setIsFormOpen(true);
  };

  const handleGrapeDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus varietas anggur ini?')) {
      setGrapes(grapes.filter(g => g.id !== id));
      setGrowths(growths.filter(g => g.grapeId !== id));
    }
  };

  // CRUD actions for Growth Records
  const handleGrowthSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...growthForm,
      farmerId: parseInt(growthForm.farmerId),
      grapeId: parseInt(growthForm.grapeId),
      latitude: parseFloat(formCoordinate[0]),
      longitude: parseFloat(formCoordinate[1]),
      progress: parseInt(growthForm.progress)
    };

    if (editingItem) {
      setGrowths(growths.map(g => g.id === editingItem.id ? { ...g, ...dataToSubmit } : g));
    } else {
      const newId = growths.length > 0 ? Math.max(...growths.map(g => g.id)) + 1 : 1;
      setGrowths([...growths, { id: newId, ...dataToSubmit }]);
    }
    closeForm();
  };

  const handleGrowthEdit = (growth) => {
    setEditingItem(growth);
    setGrowthForm({ ...growth });
    setFormCoordinate([growth.latitude, growth.longitude]);
    setIsFormOpen(true);
  };

  const handleGrowthDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data laporan pertumbuhan ini?')) {
      setGrowths(growths.filter(g => g.id !== id));
    }
  };

  // CRUD actions for Gallery
  const handleGallerySubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      setGallery(gallery.map(g => g.id === editingItem.id ? { ...g, ...galleryForm } : g));
    } else {
      const newId = gallery.length > 0 ? Math.max(...gallery.map(g => g.id)) + 1 : 1;
      setGallery([...gallery, { id: newId, ...galleryForm }]);
    }
    closeForm();
  };

  const handleGalleryEdit = (item) => {
    setEditingItem(item);
    setGalleryForm({ ...item });
    setIsFormOpen(true);
  };

  const handleGalleryDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus foto galeri ini?')) {
      setGallery(gallery.filter(g => g.id !== id));
    }
  };

  // CRUD actions for Articles
  const handleArticleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      setArticles(articles.map(a => a.id === editingItem.id ? { ...a, ...articleForm } : a));
    } else {
      const newId = articles.length > 0 ? Math.max(...articles.map(a => a.id)) + 1 : 1;
      setArticles([...articles, { id: newId, ...articleForm }]);
    }
    closeForm();
  };

  const handleArticleEdit = (article) => {
    setEditingItem(article);
    setArticleForm({ ...article });
    setIsFormOpen(true);
  };

  const handleArticleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
      setArticles(articles.filter(a => a.id !== id));
    }
  };

  const getConditionIcon = (cond) => {
    switch (cond) {
      case 'Sehat': return <Heart className="h-4 w-4 text-emerald-500 fill-emerald-500" />;
      case 'Penyembuhan': return <Compass className="h-4 w-4 text-amber-500" />;
      case 'Tidak Sehat': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'Mati': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const getConditionColor = (cond) => {
    switch (cond) {
      case 'Sehat': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Penyembuhan': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Tidak Sehat': return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'Mati': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  // Setup custom Leaflet pins for Admin Overview map
  const createAdminMarker = (condition) => {
    let color = '#7d1de3'; // primary
    if (condition === 'Sehat') color = '#10b981'; // green
    if (condition === 'Penyembuhan') color = '#fbbf24'; // yellow
    if (condition === 'Tidak Sehat') color = '#f97316'; // orange
    if (condition === 'Mati') color = '#ef4444'; // red

    return L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="h-8 w-8 rounded-full border-2 border-white flex items-center justify-center shadow-md" style="background-color: ${color}">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -12]
    });
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
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative">
      
      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between z-40 border-b border-slate-800 shrink-0">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-gradient-to-tr from-primary to-leaf rounded-lg">
            <Grape className="h-5 w-5 text-white" />
          </div>
          <span className="font-display font-extrabold text-sm tracking-wider">KREJENGAN ADMIN</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-slate-400 hover:text-white focus:outline-none"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Panel (Collapsible Drawer / Sticky Sidebar) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between transition-transform duration-300 transform border-r border-slate-800
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:relative md:translate-x-0 md:flex shrink-0`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-800 space-y-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-tr from-primary to-leaf rounded-xl shadow-lg">
              <Grape className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="font-display font-extrabold text-white text-base tracking-wide block leading-none">
                KREJENGAN
              </span>
              <span className="font-sans text-[10px] font-bold text-leaf uppercase tracking-wider block mt-1">
                Panel Control
              </span>
            </div>
          </div>
          
          <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-800 flex items-center space-x-3 text-xs">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shadow">
              A
            </div>
            <div>
              <span className="block font-bold text-white leading-none mb-0.5">Administrator</span>
              <span className="text-[10px] text-slate-500 font-semibold">anggur.krejengan</span>
            </div>
          </div>
        </div>

        {/* Sidebar Menu Items */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {[
            { id: 'overview', name: 'Ringkasan Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
            { id: 'farmers', name: 'Kelola Petani', icon: <User className="h-5 w-5" /> },
            { id: 'grapes', name: 'Kelola Varietas', icon: <Grape className="h-5 w-5" /> },
            { id: 'growth', name: 'Laporan Tumbuh', icon: <Activity className="h-5 w-5" /> },
            { id: 'gallery', name: 'Kelola Galeri', icon: <ImageIcon className="h-5 w-5" /> },
            { id: 'articles', name: 'Kelola Artikel', icon: <FileText className="h-5 w-5" /> }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveMenu(item.id);
                setIsSidebarOpen(false);
                closeForm();
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeMenu === item.id
                  ? 'bg-primary text-white shadow-lg shadow-purple-500/10'
                  : 'hover:bg-slate-800 hover:text-white text-slate-400'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Sidebar Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={onBackToPublic}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Globe className="h-4.5 w-4.5" />
            <span>Lihat Website Publik</span>
          </button>
          
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Keluar Panel</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        
        {/* Overview (Dashboard) Menu */}
        {activeMenu === 'overview' && (
          <div className="space-y-8">
            {/* Header Title */}
            <div>
              <h1 className="font-display font-extrabold text-3xl text-slate-900">Ringkasan Dashboard</h1>
              <p className="text-sm text-slate-500 font-semibold">Statistik spasial sebaran anggur Desa Krejengan.</p>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Total Petani', val: farmers.length, color: 'text-purple-600', bg: 'bg-purple-100/50', border: 'border-purple-100' },
                { title: 'Jenis Anggur', val: grapes.length, color: 'text-emerald-600', bg: 'bg-emerald-100/50', border: 'border-emerald-100' },
                { title: 'Laporan Tumbuh', val: growths.length, color: 'text-amber-600', bg: 'bg-amber-100/50', border: 'border-amber-100' },
                { title: 'Kondisi Sehat', val: growths.filter(g => g.condition === 'Sehat').length, color: 'text-pink-600', bg: 'bg-pink-100/50', border: 'border-pink-100' }
              ].map((m, idx) => (
                <div key={idx} className={`p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between`}>
                  <div>
                    <span className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider">{m.title}</span>
                    <span className="block text-3xl font-display font-extrabold text-slate-800 mt-1">{m.val}</span>
                  </div>
                  <div className={`p-3.5 rounded-2xl ${m.bg} ${m.color}`}>
                    <Grape className="h-6 w-6" />
                  </div>
                </div>
              ))}
            </div>

            {/* Overview GIS Map (Spread based on Growths) */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div>
                <h3 className="font-display font-bold text-slate-800 text-lg">Peta Lokasi Penyebaran Anggur (GIS)</h3>
                <p className="text-xs text-slate-500">Menampilkan titik lokasi pertumbuhan tanaman anggur aktif petani KOMPAK.</p>
              </div>

              {/* Map container */}
              <div className="h-[450px] relative z-20 rounded-2xl overflow-hidden border border-slate-100">
                <MapContainer center={[-7.7928, 113.4072]} zoom={15} className="w-full h-full" scrollWheelZoom={false}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Polygon positions={villageBoundary} pathOptions={{ color: '#7d1de3', fillOpacity: 0.02, dashArray: '5, 8', weight: 1.5 }} />

                  {growths.map((g) => {
                    const farmer = farmers.find(f => f.id === g.farmerId);
                    const grape = grapes.find(gr => gr.id === g.grapeId);
                    return (
                      <Marker key={g.id} position={[g.latitude, g.longitude]} icon={createAdminMarker(g.condition)}>
                        <Popup>
                          <div className="p-2 space-y-2">
                            <div className="border-b border-slate-100 pb-1.5 flex items-center justify-between gap-2">
                              <div>
                                <h4 className="font-bold text-slate-800 text-xs">{farmer ? farmer.name : 'Unknown Farmer'}</h4>
                                <span className="text-[9px] text-slate-400 block -mt-0.5">Kelompok KOMPAK</span>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold border shrink-0 ${getConditionColor(g.condition)}`}>
                                {g.condition}
                              </span>
                            </div>
                            <div className="text-[10px] space-y-0.5">
                              <div><strong>Varietas:</strong> {grape ? grape.name : 'Unknown Grape'}</div>
                              <div><strong>Progres:</strong> {g.progress}%</div>
                              <div><strong>Update:</strong> {g.date}</div>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              </div>
            </div>
          </div>
        )}

        {/* Farmers Manager Menu */}
        {activeMenu === 'farmers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display font-extrabold text-3xl text-slate-900">Kelola Data Petani</h1>
                <p className="text-sm text-slate-500 font-semibold">Manajemen keanggotaan kelompok tani pembudidaya anggur.</p>
              </div>
              {!isFormOpen && (
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="flex items-center space-x-1.5 px-5 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl text-xs font-extrabold shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tambah Petani Baru</span>
                </button>
              )}
            </div>

            {isFormOpen ? (
              // Create/Edit Farmer Form
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm max-w-2xl"
              >
                <h3 className="font-display font-bold text-slate-800 text-lg mb-6 border-b border-slate-50 pb-3">
                  {editingItem ? 'Edit Data Petani' : 'Registrasi Petani Baru'}
                </h3>
                <form onSubmit={handleFarmerSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Nama Lengkap</label>
                      <input
                        type="text"
                        required
                        value={farmerForm.name}
                        onChange={(e) => setFarmerForm({ ...farmerForm, name: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-primary/50 focus:bg-white rounded-xl text-sm focus:outline-none transition-colors"
                        placeholder="Contoh: Pak Slamet"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Nomor WhatsApp (HP)</label>
                      <input
                        type="tel"
                        required
                        value={farmerForm.phone}
                        onChange={(e) => setFarmerForm({ ...farmerForm, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-primary/50 focus:bg-white rounded-xl text-sm focus:outline-none transition-colors"
                        placeholder="Contoh: 08123456789"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Alamat Rumah</label>
                    <input
                      type="text"
                      required
                      value={farmerForm.address}
                      onChange={(e) => setFarmerForm({ ...farmerForm, address: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-primary/50 focus:bg-white rounded-xl text-sm focus:outline-none transition-colors"
                      placeholder="RT/RW, Dusun, Desa Krejengan"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Tanggal Registrasi</label>
                      <input
                        type="date"
                        required
                        value={farmerForm.date}
                        onChange={(e) => setFarmerForm({ ...farmerForm, date: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-primary/50 focus:bg-white rounded-xl text-sm focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Foto Profil Petani</label>
                      <div className="flex items-center space-x-3">
                        <label className="flex items-center space-x-1.5 px-4 py-3 bg-purple-50 text-primary border border-purple-100 rounded-xl text-xs font-bold cursor-pointer hover:bg-purple-100 transition-colors">
                          <Upload className="h-4 w-4" />
                          <span>Pilih Foto</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, (base64) => setFarmerForm({ ...farmerForm, photo: base64 }))}
                            className="hidden"
                          />
                        </label>
                        {farmerForm.photo && (
                          <img src={farmerForm.photo} alt="profile preview" className="h-10 w-10 object-cover rounded-lg border border-slate-100" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Keterangan / Kelompok Tani</label>
                    <textarea
                      value={farmerForm.description}
                      onChange={(e) => setFarmerForm({ ...farmerForm, description: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-primary/50 focus:bg-white rounded-xl text-sm focus:outline-none transition-colors h-24 resize-none"
                      placeholder="Info kelompok tani atau keanggotaan..."
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-slate-50">
                    <button
                      type="button"
                      onClick={closeForm}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl text-xs font-extrabold cursor-pointer"
                    >
                      Simpan Data
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              // Farmers Grid List
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {farmers.map((farmer) => (
                  <div key={farmer.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
                    <div className="p-6 space-y-4">
                      {/* Photo & Name */}
                      <div className="flex items-center space-x-4">
                        <img src={farmer.photo} alt={farmer.name} className="h-16 w-16 object-cover rounded-2xl border border-slate-100 shadow-inner shrink-0" />
                        <div>
                          <h3 className="font-display font-extrabold text-slate-800 text-base">{farmer.name}</h3>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">ID Petani: #{farmer.id}</span>
                        </div>
                      </div>

                      {/* Detail list */}
                      <div className="space-y-2 text-xs text-slate-600 border-t border-slate-50 pt-4">
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                          <span>{farmer.phone}</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{farmer.address}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                          <span>Daftar: {farmer.date}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 leading-normal italic bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                        "{farmer.description}"
                      </p>
                    </div>

                    {/* Actions Panel */}
                    <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end space-x-2">
                      <button
                        onClick={() => handleFarmerEdit(farmer)}
                        className="p-2.5 bg-white text-slate-500 hover:text-primary rounded-xl border border-slate-100 hover:border-purple-100 shadow-sm cursor-pointer"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleFarmerDelete(farmer.id)}
                        className="p-2.5 bg-white text-slate-500 hover:text-red-500 rounded-xl border border-slate-100 hover:border-red-100 shadow-sm cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Grapes Manager Menu */}
        {activeMenu === 'grapes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display font-extrabold text-3xl text-slate-900">Kelola Varietas Anggur</h1>
                <p className="text-sm text-slate-500 font-semibold">Manajemen jenis anggur impor yang dikembangkan di desa.</p>
              </div>
              {!isFormOpen && (
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="flex items-center space-x-1.5 px-5 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl text-xs font-extrabold shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tambah Varietas Baru</span>
                </button>
              )}
            </div>

            {isFormOpen ? (
              // Create/Edit Grape Form
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm max-w-2xl"
              >
                <h3 className="font-display font-bold text-slate-800 text-lg mb-6 border-b border-slate-50 pb-3">
                  {editingItem ? 'Edit Varietas Anggur' : 'Tambah Varietas Anggur Baru'}
                </h3>
                <form onSubmit={handleGrapeSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Nama Varietas</label>
                      <input
                        type="text"
                        required
                        value={grapeForm.name}
                        onChange={(e) => setGrapeForm({ ...grapeForm, name: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-primary/50 focus:bg-white rounded-xl text-sm focus:outline-none transition-colors"
                        placeholder="Contoh: Jupiter, Ninel"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Lokasi Awal Pembibitan</label>
                      <input
                        type="text"
                        required
                        value={grapeForm.initialLocation}
                        onChange={(e) => setGrapeForm({ ...grapeForm, initialLocation: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-primary/50 focus:bg-white rounded-xl text-sm focus:outline-none transition-colors"
                        placeholder="Contoh: Greenhouse Desa"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Tanggal Masuk</label>
                      <input
                        type="date"
                        required
                        value={grapeForm.date}
                        onChange={(e) => setGrapeForm({ ...grapeForm, date: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-primary/50 focus:bg-white rounded-xl text-sm focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Foto Buah/Bibit</label>
                      <div className="flex items-center space-x-3">
                        <label className="flex items-center space-x-1.5 px-4 py-3 bg-purple-50 text-primary border border-purple-100 rounded-xl text-xs font-bold cursor-pointer hover:bg-purple-100 transition-colors">
                          <Upload className="h-4 w-4" />
                          <span>Pilih Foto</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, (base64) => setGrapeForm({ ...grapeForm, photo: base64 }))}
                            className="hidden"
                          />
                        </label>
                        {grapeForm.photo && (
                          <img src={grapeForm.photo} alt="grape preview" className="h-10 w-10 object-cover rounded-lg border border-slate-100" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Keterangan / Deskripsi Varietas</label>
                    <textarea
                      value={grapeForm.description}
                      onChange={(e) => setGrapeForm({ ...grapeForm, description: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-primary/50 focus:bg-white rounded-xl text-sm focus:outline-none transition-colors h-24 resize-none"
                      placeholder="Detail rasa buah, asal impor, produktivitas..."
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-slate-50">
                    <button
                      type="button"
                      onClick={closeForm}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl text-xs font-extrabold cursor-pointer"
                    >
                      Simpan Data
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              // Grapes Grid List
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {grapes.map((grape) => (
                  <div key={grape.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
                    <div className="p-6 space-y-4">
                      {/* Photo & Name */}
                      <div className="flex items-center space-x-4">
                        <img src={grape.photo} alt={grape.name} className="h-16 w-16 object-cover rounded-2xl border border-slate-100 shadow-inner shrink-0" />
                        <div>
                          <h3 className="font-display font-extrabold text-slate-800 text-base">{grape.name}</h3>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">ID Varietas: #{grape.id}</span>
                        </div>
                      </div>

                      {/* Detail list */}
                      <div className="space-y-2 text-xs text-slate-600 border-t border-slate-50 pt-4">
                        <div><strong>Lokasi Asal:</strong> {grape.initialLocation}</div>
                        <div><strong>Terdaftar:</strong> {grape.date}</div>
                      </div>

                      <p className="text-xs text-slate-500 leading-normal bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                        {grape.description}
                      </p>
                    </div>

                    {/* Actions Panel */}
                    <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end space-x-2">
                      <button
                        onClick={() => handleGrapeEdit(grape)}
                        className="p-2.5 bg-white text-slate-500 hover:text-primary rounded-xl border border-slate-100 hover:border-purple-100 shadow-sm cursor-pointer"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleGrapeDelete(grape.id)}
                        className="p-2.5 bg-white text-slate-500 hover:text-red-500 rounded-xl border border-slate-100 hover:border-red-100 shadow-sm cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Growth Records Manager Menu (Relational) */}
        {activeMenu === 'growth' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display font-extrabold text-3xl text-slate-900">Laporan Pertumbuhan Anggur</h1>
                <p className="text-sm text-slate-500 font-semibold">Hubungan relasional sebaran dan kondisi anggur petani.</p>
              </div>
              {!isFormOpen && (
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="flex items-center space-x-1.5 px-5 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl text-xs font-extrabold shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Buat Laporan Baru</span>
                </button>
              )}
            </div>

            {isFormOpen ? (
              // Create/Edit Growth Form
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm max-w-3xl"
              >
                <h3 className="font-display font-bold text-slate-800 text-lg mb-6 border-b border-slate-50 pb-3">
                  {editingItem ? 'Edit Laporan Pertumbuhan' : 'Buat Laporan Pertumbuhan Baru'}
                </h3>
                <form onSubmit={handleGrowthSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Farmer Select */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Pilih Petani</label>
                      <select
                        required
                        value={growthForm.farmerId}
                        onChange={(e) => setGrowthForm({ ...growthForm, farmerId: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-primary/50 rounded-xl text-sm focus:outline-none"
                      >
                        <option value="">-- Pilih Petani --</option>
                        {farmers.map(f => (
                          <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Grape Select */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Pilih Jenis Anggur</label>
                      <select
                        required
                        value={growthForm.grapeId}
                        onChange={(e) => setGrowthForm({ ...growthForm, grapeId: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-primary/50 rounded-xl text-sm focus:outline-none"
                      >
                        <option value="">-- Pilih Anggur --</option>
                        {grapes.map(g => (
                          <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Condition */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Kondisi Tanaman</label>
                      <select
                        required
                        value={growthForm.condition}
                        onChange={(e) => setGrowthForm({ ...growthForm, condition: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-primary/50 rounded-xl text-sm focus:outline-none"
                      >
                        <option value="Sehat">Sehat</option>
                        <option value="Penyembuhan">Penyembuhan</option>
                        <option value="Tidak Sehat">Tidak Sehat</option>
                        <option value="Mati">Mati</option>
                      </select>
                    </div>

                    {/* Date */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Tanggal Monitoring</label>
                      <input
                        type="date"
                        required
                        value={growthForm.date}
                        onChange={(e) => setGrowthForm({ ...growthForm, date: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-primary/50 rounded-xl text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Range Slider for Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-bold text-slate-600">Progres Pertumbuhan (%)</label>
                      <span className="font-extrabold text-primary">{growthForm.progress}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={growthForm.progress}
                      onChange={(e) => setGrowthForm({ ...growthForm, progress: e.target.value })}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>

                  {/* Photo & Coordinate selector */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {/* Upload */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-600 block">Foto Laporan Terkini</label>
                      <div className="flex items-center space-x-3">
                        <label className="flex items-center space-x-1.5 px-4 py-3 bg-purple-50 text-primary border border-purple-100 rounded-xl text-xs font-bold cursor-pointer hover:bg-purple-100 transition-colors">
                          <Upload className="h-4 w-4" />
                          <span>Pilih Foto</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, (base64) => setGrowthForm({ ...growthForm, photo: base64 }))}
                            className="hidden"
                          />
                        </label>
                        {growthForm.photo && (
                          <img src={growthForm.photo} alt="growth preview" className="h-14 w-14 object-cover rounded-xl border border-slate-100 shadow-inner" />
                        )}
                      </div>
                    </div>

                    {/* Coordinates input */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600 block">Lokasi Titik GIS (Lat/Lng)</label>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400">Latitude</span>
                          <input type="text" readOnly value={formCoordinate[0].toFixed(6)} className="w-full bg-slate-100 px-3 py-2 border rounded-lg focus:outline-none" />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400">Longitude</span>
                          <input type="text" readOnly value={formCoordinate[1].toFixed(6)} className="w-full bg-slate-100 px-3 py-2 border rounded-lg focus:outline-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Leaflet selector map */}
                  <div className="space-y-1.5 relative z-10">
                    <span className="text-xs font-bold text-slate-500 block">Geser & Klik pada Peta di bawah untuk menentukan lokasi titik kebun:</span>
                    <div className="h-64 border rounded-xl overflow-hidden shadow-inner">
                      <MapContainer center={formCoordinate} zoom={15} className="w-full h-full" scrollWheelZoom={false}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <MapController center={formCoordinate} />
                        <LocationSelector position={formCoordinate} onLocationSelect={setFormCoordinate} />
                      </MapContainer>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Keterangan Hasil Monitoring</label>
                    <textarea
                      value={growthForm.description}
                      onChange={(e) => setGrowthForm({ ...growthForm, description: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-primary/50 focus:bg-white rounded-xl text-sm focus:outline-none transition-colors h-24 resize-none"
                      placeholder="Info pertumbuhan, kendala, atau penyemprotan pupuk..."
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-slate-50">
                    <button
                      type="button"
                      onClick={closeForm}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl text-xs font-extrabold cursor-pointer"
                    >
                      Simpan Laporan
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              // Growth Records Grid List
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {growths.map((g) => {
                  const farmer = farmers.find(f => f.id === g.farmerId);
                  const grape = grapes.find(gr => gr.id === g.grapeId);
                  return (
                    <div key={g.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
                      <div className="p-6 space-y-4">
                        {/* Header card */}
                        <div className="flex items-start justify-between border-b border-slate-50 pb-3 gap-3">
                          <div>
                            <h3 className="font-display font-extrabold text-slate-800 text-base leading-tight">
                              {farmer ? farmer.name : 'Petani Tidak Diketahui'}
                            </h3>
                            <span className="text-[10px] text-primary font-bold mt-1 block uppercase tracking-wider">
                              Anggur: {grape ? grape.name : 'Tidak Diketahui'}
                            </span>
                          </div>
                          
                          <span className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold border shrink-0 ${getConditionColor(g.condition)}`}>
                            {getConditionIcon(g.condition)}
                            <span>{g.condition}</span>
                          </span>
                        </div>

                        {/* Image & Stats */}
                        <div className="grid grid-cols-3 gap-4 items-center">
                          <img src={g.photo} alt="tanaman" className="col-span-1 h-20 w-full object-cover rounded-2xl border border-slate-100" />
                          <div className="col-span-2 text-xs space-y-1 text-slate-600">
                            <div><strong>Tanggal Update:</strong> {g.date}</div>
                            <div className="flex items-center space-x-1.5">
                              <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                              <span className="font-mono text-[10px]">{g.latitude.toFixed(4)}, {g.longitude.toFixed(4)}</span>
                            </div>
                            {/* progress bar */}
                            <div className="pt-1.5 space-y-1">
                              <div className="flex justify-between text-[9px] font-bold">
                                <span>Progress Tumbuh:</span>
                                <span>{g.progress}%</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                                <div className="bg-primary h-full rounded-full" style={{ width: `${g.progress}%` }}></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 leading-normal italic bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                          "{g.description}"
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end space-x-2">
                        <button
                          onClick={() => handleGrowthEdit(g)}
                          className="p-2.5 bg-white text-slate-500 hover:text-primary rounded-xl border border-slate-100 hover:border-purple-100 shadow-sm cursor-pointer"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleGrowthDelete(g.id)}
                          className="p-2.5 bg-white text-slate-500 hover:text-red-500 rounded-xl border border-slate-100 hover:border-red-100 shadow-sm cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Gallery Manager Menu */}
        {activeMenu === 'gallery' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display font-extrabold text-3xl text-slate-900">Kelola Galeri Foto</h1>
                <p className="text-sm text-slate-500 font-semibold">Manajemen foto dokumentasi kegiatan budidaya desa.</p>
              </div>
              {!isFormOpen && (
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="flex items-center space-x-1.5 px-5 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl text-xs font-extrabold shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tambah Foto Galeri</span>
                </button>
              )}
            </div>

            {isFormOpen ? (
              // Create/Edit Gallery Form
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm max-w-2xl"
              >
                <h3 className="font-display font-bold text-slate-800 text-lg mb-6 border-b border-slate-50 pb-3">
                  {editingItem ? 'Edit Galeri' : 'Tambah Galeri Baru'}
                </h3>
                <form onSubmit={handleGallerySubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Judul Foto</label>
                      <input
                        type="text"
                        required
                        value={galleryForm.title}
                        onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-primary/50 focus:bg-white rounded-xl text-sm focus:outline-none transition-colors"
                        placeholder="Contoh: Panen Raya"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Kategori</label>
                      <select
                        required
                        value={galleryForm.category}
                        onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-primary/50 rounded-xl text-sm focus:outline-none"
                      >
                        <option value="Kebun">Kebun</option>
                        <option value="Varietas">Varietas</option>
                        <option value="Kegiatan">Kegiatan</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Upload Foto</label>
                    <div className="flex items-center space-x-3">
                      <label className="flex items-center space-x-1.5 px-4 py-3 bg-purple-50 text-primary border border-purple-100 rounded-xl text-xs font-bold cursor-pointer hover:bg-purple-100 transition-colors">
                        <Upload className="h-4 w-4" />
                        <span>Pilih Foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, (base64) => setGalleryForm({ ...galleryForm, image: base64 }))}
                          className="hidden"
                        />
                      </label>
                      {galleryForm.image && (
                        <img src={galleryForm.image} alt="gallery preview" className="h-10 w-10 object-cover rounded-lg border border-slate-100" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Deskripsi Singkat</label>
                    <textarea
                      value={galleryForm.description}
                      onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-primary/50 focus:bg-white rounded-xl text-sm focus:outline-none transition-colors h-24 resize-none"
                      placeholder="Tulis deskripsi foto..."
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-slate-50">
                    <button
                      type="button"
                      onClick={closeForm}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl text-xs font-extrabold cursor-pointer"
                    >
                      Simpan Foto
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              // Gallery Grid List
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gallery.map((item) => (
                  <div key={item.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="relative h-44 overflow-hidden bg-slate-900 shadow-inner">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-white/90 border rounded-full text-[10px] font-bold text-slate-800 uppercase tracking-wide">
                          {item.category}
                        </span>
                      </div>
                      <div className="p-5 space-y-1">
                        <h4 className="font-display font-extrabold text-slate-800 text-base leading-snug">{item.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                    {/* Actions */}
                    <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end space-x-2">
                      <button
                        onClick={() => handleGalleryEdit(item)}
                        className="p-2.5 bg-white text-slate-500 hover:text-primary rounded-xl border border-slate-100 shadow-sm cursor-pointer"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleGalleryDelete(item.id)}
                        className="p-2.5 bg-white text-slate-500 hover:text-red-500 rounded-xl border border-slate-100 shadow-sm cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Articles Manager Menu */}
        {activeMenu === 'articles' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display font-extrabold text-3xl text-slate-900">Kelola Artikel Edukasi</h1>
                <p className="text-sm text-slate-500 font-semibold">Tulis dan edit artikel tips bertani serta berita desa.</p>
              </div>
              {!isFormOpen && (
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="flex items-center space-x-1.5 px-5 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl text-xs font-extrabold shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tulis Artikel Baru</span>
                </button>
              )}
            </div>

            {isFormOpen ? (
              // Create/Edit Article Form
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm max-w-3xl"
              >
                <h3 className="font-display font-bold text-slate-800 text-lg mb-6 border-b border-slate-50 pb-3">
                  {editingItem ? 'Edit Artikel' : 'Tulis Artikel Baru'}
                </h3>
                <form onSubmit={handleArticleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Judul Artikel</label>
                      <input
                        type="text"
                        required
                        value={articleForm.title}
                        onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-primary/50 focus:bg-white rounded-xl text-sm focus:outline-none transition-colors"
                        placeholder="Contoh: Tips Pruning Anggur"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Kategori</label>
                      <select
                        required
                        value={articleForm.category}
                        onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-primary/50 rounded-xl text-sm focus:outline-none"
                      >
                        <option value="Edukasi">Edukasi</option>
                        <option value="Proteksi">Proteksi</option>
                        <option value="Tips Tani">Tips Tani</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Tanggal Terbit</label>
                      <input
                        type="date"
                        required
                        value={articleForm.date}
                        onChange={(e) => setArticleForm({ ...articleForm, date: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-primary/50 rounded-xl text-sm focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Cover Gambar</label>
                      <div className="flex items-center space-x-3">
                        <label className="flex items-center space-x-1.5 px-4 py-3 bg-purple-50 text-primary border border-purple-100 rounded-xl text-xs font-bold cursor-pointer hover:bg-purple-100 transition-colors">
                          <Upload className="h-4 w-4" />
                          <span>Pilih Cover</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, (base64) => setArticleForm({ ...articleForm, image: base64 }))}
                            className="hidden"
                          />
                        </label>
                        {articleForm.image && (
                          <img src={articleForm.image} alt="article preview" className="h-10 w-10 object-cover rounded-lg border border-slate-100" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Ringkasan Singkat (Summary)</label>
                    <input
                      type="text"
                      required
                      value={articleForm.summary}
                      onChange={(e) => setArticleForm({ ...articleForm, summary: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-primary/50 focus:bg-white rounded-xl text-sm focus:outline-none transition-colors"
                      placeholder="Tulis ringkasan satu kalimat..."
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Konten Artikel (HTML / Teks)</label>
                    <textarea
                      required
                      value={articleForm.content}
                      onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-primary/50 focus:bg-white rounded-xl text-sm focus:outline-none transition-colors h-64 resize-none font-mono text-xs"
                      placeholder="<p>Isi paragraf pertama artikel...</p>"
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-slate-50">
                    <button
                      type="button"
                      onClick={closeForm}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl text-xs font-extrabold cursor-pointer"
                    >
                      Terbitkan Artikel
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              // Articles Grid List
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((art) => (
                  <div key={art.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="relative h-44 overflow-hidden bg-slate-900 shadow-inner">
                        <img src={art.image} alt={art.title} className="w-full h-full object-cover" />
                        <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-white/90 border rounded-full text-[10px] font-bold text-slate-800 uppercase tracking-wide">
                          {art.category}
                        </span>
                      </div>
                      <div className="p-5 space-y-2">
                        <div className="flex items-center space-x-3 text-[10px] font-bold text-slate-400">
                          <span>{art.date}</span>
                          <span>•</span>
                          <span>{art.readTime}</span>
                        </div>
                        <h4 className="font-display font-extrabold text-slate-800 text-base leading-snug line-clamp-2">{art.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{art.summary}</p>
                      </div>
                    </div>
                    {/* Actions */}
                    <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end space-x-2">
                      <button
                        onClick={() => handleArticleEdit(art)}
                        className="p-2.5 bg-white text-slate-500 hover:text-primary rounded-xl border border-slate-100 shadow-sm cursor-pointer"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleArticleDelete(art.id)}
                        className="p-2.5 bg-white text-slate-500 hover:text-red-500 rounded-xl border border-slate-100 shadow-sm cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
