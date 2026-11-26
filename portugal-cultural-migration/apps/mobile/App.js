import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Image, ImageBackground, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import {
  foods as fallbackFoods,
  legends as fallbackLegends,
  living as fallbackLiving,
  monuments as fallbackMonuments,
} from '@portugal/shared';
import { fetchPortugalContent } from './src/services/portugalContent';

const filterOptions = [
  { value: 'todos', label: 'Todas' },
  { value: 'tradicao', label: 'Tradição popular' },
  { value: 'fe', label: 'Fé e milagres' },
  { value: 'misterio', label: 'Mistério' },
];

const navItems = [
  { label: 'Lendas', target: 'lendas' },
  { label: 'Patrimônio vivo', target: 'vivo' },
  { label: 'Monumentos', target: 'monumentos' },
  { label: 'Culinária', target: 'culinaria' },
];

const normalizeText = (...values) => {
  const value = values.find((entry) => entry !== null && entry !== undefined && String(entry).trim() !== '');
  return value === undefined ? '' : String(value);
};

const normalizeCategoryKey = (value = '') =>
  String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z]/g, '');

const normalizeItem = (item, fallback = {}) => {
  const categoryValue = normalizeText(item?.subcategory, item?.category, item?.tag, item?.type, fallback.category);
  const categoryKey = normalizeCategoryKey(normalizeText(item?.category_key, item?.subcategory, item?.category, fallback.category));

  return {
    title: normalizeText(item?.title, item?.name, fallback.title),
    place: normalizeText(item?.place, item?.location, item?.localidade, fallback.place),
    category: categoryValue,
    categoryKey,
    photo: normalizeText(item?.image_url, item?.photo, item?.image, item?.cover, fallback.photo),
    short: normalizeText(item?.short_description, item?.short, item?.summary, item?.description, fallback.short),
    story: normalizeText(item?.story, item?.content, item?.description, item?.about, fallback.story),
    note: normalizeText(item?.note, item?.details, item?.context, fallback.note),
    date: normalizeText(item?.date, item?.period, item?.year, fallback.date),
    modelPath: normalizeText(item?.model_url, item?.model_path, item?.modelPath, ''),
  };
};

const fallbackData = {
  legends: fallbackLegends,
  living: fallbackLiving,
  monuments: fallbackMonuments,
  foods: fallbackFoods,
};

const getSectionKey = (value = '') => {
  const key = normalizeCategoryKey(value || '');

  if (key.includes('lenda')) return 'legends';
  if (key.includes('patrimoniovivo') || key.includes('patrimonio') || key.includes('vivo')) return 'living';
  if (key.includes('monumento') || key.includes('monument')) return 'monuments';
  if (key.includes('culinaria') || key.includes('food')) return 'foods';

  return null;
};

const getModelBaseUrl = () => {
  const configuredUrl = process.env.EXPO_PUBLIC_WEB_URL;

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, '');
  }

  if (__DEV__ && Platform.OS === 'android') {
    return 'http://10.0.2.2:5174';
  }

  return '';
};

const resolveModelUrl = (value) => {
  const base = getModelBaseUrl();

  if (typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))) {
    return value;
  }

  if (!base) {
    return '';
  }

  const cleaned = String(value || '').trim().replace(/\\/g, '/');
  if (!cleaned) {
    return `${base}/index.html`;
  }

  const normalized = cleaned.startsWith('./')
    ? cleaned.replace(/^\.\//, '/')
    : cleaned.startsWith('/')
      ? cleaned
      : `/${cleaned}`;

  return `${base}${normalized}`.replace(/ /g, '%20');
};

const makeModelUrl = (name) => {
  const map = {
    'Mosteiro dos Jerónimos': '/mosteiro/index.html',
    'Torre de Belém': '/torre de belem/index.html',
    'Mosteiro da Batalha': '/mosteiro da batalha/index.html',
    'Convento de Cristo': '/convento de cristo/index.html',
    'Palácio Nacional da Pena': '/palacio da pena/index.html',
    'Santuário do Bom Jesus do Monte': '/santuario jesus/index.html',
  };

  return resolveModelUrl(map[name] || '/index.html');
};

