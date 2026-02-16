import React from 'react';
import { pdf, Document, Page, Text, View, StyleSheet, Font, Svg, Path } from '@react-pdf/renderer';
import CryptoJS from 'crypto-js';

// ... (rest of imports/data)

const colors = {
  brand: '#BF5AF2',      // Apple Purple
  brandDark: '#AF52DE',  // Deep Purple
  success: '#32D74B',    // Apple Green
  warning: '#FF9F0A',    // Apple Orange
  danger: '#FF453A',     // Apple Red
  textMain: '#1C1C1E',   // Dark Gray (for printed paper - keeping it readable, strict black #000000 might be too harsh for text on white paper, but prompt said "Vše v černé (#000000) a fialové". I will use Black for headers.)
  textSec: '#6e6e73',    // Light Gray
  bgPage: '#FFFFFF',     // White paper
  white: '#FFFFFF',
  border: '#E5E5EA',
  black: '#000000'
};
const SERVICES_DATA_DB = {
  "Veřejná správa": [{ id: '1.1', label: 'Výkon svěřených pravomocí' }],
  "Energetika – Elektřina": [
    { id: '2.1', label: 'Výroba elektřiny' },
    { id: '2.2', label: 'Provoz přenosové soustavy elektřiny' },
    { id: '2.3', label: 'Provoz distribuční soustavy elektřiny' },
    { id: '2.4', label: 'Obchod s elektřinou' },
    { id: '2.5', label: 'Činnost nominovaného organizátora trhu' },
    { id: '2.6', label: 'Agregace elektřiny' },
    { id: '2.7', label: 'Ukládání elektřiny' },
    { id: '2.8', label: 'Odezva strany poptávky' },
    { id: '2.9', label: 'Provoz veřejně přístupné dobíjecí stanice' },
    { id: '2.10', label: 'Činnost Elektroenergetického datového centra' }
  ],
  "Energetika – Ropa a ropné produkty": [
    { id: '3.1', label: 'Těžba ropy' },
    { id: '3.2', label: 'Zpracovávání ropy' },
    { id: '3.3', label: 'Provoz skladovacího zařízení pro skladování ropy' },
    { id: '3.4', label: 'Provoz ropovodu' },
    { id: '3.5', label: 'Provoz produktovodu' },
    { id: '3.6', label: 'Činnost ústředního správce zásob' },
    { id: '3.7', label: 'Provoz veřejně přístupné čerpací stanice' }
  ],
  "Energetika – Zemní plyn": [
    { id: '4.1', label: 'Výroba zemního plynu' },
    { id: '4.2', label: 'Provoz přepravní soustavy zemního plynu' },
    { id: '4.3', label: 'Provoz distribuční soustavy zemního plynu' },
    { id: '4.4', label: 'Obchod se zemním plynem' },
    { id: '4.5', label: 'Uskladňování zemního plynu' }
  ],
  "Energetika – Teplárenství": [
    { id: '5.1', label: 'Výroba tepelné energie' },
    { id: '5.2', label: 'Provoz soustavy zásobování tepelnou energií' }
  ],
  "Energetika – Vodík": [
    { id: '6.1', label: 'Výroba vodíku' },
    { id: '6.2', label: 'Skladování vodíku' },
    { id: '6.3', label: 'Přeprava vodíku' }
  ],
  "Výrobní průmysl": [
    { id: '7.1', label: 'Výroba počítačů, elektronických a optických přístrojů' },
    { id: '7.2', label: 'Výroba elektrických zařízení' },
    { id: '7.3', label: 'Výroba strojů a zařízení' },
    { id: '7.4', label: 'Výroba motorových vozidel, přívěsů a návěsů' },
    { id: '7.5', label: 'Výroba ostatních dopravních prostředků' }
  ],
  "Potravinářský průmysl": [
    { id: '8.1', label: 'Průmyslová výroba potravin' },
    { id: '8.2', label: 'Průmyslové zpracování potravin' },
    { id: '8.3', label: 'Velkoobchodní distribuce potravin' }
  ],
  "Chemický průmysl": [
    { id: '9.1', label: 'Výroba chemických látek podléhajících registraci' },
    { id: '9.2', label: 'Uvádění chemických látek na trh' },
    { id: '9.3', label: 'Výroba předmětů podléhajících registraci' },
    { id: '9.4', label: 'Užívání objektu za účelem umístění nebezpečné látky' }
  ],
  "Vodní hospodářství": [
    { id: '10.1', label: 'Provozování vodovodu sloužícího veřejné potřebě' },
    { id: '10.2', label: 'Provozování kanalizace sloužící veřejné potřebě' }
  ],
  "Odpadové hospodářství": [
    { id: '11.1', label: 'Provoz zařízení určeného pro nakládání s odpady' },
    { id: '11.2', label: 'Obchodování s odpadem' },
    { id: '11.3', label: 'Zprostředkování nakládání s odpadem' },
    { id: '11.4', label: 'Přeprava odpadu' }
  ],
  "Letecká doprava": [
    { id: '12.1', label: 'Provoz obchodní letecké dopravy' },
    { id: '12.2', label: 'Provoz mezinárodního letiště' },
    { id: '12.3', label: 'Provoz pomocných zařízení letiště' },
    { id: '12.4', label: 'Letové navigační služby' }
  ],
  "Drážní doprava": [
    { id: '13.1', label: 'Provozování železniční dopravní cesty' },
    { id: '13.2', label: 'Provoz celostátní dráhy' },
    { id: '13.3', label: 'Provoz regionální dráhy' },
    { id: '13.4', label: 'Provoz veřejně přístupné vlečky' },
    { id: '13.5', label: 'Provoz drážní dopravy na celostátní dráze' },
    { id: '13.6', label: 'Provoz drážní dopravy na regionální dráze' },
    { id: '13.7', label: 'Provoz drážní dopravy na veřejně přístupné vlečce' },
    { id: '13.8', label: 'Provoz zařízení služeb' }
  ],
  "Námořní vodní doprava": [
    { id: '14.1', label: 'Činnost námořní vodní dopravy' },
    { id: '14.2', label: 'Provoz řídícího orgánu přístavu' },
    { id: '14.3', label: 'Provoz vodního díla nebo zařízení v přístavu' },
    { id: '14.4', label: 'Provoz služby lodní dopravě' }
  ],
  "Silniční doprava": [
    { id: '15.1', label: 'Řízení provozu na pozemních komunikacích' },
    { id: '15.2', label: 'Provoz inteligentního dopravního systému' }
  ],
  "Digitální infrastruktura a služby": [
    { id: '16.1', label: 'Poskytování veřejně dostupné služby elektronických komunikací' },
    { id: '16.2', label: 'Zajišťování veřejné komunikační sítě' },
    { id: '16.3', label: 'Poskytování služby výměnného uzlu internetu (IXP)' },
    { id: '16.4', label: 'Poskytování služby systému překladu doménových jmen (DNS)' },
    { id: '16.5', label: 'Poskytování služby registrace a správy doménových jmen' },
    { id: '16.6', label: 'Správa a provoz registru domény nejvyšší úrovně' },
    { id: '16.7', label: 'Správa a provoz domény gov.cz' },
    { id: '16.8', label: 'Poskytování služby cloud computingu' },
    { id: '16.9', label: 'Poskytování služby datového centra' },
    { id: '16.10', label: 'Poskytování služby sítě pro doručování obsahu (CDN)' },
    { id: '16.11', label: 'Správa kvalifikovaného systému elektronické identifikace' },
    { id: '16.12', label: 'Poskytování služby vytvářející důvěru' },
    { id: '16.13', label: 'Poskytování řízené služby (MSP)' },
    { id: '16.14', label: 'Poskytování řízené bezpečnostní služby (MSSP)' },
    { id: '16.15', label: 'Poskytování služby on-line tržiště' },
    { id: '16.16', label: 'Poskytování služby internetového vyhledávače' },
    { id: '16.17', label: 'Poskytování platformy sociální sítě' },
    { id: '16.18', label: 'Provozování Národního CERT' }
  ],
  "Finanční trh": [
    { id: '17.1', label: 'Činnost úvěrové instituce' },
    { id: '17.2', label: 'Provoz obchodního systému' },
    { id: '17.3', label: 'Činnost ústřední protistrany' },
    { id: '17.4', label: 'Činnost platební instituce' },
    { id: '17.5', label: 'Činnost instituce elektronických peněz' }
  ],
  "Zdravotnictví": [
    { id: '18.1', label: 'Poskytování zdravotní péče' },
    { id: '18.2', label: 'Poskytování zdravotnické záchranné služby' },
    { id: '18.3', label: 'Činnost referenční laboratoře EU' },
    { id: '18.4', label: 'Výzkum a vývoj humánních léčivých přípravků' },
    { id: '18.5', label: 'Výroba humánních léčivých přípravků' },
    { id: '18.6', label: 'Výroba léčivých látek' },
    { id: '18.7', label: 'Výroba zdravotnických prostředků' },
    { id: '18.8', label: 'Výroba diagnostických zdravotnických prostředků in vitro' },
    { id: '18.9', label: 'Výroba kriticky důležitých zdravotnických prostředků' }
  ],
  "Věda, výzkum a vzdělávání": [
    { id: '19.1', label: 'Výzkum a vývoj' }
  ],
  "Poštovní a kurýrní služby": [
    { id: '20.1', label: 'Poštovní služba' },
    { id: '20.2', label: 'Kurýrní služba' }
  ],
  "Obranný průmysl": [
    { id: '21.1', label: 'Výroba vojenského materiálu' },
    { id: '21.2', label: 'Obchod s vojenským materiálem' }
  ],
  "Vesmírný průmysl": [
    { id: '22.1', label: 'Zajištění podpory poskytování služeb využívajících kosmického prostoru' }
  ]
};

