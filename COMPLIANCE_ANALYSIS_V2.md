# Komplexní analýza a obhajoba logiky: The Profiler V2 (Implementační Agent NIS2)

Tento dokument slouží jako detailní technická a procesní obhajoba (Compliance Defense) nového modulu **The Profiler V2**. Dokument je navržen tak, aby poskytl vyčerpávající argumentaci pro auditory (NÚKIB, interní audit), proč a jak aplikace prokazatelně naplňuje požadavky nové vyhlášky k zákonu o kybernetické bezpečnosti (NIS2).

## 1. Filozofie a posun paradigmatu (Z V1 na V2)

Zatímco verze V1 (*SecurityMeasuresTable*) fungovala primárně jako sebehodnotící dotazník opatření typu „Mám / Nemám“, verze V2 (*The Profiler*) představuje fundamentální změnu přístupu: **přechod od deklarativní shody k prokazatelné evidenci**.

V2 architektura vychází z premisy, že auditora nezajímá pouze tvrzení, že "máme zavedený proces", ale vyžaduje hmatatelný důkaz, zohlednění kontextu organizace a uplatnění PDCA (Plan-Do-Check-Act) cyklu.

## 2. Jádro compliance: ProfilerEngine a Algoritmické rozhodování

Aby se zabránilo alibistickému obcházení povinností (klikání na "Nezavedeno z důvodu přiměřenosti" bez pádného důvodu), byl vyvinut `ProfilerEngine`, který aplikuje deterministická pravidla pro hodnocení úlev.

### Pravidlo 1: Ekonomická bariéra (Economic Disproportionality)
Vyhláška umožňuje nezavést vybraná technická opatření, pokud by náklady převyšovaly přínos (zásada přiměřenosti).
- **Logika V2**: Engine při startu (krok *ProfilerStep*) zjistí roční obrat firmy a vyčlení alokaci na IT/Security. U každého opatření (např. SIEM řešení v řádu milionů) porovná odhadovaný `max_cost` s rozpočtovou realitou organizace.
- **Obhajoba**: Pokud je detekována masivní disproporce, systém opatření *automaticky zafixuje* do stavu "Nezavedeno (Přiměřenost)" a vygeneruje formální textové zdůvodnění o ekonomické neschůdnosti. Tím se zajišťuje objektivní, na datech založená obhajoba namísto volné úvahy uživatele.

### Pravidlo 3: Neopominutelná opatření (Non-omissible Baseline)
Ne všechna opatření lze vyjmout na zásadu ekonomické přiměřenosti. Jádro bezpečnosti musí fungovat vždy.
- **Logika V2**: Engine obsahuje seznam kritických § (např. § 5 Školení, § 6 Zálohování, § 10 Zvládání incidentů) s příznakem `preventUnimplemented`.
- **Obhajoba**: Uživatelské rozhraní fyzicky zablokuje možnost uplatnit přiměřenost na tyto základní stavební kameny bezpečnosti. Pokud organizace nemá zálohy, NIS2 Agent jasně signalizuje nesoulad. Aplikace tím garantuje, že organizace nespadne pod kritické minimum.

## 3. Detailní pokrytí požadavků vyhlášky (Module-by-Module)

Agent V2 sbírá data ve strukturovaných fázích, které přesně odpovídají klíčovým normám:

### A. Vedení a Řízení (§ 4) & Aktiva a Rizika (§ 3)
- **Implementace**: Moduly ptající se na Osobu pověřenou KB s její kvalifikací a seznam důležitých systémů s ohodnocením (Důvěrnost, Integrita, Dostupnost).
- **Compliance prvek**: Aplikace vynucuje seřazení aktiv do žebříčku priorit, čímž vzniká základ pro Business Impact Analysis (BIA) schválený statutárním orgánem. Do generovaného PDF se propisuje: *"Znalost aktiv a rizik potvrzena."*

### B. Bezpečnost lidských zdrojů (§ 5)
- **Implementace**: Generátor bezpečnostní politiky, evidence proškolení osob a disciplinární doložka.
- **Compliance prvek**: Systém automaticky počítá a eviduje data *příštích* školení. Zavádí tzv. **ošetření praxe**: vynucuje zaškrtnutí "Odborné/Praktické", čímž doplňuje zákonný požadavek na specializovaný trénink nejen pro CISO, ale i systémové administrátory.

