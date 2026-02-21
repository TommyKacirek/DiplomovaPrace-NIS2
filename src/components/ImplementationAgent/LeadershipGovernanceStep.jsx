import React, { useState, useEffect } from 'react';
import './ImplementationModule.css';

export default function LeadershipGovernanceStep({ onComplete, assets, data }) {
    const [managerName, setManagerName] = useState(data?.manager?.name || '');
    const [managerQualification, setManagerQualification] = useState(data?.manager?.qualification || '');
    const [managerMandate, setManagerMandate] = useState(data?.manager?.mandateGranted || false);

    const [trainingDate, setTrainingDate] = useState(data?.training?.date || '');
    const [trainingAck, setTrainingAck] = useState(data?.training?.acknowledged || false);

    const [prioritizedAssets, setPrioritizedAssets] = useState(data?.prioritizedAssets || []);

    const [resourcesPledged, setResourcesPledged] = useState(data?.resourcesPledged || false);
    const [showResourceWarning, setShowResourceWarning] = useState(false);

    // Initialize prioritized assets from the assets prop
    useEffect(() => {
        if (assets && assets.length > 0 && prioritizedAssets.length === 0) {
            setPrioritizedAssets([...assets]);
        }
    }, [assets, prioritizedAssets.length]);

    const handleDragStart = (e, index) => {
        e.dataTransfer.setData('draggedIndex', index);
    };

    const handleDrop = (e, index) => {
        const draggedIndex = e.dataTransfer.getData('draggedIndex');
        if (draggedIndex === null || draggedIndex === undefined) return;

        const newAssets = [...prioritizedAssets];
        const [draggedItem] = newAssets.splice(draggedIndex, 1);
        newAssets.splice(index, 0, draggedItem);
        setPrioritizedAssets(newAssets);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleNext = () => {
        const payloadData = {
            manager: {
                name: managerName,
                qualification: managerQualification,
                mandateGranted: managerMandate
            },
            training: {
                date: trainingDate,
                acknowledged: trainingAck
            },
            prioritizedAssets: prioritizedAssets,
            resourcesPledged: resourcesPledged
        };

        if (!managerName || !managerQualification || !managerMandate) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => alert('Upozornění: Pro reálný reporting (krok 10) vyplňte prosím všechny údaje o Manažerovi kybernetické bezpečnosti (Sekce A).'), 100);
        } else if (!trainingDate || !trainingAck) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => alert('Upozornění: Pro reálný reporting vyplňte prosím údaje o školení vrcholného vedení (Sekce B).'), 100);
        } else if (!resourcesPledged) {
            setShowResourceWarning(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => alert('Upozornění: Pro reálný reporting je nutné formálně zajistit poskytnutí zdrojů (Sekce D).'), 100);
        }

        onComplete(payloadData);
    };

    return (
        <div className="glass-panel fade-in">
            <h2>Leadership & Governance (§ 4)</h2>
            <p className="step-description">
                Vrcholné vedení nese odpovědnost za kybernetickou bezpečnost. Neanonymizujte odpovědnost.
                Tento krok vyžaduje formální aktivitu a schválení přímo od statutárního orgánu.
            </p>

            <div className="step-content">

                {/* Secka A: Manažer KB */}
                <div className="form-group" style={{ border: '1px solid #32d74b', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ marginTop: 0, color: '#32d74b' }}>A. Odbornost role Manažera KB (§ 4 písm. a)</h3>
                    <label>Jméno jmenovaného manažera KB</label>
                    <input
                        type="text"
                        className="form-control"
                        value={managerName}
                        onChange={e => setManagerName(e.target.value)}
                        placeholder="Ing. Jan Novák"
                    />

                    <label style={{ marginTop: '10px' }}>Způsob doložení odbornosti</label>
                    <div className="radio-group" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                        <label>
                            <input
                                type="radio"
                                name="qualification"
                                value="certificate"
                                checked={managerQualification === 'certificate'}
                                onChange={e => setManagerQualification(e.target.value)}
                            />
                            Doloženo certifikátem/diplomem (ISMS, CISM, atd.)
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="qualification"
                                value="declaration"
                                checked={managerQualification === 'declaration'}
                                onChange={e => setManagerQualification(e.target.value)}
                            />
                            Čestné prohlášení o adekvátní praxi a znalostech
                        </label>
                        {managerQualification === 'declaration' && (
                            <div style={{ padding: '10px', backgroundColor: 'rgba(255, 149, 0, 0.1)', borderLeft: '3px solid #ff9500', fontSize: '0.9rem', marginTop: '5px' }}>
                                ⚠️ Upozornění: Prokazování odborné znalosti musí být zpětně doložitelné při kontrole NÚKIB.
                            </div>
                        )}
                    </div>

                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '20px', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={managerMandate}
                            onChange={e => setManagerMandate(e.target.checked)}
                            style={{ marginTop: '4px' }}
                        />
                        <span>
                            Potvrzuji, že této osobě byly výslovně <strong>svěřeny pravomoci</strong> dohlížet na stav kybernetické bezpečnosti
                            a reportovat přímo statutárnímu orgánu.
                        </span>
                    </label>
                </div>

                {/* Sekce B: Školení vedení */}
                <div className="form-group" style={{ border: '1px solid rgba(191, 90, 242, 0.5)', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ marginTop: 0, color: '#bf5af2' }}>B. Školení vedení (§ 4 písm. b)</h3>
                    <p style={{ fontSize: '0.9rem' }}>Doporučujeme absolvovat bezplatný kurz NÚKIB "Dávej kyber!". Certifikát pečlivě uschovejte pro případný audit.</p>
                    <a href="https://osveta.nukib.cz/" target="_blank" rel="noopener noreferrer" className="action-button secondary small" style={{ display: 'inline-block', marginBottom: '15px' }}>
                        🔗 Otevřít kurz "Dávej kyber!"
                    </a>

                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '15px' }}>
                        <div style={{ flex: 1 }}>
                            <label>Datum absolvování školení statutárních orgánů</label>
                            <input
                                type="date"
                                className="form-control"
                                value={trainingDate}
                                onChange={e => setTrainingDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={trainingAck}
                            onChange={e => setTrainingAck(e.target.checked)}
                            style={{ marginTop: '4px' }}
                        />
                        <span>Potvrzuji prokazatelné seznámení se s hrozbami, riziky a právními povinnostmi vyplývajícími ze ZoKB pro naši organizaci. Archivační povinnost doložení tohoto úkonu činí 4 roky.</span>
                    </label>
                </div>

                {/* Sekce C: Prioritizace Aktiv */}
                <div className="form-group" style={{ border: '1px solid rgba(10, 132, 255, 0.5)', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ marginTop: 0, color: '#0a84ff' }}>C. Manažerská prioritizace aktiv (BIA/RTO) (§ 4 písm. f)</h3>
                    <p style={{ fontSize: '0.9rem', marginBottom: '15px' }}>
                        Seřaďte (táhni a pusť) evidovaná aktiva podle jejich kritičnosti pro přežití podniku.
                        Tímto statutární orgán přebírá odpovědnost za priority případné obnovy provozu po incidentu.
                        Nejdůležitější aktiva umístěte nahoře (1. = nejvyšší priorita obnovy).
                    </p>

                    {prioritizedAssets.length === 0 ? (
                        <p style={{ fontStyle: 'italic', color: '#888' }}>Žádná aktiva nebyla v předchozím kroku evidována.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {prioritizedAssets.map((asset, index) => (
                                <div
                                    key={asset.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDrop={(e) => handleDrop(e, index)}
                                    onDragOver={handleDragOver}
                                    style={{
                                        padding: '10px 15px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid #333',
                                        borderRadius: '4px',
                                        cursor: 'grab',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '15px'
                                    }}
                                >
                                    <span style={{ fontWeight: 'bold', minWidth: '25px', color: '#0a84ff' }}>{index + 1}.</span>
                                    <span style={{ fontSize: '1.2rem', cursor: 'move' }}>☰</span>
                                    <div style={{ flex: 1 }}>
                                        <strong>{asset.name}</strong> <span style={{ color: '#888', fontSize: '0.8rem' }}>({asset.type})</span>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#aaa' }}>
                                        C:{asset.c} I:{asset.i} A:{asset.a}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sekce D: Zdroje */}
                <div className="form-group" style={{ border: '1px solid rgba(255, 69, 58, 0.5)', padding: '15px', borderRadius: '8px' }}>
                    <h3 style={{ marginTop: 0, color: '#ff453a' }}>D. Deklarace zdrojů (§ 4 písm. c)</h3>

                    {showResourceWarning && (
                        <div style={{ padding: '10px', backgroundColor: 'rgba(255, 69, 58, 0.2)', borderLeft: '3px solid #ff453a', borderRadius: '4px', marginBottom: '15px' }}>
                            <strong>Odmítnutí compliance: </strong>
                            Profil přiměřenosti nemůže znamenat nulový rozpočet. Pokud statutární orgán nezajistí potřebné zdroje, nachází se organizace v rozporu s vyhláškou. Tento krok je neopominutelný.
                        </div>
                    )}

                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', padding: '10px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '4px' }}>
                        <input
                            type="checkbox"
                            checked={resourcesPledged}
                            onChange={e => { setResourcesPledged(e.target.checked); setShowResourceWarning(false); }}
                            style={{ marginTop: '4px', width: '20px', height: '20px' }}
                        />
                        <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                            Jako statutární orgán se tímto formálně zavazuji k alokaci dostatečných finančních a personálních kapacit
                            pro implementaci a provoz bezpečnostních opatření v souladu se závěrečným přehledem.
                        </span>
                    </label>
                </div>

            </div>

            <div className="step-actions">
                <button className="action-button primary w-full" onClick={handleNext}>
                    Zapsat a přistoupit k hodnocení opatření
                </button>
            </div>
        </div>
    );
}
