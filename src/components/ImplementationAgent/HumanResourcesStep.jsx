import React, { useState } from 'react';
import './ImplementationModule.css';

export default function HumanResourcesStep({ onComplete, data }) {
    // A. Bezpečnostní politika (rozsah)
    const [policyTopics, setPolicyTopics] = useState(data?.policyTopics || {
        remoteWork: false,
        passwords: false,
        cleanDesk: false,
        onboardingOffboarding: false,
        mediaHandling: false,
        incidentReporting: false
    });

    // B. Evidence školení
    const [employees, setEmployees] = useState(data?.trainingEvidence || []);
    const [newEmp, setNewEmp] = useState({ name: '', role: '', type: 'Vstupní', date: '', isPractical: false });

    // C. Disciplinární doložka
    const [disciplinaryAck, setDisciplinaryAck] = useState(data?.disciplinaryAck || false);
    const [showDisciplinaryWarning, setShowDisciplinaryWarning] = useState(false);

    // Handlers
    const handleTopicChange = (topic) => {
        setPolicyTopics(prev => ({ ...prev, [topic]: !prev[topic] }));
    };

    const addEmployee = () => {
        if (!newEmp.name || !newEmp.role || !newEmp.date) return;

        // Výpočet příštího školení (+12 měsíců pro pravidelné, +1 měsíc pro vstupní jako follow-up, nebo default +1 rok)
        const currentDate = new Date(newEmp.date);
        const nextDate = new Date(currentDate.setFullYear(currentDate.getFullYear() + 1));
        const nextDateString = nextDate.toISOString().split('T')[0];

        setEmployees([...employees, { ...newEmp, id: Date.now(), nextDate: nextDateString }]);
        setNewEmp({ name: '', role: '', type: 'Vstupní', date: '', isPractical: false });
    };

    const removeEmployee = (id) => {
        setEmployees(employees.filter(e => e.id !== id));
    };

    const generatePolicyText = () => {
        const topics = [];
        if (policyTopics.remoteWork) topics.push("práci na dálku a využívání mobilních zařízení");
        if (policyTopics.passwords) topics.push("správu hesel a autentizaci");
        if (policyTopics.cleanDesk) topics.push("pravidla čistého stolu a čisté obrazovky");
        if (policyTopics.onboardingOffboarding) topics.push("bezpečnostní procesy při nástupu a odchodu zaměstnanců");
        if (policyTopics.mediaHandling) topics.push("bezpečnou manipulaci s přenosnými paměťovými médii");
        if (policyTopics.incidentReporting) topics.push("hlášení bezpečnostních událostí a incidentů");

        if (topics.length === 0) return "Organizace dosud formálně nedefinovala rozsah bezpečnostní politiky pro lidské zdroje.";

        return `Organizace uplatňuje a prokazatelně komunikuje pravidla přijatelného chování, která pokrývají minimálně: ${topics.join(', ')}.`;
    };

    const handleNext = () => {
        const payloadDate = {
            policyTopics, // Save topics to reconstruct later
            policyText: generatePolicyText(),
            trainingEvidence: employees,
            disciplinaryAck,
            disciplinaryClause: "Organizace má stanovený a zaměstnancům prokazatelně komunikovaný postup pro případ porušení bezpečnostních pravidel, včetně pracovněprávních důsledků."
        };

        if (!disciplinaryAck) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => alert('Upozornění: Pro reálný reporting je nutné potvrdit disciplinární doložku (Sekce C).'), 100);
        }

        onComplete(payloadDate);
    };

    return (
        <div className="glass-panel fade-in">
            <h2>Bezpečnost lidských zdrojů (§ 5)</h2>
            <p className="step-description">
                Splnění podmínek § 5 Vyhlášky vyžaduje přechod od teoretických školení k prokazatelné evidenci a vymahatelnosti.
            </p>

            <div className="step-content">

                {/* Sekce A: Generátor Politiky */}
                <div className="form-group" style={{ border: '1px solid rgba(10, 132, 255, 0.5)', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ marginTop: 0, color: '#0a84ff' }}>A. Rozsah Bezpečnostní politiky (Pravidla chování)</h3>
                    <p style={{ fontSize: '0.9rem', marginBottom: '15px' }}>Vyberte oblasti, které vaše vnitřní předpisy (např. směrnice, pracovní řád) formálně a prokazatelně upravují:</p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <label className="checkbox-label"><input type="checkbox" checked={policyTopics.remoteWork} onChange={() => handleTopicChange('remoteWork')} /> Práce na dálku a mobilní zařízení</label>
                        <label className="checkbox-label"><input type="checkbox" checked={policyTopics.passwords} onChange={() => handleTopicChange('passwords')} /> Správa hesel a autentizace</label>
                        <label className="checkbox-label"><input type="checkbox" checked={policyTopics.cleanDesk} onChange={() => handleTopicChange('cleanDesk')} /> Pravidlo čistého stolu a obrazovky</label>
                        <label className="checkbox-label"><input type="checkbox" checked={policyTopics.onboardingOffboarding} onChange={() => handleTopicChange('onboardingOffboarding')} /> Nástup a odchod zaměstnance</label>
                        <label className="checkbox-label"><input type="checkbox" checked={policyTopics.mediaHandling} onChange={() => handleTopicChange('mediaHandling')} /> Manipulace s nosiči (USB apod.)</label>
                        <label className="checkbox-label"><input type="checkbox" checked={policyTopics.incidentReporting} onChange={() => handleTopicChange('incidentReporting')} /> Hlášení bezpečnostních incidentů</label>
                    </div>

                    <div className="info-box purple" style={{ marginTop: '15px' }}>
                        <strong>Výstupní definice pro Audit Report:</strong><br />
                        <em>{generatePolicyText()}</em>
                    </div>
                </div>

                {/* Sekce B: Evidence Školení */}
                <div className="form-group" style={{ border: '1px solid rgba(191, 90, 242, 0.5)', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ marginTop: 0, color: '#bf5af2' }}>B. Evidenciální list školení osob</h3>
                    <p style={{ fontSize: '0.9rem' }}>Vložte záznamy o proběhlých školeních. Administrátoři a osoby pověřené KB musí mít prokazatelné <strong>odborné/praktické</strong> proškolení.</p>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap', backgroundColor: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '6px', marginBottom: '15px' }}>
                        <div style={{ flex: '1 1 200px' }}>
                            <label style={{ fontSize: '0.8rem' }}>Jméno zaměstnance / Dodavatele</label>
                            <input type="text" className="form-control" value={newEmp.name} onChange={e => setNewEmp({ ...newEmp, name: e.target.value })} placeholder="Jan Novák" />
                        </div>
                        <div style={{ flex: '1 1 150px' }}>
                            <label style={{ fontSize: '0.8rem' }}>Pracovní role</label>
                            <input type="text" className="form-control" value={newEmp.role} onChange={e => setNewEmp({ ...newEmp, role: e.target.value })} placeholder="Běžný uživatel / Administrátor" />
                        </div>
                        <div style={{ flex: '0 0 130px' }}>
                            <label style={{ fontSize: '0.8rem' }}>Typ školení</label>
                            <select className="form-control" value={newEmp.type} onChange={e => setNewEmp({ ...newEmp, type: e.target.value })}>
                                <option>Vstupní</option>
                                <option>Pravidelné</option>
                                <option>Mimořádné</option>
                            </select>
                        </div>
                        <div style={{ flex: '0 0 130px' }}>
                            <label style={{ fontSize: '0.8rem' }}>Datum absolvování</label>
                            <input type="date" className="form-control" value={newEmp.date} onChange={e => setNewEmp({ ...newEmp, date: e.target.value })} />
                        </div>
                        <div style={{ flex: '0 0 120px', display: 'flex', alignItems: 'center', height: '38px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '0.85rem' }}>
                                <input type="checkbox" checked={newEmp.isPractical} onChange={e => setNewEmp({ ...newEmp, isPractical: e.target.checked })} />
                                Odborné/Prax.
                            </label>
                        </div>
                        <div style={{ flex: '0 0 100px' }}>
                            <button className="action-button secondary w-full" onClick={addEmployee} disabled={!newEmp.name || !newEmp.role || !newEmp.date}>Přidat</button>
                        </div>
                    </div>

                    {employees.length > 0 && (
                        <table className="nis2-official-table" style={{ fontSize: '0.9rem' }}>
                            <thead>
                                <tr>
                                    <th>Jméno</th>
                                    <th>Role</th>
                                    <th>Typ školení</th>
                                    <th>Datum</th>
                                    <th>Příští datum (Hlídač)</th>
                                    <th>Akce</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map(emp => (
                                    <tr key={emp.id}>
                                        <td>{emp.name}</td>
                                        <td>{emp.role} {emp.isPractical && <span style={{ color: '#32d74b', fontSize: '0.7rem', padding: '2px 5px', border: '1px solid #32d74b', borderRadius: '3px', marginLeft: '5px' }}>PRAXE</span>}</td>
                                        <td>{emp.type}</td>
                                        <td>{new Date(emp.date).toLocaleDateString('cs-CZ')}</td>
                                        <td style={{ color: '#ff9500' }}>{new Date(emp.nextDate).toLocaleDateString('cs-CZ')}</td>
                                        <td>
                                            <button className="action-button small" style={{ backgroundColor: 'transparent', color: '#ff453a', border: 'none', padding: 0 }} onClick={() => removeEmployee(emp.id)}>Odstranit</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {employees.length === 0 && <p style={{ fontStyle: 'italic', color: '#888', textAlign: 'center' }}>Zatím nebyl přidán žádný záznam o školení.</p>}
                </div>

                {/* Sekce C: Disciplinární doložka */}
                <div className="form-group" style={{ border: '1px solid rgba(255, 69, 58, 0.5)', padding: '15px', borderRadius: '8px' }}>
                    <h3 style={{ marginTop: 0, color: '#ff453a' }}>C. Disciplinární doložka (Vymahatelnost)</h3>

                    {showDisciplinaryWarning && (
                        <div style={{ padding: '10px', backgroundColor: 'rgba(255, 69, 58, 0.2)', borderLeft: '3px solid #ff453a', borderRadius: '4px', marginBottom: '15px' }}>
                            <strong>Odmítnutí compliance: </strong>
                            Bez stanoveného postupu pro řešení bezpečnostních incidentů způsobených zaměstnanci je bezpečnostní politika nevymahatelná a neplní § 5.
                        </div>
                    )}

                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', padding: '10px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '4px' }}>
                        <input
                            type="checkbox"
                            checked={disciplinaryAck}
                            onChange={e => { setDisciplinaryAck(e.target.checked); setShowDisciplinaryWarning(false); }}
                            style={{ marginTop: '4px', width: '20px', height: '20px' }}
                        />
                        <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                            Potvrzuji, že organizace má stanovený a zaměstnancům prokazatelně komunikovaný postup pro případ porušení
                            bezpečnostních pravidel, včetně případných pracovněprávních důsledků.
                        </span>
                    </label>
                </div>

            </div>

            <div className="step-actions">
                <button className="action-button primary w-full" onClick={handleNext}>
                    Zapsat evidenci a pokračovat na Tabulku
                </button>
            </div>
        </div>
    );
}
