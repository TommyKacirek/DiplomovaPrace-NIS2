import React, { useState } from 'react';
import './ServicesSelection.css';

// Doplnění veřejných služeb
const RESEARCH_TECHS = {
  higher: [
    { id: 'tech_semi', label: 'Technologie pokročilých polovodičů' },
    { id: 'tech_ai', label: 'Technologie umělé inteligence' },
    { id: 'tech_quantum', label: 'Kvantové technologie' },
    { id: 'tech_bio', label: 'Biotechnologie' }
  ],
  lower: [
    { id: 'tech_conn', label: 'Pokročilá konektivita, navigace a digitální technologie' },
    { id: 'tech_sensing', label: 'Technologie pokročilého snímání' },
    { id: 'tech_space', label: 'Vesmírné technologie a technologie pohonu' },
    { id: 'tech_energy', label: 'Energetické technologie' },
    { id: 'tech_robotics', label: 'Robotika a autonomní systémy' },
    { id: 'tech_materials', label: 'Pokročilé materiály, výrobní a recyklační technologie' }
  ]
};

// Kompletní databáze služeb podle Vyhlášky o regulovaných službách
const SERVICES_DATA = {
  "Veřejná správa": {
    services: [
      { id: '1.1.a', label: 'Ústřední orgán státní správy', detail: 'Ministerstva a jiné ústřední správní úřady' },
      { id: '1.1.b', label: 'Jiný správní úřad s celostátní působností', detail: 'Pokud není uveden v bodě a)' },
      { id: '1.1.c', label: 'Ústředí, generální nebo ústřední inspektorát', detail: 'Nebo generální ředitelství či obdobná součást správního úřadu nadřízená regionálním složkám' },
      { id: '1.1.d', label: 'Kancelář prezidenta republiky', detail: 'Kancelář prezidenta republiky' },
      { id: '1.1.e', label: 'Kancelář Senátu', detail: 'Kancelář Senátu Parlamentu ČR' },
      { id: '1.1.f', label: 'Kancelář Poslanecké sněmovny', detail: 'Kancelář Poslanecké sněmovny Parlamentu ČR' },
      { id: '1.1.g', label: 'Česká národní banka', detail: 'ČNB' },
      { id: '1.1.h', label: 'Policejní prezidium České republiky', detail: 'Policejní prezidium' },
      { id: '1.1.i', label: 'Krajské ředitelství Policie České republiky', detail: 'Krajská ředitelství PČR' },
      { id: '1.1.j', label: 'Útvar Policie ČR s celostátní působností', detail: 'Zajišťující speciální činnosti (organizovaný zločin, kyberkriminalita, ochrana ústavních činitelů atd.)' },
      { id: '1.1.k', label: 'Generální inspekce bezpečnostních sborů', detail: 'GIBS' },
      { id: '1.1.l', label: 'Součást Hasičského záchranného sboru ČR', detail: 'Podle § 5 písm. a) až c) zákona o HZS' },
      { id: '1.1.m', label: 'Kancelář veřejného ochránce práv a ochránce práv dětí', detail: 'Ombudsman' },
      { id: '1.1.n', label: 'Nejvyšší kontrolní úřad', detail: 'NKÚ' },
      { id: '1.1.o', label: 'Úřad pro zastupování státu ve věcech majetkových', detail: 'ÚZSVM' },
      { id: '1.1.p', label: 'Správa úložišť radioaktivních odpadů', detail: 'SÚRAO' },
      { id: '1.1.q', label: 'Ústavní soud', detail: 'Ústavní soud ČR' },
      { id: '1.1.r', label: 'Zdravotní pojišťovna', detail: 'Veřejná zdravotní pojišťovna' },
      { id: '1.1.s', label: 'Kraj', detail: 'Krajský úřad / Samospráva kraje' },
      { id: '1.1.t', label: 'Hlavní město Praha', detail: 'Magistrát hl. m. Prahy' },
      { id: '1.2.a', label: 'Správní úřad nebo jeho součást s regionální působností', detail: 'S krajskou, okresní nebo jinou územní působností' },
      { id: '1.2.b', label: 'Profesní komora', detail: 'Zřízená zákonem' },
      { id: '1.2.c', label: 'Vysoká škola', detail: 'Veřejná i soukromá vysoká škola' },
      { id: '1.2.d', label: 'Akademie věd České republiky', detail: 'AV ČR' },
      { id: '1.2.e', label: 'Obec s rozšířenou působností', detail: 'ORP (městský úřad)' },
      { id: '1.2.f', label: 'Městská část Praha 1 až Praha 22', detail: 'Úřady městských částí Prahy 1-22' }
    ]
  },
  "Energetika – Elektřina": {
    services: [
      { id: '2.1', label: 'Výroba elektřiny', detail: 'Výroba elektřiny podle energetického zákona s výjimkou OZE do 1 MW', hasSpecialCriteria: true, specialQuestion: 'Provozujete výrobnu elektřiny s celkovým instalovaným elektrickým výkonem nejméně 100 MW?' },
      { id: '2.2', label: 'Provoz přenosové soustavy elektřiny', detail: 'Držitel licence na přenos elektřiny' },
      { id: '2.3', label: 'Provoz distribuční soustavy elektřiny', detail: 'Držitel licence na distribuci elektřiny', hasSpecialCriteria: true, specialQuestion: 'Provozujete regionální distribuční soustavu elektřiny s nejméně 90 000 odběrnými místy zákazníků?' },
      { id: '2.4', label: 'Obchod s elektřinou', detail: 'Držitel licence na obchod s elektřinou' },
      { id: '2.5', label: 'Činnost nominovaného organizátora trhu s elektřinou', detail: 'Podle přímo použitelného předpisu EU' },
      { id: '2.6', label: 'Agregace elektřiny', detail: 'Agregátor podle energetického zákona' },
      { id: '2.7', label: 'Ukládání elektřiny', detail: 'Držitel licence na ukládání elektřiny' },
      { id: '2.8', label: 'Odezva strany poptávky', detail: 'Poskytovatel flexibility podle energetického zákona' },
      { id: '2.9', label: 'Provoz veřejně přístupné dobíjecí stanice', detail: 'Provozovatel 50 a více veřejně přístupných dobíjecích stanic' },
      { id: '2.10', label: 'Činnost Elektroenergetického datového centra', detail: 'Držitel licence na činnost EDC' }
    ]
  },
  "Energetika – Ropa a ropné produkty": {
    services: [
      { id: '3.1', label: 'Těžba ropy', detail: 'Provozovatel zařízení na těžbu ropy' },
      { id: '3.2', label: 'Zpracovávání ropy', detail: 'Provozovatel zařízení na zpracování ropy' },
      { id: '3.3', label: 'Provoz skladovacího zařízení pro skladování ropy', detail: 'Provozovatel skladovacího zařízení pro ropy' },
      { id: '3.4', label: 'Provoz ropovodu', detail: 'Provozovatel ropovodu podle zákona o nouzových zásobách ropy' },
      { id: '3.5', label: 'Provoz produktovodu', detail: 'Provozovatel produktovodu podle zákona o nouzových zásobách ropy' },
      { id: '3.6', label: 'Činnost ústředního správce zásob', detail: 'Ústřední správce zásob podle zákona o nouzových zásobách ropy' },
      { id: '3.7', label: 'Provoz veřejně přístupné čerpací stanice', detail: 'Provozovatel alespoň 100 veřejně přístupných čerpacích stanic motorového benzinu nebo nafty', hasSpecialCriteria: true, specialQuestion: 'Provozujete alespoň 100 veřejně přístupných čerpacích stanic motorového benzinu nebo motorové nafty na území ČR?' }
    ]
  },
  "Energetika – Zemní plyn": {
    services: [
      { id: '4.1', label: 'Výroba zemního plynu', detail: 'Držitel licence na výrobu plynu' },
      { id: '4.2', label: 'Provoz přepravní soustavy zemního plynu', detail: 'Držitel licence na přepravu plynu' },
      { id: '4.3', label: 'Provoz distribuční soustavy zemního plynu', detail: 'Držitel licence na distribuci plynu', hasSpecialCriteria: true, specialQuestion: 'Provozujete distribuční soustavu plynu s licencovanou přenosovou kapacitou nejméně 1 000 MW?' },
      { id: '4.4', label: 'Obchod se zemním plynem', detail: 'Držitel licence pro obchod s plynem' },
      { id: '4.5', label: 'Uskladňování zemního plynu', detail: 'Držitel licence na uskladňování plynu' }
    ]
  },
  "Energetika – Teplárenství": {
    services: [
      { id: '5.1', label: 'Výroba tepelné energie', detail: 'Držitel licence na výrobu tepelné energie', hasSpecialCriteria: true, specialQuestion: 'Provozujete výrobnu tepelné energie s celkovým instalovaným tepelným výkonem nejméně 50 MW?' },
      { id: '5.2', label: 'Provoz soustavy zásobování tepelnou energií', detail: 'Držitel licence na rozvod tepelné energie' }
    ]
  },
  "Energetika – Vodík": {
    services: [
      { id: '6.1', label: 'Výroba vodíku', detail: 'Držitel licence na výrobu plynu (vodíku)' },
      { id: '6.2', label: 'Skladování vodíku', detail: 'Držitel licence na uskladňování plynu (vodíku)' },
      { id: '6.3', label: 'Přeprava vodíku', detail: 'Držitel licence na přepravu plynu (vodíku)' }
    ]
  },
  "Výrobní průmysl": {
    services: [
      { id: '7.1', label: 'Výroba počítačů, elektronických a optických přístrojů', detail: 'Oddíl 26 klasifikace CZ-NACE' },
      { id: '7.2', label: 'Výroba elektrických zařízení', detail: 'Oddíl 27 klasifikace CZ-NACE' },
      { id: '7.3', label: 'Výroba strojů a zařízení', detail: 'Oddíl 28 klasifikace CZ-NACE' },
      { id: '7.4', label: 'Výroba motorových vozidel, přívěsů a návěsů', detail: 'Oddíl 29 klasifikace CZ-NACE', hasSpecialCriteria: true, specialQuestion: 'Sériově vyrábíte osobní motorová vozidla?' },
      { id: '7.5', label: 'Výroba ostatních dopravních prostředků', detail: 'Oddíl 30 klasifikace CZ-NACE' }
    ]
  },
  "Potravinářský průmysl": {
    services: [
      { id: '8.1', label: 'Průmyslová výroba potravin', detail: 'Potravinářský podnik zabývající se průmyslovou výrobou potravin' },
      { id: '8.2', label: 'Průmyslové zpracování potravin', detail: 'Potravinářský podnik zabývající se průmyslovým zpracováním potravin' },
      { id: '8.3', label: 'Velkoobchodní distribuce potravin', detail: 'Potravinářský podnik zabývající se velkoobchodní distribucí potravin' }
    ]
  },
  "Chemický průmysl": {
    services: [
      { id: '9.1', label: 'Výroba chemických látek podléhajících registraci', detail: 'Výrobce chemické látky podle REACH' },
      { id: '9.2', label: 'Uvádění chemických látek na trh', detail: 'Distributor chemické látky podléhající registraci' },
      { id: '9.3', label: 'Výroba předmětů podléhajících registraci', detail: 'Výrobce předmětů podle REACH' },
      { id: '9.4', label: 'Užívání objektu za účelem umístění nebezpečné látky', detail: 'Provozovatel objektu podle zákona o prevenci závažných havárií', hasSpecialCriteria: true, specialQuestion: 'Je váš objekt zařazen do skupiny B (vyšší práh množství nebezpečných látek)?' }
    ]
  },
  "Vodní hospodářství": {
    services: [
      { id: '10.1', label: 'Provozování vodovodu sloužícího veřejné potřebě', detail: 'Provozovatel vodovodu s příjmy ≥ 5 % obratu' },
      { id: '10.2', label: 'Provozování kanalizace sloužící veřejné potřebě', detail: 'Provozovatel kanalizace s příjmy ≥ 5 % obratu' }
    ]
  },
  "Odpadové hospodářství": {
    services: [
      { id: '11.1', label: 'Provoz zařízení určeného pro nakládání s odpady', detail: 'Provozovatel zařízení s příjmy ≥ 5 % obratu' },
      { id: '11.2', label: 'Obchodování s odpadem', detail: 'Obchodník s odpady s příjmy ≥ 5 % obratu' },
      { id: '11.3', label: 'Zprostředkování nakládání s odpadem', detail: 'Zprostředkovatel nakládání s odpady s příjmy ≥ 5 % obratu' },
      { id: '11.4', label: 'Přeprava odpadu', detail: 'Dopravce odpadu s příjmy ≥ 5 % obratu' }
    ]
  },
  "Letecká doprava": {
    services: [
      { id: '12.1', label: 'Provoz obchodní letecké dopravy', detail: 'Letecký dopravce podle zákona o civilním letectví' },
      { id: '12.2', label: 'Provoz mezinárodního letiště', detail: 'Provozovatel mezinárodního letiště' },
      { id: '12.3', label: 'Provoz pomocných zařízení letiště', detail: 'Provozovatel pomocných zařízení v rámci mezinárodního letiště' },
      { id: '12.4', label: 'Letové navigační služby', detail: 'Poskytovatel letových navigačních služeb' }
    ]
  },
  "Drážní doprava": {
    services: [
      { id: '13.1', label: 'Provozování železniční dopravní cesty', detail: 'Provozovatel železniční dopravní cesty ve veřejném zájmu' },
      { id: '13.2', label: 'Provoz celostátní dráhy', detail: 'Provozovatel celostátní dráhy' },
      { id: '13.3', label: 'Provoz regionální dráhy', detail: 'Provozovatel regionální dráhy' },
      { id: '13.4', label: 'Provoz veřejně přístupné vlečky', detail: 'Provozovatel veřejně přístupné vlečky' },
      { id: '13.5', label: 'Provoz drážní dopravy na celostátní dráze', detail: 'Provozovatel drážní dopravy na celostátní dráze' },
      { id: '13.6', label: 'Provoz drážní dopravy na regionální dráze', detail: 'Provozovatel drážní dopravy na regionální dráze' },
      { id: '13.7', label: 'Provoz drážní dopravy na veřejně přístupné vlečce', detail: 'Provozovatel drážní dopravy na veřejně přístupné vlečce' },
      { id: '13.8', label: 'Provoz zařízení služeb', detail: 'Provozovatel zařízení služeb podle zákona o dráhách' }
    ]
  },
  "Námořní vodní doprava": {
    services: [
      { id: '14.1', label: 'Činnost námořní vodní dopravy', detail: 'Osoba vykonávající činnost námořní vodní dopravy' },
      { id: '14.2', label: 'Provoz řídícího orgánu přístavu', detail: 'Řídící orgán přístavu' },
      { id: '14.3', label: 'Provoz vodního díla nebo zařízení v přístavu', detail: 'Osoba provozující vodní dílo nebo zařízení v rámci mořského přístavu' },
      { id: '14.4', label: 'Provoz služby lodní dopravě', detail: 'Provozovatel služby lodní dopravě (VTS)' }
    ]
  },
  "Silniční doprava": {
    services: [
      { id: '15.1', label: 'Řízení provozu na pozemních komunikacích', detail: 'Osoba vykonávající správu pozemní komunikace' },
      { id: '15.2', label: 'Provoz inteligentního dopravního systému', detail: 'Poskytovatel služby inteligentního dopravního systému' }
    ]
  },
  "Digitální infrastruktura a služby": {
    services: [
      { id: '16.1', label: 'Poskytování veřejně dostupné služby elektronických komunikací', detail: 'Osoba poskytující veřejně dostupnou službu elektronických komunikací', hasSpecialCriteria: true, specialQuestion: 'Poskytujete službu prostřednictvím nejméně 350 000 aktivních mobilních SIM karet NEBO nejméně 100 000 aktivních pevných internetových přípojek?' },
      { id: '16.2', label: 'Zajišťování veřejné komunikační sítě', detail: 'Osoba zajišťující veřejnou komunikační síť', hasSpecialCriteria: true, specialQuestion: 'Zajišťujete síť pro nejméně 350 000 aktivních mobilních SIM karet NEBO nejméně 100 000 aktivních pevných internetových přípojek?' },
      { id: '16.3', label: 'Poskytování služby výměnného uzlu internetu (IXP)', detail: 'Poskytovatel služby IXP', hasSpecialCriteria: true, specialQuestion: 'Umožňujete propojení nejméně 100 nezávislých sítí s datovým tokem alespoň 1 Tbps?' },
      { id: '16.4', label: 'Poskytování služby systému překladu doménových jmen (DNS)', detail: 'Poskytovatel DNS služeb' },
      { id: '16.5', label: 'Poskytování služby registrace a správy doménových jmen', detail: 'Osoba s přístupem k centrálnímu registru pro více než 100 000 domén .cz', hasSpecialCriteria: true, specialQuestion: 'Spravujete více než 100 000 doménových jmen druhého řádu v doméně .cz?' },
      { id: '16.6', label: 'Správa a provoz registru domény nejvyšší úrovně', detail: 'Osoba spravující a provozující registr TLD' },
      { id: '16.7', label: 'Správa a provoz domény gov.cz', detail: 'Osoba spravující a provozující doménu gov.cz' },
      { id: '16.8', label: 'Poskytování služby cloud computingu', detail: 'Poskytovatel služby cloud computingu' },
      { id: '16.9', label: 'Poskytování služby datového centra', detail: 'Poskytovatel služby datového centra' },
      { id: '16.10', label: 'Poskytování služby sítě pro doručování obsahu (CDN)', detail: 'Poskytovatel CDN služby' },
      { id: '16.11', label: 'Správa kvalifikovaného systému elektronické identifikace', detail: 'Kvalifikovaný správce systému elektronické identifikace' },
      { id: '16.12', label: 'Poskytování služby vytvářející důvěru', detail: 'Poskytovatel služby vytvářející důvěru (eIDAS)' },
      { id: '16.13', label: 'Poskytování řízené služby (MSP)', detail: 'Poskytovatel řízené služby (Managed Service Provider)' },
      { id: '16.14', label: 'Poskytování řízené bezpečnostní služby (MSSP)', detail: 'Poskytovatel řízené bezpečnostní služby' },
      { id: '16.15', label: 'Poskytování služby on-line tržiště', detail: 'Poskytovatel on-line tržiště' },
      { id: '16.16', label: 'Poskytování služby internetového vyhledávače', detail: 'Poskytovatel internetového vyhledávače' },
      { id: '16.17', label: 'Poskytování platformy sociální sítě', detail: 'Poskytovatel platformy sociální sítě' },
      { id: '16.18', label: 'Provozování Národního CERT', detail: 'Provozovatel Národního CERT' }
    ]
  },
  "Finanční trh": {
    services: [
      { id: '17.1', label: 'Činnost úvěrové instituce', detail: 'Úvěrová instituce podle předpisu EU' },
      { id: '17.2', label: 'Provoz obchodního systému', detail: 'Provozovatel obchodního systému na kapitálovém trhu' },
      { id: '17.3', label: 'Činnost ústřední protistrany', detail: 'Ústřední protistrana podle předpisu EU' },
      { id: '17.4', label: 'Činnost platební instituce', detail: 'Platební instituce s ročními objemy plateb > 1 000 000 000 000 Kč', hasSpecialCriteria: true, specialQuestion: 'Průměr ročních objemů vašich platebních transakcí za poslední 3 roky přesahuje 1 000 000 000 000 Kč?' },
      { id: '17.5', label: 'Činnost instituce elektronických peněz', detail: 'Instituce e-peněz s ročními objemy > 500 000 000 000 Kč', hasSpecialCriteria: true, specialQuestion: 'Průměr ročních objemů vydaných elektronických peněz za poslední 3 roky přesahuje 500 000 000 000 Kč?' }
    ]
  },
  "Zdravotnictví": {
    services: [
      { id: '18.1', label: 'Poskytování zdravotní péče', detail: 'Poskytovatel zdravotních služeb' },
      { id: '18.2', label: 'Poskytování zdravotnické záchranné služby', detail: 'Poskytovatel zdravotnické záchranné služby' },
      { id: '18.3', label: 'Činnost referenční laboratoře EU', detail: 'Referenční laboratoř EU pro oblast veřejného zdraví' },
      { id: '18.4', label: 'Výzkum a vývoj humánních léčivých přípravků', detail: 'Zadavatel klinických hodnocení' },
      { id: '18.5', label: 'Výroba humánních léčivých přípravků', detail: 'Držitel povolení k výrobě léčivých přípravků' },
      { id: '18.6', label: 'Výroba léčivých látek', detail: 'Výrobce léčivých látek' },
      { id: '18.7', label: 'Výroba zdravotnických prostředků', detail: 'Výrobce zdravotnických prostředků' },
      { id: '18.8', label: 'Výroba diagnostických zdravotnických prostředků in vitro', detail: 'Výrobce diagnostických zdravotnických prostředků in vitro' },
      { id: '18.9', label: 'Výroba kriticky důležitých zdravotnických prostředků', detail: 'Výrobce zdravotnických prostředků považovaných za kritické při mimořádné situaci' }
    ]
  },
  "Věda, výzkum a vzdělávání": {
    services: [
      {
        id: '19.1',
        label: 'Výzkum a vývoj',
        detail: 'Veřejná výzkumná instituce, vysoká škola, výzkumná organizace provádějící výzkum v kritických technologiích',
        isComplex: true
      }
    ]
  },
  "Poštovní a kurýrní služby": {
    services: [
      { id: '20.1', label: 'Poštovní služba', detail: 'Provozovatel poštovní služby' },
      { id: '20.2', label: 'Kurýrní služba', detail: 'Poskytovatel služby dodávání balíků' }
    ]
  },
  "Obranný průmysl": {
    services: [
      { id: '21.1', label: 'Výroba vojenského materiálu', detail: 'Výrobce vojenského materiálu' },
      { id: '21.2', label: 'Obchod s vojenským materiálem', detail: 'Osoba s povolením k provádění obchodu s vojenským materiálem' }
    ]
  },
  "Vesmírný průmysl": {
    services: [
      { id: '22.1', label: 'Zajištění podpory poskytování služeb využívajících kosmického prostoru', detail: 'Provozovatel pozemní infrastruktury pro podporu kosmických služeb' }
    ]
  }
};

