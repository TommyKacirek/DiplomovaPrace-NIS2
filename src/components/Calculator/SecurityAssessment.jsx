import React, { useState, useEffect } from 'react';
import './SecurityAssessment.css';

// --- DATA PRO REŽIM NIŽŠÍCH POVINNOSTÍ (Vyhláška 410/2025 Sb.) ---
const MEASURES_LOWER_410 = [
    {
        id: 'low-system',
        title: '§ 3 Systém a evidence opatření',
        description: 'Máte zaveden systém minimální kybernetické bezpečnosti a vedete přehled opatření (zavedená/plánovaná/nezavedená) podle přílohy č. 1?',
        priority: 'high',
        priorityLabel: 'Klíčové',
        article: '§ 3 Vyhl. 410/2025'
    },
    {
        id: 'low-management',
        title: '§ 4 Požadavky na vedení',
        description: 'Má vrcholné vedení stanovenou odpovědnost za KB? Je jmenována osoba pověřená kybernetickou bezpečností a jsou zajištěny zdroje?',
        priority: 'high',
        priorityLabel: 'Manažerské',
        article: '§ 4 Vyhl. 410/2025'
    },
    {
        id: 'low-hr',
        title: '§ 5 Bezpečnost lidských zdrojů',
        description: 'Máte politiku bezpečného chování? Probíhá pravidelné školení uživatelů i vedení a existuje proces pro nástupy/odchody?',
        priority: 'medium',
        priorityLabel: 'Personální',
        article: '§ 5 Vyhl. 410/2025'
    },
    {
        id: 'low-bcm',
        title: '§ 6 Řízení kontinuity činností',
        description: 'Máte stanoveny priority obnovy aktiv? Jsou určeny odpovědnosti za obnovu a provádí se pravidelné zálohování?',
        priority: 'medium',
        priorityLabel: 'Provozní',
        article: '§ 6 Vyhl. 410/2025'
    },
    {
        id: 'low-access',
        title: '§ 7 Řízení přístupu',
        description: 'Řídíte přístupová práva (need-to-know)? Jsou odděleny uživatelské a administrátorské účty a pravidelně přezkoumávány?',
        priority: 'high',
        priorityLabel: 'Kritické',
        article: '§ 7 Vyhl. 410/2025'
    },
    {
        id: 'low-identity',
        title: '§ 8 Řízení identit a oprávnění',
        description: 'Používáte bezpečnou autentizaci (min. délka hesla, ochrana proti hádání)? Jsou privilegované účty chráněny?',
        priority: 'high',
        priorityLabel: 'Technické',
        article: '§ 8 Vyhl. 410/2025'
    },
    {
        id: 'low-detection',
        title: '§ 9 Detekce a logování',
        description: 'Monitorujete sítě a chráníte koncová zařízení (antivir/EDR)? Jsou logy zaznamenávány a chráněny?',
        priority: 'medium',
        priorityLabel: 'Detekční',
        article: '§ 9 Vyhl. 410/2025'
    },
    {
        id: 'low-incidents',
        title: '§ 10 Řešení incidentů',
        description: 'Máte proces pro hlášení a řešení incidentů? Jsou definovány role, eskalace a způsob hlášení incidentů?',
        priority: 'high',
        priorityLabel: 'Reakční',
        article: '§ 10 Vyhl. 410/2025'
    },
    {
        id: 'low-network',
        title: '§ 11 Bezpečnost sítí',
        description: 'Je síť segmentovaná a řízená (firewall, deny-by-default)? Je vzdálený přístup zabezpečen (VPN, šifrování)?',
        priority: 'high',
        priorityLabel: 'Technické',
        article: '§ 11 Vyhl. 410/2025'
    },
    {
        id: 'low-appsec',
        title: '§ 12 Aplikační bezpečnost',
        description: 'Řídíte zranitelnosti a aplikujete záplaty (patch management)? Jsou řešeny nepodporované (legacy) systémy?',
        priority: 'medium',
        priorityLabel: 'Technické',
        article: '§ 12 Vyhl. 410/2025'
    },
    {
        id: 'low-crypto',
        title: '§ 13 Kryptografické algoritmy',
        description: 'Používáte bezpečné šifrovací algoritmy a spravujete klíče? Je zajištěna šifrovaná komunikace (včetně e-mailu)?',
        priority: 'medium',
        priorityLabel: 'Technické',
        article: '§ 13 Vyhl. 410/2025'
    },
    {
        id: 'low-impact',
        title: '§ 14 Významnost dopadu',
        description: 'Máte metodiku pro určení, zda má incident významný dopad (únosná míra újmy, kritéria dopadu)?',
        priority: 'medium',
        priorityLabel: 'Procesní',
        article: '§ 14 Vyhl. 410/2025'
    }
];