// ==========================================
// 2. DATA: OPATŘENÍ (Režim 410/2025: §3 - §14)
// ==========================================
const MEASURES_LOWER_410 = [
  { title: '§ 3 Systém a evidence opatření', article: '§ 3' },
  { title: '§ 4 Požadavky na vedení', article: '§ 4' },
  { title: '§ 5 Bezpečnost lidských zdrojů', article: '§ 5' },
  { title: '§ 6 Řízení kontinuity činností', article: '§ 6' },
  { title: '§ 7 Řízení přístupu', article: '§ 7' },
  { title: '§ 8 Řízení identit a oprávnění', article: '§ 8' },
  { title: '§ 9 Detekce a logování', article: '§ 9' },
  { title: '§ 10 Řešení incidentů', article: '§ 10' },
  { title: '§ 11 Bezpečnost sítí', article: '§ 11' },
  { title: '§ 12 Aplikační bezpečnost', article: '§ 12' },
  { title: '§ 13 Kryptografické algoritmy', article: '§ 13' },
  { title: '§ 14 Významnost dopadu', article: '§ 14' }
];

const MEASURES_HIGHER_409 = [
  { title: 'Systém řízení bezpečnosti (ISMS)', article: '§ 3-4' },
  { title: 'Bezpečnostní audity a kontroly', article: '§ 6' },
  { title: 'Bezpečnost dodavatelského řetězce', article: '§ 8' },
  { title: 'Bezpečnost lidských zdrojů', article: '§ 9' },
  { title: 'Vícefaktorová autentizace (MFA)', article: '§ 11' },
  { title: 'Kryptografická ochrana', article: '§ 12' },
  { title: 'Fyzická a environmentální bezpečnost', article: '§ 13' },
  { title: 'Bezpečný vývoj a údržba', article: '§ 16' },
  { title: 'Komplexní zvládání incidentů', article: '§ 20-22' },
  { title: 'Krizové řízení a obnova', article: '§ 23-25' }
];

