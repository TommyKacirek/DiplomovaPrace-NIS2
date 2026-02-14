import React, { useState } from 'react';

/**
 * IdentificationStep
 * 
 * Redesigned Step 1: Identification & Scope
 * Features: High contrast, Clickable Cards, Sleek Forms
 */
export default function IdentificationStep({ onComplete }) {
  const [statusConfirmed, setStatusConfirmed] = useState(false);
  const [serviceDefinition, setServiceDefinition] = useState('');
  const [managementDeclared, setManagementDeclared] = useState(false);

  const isValid =
    statusConfirmed &&
    serviceDefinition.trim().length > 0 &&
    managementDeclared;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid && onComplete) {
      onComplete({
        step: 1,
        data: {
          statusConfirmed,
          serviceDefinition,
          managementDeclared,
          timestamp: new Date().toISOString()
        }
      });
    }
  };

  return (
    <div className="step-container fade-in">
      <div className="step-header">
        <span className="step-badge">Krok 1</span>
        <h2>Identifikace a rozsah</h2>
        <p className="step-legal-ref">§ 1 vyhlášky 410/2025 Sb.</p>
      </div>

      <form className="premium-form" onSubmit={handleSubmit}>

        {/* 1. Status Confirmation - Clickable Card */}
        <div
          className={`card-checkbox ${statusConfirmed ? 'checked' : ''}`}
          onClick={() => setStatusConfirmed(!statusConfirmed)}
        >
          <div className="card-indicator">
            {statusConfirmed ? '✓' : ''}
          </div>
          <div className="card-content">
            <h3>Potvrzení statusu</h3>
            <p>
              Prohlašuji, že naše organizace je <strong>„povinnou osobou“</strong>
              ve smyslu zákona o kybernetické bezpečnosti.
            </p>
          </div>
        </div>

        {/* 2. Regulated Service - Clean Input */}
        <div className="form-group-sleek">
          <label htmlFor="regulated-service">
            Definice regulované služby
          </label>
          <input
            id="regulated-service"
            type="text"
            value={serviceDefinition}
            onChange={(e) => setServiceDefinition(e.target.value)}
            placeholder="Např. Výroba elektřiny, Poskytování cloudových služeb..."
            className="input-sleek"
          />
          <p className="input-hint">
            Uveďte konkrétní službu, která spadá pod regulaci.
          </p>
        </div>

        {/* 3. Management Declaration - Clickable Card */}
        <div
          className={`card-checkbox ${managementDeclared ? 'checked' : ''}`}
          onClick={() => setManagementDeclared(!managementDeclared)}
        >
          <div className="card-indicator">
            {managementDeclared ? '✓' : ''}
          </div>
          <div className="card-content">
            <h3>Deklarace managementu</h3>
            <p>
              Beru na vědomí, že <strong>vyhláška č. 410/2025 Sb.</strong> upravuje obsah
              bezpečnostních opatření a kritéria pro dopady incidentů.
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="form-actions-bar">
          <div className="validation-status">
            {isValid ? (
              <span className="status-valid">✓ Vše připraveno</span>
            ) : (
              <span className="status-invalid">Vyplňte všechna pole</span>
            )}
          </div>
          <button
            type="submit"
            className="action-button primary"
            disabled={!isValid}
          >
            Potvrdit a pokračovat
          </button>
        </div>

      </form>
    </div>
  );
}
