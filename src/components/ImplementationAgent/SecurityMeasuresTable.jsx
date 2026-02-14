import React, { useState, useEffect } from 'react';

/**
 * SecurityMeasuresTable
 * 
 * Step 5: Security Measures (Appendix 1 Decree 410/2025 Sb.)
 * 
 * Features:
 * - Master Table with Mandatory vs. Conditional logic.
 * - Strict State Machine: Validates Description/Responsibility.
 * - Dynamic Recommendations based on Smart Logic (Risk Context).
 */
export default function SecurityMeasuresTable({ smartLogic, roles, onComplete }) {
    const [measures, setMeasures] = useState([]);

    // Flattened roles for dropdown
    const availableRoles = [
        ...(roles?.admins || []).map(r => ({ name: r, cat: 'Admin' })),
        ...(roles?.privileged || []).map(r => ({ name: r, cat: 'Privileged' })),
        ...(roles?.users || []).map(r => ({ name: r, cat: 'User' }))
    ];

    // --- 1. Ruleset Definition ---
    // Mandatory: § 3(2-6), 4, 5, 6, 10
    // Conditional: § 7, 8, 9, 11, 12, 13
    const RULES = [
        { id: '§ 3', title: 'Řízení aktiv a rizik', type: 'MANDATORY', desc: 'Identifikace a hodnocení aktiv.' },
        { id: '§ 4', title: 'Bezpečnostní politika', type: 'MANDATORY', desc: 'Schválená dokumentace a pravidla.' },
        { id: '§ 5', title: 'Organizační bezpečnost', type: 'MANDATORY', desc: 'Role, odpovědnosti, výbory.' },
        { id: '§ 6', title: 'Zálohování a obnova', type: 'MANDATORY', desc: 'Pravidelné zálohy a testy obnovy.' },
        { id: '§ 7', title: 'Bezpečnost lidských zdrojů', type: 'CONDITIONAL' },
        { id: '§ 8', title: 'Řízení přístupu a identit (MFA)', type: 'CONDITIONAL' },
        { id: '§ 9', title: 'Bezpečnost sítí a komunikace', type: 'CONDITIONAL' },
        { id: '§ 10', title: 'Akvizice a vývoj (Bezpečný SW)', type: 'MANDATORY', desc: 'Bezpečnost při nákupu a vývoji.' },
        { id: '§ 11', title: 'Fyzická a environmentální bezpečnost', type: 'CONDITIONAL' },
        { id: '§ 12', title: 'Zvládání kybernetických incidentů', type: 'CONDITIONAL' },
        { id: '§ 13', title: 'Kryptografické prostředky', type: 'CONDITIONAL' }
    ];

    // --- 2. Initialization Logic ---
    useEffect(() => {
        const generatedMeasures = RULES.map(rule => {
            let recommendation = '';
            let isVisible = true;

            // Smart Logic Evaluation
            if (rule.type === 'CONDITIONAL') {
                // § 8 (MFA) - Strongly recommended if Health/Safety impact OR High Value IT
                if (rule.id === '§ 8') {
                    if (smartLogic?.hasHealthOrSafetyImpact) recommendation = 'KRITICKÉ: Vyžadováno kvůli dopadům na zdraví/bezpečnost.';
                    else if (smartLogic?.hasHighValueIT) recommendation = 'DOPORUČENO: Ochrana hodnotných aktiv.';
                    else recommendation = 'Volitelné (dle analýzy rizik).';
                }

                // § 9 (Networks) - Critical for Legacy Systems
                if (rule.id === '§ 9') {
                    if (smartLogic?.hasLegacySystems) recommendation = 'KRITICKÉ: Segmentace sítě nutná pro izolaci zastaralých systémů.';
                    else recommendation = 'Standardní síťová bezpečnost.';
                }

                // § 12 (Incident Management) - Scaled by IT Value
                if (rule.id === '§ 12') {
                    if (!smartLogic?.hasHighValueIT && !smartLogic?.hasHealthOrSafetyImpact) {
                        recommendation = 'Lze aplikovat zjednodušený proces (princip přiměřenosti).';
                    } else {
                        recommendation = 'Vyžadován plný proces detekce a reakce.';
                    }
                }

                // § 13 (Crypto) - Usually tied to Sensitive Data (implied) or high value
                if (rule.id === '§ 13') {
                    recommendation = 'Dle povahy zpracovávaných dat.';
                }

                // § 7 & 11 - General conditionals
                if (rule.id === '§ 7' || rule.id === '§ 11') {
                    recommendation = 'Dle kontextu organizace.';
                }
            } else {
                recommendation = 'POVINNÉ: Zákonné minimum.';
            }

            return {
                ...rule,
                status: 'Nezavedeno',
                description: '',
                deadline: '',
                priority: '2',
                responsibility: '',
                effectiveness: '', // PDCA: Check
                lastReviewDate: '', // PDCA: Act/Review
                recommendation
            };
        });

        setMeasures(generatedMeasures);
    }, [smartLogic]);

    // --- 3. Handlers ---
    const handleRowChange = (index, field, value) => {
        const updated = [...measures];
        updated[index][field] = value;

        // Auto-clear deadline if "Zavedeno"
        if (field === 'status' && value === 'Zavedeno') {
            updated[index].deadline = '';
        }

        setMeasures(updated);
    };

    // --- 4. Validation Logic ---
    const validateRow = (row) => {
        // 1. Mandatory Text Fields
        // Description is always required (how you do it OR why you don't)
        const hasDesc = row.description && row.description.trim().length > 0;
        const hasResp = row.responsibility && row.responsibility.trim().length > 0;

        if (!hasDesc || !hasResp) return false;

        // 2. PDCA: Check - Effectiveness is required if "Zavedeno"
        if (row.status === 'Zavedeno') {
            if (!row.effectiveness || row.effectiveness.trim().length === 0) return false;
        }

        return true;
    };

    // Check valid state for Submit trigger
    const canSubmit = measures.every(m => {
        if (!validateRow(m)) return false;

        // Mandatory measures check
        // We allow "Nezavedeno" but it will be flagged in the report.
        // However, the prompt says "nedovolí stav 'Nezavedeno' bez kritického varování".
        // The warning is visual in the UI. We won't hard block submission if they really want to generate a non-compliant report.
        // But we ensure they filled out the justification (description).

        return true;
    });

    const handleSubmit = () => {
        if (onComplete) {
            onComplete({
                step: 5,
                data: {
                    securityMeasures: measures,
                    timestamp: new Date().toISOString()
                }
            });
        }
    };

    return (
        <div className="step-container fade-in security-measures-container">
            <div className="step-header">
                <span className="step-badge">Krok 5</span>
                <h2>Bezpečnostní opatření</h2>
                <p className="step-legal-ref">Příloha č. 1 vyhlášky 410/2025 Sb.</p>
                <p className="step-description">
                    Definujte stav implementace pro povinná a doporučená opatření.
                </p>
            </div>

            <div className="measures-table-wrapper">
                <table className="measures-table">
                    <thead>
                        <tr>
                            <th style={{ width: '60px' }}>ID</th>
                            <th style={{ width: '20%' }}>Opatření</th>
                            <th style={{ width: '25%' }}>Doporučení / Kontext</th>
                            <th style={{ width: '15%' }}>Stav</th>
                            <th>Popis & Odpovědnost (Povinné)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {measures.map((row, index) => {
                            const isMandatory = row.type === 'MANDATORY';
                            const isNezavedeno = row.status === 'Nezavedeno';
                            const missingFields = !row.description || !row.responsibility;

                            return (
                                <tr key={row.id} className={missingFields ? 'row-invalid' : ''}>
                                    <td className="cell-id">
                                        {row.id}
                                        {isMandatory && <div style={{ color: '#ef4444', fontSize: '0.7rem' }}>(!)</div>}
                                    </td>
                                    <td className="cell-title">
                                        <strong>{row.title}</strong>
                                        {row.desc && <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>{row.desc}</div>}
                                    </td>
                                    <td>
                                        <div className="recommendation-badge" style={{
                                            fontSize: '0.85rem',
                                            padding: '0.5rem',
                                            background: isMandatory ? '#fee2e2' : '#f1f5f9',
                                            color: isMandatory ? '#991b1b' : '#475569',
                                            borderRadius: '6px',
                                            borderLeft: isMandatory ? '3px solid #ef4444' : '3px solid #cbd5e1'
                                        }}>
                                            {row.recommendation}
                                        </div>
                                        {isMandatory && isNezavedeno && (
                                            <div style={{ color: '#dc2626', fontSize: '0.8rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
                                                ⚠️ Musí být zavedeno!
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <select
                                            className={`input-sleek small ${row.status === 'Zavedeno' ? 'status-done' : ''}`}
                                            value={row.status}
                                            onChange={(e) => handleRowChange(index, 'status', e.target.value)}
                                        >
                                            <option value="Nezavedeno">Nezavedeno</option>
                                            <option value="V procesu">V procesu</option>
                                            <option value="Zavedeno">Zavedeno</option>
                                        </select>

                                        {row.status !== 'Zavedeno' && (
                                            <input
                                                type="date"
                                                className="input-sleek small"
                                                style={{ marginTop: '0.5rem' }}
                                                value={row.deadline}
                                                onChange={(e) => handleRowChange(index, 'deadline', e.target.value)}
                                            />
                                        )}
                                    </td>
                                    <td>
                                        <div className="combined-inputs">
                                            {/* PLAN/DO: Description */}
                                            <textarea
                                                className={`input-sleek textarea-small ${!row.description ? 'input-error' : ''}`}
                                                placeholder={isNezavedeno ? "Zdůvodnění nezavedení..." : "Popis způsobu realizace (Do)..."}
                                                value={row.description}
                                                onChange={(e) => handleRowChange(index, 'description', e.target.value)}
                                                rows={2}
                                            />

                                            {/* CHECK: Effectiveness */}
                                            {row.status === 'Zavedeno' && (
                                                <textarea
                                                    className={`input-sleek textarea-small ${!row.effectiveness ? 'input-error' : ''}`}
                                                    placeholder="Vyhodnocení účinnosti (Check)..."
                                                    value={row.effectiveness}
                                                    onChange={(e) => handleRowChange(index, 'effectiveness', e.target.value)}
                                                    rows={2}
                                                    style={{ marginTop: '0.5rem', borderColor: '#a78bfa' }}
                                                />
                                            )}

                                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                                {/* PLAN: Responsibility */}
                                                {availableRoles.length > 0 ? (
                                                    <select
                                                        className={`input-sleek small ${!row.responsibility ? 'input-error' : ''}`}
                                                        value={row.responsibility}
                                                        onChange={(e) => handleRowChange(index, 'responsibility', e.target.value)}
                                                        style={{ flex: 1 }}
                                                    >
                                                        <option value="">-- Garant --</option>
                                                        {availableRoles.map((role, i) => (
                                                            <option key={i} value={role.name}>{role.name} ({role.cat})</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        className={`input-sleek small ${!row.responsibility ? 'input-error' : ''}`}
                                                        placeholder="Garant..."
                                                        value={row.responsibility}
                                                        onChange={(e) => handleRowChange(index, 'responsibility', e.target.value)}
                                                        style={{ flex: 1 }}
                                                    />
                                                )}

                                                {/* ACT: Review Date */}
                                                <input
                                                    type="date"
                                                    className="input-sleek small"
                                                    title="Datum poslední revize"
                                                    value={row.lastReviewDate}
                                                    onChange={(e) => handleRowChange(index, 'lastReviewDate', e.target.value)}
                                                    style={{ width: '130px' }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="form-actions-bar">
                <div className="validation-status">
                    {!canSubmit && (
                        <span className="status-invalid">
                            Vyplňte prosím popis a odpovědnou osobu u všech opatření.
                        </span>
                    )}
                    {canSubmit && (
                        <span className="status-valid">✓ Všechna data jsou kompletní</span>
                    )}
                </div>
                <button
                    className="action-button primary"
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                >
                    Schválit a vygenerovat audit
                </button>
            </div>
        </div>
    );
}
