import React, { useState, useEffect } from 'react';
import './ImplementationModule.css';

export default function ContinuityBackupStep({ governanceData, onComplete, data }) {
    // A. Technické postupy obnovy (načteno z prioritizovaných aktiv)
    const [recoveryProcedures, setRecoveryProcedures] = useState(data?.recoveryProcedures || []);

    // Inicializace z předchozího kroku (governance)
    useEffect(() => {
        if (governanceData && governanceData.prioritizedAssets && !data?.recoveryProcedures) {
            // Pouze ta, co uživatel/vedení reálně přidalo do BIA
            setRecoveryProcedures(governanceData.prioritizedAssets.map(a => ({
                id: a.id,
                name: a.name,
                type: a.type,
                procedure: ''
            })));
        }
    }, [governanceData, data?.recoveryProcedures]);

    const handleProcedureChange = (id, text) => {
        setRecoveryProcedures(prev => prev.map(p => p.id === id ? { ...p, procedure: text } : p));
    };

    // B. Evidenční list zálohovacího schématu
    const [backupScheme, setBackupScheme] = useState(data?.backupScheme || {
        scope: '',
        frequency: 'Denní',
        hasOfflineCopy: false,
        lastTestDate: ''
    });

    // C. Kontaktní matice
    const [contacts, setContacts] = useState(data?.contacts || []);
    const [newContact, setNewContact] = useState({ role: '', organization: '', contactInfo: '' });

    const addContact = () => {
        if (!newContact.role || !newContact.contactInfo) return;
        setContacts([...contacts, { ...newContact, id: Date.now() }]);
        setNewContact({ role: '', organization: '', contactInfo: '' });
    };

    const removeContact = (id) => {
        setContacts(contacts.filter(c => c.id !== id));
    };

    const isNextEnabled = () => {
        // Obnova: alespoň něco musí být vyplněno u každého aktiva
        const allProceduresFilled = recoveryProcedures.every(p => p.procedure.trim().length > 0);
        // Zálohy: rozsah, test a offline kopie
        const backupFilled = backupScheme.scope.trim().length > 0 && backupScheme.lastTestDate && backupScheme.hasOfflineCopy;
        // Kontakty: aspoň 1 kontakt
        const hasContacts = contacts.length > 0;

        // Pokud nejsou prioritizovaná aktiva, stačí zbytek
        if (recoveryProcedures.length === 0) return backupFilled && hasContacts;

        return allProceduresFilled && backupFilled && hasContacts;
    };

    const handleNext = () => {
        onComplete({
            recoveryProcedures,
            backupScheme,
            contacts
        });
    };

    return (
        <div className="glass-panel fade-in">
            <h2>Řízení kontinuity a zálohování (§ 6)</h2>
            <p className="step-description">
                Tato sekce mapuje krizové procesy, aby organizace v případě incidentu věděla <strong>KDO</strong> má volat, <strong>JAK</strong> má nahrazovat výpadky a ze <strong>ZKUŠENOSTI</strong> (testů) ověřila, že obnova funguje.
            </p>

            <div className="step-content">

                {/* Sekce A: Technické postupy obnovy */}
                <div className="form-group" style={{ border: '1px solid rgba(48, 209, 88, 0.5)', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ marginTop: 0, color: '#30d158' }}>A. Očekávané postupy krizové obnovy BIA (Návaznost na prioritu Vedení)</h3>
                    <p style={{ fontSize: '0.9rem', marginBottom: '15px' }}>
                        Zde jsou Vedením definovaná kritická aktiva v poskládaném pořadí důležitosti. Nyní musí IT formálně stanovit stručný technický postup, <strong>jak</strong> přesně bude dané aktivum po kolapsu zachráněno.
                    </p>

                    {recoveryProcedures.length === 0 ? (
                        <div className="info-box yellow">Vedení nestanovilo v Kroku 4 žádná kritická aktiva k obnově.</div>
                    ) : (
                        recoveryProcedures.map((proc, index) => (
                            <div key={proc.id} style={{ marginBottom: '15px', backgroundColor: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '6px' }}>
                                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                                    {index + 1}. {proc.name} <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: '#888' }}>({proc.type})</span>
                                </label>
                                <textarea
                                    className="form-control"
                                    rows="2"
                                    placeholder="Např. Nahodit instanci z offline Veeam snapshotu, zkontrolovat integritu databází..."
                                    value={proc.procedure}
                                    onChange={(e) => handleProcedureChange(proc.id, e.target.value)}
                                    style={{ width: '100%', resize: 'vertical' }}
                                />
                            </div>
                        ))
                    )}
                </div>

                {/* Sekce B: Zálohovací schéma */}
                <div className="form-group" style={{ border: '1px solid rgba(10, 132, 255, 0.5)', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ marginTop: 0, color: '#0a84ff' }}>B. Zálohovací schéma a kontrola PDCA</h3>
                    <p style={{ fontSize: '0.9rem', marginBottom: '15px' }}>
                        Vyhláška očekává reálnou garanci nedotknutelnosti dat.
                    </p>

                    <div style={{ marginBottom: '10px' }}>
                        <label>Předmět a rozsah zálohování (Co zálohujeme?)</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Např. Veškeré provozní databáze, file servery a konfigurace sítě..."
                            value={backupScheme.scope}
                            onChange={(e) => setBackupScheme({ ...backupScheme, scope: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1 1 200px' }}>
                            <label>Četnost záloh (RPO)</label>
                            <select
                                className="form-control"
                                value={backupScheme.frequency}
                                onChange={(e) => setBackupScheme({ ...backupScheme, frequency: e.target.value })}
                            >
                                <option>Hodinová</option>
                                <option>Denní</option>
                                <option>Týdenní</option>
                                <option>Měsíční</option>
                            </select>
                        </div>
                        <div style={{ flex: '1 1 200px' }}>
                            <label>Datum posledního úspěšného testu obnovy</label>
                            <input
                                type="date"
                                className="form-control"
                                value={backupScheme.lastTestDate}
                                onChange={(e) => setBackupScheme({ ...backupScheme, lastTestDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={{ padding: '10px', backgroundColor: backupScheme.hasOfflineCopy ? 'rgba(48, 209, 88, 0.1)' : 'rgba(255, 69, 58, 0.1)', borderLeft: `3px solid ${backupScheme.hasOfflineCopy ? '#30d158' : '#ff453a'}`, borderRadius: '4px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', margin: 0 }}>
                            <input
                                type="checkbox"
                                checked={backupScheme.hasOfflineCopy}
                                onChange={(e) => setBackupScheme({ ...backupScheme, hasOfflineCopy: e.target.checked })}
                                style={{ width: '18px', height: '18px' }}
                            />
                            <span style={{ fontSize: '0.95rem', fontWeight: backupScheme.hasOfflineCopy ? 'normal' : 'bold', color: backupScheme.hasOfflineCopy ? 'inherit' : '#ff453a' }}>
                                Aplikujeme pravidlo 3-2-1 a minimálně jedna kopie záloh je uložena <strong>offline a offsite</strong> (ochrana proti ransomwaru).
                            </span>
                        </label>
                    </div>
                </div>

                {/* Sekce C: Kontaktní matice */}
                <div className="form-group" style={{ border: '1px solid rgba(255, 159, 10, 0.5)', padding: '15px', borderRadius: '8px' }}>
                    <h3 style={{ marginTop: 0, color: '#ff9f0a' }}>C. Kontaktní matice pro krizové řízení (Mimo IT struktury)</h3>
                    <p style={{ fontSize: '0.9rem', marginBottom: '15px' }}>
                        Během incidentu nelze spoléhat na Active Directory. Vyplňte klíčové osoby (manažery, mluvčí, NÚKIB CSIRT, dodavatele), bez kterých se incident legislativně a reputačně nezvládne.
                    </p>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', marginBottom: '15px', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1 1 150px' }}>
                            <label style={{ fontSize: '0.8rem' }}>Role v krizi</label>
                            <input type="text" className="form-control" value={newContact.role} onChange={e => setNewContact({ ...newContact, role: e.target.value })} placeholder="Např. Dodavatel sítě" />
                        </div>
                        <div style={{ flex: '1 1 150px' }}>
                            <label style={{ fontSize: '0.8rem' }}>Organizace / Osoba</label>
                            <input type="text" className="form-control" value={newContact.organization} onChange={e => setNewContact({ ...newContact, organization: e.target.value })} placeholder="Cisco / Jan Novák" />
                        </div>
                        <div style={{ flex: '1 1 200px' }}>
                            <label style={{ fontSize: '0.8rem' }}>Nouzový kontakt (Tel/Email)</label>
                            <input type="text" className="form-control" value={newContact.contactInfo} onChange={e => setNewContact({ ...newContact, contactInfo: e.target.value })} placeholder="Tel: 777 666 555" />
                        </div>
                        <div style={{ flex: '0 0 100px' }}>
                            <button className="action-button secondary w-full" onClick={addContact} disabled={!newContact.role || !newContact.contactInfo}>Přidat</button>
                        </div>
                    </div>

                    {contacts.length > 0 ? (
                        <table className="nis2-official-table" style={{ fontSize: '0.9rem' }}>
                            <thead>
                                <tr>
                                    <th>Role</th>
                                    <th>Organizace / Osoba</th>
                                    <th>Kontakt</th>
                                    <th>Akce</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contacts.map(c => (
                                    <tr key={c.id}>
                                        <td>{c.role}</td>
                                        <td>{c.organization}</td>
                                        <td>{c.contactInfo}</td>
                                        <td>
                                            <button className="action-button small" style={{ backgroundColor: 'transparent', color: '#ff453a', border: 'none', padding: 0 }} onClick={() => removeContact(c.id)}>Odstranit</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p style={{ fontStyle: 'italic', color: '#888', textAlign: 'center' }}>Nebyl přidán žádný nouzový kontakt.</p>
                    )}
                </div>

            </div>

            <div className="step-actions mt-4">
                <button
                    className={`action-button primary w-full`}
                    onClick={handleNext}
                >
                    Zapsat plány obnovy a pokračovat
                </button>
            </div>
            {!isNextEnabled() && (
                <div style={{ textAlign: 'center', marginTop: '10px', color: '#ff453a', fontSize: '0.9rem' }}>
                    Pro skutečný report vyplňte postupy pro všechna aktiva, potvrďte offline zálohování s datem testu a přidejte alespoň 1 kontakt.
                </div>
            )}
        </div>
    );
}
