import CryptoJS from 'crypto-js';
import { generatePDFReport } from '../../utils/pdfExport';

import React, { useState, useRef } from 'react';
import IdentificationStep from './IdentificationStep';
import ObligatedPersonStep from './ObligatedPersonStep';
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

    const exportEncryptedJson = () => {
        const password = prompt("Zadejte heslo pro zašifrování zálohy:\n(Toto heslo bude nutné pro budoucí obnovení)");
        if (!password) return; // User cancelled

        try {
            const jsonStr = JSON.stringify(moduleData);
            // Encrypt using AES
            const encrypted = CryptoJS.AES.encrypt(jsonStr, password).toString();

            // Add custom header to identify file type
            const fileContent = "NIS2-AES-ENCRYPTED-V1:" + encrypted;

            const blob = new Blob([fileContent], { type: "application/nis2-encrypted" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `nis2_backup_secure_${new Date().toISOString().slice(0, 10)}.nis2`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error(err);
            alert("Chyba při šifrování zálohy.");
        }
    };

    const importAuditFromJson = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                let parsedData;

                // 1. Try Legacy JSON
                if (content.trim().startsWith("{")) {
                    parsedData = JSON.parse(content);
                }
                // 2. Try AES Encrypted
                else if (content.startsWith("NIS2-AES-ENCRYPTED-V1:")) {
                    const password = prompt("Zadejte heslo pro dešifrování zálohy:");
                    if (!password) return;

                    const encryptedData = content.replace("NIS2-AES-ENCRYPTED-V1:", "");
                    const bytes = CryptoJS.AES.decrypt(encryptedData, password);
                    const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);

                    if (!decryptedStr) throw new Error("Wrong password");

                    parsedData = JSON.parse(decryptedStr);
                }
                // 3. Try Old Obfuscated (Backward Compatibility)
                else {
                    try {
                        const decoded = atob(content);
                        const salt = "NIS2-SECURE-BACKUP-V1-";
                        if (decoded.startsWith(salt)) {
                            const jsonStr = decodeURIComponent(decoded.slice(salt.length));
                            parsedData = JSON.parse(jsonStr);
                        } else {
                            throw new Error("Invalid format");
                        }
                    } catch (err) {
                        alert('Chyba: Neplatné heslo nebo poškozený soubor.');
                        return;
                    }
                }

                if (parsedData && (parsedData.legalContext || parsedData.riskData)) {
                    setModuleData(parsedData);
                    setCurrentStep(1);
                } else {
                    alert('Chyba: Neznámý formát dat.');
                }

            } catch (err) {
                console.error(err);
                alert('Chyba: Nepodařilo se načíst zálohu (špatné heslo?).');
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
                return <ObligatedPersonStep onComplete={(res) => handleNextStep('riskData', res)} />;
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
                        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Implementace Dokončena</h2>
                        <p style={{ marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto', color: 'rgba(235,235,245,0.6)' }}>
                            Všechna data byla úspěšně zpracována. Nyní můžete vygenerovat oficiální report pro kontrolní orgány nebo si stáhnout zabezpečenou zálohu pro budoucí úpravy.
                        </p>

                        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <div style={{ textAlign: 'left', maxWidth: '300px' }}>
                                <button className="action-button primary large" style={{ width: '100%', marginBottom: '1rem' }} onClick={() => generatePDFReport(moduleData)}>
                                    📄 Vygenerovat PDF Audit
                                </button>
                                <p style={{ fontSize: '0.85rem', color: 'rgba(235,235,245,0.4)', lineHeight: 1.4 }}>
                                    Oficiální dokument obsahující identifikaci aktiv, analýzu rizik a navržená opatření. Vhodné pro tisk a audit.
                                </p>
                            </div>

                            <div style={{ textAlign: 'left', maxWidth: '300px' }}>
                                <button className="action-button large" style={{ width: '100%', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.1)' }} onClick={exportEncryptedJson}>
                                    🔒 Stáhnout Šifrovanou Zálohu
                                </button>
                                <p style={{ fontSize: '0.85rem', color: 'rgba(235,235,245,0.4)', lineHeight: 1.4 }}>
                                    Technický soubor (.nis2) pro budoucí obnovení práce v tomto portálu. Data jsou chráněna proti přímému čtení.
                                </p>
                            </div>
                        </div>

                        <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
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
                {(() => {
                    const timestamp = moduleData.finalMeasures?.timestamp || moduleData.timestamp;
                    if (timestamp) {
                        const auditDate = new Date(timestamp);
                        const today = new Date();
                        const diffInDays = (today - auditDate) / (1000 * 60 * 60 * 24);
                        if (diffInDays > 365) {
                            return (
                                <div style={{
                                    background: '#1c1c1e',
                                    border: '1px solid #bf5af2',
                                    borderRadius: '12px',
                                    padding: '12px',
                                    margin: '0 1rem 1.5rem 1rem',
                                    fontSize: '0.8rem',
                                    color: '#bf5af2',
                                    lineHeight: '1.4',
                                    fontWeight: '500',
                                    boxShadow: '0 0 10px rgba(191, 90, 242, 0.1)'
                                }}>
                                    ⚠️ Dokumentace expirovala. Proveďte povinnou roční aktualizaci dle § 3 písm. b.
                                </div>
                            );
                        }
                    }
                    return null;
                })()}
                <nav className="stepper-nav">
                    <div className={`step-item ${currentStep === 0 ? 'active' : ''}`} onClick={() => setCurrentStep(0)}>
                        <div className="step-icon-wrap"><Icons.Home /></div> Start
                    </div>
                    <div className={`step-item ${currentStep === 1 ? 'active' : ''}`} onClick={() => setCurrentStep(1)}>
                        <div className="step-icon-wrap"><Icons.Identity /></div> Identifikace
                    </div>
                    <div className={`step-item ${currentStep === 2 ? 'active' : ''}`} onClick={() => setCurrentStep(2)}>
                        <div className="step-icon-wrap"><Icons.Shield /></div> Osoba & Podpis
                    </div>
                    <div className={`step-item ${currentStep === 3 ? 'active' : ''}`} onClick={() => setCurrentStep(3)}>
                        <div className="step-icon-wrap"><Icons.List /></div> Opatření
                    </div>
                    <div className={`step-item ${currentStep === 4 ? 'active' : ''}`} onClick={() => setCurrentStep(4)}>
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
