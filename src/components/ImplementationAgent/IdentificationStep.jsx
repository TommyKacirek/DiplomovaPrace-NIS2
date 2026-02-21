import React, { useState } from 'react';
import './IdentificationStep.css';

/**
 * IdentificationStep
 * 
 * Step 1: § 2 Vymezení pojmů (Decree 410/2025 Sb.)
 * 
 * Formal confirmation of definitions and CIA triad.
 * Users must assign roles and sign off on understanding security principles.
 */
export default function IdentificationStep({ onComplete, data }) {
  // State for § 2 Definitions (a, b, c, d)
  const [definitions, setDefinitions] = useState(data?.definitions || {
    user: {
      id: 'a',
      label: 'Uživatel',
      text: 'Fyzická nebo právnická osoba anebo orgán veřejné moci, který využívá aktiva.',
      assignee: '',
      confirmed: false,
      placeholder: 'Kdo tuto roli typicky zastává? (např. všichni zaměstnanci)'
    },
    privilegedUser: {
      id: 'b',
      label: 'Privilegovaný uživatel',
      text: 'Uživatel nebo jiná osoba, jejíž činnost na technickém aktivu může mít významný dopad na bezpečnost regulované služby.',
      assignee: '',
      confirmed: false,
      placeholder: 'Kdo má rozšířená práva? (např. vedoucí oddělení, garanti)'
    },
    administrator: {
      id: 'c',
      label: 'Administrátor',
      text: 'Privilegovaný uživatel nebo osoba zajišťující správu, provoz, užívání, údržbu a bezpečnost technického aktiva.',
      assignee: '',
      confirmed: false,
      placeholder: 'Kdo spravuje systémy? (např. IT oddělení, externí support)'
    },
    securityPolicy: {
      id: 'd',
      label: 'Bezpečnostní politika',
      text: 'Soubor zásad a pravidel, která určují způsob zajištění ochrany aktiv.',
      assignee: '',
      confirmed: false,
      placeholder: 'Kdo je garantem politiky? (např. CISO, jednatel)'
    }
  });

  // State for CIA Triad Confirmation
  const [ciaSignature, setCiaSignature] = useState(data?.ciaTriad?.signature || '');

  // --- Handlers ---
  const handleDefChange = (key, field, value) => {
    setDefinitions(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value }
    }));
  };

  const isStepValid = () => {
    // 1. All definitions must be confirmed and have an assignee
    const allDefsValid = Object.values(definitions).every(d => d.confirmed && d.assignee.trim().length > 0);

    // 2. CIA Signature must be present
    const ciaValid = ciaSignature.trim().length > 0;

    return allDefsValid && ciaValid;
  };

  const handleSubmit = () => {
    if (onComplete) {
      onComplete({
        step: 1,
        data: {
          definitions,
          ciaTriad: {
            signature: ciaSignature,
            confirmed: true,
            timestamp: new Date().toISOString()
          },
          timestamp: new Date().toISOString()
        }
      });
    }
  };

  return (
    <div className="step-container fade-in">
      <div className="step-header">
        <span className="step-badge">Krok 1</span>
        <h2>§ 2 Vymezení pojmů</h2>
        <p className="step-legal-ref">vyhláška 410/2025 Sb.</p>
        <p className="step-description">
          Pro správnou implementaci je nutné pochopit a určit základní role a pojmy.
        </p>
      </div>

      {/* --- Definitions Section --- */}
      <div className="definitions-grid">
        {Object.entries(definitions).map(([key, def]) => (
          <div key={key} className={`definition-card ${def.confirmed ? 'confirmed' : ''}`}>
            <div className="def-header">
              <span className="def-letter">{def.id})</span>
              <h3>{def.label}</h3>
            </div>
            <p className="def-text">{def.text}</p>

            <div className="def-inputs">
              <div className="input-group">
                <label>Přiřazení role / Odpovědnost</label>
                <input
                  type="text"
                  className="input-sleek"
                  placeholder={def.placeholder}
                  value={def.assignee}
                  onChange={(e) => handleDefChange(key, 'assignee', e.target.value)}
                />
              </div>

              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={def.confirmed}
                  onChange={(e) => handleDefChange(key, 'confirmed', e.target.checked)}
                />
                <span className="checkmark"></span>
                Rozumím této definici
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* --- CIA Triad Section --- */}
      <div className="cia-section">
        <h3>Potvrzení principů bezpečnosti (CIA)</h3>
        <div className="cia-explanation">
          <div className="cia-item" title="Zajištění, aby informace byly přístupné pouze oprávněným osobám.">
            <strong>C</strong>onfidentiality (Důvěrnost)
            <span className="info-icon">i</span>
          </div>
          <div className="cia-item" title="Zajištění správnosti a úplnosti informací a metod jejich zpracování.">
            <strong>I</strong>ntegrity (Integrita)
            <span className="info-icon">i</span>
          </div>
          <div className="cia-item" title="Zajištění, aby oprávnění uživatelé měli k informacím přístup, když je potřebují.">
            <strong>A</strong>vailability (Dostupnost)
            <span className="info-icon">i</span>
          </div>
        </div>
        <p className="cia-text">
          Svým podpisem stvrzuji, že chápu význam těchto tří pilířů informační bezpečnosti a budu je při implementaci respektovat.
        </p>
        <input
          type="text"
          className="input-sleek signature-input"
          placeholder="Podpis (Jméno a Příjmení)"
          value={ciaSignature}
          onChange={(e) => setCiaSignature(e.target.value)}
        />
      </div>

      {/* --- Action Bar --- */}
      <div className="form-actions-bar">
        <div className="validation-status">
          {isStepValid() ? (
            <span className="status-valid">✓ Vše vyplněno</span>
          ) : (
            <span className="status-invalid">Vyplňte prosím všechna pole a potvrďte definice.</span>
          )}
        </div>
        <button
          className="action-button primary"
          onClick={handleSubmit}
        >
          Potvrdit a pokračovat
        </button>
      </div>
    </div>
  );
}
