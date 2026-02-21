# NIS2 kalkulačka

Tento projekt je webová aplikace (SPA) pro výpočet a posouzení požadavků vyplývajících ze směrnice NIS2. Aplikace je napsaná v Reactu a je určena jako součást semestrální práce.

## Způsoby použití

Aplikaci lze použít dvěma způsoby:

1. **Online verze (doporučeno pro rychlé vyzkoušení)**
2. **Lokální spuštění z klonovaného repozitáře**

### 1. Online verze

Bez jakékoliv instalace je možné aplikaci spustit přímo v prohlížeči na adrese:

`https://TommyKacirek.github.io/Semestralni_Prace_NIS2`

Stačí otevřít odkaz a aplikace je ihned použitelná.

### 2. Lokální spuštění

Tato varianta je vhodná, pokud chcete:

- prozkoumat zdrojový kód,
- upravit funkcionalitu,
- spustit aplikaci v lokálním prostředí.

#### Požadavky

- Node.js (doporučená aktuální LTS verze)
- npm (součást instalace Node.js)

#### Postup

1. **Naklonování repozitáře**
`git clone https://github.com/TommyKacirek/Semestralni_Prace_NIS2.git`
`cd Semestralni_Prace_NIS2`


2. **Instalace závislostí**
`npm install`


3. **Spuštění vývojového serveru**
`npm start`


Aplikace se spustí na adrese `http://localhost:3000` (nebo jiném portu, který zobrazí terminál). Výchozí prohlížeč by se měl otevřít automaticky, případně můžete adresu zadat ručně.

## Struktura projektu

- `nis2-calculator/` – zdrojové kódy aplikace
  - `src/` – React komponenty, logika aplikace
  - `public/` – statické soubory
- `package.json` – konfigurace projektu a seznam závislostí
- `package-lock.json` – uzamčené verze balíčků
- `.gitignore` – soubory a složky ignorované verzovacím systémem
- `ARCHITECTURE.md` – [NOVÉ] High-level popis architektury a datového toku The Profiler V2 aplikací.
- `TECHNICAL_GUIDE.md` – [NOVÉ] Technický průvodce hodnotícím logickým jádrem a principem konverze do PDF Reportu.
- `COMPLIANCE_ANALYSIS_V2.md` – [NOVÉ] Komplexní analytická obhajoba modulu V2 pro auditory a NÚKIB compliance.