import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, getDocs, doc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth } from './firebase';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProfileDesa from './components/ProfileDesa';
import GisMap from './components/GisMap';
import Gallery from './components/Gallery';
import Articles from './components/Articles';
import Contact from './components/Contact';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import { Leaf } from 'lucide-react';

// Default Seed Data
const defaultFarmers = [
  { id: 1, name: 'Pak Budi Santoso', phone: '081234567890', address: 'Dusun Krajan, RT 02/RW 01, Krejengan', photo: '/grape_harvest.png', date: '2026-01-12', description: 'Kelompok Tani Tani Makmur I.' },
  { id: 2, name: 'Ibu Siti Aminah', phone: '082345678901', address: 'Dusun Tengah, RT 05/RW 02, Krejengan', photo: '/hero_grapes.png', date: '2026-02-15', description: 'Ketua Kelompok Wanita Tani Aqila.' },
  { id: 3, name: 'Pak Supardi', phone: '083456789012', address: 'Dusun Barat, RT 01/RW 03, Krejengan', photo: '/grape_greenhouse.png', date: '2026-03-01', description: 'Anggota Kelompok Tani Tani Makmur I.' },
  { id: 4, name: 'Pak Hendra Wijaya', phone: '084567890123', address: 'Dusun Timur, RT 03/RW 01, Krejengan', photo: '/grape_greenhouse.png', date: '2026-02-01', description: 'Kelompok Tani Maju Bersama.' },
  { id: 5, name: 'Ibu Retno Lestari', phone: '085678901234', address: 'Dusun Selatan, RT 04/RW 02, Krejengan', photo: '/grape_greenhouse.png', date: '2026-05-20', description: 'Anggota Kelompok Wanita Tani Aqila.' },
  { id: 6, name: 'Pak Ahmad Fauzi', phone: '086789012345', address: 'Dusun Krajan, RT 03/RW 01, Krejengan', photo: '/hero_grapes.png', date: '2026-02-18', description: 'Kelompok Tani Maju Bersama.' }
];

const defaultGrapes = [
  { id: 1, name: 'Jupiter', photo: '/grape_harvest.png', initialLocation: 'Greenhouse Pembibitan Sentral', date: '2026-01-02', description: 'Varietas impor asal AS, rasa sangat manis dengan aroma muscat/mangga yang kuat. Sangat genjah.' },
  { id: 2, name: 'Transfigurasi', photo: '/hero_grapes.png', initialLocation: 'Balai Penelitian Pertanian', date: '2026-01-05', description: 'Varietas asal Ukraina, buah berbentuk lonjong besar berwarna merah kekuningan yang menarik.' },
  { id: 3, name: 'Ninel', photo: '/grape_greenhouse.png', initialLocation: 'Greenhouse Pembibitan Sentral', date: '2026-01-10', description: 'Varietas impor asal Ukraina, produktivitas tinggi, buah merah keunguan tahan pecah (crack).' },
  { id: 4, name: 'Dixon', photo: '/grape_greenhouse.png', initialLocation: 'Greenhouse Pembibitan Sentral', date: '2026-01-15', description: 'Varietas kuning kehijauan silinder, buah sangat renyah dengan tekstur daging padat.' },
  { id: 5, name: 'Harold', photo: '/grape_greenhouse.png', initialLocation: 'Nursery Pertanian Jawa Timur', date: '2026-02-01', description: 'Varietas anggur hijau genjah beraroma wangi harum yang tahan terhadap kelembaban tinggi.' },
  { id: 6, name: 'Everest', photo: '/hero_grapes.png', initialLocation: 'Nursery Pertanian Jawa Timur', date: '2026-02-10', description: 'Varietas premium buah merah tua bulat sangat besar dengan kulit buah tebal.' }
];