### C. Kontinuita a Zálohování (§ 6)
- **Implementace**: Evidence RPO a předmětu zálohování (Backup Scheme).
- **Compliance prvek (Kritický)**: Byla odstraněna prázdná tvrzení. Modul vynucuje vložení *Data posledního úspěšného testu obnovy záloh (Recovery Test)*. Tím plní požadavek prokazatelnosti. Součástí je i záchranná Kontaktní matice třetích stran.

### D. Zvládání incidentů (§ 10)
Tento modul představuje vrchol technické ochrany The Profileru, který kombinuje dohled i prevenci.
- **Implementace**: Interaktivní "Deník událostí" a "Automatický detektor Významného Incidentu" (The Filter).
- **Compliance prvek**: 
  1. Organizace zapisuje provozní výpadky do registru.
  2. Modul tato data křížově porovnává s "Prahy významnosti" definovanými v Kroku 2 (Incident Significance Step).
  3. Jakmile je limit překročen, The Profiler zobrazí 24h odpočet hlášení pro NÚKIB a odemyká Reporting Checklist. Splňuje se tak nejdrsnější pokutová legislativa kyberzákona o neskrývání incidentů.

## 4. Důkazní rovina: PDCA a Auditní Stopy

Vyhláška učí organizace nejen pravidla nastavit, ale kontinuálně kontrolovat a vylepšovat (Demingův cyklus). The Profiler V2 to mapuje dvěma unikátními nástroji:

### PDCA Hlídač účinnosti opatření (§ 3 odst. 2 písm. b)
- **Problém V1**: Uživatel označil opatření jako "Zavedeno" a proces končil.
- **Řešení V2**: U každého *Zavedeného* opatření je nyní zásahem systému vyžadováno textové potvrzení: **Způsob a výsledek ověření (PDCA)**.
- **Obhajoba**: Pokud je "Řízení přístupů" zavedeno, V2 nepustí organizaci dál (Hard-Gate validation), dokud nevyplní např. "*Proveden audit domény v lednu 2026, odebráno 5 neaktivních účtů*". Toto je absolutní zbraň proti auditu – organizace netvrdí, že opatření má, ale že *ví, že funguje*. Vkládají se vizuálně do Výstupního PDF.

### Auditní Log Enginu (Immutable Trail)
- O krocích a manipulacích uživatele se vede strojový záznam (časová značka, akce, změna skóre).
- Snižování počtu zavedených opatření nebo vynětí přes ekonomickou disproporci sráží aplikaci "Compliance skóre" a loguje zdůvodnění aplikací do tabulky PDF reportu. Tento *otisk The Profileru* přesně mapuje rozhodovací proces k datu vytvoření, čímž zajišťuje dokonalou zpětnou trasovatelnost (Non-repudiation) při jakékoliv revizi opatření ze strany kontrolního orgánu.

## 5. Cílový artefakt: Architektura Přežití (The PDF Survival Kit)

Finálním hmatatelným důkazem a výstupem aplikace je `AuditReportDocument` (vygenerované PDF). Dokument není jen tiskopisem elektronické tabulky, ale zhmotňuje **plán kontinuity pro stav krize (Disaster Recovery)**.

Při velkém výpadku (ransomware, spálení serverovny) elektronické systémy nefungují. Fyzicky vytištěný The Profiler PDF Report obsahuje speciální sekce pro přežití:
1.  **Kontaktní krizová matice** (Z § 6) nezávislá na interním AD či Outlooku.
2.  **Statutární podpisy pod BIA**: Jasné a nezvratné doložení prioritizace, podepsané vedením firmy (ověření management responsibilities dle směrnice).
3.  **Emergency Formulář NÚKIB**: Na úplném konci PDF je vytištěna "Nouzová hlášenka incidentu" - prázdný formulář s instrukcemi k provedení záchranných prvotních kroků, určený pro manuální vyplnění perem při nejtvrdším black-outu za cílem podání povinného incident reportu datovou schránkou nebo faxem v čase do 24/72 hodin.

## Shrnutí

Implementační Agent NIS2 V2 není kalkulačkou či tabulkovým seznamem. Je to **softwarově vynucený auditor**. Nutí management uvažovat o dopadech, zabraňuje ignorování klíčových technických procesů a generuje dokumentaci, která je právně defenzivní, PDCA-založená a okamžitě upotřebitelná v době masivního výpadku IS. Tímto přístupem se řadí The Profiler mezi elitní nástroje automatizace compliance.
