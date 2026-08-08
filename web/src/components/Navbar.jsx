import React from 'react';
import { MapPin, Compass, Cpu, HelpCircle, Trophy, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

export function Navbar({ currentTab, setTab, totalScore, roundCount }) {
  const handleTabChange = (tabId) => {
    soundManager.playClick();
    setTab(tabId);
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(9, 13, 22, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '14px 24px'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => handleTabChange('game')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)'
          }}>
            <MapPin size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                Memleket<span style={{ color: '#38bdf8' }}>Nere?</span>
              </h1>
              <span className="badge badge-cyan" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                TR İlçeleri
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>
              Face Morphing & Geoguessr Türkiye
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => handleTabChange('game')}
            className={`btn-secondary ${currentTab === 'game' ? 'glass-panel-hover' : ''}`}
            style={{
              background: currentTab === 'game' ? 'linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(139,92,246,0.2) 100%)' : 'transparent',
              borderColor: currentTab === 'game' ? '#3b82f6' : 'transparent',
              color: currentTab === 'game' ? '#38bdf8' : '#94a3b8'
            }}
          >
            <Sparkles size={18} />
            <span>Oyna</span>
          </button>

          <button
            onClick={() => handleTabChange('explore')}
            className="btn-secondary"
            style={{
              background: currentTab === 'explore' ? 'linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(139,92,246,0.2) 100%)' : 'transparent',
              borderColor: currentTab === 'explore' ? '#3b82f6' : 'transparent',
              color: currentTab === 'explore' ? '#38bdf8' : '#94a3b8'
            }}
          >
            <Compass size={18} />
            <span>İlçe Yüz Atlası</span>
          </button>

          <button
            onClick={() => handleTabChange('pipeline')}
            className="btn-secondary"
            style={{
              background: currentTab === 'pipeline' ? 'linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(139,92,246,0.2) 100%)' : 'transparent',
              borderColor: currentTab === 'pipeline' ? '#3b82f6' : 'transparent',
              color: currentTab === 'pipeline' ? '#38bdf8' : '#94a3b8'
            }}
          >
            <Cpu size={18} />
            <span>Veri Boru Hattı</span>
          </button>
        </nav>

        {/* Score & Streak Header Meter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Trophy size={20} color="#fbbf24" />
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                Toplam Puan
              </div>
              <div className="text-gradient-gold" style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                {totalScore.toLocaleString()} <span style={{ fontSize: '0.8rem' }}>pts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
