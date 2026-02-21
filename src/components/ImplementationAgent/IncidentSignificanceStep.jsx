import React, { useState } from 'react';
import './ImplementationModule.css';

export default function IncidentSignificanceStep({ onComplete, data }) {
    const [thresholds, setThresholds] = useState({
        usersAffectedPercent: data?.usersAffectedPercent || 10,
        downtimeHours: data?.downtimeHours || 2,
        financialLossCZK: data?.financialLossCZK || 500000,
        dataSensitivity: data?.dataSensitivity || 'Osobní nebo zdravotní údaje'
    });

    const handleChange = (field, value) => {
        setThresholds(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        // Generate the legal definition sentence
        const definitionText = `Za významný kybernetický bezpečnostní incident se pro účely vyhlášky č. 410 / 2025 Sb. (§ 1 písm.b) v této organizaci považuje událost, která naplní alespoň jeden z těchto parametrů: Výpadek služby pro více než ${thresholds.usersAffectedPercent} % uživatelů po dobu delší než ${thresholds.downtimeHours} hodiny; Přímá finanční ztráta přesahující ${thresholds.financialLossCZK.toLocaleString()} Kč; Únik nebo kompromitace dat klasifikovaných jako "${thresholds.dataSensitivity}".`;

        onComplete({ ...thresholds, definitionText });
    };

    return (
        <div className="glass-panel fade-in">
            <h2>Kalkulačka Významnosti Incidentu (§ 1 písm. b)</h2>
            <p className="step-description">
                Každá organizace musí pro účely vyhlášky exaktně definovat, co považuje za <strong>významný incident</strong>.
                Nastavte prahové hodnoty relevantní pro vaši provozo-ekonomickou realitu.
            </p>

            <div className="step-content">
                <div className="form-group">
                    <label>Procento zasažených uživatelů / klientů (&gt; %)</label>
                    <input
                        type="number"
                        min="1"
                        max="100"
                        className="form-control"
                        value={thresholds.usersAffectedPercent}
                        onChange={(e) => handleChange('usersAffectedPercent', parseInt(e.target.value) || 0)}
                    />
                </div>

                <div className="form-group">
                    <label>Kritická doba výpadku hlavní služby (&gt; hodin)</label>
                    <input
                        type="number"
                        min="1"
                        className="form-control"
                        value={thresholds.downtimeHours}
                        onChange={(e) => handleChange('downtimeHours', parseInt(e.target.value) || 0)}
                    />
                </div>

                <div className="form-group">
                    <label>Práh přímé finanční ztráty (&gt; CZK)</label>
                    <input
                        type="number"
                        min="0"
                        step="50000"
                        className="form-control"
                        value={thresholds.financialLossCZK}
                        onChange={(e) => handleChange('financialLossCZK', parseInt(e.target.value) || 0)}
                    />
                </div>

                <div className="form-group">
                    <label>Kritický typ kompromitovaných dat</label>
                    <select
                        className="form-control"
                        value={thresholds.dataSensitivity}
                        onChange={(e) => handleChange('dataSensitivity', e.target.value)}
                    >
                        <option value="Osobní nebo zdravotní údaje">Osobní nebo zdravotní údaje</option>
                        <option value="Finanční data klientů">Finanční data klientů</option>
                        <option value="Obchodní tajemství a know-how">Obchodní tajemství a know-how</option>
                        <option value="Provozní hesla a kryptografické klíče">Provozní hesla a kryptografické klíče</option>
                    </select>
                </div>

                <div className="info-box purple" style={{ marginTop: '20px' }}>
                    <strong>Generovaná definice do auditní zprávy:</strong><br />
                    <em>Za významný kybernetický bezpečnostní incident se pro účely vyhlášky č. 410/2025 Sb. (§ 1 písm. b) v této organizaci považuje událost, která naplní alespoň jeden z těchto parametrů: Výpadek služby pro více než {thresholds.usersAffectedPercent} % uživatelů po dobu delší než {thresholds.downtimeHours} hodiny; Přímá finanční ztráta přesahující {thresholds.financialLossCZK.toLocaleString()} Kč; Únik nebo kompromitace dat klasifikovaných jako "{thresholds.dataSensitivity}".</em>
                </div>
            </div>

            <div className="step-actions">
                <button className="action-button primary w-full" onClick={handleNext}>
                    Uložit definici a pokračovat
                </button>
            </div>
        </div>
    );
}
