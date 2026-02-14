import React from 'react';
import './SummaryPage.css';
import { generatePDFReport } from '../utils/pdfExport'; 

// --- POVINNOSTI PRO NIŽŠÍ REŽIM (Zákon + Vyhláška 410/2025) ---
const OBLIGATIONS_LOWER = [
  "Registrace do portálu NÚKIB a nahlášení kontaktních údajů",
  "Hlášení kybernetických bezpečnostních incidentů (bezodkladně)",
  "Zavedení bezpečnostních opatření v rozsahu § 3 až § 14 vyhlášky č. 410/2025 Sb.",
  "Vedení evidence (přehledu) zavedených opatření a aktiv",
  "Plnění vydaných protiopatření (v případě varování NÚKIB)",
  "Informování zákazníků o incidentech (pokud se jich týkají)"
];

// --- POVINNOSTI PRO VYŠŠÍ REŽIM (Zákon + Vyhláška 409/2025) ---
const OBLIGATIONS_HIGHER = [
  "Registrace a aktualizace údajů v portálu NÚKIB",
  "Zavedení komplexního ISMS podle vyhlášky č. 409/2025 Sb.",
  "Přímá odpovědnost vrcholového vedení za schvalování opatření",
  "Povinnost provádět pravidelné audity kybernetické bezpečnosti",
  "Přísný režim hlášení incidentů (včasné varování do 24h, hlášení do 72h)",
  "Řízení rizik dodavatelského řetězce a smluvní zajištění bezpečnosti",
  "Povinnost podrobit se kontrole ze strany NÚKIB"
];

export default function SummaryPage({ 
  companySize,
  sector, 
  selectedServices, 
  specialCriteria,
  complianceLevel,
  complianceReasoning,
  securityStatus, 
  onBack, 
  onFinish,
  onRestart
}) {
  
  const handleExportPDF = async () => {
    // data pro export
    const data = {
      companySize,
      sector,
      selectedServices,
      specialCriteria,
      complianceLevel,
      complianceReasoning,
      securityStatus
    };
    
    // volání funkci z pdfExport.js
    try {
      await generatePDFReport(data);
    } catch (error) {
      console.error("Chyba při generování PDF:", error);
      alert("Nepodařilo se vygenerovat PDF report.");
    }
  };

  // Pokud firma nespadá pod NIS2
  if (complianceLevel === 'none') {
    return (
      <div className="fancy-gradient">
        <h2>Souhrn vyhodnocení</h2>
        <div className="summary-box summary-none">
          <h3>✓ Vaše firma nespadá pod směrnici NIS2</h3>
          <p>
            Na základě vyhodnocení velikosti podniku (<strong>{companySize}</strong>) 
            a poskytovaných služeb v sektoru <strong>{sector}</strong> vaše firma 
            <strong> nemá zákonné povinnosti</strong>.
          </p>
          <div className="reasoning-box">
            <h4>Zdůvodnění:</h4>
            <p>{complianceReasoning}</p>
          </div>
        </div>

        <div className="recommendation-box">
          <h3>💡 Doporučení</h3>
          <p>I když nespadáte pod regulaci, doporučujeme:</p>
          <ul>
            <li>Zavést základní bezpečnostní politiku.</li>
            <li>Pravidelně zálohovat data.</li>
            <li>Školit zaměstnance proti phishingu.</li>
          </ul>
        </div>

        <div className="form-actions">
          <button className="back-btn" onClick={onBack}>Zpět</button>
          <button className="restart-btn" onClick={onRestart}>Nové vyhodnocení</button>
          {/* I když nespadá, může si stáhnout potvrzení */}
          <button className="continue-btn" onClick={handleExportPDF}>
            📄 Stáhnout report
          </button>
        </div>
      </div>
    );
  }

  // --- LOGIKA PRO FIRMY SPADAJÍCÍ POD NIS2 ---

  const activeObligations = complianceLevel === 'higher' ? OBLIGATIONS_HIGHER : OBLIGATIONS_LOWER;
  
  // Získání klíčů splněných opatření
  const implementedKeys = securityStatus ? Object.keys(securityStatus) : [];
  const implementedCount = implementedKeys.length;
  
  // Celkový počet opatření (10 pro vyšší, 12 pro nižší)
  const totalMeasures = complianceLevel === 'higher' ? 10 : 12;
  const isScoreGood = implementedCount >= (totalMeasures * 0.6);

  return (
    <div className="fancy-gradient">
      <h2>Souhrn vyhodnocení NIS2</h2>
      
      <div className={`summary-box summary-${complianceLevel}`}>
        <h3>
          {complianceLevel === 'higher' && '🔴 Režim vyšších povinností'}
          {complianceLevel === 'lower' && '⚠ Režim nižších povinností'}
        </h3>
        <p>
          Spadáte pod regulaci jako <strong>{companySize}</strong> podnik v sektoru <strong>{sector}</strong>.
          Řídíte se zákonem o kybernetické bezpečnosti a vyhláškou 
          <strong> {complianceLevel === 'higher' ? 'č. 409/2025 Sb.' : 'č. 410/2025 Sb.'}</strong>.
        </p>
        
        <div className="reasoning-box">
          <h4>Důvod zařazení:</h4>
          <p>{complianceReasoning}</p>
        </div>
      </div>

      <div className="obligations-section">
        <h3>📋 Vaše hlavní zákonné povinnosti</h3>
        <ul className="obligations-list">
          {activeObligations.map((obligation, index) => (
            <li key={index}>{obligation}</li>
          ))}
        </ul>
      </div>

      {/* SEKCE GAP ANALÝZY */}
      <div className="gap-analysis-section">
        <h3>🛡️ Stav vašich opatření (Gap Analýza)</h3>
        
        <div className="gap-score-container">
          <span className={`gap-score ${isScoreGood ? 'good' : 'bad'}`}>
            Splněno {implementedCount} z {totalMeasures} oblastí
          </span>
        </div>

        {implementedCount > 0 ? (
          <div className="security-list-container">
            {implementedKeys.map((key) => (
              <div key={key} className="security-list-item">
                <span className="check-icon-green">✓</span>
                <div className="security-item-text">
                  <span className="main-label">{key}</span>
                  {' '}
                  <span className="article-label">({securityStatus[key].article})</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="warning-box">
            <p>Zatím jste neoznačili žádná implementovaná opatření.</p>
          </div>
        )}
        
        {!isScoreGood && (
          <div className="warning-box" style={{marginTop: '15px'}}>
            <h4>⚠️ Doporučení:</h4>
            <p>
              Chybí vám klíčová opatření. Pro splnění zákonné povinnosti musíte doplnit chybějící body 
              a vytvořit k nim dokumentaci.
            </p>
          </div>
        )}
      </div>

      <div className="next-steps-section">
        <h3>🎯 Další kroky</h3>
        <ol>
          <li>Zaregistrovat se do portálu NÚKIB.</li>
          <li>Jmenovat osoby odpovědné za kybernetickou bezpečnost.</li>
          <li>Dokončit dokumentaci pro chybějící body (viz výše).</li>
          <li>Proškolit zaměstnance.</li>
        </ol>
      </div>

      <div className="form-actions">
        <button className="back-btn" onClick={onBack}>
          Zpět
        </button>
        <button className="restart-btn" onClick={onRestart}>
          Nové vyhodnocení
        </button>
        <button className="continue-btn" onClick={handleExportPDF}>
          📄 Stáhnout PDF report
        </button>
      </div>
    </div>
  );
}