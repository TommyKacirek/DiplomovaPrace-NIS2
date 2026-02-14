import React, { useState } from 'react';

/**
 * RoleMappingStep
 * 
 * Step 2: Role Mapping (§ 2 Decree 410/2025 Sb.)
 * Allows management to map company roles to legal definitions:
 * - Users
 * - Privileged Users
 * - Administrators
 */
export default function RoleMappingStep({ onComplete }) {
    const [roles, setRoles] = useState({
        users: [],
        privileged: [],
        admins: []
    });

    const [inputValues, setInputValues] = useState({
        users: '',
        privileged: '',
        admins: ''
    });

    const CATEGORIES = [
        { id: 'users', label: 'Uživatelé', desc: 'Běžní uživatelé informačního systému (např. referenti, obchodníci).' },
        { id: 'privileged', label: 'Privilegovaní uživatelé', desc: 'Uživatelé s rozšířenými právy (např. HR, účetní, vedoucí).' },
        { id: 'admins', label: 'Administrátoři', desc: 'Správci systému, IT podpora, externí dodavatelé s přístupem.' }
    ];

    const handleAddRole = (category) => {
        const value = inputValues[category].trim();
        if (value) {
            setRoles(prev => ({
                ...prev,
                [category]: [...prev[category], value]
            }));
            setInputValues(prev => ({
                ...prev,
                [category]: ''
            }));
        }
    };

    const handleRemoveRole = (category, index) => {
        setRoles(prev => ({
            ...prev,
            [category]: prev[category].filter((_, i) => i !== index)
        }));
    };

    const handleKeyPress = (e, category) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddRole(category);
        }
    };

    const handleSave = () => {
        // Generate ISO timestamp for audit
        const timestamp = new Date().toISOString();

        if (onComplete) {
            onComplete({
                step: 2,
                data: {
                    roleMapping: roles,
                    approvedAt: timestamp,
                    action: 'ROLE_MAPPING_LOCKED'
                }
            });
        }
    };

    // Validation: At least one role in 'admins' is usually critical, but let's keep it flexible
    // For strictness, let's require at least one entry in each category to proceed? 
    // Requirement only said "Allows user to add...", but let's assume at least 1 admin is vital.
    const isValid = roles.admins.length > 0;

    return (
        <div className="step-container fade-in role-mapping-container">
            <div className="step-header">
                <span className="step-badge">Krok 2</span>
                <h2>Mapování rolí</h2>
                <p className="step-legal-ref">§ 2 vyhlášky 410/2025 Sb.</p>
                <p className="step-description">
                    Definujte role ve vaší organizaci a přiřaďte je do kategorií dle vyhlášky.
                </p>
            </div>

            <div className="roles-grid">
                {CATEGORIES.map((cat) => (
                    <div key={cat.id} className="role-category-card">
                        <h3>{cat.label}</h3>
                        <p className="role-desc">{cat.desc}</p>

                        <div className="role-input-group">
                            <input
                                type="text"
                                value={inputValues[cat.id]}
                                onChange={(e) => setInputValues({ ...inputValues, [cat.id]: e.target.value })}
                                onKeyDown={(e) => handleKeyPress(e, cat.id)}
                                placeholder="Přidat roli..."
                                className="input-sleek small"
                            />
                            <button
                                className="action-button small"
                                onClick={() => handleAddRole(cat.id)}
                                disabled={!inputValues[cat.id].trim()}
                            >
                                +
                            </button>
                        </div>

                        <ul className="role-list">
                            {roles[cat.id].map((role, idx) => (
                                <li key={idx} className="role-tag">
                                    {role}
                                    <button
                                        className="remove-role-btn"
                                        onClick={() => handleRemoveRole(cat.id, idx)}
                                        aria-label="Odstranit roli"
                                    >
                                        ×
                                    </button>
                                </li>
                            ))}
                            {roles[cat.id].length === 0 && (
                                <li className="role-empty">Žádné role</li>
                            )}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="form-actions-bar">
                <div className="validation-status">
                    {!isValid && <span className="status-invalid">Musíte definovat alespoň jednoho administrátora.</span>}
                </div>
                <button
                    className="action-button primary"
                    onClick={handleSave}
                    disabled={!isValid}
                >
                    Uložit a potvrdit mapování
                </button>
            </div>
        </div>
    );
}
