import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { TurkeyMap } from './TurkeyMap';
import { TURKEY_DISTRICTS } from '../data/districts';
import { calculateDistance, calculateScore, getScoreGrade } from '../utils/geo';
import { soundManager } from '../utils/audio';
import { Sparkles, Eye, RotateCcw, ArrowRight, HelpCircle, MapPin, Award, CheckCircle2 } from 'lucide-react';

export function GameView({ onScoreAdd }) {
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [selectedGender, setSelectedGender] = useState('male'); // 'male' | 'female'
  const [selectedGuess, setSelectedGuess] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showLandmarkMesh, setShowLandmarkMesh] = useState(false);
  const [roundScore, setRoundScore] = useState(0);
  const [distanceKm, setDistanceKm] = useState(0);

  const targetDistrict = TURKEY_DISTRICTS[currentRoundIndex % TURKEY_DISTRICTS.length];

  const handleGuessSubmit = () => {
    if (!selectedGuess || isRevealed) return;

    const dist = calculateDistance(
      selectedGuess.lat,
      selectedGuess.lng,
      targetDistrict.lat,
      targetDistrict.lng
    );

    const score = calculateScore(dist);
    setDistanceKm(dist);
    setRoundScore(score);
    setIsRevealed(true);
    onScoreAdd(score);

    soundManager.playReveal(score);

    if (score >= 4000) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleNextRound = () => {
    soundManager.playClick();
    setSelectedGuess(null);
    setIsRevealed(false);
    setShowHint(false);
    setShowLandmarkMesh(false);
    setCurrentRoundIndex((prev) => (prev + 1) % TURKEY_DISTRICTS.length);
  };

  const currentFaceUrl = selectedGender === 'female' ? targetDistrict.femaleFace : targetDistrict.maleFace;
  const grade = getScoreGrade(roundScore);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Top Game Bar */}
      <div className="glass-panel" style={{ padding: '16px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="badge badge-violet">
            Raund {currentRoundIndex + 1} / {TURKEY_DISTRICTS.length}
          </span>
          <span style={{ fontSize: '0.88rem', color: '#94a3b8' }}>
            Hedef: <strong style={{ color: '#f8fafc' }}>Türkiye İlçe Ortalama Yüzü</strong>
          </span>
        </div>

        {/* Gender Morph Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.05)', padding: '4px', borderRadius: '12px' }}>
          <button
            onClick={() => { soundManager.playClick(); setSelectedGender('male'); }}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: 'none',
              background: selectedGender === 'male' ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : 'transparent',
              color: selectedGender === 'male' ? '#ffffff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            👨 Erkek Ortalama Yüzü
          </button>

          <button
            onClick={() => { soundManager.playClick(); setSelectedGender('female'); }}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: 'none',
              background: selectedGender === 'female' ? 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)' : 'transparent',
              color: selectedGender === 'female' ? '#ffffff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            👩 Kadın Ortalama Yüzü
          </button>
        </div>
      </div>

      {/* Main Grid: Face Display Left, Map Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        
        {/* Left Column: Face Image & Morph Details */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
              Biyometrik Yüz Ortalama (Morph)
            </h2>
            <button
              onClick={() => setShowLandmarkMesh(!showLandmarkMesh)}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
            >
              <Eye size={14} />
              {showLandmarkMesh ? 'Nirengi Ağı Gizle' : 'Nirengi Ağı Göster'}
            </button>
          </div>

          {/* Face Image Frame */}
          <div style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1 / 1',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
            border: '2px solid rgba(255, 255, 255, 0.15)'
          }}>
            <img
              src={currentFaceUrl}
              alt="Synthesized Average Face"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: isRevealed ? 'none' : 'contrast(1.05)'
              }}
            />

            {/* Landmark Overlay SVG Simulation */}
            {showLandmarkMesh && (
              <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                {/* Delaunay Triangulation Grid Overlay */}
                <polygon points="120,180 200,160 280,180 200,240" fill="none" stroke="rgba(56, 189, 248, 0.6)" strokeWidth="1.5" />
                <polygon points="200,160 200,240 150,300" fill="none" stroke="rgba(56, 189, 248, 0.6)" strokeWidth="1.5" />
                <polygon points="200,160 200,240 250,300" fill="none" stroke="rgba(56, 189, 248, 0.6)" strokeWidth="1.5" />
                <polygon points="150,300 200,340 250,300" fill="none" stroke="rgba(56, 189, 248, 0.6)" strokeWidth="1.5" />
                <circle cx="150" cy="180" r="4" fill="#38bdf8" />
                <circle cx="250" cy="180" r="4" fill="#38bdf8" />
                <circle cx="200" cy="240" r="4" fill="#38bdf8" />
                <circle cx="200" cy="340" r="4" fill="#38bdf8" />
              </svg>
            )}

            {/* Region Hint Overlay */}
            {showHint && (
              <div style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                background: 'rgba(9, 13, 22, 0.9)',
                padding: '10px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                color: '#fbbf24',
                fontSize: '0.85rem',
                fontWeight: 700
              }}>
                💡 İpucu: {targetDistrict.region} Bölgesi
              </div>
            )}
          </div>

          {/* Morph Info & Hint trigger */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              📊 Analiz Edilen Vikipedi Biyografisi: <strong style={{ color: '#38bdf8' }}>{targetDistrict.wikiCount} kişi</strong>
            </div>

            <button
              onClick={() => setShowHint(!showHint)}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.78rem', color: '#fbbf24' }}
            >
              <HelpCircle size={14} />
              {showHint ? 'İpucunu Gizle' : 'Bölge İpucu'}
            </button>
          </div>

          {/* Revealed Info Box */}
          {isRevealed && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              padding: '16px',
              borderRadius: '16px',
              marginTop: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <CheckCircle2 size={20} color="#10b981" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                  {targetDistrict.district}, <span style={{ color: '#34d399' }}>{targetDistrict.city}</span>
                </h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                <strong>Biyometrik Özellikler:</strong> {targetDistrict.traits}
              </p>
              <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#94a3b8' }}>
                📍 Nüfus: {targetDistrict.population} | Meşhur: {targetDistrict.famousFor}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Map & Guess Execution */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
              Türkiye Coğrafya Haritası
            </h2>
            {selectedGuess && !isRevealed && (
              <span className="badge badge-emerald">
                Konum Seçildi
              </span>
            )}
          </div>

          {/* Map Container */}
          <div style={{ flex: 1, minHeight: '380px' }}>
            <TurkeyMap
              selectedGuess={selectedGuess}
              setSelectedGuess={setSelectedGuess}
              targetLocation={isRevealed ? targetDistrict : null}
              isRevealed={isRevealed}
              distanceKm={distanceKm}
            />
          </div>

          {/* Action Buttons & Results */}
          {!isRevealed ? (
            <button
              onClick={handleGuessSubmit}
              disabled={!selectedGuess}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                opacity: selectedGuess ? 1 : 0.5,
                cursor: selectedGuess ? 'pointer' : 'not-allowed'
              }}
            >
              <MapPin size={20} />
              Tahmin et
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Score card display */}
              <div style={{
                background: 'rgba(9, 13, 22, 0.9)',
                border: `1px solid ${grade.color}`,
                borderRadius: '16px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <span className="badge" style={{ background: `${grade.color}20`, color: grade.color, border: `1px solid ${grade.color}50`, marginBottom: '6px' }}>
                    {grade.badge}
                  </span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                    {grade.title}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    Mesafe Sapması: <strong style={{ color: '#f8fafc' }}>{distanceKm} km</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                    Kazanılan Puan
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: grade.color }}>
                    +{roundScore.toLocaleString()}
                  </div>
                </div>
              </div>

              <button
                onClick={handleNextRound}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Sonraki İlçe Yüzü
                <ArrowRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
