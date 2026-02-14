/**
 * Logika pro určení compliance úrovně podle vyhlášky o regulovaných službách NIS2
 */

export function determineComplianceLevel({ companySize, sector, services, specialCriteria = {} }) {

  let hasHigherService = false;
  let hasLowerService = false;
  let reasoning = '';

  // Projdeme všechny vybrané služby
  for (const serviceId of services) {
    const result = evaluateService(serviceId, companySize, specialCriteria);
    
    if (result.level === 'higher') {
      hasHigherService = true;
      reasoning = result.reasoning;
      break; // Vyšší povinnost má absolutní přednost, můžeme skončit hledání
    } else if (result.level === 'lower') {
      hasLowerService = true;
      // Pokud zatím nemáme vyšší, uložíme si důvod pro nižší (pro případ, že nenajdeme vyšší)
      if (!hasHigherService) { 
        reasoning = result.reasoning;
      }
    }
  }

  if (hasHigherService) {
    return { level: 'higher', reasoning: reasoning };
  }

  if (hasLowerService) {
    return { level: 'lower', reasoning: reasoning };
  }

  return {
    level: 'none',
    reasoning: 'Podle vybraných služeb a velikosti podniku nespadáte pod povinnosti NIS2.'
  };
}

function evaluateService(serviceId, companySize, specialCriteria) {
  const isLarge = companySize === 'Velká';
  const isMedium = companySize === 'Střední';
  const isSmall = companySize === 'Malá';
  const isMicro = companySize === 'Mikro';

  // ═══════════════════════════════════════════════════════════════════════
  // 1. VEŘEJNÁ SPRÁVA
  // ═══════════════════════════════════════════════════════════════════════
  const higherAdminServices = [
    '1.1.a', '1.1.b', '1.1.c', '1.1.d', '1.1.e', '1.1.f', '1.1.g', 
    '1.1.h', '1.1.i', '1.1.j', '1.1.k', '1.1.l', '1.1.m', '1.1.n', 
    '1.1.o', '1.1.p', '1.1.q', '1.1.r', '1.1.s', '1.1.t'
  ];
  
  const lowerAdminServices = [
    '1.2.a', '1.2.b', '1.2.c', '1.2.d', '1.2.e', '1.2.f'
  ];

  if (higherAdminServices.includes(serviceId)) {
    return { level: 'higher', reasoning: 'Subjekt veřejné správy v režimu vyšších povinností (např. ústřední orgán, kraj, policie).' };
  }

  if (lowerAdminServices.includes(serviceId)) {
    return { level: 'lower', reasoning: 'Subjekt veřejné správy v režimu nižších povinností (např. ORP, VŠ, komora).' };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 2. ENERGETIKA - ELEKTŘINA
  // ═══════════════════════════════════════════════════════════════════════

  if (serviceId === '2.1') { // Výroba elektřiny
    if (isLarge) return { level: 'higher', reasoning: 'Velký podnik vyrábějící elektřinu.' };
    if (specialCriteria['2.1'] === true) {
      return { level: 'higher', reasoning: 'Výroba elektřiny s instalovaným výkonem ≥100 MW.' };
    }
    if (isMedium) return { level: 'lower', reasoning: 'Střední podnik vyrábějící elektřinu.' };
    return { level: 'none', reasoning: 'Malé podniky a mikropodniky u této služby nespadají pod NIS2.' };
  }

  if (serviceId === '2.2') {
    return { level: 'higher', reasoning: 'Přenosová soustava elektřiny vždy spadá pod vyšší povinnosti.' };
  }

  if (serviceId === '2.3') { // Distribuce elektřiny
    if (isLarge) return { level: 'higher', reasoning: 'Velký podnik provozující distribuční soustavu elektřiny.' };
    if (specialCriteria['2.3'] === true) {
      return { level: 'higher', reasoning: 'Distribuční soustava s ≥90 000 odběrnými místy.' };
    }
    if (isMedium) return { level: 'lower', reasoning: 'Střední podnik provozující distribuční soustavu elektřiny.' };
    return { level: 'none', reasoning: 'Malé podniky a mikropodniky u této služby nespadají pod NIS2.' };
  }

  if (['2.4', '2.6', '2.7', '2.8'].includes(serviceId)) {
    if (isLarge) return { level: 'higher', reasoning: 'Velký podnik v energetice.' };
    if (isMedium) return { level: 'lower', reasoning: 'Střední podnik v energetice.' };
    return { level: 'none', reasoning: 'Malé podniky a mikropodniky u této služby nespadají pod NIS2.' };
  }

  if (serviceId === '2.5') {
    return { level: 'higher', reasoning: 'Organizátor trhu s elektřinou vždy spadá pod vyšší povinnosti.' };
  }

  if (serviceId === '2.9') { // Dobíjecí stanice
    if (isLarge) return { level: 'higher', reasoning: 'Velký provozovatel dobíjecích stanic.' };
    if (isMedium) return { level: 'lower', reasoning: 'Střední provozovatel dobíjecích stanic.' };
    return { level: 'none', reasoning: 'Malé podniky a mikropodniky u této služby nespadají pod NIS2.' };
  }

  if (serviceId === '2.10') {
    return { level: 'higher', reasoning: 'Elektroenergetické datové centrum vždy spadá pod vyšší povinnosti.' };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 3. ENERGETIKA - ROPA
  // ═══════════════════════════════════════════════════════════════════════

  if (['3.1', '3.2', '3.3', '3.4', '3.5'].includes(serviceId)) {
    if (isLarge) return { level: 'higher', reasoning: 'Velký podnik v ropném sektoru.' };
    if (isMedium) return { level: 'lower', reasoning: 'Střední podnik v ropném sektoru.' };
    return { level: 'none', reasoning: 'Malé podniky a mikropodniky u této služby nespadají pod NIS2.' };
  }

  if (serviceId === '3.6') {
    return { level: 'higher', reasoning: 'Ústřední správce zásob ropy vždy spadá pod vyšší povinnosti.' };
  }

  if (serviceId === '3.7') { // Čerpací stanice
    if (specialCriteria['3.7'] === true) {
      return { level: 'lower', reasoning: 'Provozovatel alespoň 100 čerpacích stanic.' };
    }
    return { level: 'none', reasoning: 'Provozovatelé s méně než 100 čerpacími stanicemi nespadají pod NIS2.' };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 4. ENERGETIKA - PLYN
  // ═══════════════════════════════════════════════════════════════════════

  if (serviceId === '4.2') {
    return { level: 'higher', reasoning: 'Přepravní soustava plynu vždy spadá pod vyšší povinnosti.' };
  }

  if (serviceId === '4.3') { // Distribuce plynu
    if (isLarge) return { level: 'higher', reasoning: 'Velký podnik provozující distribuční soustavu plynu.' };
    if (specialCriteria['4.3'] === true) {
      return { level: 'higher', reasoning: 'Distribuční soustava plynu s kapacitou ≥1 000 MW.' };
    }
    if (isMedium) return { level: 'lower', reasoning: 'Střední podnik provozující distribuční soustavu plynu.' };
    return { level: 'none', reasoning: 'Malé podniky a mikropodniky u této služby nespadají pod NIS2.' };
  }

  if (['4.1', '4.4', '4.5'].includes(serviceId)) {
    if (isLarge) return { level: 'higher', reasoning: 'Velký podnik v plynárenském sektoru.' };
    if (isMedium) return { level: 'lower', reasoning: 'Střední podnik v plynárenském sektoru.' };
    return { level: 'none', reasoning: 'Malé podniky a mikropodniky u této služby nespadají pod NIS2.' };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 5. ENERGETIKA - TEPLÁRENSTVÍ
  // ═══════════════════════════════════════════════════════════════════════

  if (serviceId === '5.1') { // Výroba tepla
    if (specialCriteria['5.1'] === true) {
      return { level: 'higher', reasoning: 'Výroba tepelné energie s výkonem ≥50 MW.' };
    }
    if (isLarge) return { level: 'higher', reasoning: 'Velký podnik v teplárenství.' };
    if (isMedium) return { level: 'lower', reasoning: 'Střední podnik v teplárenství.' };
    return { level: 'none', reasoning: 'Malé podniky a mikropodniky u této služby nespadají pod NIS2.' };
  }

  if (serviceId === '5.2') {
    if (isLarge) return { level: 'higher', reasoning: 'Velký podnik v rozvodu tepelné energie.' };
    if (isMedium) return { level: 'lower', reasoning: 'Střední podnik v rozvodu tepelné energie.' };
    return { level: 'none', reasoning: 'Malé podniky a mikropodniky u této služby nespadají pod NIS2.' };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 6. ENERGETIKA - VODÍK
  // ═══════════════════════════════════════════════════════════════════════

  if (['6.1', '6.2', '6.3'].includes(serviceId)) {
    if (isLarge) return { level: 'higher', reasoning: 'Velký podnik v vodíkovém sektoru.' };
    if (isMedium) return { level: 'lower', reasoning: 'Střední podnik v vodíkovém sektoru.' };
    return { level: 'none', reasoning: 'Malé podniky a mikropodniky u této služby nespadají pod NIS2.' };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 7. VÝROBNÍ PRŮMYSL
  // ═══════════════════════════════════════════════════════════════════════

  if (serviceId === '7.4') { // Motorová vozidla
    if (specialCriteria['7.4'] === true) {
      return { level: 'higher', reasoning: 'Sériová výroba osobních motorových vozidel.' };
    }
    if (isLarge || isMedium) {
      return { level: 'lower', reasoning: 'Velký nebo střední podnik ve výrobě motorových vozidel.' };
    }
    return { level: 'none', reasoning: 'Malé podniky a mikropodniky u této služby nespadají pod NIS2.' };
  }

  if (['7.1', '7.2', '7.3', '7.5'].includes(serviceId)) {
    if (isLarge || isMedium) {
      return { level: 'lower', reasoning: 'Velký nebo střední podnik ve výrobním průmyslu.' };
    }
    return { level: 'none', reasoning: 'Malé podniky a mikropodniky u této služby nespadají pod NIS2.' };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 8. POTRAVINÁŘSKÝ PRŮMYSL
  // ═══════════════════════════════════════════════════════════════════════

  if (['8.1', '8.2', '8.3'].includes(serviceId)) {
    if (isLarge || isMedium) {
      return { level: 'lower', reasoning: 'Velký nebo střední podnik v potravinářském průmyslu.' };
    }
    return { level: 'none', reasoning: 'Malé podniky a mikropodniky u této služby nespadají pod NIS2.' };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 9. CHEMICKÝ PRŮMYSL
  // ═══════════════════════════════════════════════════════════════════════

  if (serviceId === '9.4') {
    if (specialCriteria['9.4'] === true) {
      return { level: 'higher', reasoning: 'Objekt zařazený do skupiny B (vyšší práh nebezpečných látek).' };
    }
    if (isLarge || isMedium) {
      return { level: 'lower', reasoning: 'Objekt zařazený do skupiny A (nižší práh).' };
    }
    return { level: 'none', reasoning: 'Malé podniky a mikropodniky u této služby nespadají pod NIS2.' };
  }

  if (['9.1', '9.2', '9.3'].includes(serviceId)) {
    if (isLarge || isMedium) {
      return { level: 'lower', reasoning: 'Velký nebo střední podnik v chemickém průmyslu.' };
    }
    return { level: 'none', reasoning: 'Malé podniky a mikropodniky u této služby nespadají pod NIS2.' };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 10. VODNÍ HOSPODÁŘSTVÍ
  // ═══════════════════════════════════════════════════════════════════════

  if (['10.1', '10.2'].includes(serviceId)) {
    if (isLarge) return { level: 'higher', reasoning: 'Velký podnik ve vodním hospodářství.' };
    if (isMedium) return { level: 'lower', reasoning: 'Střední podnik ve vodním hospodářství.' };
    return { level: 'none', reasoning: 'Malé podniky a mikropodniky u této služby nespadají pod NIS2.' };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 11. ODPADOVÉ HOSPODÁŘSTVÍ
  // ═══════════════════════════════════════════════════════════════════════

  if (['11.1', '11.2', '11.3', '11.4'].includes(serviceId)) {
    if (isLarge || isMedium) {
      return { level: 'lower', reasoning: 'Velký nebo střední podnik v odpadovém hospodářství.' };
    }
    return { level: 'none', reasoning: 'Malé podniky a mikropodniky u této služby nespadají pod NIS2.' };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 12. LETECKÁ DOPRAVA
  // ═══════════════════════════════════════════════════════════════════════

  if (['12.1', '12.2', '12.3'].includes(serviceId)) {
    if (isLarge) return { level: 'higher', reasoning: 'Velký podnik v letecké dopravě.' };
    if (isMedium) return { level: 'lower', reasoning: 'Střední podnik v letecké dopravě.' };
    return { level: 'none', reasoning: 'Malé podniky a mikropodniky u této služby nespadají pod NIS2.' };
  }

  if (serviceId === '12.4') {
    return { level: 'higher', reasoning: 'Letové navigační služby vždy spadají pod vyšší povinnosti.' };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 13. DRÁŽNÍ DOPRAVA
  // ═══════════════════════════════════════════════════════════════════════

  if (serviceId === '13.1') {
    return { level: 'higher', reasoning: 'Provozování železniční dopravní cesty vždy spadá pod vyšší povinnosti.' };
  }

  if (['13.2', '13.3', '13.4', '13.5', '13.6', '13.7', '13.8'].includes(serviceId)) {
    if (isLarge) return { level: 'higher', reasoning: 'Velký podnik v drážní dopravě.' };
    if (isMedium) return { level: 'lower', reasoning: 'Střední podnik v drážní dopravě.' };
    return { level: 'none', reasoning: 'Malé podniky a mikropodniky u této služby nespadají pod NIS2.' };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 14. NÁMOŘNÍ DOPRAVA
  // ═══════════════════════════════════════════════════════════════════════

  if (['14.1', '14.2', '14.3', '14.4'].includes(serviceId)) {
    if (isLarge) return { level: 'higher', reasoning: 'Velký podnik v námořní dopravě.' };
    if (isMedium) return { level: 'lower', reasoning: 'Střední podnik v námořní dopravě.' };
    return { level: 'none', reasoning: 'Malé podniky a mikropodniky u této služby nespadají pod NIS2.' };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 15. SILNIČNÍ DOPRAVA
  // ═══════════════════════════════════════════════════════════════════════

  if (['15.1', '15.2'].includes(serviceId)) {
    if (isLarge) return { level: 'higher', reasoning: 'Velký správce komunikací nebo ITS.' };
    if (isMedium) return { level: 'lower', reasoning: 'Střední správce komunikací nebo ITS.' };
    return { level: 'none', reasoning: 'Malé podniky a mikropodniky u této služby nespadají pod NIS2.' };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 16. DIGITÁLNÍ INFRASTRUKTURA
  // ═══════════════════════════════════════════════════════════════════════

  if (serviceId === '16.1') { // Elektronické komunikace
    // I. VYŠŠÍ: a) velký/střední NEBO b) ≥350k SIM NEBO c) ≥100k přípojek
    if (isLarge || isMedium) {
      return { level: 'higher', reasoning: 'Velký nebo střední podnik poskytující veřejně dostupné služby elektronických komunikací.' };
    }
    if (specialCriteria['16.1'] === true) {
      return { level: 'higher', reasoning: 'Poskytovatel s ≥350 000 SIM kartami nebo ≥100 000 pevnými přípojkami.' };
    }
    // II. NIŽŠÍ: malý/mikro (pokud nesplní vyšší)
    if (isSmall || isMicro) {
      return { level: 'lower', reasoning: 'Malý podnik nebo mikropodnik poskytující veřejně dostupné služby elektronických komunikací.' };
    }
  }

  if (serviceId === '16.2') { // Veřejná komunikační síť
    if (isLarge || isMedium) {
      return { level: 'higher', reasoning: 'Velký nebo střední podnik zajišťující veřejnou komunikační síť.' };
    }
    if (specialCriteria['16.2'] === true) {
      return { level: 'higher', reasoning: 'Poskytovatel s ≥350 000 SIM kartami nebo ≥100 000 pevnými přípojkami.' };
    }
    if (isSmall || isMicro) {
      return { level: 'lower', reasoning: 'Malý podnik nebo mikropodnik zajišťující veřejnou komunikační síť.' };
    }
  }

  if (serviceId === '16.3') { // IXP
    if (isLarge) return { level: 'higher', reasoning: 'Velký poskytovatel služby IXP.' };
    if (specialCriteria['16.3'] === true) {
      return { level: 'higher', reasoning: 'IXP s propojením ≥100 nezávislých sítí a tokem ≥1 Tbps.' };
    }
    if (isMedium) return { level: 'lower', reasoning: 'Střední poskytovatel služby IXP.' };
    return { level: 'none', reasoning: 'Malé podniky a mikropodniky u této služby nespadají pod NIS2.' };
  }

  if (serviceId === '16.4') { // DNS
    if (specialCriteria['16.4'] === true) {
      return { level: 'higher', reasoning: 'DNS služba pro rekurzivní překlad nebo autoritativní překlad pro >10 000 domén.' };
    }
    return { level: 'none', reasoning: 'DNS služby bez splnění kritérií nespadají pod NIS2.' };
  }

  if (serviceId === '16.5') { // Registrátor .cz
    if (specialCriteria['16.5'] === true) {
      return { level: 'lower', reasoning: 'Registrátor s >100 000 doménami .cz.' };
    }
    return { level: 'none', reasoning: 'Registrátoři s méně než 100 000 doménami nespadají pod NIS2.' };
  }

  if (serviceId === '16.6') {
    return { level: 'higher', reasoning: 'Registr TLD (.cz) vždy spadá pod vyšší povinnosti.' };
  }

  if (serviceId === '16.7') {
    return { level: 'higher', reasoning: 'Správa domény gov.cz vždy spadá pod vyšší povinnosti.' };
  }

  if (serviceId === '16.8') { // Cloud
    if (isLarge) return { level: 'higher', reasoning: 'Velký poskytovatel cloud computingu.' };
    if (specialCriteria['16.8'] === true) {
      return { level: 'higher', reasoning: 'Poskytovatel státního cloud computingu.' };
    }
    if (isMedium) return { level: 'lower', reasoning: 'Střední poskytovatel cloud computingu.' };
    return { level: 'none', reasoning: 'Malé podniky a mikropodniky u této služby nespadají pod NIS2.' };
  }

  if (serviceId === '16.9') { // Datové centrum
    if (isLarge) return { level: 'higher', reasoning: 'Velký poskytovatel služby datového centra.' };
    if (isMedium) return { level: 'lower', reasoning: 'Střední poskytovatel služby datového centra.' };
    return { level: 'none', reasoning: 'Malé podniky a mikropodniky u této služby nespadají pod NIS2.' };
  }

  if (serviceId === '16.10') { // CDN
    if (isLarge) return { level: 'higher', reasoning: 'Velký poskytovatel CDN.' };
    if (isMedium) return { level: 'lower', reasoning: 'Střední poskytovatel CDN.' };
    return { level: 'none', reasoning: 'Malé podniky a mikropodniky u této služby nespadají pod NIS2.' };
  }

  if (serviceId === '16.11') {
    return { level: 'higher', reasoning: 'Kvalifikovaný systém elektronické identifikace vždy spadá pod vyšší povinnosti.' };
  }

  if (serviceId === '16.12') { // Služby vytvářející důvěru (Trust Services)
    if (specialCriteria['16.12'] === true) {
      return { level: 'higher', reasoning: 'Kvalifikovaný poskytovatel služby vytvářející důvěru (eIDAS).' };
    }
    if (isLarge) {
      return { level: 'higher', reasoning: 'Velký nekvalifikovaný poskytovatel služby vytvářející důvěru.' };
    }
    if (isMedium || isSmall || isMicro) {
      return { level: 'lower', reasoning: 'Střední, malý nebo mikropodnik poskytující nekvalifikované služby vytvářející důvěru.' };
    }
  }

  if (['16.13', '16.14'].includes(serviceId)) { // MSP, MSSP
    if (isLarge) return { level: 'higher', reasoning: 'Velký poskytovatel řízených služeb.' };
    if (isMedium) return { level: 'lower', reasoning: 'Střední poskytovatel řízených služeb.' };
    return { level: 'none', reasoning: 'Malé podniky a mikropodniky u této služby nespadají pod NIS2.' };
  }

  if (['16.15', '16.16', '16.17'].includes(serviceId)) { // Platformy, Vyhledávače, Socky
    if (isLarge || isMedium) {
      return { level: 'lower', reasoning: 'Velký nebo střední poskytovatel online platformy.' };
    }
    return { level: 'none', reasoning: 'Malé podniky a mikropodniky u této služby nespadají pod NIS2.' };
  }

  if (serviceId === '16.18') {
    return { level: 'higher', reasoning: 'Národní CERT vždy spadá pod vyšší povinnosti.' };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 17. FINANČNÍ TRH
  // ═══════════════════════════════════════════════════════════════════════

  if (['17.1', '17.2', '17.3'].includes(serviceId)) {
    if (isLarge) return { level: 'higher', reasoning: 'Velká úvěrová instituce nebo provozovatel trhu.' };
    if (isMedium) return { level: 'lower', reasoning: 'Střední úvěrová instituce nebo provozovatel trhu.' };
    return { level: 'none', reasoning: 'Malé podniky a mikropodniky u této služby nespadají pod NIS2.' };
  }

  if (serviceId === '17.4') { // Platební instituce
    if (specialCriteria['17.4'] === true) {
      return { level: 'higher', reasoning: 'Platební instituce s objemem >1 bilion Kč ročně.' };
    }
    return { level: 'none', reasoning: 'Platební instituce s nižším objemem nespadá pod NIS2.' };
  }

  if (serviceId === '17.5') { // E-peníze
    if (specialCriteria['17.5'] === true) {
      return { level: 'higher', reasoning: 'Instituce elektronických peněz s objemem >500 miliard Kč ročně.' };
    }
    return { level: 'none', reasoning: 'Instituce e-peněz s nižším objemem nespadá pod NIS2.' };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 18. ZDRAVOTNICTVÍ
  // ═══════════════════════════════════════════════════════════════════════

  if (serviceId === '18.1') { // Poskytování péče
    if (specialCriteria['18.1'] === true) {
      return { level: 'higher', reasoning: 'Organizační složka státu poskytující zdravotní péči.' };
    }
    if (isLarge) return { level: 'higher', reasoning: 'Velký poskytovatel zdravotní péče.' };
    if (isMedium) return { level: 'lower', reasoning: 'Střední poskytovatel zdravotní péče.' };
    return { level: 'none', reasoning: 'Malé podniky a mikropodniky u této služby nespadají pod NIS2.' };
  }

  if (serviceId === '18.2') {
    return { level: 'higher', reasoning: 'Zdravotnická záchranná služba vždy spadá pod vyšší povinnosti.' };
  }

  if (['18.3', '18.4', '18.5', '18.6', '18.9'].includes(serviceId)) {
    if (isLarge) return { level: 'higher', reasoning: 'Velký podnik ve zdravotnickém sektoru.' };
    if (isMedium) return { level: 'lower', reasoning: 'Střední podnik ve zdravotnickém sektoru.' };
    return { level: 'none', reasoning: 'Malé podniky a mikropodniky u této služby nespadají pod NIS2.' };
  }

  if (['18.7', '18.8'].includes(serviceId)) {
    if (isLarge || isMedium) {
      return { level: 'lower', reasoning: 'Velký nebo střední výrobce zdravotnických prostředků.' };
    }
    return { level: 'none', reasoning: 'Malé podniky a mikropodniky u této služby nespadají pod NIS2.' };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 19. VĚDA, VÝZKUM A VZDĚLÁVÁNÍ (19.1)
  // ═══════════════════════════════════════════════════════════════════════
  if (serviceId === '19.1') {
    const criteriaData = specialCriteria['19.1'] || {};
    
    // Typy subjektů
    const isPublicOrUni = criteriaData['q1_org'] === true; // Veřejná inst., VŠ, EU org.
    const isPrivateInst = criteriaData['q2_inst'] === true; // "Výzkumná instituce" (komerční/soukromá)
    
    // Rizikové faktory
    const isMilitaryResearch = criteriaData['q3_sens'] === true; // Citlivá činnost
    const selectedTechs = criteriaData.checklist || [];
    const higherTechs = ['tech_semi', 'tech_ai', 'tech_quantum', 'tech_bio'];
    const hasHigherTech = selectedTechs.some(t => higherTechs.includes(t));
    
    const lowerTechs = [
      'tech_conn', 'tech_sensing', 'tech_space', 
      'tech_energy', 'tech_robotics', 'tech_materials'
    ];
    const hasLowerTech = selectedTechs.some(t => lowerTechs.includes(t));

    // Pokud není vybrán typ subjektu, nelze rozhodnout
    if (!isPublicOrUni && !isPrivateInst) {
      return {
        level: 'none',
        reasoning: 'Nejste výzkumnou organizací, veřejnou institucí ani vysokou školou podle definice zákona.'
      };
    }

    // 1. REŽIM VYŠŠÍCH POVINNOSTÍ (Higher Obligations)
    // Má přednost před čímkoliv jiným (vojenský materiál nebo kritické technologie I)
    if (isMilitaryResearch) {
      return {
        level: 'higher',
        reasoning: 'Provádění citlivé výzkumné činnosti (vojenský materiál) spadá vždy do režimu vyšších povinností.'
      };
    }

    if (hasHigherTech) {
      return {
        level: 'higher',
        reasoning: 'Aplikovaný výzkum v oblasti kritických technologií (AI, polovodiče, kvantové, bio) spadá do režimu vyšších povinností.'
      };
    }

    // 2. REŽIM NIŽŠÍCH POVINNOSTÍ (Lower Obligations)
    
    // A) Veřejné instituce / VŠ -> spadají sem, pokud dělají výzkum v tech. oblasti II
    if (isPublicOrUni && hasLowerTech) {
      return {
        level: 'lower',
        reasoning: 'Veřejná výzkumná instituce nebo VŠ provádějící výzkum v regulovaných oblastech.'
      };
    }

    // B) Soukromé "Výzkumné instituce"
    // Vyhláška: "Výzkumná instituce je poskytovatelem... v režimu nižších povinností v případě, že je velkým nebo středním podnikem."
    if (isPrivateInst) {
      if (isLarge || isMedium) {
        return {
          level: 'lower',
          reasoning: 'Jako velká nebo střední výzkumná instituce spadáte do režimu nižších povinností.'
        };
      }
    }

    // Pokud nic z výše uvedeného neplatí
    return {
      level: 'none',
      reasoning: 'Nesplňujete kritéria pro zařazení do regulace (např. malá soukromá instituce nebo výzkum mimo kritické oblasti).'
    };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 20. POŠTOVNÍ A KURÝRNÍ SLUŽBY
  // ═══════════════════════════════════════════════════════════════════════

  if (['20.1', '20.2'].includes(serviceId)) {
    if (isLarge || isMedium) {
      return { level: 'lower', reasoning: 'Velký nebo střední poskytovatel poštovních nebo kurýrních služeb.' };
    }
    return { level: 'none', reasoning: 'Malé podniky a mikropodniky u této služby nespadají pod NIS2.' };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 21. OBRANNÝ PRŮMYSL
  // ═══════════════════════════════════════════════════════════════════════

  if (['21.1', '21.2'].includes(serviceId)) {
    if (isLarge) return { level: 'higher', reasoning: 'Velký podnik v obranném průmyslu.' };
    if (isMedium) return { level: 'lower', reasoning: 'Střední podnik v obranném průmyslu.' };
    return { level: 'none', reasoning: 'Malé podniky a mikropodniky u této služby nespadají pod NIS2.' };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 22. VESMÍRNÝ PRŮMYSL
  // ═══════════════════════════════════════════════════════════════════════

  if (serviceId === '22.1') {
    if (isLarge) return { level: 'higher', reasoning: 'Velký provozovatel kosmické infrastruktury.' };
    if (isMedium) return { level: 'lower', reasoning: 'Střední provozovatel kosmické infrastruktury.' };
    return { level: 'none', reasoning: 'Malé podniky a mikropodniky u této služby nespadají pod NIS2.' };
  }

  // Výchozí fallback pro velké a střední podniky u služeb, které nemají specifické výjimky
  if (isLarge) return { level: 'higher', reasoning: 'Velký podnik poskytující regulovanou službu.' };
  if (isMedium) return { level: 'lower', reasoning: 'Střední podnik poskytující regulovanou službu.' };
  
  return { level: 'none', reasoning: 'Malé podniky a mikropodniky u této služby obecně nespadají pod NIS2.' };
}

export function getComplianceLevelDescription(level) {
  const descriptions = {
    'none': {
      title: 'Vaše firma nespadá pod NIS2',
      description: 'Podle poskytovaných služeb a velikosti podniku nejste poskytovatelem regulované služby podle směrnice NIS2.',
      color: 'green'
    },
    'lower': {
      title: 'Režim nižších povinností',
      description: 'Vaše firma spadá pod směrnici NIS2 s nižšími bezpečnostními a oznamovacími povinnostmi.',
      color: 'orange'
    },
    'higher': {
      title: 'Režim vyšších povinností',
      description: 'Vaše firma spadá pod směrnici NIS2 s přísnějšími bezpečnostními a oznamovacími povinnostmi.',
      color: 'red'
    }
  };

  return descriptions[level] || descriptions['none'];
}