const defaultGrowths = [
  { id: 1, farmerId: 1, grapeId: 1, photo: '/grape_harvest.png', latitude: -7.7925, longitude: 113.4070, condition: 'Sehat', progress: 75, date: '2026-06-10', description: 'Fase Pembuahan. Pemupukan generatif dengan MKP & KNO3 selesai. Berry mulai membesar.' },
  { id: 2, farmerId: 2, grapeId: 2, photo: '/hero_grapes.png', latitude: -7.7940, longitude: 113.4110, condition: 'Siap Panen', progress: 95, date: '2026-06-11', description: 'Warna buah merah keunguan merata. Rasa manis optimal. Siap petik agrowisata.' },
  { id: 3, farmerId: 3, grapeId: 3, photo: '/grape_greenhouse.png', latitude: -7.7900, longitude: 113.4055, condition: 'Sehat', progress: 30, date: '2026-06-08', description: 'Fase Vegetatif. Batang tersier mulai cokelat pasca pruning pertama. Tunas tumbuh vigor.' },
  { id: 4, farmerId: 4, grapeId: 4, photo: '/grape_greenhouse.png', latitude: -7.7915, longitude: 113.4015, condition: 'Penyembuhan', progress: 50, date: '2026-06-09', description: 'Fase Berbunga. Terkena serangan kutu perisai ringan, sudah disemprot insektisida nabati.' },
  { id: 5, farmerId: 5, grapeId: 5, photo: '/grape_greenhouse.png', latitude: -7.7960, longitude: 113.4060, condition: 'Sehat', progress: 15, date: '2026-06-12', description: 'Fase Vegetatif. Bibit beradaptasi dengan baik di tanah terbuka. Daun baru mulai subur.' },
  { id: 6, farmerId: 6, grapeId: 6, photo: '/hero_grapes.png', latitude: -7.7932, longitude: 113.4085, condition: 'Tidak Sehat', progress: 80, date: '2026-06-11', description: 'Fase Pembuahan. Terkena bercak daun karat karena kelembaban tinggi. Sedang disemprot fungisida.' }
];

const defaultGallery = [
  { id: 1, title: 'Kebun Anggur Krejengan Terbuka', category: 'Kebun', description: 'Kebun anggur pekarangan yang dibudidayakan secara organik oleh anggota KOMPAK.', image: '/hero_grapes.png' },
  { id: 2, title: 'Nursery & Greenhouse Modern', category: 'Kebun', description: 'Greenhouse desa tempat pembibitan awal dan pemeliharaan anakan pohon anggur impor.', image: '/grape_greenhouse.png' },
  { id: 3, title: 'Hasil Panen Varietas Transfigurasi', category: 'Varietas', description: 'Biji buah anggur segar berukuran besar berwarna merah keunguan dengan tingkat kemanisan tinggi.', image: '/grape_harvest.png' },
  { id: 4, title: 'Sosialisasi & Edukasi Kelompok Tani', category: 'Kegiatan', description: 'Kegiatan rutin berbagi tips pruning dan pemupukan bersama dinas pertanian kabupaten.', image: '/grape_learning.png' },
  { id: 5, title: 'Budidaya Sistem Para-para', category: 'Kebun', description: 'Metode perambatan cabang anggur menggunakan kawat horizontal untuk memaksimalkan paparan matahari.', image: '/hero_grapes.png' },
  { id: 6, title: 'Varietas Jupiter Siap Petik', category: 'Varietas', description: 'Anggur jenis Jupiter yang sudah matang sempurna dengan cita rasa aroma mangga yang khas.', image: '/grape_harvest.png' }
];

