// src/components/ImplementationAgent/ProfilerEngine.js

/**
 * Zhodnoť přiměřenost opatření na základě Pravidel 1, 2 a 3.
 * 
 * Pravidlo 1: Ekonomická bariéra (cost_of_measure > asset_value * multiplier)
 * Pravidlo 2: Prioritizace CIA (kritičnost == Zdraví/Životy -> priorita dostupnosti u SIEM)
 * Pravidlo 3: Neopominutelné minimum (§ 3, 4, 5, 6, 10)
 * 
 * @param {Object} measure - Opatření (obsahuje id, min_cost, max_cost, atd.)
 * @param {Object} profile - Profil organizace (asset_value, budget_cap, criticality, atd.)
 * @returns {Object} - Výsledek vyhodnocení: { mandatory: boolean, canBeDisproportionate: boolean, defaultJustification: string, type: string }
 */
export const evaluateMeasure = (measure, profile) => {
    const { id, title, max_cost = 0 } = measure;
    const { asset_value, criticality } = profile;

    // RULE 3: Neopominutelné minimum
    // Paragrafy 3, 4, 5, 6, 10 jsou povinné a nelze je nezavést z důvodu přiměřenosti
    const mandatoryParagraphs = ['§ 3', '§ 4', '§ 5', '§ 6', '§ 10'];
    const isMandatory = mandatoryParagraphs.some(p => id.startsWith(p));

    if (isMandatory) {
        return {
            mandatory: true,
            canBeDisproportionate: false,
            preventUnimplemented: true,
            defaultJustification: '',
            isDisproportionate: false,
            type: ''
        };
    }

    // RULE 1: Ekonomická bariéra
    // Zjistíme, jestli maximální očekávaná odhadovaná cena (max_cost) významně převyšuje hodnotu aktiv (nebo významné %).
    // Multiplikátor může být upraven (např. investice do 1 opatření nesmí překročit 10% hodnoty aktiv)
    const assetMultiplier = 0.5; // 50% hodnoty aktiv
    const budgetMultiplier = 1.0; // 100% ročního budgetu

    let isDisproportionate = false;

    // Scénář Bohatý Zemědělec (Opatření je levné, firma má peníze) -> Nepřipustíme výjimku z ekonomických důvodů, pokud to stojí drobné.
    // Scénář Chudá Poliklinika (Opatření je drahé, budget je nízký) -> Připustíme výjimku
    if (max_cost > (asset_value * assetMultiplier) || max_cost > (profile.budgetCap * budgetMultiplier)) {
        isDisproportionate = true;
    }

    // RULE 2: Prioritizace CIA
    // Specificky pro opatření typu detekce (např. SIEM/SOC, typicky § neopominutelný, ale jako sub-opatření)
    let isSiemOrSoc = title.toLowerCase().includes('siem') || title.toLowerCase().includes('soc') || title.toLowerCase().includes('detekce');
    let ciaMessage = '';

    if (isSiemOrSoc && criticality === 'Zdraví/Životy') {
        // I když třeba nejsou peníze, kritičnost "Zdraví/Životy" vyžaduje, aby se dbalo na Dostupnost.
        ciaMessage = ' Vzhledem ke kritičnosti služby ("Zdraví/Životy") a nedostatku finančních prostředků organizace dle doporučení NÚKIB prioritizuje investice do Dostupnosti a Integrity (např. robustní zálohování, antivirová ochrana a offline obnova) před nákladnou a složitou Detekcí (SIEM).';
        // Pro SIEM v případě zdravotnictví to silně směřujeme k "Nepřiměřené", pokud na to není budget.
        if (profile.budgetCap < 500000) {
            isDisproportionate = true;
        }
    }

    // Generátor Textu (Justification)
    let justification = '';
    let appropriatenessType = '';

    if (isDisproportionate) {
        appropriatenessType = 'Ekonomická';
        // Specifická formulace vyžádaná pro scénář Vysoká cena vs. Nízký rozpočet
        justification = `Náklady na plné zavedení opatření významně převyšují očekávaný přínos a finanční možnosti subjektu. Riziko je pokryto alternativním opatřením v přiměřeném rozsahu.`;
    }

    // Kombinace profilu: Zastaralá technologie (tech_debt)
    if (profile.techDebt > 50 && (!isMandatory || isDisproportionate)) {
        appropriatenessType = appropriatenessType || 'Technická'; // Může přepsat, nebo doplnit
        justification += ` Dále upozorňujeme, že vzhledem k vysoké míře zastaralých technologií (Tech Debt: ${profile.techDebt} %) organizace prioritizuje strategickou a strukturální obnovu aktiv před implementací izolovaných bezpečnostních nadstaveb na bezprostředně dosluhující systémy.`;
    }

    // Připojíme případnou zprávu o CIA (Prioritizace)
    if (ciaMessage) {
        justification += ciaMessage;
    }

    // Pokud je menší velikost (Profil A) a zároveň není tak drahý, ale uživatel to stejně chce nezavést z organizačních důvodů (např. chybí lidi).
    if (!isDisproportionate && profile.orgSize === '1-10' && !isMandatory) {
        appropriatenessType = 'Organizační';
        justification = `Vzhledem k velmi omezené velikosti organizace (do 10 zaměstnanců) bylo k naplnění požadavku zvoleno alternativní nebo částečné řešení odpovídající specifickým personálním a strukturálním možnostem subjektu. Plný rozsah opatření v původním znění je organizačně nepřiměřený.`;
    }

    return {
        mandatory: false,
        canBeDisproportionate: true,
        preventUnimplemented: false,
        isDisproportionate: isDisproportionate,
        defaultJustification: justification,
        type: appropriatenessType
    };
};

/**
 * Logovací utilita pro Audit profilu. Vytváří standardizovaný záznam.
 */
export const createAuditLogEntry = (action, details, scoreChange = 0) => {
    return {
        timestamp: new Date().toISOString(),
        action,
        details,
        scoreImpact: scoreChange
    };
};
