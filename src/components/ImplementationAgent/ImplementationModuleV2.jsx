import React, { useState } from 'react';
import ProfilerStep from './ProfilerStep';
import IncidentSignificanceStep from './IncidentSignificanceStep';
import IdentificationStep from './IdentificationStep';
import AssetRegistryStep from './AssetRegistryStep';
import LeadershipGovernanceStep from './LeadershipGovernanceStep';
import HumanResourcesStep from './HumanResourcesStep';
import ContinuityBackupStep from './ContinuityBackupStep';
import IncidentManagementStep from './IncidentManagementStep';
import ObligatedPersonStep from './ObligatedPersonStep';
import SecurityMeasuresTableV2 from './SecurityMeasuresTableV2';
import { PDFDownloadLink } from '@react-pdf/renderer';
import AuditReportDocument from './AuditReportDocument';
import './ImplementationModule.css';

export default function ImplementationModuleV2({ onExit }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [showExpiryWarning, setShowExpiryWarning] = useState(false);
    const [moduleData, setModuleData] = useState({
        profile: {},
        significance: {},
        roles: {},
        assets: [],
        governance: {},
        humanResources: {},
        continuity: {},
        incidentManagement: {},
        signature: {},
        measures: [],
        auditLog: [], // Nová featura pro V2
        revision: {},
        revisionHistory: []
    });

    const handleNext = (dataKey, data) => {
        setModuleData(prev => ({ ...prev, [dataKey]: data }));
    };

    const handleMeasuresComplete = (data) => {
        // data = { measures, revision, auditLog, profileData }
        const reportId = crypto.randomUUID();

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
                auditLog: data.auditLog,
                signature: { ...prev.signature, reportId },
                revisionHistory: newHistory
            };
        });
        setCurrentStep(10);
    };

    const handleDownload = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(moduleData));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `NIS2_Profiler_Audit_${new Date().toISOString().split('T')[0]}.json`);
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

                if (parsedData.revision && parsedData.revision.nextDate) {
                    const nextDate = new Date(parsedData.revision.nextDate);
                    const today = new Date();
                    if (today > nextDate) {
                        setShowExpiryWarning(true);
                    } else {
                        setShowExpiryWarning(false);
                    }
                }

                alert("Data Profileru (v2) úspěšně načtena!");
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
                        <p>Dle vyhlášky 410/2025 Sb. je nutné provést aktualizaci.</p>
                        <button className="action-button primary" onClick={() => setShowExpiryWarning(false)}>
                            Provést novou revizi
                        </button>
                    </div>
                </div>
            )}

            <aside className="sidebar">
                <div className="sidebar-brand" style={{ color: '#bf5af2' }}>⚖️ THE PROFILER</div>
                <nav className="stepper-nav">
                    <div className={`step-item ${currentStep === 0 ? 'active' : ''}`} onClick={() => setCurrentStep(0)}>0. Profilace (Výchozí)</div>
                    <div className={`step-item ${currentStep === 1 ? 'active' : ''}`} onClick={() => setCurrentStep(1)}>1. Významnost (§ 1)</div>
                    <div className={`step-item ${currentStep === 2 ? 'active' : ''}`} onClick={() => setCurrentStep(2)}>2. Pojmy (§ 2)</div>
                    <div className={`step-item ${currentStep === 3 ? 'active' : ''}`} onClick={() => setCurrentStep(3)}>3. Aktiva (§ 3)</div>
                    <div className={`step-item ${currentStep === 4 ? 'active' : ''}`} onClick={() => setCurrentStep(4)}>4. Vedení (§ 4)</div>
                    <div className={`step-item ${currentStep === 5 ? 'active' : ''}`} onClick={() => setCurrentStep(5)}>5. Lidé (§ 5)</div>
                    <div className={`step-item ${currentStep === 6 ? 'active' : ''}`} onClick={() => setCurrentStep(6)}>6. Obnova (§ 6)</div>
                    <div className={`step-item ${currentStep === 7 ? 'active' : ''}`} onClick={() => setCurrentStep(7)}>7. Incidenty (§ 10)</div>
                    <div className={`step-item ${currentStep === 8 ? 'active' : ''}`} onClick={() => setCurrentStep(8)}>8. Odpovědná osoba</div>
                    <div className={`step-item ${currentStep === 9 ? 'active' : ''}`} onClick={() => setCurrentStep(9)}>9. Opatření V2</div>
                    <div className={`step-item ${currentStep === 10 ? 'active' : ''}`} onClick={() => setCurrentStep(10)}>10. Hotovo</div>
                </nav>

                <div className="sidebar-actions">
                    <h4>SPRÁVA PROFILU</h4>
                    <div className="sidebar-btn-stack">
                        <button className="action-button secondary small" onClick={handleDownload} style={{ width: '100%' }}>
                            💾 Export Projektu & Logů
                        </button>
                        <label className="action-button secondary small file-input-label">
                            📂 Načíst Projekt
                            <input type="file" onChange={handleUpload} style={{ display: 'none' }} accept=".json" />
                        </label>
                    </div>
                </div>
            </aside>

            <main className="main-content">
                {currentStep === 0 && <ProfilerStep data={moduleData.profile} onComplete={(d) => { handleNext('profile', d); setCurrentStep(1); }} />}
                {currentStep === 1 && <IncidentSignificanceStep data={moduleData.significance} onComplete={(d) => { handleNext('significance', d); setCurrentStep(2); }} />}
                {currentStep === 2 && <IdentificationStep data={moduleData.roles} onComplete={(d) => { handleNext('roles', d); setCurrentStep(3); }} />}
                {currentStep === 3 && <AssetRegistryStep data={moduleData.assets} onComplete={(d) => { handleNext('assets', d); setCurrentStep(4); }} />}
                {currentStep === 4 && <LeadershipGovernanceStep data={moduleData.governance} assets={moduleData.assets} onComplete={(d) => { handleNext('governance', d); setCurrentStep(5); }} />}
                {currentStep === 5 && <HumanResourcesStep data={moduleData.humanResources} onComplete={(d) => { handleNext('humanResources', d); setCurrentStep(6); }} />}
                {currentStep === 6 && <ContinuityBackupStep data={moduleData.continuity} governanceData={moduleData.governance} onComplete={(d) => { handleNext('continuity', d); setCurrentStep(7); }} />}
                {currentStep === 7 && <IncidentManagementStep data={moduleData.incidentManagement} significanceData={moduleData.significance} onComplete={(d) => { handleNext('incidentManagement', d); setCurrentStep(8); }} />}
                {currentStep === 8 && <ObligatedPersonStep data={moduleData.signature} onComplete={(d) => { handleNext('signature', d); setCurrentStep(9); }} />}
                {currentStep === 9 && (
                    <SecurityMeasuresTableV2
                        assetData={moduleData.assets}
                        signatureData={moduleData.signature}
                        profileData={moduleData.profile}
                        revisionHistory={moduleData.revisionHistory}
                        onComplete={handleMeasuresComplete}
                    />
                )}
                {currentStep === 10 && (
                    <div className="glass-panel">
                        <h2>✓ V2 Audit s doložitelnou přiměřeností připraven</h2>
                        <p>Do JSON balíčku byl úspěšně zakomponován <strong>Audit Log (Důkazní evidence The Profiler)</strong>.</p>

                        <div style={{ margin: '30px 0', textAlign: 'center' }}>
                            <PDFDownloadLink
                                document={<AuditReportDocument data={moduleData} isV2={true} />}
                                fileName={`NIS2_Profiler_Audit_${moduleData.revision?.date}.pdf`}
                                className="action-button primary"
                                style={{ textDecoration: 'none', color: 'white', display: 'inline-block', padding: '15px 30px' }}
                            >
                                {({ blob, url, loading, error }) =>
                                    loading ? 'Generuji PDF...' : '📄 Stáhnout V2 PDF Report'
                                }
                            </PDFDownloadLink>
                            <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '10px' }}>
                                ID Reportu: {moduleData.signature?.reportId}
                            </p>
                        </div>

                        <div style={{ marginTop: '30px', textAlign: 'center' }}>
                            <button className="action-button primary" onClick={onExit} style={{ width: '100%' }}>Ukončit a vrátit se na Dashboard</button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
