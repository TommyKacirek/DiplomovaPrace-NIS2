import React, { useState } from 'react';
import IdentificationStep from './IdentificationStep';
import AssetRegistryStep from './AssetRegistryStep';
import AssetRulesStep from './AssetRulesStep';
import ObligatedPersonStep from './ObligatedPersonStep';
import SecurityMeasuresTable from './SecurityMeasuresTable';
import { PDFDownloadLink } from '@react-pdf/renderer';
import AuditReportDocument from './AuditReportDocument';
import './ImplementationModule.css';

export default function ImplementationModule({ onExit }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [showExpiryWarning, setShowExpiryWarning] = useState(false);
    const [moduleData, setModuleData] = useState({
        roles: {},
        assets: [],
        assetRules: {}, // § 4 Rules
        signature: {},
        measures: [],
        revision: {},
        revisionHistory: []
    });

    const handleNext = (dataKey, data) => {
        setModuleData(prev => ({ ...prev, [dataKey]: data }));
        setCurrentStep(prev => prev + 1);
    };

    const handleMeasuresComplete = (data) => {
        // data = { measures, revision }
        // Generate Report ID
        const reportId = crypto.randomUUID();

        // Append to history on finalize
        setModuleData(prev => {
            const newHistory = [
                ...(prev.revisionHistory || []),
                {
                    date: data.revision.date,
                    validUntil: data.revision.nextDate,
                    manager: data.revision.manager,
                    version: data.revision.version,
                    reportId: reportId,
                    timestamp: new Date().toISOString()
                }
            ];

            return {
                ...prev,
                measures: data.measures,
                revision: data.revision,
                signature: { ...prev.signature, reportId },
                revisionHistory: newHistory
            };
        });
        setCurrentStep(6);
    };

    const handleDownload = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(moduleData));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `NIS2_Audit_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleUpload = (event) => {
        const fileReader = new FileReader();
        fileReader.readAsText(event.target.files[0], "UTF-8");
        fileReader.onload = (e) => {
            try {
                const parsedData = JSON.parse(e.target.result);
                setModuleData(parsedData);

                // Expiry Check
                if (parsedData.revision && parsedData.revision.nextDate) {
                    const nextDate = new Date(parsedData.revision.nextDate);
                    const today = new Date();
                    if (today > nextDate) {
                        setShowExpiryWarning(true);
                    } else {
                        setShowExpiryWarning(false);
                    }
                }

                alert("Data úspěšně načtena!");
            } catch (err) {
                alert("Chyba při načítání souboru.");
            }
        };
    };

    return (
        <div className="module-wrapper">
            {showExpiryWarning && (
                <div className="expiry-overlay">
                    <div className="expiry-modal">
                        <h1>⚠️ PLATNOST AUDITU VYPRŠELA!</h1>
                        <p>Dle vyhlášky 410/2025 Sb. je nutné provést aktualizaci bezpečnostních opatření.</p>
                        <p>Platnost předchozího auditu vypršela: <strong>{moduleData.revision?.nextDate}</strong></p>
                        <button className="action-button primary" onClick={() => setShowExpiryWarning(false)}>
                            Provést novou revizi
                        </button>
                    </div>
                </div>
            )}

            <aside className="sidebar">
                <div className="sidebar-brand">🛡️ NIS2 AGENT</div>
                <nav className="stepper-nav">
                    <div className={`step-item ${currentStep === 1 ? 'active' : ''}`} onClick={() => setCurrentStep(1)}>1. Pojmy (§ 2)</div>
                    <div className={`step-item ${currentStep === 2 ? 'active' : ''}`} onClick={() => setCurrentStep(2)}>2. Aktiva (§ 3)</div>
                    <div className={`step-item ${currentStep === 3 ? 'active' : ''}`} onClick={() => setCurrentStep(3)}>3. Pravidla (§ 4)</div>
                    <div className={`step-item ${currentStep === 4 ? 'active' : ''}`} onClick={() => setCurrentStep(4)}>4. Odpovědná osoba</div>
                    <div className={`step-item ${currentStep === 5 ? 'active' : ''}`} onClick={() => setCurrentStep(5)}>5. Tabulka opatření</div>
                    <div className={`step-item ${currentStep === 6 ? 'active' : ''}`} onClick={() => setCurrentStep(6)}>6. Hotovo</div>
                </nav>

                <div className="sidebar-actions">
                    <h4>SPRÁVA DAT (4 roky)</h4>
                    <div className="sidebar-btn-stack">
                        <button className="action-button secondary small" onClick={handleDownload} style={{ width: '100%' }}>
                            💾 Uložit Projekt
                        </button>
                        <label className="action-button secondary small file-input-label">
                            📂 Načíst Projekt
                            <input type="file" onChange={handleUpload} style={{ display: 'none' }} accept=".json" />
                        </label>
                    </div>
                </div>
            </aside>

            <main className="main-content">
                {currentStep === 1 && <IdentificationStep onComplete={(d) => handleNext('roles', d)} />}
                {currentStep === 2 && <AssetRegistryStep onComplete={(d) => handleNext('assets', d)} />}
                {currentStep === 3 && <AssetRulesStep assets={moduleData.assets} onComplete={(d) => handleNext('assetRules', d)} />}
                {currentStep === 4 && <ObligatedPersonStep onComplete={(d) => handleNext('signature', d)} />}
                {currentStep === 5 && (
                    <SecurityMeasuresTable
                        assetData={moduleData.assets}
                        signatureData={moduleData.signature}
                        revisionHistory={moduleData.revisionHistory}
                        onComplete={handleMeasuresComplete}
                    />
                )}
                {currentStep === 6 && (
                    <div className="glass-panel">
                        <h2>✓ Audit připraven k podpisu</h2>
                        <p>Pro splnění zákonné povinnosti (§ 3 a § 4) musí být auditní zpráva prokazatelně schválena statutárním orgánem.</p>

                        <div style={{ margin: '30px 0', textAlign: 'center' }}>
                            <PDFDownloadLink
                                document={<AuditReportDocument data={moduleData} />}
                                fileName={`NIS2_Audit_Report_${moduleData.revision?.date}.pdf`}
                                className="action-button primary"
                                style={{ textDecoration: 'none', color: 'white', display: 'inline-block', padding: '15px 30px' }}
                            >
                                {({ blob, url, loading, error }) =>
                                    loading ? 'Generuji PDF...' : '📄 Stáhnout PDF Report k podpisu'
                                }
                            </PDFDownloadLink>
                            <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '10px' }}>
                                ID Reportu: {moduleData.signature?.reportId}
                            </p>
                        </div>

                        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '12px', border: '1px solid #333' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '10px', color: '#ff9f0a' }}>Krok 2: Potvrzení a Archivace</h3>
                            <label style={{ display: 'flex', alignItems: 'start', cursor: 'pointer', gap: '15px' }}>
                                <input
                                    type="checkbox"
                                    style={{ transform: 'scale(1.5)', marginTop: '3px' }}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setModuleData(prev => ({
                                                ...prev,
                                                signature: { ...prev.signature, signedDate: new Date().toISOString() }
                                            }));
                                        } else {
                                            setModuleData(prev => ({
                                                ...prev,
                                                signature: { ...prev.signature, signedDate: null }
                                            }));
                                        }
                                    }}
                                />
                                <span style={{ lineHeight: '1.4', fontSize: '0.9rem', color: '#ccc' }}>
                                    Potvrzuji, že jsem vygenerovaný PDF report vytiskl(a) (nebo elektronicky podepsal(a)),
                                    nechal(a) podepsat odpovědnou osobou a tento dokument jsem <strong>založil(a) do bezpečnostní dokumentace</strong> organizace.
                                </span>
                            </label>
                        </div>

                        {moduleData.signature?.signedDate && (
                            <div style={{ marginTop: '30px', animation: 'fadeIn 0.5s', textAlign: 'center' }}>
                                <div style={{ color: '#32d74b', marginBottom: '15px', fontWeight: 'bold' }}>
                                    ✓ Audit byl úspěšně uzavřen dne {new Date(moduleData.signature.signedDate).toLocaleDateString()}
                                </div>
                                <div style={{ background: 'rgba(255, 159, 10, 0.15)', border: '1px solid #ff9f0a', padding: '15px', borderRadius: '8px', marginBottom: '20px', textAlign: 'left', fontSize: '0.9rem' }}>
                                    <strong>⚠️ Nezapomeňte:</strong><br />
                                    Stáhněte si také zdrojová data (JSON) tlačítkem v levém menu "Uložit Projekt".
                                    Slouží pro budoucí aktualizace auditu, aniž byste museli vše vyplňovat znovu.
                                </div>
                                <button className="action-button primary" onClick={onExit} style={{ width: '100%' }}>Ukončit a vrátit se na úvod</button>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