// ==========================================
// 3. IMPLEMENTAČNÍ PLÁN (OSS STACK - Detailní texty)
// ==========================================
const IMPLEMENTATION_PLAN = [
  {
    section: "§ 3 Systém a § 4 Vedení",
    description: "Governance, evidence aktiv a odpovědnost vedení.",
    solution: "CISO Assistant jako centrální platforma pro řízení ISMS, evidenci opatření a hodnocení dodavatelů. Snipe-IT pro technickou evidenci aktiv. Tato kombinace zajišťuje podklady pro rozhodování vedení.",
    stack: ["CISO Assistant", "Snipe-IT"]
  },
  {
    section: "§ 5 Bezpečnost lidských zdrojů",
    description: "Politiky, školení a řízení lidského faktoru.",
    solution: "CISO Assistant pro řízení politik a evidenci školení. Snipe-IT pro adresné přiřazení aktiv. Volitelně Moodle pro e-learning a Gophish pro simulace phishingu.",
    stack: ["CISO Assistant", "Snipe-IT", "Moodle", "Gophish"]
  },
  {
    section: "§ 6 Řízení kontinuity činností",
    description: "Prioritizace obnovy, BIA a zálohování.",
    solution: "CISO Assistant pro BIA a plány obnovy. Snipe-IT pro určení kritičnosti aktiv. Restic pro šifrované, deduplikované zálohování (lokální i off-site).",
    stack: ["CISO Assistant", "Snipe-IT", "Restic"]
  },
  {
    section: "§ 7 Přístupy a § 8 Identity",
    description: "Řízení identit, MFA a správa hesel.",
    solution: "Keycloak jako centrální IdP pro MFA a SSO. Vaultwarden pro správu privilegovaných hesel (break-glass účty). CISO Assistant pro procesní řízení auditů přístupů.",
    stack: ["Keycloak", "Vaultwarden", "CISO Assistant"]
  },
  {
    section: "§ 9 Detekce a § 10 Incidenty",
    description: "Logování, IDS/IPS a řešení incidentů.",
    solution: "Suricata (IDS/IPS) na perimetru. Wazuh (XDR/SIEM) pro koncové stanice a centrální log management. CISO Assistant pro metodiku a hlášení incidentů. Matrix/Element pro bezpečnou komunikaci.",
    stack: ["Suricata", "Wazuh", "CISO Assistant", "Matrix/Element"]
  },
  {
    section: "§ 11 Bezpečnost sítí",
    description: "Segmentace, firewall a VPN.",
    solution: "OPNsense jako firewall a VPN koncentrátor (WireGuard/IPsec). Zajištění segmentace sítě (VLAN) a principu 'Deny by Default'.",
    stack: ["OPNsense"]
  },
  {
    section: "§ 12 Aplikační bezpečnost",
    description: "Patch management a řízení zranitelností.",
    solution: "OpenVAS (Greenbone) pro pravidelné skenování zranitelností. Snipe-IT pro sledování EOL systémů. CISO Assistant pro řízení nápravných opatření.",
    stack: ["OpenVAS", "Snipe-IT", "CISO Assistant"]
  },
  {
    section: "§ 13 Kryptografické prostředky",
    description: "PKI, šifrování a bezpečná komunikace.",
    solution: "EJBCA Community pro správu certifikátů a klíčů (PKI). Matrix/Element pro E2EE šifrovanou komunikaci. CISO Assistant pro kryptopolitiku.",
    stack: ["EJBCA", "Matrix/Element", "CISO Assistant"]
  },
  {
    section: "§ 14 Významnost dopadu",
    description: "Metodika hodnocení dopadů.",
    solution: "Implementace metodiky v CISO Assistant pro stanovení únosné míry újmy a klasifikaci incidentů pro účely hlášení regulátorovi.",
    stack: ["CISO Assistant"]
  }
];

