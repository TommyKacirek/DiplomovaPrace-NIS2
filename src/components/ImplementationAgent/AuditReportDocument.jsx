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

const AuditReportDocument = ({ data }) => {
    const { roles, assets, assetRules, signature, measures, revision } = data;

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
                    <Text style={styles.sectionTitle}>§ 4 Pravidla pro aktiva</Text>
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

            {/* Measures Table */}
            <Page size="A4" style={styles.page}>
                <Text style={styles.sectionTitle}>Přehled bezpečnostních opatření</Text>
                <View style={styles.table}>
                    <View style={[styles.tableRow, { backgroundColor: '#f0f0f0' }]}>
                        <View style={[styles.tableCol, { width: '30%' }]}>
                            <Text style={styles.tableCell}>Opatření</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '20%' }]}>
                            <Text style={styles.tableCell}>Stav</Text>
                        </View>
                        <View style={[styles.tableCol, { width: '50%' }]}>
                            <Text style={styles.tableCell}>Poznámka / Termín</Text>
                        </View>
                    </View>
                    {measures && measures.map((m, i) => (
                        <View key={i} style={styles.tableRow}>
                            <View style={[styles.tableCol, { width: '30%' }]}>
                                <Text style={styles.tableCell}>{m.title}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '20%' }]}>
                                <Text style={styles.tableCell}>{m.status}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '50%' }]}>
                                <Text style={styles.tableCell}>
                                    {m.status === 'Zavedeno' ? m.description : `Termín: ${m.deadline}`}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
                <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )} fixed />
            </Page>

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

                    <View style={{ marginTop: 80 }}>
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
