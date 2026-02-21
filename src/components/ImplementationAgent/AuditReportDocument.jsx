import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register a font that supports Czech characters if possible, 
// otherwise we rely on standard fallback. 
// For this environment, we'll try to use Roboto from a CDN or standard Helvetica.
// Note: Client-side usually fetches these.
Font.register({
    family: 'Roboto',
    src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf'
});

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica', // Fallback, might have issues with CS. Ideally 'Roboto'
        fontSize: 12,
        lineHeight: 1.5,
        color: '#333'
    },
    titlePage: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        textAlign: 'center'
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
        color: '#000'
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 40,
        color: '#555'
    },
    meta: {
        fontSize: 12,
        marginBottom: 10
    },
    section: {
        marginBottom: 20,
        paddingTop: 10,
        borderTop: '1px solid #ddd'
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#000'
    },
    table: {
        display: "table",
        width: "auto",
        marginBottom: 10
    },
    tableRow: {
        margin: "auto",
        flexDirection: "row"
    },
    tableCol: {
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 5
    },
    tableCell: {
        margin: "auto",
        marginTop: 5,
        fontSize: 10
    },
    signatureBox: {
        marginTop: 50,
        borderTop: '1px solid #000',
        width: '60%',
        paddingTop: 10
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        fontSize: 10,
        textAlign: 'center',
        color: '#aaa'
    }
});