// ==========================================
// 4. DESIGN SYSTEM 
// ==========================================
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 500 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf', fontStyle: 'italic' },
  ],
});



const styles = StyleSheet.create({
  page: { fontFamily: 'Roboto', backgroundColor: colors.bgPage, paddingBottom: 60 },

  // -- Header Area  --
  headerStrip: { height: 8, backgroundColor: colors.brand },
  header: { padding: 40, paddingBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.white },
  logoText: { fontSize: 22, fontWeight: 700, color: colors.black },
  logoSub: { fontSize: 10, color: colors.textSec, textTransform: 'uppercase', letterSpacing: 1 },
  dateBlock: { alignItems: 'flex-end' },
  dateLabel: { fontSize: 8, color: colors.textSec },
  dateValue: { fontSize: 10, fontWeight: 500, color: colors.black },

  // -- Main Card --
  card: { marginHorizontal: 40, marginTop: 20, padding: 25, backgroundColor: colors.white, borderRadius: 8, border: `1px solid ${colors.border}` },

  // Result Badge
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, alignItems: 'center' },
  badgeText: { fontSize: 11, fontWeight: 700, color: colors.white, textTransform: 'uppercase' },

  // Score Circle
  scoreBlock: { alignItems: 'flex-end' },
  scoreBig: { fontSize: 32, fontWeight: 700, color: colors.brand },
  scoreLabel: { fontSize: 9, color: colors.textSec, textTransform: 'uppercase' },

  // Info Grid
  grid: { flexDirection: 'row', borderTop: `1px solid ${colors.border}`, paddingTop: 15, marginTop: 5 },
  col: { flex: 1 },
  label: { fontSize: 8, color: colors.textSec, textTransform: 'uppercase', marginBottom: 4 },
  value: { fontSize: 11, fontWeight: 500, color: colors.black },

  // Reasoning
  reasonBox: { marginTop: 20, padding: 12, backgroundColor: '#F5F5F7', borderRadius: 6, borderLeft: `3px solid ${colors.brand}` },
  reasonText: { fontSize: 10, color: colors.black, lineHeight: 1.4 },

  // -- Content Sections --
  sectionTitle: { fontSize: 14, fontWeight: 700, color: colors.black, marginTop: 30, marginBottom: 15, marginLeft: 40, textTransform: 'uppercase', letterSpacing: 0.5 },

  // Tables (Gap Analysis)
  tableContainer: { marginHorizontal: 40, borderRadius: 4, overflow: 'hidden', border: `1px solid ${colors.black}` },
  tableHeader: { flexDirection: 'row', backgroundColor: '#F2F2F7', paddingVertical: 8, paddingHorizontal: 10, borderBottom: `1px solid ${colors.black}` },
  tableRow: { flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 10, borderBottom: `1px solid ${colors.border}`, alignItems: 'flex-start' },
  th: { fontSize: 9, fontWeight: 700, color: colors.black, textTransform: 'uppercase' },
  tdTitle: { fontSize: 10, color: colors.black, fontWeight: 500 },
  tdArt: { fontSize: 9, color: colors.black },
  tdGray: { fontSize: 9, color: colors.textSec },

  // Implementation Plan (OSS Stack) - přizpůsobeno designu
  implCard: { marginHorizontal: 40, marginBottom: 12, padding: 15, backgroundColor: colors.white, borderRadius: 8, border: `1px solid ${colors.border}` },
  implTitle: { fontSize: 10, fontWeight: 700, color: colors.brand, marginBottom: 4 },
  implDesc: { fontSize: 9, color: colors.textSec, marginBottom: 6, fontStyle: 'italic' },
  implSol: { fontSize: 9, color: colors.black, lineHeight: 1.4, marginBottom: 8 },
  stackRow: { flexDirection: 'row', flexWrap: 'wrap' },
  stackBadge: { backgroundColor: '#F2F2F7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, marginRight: 6, border: '1px solid #E5E5EA' },
  stackText: { fontSize: 8, color: colors.black, fontWeight: 500 },

  // Footer
  footer: { position: 'absolute', bottom: 20, left: 40, right: 40, textAlign: 'center', borderTop: `1px solid ${colors.border}`, paddingTop: 10 },
  footerText: { fontSize: 8, color: colors.textSec, marginBottom: 4 }
});

