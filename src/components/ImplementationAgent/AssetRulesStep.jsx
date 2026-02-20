import React, { useState, useEffect } from 'react';

const GLOBAL_POLICIES = [
    { id: 'screen_lock', label: 'Povinné uzamykání obrazovky (Clear Screen)', desc: 'Po 5 minutách nečinnosti.' },
    { id: 'clean_desk', label: 'Pravidlo čistého stolu (Clean Desk)', desc: 'Žádné citlivé dokumenty na stole při odchodu.' },
    { id: 'removable_media', label: 'Zákaz soukromých USB médií', desc: 'Připojování pouze firemních, schválených disků.' },
    { id: 'byod_policy', label: 'Oddělení pracovních a soukromých dat (BYOD)', desc: 'Pokud je povoleno vlastní zařízení, data musí být oddělena.' },
    { id: 'software_install', label: 'Zákaz instalace neschváleného SW', desc: 'Uživatelé nesmí instalovat vlastní programy.' }
];

const ASSET_SPECIFIC_IDEAS = {
    'Server': ['Přístup pouze přes VPN', 'Zakázán přímý root přístup', 'Pravidelné zálohování'],
    'Notebook': ['Šifrování celého disku (BitLocker/FileVault)', 'Zákaz připojování k veřejným Wi-Fi bez VPN'],
    'Mobil': ['Povinný PIN/Biometrie', 'Možnost vzdáleného smazání (MDM)'],
    'Databáze': ['Anonymizace vývojových dat', 'Audit přístupů'],
    'SaaS': ['Povinné MFA', 'Silné heslo']
};

export default function AssetRulesStep({ assets, onComplete }) {
    const [globalRules, setGlobalRules] = useState({});
    const [assetRules, setAssetRules] = useState({});

    // Initialize asset rules structure
    useEffect(() => {
        const initial = {};
        assets.forEach(a => {
            initial[a.id] = [];
        });
        setAssetRules(prev => ({ ...initial, ...prev })); // Merge to keep existing if revising
    }, [assets]);

    const toggleGlobal = (id) => {
        setGlobalRules(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const addRuleToAsset = (assetId, rule) => {
        setAssetRules(prev => ({
            ...prev,
            [assetId]: [...(prev[assetId] || []), rule]
        }));
    };

    const removeRuleFromAsset = (assetId, idx) => {
        setAssetRules(prev => ({
            ...prev,
            [assetId]: prev[assetId].filter((_, i) => i !== idx)
        }));
    };

    const getSuggestions = (assetType) => {
        // Simple mapping based on loose type matching
        const type = Object.keys(ASSET_SPECIFIC_IDEAS).find(k => assetType.toLowerCase().includes(k.toLowerCase())) || 'Notebook';
        return ASSET_SPECIFIC_IDEAS[type] || [];
    };

    const [customRuleInputs, setCustomRuleInputs] = useState({});

    return (
        <div className="step-container fade-in">
            <div className="step-header">
                <span className="step-badge">Krok 3</span>
                <h2>§ 4 Pravidla pro používání aktiv</h2>
                <p className="step-legal-ref">Vyhláška 410/2025 Sb.</p>
                <p className="step-description">Stanovte pravidla chování uživatelů a manipulace s technickými aktivy.</p>
            </div>

            <div className="definition-card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '15px' }}>
                    🏢 A. Globální pravidla (Pro všechny)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    {GLOBAL_POLICIES.map(p => (
                        <div key={p.id}
                            onClick={() => toggleGlobal(p.id)}
                            style={{
                                background: globalRules[p.id] ? 'rgba(50, 215, 75, 0.1)' : 'rgba(255,255,255,0.05)',
                                border: globalRules[p.id] ? '1px solid #32d74b' : '1px solid #333',
                                padding: '15px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <div style={{
                                width: '20px', height: '20px', borderRadius: '4px', border: '1px solid #666', marginRight: '10px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: globalRules[p.id] ? '#32d74b' : 'transparent'
                            }}>
                                {globalRules[p.id] && '✓'}
                            </div>
                            <div>
                                <strong style={{ display: 'block', marginBottom: '4px' }}>{p.label}</strong>
                                <span style={{ fontSize: '0.8rem', color: '#888' }}>{p.desc}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="assets-rules-section">
                <h3 style={{ marginBottom: '15px', paddingLeft: '10px', borderLeft: '3px solid #0071e3' }}>
                    💻 B. Pravidla pro konkrétní aktiva
                </h3>

                {assets.length === 0 && <p style={{ color: '#888' }}>Nemáte definována žádná aktiva. (Vraťte se do kroku 2)</p>}

                {assets.map(asset => (
                    <div key={asset.id} style={{
                        background: '#161618',
                        marginBottom: '15px',
                        borderRadius: '10px',
                        padding: '15px',
                        border: '1px solid #333'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <div>
                                <strong style={{ fontSize: '1.1rem' }}>{asset.name}</strong>
                                <span style={{ marginLeft: '10px', fontSize: '0.8rem', background: '#333', padding: '2px 8px', borderRadius: '4px' }}>{asset.type}</span>
                            </div>
                        </div>

                        {/* Existing rules for this asset */}
                        <div style={{ marginBottom: '10px', paddingLeft: '10px' }}>
                            {assetRules[asset.id]?.length === 0 && <span style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic' }}>Žádná specifická pravidla...</span>}
                            {assetRules[asset.id]?.map((rule, idx) => (
                                <div key={idx} style={{
                                    display: 'flex', justifyContent: 'space-between',
                                    background: 'rgba(255,255,255,0.03)', padding: '5px 10px',
                                    marginBottom: '5px', borderRadius: '4px', fontSize: '0.9rem'
                                }}>
                                    <span>• {rule}</span>
                                    <span
                                        onClick={() => removeRuleFromAsset(asset.id, idx)}
                                        style={{ cursor: 'pointer', color: '#ff453a', marginLeft: '10px' }}
                                    >×</span>
                                </div>
                            ))}
                        </div>

                        {/* Input and suggestions */}
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <input
                                type="text"
                                className="input-sleek small"
                                placeholder="Přidat vlastní pravidlo..."
                                value={customRuleInputs[asset.id] || ''}
                                onChange={e => setCustomRuleInputs({ ...customRuleInputs, [asset.id]: e.target.value })}
                                onKeyPress={e => {
                                    if (e.key === 'Enter' && customRuleInputs[asset.id]) {
                                        addRuleToAsset(asset.id, customRuleInputs[asset.id]);
                                        setCustomRuleInputs({ ...customRuleInputs, [asset.id]: '' });
                                    }
                                }}
                            />
                            <button
                                className="action-button secondary small"
                                onClick={() => {
                                    if (customRuleInputs[asset.id]) {
                                        addRuleToAsset(asset.id, customRuleInputs[asset.id]);
                                        setCustomRuleInputs({ ...customRuleInputs, [asset.id]: '' });
                                    }
                                }}
                            >
                                +
                            </button>
                        </div>

                        {/* Suggestions chips */}
                        <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                            {getSuggestions(asset.type || asset.name).map(sugg => (
                                <span key={sugg}
                                    onClick={() => addRuleToAsset(asset.id, sugg)}
                                    style={{
                                        fontSize: '0.75rem',
                                        background: 'rgba(0, 113, 227, 0.2)',
                                        color: '#4dadff',
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        border: '1px solid rgba(0, 113, 227, 0.4)'
                                    }}
                                >
                                    + {sugg}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="form-actions-bar">
                <button className="action-button primary" onClick={() => onComplete({ globalRules, assetRules })}>Uložit a pokračovat</button>
            </div>
        </div>
    );
}
