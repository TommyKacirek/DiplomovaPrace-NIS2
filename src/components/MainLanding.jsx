import React from 'react';
import './ImplementationAgent/ImplementationModule.css';

export default function MainLanding({ onSelectMode }) {
    return (
        <div className="apple-landing-wrapper fade-in">

            {/* Navbar Placeholder (for aesthetics) */}
            <nav className="apple-nav">
                <div className="nav-content">
                    <span className="apple-logo"></span>
                    <span className="nav-title">NIS2 Portal</span>
                </div>
            </nav>

            <div className="apple-container">
                {/* Hero Section */}
                <header className="apple-hero">
                    <h1 className="hero-title">
                        Kybernetická bezpečnost. <br />
                        <span className="text-gradient-apple">Jednoduše.</span>
                    </h1>
                    <p className="hero-subtitle">
                        Centrální nástroj pro soulad se směrnicí NIS2 a vyhláškou 410/2025 Sb.
                        Navrženo pro bezpečnost vašich dat.
                    </p>
                </header>

                {/* Bento Grid */}
                <div className="bento-grid">

                    {/* Card 1: Calculator */}
                    <div
                        className="bento-card card-calculator"
                        onClick={() => onSelectMode('calculator')}
                        role="button"
                        tabIndex={0}
                    >
                        <div className="card-bg-gradient"></div>
                        <div className="bento-content">
                            <div className="icon-badge orange">🧮</div>
                            <h3>Kalkulačka</h3>
                            <p>Rychlá analýza povinností.</p>
                            <div className="card-footer">
                                <span className="link-arrow">Spustit</span>
                            </div>
                        </div>
                        <div className="card-visual visual-calc">
                            {/* Abstract decorative elements */}
                            <div className="calc-ui-mockup">
                                <div className="line l1"></div>
                                <div className="line l2"></div>
                                <div className="circle c1"></div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Agent */}
                    <div
                        className="bento-card card-agent"
                        onClick={() => onSelectMode('implementation')}
                        role="button"
                        tabIndex={0}
                    >
                        <div className="card-bg-gradient"></div>
                        <div className="bento-content">
                            <div className="icon-badge blue">🚀</div>
                            <h3>Implementace</h3>
                            <p>Průvodce krok za krokem.</p>
                            <div className="card-footer">
                                <span className="link-arrow">Otevřít</span>
                            </div>
                        </div>
                        <div className="card-visual visual-agent">
                            <div className="agent-ui-mockup">
                                <div className="shield-icon">🛡️</div>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Info (Non-clickable / decorative) */}
                    <div className="bento-card card-info">
                        <div className="bento-content">
                            <div className="icon-badge gray">🔒</div>
                            <h3>Soukromí</h3>
                            <p>Vaše data neopouští tento prohlížeč. Zpracování probíhá lokálně.</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