// ==========================================
// 5. IKONY 
// ==========================================

const IconCheck = () => (
  <Svg width="12" height="12" viewBox="0 0 24 24">
    <Path d="M20 6L9 17l-5-5" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Svg>
);

const IconCross = () => (
  <Svg width="12" height="12" viewBox="0 0 24 24">
    <Path d="M18 6L6 18M6 6l12 12" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Svg>
);


const IconShield = () => (
  <Svg width="40" height="40" viewBox="0 0 24 24">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#3B82F6" opacity={0.1} />
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Svg>
);

const ProgressBar = ({ percent }) => (
  <View style={{ marginTop: 20 }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
      <Text style={{ fontSize: 9, fontWeight: 700, color: colors.textSec }}>STAV IMPLEMENTACE</Text>
      <Text style={{ fontSize: 9, fontWeight: 700, color: colors.brand }}>{percent}%</Text>
    </View>
    <View style={{ height: 6, backgroundColor: '#E2E8F0', borderRadius: 3 }}>
      <View style={{ width: `${percent}%`, height: '100%', backgroundColor: percent === 100 ? colors.success : colors.brand, borderRadius: 3 }} />
    </View>
  </View>
);

// ==========================================
// 6. HLAVNÍ DOKUMENT
// ==========================================

const ReportDocument = ({ data }) => {
  const { companySize, sector, selectedServices, specialCriteria, complianceLevel, complianceReasoning, securityStatus } = data;
  const today = new Date().toLocaleDateString('cs-CZ');

  // A. Logika
  const isHigher = complianceLevel === 'higher';
  const isLower = complianceLevel === 'lower';
  const isNone = complianceLevel === 'none';

  // B. Výběr sady otázek
  const activeMeasuresDB = isHigher ? MEASURES_HIGHER_409 : MEASURES_LOWER_410;

  // C. Gap Analýza
  const implementedTitles = securityStatus ? Object.keys(securityStatus) : [];
  const implementedList = [];
  const missingList = [];

  if (!isNone) {
    activeMeasuresDB.forEach(m => {
      if (implementedTitles.includes(m.title)) {
        implementedList.push(m);
      } else {
        missingList.push(m);
      }
    });
  }

  const percent = activeMeasuresDB.length > 0
    ? Math.round((implementedList.length / activeMeasuresDB.length) * 100)
    : 0;

  // D. Služby
  const sectorServices = SERVICES_DATA_DB[sector] || [];
  const selectedServicesDetails = sectorServices.filter(s => selectedServices.includes(s.id));

  // E. Barvy badge
  let badgeBg = colors.success;
  let badgeLabel = "MIMO REGULACI";
  if (isHigher) { badgeBg = colors.danger; badgeLabel = "REŽIM VYŠŠÍCH POVINNOSTÍ"; }
  else if (isLower) { badgeBg = colors.warning; badgeLabel = "REŽIM NIŽŠÍCH POVINNOSTÍ"; }

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Header Strip */}
        <View style={styles.headerStrip} />

        {/* Top Bar  */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <IconShield />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.logoSub}>AUDIT KYBERNETICKÉ BEZPEČNOSTI</Text>
              <Text style={styles.logoText}>NIS2 Compliance Report</Text>
            </View>
          </View>
          <View style={styles.dateBlock}>
            <Text style={styles.dateLabel}>DATUM VYHODNOCENÍ</Text>
            <Text style={styles.dateValue}>{today}</Text>
          </View>
        </View>

        {/* Dashboard Card */}
        <View style={styles.card}>
          <View style={styles.statusRow}>
            <View style={{ ...styles.badge, backgroundColor: badgeBg }}>
              <Text style={styles.badgeText}>{badgeLabel}</Text>
            </View>
            {!isNone && (
              <View style={styles.scoreBlock}>
                <Text style={styles.scoreBig}>{percent}%</Text>
                <Text style={styles.scoreLabel}>Celková shoda</Text>
              </View>
            )}
          </View>

          <View style={styles.grid}>
            <View style={styles.col}>
              <Text style={styles.label}>Velikost podniku</Text>
              <Text style={styles.value}>{companySize || "Nezadáno"}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Sektor</Text>
              <Text style={styles.value}>{sector || "Nezadáno"}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Počet zaměstnanců</Text>
              <Text style={styles.value}>{data.employeesCount || "-"}</Text>
            </View>
          </View>

          <View style={styles.reasonBox}>
            <Text style={styles.reasonText}>
              <Text style={{ fontWeight: 700 }}>Důvod klasifikace: </Text>
              {complianceReasoning}
            </Text>
          </View>

          {!isNone && <ProgressBar percent={percent} />}
        </View>

        {/* 1. IMPLEMENTOVÁNO */}
        {!isNone && implementedList.length > 0 && (
          <View wrap={false}>
            <Text style={{ ...styles.sectionTitle, color: colors.success }}>
              ✅ Již implementováno
            </Text>
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={{ ...styles.th, flex: 4 }}>Opatření</Text>
                <Text style={{ ...styles.th, flex: 1 }}>Legislativa</Text>
                <Text style={{ ...styles.th, flex: 1, textAlign: 'right' }}>Stav</Text>
              </View>
              {implementedList.map((m, i) => (
                <View key={i} style={styles.tableRow}>
                  <View style={{ flex: 4 }}>
                    <Text style={styles.tdTitle}>{m.title}</Text>
                  </View>
                  <Text style={{ ...styles.tdArt, flex: 1 }}>{m.article}</Text>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <IconCheck />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 2. K DOŘEŠENÍ */}
        {!isNone && missingList.length > 0 && (
          <View wrap={false}>
            <Text style={{ ...styles.sectionTitle, color: colors.danger }}>
              K dořešení (Gap Analýza)
            </Text>
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={{ ...styles.th, flex: 4 }}>Chybějící opatření</Text>
                <Text style={{ ...styles.th, flex: 1 }}>Legislativa</Text>
                <Text style={{ ...styles.th, flex: 1, textAlign: 'right' }}>Stav</Text>
              </View>
              {missingList.map((m, i) => (
                <View key={i} style={styles.tableRow}>
                  <View style={{ flex: 4 }}>
                    <Text style={styles.tdTitle}>{m.title}</Text>
                    <Text style={{ fontSize: 8, color: '#94A3B8' }}>Nutné doplnit dokumentaci</Text>
                  </View>
                  <Text style={{ ...styles.tdArt, flex: 1 }}>{m.article}</Text>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <IconCross />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 3. OSS STACK  */}
        {isLower && (
          <View break>
            {/*  Header Strip pro novou stránku */}
            <View style={styles.headerStrip} />
            <Text style={styles.sectionTitle}>Návrh technického řešení (OSS Stack)</Text>

            <Text style={{ fontSize: 10, color: colors.textMain, marginHorizontal: 40, marginBottom: 15, lineHeight: 1.5 }}>
              Následující architektura využívá ověřené Open Source nástroje pro splnění požadavků vyhlášky č. 410/2025 Sb. bez licenčních poplatků.
            </Text>

            {IMPLEMENTATION_PLAN.map((plan, i) => (
              <View key={i} style={styles.implCard} wrap={false}>
                <Text style={styles.implTitle}>{plan.section}</Text>
                <Text style={styles.implDesc}>{plan.description}</Text>

                <Text style={{ fontSize: 9, fontWeight: 700, marginTop: 4, marginBottom: 2, color: colors.textMain }}>
                  Řešení:
                </Text>
                <Text style={styles.implSol}>{plan.solution}</Text>

                <View style={styles.stackRow}>
                  {plan.stack.map((tech, t) => (
                    <View key={t} style={styles.stackBadge}>
                      <Text style={styles.stackText}>{tech}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Vygenerováno nástrojem NIS2 Checker | © 2025 | Strana 1
          </Text>
        </View>
      </Page>
    </Document>
  );
};


// ==========================================
// 7. AGENT REPORT DOCUMENT
// ==========================================

// --- MANAGEMENT SIGN-OFF PAGE ---
const ManagementSignOffPage = ({ data }) => {
  const { riskData } = data;
  const person = riskData || {}; // ObligatedPersonStep saves data here

  return (
    <Page size="A4" style={styles.page}>
      <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000', color: '#FFFFFF' }}>

        {/* Border Frame */}
        <View style={{ position: 'absolute', top: 20, left: 20, right: 20, bottom: 20, border: '1px solid #333333' }} />

        {/* Content */}
        <View style={{ width: '80%', alignItems: 'center' }}>

          <Text style={{ fontSize: 10, letterSpacing: 2, color: '#888888', marginBottom: 20 }}>
            AUDIT KYBERNETICKÉ BEZPEČNOSTI
          </Text>

          <Text style={{ fontSize: 24, fontWeight: 700, marginBottom: 10, color: '#FFFFFF' }}>
            MANAGEMENT SIGN-OFF
          </Text>

          <Text style={{ fontSize: 10, color: '#666666', marginBottom: 40, textAlign: 'center' }}>
            § 3, § 4(f), § 6 vyhlášky 410/2025 Sb.
          </Text>

          <View style={{ width: '100%', padding: 30, backgroundColor: '#0A0A0A', border: '1px solid #222222', borderRadius: 8, alignItems: 'center' }}>

            <Text style={{ fontSize: 9, color: '#666666', letterSpacing: 1, marginBottom: 5 }}>
              ODPOVĚDNÁ OSOBA
            </Text>
            <Text style={{ fontSize: 18, color: '#FFFFFF', marginBottom: 5 }}>
              {person.name || "Nezadáno"}
            </Text>
            <Text style={{ fontSize: 12, color: '#BF5AF2', marginBottom: 30 }}>
              {person.role || "Role neurčena"}
            </Text>

            <View style={{ width: '100%', height: 1, backgroundColor: '#222222', marginBottom: 30 }} />

            <Text style={{ fontSize: 9, color: '#666666', letterSpacing: 1, marginBottom: 5 }}>
              DIGITÁLNÍ PEČEŤ (SHA-256)
            </Text>
            <Text style={{ fontSize: 8, color: '#32D74B', fontFamily: 'Courier', textAlign: 'center', marginBottom: 10 }}>
              {person.hash || "NOT_SIGNED"}
            </Text>
            <Text style={{ fontSize: 8, color: '#444444' }}>
              Timestamp: {person.timestamp ? new Date(person.timestamp).toLocaleString('cs-CZ') : "N/A"}
            </Text>

          </View>

          <Text style={{ fontSize: 9, color: '#444444', marginTop: 40, textAlign: 'center', maxWidth: 400, lineHeight: 1.5 }}>
            Tento dokument potvrzuje, že výše uvedená osoba převzala odpovědnost za zavedení a provádění bezpečnostních opatření v souladu s požadavky směrnice NIS2 a zákona o kybernetické bezpečnosti.
          </Text>

        </View>
      </View>
    </Page>
  );
};


const AgentReportDocument = ({ data }) => {
  const { legalContext, riskData, finalMeasures } = data;
  const today = new Date().toLocaleDateString('cs-CZ');
  const measures = finalMeasures || [];

  // Data hash calculation (Simulating integrity check of the export)
  const dataString = JSON.stringify({ legalContext, riskData, finalMeasures });
  const hash = CryptoJS.SHA256(dataString).toString(CryptoJS.enc.Hex).toUpperCase();
  const shortHash = `${hash.substring(0, 8)}-${hash.substring(8, 12)}-${hash.substring(12, 16)}...`;

  return (
    <Document>
      {/* 1. COVER PAGE - MANAGEMENT SIGN-OFF */}
      <ManagementSignOffPage data={data} />

      {/* 2. MAIN REPORT */}
      <Page size="A4" orientation="landscape" style={styles.page}>

        {/* Header Strip */}
        <View style={styles.headerStrip} />

        {/* Top Bar  */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logoText}>PŘEHLED BEZPEČNOSTNÍCH OPATŘENÍ</Text>
            <Text style={styles.logoSub}>Příloha č. 1 vyhlášky č. 410/2025 Sb. (Vzor)</Text>
          </View>
          <View style={styles.dateBlock}>
            <Text style={styles.dateLabel}>DATUM EXPORTU</Text>
            <Text style={styles.dateValue}>{today}</Text>
          </View>
        </View>

        {/* Intro Text */}
        <View style={{ marginHorizontal: 40, marginBottom: 20 }}>
          <Text style={{ fontSize: 10, color: colors.textSec }}>
            Povinná osoba: <Text style={{ color: colors.black, fontWeight: 700 }}>{riskData?.name || "Nezadáno"}</Text> |
            Role: <Text style={{ color: colors.black }}>{riskData?.role || "-"}</Text>
          </Text>
        </View>

        {/* Main Table (Appendix 1 Format) */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={{ ...styles.th, width: '25%' }}>1. Opatření</Text>
            <Text style={{ ...styles.th, width: '10%' }}>2. Stav</Text>
            <Text style={{ ...styles.th, width: '35%' }}>3. Popis / Účinnost</Text>
            <Text style={{ ...styles.th, width: '30%', textAlign: 'right' }}>4. Termín a Odpovědnost</Text>
          </View>

          {measures.length > 0 ? measures.map((m, i) => (
            <View key={i} style={styles.tableRow} wrap={false}>

              {/* 1. Opatření */}
              <View style={{ width: '25%', paddingRight: 5 }}>
                <Text style={styles.tdTitle}>{m.title}</Text>
                <Text style={{ fontSize: 8, color: colors.textSec }}>{m.desc}</Text>
                {m.type === 'MANDATORY' && (
                  <Text style={{ fontSize: 8, color: colors.danger, fontWeight: 700, marginTop: 2 }}>[POVINNÉ]</Text>
                )}
              </View>

              {/* 2. Stav */}
              <View style={{ width: '10%' }}>
                <Text style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: m.status === 'Zavedeno' ? colors.success : (m.status === 'V procesu' ? colors.warning : colors.danger)
                }}>
                  {m.status.toUpperCase()}
                </Text>
                {m.status === 'Zavedeno' && (
                  <Text style={{ fontSize: 8, color: colors.textSec, marginTop: 2 }}>
                    Revize: {m.lastReviewDate || "N/A"}
                  </Text>
                )}
              </View>

              {/* 3. Popis / Účinnost */}
              <View style={{ width: '35%', paddingRight: 5 }}>
                <Text style={styles.tdArt}>
                  <Text style={{ fontWeight: 700 }}>Plan/Do: </Text>
                  {m.description || "Nedefinováno"}
                </Text>
                {m.status === 'Zavedeno' && m.effectiveness && (
                  <Text style={{ ...styles.tdArt, marginTop: 4, color: colors.brandDark }}>
                    <Text style={{ fontWeight: 700 }}>Check (Účinnost): </Text>
                    {m.effectiveness}
                  </Text>
                )}
              </View>

              {/* 4. Termín a Odpovědnost */}
              <View style={{ width: '30%', alignItems: 'flex-end', textAlign: 'right' }}>
                <Text style={styles.tdTitle}>{m.responsibility || "Nepřiřazeno"}</Text>
                <Text style={styles.tdGray}>Garant</Text>
                {m.status !== 'Zavedeno' && (
                  <Text style={{ ...styles.tdArt, marginTop: 4 }}>
                    Termín: {m.deadline || "Neurčeno"}
                  </Text>
                )}
              </View>

            </View>
          )) : (
            <View style={styles.tableRow}>
              <Text style={{ ...styles.tdArt, width: '100%', textAlign: 'center', padding: 20 }}>
                Nebyla definována žádná opatření.
              </Text>
            </View>
          )}
        </View>

        {/* Footer Area */}
        <View style={styles.footer}>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, borderBottom: `1px solid ${colors.border}`, paddingBottom: 15 }}>
            <View style={{ width: '45%' }}>
              <Text style={{ fontSize: 8, color: colors.textSec, textTransform: 'uppercase', marginBottom: 30 }}>Podpis odpovědné osoby:</Text>
              <View style={{ borderBottom: `1px solid ${colors.black}`, width: '100%' }} />
            </View>
            <View style={{ width: '45%' }}>
              <Text style={{ fontSize: 8, color: colors.textSec, textTransform: 'uppercase', marginBottom: 30 }}>Podpis auditora / CISO:</Text>
              <View style={{ borderBottom: `1px solid ${colors.black}`, width: '100%' }} />
            </View>
          </View>

          <Text style={{ fontSize: 8, color: colors.textSec, fontStyle: 'italic', marginBottom: 5 }}>
            Doložka: Tento dokument je nutné uchovávat pro potřeby auditu po dobu minimálně 4 let od data vyhotovení (§ 3 písm. c vyhlášky).
            Obsah dokumentu je chráněn kontrolním součtem (Integrity Check).
          </Text>
          <Text style={{ fontSize: 8, color: colors.brand, fontFamily: 'Courier' }}>
            DOC HASH: {hash}
          </Text>
          <Text style={styles.footerText}>
            Vygenerováno systémem NIS2 Agent | Strana {2}
          </Text>
        </View>

      </Page>
    </Document>
  );
};

// --- 8. EXPORT FUNCTION ---
export const generatePDFReport = async (data) => {
  try {
    // Rozhodneme, který report generovat
    const isAgentReport = data.riskData || data.legalContext;
    const DocumentComponent = isAgentReport ? AgentReportDocument : ReportDocument;

    // Generování
    const blob = await pdf(<DocumentComponent data={data} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    // Název souboru
    const prefix = isAgentReport ? "NIS2_Implementace" : "NIS2_Audit";
    const dateStr = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `${prefix}_${dateStr}.pdf`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Chyba PDF:", error);
    alert("Chyba při generování PDF.");
  }
};

export default ReportDocument;