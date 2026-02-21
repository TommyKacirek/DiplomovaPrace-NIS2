import React from 'react';
import '../App.css'; // Global styles

export default function MainLanding({ onSelectMode }) {
  return (
    <div className="landing-bento-wrapper fade-in">

      {/* Header / Hero */}
      <header style={{ textAlign: 'center', marginBottom: '80px', marginTop: '60px' }}>
        {/* Replaced Apple Logo with NIS2 Shield/Icon */}
        <div style={{ fontSize: 'clamp(3rem, 5vw, 4rem)', marginBottom: '16px' }}>🛡️</div>
        <h1 style={{ lineHeight: 1.1 }}>
          NIS2 <span className="text-gradient-apple">Portal</span>
        </h1>
        <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--text-dim)', maxWidth: '640px', margin: '24px auto', lineHeight: 1.5 }}>
          Centrální nástroj pro kybernetickou bezpečnost.
        </p>
      </header>

      {/* Bento Grid Container */}
      <div className="bento-grid">

        {/* Card 1: Calculator */}
        <div
          className="bento-card"
          onClick={() => onSelectMode('calculator')}
          role="button"
          tabIndex={0}
        >
          <div className="card-top">
            <div className="card-badge orange">🧮</div>
            <div className="card-arrow">↗</div>
          </div>
          <div className="card-content-wrap">
            <h3>NIS2 Kalkulačka</h3>
            <p>Rychlá analýza povinností a kategorizace subjektu.</p>
          </div>
        </div>

        {/* Card 2: Agent (V1) */}
        <div
          className="bento-card"
          onClick={() => onSelectMode('implementation')}
          role="button"
          tabIndex={0}
        >
          <div className="card-top">
            <div className="card-badge purple">🚀</div>
            <div className="card-arrow">↗</div>
          </div>
          <div className="card-content-wrap">
            <h3>Nástroj V1</h3>
            <p>Interaktivní průvodce (Původní verze).</p>
          </div>
        </div>

        {/* Card 3: Agent (V2 - The Profiler) */}
        <div
          className="bento-card"
          onClick={() => onSelectMode('implementation-v2')}
          role="button"
          tabIndex={0}
          style={{ borderColor: 'rgba(50, 215, 75, 0.3)' }}
        >
          <div className="card-top">
            <div className="card-badge" style={{ background: 'rgba(50, 215, 75, 0.15)', color: '#32d74b' }}>⚖️</div>
            <div className="card-arrow">↗</div>
          </div>
          <div className="card-content-wrap">
            <h3>Agent v2 (The Profiler)</h3>
            <p>Nová generace s kalkulací právního štítu a přiměřenosti.</p>
          </div>
        </div>

        {/* Card 4: Info (Full Width) */}
        <div className="bento-card wide">
          <div className="card-content-horizontal">
            <div className="card-badge gray">🔒</div>
            <div>
              <h3>Bezpečné & Lokální</h3>
              <p>Všechna data jsou zpracována pouze ve vašem prohlížeči.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Internal CSS for Bento Grid */}
      <style>{`
        .landing-bento-wrapper {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          box-sizing: border-box;
        }

        .bento-grid {
          display: grid;
          /* UPDATED: Wider columns per request (350px) */
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); 
          gap: 24px;
          margin-bottom: 40px;
        }

        .bento-card {
          background-color: var(--bg-card);
          border-radius: var(--radius-card);
          padding: 32px;
          border: 1px solid var(--border-subtle);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 240px;
        }

        .bento-card.wide {
          grid-column: 1 / -1;
          min-height: auto;
          flex-direction: row;
          align-items: center;
        }

        .bento-card:hover {
          background-color: var(--bg-card-hover);
          transform: scale(1.02);
          border-color: rgba(191, 90, 242, 0.3);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .card-badge {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }
        
        .card-content-horizontal {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        /* Using global vars for badges too if possible or hardcoded to match theme */
        .card-badge.purple { background: rgba(191, 90, 242, 0.15); color: #bf5af2; }
        .card-badge.orange { background: rgba(255, 149, 0, 0.15); color: #ff9500; }
        .card-badge.gray   { background: rgba(142, 142, 147, 0.15); color: #8e8e93; }

        .card-content-wrap h3 {
          margin: 0 0 8px 0;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-main);
        }
        
        .bento-card.wide h3 { margin: 0 0 4px 0; font-size: 1.25rem; }

        .card-content-wrap p {
          margin: 0;
          color: var(--text-dim);
          font-size: 1rem;
          line-height: 1.4;
        }

        .card-arrow {
          font-size: 1.2rem;
          color: var(--text-dim);
          transition: all 0.3s ease;
          width: 32px; 
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.05);
        }

        .bento-card:hover .card-arrow {
          background: var(--accent-purple);
          color: white;
        }

        @media (max-width: 768px) {
          .bento-grid { grid-template-columns: 1fr; }
          .bento-card.wide { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </div>
  );
}