// --- DATA PRO REŽIM VYŠŠÍCH POVINNOSTÍ (Vyhláška 409/2025 Sb.) ---
const MEASURES_HIGHER_409 = [
    {
        id: 'high-isms',
        title: 'Systém řízení bezpečnosti (ISMS)',
        description: 'Máte komplexní dokumentovaný systém řízení bezpečnosti informací (politiky, směrnice)?',
        priority: 'high',
        priorityLabel: 'Kritické',
        article: '§ 3-4 Vyhl. 409/2025'
    },
    {
        id: 'high-audit',
        title: 'Bezpečnostní audity a kontroly',
        description: 'Provádíte pravidelné audity kybernetické bezpečnosti a penetrační testy?',
        priority: 'medium',
        priorityLabel: 'Kontrolní',
        article: '§ 6 Vyhl. 409/2025'
    },
    {
        id: 'high-supply',
        title: 'Bezpečnost dodavatelského řetězce',
        description: 'Uplatňujete bezpečnostní požadavky ve smlouvách s dodavateli a kontrolujete jejich plnění?',
        priority: 'high',
        priorityLabel: 'Vysoká priorita',
        article: '§ 8 Vyhl. 409/2025'
    },
    {
        id: 'high-hr',
        title: 'Bezpečnost lidských zdrojů',
        description: 'Provádíte bezpečnostní prověrky zaměstnanců a pravidelná pokročilá školení?',
        priority: 'medium',
        priorityLabel: 'Personální',
        article: '§ 9 Vyhl. 409/2025'
    },
    {
        id: 'high-mfa',
        title: 'Vícefaktorová autentizace (MFA)',
        description: 'Je striktně vyžadována MFA pro vzdálený přístup a privilegované účty?',
        priority: 'high',
        priorityLabel: 'Kritické',
        article: '§ 11 Vyhl. 409/2025'
    },
    {
        id: 'high-crypto',
        title: 'Kryptografická ochrana',
        description: 'Používáte silné šifrování pro data v klidu i při přenosu a spravujete bezpečně klíče?',
        priority: 'medium',
        priorityLabel: 'Technické',
        article: '§ 12 Vyhl. 409/2025'
    },
    {
        id: 'high-physical',
        title: 'Fyzická a environmentální bezpečnost',
        description: 'Máte definované zabezpečené oblasti, perimetry a ochranu před výpadky napájení?',
        priority: 'medium',
        priorityLabel: 'Fyzické',
        article: '§ 13 Vyhl. 409/2025'
    },
    {
        id: 'high-dev',
        title: 'Bezpečný vývoj a údržba',
        description: 'Aplikujete principy Secure by Design a Secure by Default při vývoji a změnách systémů?',
        priority: 'high',
        priorityLabel: 'Technické',
        article: '§ 16 Vyhl. 409/2025'
    },
    {
        id: 'high-incidents-complex',
        title: 'Komplexní zvládání incidentů',
        description: 'Máte nástroje pro automatizovanou detekci incidentů (SIEM/SOC) a tým reakce?',
        priority: 'high',
        priorityLabel: 'Reakční',
        article: '§ 20-22 Vyhl. 409/2025'
    },
    {
        id: 'high-crisis',
        title: 'Krizové řízení a obnova',
        description: 'Máte plány kontinuity činností (BCP) a havarijní plány pravidelně testované cvičeními?',
        priority: 'high',
        priorityLabel: 'Kritické',
        article: '§ 23-25 Vyhl. 409/2025'
    }
];

