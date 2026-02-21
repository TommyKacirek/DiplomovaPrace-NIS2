import React, { useState } from 'react';
import { createAuditLogEntry } from './ProfilerEngine';
import './IdentificationStep.css'; // Můžeme využít styly z v1 Identifikace (předpoklad že sedí)

export default function ProfilerStep({ onComplete, data }) {
    const [profileData, setProfileData] = useState(data && Object.keys(data).length > 0 ? data : {
        orgSize: '1-10',
        budgetCap: 100000,
        assetValue: 500000,
        criticality: 'Finance',
        techDebt: 20,
        ciaTrained: false
    });

    const handleNext = () => {
        if (!profileData.ciaTrained) {
            alert("Pro pokračování prosím odsouhlaste poučení o CIA triádě.");
            return;
        }

        // Tvorba iniciálního logu o nastavení statutu a profilu
        const initialLog = createAuditLogEntry(
            "Úvodní profilování organizace (V2)",
            `Nastaven profil: Velikost: ${profileData.orgSize}, TCO Aktiv: ${profileData.assetValue} Kč, Roční budget na IB: ${profileData.budgetCap} Kč. Kritičnost stanovených služeb: ${profileData.criticality}.`,
            50 // startovací compliance base score
        );

        onComplete({ ...profileData, initialLog });
    };

    return (
        <div className="step-container fade-in">
            <div className="step-header">
                <h2>Profilace podle NÚKIB (V2: The Profiler)</h2>
                <div className="step-legal-note">
                    <strong>Předběžné stanovení právního štítu</strong><br />
                    Tento krok kalibruje systém pro výpočet tzv. <em>ekonomické a provozní přiměřenosti</em>.
                    Vyhodnocení zohledňuje proporci Vašich provozních prostředků vůči požadovaným bezpečnostním investicím.
                </div>
            </div>

            <div className="form-card">
                <h3>1. Velikost a kapacity</h3>
                <div className="form-grid-2">
                    <div className="input-group">
                        <label>Velikost organizace (Zákon § 3)</label>
                        <select
                            value={profileData.orgSize}
                            onChange={(e) => setProfileData(prev => ({ ...prev, orgSize: e.target.value }))}
                            className="input-sleek"
                        >
                            <option value="1-10">Mikro (1-10 zaměstnanců)</option>
                            <option value="11-50">Malá (11-50 zaměstnanců)</option>
                            <option value="51-250">Střední (51-250 zaměstnanců)</option>
                            <option value="250+">Velká (nad 250 zaměstnanců)</option>
                        </select>
                        <small>Faktor pro organizační přiměřenost.</small>
                    </div>
                </div>

                <h3 style={{ marginTop: '20px' }}>2. Ekonomické mantinely (Klíčové pro výjimky)</h3>
                <div className="form-grid-2">
                    <div className="input-group">
                        <label>Celková hodnota IT aktiv (v Kč)</label>
                        <input
                            type="number"
                            min="0"
                            step="10000"
                            value={profileData.assetValue}
                            onChange={(e) => setProfileData(prev => ({ ...prev, assetValue: parseInt(e.target.value) || 0 }))}
                            className="input-sleek"
                        />
                        <small>TCO hardware, software, licenčních a datových aktiv (tzv. Asset Value).</small>
                    </div>
                    <div className="input-group">
                        <label>Roční rozpočet na kyber. bezpečnost (Kč)</label>
                        <input
                            type="number"
                            min="0"
                            step="10000"
                            value={profileData.budgetCap}
                            onChange={(e) => setProfileData(prev => ({ ...prev, budgetCap: parseInt(e.target.value) || 0 }))}
                            className="input-sleek"
                            style={{ borderLeft: '3px solid #ff9500' }}
                        />
                        <small>Faktor bariéry investiční přiměřenosti.</small>
                    </div>
                </div>

                <h3 style={{ marginTop: '20px' }}>3. Dopady a Kritičnost služeb</h3>
                <div className="form-grid-2">
                    <div className="input-group">
                        <label>Kritičnost (Dopad výpadku služby)</label>
                        <select
                            value={profileData.criticality}
                            onChange={(e) => setProfileData(prev => ({ ...prev, criticality: e.target.value }))}
                            className="input-sleek"
                            style={{ borderLeft: profileData.criticality === 'Zdraví/Životy' ? '3px solid #ff3b30' : 'none' }}
                        >
                            <option value="Finance">Finanční škody (Běžná závažnost)</option>
                            <option value="Bezpečnost">Hrozba pro majetek / bezp. státu</option>
                            <option value="Zdraví/Životy">Ohrožení zdraví / životů (Kritická priorita)</option>
                            <option value="Povinnost">Porušení zákonné povinnosti</option>
                        </select>
                        <small>Automaticky upravuje doporučení pro SIEM a zálohování.</small>
                    </div>

                    <div className="input-group">
                        <label>Míra zastaralých technologií / Tech Debt (%)</label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={profileData.techDebt}
                            onChange={(e) => setProfileData(prev => ({ ...prev, techDebt: parseInt(e.target.value) }))}
                            style={{ width: '100%', accentColor: '#bf5af2', margin: '10px 0' }}
                        />
                        <div style={{ textAlign: 'right', fontWeight: 'bold', color: '#bf5af2' }}>{profileData.techDebt} %</div>
                        <small>Určuje strategii pro odstavení Legacy systémů.</small>
                    </div>
                </div>

                <div className="input-group checkbox-group" style={{ marginTop: '30px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', margin: 0 }}>
                        <input
                            type="checkbox"
                            checked={profileData.ciaTrained}
                            onChange={(e) => setProfileData(prev => ({ ...prev, ciaTrained: e.target.checked }))}
                            style={{ transform: 'scale(1.5)' }}
                        />
                        <span>Byl jsem prokazatelně poučen o koncepci "CIA Triády" (Důvěrnost, Integrita, Dostupnost) a rozumím její roli v řízení bezpečnostních rizik organizace.</span>
                    </label>
                </div>

            </div>

            <div className="form-actions-bar">
                <button
                    className="action-button primary"
                    onClick={handleNext}
                >
                    Založit Profil a Pokračovat
                </button>
            </div>
        </div>
    );
}
