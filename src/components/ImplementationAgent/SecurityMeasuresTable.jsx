import React, { useState, useEffect } from 'react';
import SecurityPolicyModal from './SecurityPolicyModal';

const COLUMN_INFO = {
    measure: {
        title: "Bezpečnostní opatření podle vyhlášky",
        desc: "Příslušné bezpečnostní opatření požadované vyhláškou (Tab. č. 2).",
        values: "Odkaz na konkrétní ustanovení právního předpisu (např. § 3)."
    },
    status: {
        title: "Stav bezpečnostního opatření",
        desc: "Popis stavu ve chvíli hodnocení účinnosti (Tab. č. 3).",
        values: "• Zavedeno: Opatření je zavedeno v požadovaném rozsahu.\n• V procesu: Jsou činěny doložitelné kroky k zavedení.\n• Nezavedeno: Opatření zavedeno nebylo."
    },
    description: {
        title: "Popis bezpečnostního opatření",
        desc: "Stručný popis zavedení v návaznosti na stav (Tab. č. 4).",
        values: "• Zavedeno: Odkaz na dokumentaci/směrnici.\n• V procesu: Popis prozatímního stavu.\n• Nezavedeno: Zdůvodnění, proč nebylo zavedeno."
    },
    deadline: {
        title: "Termín zavedení bezpečnostního opatření",
        desc: "Plánovaný termín zavedení v plném rozsahu (Tab. č. 5).",
        values: "Vyplňuje se POUZE pokud stav není 'Zavedeno'. Konkrétní datum nebo kvartál."
    },
    priority: {
        title: "Priorita zavedení bezpečnostního opatření",
        desc: "Prioritizace s ohledem na dopad na regulovanou službu (Tab. č. 6).",
        values: "1 (Nízká) - Žádný dopad absence.\n2 (Střední) - Minimální/krátkodobý dopad.\n3 (Vysoká) - Vážný/dlouhodobý dopad.\n4 (Kritická) - Okamžité/nevratné důsledky."
    },
    responsibility: {
        title: "Odpovědnost za bezpečnostní opatření",
        desc: "Osoba pověřená za zavedení daného opatření (Tab. č. 7).",
        values: "Jméno osoby nebo konkrétní organizační složka."
    }
};

