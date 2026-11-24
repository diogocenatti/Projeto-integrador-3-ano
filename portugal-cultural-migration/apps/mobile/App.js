import React, { useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import {
  foods,
  image,
  legends,
  living,
  monuments,
} from '@portugal/shared';

const filterOptions = [
  { value: 'todos', label: 'Todas' },
  { value: 'tradicao', label: 'Tradição popular' },
  { value: 'fe', label: 'Fé e milagres' },
  { value: 'misterio', label: 'Mistério' },
];

const makeModelUrl = (name) => {
  const base = 'http://localhost:5173';
  const map = {
    'Mosteiro dos Jerónimos': '/mosteiro/index.html',
    'Torre de Belém': '/torre de belem/index.html',
    'Mosteiro da Batalha': '/mosteiro da batalha/index.html',
    'Convento de Cristo': '/convento de cristo/index.html',
    'Palácio Nacional da Pena': '/palacio da pena/index.html',
    'Santuário do Bom Jesus do Monte': '/santuario jesus/index.html',
  };

  return `${base}${map[name] || '/index.html'}`;
};

function Card({ item, index, type, onOpen, onModelOpen }) {
  const meta = type === 'monument' ? item.date : type === 'legend' ? item.place : item.category;
  const buttonText =
    type === 'legend'
      ? 'Ler a história'
      : type === 'monument'
        ? 'Conhecer monumento'
        : type === 'living'
          ? 'Conhecer tradição'
          : 'Conhecer o prato';

  return (
    <View style={styles.card}>
      <View style={styles.cardImageWrap}>
        <Image
          source={{ uri: image(item.photo) }}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <Text style={styles.cardNumber}>{String(index + 1).padStart(2, '0')} / 06</Text>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardMeta}>{meta}</Text>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardText}>{item.short}</Text>

        {type === 'monument' && (
          <Pressable style={styles.modelTag} onPress={() => onModelOpen(item.title)}>
            <Text style={styles.modelTagText}>◇ Visualizar modelo 3D</Text>
          </Pressable>
        )}

        <Pressable onPress={() => onOpen(item, type)}>
          <Text style={styles.cardAction}>{buttonText} ↗</Text>
        </Pressable>
      </View>
    </View>
  );
}

