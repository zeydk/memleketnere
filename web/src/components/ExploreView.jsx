import React, { useState } from 'react';
import { TURKEY_DISTRICTS, TURKEY_REGIONS } from '../data/districts';
import { Search, MapPin, Users, Sparkles, Filter } from 'lucide-react';
import { soundManager } from '../utils/audio';

export function ExploreView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [activeDistrictId, setActiveDistrictId] = useState(TURKEY_DISTRICTS[0].id);

  const filteredDistricts = TURKEY_DISTRICTS.filter((item) => {
    const matchesSearch = item.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'ALL' || item.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const activeDistrict = TURKEY_DISTRICTS.find((d) => d.id === activeDistrictId) || TURKEY_DISTRICTS[0];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '640px', position: 'relative', zIndex: 2 }}>
          <span className="badge badge-cyan" style={{ marginBottom: '12px' }}>
            📖 Türkiye Biyometrik Yüz Atlası
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', marginBottom: '12px' }}>
            İlçelerin Ortalama Yüz Profilleri
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: '1.6' }}>
            Türklerin Türkçe Vikipedi biyografilerindeki doğum yerleri ve vesikalık fotoğrafları baz alınarak yüz hizalama (eye alignment) ve Delaunay nirengi harmanlama algoritması ile üretilmiştir. İstanbul kozmopolit yapısı nedeniyle kapsam dışındadır.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel" style={{ padding: '16px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="İl veya ilçe ara (örn: Sürmene, Bodrum, Konya...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              padding: '10px 14px 10px 42px',
              color: '#ffffff',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Region Filter Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          <button
            onClick={() => { soundManager.playClick(); setSelectedRegion('ALL'); }}
            className="btn-secondary"
            style={{
              padding: '6px 14px',
              fontSize: '0.82rem',
              background: selectedRegion === 'ALL' ? '#3b82f6' : 'transparent',
              color: selectedRegion === 'ALL' ? '#ffffff' : '#94a3b8'
            }}
          >
            Tüm Bölgeler
          </button>
          {TURKEY_REGIONS.map((reg) => (
            <button
              key={reg}
              onClick={() => { soundManager.playClick(); setSelectedRegion(reg); }}
              className="btn-secondary"
              style={{
                padding: '6px 14px',
                fontSize: '0.82rem',
                whiteSpace: 'nowrap',
                background: selectedRegion === reg ? '#3b82f6' : 'transparent',
                color: selectedRegion === reg ? '#ffffff' : '#94a3b8'
              }}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      {/* Main Catalog View: District List Left, Side-by-Side Face Display Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Left: District List Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '720px', overflowY: 'auto', paddingRight: '4px' }}>
          {filteredDistricts.length === 0 ? (
            <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
              Arama kriterlerine uygun ilçe bulunamadı.
            </div>
          ) : (
            filteredDistricts.map((d) => {
              const isActive = d.id === activeDistrict.id;
              return (
                <div
                  key={d.id}
                  onClick={() => { soundManager.playClick(); setActiveDistrictId(d.id); }}
                  className={`glass-panel ${isActive ? 'glass-panel-hover' : ''}`}
                  style={{
                    padding: '16px 20px',
                    cursor: 'pointer',
                    borderColor: isActive ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)',
                    background: isActive ? 'rgba(59, 130, 246, 0.15)' : 'rgba(18, 26, 44, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                      {d.district}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
                      {d.city} • <span style={{ color: '#38bdf8' }}>{d.region}</span>
                    </div>
                  </div>
                  <span className="badge badge-violet" style={{ fontSize: '0.72rem' }}>
                    {d.wikiCount} Bio
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Active District Side-by-Side Morph Detail Panel */}
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff' }}>
                  {activeDistrict.district} <span style={{ color: '#3b82f6', fontSize: '1.2rem' }}>({activeDistrict.city})</span>
                </h2>
                <div style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '4px' }}>
                  📍 Coğrafi Bölge: <strong style={{ color: '#f8fafc' }}>{activeDistrict.region} Bölgesi</strong>
                </div>
              </div>
              <span className="badge badge-emerald">
                {activeDistrict.wikiCount} Biyografi Analizi
              </span>
            </div>
          </div>

          {/* Side by Side Faces */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Male Face */}
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#38bdf8', marginBottom: '8px', textAlign: 'center' }}>
                👨 Ortalama Erkek Yüzü
              </div>
              <div style={{ borderRadius: '16px', overflow: 'hidden', border: '2px solid rgba(56, 189, 248, 0.3)', aspectRatio: '1 / 1' }}>
                <img
                  src={activeDistrict.maleFace}
                  alt={`${activeDistrict.district} Male Average Face`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* Female Face */}
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ec4899', marginBottom: '8px', textAlign: 'center' }}>
                👩 Ortalama Kadın Yüzü
              </div>
              <div style={{ borderRadius: '16px', overflow: 'hidden', border: '2px solid rgba(236, 72, 153, 0.3)', aspectRatio: '1 / 1' }}>
                <img
                  src={activeDistrict.femaleFace}
                  alt={`${activeDistrict.district} Female Average Face`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>

          {/* District Traits & Details */}
          <div style={{ background: 'rgba(9, 13, 22, 0.6)', padding: '16px 20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc', marginBottom: '8px' }}>
              🧬 Biyometrik & Bölgesel Karakteristik
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '12px' }}>
              {activeDistrict.traits}
            </p>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <span>👥 Tahmini İlçe Nüfusu: <strong style={{ color: '#f8fafc' }}>{activeDistrict.population}</strong></span>
              <span>⭐ Meşhur Değerleri: <strong style={{ color: '#f8fafc' }}>{activeDistrict.famousFor}</strong></span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
