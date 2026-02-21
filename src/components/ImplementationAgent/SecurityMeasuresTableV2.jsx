import React, { useState, useEffect } from 'react';
import { evaluateMeasure, createAuditLogEntry } from './ProfilerEngine';


export default function SecurityMeasuresTableV2({ assetData, signatureData, profileData, revisionHistory, onComplete }) {
    const [measures, setMeasures] = useState([]);
    const [auditLog, setAuditLog] = useState(profileData?.initialLog ? [profileData.initialLog] : []);
    const [complianceScore, setComplianceScore] = useState(50);
    const [revisionData, setRevisionData] = useState({
        date: new Date().toISOString().split('T')[0],
        nextDate: '',
        manager: signatureData?.name || '',
        version: '2.0'
    });

    // Mock data opatření s odhadovanými cenami (Kč) pro Pravidlo 1
    const RULES = [
        { id: '§ 3', title: 'Řízení bezpečnostní politiky', min_cost: 0, max_cost: 50000 },
        { id: '§ 4', title: 'Povinnosti vedení (školení)', min_cost: 10000, max_cost: 30000 },
        { id: '§ 5', title: 'Organizační bezpečnost (struktura)', min_cost: 0, max_cost: 0 },
        { id: '§ 6', title: 'Zálohování a obnova', min_cost: 50000, max_cost: 500000 },
        { id: '§ 10', title: 'Zjišťování kybernetických bezpečnostních událostí', min_cost: 0, max_cost: 100000 },
        // Detekční / další systémy
        { id: '§ 11', title: 'Nástroj pro centralizovaný sběr logů (SIEM)', min_cost: 500000, max_cost: 2000000 },
        { id: '§ 12', title: 'Hardening a omezování funkcionality stanic', min_cost: 20000, max_cost: 100000 },
        { id: '§ 14', title: 'Řízení přístupu (MFA všude)', min_cost: 100000, max_cost: 300000 }
    ];

    useEffect(() => {
        if (signatureData?.name) {
            setRevisionData(prev => ({ ...prev, manager: signatureData.name }));
        }
    }, [signatureData]);

    useEffect(() => {
        const next = new Date();
        next.setFullYear(next.getFullYear() + 1);
        setRevisionData(prev => ({ ...prev, nextDate: next.toISOString().split('T')[0] }));
    }, []);

    useEffect(() => {
        // Inicializace tabulky a spuštění ProfilerEngine
        const initial = RULES.map(rule => {
            const evalResult = evaluateMeasure(rule, profileData);

            return {
                ...rule,
                status: evalResult.isDisproportionate ? 'Nezavedeno (Přiměřenost)' : 'Nezavedeno',
                description: evalResult.isDisproportionate ? evalResult.defaultJustification : '',
                verification: '',
                deadline: '',
                priority: '2',
                responsibility: signatureData?.name || '',
                appropriatenessType: evalResult.type || '',
                engineEvaluation: evalResult
            };
        });
        setMeasures(initial);

        // Zalogovat automatické výjimky typu Ekonomická bariéra
        const autoExceptions = initial.filter(m => m.engineEvaluation.isDisproportionate);
        if (autoExceptions.length > 0) {
            const names = autoExceptions.map(a => a.id).join(', ');
            addAuditLogEntry(`Auto-Exceptions Aplikovány`, `Pravidlo 1: Zjištěna ekonomická disproporce pro opatření: ${names}. Automaticky předvyplněno zdůvodnění.`, -10);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [signatureData, profileData]);

    const addAuditLogEntry = (action, details, impact) => {
        const log = createAuditLogEntry(action, details, impact);
        setAuditLog(prev => [...prev, log]);
        setComplianceScore(prev => Math.min(100, Math.max(0, prev + impact)));
    };

    const handleRowChange = (idx, field, val) => {
        const updated = [...measures];
        const row = updated[idx];
        const oldVal = row[field];
        row[field] = val;

        // Pravidlo 3: Validace (Zamezit nezavedení)
        if (field === 'status' && (val === 'Nezavedeno' || val === 'Nezavedeno (Přiměřenost)')) {
            if (row.engineEvaluation.preventUnimplemented) {
                alert(`Kritická chyba: Sekce ${row.id} obsahuje neopominutelná opatření dle § 3 odst. 1 písm. b) vyhlášky. Jejich nezavedení NELZE odůvodnit přiměřeností.`);
                row[field] = 'V procesu'; // Revert back
                setMeasures(updated);
                return; // Zastavíme další zpracování
            }
        }

        if (field === 'status') {
            if (val === 'Zavedeno') {
                row.deadline = '';
                row.description = '';
                row.appropriatenessType = '';
                addAuditLogEntry(`Změna stavu (${row.id})`, `Stav změněn na 'Zavedeno'`, +5);
            } else if (val === 'Nezavedeno (Přiměřenost)') {
                // Generuj text ze šablony
                row.description = row.engineEvaluation.defaultJustification || "Popište specifické důvody výjimky...";
                row.appropriatenessType = row.engineEvaluation.type || 'Organizační'; // Default fallback
                row.verification = '';
                addAuditLogEntry(`Uplatnění výjimky (${row.id})`, `Status změněn na výjimku z přiměřenosti.`, -2);
            } else {
                row.verification = '';
                if (oldVal === 'Zavedeno') addAuditLogEntry(`Změna stavu (${row.id})`, `Stav Zavedeno -> ${val}`, -5);
            }
        }

        setMeasures(updated);
    };

    const isTableValid = measures.every(m => {
        const descValid = m.status === 'Zavedeno' || m.description.trim().length > 3;
        const respValid = m.responsibility && m.responsibility.trim().length > 0;
        const termValid = m.status === 'Zavedeno' || m.status === 'Nezavedeno (Přiměřenost)' || (m.deadline && m.deadline.length > 0);
        const verifValid = m.status !== 'Zavedeno' || (m.verification && m.verification.trim().length > 5);
        return descValid && respValid && termValid && verifValid;
    });


    return (
        <div className="step-container fade-in" style={{ maxWidth: '100%', display: 'flex', gap: '20px' }}>

            {/* STŘEDOVÝ PANEL S TABULKOU */}
            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="step-header">
                    <h2>Přehled opatření a výjimek (V2)</h2>
                    <div className="step-legal-note">
                        <strong>Logika The Profiler aktivní.</strong><br />
                        Ekonomicky a systémově nepřiměřená opatření byla zafixována. <strong>Zavedená opatření vyžadují PDCA důkaz (Ověření účinnosti).</strong>
                    </div>
                </div>

                <div className="legal-table-wrapper" style={{ overflowX: 'auto', background: 'var(--bg-card)', padding: '15px', borderRadius: '12px', border: '1px solid #333' }}>
                    <table className="nis2-official-table" style={{ minWidth: '1100px', width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                        <thead>
                            <tr>
                                <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)', width: '22%' }}>Opatření (Cenové pásmo)</th>
                                <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)', width: '13%' }}>Stav zavedení</th>
                                <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)', width: '12%' }}>Typ přiměřenosti</th>
                                <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)', width: '18%' }}>Zdůvodnění / Výjimka</th>
                                <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)', width: '15%' }}>Ověření účinnosti</th>
                                <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)', width: '10%' }}>Termín</th>
                                <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)', width: '10%' }}>Odpovědnost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {measures.map((row, idx) => (
                                <tr key={row.id} style={{ borderBottom: '1px solid #333' }}>
                                    <td style={{ padding: '10px 5px', verticalAlign: 'top' }}>
                                        <div style={{ fontWeight: 'bold' }}>{row.id}</div>
                                        <div>{row.title}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#ff9500' }}>
                                            Max. Odhad: {row.max_cost.toLocaleString()} Kč
                                        </div>
                                        {row.engineEvaluation.preventUnimplemented && (
                                            <div style={{ fontSize: '0.75rem', color: '#ff3b30', fontWeight: 'bold', marginTop: '4px' }}>
                                                🔒 Neopominutelné
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ padding: '10px 5px', verticalAlign: 'top' }}>
                                        <select
                                            value={row.status}
                                            onChange={e => handleRowChange(idx, 'status', e.target.value)}
                                            className="input-sleek small"
                                            style={{ borderColor: row.status === 'Nezavedeno (Přiměřenost)' ? '#bf5af2' : '#444' }}
                                        >
                                            <option value="Nezavedeno">Nezavedeno</option>
                                            <option value="V procesu">V procesu</option>
                                            <option value="Zavedeno">Zavedeno</option>
                                            {!row.engineEvaluation.preventUnimplemented && (
                                                <option value="Nezavedeno (Přiměřenost)">Nezavedeno (Přiměřenost)</option>
                                            )}
                                        </select>
                                    </td>
                                    <td style={{ padding: '10px 5px', verticalAlign: 'top' }}>
                                        {row.status === 'Nezavedeno (Přiměřenost)' ? (
                                            <select
                                                value={row.appropriatenessType}
                                                onChange={e => handleRowChange(idx, 'appropriatenessType', e.target.value)}
                                                className="input-sleek small"
                                            >
                                                <option value="">Nevybráno</option>
                                                <option value="Ekonomická">Ekonomická</option>
                                                <option value="Technická">Technická</option>
                                                <option value="Organizační">Organizační</option>
                                            </select>
                                        ) : <span style={{ color: '#555' }}>N/A</span>}
                                    </td>
                                    <td style={{ padding: '10px 5px', verticalAlign: 'top' }}>
                                        <textarea
                                            value={row.description}
                                            onChange={e => handleRowChange(idx, 'description', e.target.value)}
                                            className="input-sleek"
                                            rows={row.status === 'Nezavedeno (Přiměřenost)' ? 4 : 2}
                                            style={{ width: '100%', resize: 'vertical' }}
                                        />
                                    </td>
                                    <td style={{ padding: '10px 5px', verticalAlign: 'top' }}>
                                        {row.status === 'Zavedeno' ? (
                                            <textarea
                                                value={row.verification}
                                                onChange={e => handleRowChange(idx, 'verification', e.target.value)}
                                                className="input-sleek"
                                                rows={3}
                                                style={{ width: '100%', resize: 'vertical', borderColor: row.verification.length > 5 ? '#30d158' : '#ff453a' }}
                                                placeholder={
                                                    row.id === '§ 6' ? "Např. Test obnovy databáze (1.2.2026), data integritní." :
                                                        row.id === '§ 5' ? "Např. Test znalostí po školení, 92% úspěšnost." :
                                                            row.id === '§ 14' ? "Např. Audit účtů (10.1.2026), smazáno 5 neaktivních." :
                                                                "Jak bylo ověřeno a s jakým výsledkem?"
                                                }
                                            />
                                        ) : <span style={{ color: '#555', fontSize: '0.8rem', display: 'block', marginTop: '10px' }}>Vyžadováno po zavedení</span>}
                                    </td>
                                    <td style={{ padding: '10px 5px', verticalAlign: 'top' }}>
                                        <input
                                            type="date"
                                            value={row.deadline}
                                            disabled={row.status === 'Zavedeno' || row.status === 'Nezavedeno (Přiměřenost)'}
                                            onChange={e => handleRowChange(idx, 'deadline', e.target.value)}
                                            className="input-sleek"
                                            style={{ width: '100%', opacity: (row.status === 'Zavedeno' || row.status === 'Nezavedeno (Přiměřenost)') ? 0.3 : 1 }}
                                        />
                                    </td>
                                    <td style={{ padding: '10px 5px', verticalAlign: 'top' }}>
                                        <input
                                            type="text"
                                            value={row.responsibility}
                                            onChange={e => handleRowChange(idx, 'responsibility', e.target.value)}
                                            className="input-sleek"
                                            style={{ width: '100%' }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="form-actions-bar" style={{ marginTop: 'auto' }}>
                    <div className="validation-message" style={{ color: '#ff3b30' }}>
                        {!isTableValid && "Vyplňte prosím všechna povinná pole: Zdůvodnění, Termíny (pro rozpracované) a Ověření účinnosti PDCA (pro Zavedené)."}
                    </div>
                    <button className="action-button primary" disabled={!isTableValid} onClick={() => onComplete({ measures, revision: revisionData, auditLog, profileData })}>
                        Uložit Záznamy a Pokračovat
                    </button>
                </div>
            </div>

            {/* PRAVÝ PANEL - AUDIT LOG */}
            <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ background: '#1a1a1c', padding: '20px', borderRadius: '12px', border: '1px solid #bf5af2' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#bf5af2' }}>Compliance Skóre</h3>
                    <div style={{ fontSize: '3rem', fontWeight: 'bold', color: complianceScore > 75 ? '#32d74b' : complianceScore > 40 ? '#ff9f0a' : '#ff3b30' }}>
                        {complianceScore}%
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#888' }}>Indikátor připravenosti na audit</p>
                </div>

                <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: '1px solid #333', flex: '1', overflowY: 'auto', maxHeight: '600px' }}>
                    <h3 style={{ margin: '0 0 15px 0', fontSize: '1rem', borderBottom: '1px solid #333', paddingBottom: '10px' }}>📜 Audit Log (Změny)</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {auditLog.slice().reverse().map((log, i) => (
                            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', fontSize: '0.8rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                    <strong style={{ color: '#bf5af2' }}>{log.action}</strong>
                                    <span style={{ color: '#666' }}>{new Date(log.timestamp).toLocaleTimeString()}</span>
                                </div>
                                <div style={{ color: '#ccc', lineHeight: '1.4' }}>{log.details}</div>
                                {log.scoreImpact !== 0 && (
                                    <div style={{ marginTop: '5px', fontWeight: 'bold', color: log.scoreImpact > 0 ? '#32d74b' : '#ff9f0a' }}>
                                        {log.scoreImpact > 0 ? '+' : ''}{log.scoreImpact} skóre
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