export default function ServicesSelection({ sector, companySize, onBack, onNext }) {
  const [selected, setSelected] = useState([]);
  const [specialAnswers, setSpecialAnswers] = useState({});

  const handleToggle = (serviceId) => {
    setSelected((sel) =>
      sel.includes(serviceId)
        ? sel.filter((s) => s !== serviceId)
        : [...sel, serviceId]
    );
    // Reset speciálních otázek pokud je třeba
    if (selected.includes(serviceId)) {
      setSpecialAnswers(prev => {
        const next = { ...prev };
        delete next[serviceId];
        return next;
      });
    }
  };

  const handleSpecialAnswer = (serviceId, answer) => {
    setSpecialAnswers(prev => ({
      ...prev,
      [serviceId]: answer
    }));
  };

  // Handler pro komplexní formulář (Věda a výzkum)
  const handleResearchChange = (key, value, type = 'single') => {
    setSpecialAnswers(prev => {
      const currentData = prev['19.1'] || { checklist: [] };
      
      if (type === 'checklist') {
        const currentList = currentData.checklist || [];
        const newList = currentList.includes(value)
          ? currentList.filter(item => item !== value)
          : [...currentList, value];
        return {
          ...prev,
          ['19.1']: { ...currentData, checklist: newList }
        };
      }

      return {
        ...prev,
        ['19.1']: { ...currentData, [key]: value }
      };
    });
  };

  const handleNext = () => {
    if (selected.length === 0) {
      alert('Prosím vyberte alespoň jednu službu.');
      return;
    }

    const sectorData = SERVICES_DATA[sector];
    if (!sectorData) return;

    const unansweredSpecial = selected.some(serviceId => {
      const service = sectorData.services.find(s => s.id === serviceId);
      
      // Standardní validace pro jednoduché služby
      if (service?.hasSpecialCriteria && specialAnswers[serviceId] === undefined) {
        return true;
      }
      
      // Validace pro vědu a výzkum (musí být vybrán typ subjektu)
      if (serviceId === '19.1') {
        const data = specialAnswers['19.1'];
        if (!data) return true;
        // Musí být vybrán alespoň jeden typ organizace (q1 nebo q2)
        if (!data.q1_org && !data.q2_inst) return true;
        return false;
      }
      return false;
    });

    if (unansweredSpecial) {
      alert('Prosím odpovězte na všechny dodatečné otázky u vybraných služeb.');
      return;
    }

    if (onNext) {
      onNext({
        services: selected,
        specialCriteria: specialAnswers
      });
    }
  };

  if (!sector || !SERVICES_DATA[sector]) {
    return (
      <div className="fancy-gradient">
        <h2>Chyba</h2>
        <p className="services-description">
          Sektor "{sector}" nebyl nalezen. Vraťte se prosím zpět.
        </p>
        <div className="form-actions">
          <button className="back-btn" onClick={onBack}>Zpět</button>
        </div>
      </div>
    );
  }

  const sectorData = SERVICES_DATA[sector];

  return (
    <div className="fancy-gradient">
      <h2>Vyberte poskytované služby</h2>
      <p className="services-description">
        Zaškrtněte všechny služby, které vaše firma poskytuje nebo provozuje v rámci vybraného sektoru.
      </p>

      <div className="sector-label-bar">
        <div className="sector-name">{sector}</div>
        <div className="company-size-badge">Velikost: {companySize}</div>
      </div>

      <div className="service-list">
        {sectorData.services.map((service) => {
          const isSelected = selected.includes(service.id);
          
          return (
            <div key={service.id} className="service-wrapper">
              
              {/* 1. Hlavní řádek se službou (klikací) */}
              <div
                className={`service-item ${isSelected ? 'checked' : ''}`}
                onClick={() => handleToggle(service.id)}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggle(service.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="service-text">
                  <div className="service-id">{service.id}</div>
                  <strong>{service.label}</strong>
                  <div className="service-detail">{service.detail}</div>
                </div>
              </div>

              {/* 2. Standardní speciální otázka (Ano/Ne) */}
              {isSelected && service.hasSpecialCriteria && (
                <div className="special-question-box">
                  <p className="special-question-text">
                    {service.specialQuestion}
                  </p>
                  <div className="special-question-buttons">
                    <button
                      onClick={() => handleSpecialAnswer(service.id, true)}
                      className={`special-btn ${specialAnswers[service.id] === true ? 'active' : ''}`}
                    >
                      Ano
                    </button>
                    <button
                      onClick={() => handleSpecialAnswer(service.id, false)}
                      className={`special-btn ${specialAnswers[service.id] === false ? 'active' : ''}`}
                    >
                      Ne
                    </button>
                  </div>
                </div>
              )}

              {/* 3. Komplexní formulář POUZE pro 19.1 (Věda a výzkum) */}
              {isSelected && service.id === '19.1' && (
                <div className="special-question-box research-form">
                  <h4>Doplňující údaje pro vědu a výzkum</h4>
                  <p className="sub-label">Typ subjektu (vyberte alespoň jedno):</p>
                  
                  <label className="checkbox-label">
                    <input 
                      type="checkbox"
                      checked={specialAnswers['19.1']?.q1_org || false}
                      onChange={(e) => handleResearchChange('q1_org', e.target.checked)}
                    />
                    Veřejná výzkumná instituce, VŠ nebo výzkumná organizace (dle práva EU)
                  </label>
                  
                  <label className="checkbox-label">
                    <input 
                      type="checkbox"
                      checked={specialAnswers['19.1']?.q2_inst || false}
                      onChange={(e) => handleResearchChange('q2_inst', e.target.checked)}
                    />
                    Výzkumná instituce provádějící aplikovaný výzkum pro komerční účely (soukromá)
                  </label>

                  <hr className="form-divider" />

                  <p className="sub-label">Prováděli jste v posledních 5 letech (alespoň 2 roky) citlivou výzkumnou činnost (vojenský materiál)?</p>
                  <div className="special-question-buttons small">
                    <button
                      onClick={() => handleResearchChange('q3_sens', true)}
                      className={`special-btn ${specialAnswers['19.1']?.q3_sens === true ? 'active' : ''}`}
                    >
                      Ano
                    </button>
                    <button
                      onClick={() => handleResearchChange('q3_sens', false)}
                      className={`special-btn ${specialAnswers['19.1']?.q3_sens === false ? 'active' : ''}`}
                    >
                      Ne
                    </button>
                  </div>

                  <hr className="form-divider" />

                  <p className="sub-label">Prováděli jste v posledních 5 letech (alespoň 2 roky) aplikovaný výzkum v těchto oblastech?</p>
                  
                  <div className="tech-group">
                    <strong>Kritické technologie (vyšší povinnosti):</strong>
                    {RESEARCH_TECHS.higher.map(tech => (
                      <label key={tech.id} className="checkbox-label small-text">
                        <input 
                          type="checkbox"
                          checked={specialAnswers['19.1']?.checklist?.includes(tech.id) || false}
                          onChange={() => handleResearchChange(null, tech.id, 'checklist')}
                        />
                        {tech.label}
                      </label>
                    ))}
                  </div>

                  <div className="tech-group">
                    <strong>Ostatní kritické technologie (nižší povinnosti):</strong>
                    {RESEARCH_TECHS.lower.map(tech => (
                      <label key={tech.id} className="checkbox-label small-text">
                        <input 
                          type="checkbox"
                          checked={specialAnswers['19.1']?.checklist?.includes(tech.id) || false}
                          onChange={() => handleResearchChange(null, tech.id, 'checklist')}
                        />
                        {tech.label}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="selection-summary">
        {selected.length === 0 && 'Zatím jste nevybrali žádnou službu.'}
        {selected.length > 0 && `Vybráno ${selected.length} služeb.`}
      </div>

      <div className="form-actions">
        <button className="back-btn" onClick={onBack}>
          Zpět
        </button>
        <button
          className="continue-btn"
          onClick={handleNext}
          disabled={selected.length === 0}
        >
          Pokračovat
        </button>
      </div>
    </div>
  );
}