const defaultArticles = [
  {
    id: 1,
    title: 'Panduan Pemangkasan (Pruning) Anggur untuk Hasil Melimpah',
    category: 'Edukasi',
    date: '05 Jun 2026',
    author: 'Admin KOMPAK',
    readTime: '5 Menit',
    summary: 'Pemangkasan dahan (pruning) adalah kunci utama merangsang keluarnya bunga dan buah anggur. Pelajari teknik pruning dasar untuk pemula.',
    image: '/grape_harvest.png',
    content: `
      <p class="mb-4">Pemangkasan (pruning) dahan merupakan salah satu tindakan paling krusial dalam budidaya anggur. Tanpa pemangkasan yang tepat, tanaman anggur hanya akan tumbuh memanjang dengan daun yang lebat namun sangat minim memproduksi buah.</p>
      <h4 class="font-display font-bold text-slate-800 text-lg mt-6 mb-2">1. Memahami Struktur Cabang</h4>
      <p class="mb-4">Sebelum memotong, pastikan Anda memahami tiga struktur utama:</p>
      <ul class="list-disc pl-5 mb-4 space-y-1">
        <li><strong>Cabang Primer:</strong> Batang utama yang tumbuh dari tanah ke atas tiang perambatan.</li>
        <li><strong>Cabang Sekunder:</strong> Cabang horisontal yang tumbuh dari cabang primer di sepanjang kawat rambatan.</li>
        <li><strong>Cabang Tersier:</strong> Cabang vertikal yang tumbuh dari cabang sekunder. Di cabang tersier inilah buah anggur nantinya akan bergelantungan.</li>
      </ul>
      <h4 class="font-display font-bold text-slate-800 text-lg mt-6 mb-2">2. Kapan Waktu Melakukan Pruning?</h4>
      <p class="mb-4">Pruning pembuahan sebaiknya dilakukan saat tanaman sudah berusia minimal 8-12 bulan, batang tersier sudah berwarna cokelat (berkayu), dan tanaman terlihat dalam kondisi sangat vigor. Lakukan pemangkasan pada pagi hari yang cerah agar luka bekas potongan cepat kering.</p>
      <h4 class="font-display font-bold text-slate-800 text-lg mt-6 mb-2">3. Teknik Pemotongan (Bud Selection)</h4>
      <p class="mb-4">Secara umum ada dua metode pemangkasan berdasarkan jenis varietas anggur:</p>
      <ul class="list-disc pl-5 mb-4 space-y-1">
        <li><strong>Spur Pruning (Pendek):</strong> Memotong cabang tersier dengan menyisakan 2-3 mata tunas (bud) dari pangkal. Sangat cocok untuk varietas genjah seperti Jupiter.</li>
        <li><strong>Cane Pruning (Panjang):</strong> Memotong cabang tersier dengan menyisakan 8-12 mata tunas. Metode ini direkomendasikan untuk varietas impor berukuran buah besar.</li>
      </ul>
    `
  },
  {
    id: 2,
    title: 'Mengenal dan Mengatasi Jamur Downy Mildew pada Daun Anggur',
    category: 'Proteksi',
    date: '28 May 2026',
    author: 'Tim Penyuluh Tani',
    readTime: '4 Menit',
    summary: 'Penyakit jamur Downy Mildew sering menyerang daun anggur di musim hujan. Berikut cara pencegahan dan pengobatannya.',
    image: '/grape_greenhouse.png',
    content: `
      <p class="mb-4">Downy Mildew (embun bulu) merupakan penyakit daun yang disebabkan oleh patogen oomycete bernama <em>Plasmopara viticola</em>. Penyakit ini merupakan musuh utama petani anggur di iklim tropis basah selama musim penghujan.</p>
      <h4 class="font-display font-bold text-slate-800 text-lg mt-6 mb-2">1. Gejala Serangan</h4>
      <p class="mb-4">Pada tahap awal, bagian atas daun akan memperlihatkan bercak-bercak berminyak berwarna kekuningan. Jika daun dibalik, pada bagian bawah bercak tersebut akan tumbuh lapisan bulu halus berwarna putih kelabu.</p>
      <h4 class="font-display font-bold text-slate-800 text-lg mt-6 mb-2">2. Penanganan Organik</h4>
      <p class="mb-4">Semprotkan larutan baking soda (1 sendok teh) dicampur minyak sayur (1 sendok makan) dan sabun pencuci piring cair (beberapa tetes) dalam 2 liter air hangat.</p>
    `
  },
  {
    id: 3,
    title: 'Rahasia Racikan Pupuk Organik Cair (POC) Khusus Tanaman Anggur',
    category: 'Tips Tani',
    date: '15 May 2026',
    author: 'Pak Budi (Ketua KOMPAK)',
    readTime: '6 Menit',
    summary: 'Manfaatkan bahan organik pekarangan dan urin kelinci menjadi pupuk cair penyubur daun dan buah anggur agar lebat.',
    image: '/grape_learning.png',
    content: `
      <p class="mb-4">Pupuk organik cair (POC) buatan sendiri tidak hanya ramah di kantong, tetapi juga sangat kaya mikroorganisme menguntungkan yang menjaga porositas dan kesuburan tanah pekarangan anggur dalam jangka panjang.</p>
      <h4 class="font-display font-bold text-slate-800 text-lg mt-6 mb-2">Bahan-Bahan yang Diperlukan:</h4>
      <ul class="list-disc pl-5 mb-4 space-y-1">
        <li>Urin Kelinci atau Urin Sapi (10 Liter)</li>
        <li>Air Cucian Beras pertama (5 Liter)</li>
        <li>Air Kelapa tua (5 Liter)</li>
        <li>Bonggol Pisang (diiris halus/ditumbuk) (1 kg)</li>
        <li>EM4 Pertanian sebagai dekomposer (100 ml)</li>
        <li>Molase/Tetes Tebu atau air gula merah (250 ml)</li>
      </ul>
    `
  }
];

