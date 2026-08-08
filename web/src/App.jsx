import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { GameView } from './components/GameView';
import { ExploreView } from './components/ExploreView';
import { WikiPipelineView } from './components/WikiPipelineView';

export function App() {
  const [currentTab, setTab] = useState('game'); // 'game' | 'explore' | 'pipeline'
  const [totalScore, setTotalScore] = useState(0);

  const handleScoreAdd = (points) => {
    setTotalScore((prev) => prev + points);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        currentTab={currentTab}
        setTab={setTab}
        totalScore={totalScore}
      />

      <main style={{ flex: 1 }}>
        {currentTab === 'game' && <GameView onScoreAdd={handleScoreAdd} />}
        {currentTab === 'explore' && <ExploreView />}
        {currentTab === 'pipeline' && <WikiPipelineView />}
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '24px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        color: '#64748b',
        fontSize: '0.85rem',
        marginTop: '40px'
      }}>
        <div>
          MemleketNere? &copy; 2026 — Türkiye İlçe Yüz Tahmin Oyunu & Biyometrik Face Averaging Boru Hattı.
        </div>
        <div style={{ marginTop: '4px', fontSize: '0.78rem' }}>
          Vikipedi (tr.wikipedia.org) açık biyografi verileri kullanılarak geliştirilmiştir. İstanbul hariç tutulmuştur.
        </div>
      </footer>
    </div>
  );
}

export default App;