function DetailsModal({ visible, item, type, onClose }) {
  if (!item) return null;

  let category = 'Culinária portuguesa';
  let extra = null;

  if (type === 'legend') {
    category = 'Mitos e lendas';
    extra = (
      <View style={styles.dialogNote}>
        <Text><Text style={styles.bold}>Local associado:</Text> {item.place}</Text>
        <Text style={{ marginTop: 8 }}>{item.note}</Text>
      </View>
    );
  } else if (type === 'living') {
    category = 'Patrimônio cultural vivo';
    extra = (
      <>
        <Text><Text style={styles.bold}>Local / região:</Text> {item.place}</Text>
        <Text><Text style={styles.bold}>Categoria:</Text> {item.category}</Text>
        <View style={styles.dialogNote}><Text>{item.note}</Text></View>
      </>
    );
  } else if (type === 'monument') {
    category = 'Patrimônio histórico';
    extra = (
      <>
        <Text><Text style={styles.bold}>Localização:</Text> {item.place}</Text>
        <Text><Text style={styles.bold}>Período:</Text> {item.date}</Text>
        <Text><Text style={styles.bold}>Estilo / contexto:</Text> {item.category}</Text>
        <View style={styles.dialogNote}>
          <Text><Text style={styles.bold}>Modelagem 3D:</Text> esta área está reservada para a integração do modelo que será desenvolvido pela equipe.</Text>
          <Text style={{ marginTop: 8 }}>{item.note}</Text>
        </View>
      </>
    );
  } else {
    extra = (
      <>
        <Text><Text style={styles.bold}>Região / tradição:</Text> {item.place}</Text>
        <View style={styles.dialogNote}><Text>{item.note}</Text></View>
      </>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </Pressable>

          <Image source={{ uri: image(item.photo, 1200) }} style={styles.dialogImage} resizeMode="cover" />

          <View style={styles.dialogBody}>
            <Text style={styles.eyebrowDark}>{category}</Text>
            <Text style={styles.dialogTitle}>{item.title}</Text>
            <Text style={styles.dialogParagraph}>{item.story}</Text>
            {extra}
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function App() {
  const [activeFilter, setActiveFilter] = useState('todos');
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState('legend');
  const [modelUrl, setModelUrl] = useState(null);

  const visibleLegends = useMemo(() => {
    if (activeFilter === 'todos') return legends;
    return legends.filter((item) => item.category === activeFilter);
  }, [activeFilter]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.logoText}>PORTUGAL</Text>
          <Text style={styles.logoSmall}>ENTRE LENDAS E PATRIMÔNIOS</Text>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>DESCUBRA PORTUGAL</Text>
          <Text style={styles.heroTitle}>Um país de{'
'}<Text style={styles.heroAccent}>histórias eternas.</Text></Text>
          <Text style={styles.heroText}>Viaje pelas lendas, descubra monumentos históricos e conheça as tradições e os sabores que fazem parte da identidade portuguesa.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.eyebrowDark}>UMA VIAGEM CULTURAL</Text>
          <Text style={styles.sectionTitle}>Conheça Portugal além dos cartões-postais.</Text>
          <Text style={styles.sectionParagraph}>Um lugar é feito de muito mais do que paisagens...</Text>

          <View style={styles.statsRow}>
            {[
              ['06', 'Mitos e lendas'],
              ['06', 'Tradições vivas'],
              ['06', 'Monumentos'],
              ['06', 'Sabores típicos'],
            ].map(([value, label]) => (
              <View key={label} style={styles.stat}>
                <Text style={styles.statValue}>{value}</Text>
                <Text style={styles.statLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.eyebrowDark}>01 / IMAGINÁRIO POPULAR</Text>
          <Text style={styles.sectionTitle}>Mitos <Text style={styles.inlineAccent}>e lendas</Text></Text>
          <View style={styles.filtersRow}>
            {filterOptions.map((option) => (
              <Pressable
                key={option.value}
                style={[styles.filter, activeFilter === option.value && styles.filterActive]}
                onPress={() => setActiveFilter(option.value)}
              >
                <Text style={[styles.filterText, activeFilter === option.value && styles.filterTextActive]}>{option.label}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.cardsGrid}>
            {visibleLegends.map((item, index) => (
              <Card
                key={item.title}
                item={item}
                index={index}
                type="legend"
                onOpen={(detail, type) => { setSelectedItem(detail); setSelectedType(type); }}
                onModelOpen={() => {}}
              />
            ))}
          </View>
        </View>

        <View style={styles.sectionLiving}>
          <Text style={styles.eyebrowDark}>02 / CULTURA EM MOVIMENTO</Text>
          <Text style={styles.sectionTitle}>Patrimônio <Text style={styles.inlineAccent}>cultural vivo</Text></Text>
          <View style={styles.cardsGrid}>
            {living.map((item, index) => (
              <Card
                key={item.title}
                item={item}
                index={index}
                type="living"
                onOpen={(detail, type) => { setSelectedItem(detail); setSelectedType(type); }}
                onModelOpen={() => {}}
              />
            ))}
          </View>
        </View>

        <View style={styles.feature}>
          <View style={styles.featureImage} />
          <View style={styles.featureContent}>
            <Text style={styles.eyebrow}>MEMÓRIA E IDENTIDADE</Text>
            <Text style={styles.featureTitle}>O passado continua <Text style={styles.inlineAccentLight}>presente.</Text></Text>
            <Text style={styles.featureText}>Portugal preserva construções que atravessaram séculos...</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.eyebrowDark}>03 / PATRIMÔNIO ARQUITETÔNICO</Text>
          <Text style={styles.sectionTitle}>Construções que <Text style={styles.inlineAccent}>contam histórias</Text></Text>

          <View style={styles.cardsGrid}>
            {monuments.map((item, index) => (
              <Card
                key={item.title}
                item={item}
                index={index}
                type="monument"
                onOpen={(detail, type) => { setSelectedItem(detail); setSelectedType(type); }}
                onModelOpen={(modelName) => setModelUrl(makeModelUrl(modelName))}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.eyebrowDark}>05 / GASTRONOMIA</Text>
          <Text style={styles.sectionTitle}>Uma cultura que também <Text style={styles.inlineAccent}>se prova.</Text></Text>

          <View style={styles.cardsGrid}>
            {foods.map((item, index) => (
              <Card
                key={item.title}
                item={item}
                index={index}
                type="food"
                onOpen={(detail, type) => { setSelectedItem(detail); setSelectedType(type); }}
                onModelOpen={() => {}}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <DetailsModal visible={Boolean(selectedItem)} item={selectedItem} type={selectedType} onClose={() => setSelectedItem(null)} />

      {modelUrl && (
        <Modal visible={Boolean(modelUrl)} transparent animationType="slide" onRequestClose={() => setModelUrl(null)}>
          <View style={styles.viewerModal}>
            <Pressable style={styles.closeViewerButton} onPress={() => setModelUrl(null)}>
              <Text style={styles.closeButtonText}>×</Text>
            </Pressable>
            <WebView source={{ uri: modelUrl }} style={styles.webView} />
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fffdf8' },
  header: { padding: 20, backgroundColor: '#fffdf8', borderBottomWidth: 1, borderBottomColor: '#e3ddd1' },
  logoText: { fontWeight: '700', letterSpacing: 2, fontSize: 20 },
  logoSmall: { color: '#68716b', fontSize: 10, letterSpacing: 2, marginTop: 4 },
  hero: { minHeight: 220, padding: 30, backgroundColor: '#103c2b', justifyContent: 'center' },
  eyebrow: { color: '#e2c58c', fontSize: 11, letterSpacing: 2, marginBottom: 12, fontWeight: '700' },
  eyebrowDark: { color: '#a92732', fontSize: 11, letterSpacing: 2, fontWeight: '700', marginBottom: 12 },
  heroTitle: { fontSize: 42, fontWeight: '600', lineHeight: 44, color: '#fff', fontFamily: 'serif' },
  heroAccent: { color: '#c59a51' },
  heroText: { color: 'rgba(255,255,255,0.85)', marginTop: 14, fontSize: 16 },
  section: { padding: 28, backgroundColor: '#fffdf8' },
  sectionTitle: { fontSize: 32, lineHeight: 36, fontWeight: '600', marginBottom: 16, fontFamily: 'serif', color: '#202b25' },
  inlineAccent: { color: '#146b45' },
  inlineAccentLight: { color: '#c59a51' },
  sectionParagraph: { color: '#68716b', fontSize: 15 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, flexWrap: 'wrap' },
  stat: { width: '48%', marginBottom: 16 },
  statValue: { color: '#146b45', fontSize: 32, fontWeight: '700', fontFamily: 'serif' },
  statLabel: { color: '#68716b', fontSize: 12 },
  filtersRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 18, gap: 8 },
  filter: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#e3ddd1', backgroundColor: 'transparent' },
  filterActive: { backgroundColor: '#146b45', borderColor: '#146b45' },
  filterText: { color: '#68716b', fontSize: 12 },
  filterTextActive: { color: '#fff' },
  cardsGrid: { gap: 12 },
  card: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e3ddd1', overflow: 'hidden', marginBottom: 16 },
  cardImageWrap: { position: 'relative', height: 200 },
  cardImage: { width: '100%', height: '100%' },
  cardNumber: { position: 'absolute', top: 12, left: 12, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#fffdf8', color: '#103c2b', fontSize: 11, fontWeight: '700' },
  cardBody: { padding: 18 },
  cardMeta: { color: '#a92732', fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' },
  cardTitle: { fontSize: 22, fontWeight: '600', marginBottom: 8, fontFamily: 'serif', color: '#202b25' },
  cardText: { color: '#68716b', fontSize: 14, marginBottom: 14 },
  modelTag: { backgroundColor: '#eaf0f4', paddingHorizontal: 10, paddingVertical: 8, marginBottom: 12, borderRadius: 6 },
  modelTagText: { color: '#244d70', fontSize: 12, fontWeight: '700' },
  cardAction: { color: '#146b45', fontWeight: '700', fontSize: 13 },
  sectionLiving: { padding: 28, backgroundColor: '#f5f0e6' },
  feature: { flexDirection: 'column', backgroundColor: '#103c2b' },
  featureImage: { height: 260, backgroundColor: '#c59a51' },
  featureContent: { padding: 28 },
  featureTitle: { color: '#fff', fontSize: 30, fontWeight: '600', fontFamily: 'serif', marginBottom: 12 },
  featureText: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(8, 22, 15, 0.75)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: '92%', maxWidth: 700, backgroundColor: '#fffdf8', borderRadius: 12, overflow: 'hidden' },
  closeButton: { position: 'absolute', right: 12, top: 12, width: 38, height: 38, borderRadius: 19, backgroundColor: '#fff', zIndex: 2, alignItems: 'center', justifyContent: 'center' },
  closeButtonText: { fontSize: 26, color: '#202b25' },
  dialogImage: { width: '100%', height: 220 },
  dialogBody: { padding: 20 },
  dialogTitle: { fontSize: 28, fontWeight: '600', marginBottom: 12, fontFamily: 'serif', color: '#202b25' },
  dialogParagraph: { color: '#515e56', fontSize: 14, marginBottom: 12 },
  dialogNote: { marginTop: 16, paddingLeft: 12, borderLeftWidth: 3, borderLeftColor: '#c59a51', paddingVertical: 4 },
  bold: { fontWeight: '700' },
  viewerModal: { flex: 1, backgroundColor: '#000' },
  closeViewerButton: { position: 'absolute', right: 18, top: 36, width: 38, height: 38, borderRadius: 19, backgroundColor: '#fff', zIndex: 2, alignItems: 'center', justifyContent: 'center' },
  webView: { flex: 1, marginTop: 60 },
});