function App() {
  const [view, setView] = useState('public'); // 'public', 'login', 'admin'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [farmers, setFarmers] = useState([]);
  const [grapes, setGrapes] = useState([]);
  const [growths, setGrowths] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [articles, setArticles] = useState([]);

  // Auto-seed function (only runs if collection is empty)
  const seedCollection = async (collectionName, defaultData) => {
    const colRef = collection(db, collectionName);
    const snap = await getDocs(colRef);
    if (snap.empty) {
      console.log(`Seeding ${collectionName}...`);
      for (const item of defaultData) {
        const id = item.id.toString();
        await setDoc(doc(db, collectionName, id), item);
      }
    }
  };

  useEffect(() => {
    const seedData = async () => {
      await seedCollection('farmers', defaultFarmers);
      await seedCollection('grapes', defaultGrapes);
      await seedCollection('growths', defaultGrowths);
      await seedCollection('gallery', defaultGallery);
      await seedCollection('articles', defaultArticles);
    };
    seedData();

    const unsubFarmers = onSnapshot(collection(db, 'farmers'), (snap) => {
      setFarmers(snap.docs.map(doc => ({ id: Number(doc.id), ...doc.data() })));
    });
    const unsubGrapes = onSnapshot(collection(db, 'grapes'), (snap) => {
      setGrapes(snap.docs.map(doc => ({ id: Number(doc.id), ...doc.data() })));
    });
    const unsubGrowths = onSnapshot(collection(db, 'growths'), (snap) => {
      setGrowths(snap.docs.map(doc => ({ id: Number(doc.id), ...doc.data() })));
    });
    const unsubGallery = onSnapshot(collection(db, 'gallery'), (snap) => {
      setGallery(snap.docs.map(doc => ({ id: Number(doc.id), ...doc.data() })));
    });
    const unsubArticles = onSnapshot(collection(db, 'articles'), (snap) => {
      setArticles(snap.docs.map(doc => ({ id: Number(doc.id), ...doc.data() })));
    });

    return () => {
      unsubFarmers(); unsubGrapes(); unsubGrowths(); unsubGallery(); unsubArticles();
    };
  }, []);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    // setIsLoggedIn is handled by onAuthStateChanged
    setView('admin');
  };

  const handleLogout = async () => {
    await signOut(auth);
    setView('public');
  };

  const currentYear = new Date().getFullYear();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>;

  // Render Admin Dashboard view
  if (view === 'admin' && isLoggedIn) {
    return (
      <AdminDashboard
        farmers={farmers}
        setFarmers={setFarmers}
        grapes={grapes}
        setGrapes={setGrapes}
        growths={growths}
        setGrowths={setGrowths}
        gallery={gallery}
        setGallery={setGallery}
        articles={articles}
        setArticles={setArticles}
        onLogout={handleLogout}
        onBackToPublic={() => setView('public')}
      />
    );
  }

  // Render Login view
  if (view === 'login') {
    return (
      <Login
        onLoginSuccess={handleLogin}
        onBackToPublic={() => setView('public')}
      />
    );
  }

  // Render Public Portal view
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-16 md:pb-0">
      {/* Navigation */}
      <Navbar
        isLoggedIn={isLoggedIn}
        onLoginClick={() => setView('login')}
        onDashboardClick={() => setView('admin')}
        onLogout={handleLogout}
      />

      {/* Main Sections */}
      <main className="flex-grow">
        <Hero />
        <ProfileDesa />
        <GisMap growths={growths} farmers={farmers} grapes={grapes} />
        <Gallery gallery={gallery} />
        <Articles articles={articles} />
        <Contact />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-slate-800 pb-8">
            {/* Logo Description */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-tr from-primary to-leaf rounded-xl">
                  <Leaf className="h-5 w-5 text-white" />
                </div>
                <span className="font-display font-extrabold text-white text-lg tracking-wider">
                  KREJENGAN ANGGUR
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed">
                Portal Informasi Geografis dan Monitoring Pertumbuhan Tanaman Anggur Kelompok Tani KOMPAK Desa Krejengan, Kecamatan Krejengan, Kabupaten Probolinggo.
              </p>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-4 grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="block text-xs font-extrabold uppercase text-slate-300 tracking-wider">Peta Situs</span>
                <ul className="text-xs space-y-1.5 font-semibold">
                  <li><a href="#home" className="hover:text-white transition-colors">Beranda</a></li>
                  <li><a href="#profile" className="hover:text-white transition-colors">Profil Desa</a></li>
                  <li><a href="#gis-map" className="hover:text-white transition-colors">Peta GIS</a></li>
                </ul>
              </div>
              <div className="space-y-2">
                <span className="block text-xs font-extrabold uppercase text-slate-300 tracking-wider">Informasi</span>
                <ul className="text-xs space-y-1.5 font-semibold">
                  <li><a href="#gallery" className="hover:text-white transition-colors">Galeri Foto</a></li>
                  <li><a href="#articles" className="hover:text-white transition-colors">Artikel Tani</a></li>
                  <li><a href="#contact" className="hover:text-white transition-colors">Kontak Kami</a></li>
                </ul>
              </div>
            </div>

            {/* Support / Credit */}
            <div className="md:col-span-3 text-left md:text-right space-y-2">
              <span className="block text-xs font-extrabold uppercase text-slate-300 tracking-wider">Didukung Oleh</span>
              <p className="text-xs text-slate-500 font-semibold">
                Pemerintah Desa Krejengan &<br />
                Komunitas Pembudidaya Anggur Krejengan (KOMPAK)
              </p>
            </div>
          </div>

          {/* Copyright Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-8 text-[11px] font-semibold text-slate-600 gap-4">
            <span>
              &copy; {currentYear} Pemerintah Desa Krejengan. Hak Cipta Dilindungi.
            </span>
            <div className="flex space-x-4">
              <span className="hover:text-slate-400 transition-colors">Kebijakan Privasi</span>
              <span>•</span>
              <span className="hover:text-slate-400 transition-colors">Syarat Penggunaan</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