export default function SecurityAssessment({ complianceLevel, onBack, onNext }) {
    const [responses, setResponses] = useState({});
    const [activeMeasures, setActiveMeasures] = useState([]);

    useEffect(() => {
        if (complianceLevel === 'higher') {
            setActiveMeasures(MEASURES_HIGHER_409);
        } else {
            setActiveMeasures(MEASURES_LOWER_410);
        }
        setResponses({});
    }, [complianceLevel]);

    const handleToggle = (measureId) => {
        setResponses(prev => ({
            ...prev,
            [measureId]: !prev[measureId]
        }));
    };

    const getCompletionPercentage = () => {
        if (activeMeasures.length === 0) return 0;
        const completed = Object.values(responses).filter(Boolean).length;
        return Math.round((completed / activeMeasures.length) * 100);
    };

    const getStatusMessage = () => {
        const percentage = getCompletionPercentage();
        if (percentage >= 85) return { text: 'Výborné!', color: '#4caf50', label: 'Vysoká shoda' };
        if (percentage >= 60) return { text: 'Dobré', color: '#ff9800', label: 'Částečná shoda' };
        if (percentage >= 30) return { text: 'Nedostatečné', color: '#f44336', label: 'Nízká úroveň' };
        return { text: 'Kritické', color: '#d32f2f', label: 'Kritický stav' };
    };

    const handleNext = () => {
        if (onNext) {
            const implementedMeasures = {};

            activeMeasures.forEach(measure => {
                if (responses[measure.id]) {
                    implementedMeasures[measure.title] = {
                        implemented: true,
                        article: measure.article
                    };
                }
            });

            onNext({
                securityStatus: implementedMeasures
            });
        }
    };

    const statusMessage = getStatusMessage();
    const implementedCount = Object.values(responses).filter(Boolean).length;
    const decreeName = complianceLevel === 'higher' ? 'Vyhlášky 409/2025 Sb.' : 'Vyhlášky 410/2025 Sb.';

    return (
        <div className="fancy-gradient">
            <div className="assessment-header">
                <h2>🔒 Hodnocení bezpečnostních opatření</h2>
                <p className="assessment-subtitle">
                    Zaškrtněte opatření, která vaše organizace již má implementována podle <strong>{decreeName}</strong>
                    {complianceLevel !== 'higher' && ' (Kompletní checklist podle § 3 až § 14).'}
                </p>
            </div>

            <div className="progress-section">
                <div className="progress-stats">
                    <div className="stat-item">
                        <span className="stat-number">{implementedCount}</span>
                        <span className="stat-label">z {activeMeasures.length} implementováno</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <span className="stat-number" style={{ color: statusMessage.color }}>
                            {getCompletionPercentage()}%
                        </span>
                        <span className="stat-label">{statusMessage.label}</span>
                    </div>
                </div>

                <div className="progress-bar-wrapper">
                    <div
                        className="progress-bar-fill"
                        style={{
                            width: `${getCompletionPercentage()}%`,
                            backgroundColor: statusMessage.color
                        }}
                    >
                        <span className="progress-label">{statusMessage.text}</span>
                    </div>
                </div>
            </div>

            <div className="measures-grid">
                {activeMeasures.map((measure) => (
                    <div
                        key={measure.id}
                        className={`measure-card ${responses[measure.id] ? 'checked' : ''} priority-${measure.priority}`}
                        onClick={() => handleToggle(measure.id)}
                    >
                        <div className="measure-checkbox-wrapper">
                            <input
                                type="checkbox"
                                checked={responses[measure.id] || false}
                                onChange={() => handleToggle(measure.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="measure-checkbox-input"
                            />
                            <div className="measure-checkmark">
                                {responses[measure.id] && <span className="checkmark-icon">✓</span>}
                            </div>
                        </div>

                        <div className="measure-content">
                            <div className="measure-header-row">
                                <h3 className="measure-title">{measure.title}</h3>
                                <span className={`priority-badge ${measure.priority}`}>
                                    {measure.priorityLabel}
                                </span>
                            </div>
                            <p className="measure-description">{measure.description}</p>
                            <span className="measure-article">{measure.article}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="assessment-footer">
                <p className="footer-note">
                    <strong>Poznámka:</strong> Tento seznam vychází přímo ze znění
                    <a
                        href={complianceLevel === 'higher'
                            ? "https://www.zakonyprolidi.cz/cs/2025-409"
                            : "https://www.zakonyprolidi.cz/cs/2025-410"}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#646cff', marginLeft: '4px' }}
                    >
                        {decreeName}
                    </a>.
                    Bod 1 (§ 3) je klíčový – bez vedení evidence opatření nelze splnit požadavky zákona, i kdybyste ostatní technická opatření měli.
                </p>
            </div>

            <div className="form-actions">
                <button className="back-btn" onClick={onBack}>
                    ← Zpět
                </button>
                <button className="continue-btn" onClick={handleNext}>
                    Pokračovat na souhrn →
                </button>
            </div>
        </div>
    );
}
