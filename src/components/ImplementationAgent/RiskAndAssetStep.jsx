import React, { useState } from 'react';
import './IdentificationStep.css'; // Reusing the premium styles from Step 1

/**
 * RiskAndAssetStep (Refactored to § 3 Minimum Security Manager)
 * 
 * Step 2: Systém zajišťování minimální kybernetické bezpečnosti (§ 3 Decree 410/2025 Sb.)
 * 
 * Focus:
 * 1. Identification of the "Responsible Person" (Povinná osoba).
 * 2. Declaration of proportionality (§ 3a).
 * 3. Commitment to mandatory measures (§ 3b, § 4, § 5, § 6, § 10).
 */
export default function RiskAndAssetStep({ onComplete }) {
    // --- State: Responsible Person ---
    const [responsiblePerson, setResponsiblePerson] = useState({
        name: '',
        role: '',
        date: '' // Allow empty start to let user pick freely
    });

    // --- State: Declarations ---
    const [declarations, setDeclarations] = useState({
        minSecurity: {
            id: '§3',
            label: 'Systém minimální kybernetické bezpečnosti',
            text: 'Zavádím a provádím bezpečnostní opatření, která jsou přiměřená bezpečnostním potřebám (§ 3 odst. 1 písm. a).',
            checked: false
        },
        governance: {
            id: '§4',
            label: 'Požadavky na vrcholné vedení',
            text: 'Beru na vědomí odpovědnost vedení za schvalování a kontrolu bezpečnostních opatření.',
            checked: false
        },
        hrSecurity: {
            id: '§5',
            label: 'Bezpečnost lidských zdrojů',
            text: 'Zajistím uplatňování bezpečnostních požadavků v rámci pracovněprávních vztahů.',
            checked: false
        },
        bcm: {
            id: '§6',
            label: 'Řízení kontinuity činností',
            text: 'Zavedu plány pro zvládání přerušení provozu a obnovu klíčových služeb.',
            checked: false
        },
        incidents: {
            id: '§10',
            label: 'Řešení incidentů',
            text: 'Zajistím proces detekce, hlášení a zvládání kybernetických bezpečnostních incidentů.',
            checked: false
        }
    });

    const [signature, setSignature] = useState('');

    // --- Handlers ---
    const handlePersonChange = (field, value) => {
        setResponsiblePerson(prev => ({ ...prev, [field]: value }));
    };

    const handleDeclarationToggle = (key) => {
        setDeclarations(prev => ({
            ...prev,
            [key]: { ...prev[key], checked: !prev[key].checked }
        }));
    };

    const isStepValid = () => {
        const isPersonValid = responsiblePerson.name.trim() && responsiblePerson.role.trim() && responsiblePerson.date;
        const areDeclarationsValid = Object.values(declarations).every(d => d.checked);
        const isSignatureValid = signature.trim().length > 0;

        return isPersonValid && areDeclarationsValid && isSignatureValid;
    };

    const handleSubmit = () => {
        if (isStepValid() && onComplete) {
            onComplete({
                step: 2, // Maps to 'riskData' key in parent, keeping structure but changing semantic content
                data: {
                    responsiblePerson,
                    declarations,
                    signature,
                    timestamp: new Date().toISOString()
                }
            });
        }
    };

    return (
        <div className="step-container fade-in">
            <div className="step-header">
                <span className="step-badge">Krok 2</span>
                <h2>Systém zajišťování minimální KB</h2>
                <p className="step-legal-ref">§ 3 vyhlášky 410/2025 Sb.</p>
                <p className="step-description">
                    Identifikace povinné osoby a potvrzení závazku k zavedení minimálních bezpečnostních opatření.
                </p>
            </div>

            {/* --- Section 1: Responsible Person --- */}
            <div className="definition-card" style={{ marginBottom: '3rem' }}>
                <div className="def-header">
                    <span className="def-letter">Osoba</span>
                    <h3>Odpovědnost za kybernetickou bezpečnost</h3>
                </div>
                <p className="def-text">
                    Určete osobu odpovědnou za zajišťování kybernetické bezpečnosti v organizaci (např. statutární orgán nebo jím pověřená osoba).
                </p>

                <div className="def-inputs">
                    <div className="input-group">
                        <label className="input-label">Jméno a Příjmení</label>
                        <input
                            type="text"
                            placeholder="Např. Ing. Jan Novák"
                            value={responsiblePerson.name}
                            onChange={(e) => handlePersonChange('name', e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Funkce / Role</label>
                        <input
                            type="text"
                            placeholder="Např. Jednatel, Bezpečnostní ředitel (CISO)"
                            value={responsiblePerson.role}
                            onChange={(e) => handlePersonChange('role', e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Datum pověření</label>
                        <input
                            type="date"
                            style={{
                                width: '100%',
                                background: 'rgba(0,0,0,0.3)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                padding: '1rem',
                                color: 'white',
                                borderRadius: '8px',
                                colorScheme: 'dark' // Ensure calendar picker is dark
                            }}
                            value={responsiblePerson.date}
                            onChange={(e) => handlePersonChange('date', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* --- Section 2: Declarations Grid --- */}
            <h3 style={{ marginBottom: '1.5rem', marginLeft: '0.5rem' }}>Rozsah bezpečnostních opatření</h3>
            <div className="definitions-grid">
                {Object.entries(declarations).map(([key, item]) => (
                    <div
                        key={key}
                        className={`definition-card ${item.checked ? 'confirmed' : ''}`}
                        onClick={() => handleDeclarationToggle(key)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="def-header">
                            <span className="def-letter">{item.id}</span>
                            <h3>{item.label}</h3>
                        </div>
                        <p className="def-text" style={{ marginBottom: '1rem', borderBottom: 'none' }}>
                            {item.text}
                        </p>

                        <div className="checkbox-container">
                            <input
                                type="checkbox"
                                checked={item.checked}
                                readOnly // Handled by card click
                            />
                            <span className="checkmark"></span>
                            <span className="checkbox-text">
                                {item.checked ? 'Potvrzeno' : 'Beru na vědomí a zavádím'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- Section 3: Signature --- */}
            <div className="cia-section">
                <h3>Digitální stvrzení odpovědnosti</h3>
                <p className="cia-text">
                    Svým podpisem stvrzuji, že jsem se seznámil(a) s požadavky vyhlášky č. 410/2025 Sb. a přebírám odpovědnost za jejich zavedení v naší organizaci.
                </p>
                <input
                    type="text"
                    className="signature-input"
                    placeholder="Podepsat (Jméno a Příjmení)"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                />
            </div>

            {/* --- Action Bar --- */}
            <div className="form-actions-bar">
                <div className="validation-status">
                    {isStepValid() ? (
                        <span className="status-valid">✓ Připraveno k pokračování</span>
                    ) : (
                        <span className="status-invalid">Vyplňte odpovědnou osobu, potvrďte všechny body a podepište.</span>
                    )}
                </div>
                <button
                    className="action-button primary"
                    onClick={handleSubmit}
                    disabled={!isStepValid()}
                >
                    Uložit a přejít na Opatření
                </button>
            </div>
        </div>
    );
}
