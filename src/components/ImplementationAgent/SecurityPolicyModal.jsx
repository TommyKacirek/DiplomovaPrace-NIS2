import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function SecurityPolicyModal({ companyName, assets, manager, onClose }) {

    // Helper to generate PDF
    const generatePolicyPDF = () => {
        const doc = new jsPDF();

        // Add font if exists in utils, otherwise standard
        // doc.addFileToVFS("MyFont.ttf", font);
        // doc.addFont("MyFont.ttf", "MyFont", "normal");
        // doc.setFont("MyFont");

        doc.setFontSize(22);
        doc.text("Bezpečnostní politika kybernetické bezpečnosti", 105, 20, null, null, "center");

        doc.setFontSize(12);
        doc.text(`pro společnost: ${companyName || '[Doplnit název]'}`, 105, 30, null, null, "center");

        doc.setFontSize(14);
        doc.text("1. Úvod a závazek", 20, 50);
        doc.setFontSize(10);
        const introText = `Vedení společnosti ${companyName || '...'} si je vědomo důležitosti ochrany informací a aktiv. Zavazujeme se k plnění požadavků vyhlášky o kybernetické bezpečnosti a k neustálému zlepšování systému řízení bezpečnosti informací.`;
        const splitIntro = doc.splitTextToSize(introText, 170);
        doc.text(splitIntro, 20, 60);

        doc.setFontSize(14);
        doc.text("2. Rozsah a chráněná aktiva", 20, 80);
        doc.setFontSize(10);
        doc.text("Tato politika se vztahuje na následující klíčová aktiva:", 20, 90);

        let y = 100;
        assets.forEach((asset) => {
            doc.text(`- ${asset.name} (${asset.category})`, 25, y);
            y += 7;
        });

        doc.setFontSize(14);
        doc.text("3. Odpovědnost", 20, y + 10);
        doc.setFontSize(10);
        doc.text(`Garantem kybernetické bezpečnosti a osobou odpovědnou za přezkoumání této politiky je:`, 20, y + 20);
        doc.setFontSize(12);
        doc.text(`${manager || '[Neuvedeno]'}`, 20, y + 30);

        doc.setFontSize(10);
        doc.text("Tato politika je závazná pro všechny zaměstnance a dodavatele.", 20, y + 50);

        // Footer
        const date = new Date().toISOString().split('T')[0];
        doc.setFontSize(8);
        doc.text(`Datum vydání: ${date} | Verze: 1.0`, 20, 280);

        doc.save(`Bezpečnostní_politika_${date}.pdf`);
    };

    const generateSignatureSheet = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Prezenční listina - Seznámení s politikou KB", 105, 20, null, null, "center");

        doc.setFontSize(12);
        doc.text(`Dokument: Bezpečnostní politika kybernetické bezpečnosti`, 20, 40);
        doc.text(`Verze: 1.0`, 20, 50);
        doc.text(`Platnost od: ${new Date().toISOString().split('T')[0]}`, 20, 60);

        doc.setFontSize(10);
        doc.text("Svým podpisem níže stvrzuji, že jsem se seznámil(a) s obsahem výše uvedené bezpečnostní dokumentace, porozuměl(a) jsem jí a zavazuji se ji dodržovat.", 20, 80, { maxWidth: 170 });

        autoTable(doc, {
            startY: 100,
            head: [['Jméno a Příjmení', 'Oddělení', 'Datum', 'Podpis']],
            body: [
                ['', '', '', ''],
                ['', '', '', ''],
                ['', '', '', ''],
                ['', '', '', ''],
                ['', '', '', ''],
                ['', '', '', ''],
                ['', '', '', ''],
                ['', '', '', ''],
                ['', '', '', ''],
                ['', '', '', ''],
            ],
            theme: 'grid',
            headStyles: { fillColor: [66, 66, 66] },
            styles: { minCellHeight: 15 }
        });

        doc.save(`Podpisovy_arch_KB.pdf`);
    };

    return (
        <div className="expiry-overlay">
            <div className="expiry-modal" style={{ maxWidth: '600px', textAlign: 'left' }}>
                <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '20px', color: '#fff' }}>
                    📄 Generátor bezpečnostní dokumentace
                </h2>

                <p style={{ color: '#ccc', marginBottom: '20px' }}>
                    Pro splnění § 3 vyhlášky je nutné mít stanovenou bezpečnostní politiku a prokazatelně s ní seznámit zaměstnance.
                </p>

                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <strong style={{ display: 'block', color: '#fff' }}>1. Bezpečnostní politika</strong>
                        <span style={{ fontSize: '0.85rem', color: '#888' }}>Hlavní směrnice (PDF)</span>
                    </div>
                    <button className="action-button secondary small" onClick={generatePolicyPDF}>⬇ Stáhnout PDF</button>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <strong style={{ display: 'block', color: '#fff' }}>2. Podpisový arch</strong>
                        <span style={{ fontSize: '0.85rem', color: '#888' }}>Pro zaměstnance (Vynucování)</span>
                    </div>
                    <button className="action-button secondary small" onClick={generateSignatureSheet}>⬇ Stáhnout PDF</button>
                </div>

                <div style={{ textAlign: 'right' }}>
                    <button className="action-button primary" onClick={onClose}>Zavřít</button>
                </div>
            </div>
        </div>
    );
}
