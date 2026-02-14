import React from 'react';
import './ComplianceDecision.css';

export default function ComplianceDecision({ 
  companySize, 
  sector, 
  services, 
  specialCriteria,
  complianceResult,
  onBack, 
  onNext 
}) {
  
  const renderDecision = () => {
    if (complianceResult.level === 'none') {
      return (
        <div className="decision-box decision-none">
          <h2>✓ Vaše firma nespadá pod NIS2</h2>
          <p>
            Jako <strong>{companySize}</strong> podnik v sektoru <strong>{sector}</strong> nespadáte 
            pod povinnosti směrnice NIS2.
          </p>
          <p className="reasoning">
            {complianceResult.reasoning}
          </p>
        </div>
      );
    }

    if (complianceResult.level === 'lower') {
      return (
        <div className="decision-box decision-lower">
          <h2>⚠ Režim nižších povinností NIS2</h2>
          <p>
            Jako <strong>{companySize}</strong> podnik poskytující službu v sektoru <strong>{sector}</strong> 
            jste poskytovatelem regulované služby v <strong>režimu nižších povinností</strong>.
          </p>
          <p className="reasoning">
            {complianceResult.reasoning}
          </p>
          <div className="info-box">
            <h3>Co to znamená?</h3>
            <ul>
              <li>Povinnost dodržovat opatření kybernetické bezpečnosti</li>
              <li>Ohlašování kybernetických bezpečnostních incidentů</li>
              <li>Registrace do systému kybernetické bezpečnosti</li>
              <li>Nižší sankce než v režimu vyšších povinností</li>
            </ul>
          </div>
        </div>
      );
    }

    if (complianceResult.level === 'higher') {
      return (
        <div className="decision-box decision-higher">
          <h2>🔴 Režim vyšších povinností NIS2</h2>
          <p>
            Jako <strong>{companySize}</strong> podnik poskytující službu v sektoru <strong>{sector}</strong> 
            jste poskytovatelem regulované služby v <strong>režimu vyšších povinností</strong>.
          </p>
          <p className="reasoning">
            {complianceResult.reasoning}
          </p>
          <div className="info-box">
            <h3>Co to znamená?</h3>
            <ul>
              <li>Přísnější opatření kybernetické bezpečnosti</li>
              <li>Podrobné ohlašování kybernetických incidentů</li>
              <li>Odpovědnost vedení společnosti</li>
              <li>Vyšší sankce za porušení povinností</li>
              <li>Pravidelné audity a kontroly</li>
            </ul>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fancy-gradient">
      <h2>Vyhodnocení compliance</h2>
      
      {renderDecision()}

      <div className="selected-info">
        <h3>Vybrané služby:</h3>
        <ul>
          {services.map(serviceId => (
            <li key={serviceId}>
              Služba {serviceId}
              {specialCriteria[serviceId] !== undefined && (
                <span className="criteria-badge">
                  {specialCriteria[serviceId] ? ' (Ano)' : ' (Ne)'}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="form-actions">
        <button className="back-btn" onClick={onBack}>
          Zpět
        </button>
        <button className="continue-btn" onClick={onNext}>
          {complianceResult.level === 'none' ? 'Zobrazit souhrn' : 'Pokračovat na hodnocení'}
        </button>
      </div>
    </div>
  );
}
