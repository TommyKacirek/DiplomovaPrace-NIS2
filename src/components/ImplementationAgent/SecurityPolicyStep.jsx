import React, { useState } from 'react';

/**
 * SecurityPolicyStep
 * 
 * Step 3: Security Policy (§ 2, 3, 4 Decree 410/2025 Sb.)
 * Compliance matrix/checklist for security policy requirements.
 * Generates audit record on Management Approval.
 */
export default function SecurityPolicyStep({ onComplete }) {
    const [checklist, setChecklist] = useState({
        roles_identified: false,
        enforceability: false,
        asset_manipulation: false,
        recovery_priority: false,
        supplier_contracts: false
    });

    const CHECKLIST_ITEMS = [
        { id: 'roles_identified', label: 'Jsou v dokumentu jasně definováni administrátoři a privilegovaní uživatelé?' },
        { id: 'enforceability', label: 'Obsahuje dokument klauzuli o sankcích za porušení pravidel?' },
        { id: 'asset_manipulation', label: 'Jsou popsána pravidla pro používání firemní techniky?' },
        { id: 'recovery_priority', label: 'Je stanoveno, co se obnovuje jako první při výpadku?' },
        { id: 'supplier_contracts', label: 'Obsahuje politika požadavek na revizi smluv s IT dodavateli?' }
    ];

    const handleToggle = (id) => {
        setChecklist(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Check if all items are true
    const isComplete = Object.values(checklist).every(val => val === true);

    const handleApprove = () => {
        if (!isComplete) return;

        const timestamp = new Date().toISOString();
        const auditRecord = {
            action: 'POLICY_APPROVED',
            timestamp: timestamp,
            checklistState: checklist
        };

        if (onComplete) {
            onComplete({
                step: 3,
                data: {
                    auditLog: [auditRecord], // Append to potential existing logs
                    policyApproved: true
                }
            });
        }
    };

    return (
        <div className="step-container fade-in compliance-matrix-container">
            <div className="step-header">
                <span className="step-badge">Krok 3</span>
                <h2>Bezpečnostní politika</h2>
                <p className="step-legal-ref">§ 2, § 3, § 4 vyhlášky 410/2025 Sb.</p>
                <p className="step-description">
                    Ověřte, že vaše bezpečnostní politika obsahuje následující povinné náležitosti.
                </p>
            </div>

            <div className="compliance-matrix">
                {CHECKLIST_ITEMS.map((item) => (
                    <div
                        key={item.id}
                        className={`matrix-row ${checklist[item.id] ? 'checked' : ''}`}
                        onClick={() => handleToggle(item.id)}
                    >
                        <div className="matrix-status">
                            <div className={`checkbox-custom ${checklist[item.id] ? 'active' : ''}`}>
                                {checklist[item.id] && '✓'}
                            </div>
                        </div>
                        <div className="matrix-label">
                            {item.label}
                        </div>
                    </div>
                ))}
            </div>

            <div className="audit-section">
                <div className="audit-info">
                    <p>
                        <strong>Auditní stopa:</strong> Schválením potvrzujete, že tyto body jsou zaneseny v platné dokumentaci organizace.
                        Akce bude zaznamenána s časovým razítkem.
                    </p>
                </div>

                <div className="form-actions-bar">
                    <div className="validation-status">
                        {isComplete ? (
                            <span className="status-valid">✓ Připraveno ke schválení</span>
                        ) : (
                            <span className="status-invalid">Potvrďte všechny body</span>
                        )}
                    </div>
                    <button
                        className="action-button primary"
                        onClick={handleApprove}
                        disabled={!isComplete}
                    >
                        Schválit Bezpečnostní politiku managementem
                    </button>
                </div>
            </div>
        </div>
    );
}