const AuditReportDocument = ({ data, isV2 = false }) => {
    const { roles, significance, assets, assetRules, governance, humanResources, continuity, incidentManagement, signature, measures, revision, auditLog, profile } = data;

    return (
        <Document>
            {/* Title Page */}
            <Page size="A4" style={styles.page}>
                <View style={styles.titlePage}>
                    <Text style={styles.title}>AUDIT KYBERNETICKÉ BEZPEČNOSTI</Text>
                    <Text style={styles.subtitle}>dle vyhlášky č. 410/2025 Sb.</Text>

                    <View style={{ marginTop: 50 }}>
                        <Text style={styles.meta}>Organizace: {signature?.company || 'Neuvedeno'}</Text>
                        <Text style={styles.meta}>Datum auditu: {revision?.date || new Date().toLocaleDateString()}</Text>
                        <Text style={styles.meta}>Odpovědná osoba: {signature?.name}</Text>
                        <Text style={styles.meta}>Verze: {revision?.version || '1.0'}</Text>
                    </View>

                    <View style={{ marginTop: 100 }}>
                        <Text style={{ fontSize: 10, color: '#888' }}>
                            ID Auditu: {signature?.reportId || 'DRAFT'}
                        </Text>
                    </View>
                </View>
                <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )} fixed />
            </Page>

            {/* Content Pages */}
            <Page size="A4" style={styles.page}>

                {/* § 1 Significance (V2 Only) */}
                {significance && significance.definitionText && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>§ 1 Významnost incidentu</Text>
                        <Text style={{ fontStyle: 'italic' }}>
                            {significance.definitionText}
                        </Text>
                    </View>
                )}

                {/* § 2 Roles */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>§ 2 Vymezení rolí</Text>
                    <Text>Osoby odpovědné za zajišťování kybernetické bezpečnosti:</Text>
                    {roles && Object.entries(roles).map(([key, val]) => (
                        <View key={key} style={{ marginTop: 5 }}>
                            <Text style={{ fontWeight: 'bold' }}>{key}: {JSON.stringify(val)}</Text>
                        </View>
                    ))}
                    {/* Note: This depends on how 'roles' data is structured from step 1/RoleMappingStep. 
              Ideally we map over specific keys if known. */}
                </View>

                {/* § 3 Assets */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>§ 3 Evidence aktiv</Text>
                    {assets && assets.map((a, i) => (
                        <View key={i} style={{ marginBottom: 5 }}>
                            <Text>• {a.name} ({a.type}) - C:{a.c} I:{a.i} A:{a.a}</Text>
                        </View>
                    ))}
                </View>

                {/* § 4 Rules */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Pravidla pro aktiva</Text>
                    {assetRules && Object.entries(assetRules).map(([assetId, rules]) => {
                        const assetName = assets?.find(a => a.id.toString() === assetId)?.name || 'Neznámé aktivum';
                        return (
                            <View key={assetId} style={{ marginTop: 5 }}>
                                <Text style={{ fontWeight: 'bold' }}>{assetName}:</Text>
                                {rules.map((r, i) => <Text key={i} style={{ fontSize: 10, marginLeft: 10 }}>- {r}</Text>)}
                            </View>
                        );
                    })}
                </View>

                <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )} fixed />
            </Page>

            {/* § 4 Leadership & Governance (V2 Only) */}
            {isV2 && governance && (
                <Page size="A4" style={styles.page}>
                    <Text style={styles.sectionTitle}>§ 4 Vedení a řízení (Leadership & Governance)</Text>
                    <View style={styles.section}>
                        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Osoba pověřená hlídáním kybernetické bezpečnosti</Text>
                        <Text>Jméno: {governance.manager?.name || 'Neuvedeno'}</Text>
                        <Text>Kvalifikace: {governance.manager?.qualification === 'certificate' ? 'Doloženo certifikátem' : 'Čestné prohlášení'}</Text>
                        <Text style={{ fontStyle: 'italic', fontSize: 10, marginTop: 5 }}>* Výslovné svěření pravomocí: PŘIZNÁNO</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Školení vedení (§ 4 písm. b)</Text>
                        <Text>Datum posledního absolvování: {governance.training?.date || 'Neuvedeno'}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Statutárním orgánem schválená prioritizace aktiv (RTO)</Text>
                        {governance.prioritizedAssets && governance.prioritizedAssets.map((a, i) => (
                            <View key={i} style={{ marginBottom: 3 }}>
                                <Text style={{ fontSize: 10 }}>
                                    {i + 1}. {a.name} ({a.type})
                                </Text>
                            </View>
                        ))}
                    </View>

                    <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
                        `${pageNumber} / ${totalPages}`
                    )} fixed />
                </Page>
            )}

            {/* § 5 Human Resources (V2 Only) */}
            {isV2 && humanResources && (
                <Page size="A4" style={styles.page}>
                    <Text style={styles.sectionTitle}>§ 5 Bezpečnost lidských zdrojů</Text>

                    <View style={styles.section}>
                        <Text style={{ fontWeight: 'bold', fontSize: 10, marginTop: 5, marginBottom: 5 }}>Vyhlášená Bezpečnostní politika (Pravidla chování)</Text>
                        <Text style={{ fontStyle: 'italic', fontSize: 10 }}>{humanResources.policyText}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={{ fontWeight: 'bold', fontSize: 10, marginTop: 10, marginBottom: 5 }}>Evidenciální list školení (Pravidelná a Vstupní školení)</Text>
                        <View style={styles.table}>
                            <View style={styles.tableRowHeader}>
                                <View style={{ ...styles.tableCol, width: '30%' }}><Text style={styles.tableCellHeader}>Zaměstnanec</Text></View>
                                <View style={{ ...styles.tableCol, width: '30%' }}><Text style={styles.tableCellHeader}>Pracovní role / Typ</Text></View>
                                <View style={{ ...styles.tableCol, width: '20%' }}><Text style={styles.tableCellHeader}>Typ školení</Text></View>
                                <View style={{ ...styles.tableCol, width: '20%' }}><Text style={styles.tableCellHeader}>Další školení</Text></View>
                            </View>
                            {humanResources.trainingEvidence && humanResources.trainingEvidence.length > 0 ? (
                                humanResources.trainingEvidence.map((emp, idx) => (
                                    <View style={styles.tableRow} key={idx}>
                                        <View style={{ ...styles.tableCol, width: '30%' }}><Text style={styles.tableCell}>{emp.name}</Text></View>
                                        <View style={{ ...styles.tableCol, width: '30%' }}><Text style={styles.tableCell}>{emp.role} {emp.isPractical ? '(PRAXE)' : ''}</Text></View>
                                        <View style={{ ...styles.tableCol, width: '20%' }}><Text style={styles.tableCell}>{emp.type}</Text></View>
                                        <View style={{ ...styles.tableCol, width: '20%' }}><Text style={styles.tableCell}>{new Date(emp.nextDate).toLocaleDateString('cs-CZ')}</Text></View>
                                    </View>
                                ))
                            ) : (
                                <View style={styles.tableRow}>
                                    <View style={{ ...styles.tableCol, width: '100%' }}><Text style={styles.tableCell}>Žádné záznamy o školení.</Text></View>
                                </View>
                            )}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={{ fontWeight: 'bold', fontSize: 10, marginTop: 10, marginBottom: 5 }}>Disciplinární doložka (Vymahatelnost)</Text>
                        <Text style={{ fontSize: 10 }}>{humanResources.disciplinaryClause}</Text>
                    </View>

                    <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
                        `${pageNumber} / ${totalPages}`
                    )} fixed />
                </Page>
            )}

            {/* § 6 Continuity & Backup (V2 Only) */}
            {isV2 && continuity && (
                <Page size="A4" style={styles.page}>
                    <Text style={styles.sectionTitle}>§ 6 Řízení kontinuity a zálohování</Text>

                    <View style={styles.section}>
                        <Text style={{ fontWeight: 'bold', fontSize: 10, marginTop: 5, marginBottom: 5 }}>Technické postupy obnovy BIA aktiv</Text>
                        {continuity.recoveryProcedures && continuity.recoveryProcedures.length > 0 ? (
                            continuity.recoveryProcedures.map((proc, idx) => (
                                <View key={idx} style={{ marginBottom: 5 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 10 }}>{idx + 1}. {proc.name} ({proc.type})</Text>
                                    <Text style={{ fontStyle: 'italic', fontSize: 10, marginLeft: 10 }}>Postup: {proc.procedure}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={{ fontStyle: 'italic', fontSize: 10 }}>Nejsou definována žádná kritická aktiva k obnově.</Text>
                        )}
                    </View>

                    <View style={styles.section}>
                        <Text style={{ fontWeight: 'bold', fontSize: 10, marginTop: 10, marginBottom: 5 }}>Zálohovací schéma a kontrola PDCA</Text>
                        <Text style={{ fontSize: 10 }}>Předmět: {continuity.backupScheme?.scope || 'Neuvedeno'}</Text>
                        <Text style={{ fontSize: 10 }}>Četnost (RPO): {continuity.backupScheme?.frequency || 'Neuvedeno'}</Text>
                        <Text style={{ fontSize: 10 }}>Datum úspěšného testu obnovy: {continuity.backupScheme?.lastTestDate ? new Date(continuity.backupScheme.lastTestDate).toLocaleDateString('cs-CZ') : 'Neuvedeno'}</Text>
                        <Text style={{ fontStyle: 'italic', fontSize: 10, marginTop: 5, color: continuity.backupScheme?.hasOfflineCopy ? 'black' : 'red' }}>
                            * {continuity.backupScheme?.hasOfflineCopy ? 'Zálohy splňují pravidlo 3-2-1 vč. offline/offsite kopie.' : 'VAROVÁNÍ: Chybí offline/offsite kopie zálohy!'}
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={{ fontWeight: 'bold', fontSize: 10, marginTop: 10, marginBottom: 5 }}>Kontaktní matice pro krizové řízení (Mimo IT struktury)</Text>
                        <View style={styles.table}>
                            <View style={styles.tableRowHeader}>
                                <View style={{ ...styles.tableCol, width: '30%' }}><Text style={styles.tableCellHeader}>Role v krizi</Text></View>
                                <View style={{ ...styles.tableCol, width: '40%' }}><Text style={styles.tableCellHeader}>Organizace / Osoba</Text></View>
                                <View style={{ ...styles.tableCol, width: '30%' }}><Text style={styles.tableCellHeader}>Nouzový kontakt</Text></View>
                            </View>
                            {continuity.contacts && continuity.contacts.length > 0 ? (
                                continuity.contacts.map((contact, idx) => (
                                    <View style={styles.tableRow} key={idx}>
                                        <View style={{ ...styles.tableCol, width: '30%' }}><Text style={styles.tableCell}>{contact.role}</Text></View>
                                        <View style={{ ...styles.tableCol, width: '40%' }}><Text style={styles.tableCell}>{contact.organization}</Text></View>
                                        <View style={{ ...styles.tableCol, width: '30%' }}><Text style={styles.tableCell}>{contact.contactInfo}</Text></View>
                                    </View>
                                ))
                            ) : (
                                <View style={styles.tableRow}>
                                    <View style={{ ...styles.tableCol, width: '100%' }}><Text style={styles.tableCell}>Žádné krizové kontakty.</Text></View>
                                </View>
                            )}
                        </View>
                    </View>

                    <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
                        `${pageNumber} / ${totalPages}`
                    )} fixed />
                </Page>
            )}

            {/* Measures Table */}
            <Page size="A4" style={styles.page}>
                <Text style={styles.sectionTitle}>Přehled bezpečnostních opatření</Text>
                <View style={styles.table}>
                    <View style={[styles.tableRow, { backgroundColor: '#f0f0f0' }]}>
                        <View style={[styles.tableCol, { width: '25%' }]}>
                            <Text style={styles.tableCell}>Opatření</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '25%' }]}>
                            <Text style={styles.tableCell}>Stav</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '50%' }]}>
                            <Text style={styles.tableCell}>Poznámka / Zdůvodnění / Termín</Text>
                        </View>
                    </View>
                    {measures && measures.map((m, i) => (
                        <View key={i} style={styles.tableRow}>
                            <View style={[styles.tableCol, { width: '25%' }]}>
                                <Text style={styles.tableCell}>{m.title}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '25%' }]}>
                                <Text style={styles.tableCell}>
                                    {m.status}
                                    {m.appropriatenessType && ` (${m.appropriatenessType})`}
                                </Text>
                            </View>
                            <View style={[styles.tableCol, { width: '50%' }]}>
                                <Text style={styles.tableCell}>
                                    {m.status === 'Zavedeno' || m.status === 'Nezavedeno (Přiměřenost)' ? m.description : `Termín: ${m.deadline}`}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
                <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )} fixed />
            </Page>

            {/* Audit Log (V2 Only) */}
            {isV2 && auditLog && auditLog.length > 0 && (
                <Page size="A4" style={styles.page}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Důkazní evidence The Profiler (Audit Log)</Text>
                        <Text style={{ marginBottom: 10, fontSize: 10, color: '#555' }}>
                            Tento protokol dokumentuje procesní kroky a automatizovaná rozhodnutí provedená
                            při vyhodnocení přiměřenosti opatření na základě profilu organizace:
                            {profile ? ` (TCO: ${profile.assetValue} Kč, Budget: ${profile.budgetCap} Kč)` : ''}.
                        </Text>

                        {auditLog.map((log, i) => (
                            <View key={i} style={{ marginBottom: 10, borderBottom: '1px solid #eee', paddingBottom: 5 }}>
                                <Text style={{ fontSize: 10, fontWeight: 'bold' }}>
                                    {new Date(log.timestamp).toLocaleString()} - {log.action}
                                </Text>
                                <Text style={{ fontSize: 10, marginTop: 2 }}>{log.details}</Text>
                            </View>
                        ))}
                    </View>
                    <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
                        `${pageNumber} / ${totalPages}`
                    )} fixed />
                </Page>
            )}

            {/* § 10 Incident Management (V2 Only) */}
            {isV2 && incidentManagement && (
                <Page size="A4" style={styles.page}>
                    <Text style={styles.sectionTitle}>§ 10 Zvládání kybernetických bezpečnostních incidentů</Text>

                    <View style={styles.section}>
                        <Text style={{ fontWeight: 'bold', fontSize: 10, marginTop: 5, marginBottom: 5 }}>Deník kybernetických událostí</Text>
                        <View style={styles.table}>
                            <View style={styles.tableRowHeader}>
                                <View style={{ ...styles.tableCol, width: '30%' }}><Text style={styles.tableCellHeader}>Událost</Text></View>
                                <View style={{ ...styles.tableCol, width: '20%' }}><Text style={styles.tableCellHeader}>Datum</Text></View>
                                <View style={{ ...styles.tableCol, width: '30%' }}><Text style={styles.tableCellHeader}>Dopad (výpadek, zasažení)</Text></View>
                                <View style={{ ...styles.tableCol, width: '20%' }}><Text style={styles.tableCellHeader}>Stav</Text></View>
                            </View>
                            {incidentManagement.events && incidentManagement.events.length > 0 ? (
                                incidentManagement.events.map((e, idx) => (
                                    <View style={styles.tableRow} key={idx}>
                                        <View style={{ ...styles.tableCol, width: '30%' }}><Text style={styles.tableCell}>{e.name}</Text></View>
                                        <View style={{ ...styles.tableCol, width: '20%' }}><Text style={styles.tableCell}>{new Date(e.date).toLocaleDateString('cs-CZ')}</Text></View>
                                        <View style={{ ...styles.tableCol, width: '30%' }}><Text style={styles.tableCell}>{e.downtimeHours}h | {e.usersAffectedPercent}% | {e.financialLoss.toLocaleString('cs-CZ')} Kč</Text></View>
                                        <View style={{ ...styles.tableCol, width: '20%' }}>
                                            <Text style={{ ...styles.tableCell, color: e.significant ? 'red' : 'black', fontWeight: e.significant ? 'bold' : 'normal' }}>
                                                {e.significant ? 'Významný (Hlásit!)' : 'Interní'}
                                            </Text>
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <View style={styles.tableRow}>
                                    <View style={{ ...styles.tableCol, width: '100%' }}><Text style={styles.tableCell}>Žádné zaznamenané události.</Text></View>
                                </View>
                            )}
                        </View>
                    </View>

                    <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
                        `${pageNumber} / ${totalPages}`
                    )} fixed />
                </Page>
            )}

            {/* EMERGENCY Blank Report Template (V2 Only) */}
            {isV2 && (
                <Page size="A4" style={styles.page}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'red', textAlign: 'center', marginBottom: 20, borderBottom: '2pt solid red', paddingBottom: 5 }}>
                        NOUZOVÁ HLÁŠENKA KYBERNETICKÉHO INCIDENTU
                    </Text>
                    <Text style={{ fontSize: 10, fontStyle: 'italic', marginBottom: 20, textAlign: 'center' }}>
                        Tento dokument slouží jako fyzická záloha (Emergency Plan) pro případ částečného nebo úplného výpadku informačních systémů. Vyplňte jej a údaje neprodleně telefonicky nebo datovou schránkou oznamte NÚKIBu.
                    </Text>

                    <View style={styles.section}>
                        <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 15 }}>1. Základní informace</Text>
                        <Text style={{ fontSize: 12, marginBottom: 10 }}>Datum a čas zjištění: ............................................................................</Text>
                        <Text style={{ fontSize: 12, marginBottom: 10 }}>Zjistil (Jméno, Funkce): .........................................................................</Text>
                        <Text style={{ fontSize: 12, marginBottom: 10 }}>Telefonní kontakt pro ověření: .................................................................</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 15 }}>2. Klasifikace incidentu</Text>
                        <Text style={{ fontSize: 12, marginBottom: 10 }}>Zasažené aktivum (Název/Stroj): ........................................................................</Text>
                        <Text style={{ fontSize: 12, marginBottom: 10 }}>Povaha kompromitace (Zakřížkujte): [ ] Dostupnost  [ ] Důvěrnost  [ ] Integrita</Text>
                        <Text style={{ fontSize: 12, marginBottom: 10 }}>Stav probíhá? [ ] Ano (Incident stále trvá)  [ ] Ne (Útok byl zastaven)</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 15 }}>3. Dopad (odhad)</Text>
                        <Text style={{ fontSize: 12, marginBottom: 10 }}>Očekávaný čas nedostupnosti (v hodinách): ...............................................</Text>
                        <Text style={{ fontSize: 12, marginBottom: 10 }}>Odhad podílu zasažených klientů / občanů / pacientů: ................................</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 10 }}>4. Stručný popis co se děje:</Text>
                        <View style={{ border: '1pt solid black', height: 100, marginBottom: 10 }}></View>
                    </View>

                    <Text style={{ fontSize: 10, color: 'red', fontWeight: 'bold', textAlign: 'center', marginTop: 30 }}>
                        Lhůta pro nahlášení výše uvedených prvotních údajů je max. 24 hodin od zjištění!
                    </Text>
                </Page>
            )}

            {/* Signature Page */}
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Prohlášení statutárního orgánu</Text>
                    <Text style={{ marginBottom: 20 }}>
                        Já, níže podepsaný/á {signature?.name}, ve funkci {signature?.role}, stvrzuji,
                        že jsem se seznámil/a s požadavky vyhlášky č. 410/2025 Sb. a že výše uvedená
                        bezpečnostní opatření jsou v organizaci zaváděna dle uvedeného plánu.
                    </Text>

                    <Text style={{ marginBottom: 10 }}>
                        Hlášené oblasti odpovědnosti:
                    </Text>
                    {signature?.declarations && Object.entries(signature.declarations).map(([key, val]) => (
                        val && <Text key={key} style={{ fontSize: 10 }}>• {key.toUpperCase()}</Text>
                    ))}

                    <View style={{ marginTop: 20, marginBottom: 40 }}>
                        <Text style={{ fontWeight: 'bold' }}>
                            {isV2 ? "Statutární orgán byl v souladu s § 4 písm. d) prokazatelně seznámen se stavem plnění bezpečnostních opatření uvedeným v tomto přehledu." : ""}
                        </Text>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <Text>V ........................................ dne ........................</Text>
                    </View>

                    <View style={styles.signatureBox}>
                        <Text>Podpis odpovědné osoby</Text>
                    </View>
                </View>

                <View style={{ position: 'absolute', bottom: 100, textAlign: 'center', width: '100%' }}>
                    <Text style={{ fontSize: 10, color: '#aaa', fontStyle: 'italic' }}>
                        Tento dokument byl vygenerován systémem NIS2 Agent.
                        Pro právní platnost vyžaduje fyzický nebo kvalifikovaný elektronický podpis.
                    </Text>
                </View>

                <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )} fixed />
            </Page>
        </Document>
    );
};

export default AuditReportDocument;
