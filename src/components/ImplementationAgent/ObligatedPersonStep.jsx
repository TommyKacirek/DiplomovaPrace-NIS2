import React, { useState } from 'react';
import './IdentificationStep.css'; // Reuse basic layout, but override with inline styles for "Black Apple"

export default function ObligatedPersonStep({ onComplete }) {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');

    // Compliance Checkboxes
    const [checks, setChecks] = useState({
        s3: false, // § 3 Minimum Security
        s4: false, // § 4 Governance
        s5: false, // § 5 HR
        s6: false, // § 6 BCM
        s10: false // § 10 Incidents
    });

    const toggleCheck = (key) => {
        setChecks(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const allChecked = Object.values(checks).every(Boolean);

    const handleSave = () => {
        if (!name || !role || !allChecked) return;

        // Save data for report generation
        if (onComplete) {
            onComplete({
                step: 4,
                data: {
                    name,
                    role,
                    declarations: checks,
                    timestamp: new Date().toISOString()
                }
            });
        }
    };

    return (
        <div style={{
            background: '#000000',
            color: '#f5f5f7',
            minHeight: '80vh',
            padding: '4rem 2rem',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}>
            <div style={{ maxWidth: '700px', margin: '0 auto' }}>

                {/* Header */}
                <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
                    <div style={{
                        display: 'inline-block',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        border: '1px solid #333',
                        background: '#111',
                        fontSize: '0.8rem',
                        color: '#888',
                        marginBottom: '1rem',
                        letterSpacing: '0.05em'
                    }}>
                        MANAGEMENT IDENTIFICATION
                    </div>
                    <h1 style={{
                        fontSize: '3rem',
                        fontWeight: 700,
                        margin: '0 0 1rem 0',
                        background: 'linear-gradient(180deg, #fff 0%, #666 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Odpovědná osoba
                    </h1>
                    <p style={{ color: '#666', fontSize: '1.2rem', lineHeight: 1.5 }}>
                        Identifikace statutárního orgánu nebo pověřené osoby pro účely § 3 vyhlášky 410/2025 Sb.
                    </p>
                </div>

                {/* Card */}
                <div style={{
                    background: '#0a0a0a',
                    border: '1px solid #222',
                    borderRadius: '24px',
                    padding: '3rem',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                }}>

                    {/* Inputs */}
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', color: '#444', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                            JMÉNO A PŘÍJMENÍ
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Např. Ing. Jan Novák"
                            style={{
                                width: '100%',
                                background: '#111',
                                border: '1px solid #333',
                                color: '#fff',
                                padding: '1.2rem',
                                borderRadius: '12px',
                                fontSize: '1.1rem',
                                outline: 'none',
                                transition: 'all 0.2s'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '3rem' }}>
                        <label style={{ display: 'block', color: '#444', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                            PRACOVNÍ POZICE
                        </label>
                        <input
                            type="text"
                            value={role}
                            onChange={e => setRole(e.target.value)}
                            placeholder="Např. Jednatel / CISO"
                            style={{
                                width: '100%',
                                background: '#111',
                                border: '1px solid #333',
                                color: '#fff',
                                padding: '1.2rem',
                                borderRadius: '12px',
                                fontSize: '1.1rem',
                                outline: 'none',
                                transition: 'all 0.2s'
                            }}
                        />
                    </div>

                    {/* Checkboxes */}
                    <div style={{ marginBottom: '3rem' }}>
                        <label style={{ display: 'block', color: '#444', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '1rem' }}>
                            ROZSAH ODPOVĚDNOSTI (VYHLÁŠKA 410/2025 Sb.)
                        </label>

                        {[
                            { id: 's3', label: '§ 3 Systém zajišťování minimální kybernetické bezpečnosti' },
                            { id: 's4', label: '§ 4 Požadavky na vrcholné vedení (Governance)' },
                            { id: 's5', label: '§ 5 Bezpečnost lidských zdrojů (HR Security)' },
                            { id: 's6', label: '§ 6 Řízení kontinuity činností (BCM)' },
                            { id: 's10', label: '§ 10 Řešení kybernetických bezpečnostních incidentů' }
                        ].map(item => (
                            <div
                                key={item.id}
                                onClick={() => toggleCheck(item.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '1rem',
                                    marginBottom: '0.5rem',
                                    background: checks[item.id] ? 'rgba(50, 215, 75, 0.1)' : '#111',
                                    border: checks[item.id] ? '1px solid rgba(50, 215, 75, 0.3)' : '1px solid #222',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '6px',
                                    border: '1px solid #444',
                                    background: checks[item.id] ? '#32d74b' : 'transparent',
                                    marginRight: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#000',
                                    fontSize: '14px',
                                    fontWeight: 'bold'
                                }}>
                                    {checks[item.id] && '✓'}
                                </div>
                                <span style={{ color: checks[item.id] ? '#fff' : '#888', fontSize: '0.95rem' }}>
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Explanation */}
                    <div style={{
                        padding: '1rem',
                        marginBottom: '3rem',
                        color: '#666',
                        fontSize: '0.85rem',
                        textAlign: 'center',
                        fontStyle: 'italic',
                        borderTop: '1px solid #222',
                        borderBottom: '1px solid #222'
                    }}>
                        "Potvrzuji správnost uvedených údajů. V dalším kroku bude vygenerován auditní report (PDF), který statutární orgán podepíše (elektronicky nebo fyzicky)."
                    </div>

                    {/* Action Button */}
                    <div style={{ textAlign: 'center' }}>
                        <button
                            onClick={handleSave}
                            disabled={!name || !role || !allChecked}
                            style={{
                                background: (!name || !role || !allChecked) ? '#222' : '#0071e3', // Blue for "Next Step"
                                color: (!name || !role || !allChecked) ? '#555' : '#fff',
                                border: 'none',
                                padding: '1.2rem 3rem',
                                borderRadius: '50px',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                cursor: (!name || !role || !allChecked) ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s',
                                boxShadow: (!name || !role || !allChecked) ? 'none' : '0 4px 20px rgba(0, 113, 227, 0.3)'
                            }}
                        >
                            Uložit a Pokračovat (Generovat Report)
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
