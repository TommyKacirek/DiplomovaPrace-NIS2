import React, { useState } from 'react';

const ASSET_INFO = {
    c: {
        title: "Důvěrnost (Confidentiality)",
        desc: "Zajištění, že k informacím mají přístup pouze oprávněné osoby.",
        values: "1 - Nízká: Veřejná data.\n2 - Střední: Interní data.\n3 - Vysoká: GDPR, tajemství."
    },
    i: {
        title: "Integrita (Integrity)",
        desc: "Zajištění správnosti a úplnosti informací a metod jejich zpracování.",
        values: "1 - Nízká: Chyby nevadí.\n2 - Střední: Chyby omezí provoz.\n3 - Vysoká: Chyby jsou kritické."
    },
    a: {
        title: "Dostupnost (Availability)",
        desc: "Zajištění, že autorizovaní uživatelé mají přístup k informacím a aktivům, když je potřebují.",
        values: "1 - Nízká: Výpadek > 24h.\n2 - Střední: Výpadek < 4h.\n3 - Vysoká: Výpadek < 1h."
    }
};

export default function AssetRegistryStep({ onComplete, data }) {
    const [assets, setAssets] = useState(data || []);
    const [newAsset, setNewAsset] = useState({ name: '', type: 'Primární', c: '1', i: '1', a: '1' });

    const addAsset = () => {
        if (!newAsset.name) return;
        setAssets([...assets, { ...newAsset, id: Date.now() }]);
        setNewAsset({ name: '', type: 'Primární', c: '1', i: '1', a: '1' });
    };


    const renderHeaderWithTooltip = (label, infoKey) => (
        <div className="header-cell-content">
            {label}
            <div className="header-info-icon">
                ?
                <div className="header-tooltip">
                    <h4>{ASSET_INFO[infoKey].title}</h4>
                    <p><strong>Definice:</strong> {ASSET_INFO[infoKey].desc}</p>
                    <p className="tooltip-values"><strong>Hodnocení dopadu:</strong><br />{ASSET_INFO[infoKey].values}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="step-container fade-in">
            <div className="step-header">
                <span className="step-badge">Krok 2</span>
                <h2>§ 3 Evidence aktiv a hodnocení dopadů</h2>
                <p className="step-legal-ref">Metodika NÚKIB: Přiměřenost</p>
                <p className="step-description">Identifikujte klíčové služby a systémy. Ohodnoťte dopad jejich narušení z pohledu bezpečnosti.</p>
            </div>

            <div className="definition-card" style={{ marginBottom: '2rem' }}>
                <div className="def-inputs" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '10px', alignItems: 'end' }}>

                    <div className="input-group">
                        <label className="input-label">Název aktiva</label>
                        <input type="text" placeholder="Např. DB Zákazníků, Email..." value={newAsset.name}
                            onChange={e => setNewAsset({ ...newAsset, name: e.target.value })} className="input-sleek" />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Typ</label>
                        <select value={newAsset.type} onChange={e => setNewAsset({ ...newAsset, type: e.target.value })} className="input-sleek">
                            <option value="Primární">Primární</option>
                            <option value="Podpůrné">Podpůrné</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label className="input-label" title="Důvěrnost">Důvěrnost</label>
                        <select value={newAsset.c} onChange={e => setNewAsset({ ...newAsset, c: e.target.value })} className="input-sleek">
                            <option value="1">1 - Nízká</option>
                            <option value="2">2 - Střední</option>
                            <option value="3">3 - Vysoká</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label className="input-label" title="Integrita">Integrita</label>
                        <select value={newAsset.i} onChange={e => setNewAsset({ ...newAsset, i: e.target.value })} className="input-sleek">
                            <option value="1">1 - Nízká</option>
                            <option value="2">2 - Střední</option>
                            <option value="3">3 - Vysoká</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label className="input-label" title="Dostupnost">Dostupnost</label>
                        <select value={newAsset.a} onChange={e => setNewAsset({ ...newAsset, a: e.target.value })} className="input-sleek">
                            <option value="1">1 - Nízká</option>
                            <option value="2">2 - Střední</option>
                            <option value="3">3 - Vysoká</option>
                        </select>
                    </div>

                </div>
                <button className="action-button primary" style={{ marginTop: '1rem', width: '100%' }} onClick={addAsset}>+ Přidat do evidence</button>
            </div>

            <table className="nis2-official-table">
                <thead>
                    <tr>
                        <th style={{ width: '30%' }}>Aktivum</th>
                        <th style={{ width: '15%' }}>Typ</th>
                        <th>{renderHeaderWithTooltip('Důvěrnost', 'c')}</th>
                        <th>{renderHeaderWithTooltip('Integrita', 'i')}</th>
                        <th>{renderHeaderWithTooltip('Dostupnost', 'a')}</th>
                        <th style={{ width: '10%' }}>Akce</th>
                    </tr>
                </thead>
                <tbody>
                    {assets.map(a => (
                        <tr key={a.id}>
                            <td><strong>{a.name}</strong></td>
                            <td>{a.type}</td>
                            <td style={{ color: a.c === '3' ? '#ff453a' : '#32d74b', fontWeight: 'bold' }}>{a.c}</td>
                            <td style={{ color: a.i === '3' ? '#ff453a' : '#32d74b', fontWeight: 'bold' }}>{a.i}</td>
                            <td style={{ color: a.a === '3' ? '#ff453a' : '#32d74b', fontWeight: 'bold' }}>{a.a}</td>
                            <td><button onClick={() => setAssets(assets.filter(x => x.id !== a.id))} className="btn-icon-back" style={{ fontSize: '0.8rem' }}>Smazat</button></td>
                        </tr>
                    ))}
                    {assets.length === 0 && (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center', color: '#666', padding: '20px' }}>Zatím žádná aktiva. Přidejte první aktivum výše.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="form-actions-bar">
                <button className="action-button primary" onClick={() => onComplete({ assets })}>Uložit a pokračovat</button>
            </div>
        </div>
    );
}
