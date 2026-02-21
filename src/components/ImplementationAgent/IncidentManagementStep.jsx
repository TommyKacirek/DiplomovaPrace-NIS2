import React, { useState } from 'react';
import './ImplementationModule.css';

export default function IncidentManagementStep({ significanceData, onComplete, data }) {
    // Registr událostí
    const [events, setEvents] = useState(data?.events || []);
    const [newEvent, setNewEvent] = useState({
        name: '',
        date: '',
        downtimeHours: 0,
        usersAffectedPercent: 0,
        financialLoss: 0,
        description: ''
    });

    // Filtry a prahy z Kroku 1
    const thresholds = significanceData?.thresholds || {
        usersAffectedPercent: 10,
        downtimeHours: 2,
        financialLoss: 100000
    };

    const isSignificant = (e) => {
        return (
            Number(e.downtimeHours) >= thresholds.downtimeHours ||
            Number(e.usersAffectedPercent) >= thresholds.usersAffectedPercent ||
            Number(e.financialLoss) >= thresholds.financialLoss
        );
    };

    const addEvent = () => {
        if (!newEvent.name || !newEvent.date) return;
        setEvents([...events, { ...newEvent, id: Date.now(), significant: isSignificant(newEvent) }]);
        setNewEvent({
            name: '',
            date: '',
            downtimeHours: 0,
            usersAffectedPercent: 0,
            financialLoss: 0,
            description: ''
        });
    };

    const removeEvent = (id) => {
        setEvents(events.filter(e => e.id !== id));
    };

    const hasSignificantIncident = events.some(e => e.significant);

    const handleNext = () => {
        onComplete({
            events,
            hasSignificantIncident
        });
    };

    return (
        <div className="glass-panel fade-in">
            <h2>Zvládání incidentů (§ 10)</h2>
            <p className="step-description">
                Zde organizace eviduje kybernetické bezpečnostní události. Systém je automaticky (na základě vámi stanovených prahů z Kroku 1) vyhodnotí a určí, zda vzniká zákonná lhůta k hlášení.
            </p>

            <div className="step-content">

                {/* Sekce A: Registr událostí */}
                <div className="form-group" style={{ border: '1px solid rgba(191, 90, 242, 0.5)', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ marginTop: 0, color: '#bf5af2' }}>A. Registr kybernetických událostí (Evidence)</h3>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap', backgroundColor: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '6px', marginBottom: '15px' }}>
                        <div style={{ flex: '1 1 200px' }}>
                            <label style={{ fontSize: '0.8rem' }}>Název události (Co se stalo)</label>
                            <input type="text" className="form-control" value={newEvent.name} onChange={e => setNewEvent({ ...newEvent, name: e.target.value })} placeholder="Např. Výpadek mail serveru" />
                        </div>
                        <div style={{ flex: '0 0 130px' }}>
                            <label style={{ fontSize: '0.8rem' }}>Datum</label>
                            <input type="date" className="form-control" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} />
                        </div>
                        <div style={{ flex: '0 0 100px' }}>
                            <label style={{ fontSize: '0.8rem' }}>Výpadek (h)</label>
                            <input type="number" className="form-control" value={newEvent.downtimeHours} onChange={e => setNewEvent({ ...newEvent, downtimeHours: Number(e.target.value) })} min="0" />
                        </div>
                        <div style={{ flex: '0 0 130px' }}>
                            <label style={{ fontSize: '0.8rem' }}>Zasažených už. (%)</label>
                            <input type="number" className="form-control" value={newEvent.usersAffectedPercent} onChange={e => setNewEvent({ ...newEvent, usersAffectedPercent: Number(e.target.value) })} min="0" max="100" />
                        </div>
                        <div style={{ flex: '0 0 130px' }}>
                            <label style={{ fontSize: '0.8rem' }}>Škoda (Kč)</label>
                            <input type="number" step="10000" className="form-control" value={newEvent.financialLoss} onChange={e => setNewEvent({ ...newEvent, financialLoss: Number(e.target.value) })} min="0" />
                        </div>
                        <div style={{ flex: '0 0 100px' }}>
                            <button className="action-button secondary w-full" onClick={addEvent} disabled={!newEvent.name || !newEvent.date}>Evidovat</button>
                        </div>
                    </div>

                    {events.length > 0 ? (
                        <table className="nis2-official-table" style={{ fontSize: '0.85rem' }}>
                            <thead>
                                <tr>
                                    <th>Událost</th>
                                    <th>Datum</th>
                                    <th>Výpadek (h)</th>
                                    <th>Zasaženo (%)</th>
                                    <th>Škoda (Kč)</th>
                                    <th>Významnost</th>
                                    <th>Akce</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.map(e => (
                                    <tr key={e.id} style={{ backgroundColor: e.significant ? 'rgba(255, 69, 58, 0.1)' : 'transparent' }}>
                                        <td>{e.name}</td>
                                        <td>{new Date(e.date).toLocaleDateString('cs-CZ')}</td>
                                        <td>{e.downtimeHours} h</td>
                                        <td>{e.usersAffectedPercent} %</td>
                                        <td>{e.financialLoss.toLocaleString('cs-CZ')} Kč</td>
                                        <td>
                                            {e.significant ? (
                                                <span style={{ color: '#ff453a', fontWeight: 'bold' }}>🔴 VÝZNAMNÝ INCIDENT</span>
                                            ) : (
                                                <span style={{ color: '#30d158', fontWeight: 'bold' }}>🟢 Interní událost</span>
                                            )}
                                        </td>
                                        <td>
                                            <button className="action-button small" style={{ backgroundColor: 'transparent', color: '#888', border: 'none', padding: 0 }} onClick={() => removeEvent(e.id)}>✖</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p style={{ fontStyle: 'italic', color: '#888', textAlign: 'center', margin: '20px 0' }}>Deník událostí je prázdný.</p>
                    )}
                </div>

                {/* Sekce B a C: Posuzovač a Průvodce (Report Wizard) */}
                {hasSignificantIncident && (
                    <div className="form-group slide-in" style={{ backgroundColor: 'rgba(255, 69, 58, 0.15)', border: '2px solid #ff453a', padding: '20px', borderRadius: '8px', animation: 'pulse-border 2s infinite' }}>
                        <h3 style={{ marginTop: 0, color: '#ff453a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '1.5rem' }}>🚨</span> Průvodce hlášením incidentu NÚKIB
                        </h3>
                        <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                            UPOZORNĚNÍ: Právě jste do evidence zanesli událost, která podle vašich vnitřních prahů naplňuje znaky VÝZNAMNÉHO INCIDENTU.
                        </p>
                        <div style={{ backgroundColor: '#ff453a', color: 'white', padding: '10px', borderRadius: '6px', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold', margin: '15px 0' }}>
                            ⏱️ Od okamžiku zjištění běží lhůta 24 hodin pro podání úvodního hlášení!
                        </div>

                        <p style={{ fontSize: '0.95rem' }}><strong>Okamžité kroky (Checklist):</strong></p>
                        <ul className="checklist" style={{ fontSize: '0.9rem', marginBottom: '15px' }}>
                            <li>Zahajte postupy obnovy definované v Kroku 6.</li>
                            <li>Aktivujte Kontaktní matici (informujte vedení a dodavatele).</li>
                            <li>Přejděte na Portál Národního CERT (cert.cz).</li>
                            <li>Vyplňte počáteční hlášení. Detailnější zprávu můžete dodat do 72 hodin.</li>
                        </ul>

                        <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: '#ff9f0a' }}>
                            Audit Agent automaticky přiloží na konec finálního PDF reportu Prázdný vzor hlášenky ("Emergency plán") pro případ, že nebudete mít přístup k internetu.
                        </p>
                    </div>
                )}

                {!hasSignificantIncident && events.length > 0 && (
                    <div className="form-group" style={{ backgroundColor: 'rgba(48, 209, 88, 0.1)', border: '1px solid #30d158', padding: '15px', borderRadius: '8px' }}>
                        <h3 style={{ marginTop: 0, color: '#30d158' }}>B. Evaluace: V normě</h3>
                        <p style={{ fontSize: '0.9rem', margin: 0 }}>
                            Zaznamenané události nepřekračují nastavené hodnoty významnosti. Udržujte je v interní evidenci, nepodléhají oznamovací povinnosti NÚKIB.
                        </p>
                    </div>
                )}

            </div>

            <div className="step-actions mt-4">
                <button className="action-button primary w-full" onClick={handleNext}>
                    Uložit registr incidentů a pokračovat
                </button>
            </div>

            <style>{`
                @keyframes pulse-border {
                    0% { box-shadow: 0 0 0 0 rgba(255, 69, 58, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(255, 69, 58, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(255, 69, 58, 0); }
                }
                .slide-in {
                    animation: slideIn 0.5s ease-out forwards;
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
