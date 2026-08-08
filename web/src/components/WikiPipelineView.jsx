import React, { useState } from 'react';
import { Cpu, Terminal, Layers, ArrowRight, Play, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { soundManager } from '../utils/audio';

export function WikiPipelineView() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [logs, setLogs] = useState([
    "[SYSTEM] WikiBioScraper pipeline hazir.",
    "[FILTER] Istanbul ilceleri (39 ilce) filtre listesine eklendi.",
    "[SYSTEM] MediaPipe Face Mesh & OpenCV Delaunay Averaging motoru aktif."
  ]);

  const handleRunSimulation = () => {
    soundManager.playClick();
    setIsSimulating(true);
    const newLogs = [
      ...logs,
      "[FETCH] Kategori: Trabzon doğumlular sorgulanıyor (tr.wikipedia.org)...",
      "[INFOBOX] Doğum yeri parse edildi: 'Sürmene, Trabzon'",
      "[CHECK] İstanbul filtresi: GEÇTİ (Sürmene != İstanbul)",
      "[ALIGN] Yüz hizalama: Göz bebekleri yatay hizalandı, 600x600 ölçeklendi.",
      "[LANDMARK] 68 Nirengi noktası çıkarıldı.",
      "[AVERAGE] Delaunay üçgenlemesi uygulandı (N=42 biyografi).",
      "[SUCCESS] Sürmene ortalama erkek ve kadın yüz imajı derlendi!"
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < newLogs.length) {
        setLogs((prev) => [...prev, newLogs[i]]);
        i++;
      } else {
        setIsSimulating(false);
        clearInterval(interval);
      }
    }, 400);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <span className="badge badge-violet">
            ⚙️ Veri & Yüz Ortalama Boru Hattı
          </span>
          <span className="badge badge-emerald">
            MediaPipe + OpenCV Delaunay
          </span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', marginBottom: '12px' }}>
          Wikipedia Veri Kazıma & Face Morphing Metodolojisi
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#94a3b8', maxWidth: '780px', lineHeight: '1.6' }}>
          Türklerin Vikipedi sayfalarından alınan biyografi fotoğrafları ve doğum ilçeleri eşleştirilerek biyometrik yüz harmanlama algoritması çalıştırılır. İstanbul hariç tutularak diğer 80 il ve ilçelerin özgün profil ortalamaları çıkarılır.
        </p>
      </div>

      {/* 4 Step Architecture Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        
        {/* Step 1 */}
        <div className="glass-panel" style={{ padding: '24px', position: 'relative' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#38bdf8', opacity: 0.3, position: 'absolute', top: '16px', right: '20px' }}>
            01
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
            1. Vikipedi Kazıma
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5' }}>
            <code>tr.wikipedia.org</code> API üzerinden Türkiye doğumlu kişilerin infobox <code>doğum_yeri</code> alanı okunur. <strong>İstanbul hariç tutulur.</strong>
          </p>
        </div>

        {/* Step 2 */}
        <div className="glass-panel" style={{ padding: '24px', position: 'relative' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#38bdf8', opacity: 0.3, position: 'absolute', top: '16px', right: '20px' }}>
            02
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
            2. Yüz Hizalama
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5' }}>
            Vesikalık ve portre fotoğraflarda göz bebekleri açı hesaplanarak yatay eksene çevrilir, 600x600 çözünürlüğe ölçeklenir.
          </p>
        </div>

        {/* Step 3 */}
        <div className="glass-panel" style={{ padding: '24px', position: 'relative' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#38bdf8', opacity: 0.3, position: 'absolute', top: '16px', right: '20px' }}>
            03
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
            3. Delaunay Üçgenlemesi
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5' }}>
            68 nirengi (landmark) noktası üzerinden ortalama yüz geometrisi hesaplanır ve Delaunay üçgen ağı (mesh) örülür.
          </p>
        </div>

        {/* Step 4 */}
        <div className="glass-panel" style={{ padding: '24px', position: 'relative' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#38bdf8', opacity: 0.3, position: 'absolute', top: '16px', right: '20px' }}>
            04
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
            4. Color Morphing
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5' }}>
            Tüm yüz yamaları Affine Dönüşümü ile ortalama nirengi ağına oturtulur ve piksel renk kanalları harmanlanarak ortalama yüz üretilir.
          </p>
        </div>
      </div>

      {/* Terminal Simulator Console */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={20} color="#38bdf8" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
              Canlı Python Boru Hattı Konsol Simülatörü
            </h3>
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="btn-primary"
            style={{ padding: '8px 18px', fontSize: '0.85rem', opacity: isSimulating ? 0.6 : 1 }}
          >
            <Play size={16} />
            {isSimulating ? 'Simülasyon Çalışıyor...' : 'Boru Hattını Çalıştır'}
          </button>
        </div>

        {/* Terminal Output Window */}
        <div style={{
          background: '#04070d',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '14px',
          padding: '16px',
          fontFamily: 'monospace',
          fontSize: '0.85rem',
          color: '#34d399',
          height: '240px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          {logs.map((log, idx) => (
            <div key={idx} style={{ color: log.includes('SUCCESS') ? '#34d399' : log.includes('FILTER') ? '#fbbf24' : '#94a3b8' }}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
