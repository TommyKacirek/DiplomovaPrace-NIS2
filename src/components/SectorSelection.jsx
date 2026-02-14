import React, { useState } from 'react';
import './SectorSelection.css';

const SECTORS = [
  {
    label: 'Annex I - Sektory vysoké kritičnosti',
    annex: 'I',
    subjects: [
      { value: 'Veřejná správa', services: 26 },
      { value: 'Energetika – Elektřina', services: 10 },
      { value: 'Energetika – Ropa a ropné produkty', services: 7 },
      { value: 'Energetika – Zemní plyn', services: 5 },
      { value: 'Energetika – Teplárenství', services: 2 },
      { value: 'Energetika – Vodík', services: 3 },
      { value: 'Letecká doprava', services: 4 },
      { value: 'Drážní doprava', services: 8 },
      { value: 'Námořní vodní doprava', services: 4 },
      { value: 'Silniční doprava', services: 2 },
      { value: 'Digitální infrastruktura a služby', services: 18 },
      { value: 'Finanční trh', services: 5 },
      { value: 'Zdravotnictví', services: 9 },
      { value: 'Vodní hospodářství', services: 2 },
      { value: 'Vesmírný průmysl', services: 1 },
    ],
  },
  {
    label: 'Annex II - Ostatní kritické sektory',
    annex: 'II',
    subjects: [
      { value: 'Výrobní průmysl', services: 5 },
      { value: 'Potravinářský průmysl', services: 3 },
      { value: 'Chemický průmysl', services: 4 },
      { value: 'Odpadové hospodářství', services: 4 },
      { value: 'Poštovní a kurýrní služby', services: 2 },
      { value: 'Věda, výzkum a vzdělávání', services: 1 },
      { value: 'Obranný průmysl', services: 2 },
    ],
  },
];

export default function SectorSelection({ onSectorSelect, onBack }) {
  const [selected, setSelected] = useState('');
  const [info, setInfo] = useState(null);

  const handleSelect = (e) => {
    const value = e.target.value;
    setSelected(value);

    let found = null;
    SECTORS.forEach(group => {
      const match = group.subjects.find(sub => sub.value === value);
      if (match) {
        found = { ...match, annex: group.annex };
      }
    });
    setInfo(found);
  };

  const handleContinue = () => {
    if (onSectorSelect && selected) {
      onSectorSelect(selected);
    }
  };

  return (
    <div className="module-card animate-slide-up">
      <h2>Vyberte sektor</h2>
      <p className="services-description">
        Vyberte sektor, ve kterém vaše firma poskytuje služby podle směrnice NIS2.
      </p>

      <select
        value={selected}
        onChange={handleSelect}
        className="sector-select"
      >
        <option value="">-- Vyberte sektor --</option>
        {SECTORS.map((group) => (
          <optgroup key={group.annex} label={group.label}>
            {group.subjects.map((subject) => (
              <option key={subject.value} value={subject.value}>
                {subject.value} ({subject.services} služeb)
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      {info && (
        <div className="sector-info">
          <h3>Vybraný sektor:</h3>
          <p><strong>{info.value}</strong></p>
          <p>Příloha: {info.annex} | Počet služeb: {info.services}</p>
        </div>
      )}

      <div className="form-actions">
        {onBack && (
          <button className="back-btn" onClick={onBack}>
            Zpět
          </button>
        )}
        <button
          className="continue-btn"
          onClick={handleContinue}
          disabled={!selected}
        >
          Pokračovat
        </button>
      </div>
    </div>
  );
}
