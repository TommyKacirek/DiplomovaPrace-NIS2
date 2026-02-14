import React, { useState, useRef } from 'react';
import IdentificationStep from './IdentificationStep';
import RiskAndAssetStep from './RiskAndAssetStep';
import SecurityMeasuresTable from './SecurityMeasuresTable';
import './ImplementationModule.css';

export default function ImplementationModule() {
    const [currentStep, setCurrentStep] = useState(0); // 0 = Internal Landing
    const [moduleData, setModuleData] = useState({
        legalContext: {},
        riskData: { assets: [], smartLogic: {} },
        finalMeasures: []
    });

    const fileInputRef = useRef(null);

    // --- Handlers ---
    const handleNextStep = (dataKey, data) => {
        setModuleData(prev => ({
            ...prev,
            [dataKey]: data.data || data
        }));
        if (currentStep < 4) setCurrentStep(prev => prev + 1);
    };

    const exportAuditToJson = () => {
        const dataStr = JSON.stringify(moduleData, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `nis2_audit_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const importAuditFromJson = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                if (importedData.legalContext || importedData.riskData) {
                    setModuleData(importedData);
                    setCurrentStep(1);
                } else {
                    alert('Chyba: Neplatný formát souboru.');
                }
            } catch (err) {
                console.error(err);
                alert('Chyba při čtení souboru.');
            }
        };
        reader.readAsText(file);
    };

    // --- Content Rendering ---
    const renderContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="internal-landing fade-in">
                        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '0.5rem' }}>Implementation Agent</h1>
                        <p style={{ fontSize: '1.25rem', marginBottom: '3rem', maxWidth: '600px' }}>
                            Vyhláška 410/2025 Sb.
                        </p>

                        <div className="landing-cards-row">
                            <div
                                className="action-card"
                                onClick={() => setCurrentStep(1)}
                            >
                                <span className="icon">⚡</span>
                                <h3>Zahájit implementaci</h3>
                                <p>Spustit nového průvodce identifikací aktiv a rizik.</p>
                            </div>

                            <div
                                className="action-card"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <span className="icon">📂</span>
                                <h3>Načíst audit</h3>
                                <p>Nahrát existující .json soubor a pokračovat v práci.</p>
                                <input
                                    type="file"
                                    accept=".json"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={importAuditFromJson}
                                />
                            </div>
                        </div>
                    </div>
                );
            case 1:
                return <IdentificationStep onComplete={(res) => handleNextStep('legalContext', res)} />;
            case 2:
                return <RiskAndAssetStep onComplete={(res) => handleNextStep('riskData', res)} />;
            case 3:
                return (
                    <SecurityMeasuresTable
                        smartLogic={moduleData.riskData?.smartLogic || {}}
                        roles={['CISO', 'Admin', 'Management']}
                        onComplete={(res) => handleNextStep('finalMeasures', res)}
                    />
                );
            case 4:
                return (
                    <div className="glass-panel fade-in" style={{ textAlign: 'center', padding: '4rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem', color: '#10b981' }}>✓</div>
                        <h2>Audit Dokončen</h2>
                        <p style={{ marginBottom: '2rem' }}>Všechna data byla zpracována.</p>
                        <button className="action-button primary large" onClick={exportAuditToJson}>
                            Stáhnout JSON Report
                        </button>
                        <div style={{ marginTop: '2rem' }}>
                            <button className="action-button" onClick={() => setCurrentStep(0)}>Zpět na hlavní menu</button>
                        </div>
                    </div>
                );
            default:
                return <div>Neznámý krok</div>;
        }
    };

    return (
        <div className="module-wrapper">
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <span className="brand-icon">🛡️</span> NIS2 AGENT
                </div>
                <nav className="stepper-nav">
                    <div className={`step-item ${currentStep === 0 ? 'active' : ''}`} onClick={() => setCurrentStep(0)}>
                        <div className="step-number">0</div> Start
                    </div>
                    <div className={`step-item ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                        <div className="step-number">1</div> Identifikace
                    </div>
                    <div className={`step-item ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
                        <div className="step-number">2</div> Aktiva & Rizika
                    </div>
                    <div className={`step-item ${currentStep === 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
                        <div className="step-number">3</div> Opatření
                    </div>
                    <div className={`step-item ${currentStep === 4 ? 'active' : ''}`}>
                        <div className="step-number">4</div> Report
                    </div>
                </nav>
            </aside>

            <main className="main-content">
                {renderContent()}
            </main>
        </div>
    );
}
