import React, { useState, useEffect } from 'react';
import './FirmaInfoForm.css';

const getCompanySize = ({ employees, turnover, balance }) => {
    if (employees < 10 && turnover < 2 && balance < 2) {
        return 'Mikro';
    } else if (employees < 50 && turnover < 10 && balance < 10) {
        return 'Malá';
    } else if (employees < 250 && turnover < 50 && balance < 43) {
        return 'Střední';
    }
    return 'Velká';
};

export default function FirmaInfoForm({ onSubmit, onContinue, companySize }) {
    const [employees, setEmployees] = useState('');
    const [turnover, setTurnover] = useState('');
    const [balance, setBalance] = useState('');
    const [size, setSize] = useState(companySize);

    const isReady = employees !== '' && turnover !== '' && balance !== '' && size !== null;

    const handleCalculate = () => {
        const result = getCompanySize({
            employees: Number(employees),
            turnover: Number(turnover),
            balance: Number(balance),
        });
        setSize(result);
        if (onSubmit) onSubmit(result);
    };

    useEffect(() => {
        if (companySize) setSize(companySize);
    }, [companySize]);

    return (
        <div className="module-card">
            <h2 style={{ marginTop: 0, marginBottom: '24px' }}>Krok 1: Údaje o firmě</h2>

            <div className="form-group">
                <label>Počet zaměstnanců</label>
                <input
                    type="number"
                    min="0"
                    value={employees}
                    onChange={e => setEmployees(e.target.value)}
                    placeholder="např. 25"
                />
            </div>

            <div className="form-group">
                <label>Roční obrat (mil. EUR)</label>
                <input
                    type="number"
                    min="0"
                    value={turnover}
                    onChange={e => setTurnover(e.target.value)}
                    placeholder="např. 7.5"
                />
            </div>

            <div className="form-group">
                <label>Bilanční suma (mil. EUR)</label>
                <input
                    type="number"
                    min="0"
                    value={balance}
                    onChange={e => setBalance(e.target.value)}
                    placeholder="např. 12.4"
                />
            </div>

            <button
                className="btn-secondary"
                onClick={handleCalculate}
                style={{ marginTop: '20px' }}
            >
                Vyhodnotit velikost
            </button>

            {size && (
                <div className="result-display fade-in">
                    Výsledná velikost: <span className="highlight-purple">{size}</span>
                </div>
            )}

            {isReady && (
                <button
                    className="btn-primary fade-in"
                    onClick={onContinue}
                    style={{ marginTop: '20px' }}
                >
                    Pokračovat
                </button>
            )}
        </div>
    );
}
