# Technická příručka (The Profiler V2)

Tato příručka je zaměřena na vývojáře a auditory, kteří potřebují pochopit, jakým způsobem The Profiler (Agent V2) hodnotí opatření, aplikuje slevy/výjimky a jakým způsobem generuje finální zprávu.

## 1. Jádro - ProfilerEngine (`src/components/ImplementationAgent/ProfilerEngine.js`)

`ProfilerEngine` je deterministický hodnotící "mozek" aplikace. Jeho hlavním vstupem je `profileData` (znalost cloudizace, legacy dluhu, ročního obratu a velikosti) a s ním konfrontuje sadu tvrdých předpisových opatření z NÚKIBu.

### Pravidlo 1: Ekonomická Disproporce (Economic Filter)
Tento algoritmus ověřuje, zda se menší firmu NÚKIB nesnaží "uzbrojit" drahými opatřeními.
- Zkoumá zadaný `budgetTotal` na Security (ten je na úrovni vstupu odvozen z cca 5 % celkového obratu, viz `ProfilerStep.jsx`).
- Každé opatření má definovaný parametr `max_cost` (max. teoretický náklad na implementaci dané kontroly, např. 2M CZK pro SIEM a 24x7 SOC).
- Pokud hraniční náklad překročí finanční sílu firmy, Engine vystaví flag `isDisproportionate: true`.
- Automatický důsledek: Opatření se uzamkne ve stavu "Nezavedeno (Přiměřenost)" s předpřipraveným zdůvodněním na výjimku ekonomické disproporce dle § 3.

### Pravidlo 3: Neopominutelná Opatření (Non-omissible Rules)
Opatření z pilířů § 3, 4, 5, 6 a 10 (Bezpečnostní politika, Povinnosti vedení, Školení, Zálohování a Detekce incidentů) nelze *nikdy* vyjmout na zásadu ekonomické přiměřenosti.
- Engine k nim pevně lepí příznak `preventUnimplemented: true`.
- Automatický důsledek: UI "zablokuje" možnost výběru *Nezavedeno (Přiměřenost)*. Krok musí být řešen explicitně, jinak The Profiler odmítne organizaci vydat Zprávu i logy.

### Audit Log a Skóre
Engine nese také funkci generátoru `createAuditLogEntry`. Veškeré manipulace s opatřeními, přechody "Zavedeno / V procesu", ale i systémové automatizované flagování zapsané výše, generují nezmanipulovatelné stopy do pole logů s pozitivním (vylepšení) či negativním (odčítání bodů za výjimky) impactem na **Compliance Skóre**.

## 2. Generování PDF (`src/components/ImplementationAgent/AuditReportDocument.jsx`)

Kód využívá knihovnu `@react-pdf/renderer` a funguje na bázi transformace JSON objektu (shromážděných dat) na deklarativní PDF tagy.

### Struktura Finálního PDF Documentu
Tento export má modulární koncepci. Komponenty V2 se renderují jen, pokud je předán props `isV2 === true`.

1. **Manažerské shrnutí:** Záhlaví, datum a dynamický SHA-256 hash stvrzující integritu verze dokumentu. Součástí je tabulka Assetů a jejich CIA (Důvěrnost/Integrita/Dostupnost) hodnocení.
2. **Detailní Evidenční listy (§ 4, 5, 6, 10):**
    * Jmenovité pravomoci "Osoby pověřené Řízením KB".
    * Dynamické tabulky o proškolených lidech (výpočet platnosti dalších školení).
    * PDCA sekce: Výčet konkrétních technických testů obnovy záloh (přesné datum).
    * Event logy významných incidentů a Blank Emergency vzor hlásenky přímo vytištěné pro případ offline evakuací.
3. **Tabulka opatření:** Samotný seznam opatření (co je Zavedeno, co ne). **Pozn:** Pokud je opatření "Zavedeno", PDF automaticky ztlušťuje a zvýrazňuje textový string *PDCA Ověření*, do kterého vizuálně vkládá informaci, zda a jak byla opatření formálně testována (Check fáze).
4. **Důkazní log (The Profiler Data):** Obsahuje otisk samotného enginu. Píše, proč zafixoval ekonomickou úlevu systémem.
5. **Podpisová "Management Sign-off" Strana:** Prázdná stránka přizpůsobená formátu podepisujících manažerů dle § 4 s prohlášením. 

## 3. Postup implementování dalších paragrafů

Chcete-li rozšířit aplikaci o dodavatelský řetězec či kryptografii (rozšíření `SecurityMeasuresTableV2` seznamu: `RULES`), stačí přidat položku do vnitřně zakódovaného JSONu a engine je sám projede filtrem a zapíše jako nové sub-stepy.

Rozšiřování datového modelu se odehrává v rodiči: `ImplementationModuleV2`, kde je třeba rozšířit definici `useState(moduleData)` o příslušný atribut nového modulu (např. `supplyChain: {}`). Následně jej propasovat do komponenty (tzv. Component drilling).
