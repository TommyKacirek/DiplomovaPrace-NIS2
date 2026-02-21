const fs = require('fs');

// We have to mock the ES module or copy the logic since Node doesn't run ES modules out of the box easily without transpilation setup in standard React scripts unless specifically configured.
// For simplicity of this test script, we will just read the file and use eval or regex, or simply recreate the exact logic function here to test it.
// Given we just wrote the logic, let's copy the pure function here to test it directly.

const evaluateMeasure = (measure, profile) => {
    const { id, title, min_cost = 0, max_cost = 0 } = measure;
    const { asset_value, criticality } = profile;

    const mandatoryParagraphs = ['§ 3', '§ 4', '§ 5', '§ 6', '§ 10'];
    const isMandatory = mandatoryParagraphs.some(p => id.startsWith(p));

    if (isMandatory) {
        return { mandatory: true, canBeDisproportionate: false, preventUnimplemented: true, defaultJustification: '', isDisproportionate: false, type: '' };
    }

    const assetMultiplier = 0.5;
    const budgetMultiplier = 1.0;

    let isDisproportionate = false;

    if (max_cost > (asset_value * assetMultiplier) || max_cost > (profile.budgetCap * budgetMultiplier)) {
        isDisproportionate = true;
    }

    let isSiemOrSoc = title.toLowerCase().includes('siem') || title.toLowerCase().includes('soc') || title.toLowerCase().includes('detekce');
    let ciaMessage = '';

    if (isSiemOrSoc && criticality === 'Zdraví/Životy') {
        ciaMessage = ' Vzhledem ke kritičnosti služby ("Zdraví/Životy") a nedostatku finančních prostředků organizace dle doporučení NÚKIB prioritizuje investice do Dostupnosti a Integrity (např. robustní zálohování, antivirová ochrana a offline obnova) před nákladnou a složitou Detekcí (SIEM).';
        if (profile.budgetCap < 500000) {
            isDisproportionate = true;
        }
    }

    let justification = '';
    let appropriatenessType = '';

    if (isDisproportionate) {
        appropriatenessType = 'Ekonomická';
        justification = `Na základě vyhodnocení přiměřenosti podle § 3 odst. 1 písm. a) vyhlášky bylo rozhodnuto o nezavedení opatření plném rozsahu. Důvodem je extrémní nákladovost. Vzhledem k hodnotě chráněných aktiv (${asset_value.toLocaleString()} CZK) a ročnímu rozpočtu na IB (${profile.budgetCap.toLocaleString()} CZK) by aplikace (odhad až ${max_cost.toLocaleString()} CZK) byla pro organizaci ekonomicky disproporční. Náklady by paralyzovaly ostatní nutný provoz a významně převyšují očekávaný přínos snížení rizika v této jedné oblasti.${ciaMessage}`;
    }

    if (!isDisproportionate && profile.orgSize === '1-10' && !isMandatory) {
        appropriatenessType = 'Organizační';
        justification = `Vzhledem k velmi omezené velikosti organizace (do 10 zaměstnanců) bylo k naplnění požadavku zvoleno alternativní nebo částečné řešení odpovídající specifickým personálním a strukturálním možnostem subjektu. Plný rozsah opatření v původním znění je organizačně nepřiměřený.`;
    }

    return { mandatory: false, canBeDisproportionate: true, preventUnimplemented: false, isDisproportionate, defaultJustification: justification, type: appropriatenessType };
};

console.log("=== SCÉNÁŘ 1: Chudá Poliklinika ===");
const chudaPoliklinika = {
    orgSize: '51-250',
    asset_value: 300000,
    budgetCap: 50000,
    criticality: 'Zdraví/Životy'
};

const siemMeasure = { id: '§ 11', title: 'Nástroj pro centralizovaný sběr logů (SIEM)', min_cost: 500000, max_cost: 2000000 };
const backupMeasure = { id: '§ 6', title: 'Zálohování a obnova', min_cost: 50000, max_cost: 500000 };

const resultChudaPoliklinikaSiem = evaluateMeasure(siemMeasure, chudaPoliklinika);
console.log("SIEM (2M CZK):", resultChudaPoliklinikaSiem.isDisproportionate ? "VYŘAZENO (Nepřiměřené)" : "ZAVEDENO");
console.log("Důvod:", resultChudaPoliklinikaSiem.defaultJustification);

const resultChudaPoliklinikaBackup = evaluateMeasure(backupMeasure, chudaPoliklinika);
console.log("\nZÁLOHOVÁNÍ (§6):", resultChudaPoliklinikaBackup.preventUnimplemented ? "VYŽADOVÁNO (Neopominutelné)" : "NEVYŽADOVÁNO");

console.log("\n=== SCÉNÁŘ 2: Bohatý Zemědělec ===");
const bohatyZemedelec = {
    orgSize: '250+',
    asset_value: 50000000,
    budgetCap: 10000000,
    criticality: 'Finance'
};

const antivirusMeasure = { id: '§ 12', title: 'Hardening a omezování funkcionality stanic', min_cost: 20000, max_cost: 100000 };
const resultBohatyZemedelecAntivirus = evaluateMeasure(antivirusMeasure, bohatyZemedelec);
console.log("Antivirus (100k CZK):", resultBohatyZemedelecAntivirus.isDisproportionate ? "VYŘAZENO (Nepřiměřené)" : "LZE ZAVÉST (Není ekonomicky disproporční)");

