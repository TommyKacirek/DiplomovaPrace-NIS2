import React, { useState } from 'react';
import FirmaInfoForm from './components/FirmaInfoForm';
import SectorSelection from './components/SectorSelection';
import ServicesSelection from './components/ServicesSelection';
import ComplianceDecision from './components/ComplianceDecision';
import SecurityAssessment from './components/SecurityAssessment';
import SummaryPage from './components/SummaryPage';
import ImplementationModule from './components/ImplementationAgent/ImplementationModule';
import MainLanding from './components/MainLanding';
import { determineComplianceLevel } from './utils/complianceLogic';
import './App.css';

function App() {
  const [appMode, setAppMode] = useState('landing'); // 'landing' | 'calculator' | 'implementation'
  const [companySize, setCompanySize] = useState(null);
  const [sector, setSector] = useState('');
  const [servicesData, setServicesData] = useState(null);
  const [complianceResult, setComplianceResult] = useState(null);
  const [securityStatus, setSecurityStatus] = useState({});
  const [step, setStep] = useState(1);
  const [agentData, setAgentData] = useState({});

  const PROGRESS = {
    1: 0, 2: 20, 3: 40, 4: 60, 5: 80, 6: 100
  };

  // --- Handlers (Calculator) ---
  const handleSizeSubmit = (size) => setCompanySize(size);
  const handleContinueFromSize = () => setStep(2);
  const handleSectorSelect = (selectedSector) => { setSector(selectedSector); setStep(3); };
  const handleBackToSize = () => setStep(1);
  const handleBackToSector = () => setStep(2);

  const handleNextFromServices = (data) => {
    setServicesData(data);
    const result = determineComplianceLevel({
      companySize,
      sector,
      services: data.services,
      specialCriteria: data.specialCriteria
    });
    setComplianceResult(result);
    setStep(4);
  };

  const handleBackToServices = () => setStep(3);
  const handleNextFromCompliance = () => {
    if (complianceResult.level === 'none') setStep(6);
    else setStep(5);
  };
  const handleBackFromSecurity = () => setStep(4);
  const handleSecurityComplete = (data) => {
    setSecurityStatus(data.securityStatus || {});
    setStep(6);
  };
  const handleBackFromSummary = () => {
    if (complianceResult.level === 'none') setStep(4);
    else setStep(5);
  };
  const handleFinish = () => alert('Děkujeme za použití kalkulačky NIS2!');
  const handleRestart = () => {
    setCompanySize(null); setSector(''); setServicesData(null); setComplianceResult(null); setSecurityStatus({}); setStep(1);
  };

  // --- Handlers (Agent) ---
  const handleAgentComplete = (result) => {
    setAgentData(prev => ({ ...prev, ...result.data }));
    alert("Data uložena.");
  };

  // --- Render Helpers ---
  const showGlobalHeader = appMode === 'calculator'; // Only show generic header in calculator mode
  const showLanding = appMode === 'landing';
  const showImplementation = appMode === 'implementation';

  return (
    <div className={`app-container ${showImplementation ? 'full-width' : ''}`}>

      {/* Global Header (Only for Calculator Mode) */}
      {showGlobalHeader && (
        <header className="app-header fade-in">
          <div className="header-top-row">
            <button onClick={() => setAppMode('landing')} className="btn-icon-back">
              ← Domů
            </button>
            <div className="mode-switch">
              <button
                className={`mode-btn ${appMode === 'calculator' ? 'active' : ''}`}
                onClick={() => setAppMode('calculator')}
              >
                Kalkulačka
              </button>
              <button
                className={`mode-btn ${appMode === 'implementation' ? 'active' : ''}`}
                onClick={() => setAppMode('implementation')}
              >
                Implementace
              </button>
            </div>
          </div>
          <h1>NIS2 Kalkulačka</h1>
          <h3 className="subtitle">Zjistěte vaše povinnosti podle směrnice</h3>
        </header>
      )}

      {/* LANDING */}
      {showLanding && <MainLanding onSelectMode={setAppMode} />}

      {/* CALCULATOR */}
      {appMode === 'calculator' && (
        <div className="calculator-wrapper fade-in">
          <div className="progress-bar-container">
            <div className="progress-bar-animated">
              <div
                className="progress-bar-fill"
                style={{ width: PROGRESS[step] + '%' }}
              />
            </div>
            <div className="progress-bar-label">{PROGRESS[step]}%</div>
          </div>

          {step === 1 && <FirmaInfoForm onSubmit={handleSizeSubmit} onContinue={handleContinueFromSize} companySize={companySize} />}
          {step === 2 && <SectorSelection onSectorSelect={handleSectorSelect} onBack={handleBackToSize} />}
          {step === 3 && <ServicesSelection sector={sector} companySize={companySize} onBack={handleBackToSector} onNext={handleNextFromServices} />}
          {step === 4 && complianceResult && <ComplianceDecision companySize={companySize} sector={sector} services={servicesData?.services || []} specialCriteria={servicesData?.specialCriteria || {}} complianceResult={complianceResult} onBack={handleBackToServices} onNext={handleNextFromCompliance} />}
          {step === 5 && complianceResult.level !== 'none' && <SecurityAssessment companySize={companySize} sector={sector} services={servicesData?.services || []} complianceLevel={complianceResult.level} onBack={handleBackFromSecurity} onNext={handleSecurityComplete} />}
          {step === 6 && <SummaryPage companySize={companySize} sector={sector} selectedServices={servicesData?.services || []} specialCriteria={servicesData?.specialCriteria || {}} complianceLevel={complianceResult?.level} complianceReasoning={complianceResult?.reasoning} securityStatus={securityStatus} onBack={handleBackFromSummary} onFinish={handleFinish} onRestart={handleRestart} />}
        </div>
      )}

      {/* IMPLEMENTATION (Full Screen) */}
      {showImplementation && (
        <div className="agent-fullscreen-wrapper fade-in">
          {/* Note: Pass a prop to allow returning to landing if needed, though sidebar handles navigation primarily */}
          <ImplementationModule onExit={() => setAppMode('landing')} />
        </div>
      )}

    </div>
  );
}

export default App;
