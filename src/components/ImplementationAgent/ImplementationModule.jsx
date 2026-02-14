import React, { useState, useRef } from 'react';
import IdentificationStep from './IdentificationStep';
import RiskAndAssetStep from './RiskAndAssetStep';
import SecurityMeasuresTable from './SecurityMeasuresTable';
import './ImplementationModule.css';

// SVG Icons for Sidebar & Landing
const Icons = {
    Home: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
    Identity: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
    Shield: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>,
    List: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>,
    File: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
    Exit: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
    // New Icons for Landing (Bigger size handled by CSS wrapper, but same viewBox)
    Bolt: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>,
    FolderOpen: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
};

export default function ImplementationModule(props) {
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
                                <span className="icon"><Icons.Bolt /></span>
                                <h3>Zahájit implementaci</h3>
                                <p>Spustit nového průvodce identifikací aktiv a rizik.</p>
                            </div>

                            <div
                                className="action-card"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <span className="icon"><Icons.FolderOpen /></span>
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
                        <div className="step-icon-wrap"><Icons.Home /></div> Start
                    </div>
                    <div className={`step-item ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                        <div className="step-icon-wrap"><Icons.Identity /></div> Identifikace
                    </div>
                    <div className={`step-item ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
                        <div className="step-icon-wrap"><Icons.Shield /></div> Aktiva & Rizika
                    </div>
                    <div className={`step-item ${currentStep === 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
                        <div className="step-icon-wrap"><Icons.List /></div> Opatření
                    </div>
                    <div className={`step-item ${currentStep === 4 ? 'active' : ''}`}>
                        <div className="step-icon-wrap"><Icons.File /></div> Report
                    </div>
                </nav>
                <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--im-border)' }}>
                    <div
                        className="step-item"
                        onClick={props.onExit}
                        style={{ marginBottom: '1rem', color: '#ff453a' }}
                    >
                        <div className="step-icon-wrap" style={{ background: 'rgba(255, 69, 58, 0.1)', color: '#ff453a' }}>
                            <Icons.Exit />
                        </div>
                        Ukončit
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(235, 235, 245, 0.3)' }}>
                        Verze 2.2 (Final) <br />
                        Vyhláška 410/2025 Sb.
                    </div>
                </div>
            </aside>

            <main className="main-content">
                {renderContent()}
            </main>
        </div>
    );
}
