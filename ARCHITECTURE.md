# Architektura aplikace NIS2 (The Profiler V2)

Tento dokument popisuje technický návrh, strukturu a datový tok webové aplikace pro hodnocení a implementaci kybernetické bezpečnosti podle vyhlášky k zákonu o kybernetické bezpečnosti (NIS2).

## 1. High-Level přehled

Aplikace je typu Single Page Application (SPA) postavená na knihovně **React**. 
Neobsahuje backendový server ani databázi. Všechna uživatelská data existují pouze v prohlížeči v paměti (Client-side), čímž je zaručena naprostá bezpečnost zadaných citlivých informací (Zero-knowledge architektura z pohledu serveru).
Výstupem aplikace je interaktivní asistence a finální vygenerovaný PDF report (`@react-pdf/renderer`).

## 2. Hlavní aplikační moduly

Aplikace se dělí na tři logické celky spravované v kořenovém `App.js`:

1.  **Main Landing (`AppMode: landing`)**: Rozcestník pro uživatele.
2.  **Kalkulačka regulace (`AppMode: calculator`)**: Rozhodovací strom k určení dopadu regulace NIS2 na daný subjekt (Vyšší / Nižší režim / Neregulováno).
3.  **Implementační Agent (V2) (`AppMode: implementation`)**: Jádro aplikace, označováno jako *The Profiler*. Provází organizaci implementací bezpečnostních opatření krok za krokem a na konci generuje průkazný auditní dokument.

## 3. Implementační Agent (The Profiler V2)

Srdcem V2 komponenty je soubor `src/components/ImplementationAgent/ImplementationModuleV2.jsx`. Ten slouží jako nadřazený stavový kontejner a State Machine pro 10 po sobě jdoucích kroků.

### Přehled kroků (Steps) v The Profiler V2:
1.  **Profil Organizace** (`ProfilerStep`): Definice technické a finanční zralosti (Cloud, legacy systémy, obrat). Slouží pro výpočty přiměřenosti.
2.  **Práh významnosti** (`IncidentSignificanceStep`): Stanovení kvantitativních limitů pro detekci incidentů (výpadky, ztráty).
3.  **Identifikace organizace** (`IdentificationStep`): IČO, název, role v dodavatelském řetězci.
4.  **Aktiva a Rizika** (`AssetRegistryStep`, `LeadershipGovernanceStep`): Katalogizace primárních a podpůrných aktiv (CIA hodnocení) a prioritizace vedením k zajištění byznys kontinuity.
5.  **Lidské zdroje (§ 5)** (`HumanResourcesStep`): Evidence školení, disciplinární doložky.
6.  **Kontinuita a zálohy (§ 6)** (`ContinuityBackupStep`): Strategie obnovy a parametry zálohování s důrazem na PDCA ověření.
7.  **Zvládání incidentů (§ 10)** (`IncidentManagementStep`): Deník událostí, automatická filtrace významnosti a nouzový komunikační plán.
8.  **Pověřená osoba** (`ObligatedPersonStep`): Digitální podepsání vyplněných údajů.
9.  **Hodnocení opatření** (`SecurityMeasuresTableV2`): Interaktivní audit zavedených kontrol mapovaných na vyhlášku (využití AI enginu pro vyhodnocení ekonomické přiměřenosti).
10. **Export (Přežití)**: Krok pro vygenerování PDF.

## 4. Správa stavu (State Management) a Datový tok

Vzhledem k absenci globálního stavového manažeru typu Redux (pro zachování jednoduchosti) je stav spravován přístupem "Lifting State Up".
Data z jednotlivých pod-kroků "bublají" nahoru přes callback komplementárně nazvaný `onComplete` do hlavního stavu `moduleData` uvnitř modulu V2.

Příklad State Flow modulu _Incident Management_:
1.  Uživatel vyplní data v `IncidentManagementStep` (evidence událostí).
2.  Klikne na "Uložit".
3.  Komponenta zavolá `props.onComplete(data)`.
4.  Rodič (`ImplementationModuleV2`) vezme data a uloží je přes svůj handler: `setModuleData(prev => ({...prev, incidentManagement: data}))`.

Při finálním generování dokumentu se celý "tlustý" objekt `moduleData` předá jako prop `data` komponentě `AuditReportDocument`, která jej rozešije do struktury ošetřené PDF konverzí.

## 5. Komponentová nezávislost a Stylování

Všechny části aplikace užívají vlastní CSS framework `ImplementationModule.css`. Design jazyk napodobuje nativní MacOS/Apple Dark Mode (temné barvy, rozmazaná skla / _glassmorphism_, San Francisco font look, akcenty růžové/fialové/zelené). Prostředí klade obrovský důraz na uživatelskou zkušenost a odlehčení byrokratického stresu.