const openModelViewer = (url) => {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    return;
  }

  if (typeof url === 'string' && url) {
    // kept for native platforms; the modal below renders the WebView only on non-web targets.
    return url;
  }

  return null;
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
          source={resolveImageSource(item.photo, { uri: 'https://projeto-integrador-3-ano.vercel.app/img/galo-de-barcelos.jpg' })}
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
          <Pressable style={styles.modelTag} onPress={() => onModelOpen(item.title, item.modelPath)}>
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

          <Image source={resolveImageSource(item.photo, { uri: 'https://projeto-integrador-3-ano.vercel.app/img/galo-de-barcelos.jpg' })} style={styles.dialogImage} resizeMode="cover" />

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
  const [legendsData, setLegendsData] = useState(fallbackData.legends);
  const [livingData, setLivingData] = useState(fallbackData.living);
  const [monumentsData, setMonumentsData] = useState(fallbackData.monuments);
  const [foodsData, setFoodsData] = useState(fallbackData.foods);
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroImage, setHeroImage] = useState('');
  const [featureImage, setFeatureImage] = useState('');
  const scrollRef = useRef(null);
  const sectionOffsets = useRef({});

  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      try {
        const rows = await fetchPortugalContent();

        if (!Array.isArray(rows) || rows.length === 0) {
          return;
        }

        const groups = { legends: [], living: [], monuments: [], foods: [] };

        rows.forEach((row) => {
          const sectionKey = getSectionKey(
            normalizeText(row?.section, row?.section_name, row?.category_section, row?.group, row?.type)
          );

          if (!sectionKey) return;
          groups[sectionKey].push(normalizeItem(row, fallbackData[sectionKey][0] || {}));
        });

        if (!isMounted) return;

        const remoteLegends = groups.legends.filter((item) => normalizeText(item.title));
        const remoteLiving = groups.living.filter((item) => normalizeText(item.title));
        const remoteMonuments = groups.monuments.filter((item) => normalizeText(item.title));
        const remoteFoods = groups.foods.filter((item) => normalizeText(item.title));

        setLegendsData(remoteLegends.length ? remoteLegends : fallbackData.legends);
        setLivingData(remoteLiving.length ? remoteLiving : fallbackData.living);
        setMonumentsData(remoteMonuments.length ? remoteMonuments : fallbackData.monuments);
        setFoodsData(remoteFoods.length ? remoteFoods : fallbackData.foods);

        if (rows.length) {
          const heroRow = rows.find((row) =>
            row.section === 'site' ||
            row.subcategory === 'hero' ||
            row.title === 'Descubra Portugal'
          );

          if (heroRow) {
            setHeroImage(normalizeText(heroRow.image_url, heroRow.photo, heroRow.image, heroRow.cover));
          }

          const featureRow = rows.find((row) => row.section === 'site' && row.key === 'feature');

          if (featureRow) setFeatureImage(normalizeText(featureRow.photo, featureRow.image, featureRow.cover));
        }
      } catch (error) {
        console.error('Erro ao carregar dados do Supabase:', error);
      }
    };

    loadContent();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleLegends = useMemo(() => {
    if (activeFilter === 'todos') return legendsData;
    return legendsData.filter((item) => {
      if (!item.categoryKey) return item.category === activeFilter;
      return item.categoryKey === activeFilter || item.categoryKey.includes(activeFilter);
    });
  }, [activeFilter, legendsData]);

  const handleMenuToggle = () => {
    setMenuOpen((prev) => !prev);
  };

  const scrollToSection = (target) => {
    setMenuOpen(false);

    const y = sectionOffsets.current[target];

    if (typeof y === 'number') {
      scrollRef.current?.scrollTo({ y: Math.max(0, y - 72), animated: true });
    } else if (target === 'inicio') {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />

        <View style={styles.header}>
          <View style={styles.logoWrap}>
            <View style={styles.logoIcon}><Text style={styles.logoIconText}>P</Text></View>
            <View>
              <Text style={styles.logoText}>PORTUGAL</Text>
              <Text style={styles.logoSmall}>ENTRE LENDAS E PATRIMÔNIOS</Text>
            </View>
          </View>

          <Pressable onPress={handleMenuToggle} style={styles.hamburgerButton} accessibilityLabel="Abrir menu">
            <Text style={styles.hamburgerIcon}>{menuOpen ? '✕' : '☰'}</Text>
          </Pressable>

          {menuOpen && (
            <View style={styles.mobileMenu}>
              {navItems.map((item) => (
                <Pressable
                  key={item.target}
                  style={styles.mobileMenuItem}
                  onPress={() => scrollToSection(item.target)}
                >
                  <Text style={styles.mobileMenuText}>{item.label}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <ScrollView
          ref={scrollRef}
          onScroll={() => menuOpen && setMenuOpen(false)}
          scrollEventThrottle={16}
        >
          <ImageBackground
            source={heroImage ? resolveImageSource(heroImage, { uri: 'https://projeto-integrador-3-ano.vercel.app/img/descubra-portugal.jpg' }) : { uri: 'https://projeto-integrador-3-ano.vercel.app/img/descubra-portugal.jpg' }}
            style={styles.hero}
            onLayout={(event) => { sectionOffsets.current.inicio = event.nativeEvent.layout.y; }}
            imageStyle={styles.heroImage}
          >
            <View style={styles.heroOverlay} />
            <View style={styles.heroContent}>
              <Text style={styles.eyebrow}>DESCUBRA PORTUGAL</Text>
              <Text style={styles.heroTitle}>Um país de{'\n'}<Text style={styles.heroAccent}>histórias eternas.</Text></Text>
              <Text style={styles.heroText}>Viaje pelas lendas, descubra monumentos históricos e conheça as tradições e os sabores que fazem parte da identidade portuguesa.</Text>

              <Pressable style={styles.heroButton}>
                <Text style={styles.heroButtonText}>Começar a explorar ↓</Text>
              </Pressable>
            </View>

            <Text style={styles.heroCaption}>CULTURA · HISTÓRIA · TRADIÇÃO</Text>
          </ImageBackground>

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

          <View
            style={styles.section}
            onLayout={(event) => { sectionOffsets.current.lendas = event.nativeEvent.layout.y; }}
          >
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
                  key={`${item.title}-${index}`}
                  item={item}
                  index={index}
                  type="legend"
                  onOpen={(detail, type) => { setSelectedItem(detail); setSelectedType(type); }}
                  onModelOpen={() => {}}
                />
              ))}
            </View>
          </View>

          <View
            style={styles.sectionLiving}
            onLayout={(event) => { sectionOffsets.current.vivo = event.nativeEvent.layout.y; }}
          >
            <Text style={styles.eyebrowDark}>02 / CULTURA EM MOVIMENTO</Text>
            <Text style={styles.sectionTitle}>Patrimônio <Text style={styles.inlineAccent}>cultural vivo</Text></Text>
            <View style={styles.cardsGrid}>
              {livingData.map((item, index) => (
                <Card
                  key={`${item.title}-${index}`}
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
            <ImageBackground
              source={featureImage ? resolveImageSource(featureImage, { uri: 'https://projeto-integrador-3-ano.vercel.app/img/santuariobomjesus.jpg' }) : { uri: 'https://projeto-integrador-3-ano.vercel.app/img/santuariobomjesus.jpg' }}
              style={styles.featureImage}
              imageStyle={styles.featureImageFill}
            />
            <View style={styles.featureContent}>
              <Text style={styles.eyebrow}>MEMÓRIA E IDENTIDADE</Text>
              <Text style={styles.featureTitle}>O passado continua <Text style={styles.inlineAccentLight}>presente.</Text></Text>
              <Text style={styles.featureText}>Portugal preserva construções que atravessaram séculos e tradições que continuam vivas nas comunidades. Conhecer esse patrimônio é conhecer a história de um povo.</Text>
            </View>
          </View>

          <View
            style={styles.section}
            onLayout={(event) => {
              sectionOffsets.current.monumentos = event.nativeEvent.layout.y;
            }}
          >
            <Text style={styles.eyebrowDark}>03 / PATRIMÔNIO ARQUITETÔNICO</Text>
            <Text style={styles.sectionTitle}>Construções que <Text style={styles.inlineAccent}>contam histórias</Text></Text>

            <View style={styles.cardsGrid}>
              {monumentsData.map((item, index) => (
                <Card
                  key={`${item.title}-${index}`}
                  item={item}
                  index={index}
                  type="monument"
                  onOpen={(detail, type) => { setSelectedItem(detail); setSelectedType(type); }}
                  onModelOpen={(modelName, modelPath) => {
                    const nextUrl = resolveModelUrl(modelPath || makeModelUrl(modelName));

                    if (!nextUrl) {
                      setSelectedItem({
                        title: 'Modelo 3D indisponível',
                        place: 'Configuração necessária',
                        category: 'Modelo 3D',
                        photo: 'img/santuariobomjesus.jpg',
                        short: 'A URL pública da versão web ainda não foi configurada no APK.',
                        story: 'Configure EXPO_PUBLIC_WEB_URL com o endereço HTTPS publicado da versão web e gere novamente o APK.',
                        note: 'Os modelos 3D não podem usar localhost em celulares físicos.',
                      });
                      setSelectedType('monument');
                      return;
                    }

                    if (Platform.OS === 'web') {
                      openModelViewer(nextUrl);
                      return;
                    }

                    setModelUrl(nextUrl);
                  }}
                />
              ))}
            </View>
          </View>

          <View
            style={styles.section}
            onLayout={(event) => { sectionOffsets.current.culinaria = event.nativeEvent.layout.y; }}
          >
            <Text style={styles.eyebrowDark}>05 / GASTRONOMIA</Text>
            <Text style={styles.sectionTitle}>Uma cultura que também <Text style={styles.inlineAccent}>se prova.</Text></Text>

            <View style={styles.cardsGrid}>
              {foodsData.map((item, index) => (
                <Card
                  key={`${item.title}-${index}`}
                  item={item}
                  index={index}
                  type="food"
                  onOpen={(detail, type) => { setSelectedItem(detail); setSelectedType(type); }}
                  onModelOpen={() => {}}
                />
              ))}
            </View>
          </View>

          <View style={styles.closing}>
            <Text style={styles.quote}>“</Text>
            <Text style={styles.closingTitle}>Conhecer Portugal é descobrir as histórias que vivem em seus lugares, tradições e sabores.</Text>
            <Text style={styles.closingCaption}>UM PAÍS · MUITAS HISTÓRIAS</Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.footerBrand}>
              <View style={styles.logoIcon}><Text style={styles.logoIconText}>P</Text></View>
              <View>
                <Text style={styles.footerTitle}>PORTUGAL</Text>
                <Text style={styles.footerSmall}>ENTRE LENDAS E PATRIMÔNIOS</Text>
              </View>
            </View>

            <Text style={styles.footerText}>Projeto Integrador · Cultura e história portuguesa</Text>

            <Pressable onPress={() => scrollToSection('inicio')}>
              <Text style={styles.footerTop}>Voltar ao topo ↑</Text>
            </Pressable>
          </View>
        </ScrollView>

        <DetailsModal visible={Boolean(selectedItem)} item={selectedItem} type={selectedType} onClose={() => setSelectedItem(null)} />

        {Platform.OS !== 'web' && modelUrl && (
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
    </SafeAreaProvider>
  );
}

const localImages = {};

const resolveImageSource = (photo, fallback) => {
  if (!photo) return fallback;

  const cleaned = String(photo).replace(/\\/g, '/').trim();
  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
    return { uri: cleaned };
  }

  const base = process.env.EXPO_PUBLIC_WEB_URL;
  if (base && cleaned.startsWith('img/')) {
    return { uri: `${base.replace(/\/$/, '')}/${cleaned}` };
  }

  return fallback;
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fffdf8' },
  header: { paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fffdf8', borderBottomWidth: 1, borderBottomColor: '#e3ddd1', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logoWrap: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#146b45', alignItems: 'center', justifyContent: 'center' },
  logoIconText: { color: '#fff', fontSize: 22, fontWeight: '700', marginTop: -2, fontFamily: 'serif' },
  logoText: { fontWeight: '700', letterSpacing: 2, fontSize: 20, color: '#202b25' },
  logoSmall: { color: '#68716b', fontSize: 9, letterSpacing: 2, marginTop: 2 },
  hero: { minHeight: 420, justifyContent: 'flex-end', paddingHorizontal: 20, paddingTop: 36, paddingBottom: 18 },
  heroImage: { resizeMode: 'cover' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(9, 35, 25, 0.55)' },
  heroContent: { position: 'relative', zIndex: 1, width: '88%', paddingBottom: 10 },
  eyebrow: { color: '#e2c58c', fontSize: 11, letterSpacing: 2, marginBottom: 12, fontWeight: '700' },
  eyebrowDark: { color: '#a92732', fontSize: 11, letterSpacing: 2, fontWeight: '700', marginBottom: 12 },
  heroTitle: { fontSize: 54, fontWeight: '600', lineHeight: 54, color: '#fff', fontFamily: 'serif', letterSpacing: -1.5, marginBottom: 16 },
  heroAccent: { color: '#c59a51' },
  heroText: { color: 'rgba(255,255,255,0.85)', marginTop: 14, fontSize: 16, lineHeight: 24, width: '92%' },
  heroButton: { marginTop: 22, backgroundColor: '#146b45', paddingHorizontal: 18, paddingVertical: 14, borderRadius: 8, width: 200, alignItems: 'center' },
  heroButtonText: { color: '#fff', fontWeight: '700' },
  heroCaption: { position: 'relative', zIndex: 1, color: 'rgba(255,255,255,0.72)', fontSize: 10, letterSpacing: 3, marginTop: 10, marginBottom: 4 },
  section: { padding: 28, backgroundColor: '#fffdf8' },
  sectionTitle: { fontSize: 34, lineHeight: 38, fontWeight: '600', marginBottom: 16, fontFamily: 'serif', color: '#202b25' },
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
  featureImageFill: { resizeMode: 'cover' },
  featureContent: { padding: 28 },
  featureTitle: { color: '#fff', fontSize: 30, fontWeight: '600', fontFamily: 'serif', marginBottom: 12 },
  featureText: { color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 20 },
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
  hamburgerButton: { padding: 10 },
  hamburgerIcon: { fontSize: 24, color: '#202b25' },
  menuOverlay: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 1 },
  menuContent: { backgroundColor: '#fffdf8', padding: 24, borderTopLeftRadius: 16, borderTopRightRadius: 16, flex: 1 },
  menuHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  menuTitle: { fontSize: 22, fontWeight: '600', color: '#202b25' },
  menuCloseButton: { padding: 10 },
  menuCloseIcon: { fontSize: 24, color: '#202b25' },
  menuItem: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#e3ddd1' },
  menuItemText: { fontSize: 16, color: '#202b25' },
  mobileMenu: { position: 'absolute', top: 60, right: 20, backgroundColor: '#fffdf8', borderRadius: 8, overflow: 'hidden', elevation: 4, zIndex: 10 },
  mobileMenuItem: { paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#e3ddd1' },
  mobileMenuText: { fontSize: 16, color: '#202b25' },
  closing: { backgroundColor: '#fffdf8', paddingHorizontal: 28, paddingVertical: 56, alignItems: 'center' },
  quote: { color: '#c59a51', fontSize: 62, lineHeight: 62, fontFamily: 'serif' },
  closingTitle: { maxWidth: 760, textAlign: 'center', color: '#202b25', fontSize: 29, lineHeight: 36, fontFamily: 'serif', marginBottom: 16 },
  closingCaption: { color: '#68716b', fontSize: 10, letterSpacing: 3, textAlign: 'center' },
  footer: { backgroundColor: '#112f23', paddingHorizontal: 28, paddingVertical: 28, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: 16 },
  footerBrand: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  footerTitle: { color: '#fff', fontWeight: '700', letterSpacing: 2, fontSize: 18 },
  footerSmall: { color: 'rgba(255,255,255,0.65)', fontSize: 9, letterSpacing: 2, marginTop: 2 },
  footerText: { color: '#fff', fontSize: 12, lineHeight: 18, opacity: 0.9 },
  footerTop: { color: '#fff', fontSize: 12, fontWeight: '700', paddingVertical: 6 },
});
