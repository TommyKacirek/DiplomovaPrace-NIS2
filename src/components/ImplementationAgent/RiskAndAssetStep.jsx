import React, { useState } from 'react';

/**
 * RiskAndAssetStep
 * 
 * Step 4: Risk Management Context (§ 3 Decree 410/2025 Sb.)
 * 
 * Section 1: Asset Evidence (Evidence aktiv)
 * - Management of assets with required fields: Name, Type, Criticality, Recovery Priority (§ 4(f) & § 6).
 * 
 * Section 2: Proportionality Questionnaire (Dotazník přiměřenosti)
 * - Business logic questions to determine applicable security measures and proportionality.
 */
export default function RiskAndAssetStep({ onComplete }) {
    // --- Section 1: Asset Evidence State ---
    const [assets, setAssets] = useState([]);
    const [newAsset, setNewAsset] = useState({
        name: '',
        type: 'Primární',
        criticality: 'Nízká', // Default
        recoveryPriority: '4'   // Default: Lowest (4)
    });

    // --- Section 2: Smart Logic State ---
    const [smartLogic, setSmartLogic] = useState({
        hasHighValueIT: false,        // > 300k CZK
        hasHealthOrSafetyImpact: false, // Impact on health/safety
        hasLegacySystems: false       // Use of unsupported tech
    });

    // --- Handlers: Asset Evidence ---
    const handleAddAsset = () => {
        if (!newAsset.name.trim()) return;

        const assetEntry = {
            id: Date.now(),
            ...newAsset
        };

        setAssets([...assets, assetEntry]);
        // Reset form to defaults
        setNewAsset({
            name: '',
            type: 'Primární',
            criticality: 'Nízká',
            recoveryPriority: '4'
        });
    };

    const handleRemoveAsset = (id) => {
        setAssets(assets.filter(a => a.id !== id));
    };

    const handleAssetChange = (field, value) => {
        setNewAsset(prev => ({ ...prev, [field]: value }));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddAsset();
        }
    };

    // --- Handlers: Smart Logic ---
    const handleToggle = (key) => {
        setSmartLogic(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // --- Completion Handler ---
    const handleSaveAndContinue = () => {
        if (onComplete) {
            onComplete({
                step: 4,
                data: {
                    assets: assets,
                    smartLogic: smartLogic
                }
            });
        }
    };

    return (
        <div className="step-container fade-in risk-asset-container">
            <div className="step-header">
                <span className="step-badge">Krok 4</span>
                <h2>Kontext řízení rizik</h2>
                <p className="step-legal-ref">§ 3, § 4(f), § 6 vyhlášky 410/2025 Sb.</p>
                <p className="step-description">
                    Identifikujte svá aktiva a určete jejich kritikalitu a priority obnovy.
                    Odpovězte na otázky přiměřenosti pro nastavení bezpečnostních opatření.
                </p>
            </div>

            {/* --- Section 1: Asset Evidence --- */}
            <section className="step-section">
                <h3>1. Evidence aktiv</h3>
                <p className="section-desc">
                    Zadejte klíčová aktiva. Priorita obnovy určuje pořadí při řešení incidentů (1 = nejvyšší).
                </p>

                <div className="asset-form form-group-sleek">
                    <div className="form-row">
                        <div className="form-col">
                            <label>Název aktiva</label>
                            <input
                                type="text"
                                className="input-sleek"
                                placeholder="Např. DB Zákazníků, ERP, Server..."
                                value={newAsset.name}
                                onChange={(e) => handleAssetChange('name', e.target.value)}
                                onKeyDown={handleKeyPress}
                            />
                        </div>

                        <div className="form-col small">
                            <label>Typ aktiva</label>
                            <select
                                className="input-sleek"
                                value={newAsset.type}
                                onChange={(e) => handleAssetChange('type', e.target.value)}
                            >
                                <option value="Primární">Primární</option>
                                <option value="Podpůrné">Podpůrné</option>
                            </select>
                        </div>

                        <div className="form-col small">
                            <label>Kritikalita</label>
                            <select
                                className="input-sleek"
                                value={newAsset.criticality}
                                onChange={(e) => handleAssetChange('criticality', e.target.value)}
                            >
                                <option value="Nízká">Nízká</option>
                                <option value="Střední">Střední</option>
                                <option value="Vysoká">Vysoká</option>
                                <option value="Kritická">Kritická</option>
                            </select>
                        </div>

                        <div className="form-col small">
                            <label>Priorita obnovy</label>
                            <select
                                className="input-sleek"
                                value={newAsset.recoveryPriority}
                                onChange={(e) => handleAssetChange('recoveryPriority', e.target.value)}
                                title="1 = Nejvyšší priorita (obnovit ihned)"
                            >
                                <option value="1">1 - Nejvyšší</option>
                                <option value="2">2 - Vysoká</option>
                                <option value="3">3 - Střední</option>
                                <option value="4">4 - Nízká</option>
                            </select>
                        </div>

                        <div className="form-col action">
                            <button
                                className="action-button primary small"
                                onClick={handleAddAsset}
                                disabled={!newAsset.name.trim()}
                            >
                                Přidat
                            </button>
                        </div>
                    </div>
                </div>

                {assets.length > 0 ? (
                    <table className="asset-table">
                        <thead>
                            <tr>
                                <th>Název</th>
                                <th>Typ</th>
                                <th>Kritikalita</th>
                                <th>Priorita Obnovy</th>
                                <th>Akce</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assets.map(asset => (
                                <tr key={asset.id}>
                                    <td>{asset.name}</td>
                                    <td>
                                        <span className={`badge-type ${asset.type === 'Primární' ? 'primary' : 'secondary'}`}>
                                            {asset.type}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge-crit crit-${asset.criticality === 'Kritická' ? 4 :
                                                asset.criticality === 'Vysoká' ? 3 :
                                                    asset.criticality === 'Střední' ? 2 : 1
                                            }`}>
                                            {asset.criticality}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <strong>{asset.recoveryPriority}</strong>
                                    </td>
                                    <td>
                                        <button
                                            className="remove-btn"
                                            onClick={() => handleRemoveAsset(asset.id)}
                                        >
                                            ×
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-state-message">
                        Zatím nebyla přidána žádná aktiva.
                    </div>
                )}
            </section>

            {/* --- Section 2: Proportionality Questionnaire --- */}
            <section className="step-section">
                <h3>2. Kalkulačka přiměřenosti (Smart Logic)</h3>
                <p className="section-desc">
                    Odpovězte na otázky pro určení rozsahu bezpečnostních opatření.
                </p>

                <div className="smart-logic-card">
                    {/* Question 1 */}
                    <div className="logic-row">
                        <div className="logic-info">
                            <h4>Přesahuje hodnota vašeho IT vybavení 300 000 Kč?</h4>
                            <p>Pokud NE, aplikuje se princip přiměřenosti pro menší infrastruktury.</p>
                        </div>
                        <div className="logic-toggle">
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={smartLogic.hasHighValueIT}
                                    onChange={() => handleToggle('hasHighValueIT')}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>

                    {/* Question 2 */}
                    <div className="logic-row">
                        <div className="logic-info">
                            <h4>Má výpadek služby přímý dopad na zdraví osob nebo veřejnou bezpečnost?</h4>
                            <p>Pokud ANO, zvyšuje se základní úroveň požadované bezpečnosti (Recovery Priority 1).</p>
                        </div>
                        <div className="logic-toggle">
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={smartLogic.hasHealthOrSafetyImpact}
                                    onChange={() => handleToggle('hasHealthOrSafetyImpact')}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>

                    {/* Question 3 */}
                    <div className="logic-row">
                        <div className="logic-info">
                            <h4>Využíváte pro práci zastaralé technologie (Legacy systémy)?</h4>
                            <p>Systémy bez podpory výrobce vyžadují specifická kompenzační opatření (izolace sítě).</p>
                        </div>
                        <div className="logic-toggle">
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={smartLogic.hasLegacySystems}
                                    onChange={() => handleToggle('hasLegacySystems')}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </section>

            <div className="form-actions-bar">
                <div className="validation-status">
                    {assets.length === 0 && <span className="status-warning">Doporučení: Přidejte alespoň jedno klíčové aktivum.</span>}
                </div>
                <button
                    className="action-button primary"
                    onClick={handleSaveAndContinue}
                >
                    Uložit kontext a přejít na Opatření
                </button>
            </div>
        </div>
    );
}