export default function SecurityMeasuresTable({ assetData, signatureData, revisionHistory, onComplete }) {
    const [measures, setMeasures] = useState([]);
    const [showPolicyModal, setShowPolicyModal] = useState(false);
    const [revisionData, setRevisionData] = useState({
        date: new Date().toISOString().split('T')[0],
        nextDate: '',
        manager: signatureData?.name || '',
        version: '1.0'
    });

    useEffect(() => {
        if (signatureData?.name) {
            setRevisionData(prev => ({ ...prev, manager: signatureData.name }));
        }
    }, [signatureData]);

    useEffect(() => {
        // Init next date on mount
        const next = new Date();
        next.setFullYear(next.getFullYear() + 1);
        setRevisionData(prev => ({ ...prev, nextDate: next.toISOString().split('T')[0] }));
    }, []);

    const RULES = [
        { id: '§ 3', title: 'Řízení aktiv, rizik a bezpečnostní politika', type: 'MANDATORY' },
        { id: '§ 4', title: 'Povinnosti vrcholného vedení', type: 'MANDATORY' },
        { id: '§ 5', title: 'Organizační bezpečnost', type: 'MANDATORY' },
        { id: '§ 6', title: 'Zálohování a obnova', type: 'MANDATORY' },
        { id: '§ 10', title: 'Řešení incidentů', type: 'MANDATORY' }
    ];

    useEffect(() => {
        const initial = RULES.map(rule => ({
            ...rule,
            status: 'Nezavedeno',
            description: '',
            deadline: '',
            priority: '2',
            responsibility: signatureData?.name || ''
        }));
        setMeasures(initial);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [signatureData]);

    const handleRowChange = (idx, field, val) => {
        const updated = [...measures];
        updated[idx][field] = val;

        // Logic: Clear deadline if 'Zavedeno'
        if (field === 'status' && val === 'Zavedeno') {
            updated[idx].deadline = '';
        }

        setMeasures(updated);
    };

    const isTableValid = measures.every(m => {
        // Validation logic
        const descValid = m.description.trim().length > 3;
        const respValid = m.responsibility.trim().length > 0;
        const termValid = m.status === 'Zavedeno' || m.deadline.length > 0;
        return descValid && respValid && termValid;
    });

    const renderHeaderWithTooltip = (label, infoKey) => (
        <div className="header-cell-content">
            {label}
            <div className="header-info-icon">
                ?
                <div className="header-tooltip">
                    <h4>{COLUMN_INFO[infoKey].title}</h4>
                    <p><strong>Popis:</strong> {COLUMN_INFO[infoKey].desc}</p>
                    <p className="tooltip-values"><strong>Hodnoty:</strong><br />{COLUMN_INFO[infoKey].values}</p>
                </div>
            </div>
        </div>
    );

    const handleDateChange = (e) => {
        const newDate = new Date(e.target.value);
        const next = new Date(newDate);
        next.setFullYear(next.getFullYear() + 1);
        setRevisionData(prev => ({
            ...prev,
            date: e.target.value,
            nextDate: next.toISOString().split('T')[0]
        }));
    };

    return (
        <div className="step-container fade-in" style={{ maxWidth: '100%' }}>
            <div className="step-header">
                <h2>Tabulka č. 1: Přehled bezpečnostních opatření</h2>
                <div className="step-legal-note">
                    <strong>Příloha č. 1 vyhlášky 410/2025 Sb.</strong><br />
                    Najeďte myší na otazník v záhlaví každého sloupce pro zobrazení oficiální nápovědy k vyplnění.
                </div>
            </div>

            <div className="legal-table-wrapper" style={{ overflowX: 'auto', paddingBottom: '100px' }}> {/* Padding for tooltips */}
                <table className="nis2-official-table">
                    <thead>
                        {/* Decree Header Structure */}
                        <tr>
                            <th colSpan="5" className="header-group">Vyhodnocení účinnosti zajišťování kybernetické bezpečnosti</th>
                            <th className="header-empty-top"></th>
                        </tr>
                        <tr>
                            <th style={{ width: '20%' }}>{renderHeaderWithTooltip('Bezpečnostní opatření podle vyhlášky', 'measure')}</th>
                            <th style={{ width: '12%' }}>{renderHeaderWithTooltip('Stav bezpečnostního opatření', 'status')}</th>
                            <th style={{ width: '25%' }}>{renderHeaderWithTooltip('Popis bezpečnostního opatření', 'description')}</th>
                            <th style={{ width: '13%' }}>{renderHeaderWithTooltip('Termín zavedení bezpečnostního opatření', 'deadline')}</th>
                            <th style={{ width: '12%' }}>{renderHeaderWithTooltip('Priorita zavedení bezpečnostního opatření', 'priority')}</th>
                            <th style={{ width: '18%' }}>{renderHeaderWithTooltip('Odpovědnost za bezpečnostní opatření', 'responsibility')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {measures.map((row, idx) => (
                            <tr key={row.id}>
                                <td>
                                    <div className="measure-id">{row.id}</div>
                                    <div className="measure-title">{row.title}</div>
                                </td>
                                <td>
                                    <select
                                        value={row.status}
                                        onChange={e => handleRowChange(idx, 'status', e.target.value)}
                                        className={`input-sleek small status-${row.status === 'Zavedeno' ? 'ok' : 'pending'}`}
                                    >
                                        <option value="Nezavedeno">Nezavedeno</option>
                                        <option value="V procesu">V procesu</option>
                                        <option value="Zavedeno">Zavedeno</option>
                                    </select>
                                </td>
                                <td>
                                    <textarea
                                        placeholder={row.status === 'Zavedeno' ? "Odkaz na směrnici..." : "Zdůvodnění..."}
                                        value={row.description}
                                        onChange={e => handleRowChange(idx, 'description', e.target.value)}
                                        className="input-sleek"
                                        rows={2}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="date"
                                        value={row.deadline}
                                        disabled={row.status === 'Zavedeno'}
                                        onChange={e => handleRowChange(idx, 'deadline', e.target.value)}
                                        className="input-sleek"
                                        style={{ opacity: row.status === 'Zavedeno' ? 0.3 : 1 }}
                                    />
                                </td>
                                <td>
                                    <select value={row.priority} onChange={e => handleRowChange(idx, 'priority', e.target.value)} className="input-sleek">
                                        <option value="1">1 - Nízká</option>
                                        <option value="2">2 - Střední</option>
                                        <option value="3">3 - Vysoká</option>
                                        <option value="4">4 - Kritická</option>
                                    </select>
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={row.responsibility}
                                        onChange={e => handleRowChange(idx, 'responsibility', e.target.value)}
                                        className="input-sleek"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* § 3 Security Policy Management Section (Dedicated) */}
            <div className="policy-management-section">
                <h3>§ 3 Řízení bezpečnostní politiky a dokumentace</h3>
                <p className="section-desc">
                    (3) Povinná osoba v rámci řízení bezpečnostní politiky a bezpečnostní dokumentace:
                </p>

                <div className="policy-grid">
                    {/* Point a) */}
                    <div className="policy-card">
                        <strong style={{ color: '#4caf50' }}>a) Stanovení</strong>
                        <p>
                            Stanoví bezpečnostní politiku a dokumentaci k opatřením.
                        </p>
                        <button
                            className="action-button secondary small"
                            onClick={() => setShowPolicyModal(true)}
                        >
                            📄 Generovat Politiku
                        </button>
                    </div>

                    {/* Point b) */}
                    <div className="policy-card">
                        <strong style={{ color: '#2196f3' }}>b) Aktualizace</strong>
                        <p>
                            Pravidelně přezkoumává a aktualizuje pravidla (min. 1x ročně).
                        </p>
                        <div style={{ fontSize: '0.8rem', color: '#888', textAlign: 'center', marginTop: 'auto' }}>
                            ⬇ Viz <em>Správa revize</em> níže
                        </div>
                    </div>

                    {/* Point c) */}
                    <div className="policy-card">
                        <strong style={{ color: '#ff9800' }}>c) Vynucování</strong>
                        <p>
                            Vynucuje dodržování pravidel a postupů (seznámení).
                        </p>
                        <button
                            className="action-button secondary small"
                            onClick={() => setShowPolicyModal(true)}
                        >
                            ✍️ Podpisový arch
                        </button>
                    </div>
                </div>
            </div>

            <div className="document-management-footer">
                <h3>Správa a revize dokumentu</h3>
                <div className="doc-meta-grid">
                    <div className="meta-item">
                        <label>Datum revize</label>
                        <input type="date" value={revisionData.date} onChange={handleDateChange} className="input-sleek" />
                    </div>
                    <div className="meta-item">
                        <label>Platnost do (Příští revize)</label>
                        <input type="date" value={revisionData.nextDate} readOnly className="input-sleek" style={{ color: '#ff9f0a', fontWeight: 'bold' }} />
                        <small style={{ color: '#888' }}>*Povinná aktualizace min. 1x ročně</small>
                    </div>
                    <div className="meta-item">
                        <label>Schválil (Garant)</label>
                        <input type="text" value={revisionData.manager} onChange={e => setRevisionData({ ...revisionData, manager: e.target.value })} className="input-sleek" />
                    </div>
                    <div className="meta-item">
                        <label>Verze</label>
                        <input type="text" value={revisionData.version} onChange={e => setRevisionData({ ...revisionData, version: e.target.value })} className="input-sleek" style={{ width: '80px' }} />
                    </div>
                </div>
            </div>

            <div className="form-actions-bar">
                <div className="validation-message">
                    {!isTableValid && "Vyplňte prosím všechna povinná pole (popis, odpovědnost, termín pro nezavedené)."}
                </div>
                <button className="action-button primary" disabled={!isTableValid} onClick={() => onComplete({ measures, revision: revisionData })}>
                    Finalizovat Audit
                </button>
            </div>

            {/* Revision History Table (4-Year Archiving) */}
            {revisionHistory && revisionHistory.length > 0 && (
                <div className="history-section" style={{ marginTop: '30px', borderTop: '1px solid var(--im-border)', paddingTop: '20px' }}>
                    <h3 style={{ color: '#888', fontSize: '1rem', marginBottom: '15px' }}>📜 Historie revizí (Archiv)</h3>
                    <table className="nis2-official-table" style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                        <thead>
                            <tr>
                                <th>Datum revize</th>
                                <th>Verze</th>
                                <th>Garant</th>
                                <th>Platnost do</th>
                                <th>Stav</th>
                            </tr>
                        </thead>
                        <tbody>
                            {revisionHistory.map((rev, i) => (
                                <tr key={i}>
                                    <td>{rev.date}</td>
                                    <td>{rev.version}</td>
                                    <td>{rev.manager}</td>
                                    <td>{rev.validUntil}</td>
                                    <td><span className="status-badge" style={{ background: '#333', color: '#ccc', padding: '2px 6px', borderRadius: '4px' }}>Archivováno</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Security Policy Modal */}
            {
                showPolicyModal && (
                    <SecurityPolicyModal
                        companyName={assetData && assetData.length > 0 ? "Vaše Společnost" : "Nezadáno"} // TODO: Pass company name properly if available
                        assets={assetData}
                        manager={signatureData?.name}
                        onClose={() => setShowPolicyModal(false)}
                    />
                )
            }
        </div >
    );
}
