import { useEffect, useMemo, useRef, useState } from 'react';
import { fetchPortugalContent } from './services/portugalContent';
import {
  foods as fallbackFoods,
  image,
  legends as fallbackLegends,
  living as fallbackLiving,
  monuments as fallbackMonuments,
  monumentModels,
} from '@portugal/shared';

const filterOptions = [
  { value: 'todos', label: 'Todas' },
  { value: 'tradicao', label: 'Tradição popular' },
  { value: 'fe', label: 'Fé e milagres' },
  { value: 'misterio', label: 'Mistério' },
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
  const categoryKey = normalizeCategoryKey(
    normalizeText(item?.category_key, item?.subcategory, item?.category, fallback.category)
  );

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
    modelPath: normalizeText(item?.model_url, item?.model_path, item?.modelPath, item?.model_url, monumentModels[fallback.title] || ''),
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

function Card({ item, index, type, onOpen }) {
  const imageAlt = `${item.title} — ${item.place}`;
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
    <article className="card" data-category={type === 'legend' ? item.categoryKey || item.category : undefined}>
      <div className="card-image">
        <img
          src={image(item.photo)}
          alt={imageAlt}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
        />
        <span className="card-number">{String(index + 1).padStart(2, '0')} / 06</span>
      </div>

      <div className="card-body">
        <div className="card-meta">{meta}</div>
        <h3>{item.title}</h3>
        <p>{item.short}</p>

        {type === 'monument' && (
          <button
            className="model-tag"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              const modelPath = item.modelPath || monumentModels[item.title];
              if (modelPath) {
                window.open(modelPath, '_blank');
              }
            }}
          >
            ◇ Visualizar modelo 3D
          </button>
        )}

        <button className="card-action" type="button" onClick={() => onOpen(item, type)}>
          {buttonText} ↗
        </button>
      </div>
    </article>
  );
}

function DetailDialog({ item, type, open, onClose }) {
  const dialogRef = useRef(null);

  if (!item) return null;

  let category = 'Culinária portuguesa';
  let extra = '';

  if (type === 'legend') {
    category = 'Mitos e lendas';
    extra = `
      <div class="dialog-note">
        <strong>Local associado:</strong> ${item.place}
        <br><br>
        ${item.note}
      </div>
    `;
  } else if (type === 'living') {
    category = 'Patrimônio cultural vivo';
    extra = `
      <p><strong>Local / região:</strong> ${item.place}</p>
      <p><strong>Categoria:</strong> ${item.category}</p>
      <div class="dialog-note">${item.note}</div>
    `;
  } else if (type === 'monument') {
    category = 'Patrimônio histórico';
    extra = `
      <p><strong>Localização:</strong> ${item.place}</p>
      <p><strong>Período:</strong> ${item.date}</p>
      <p><strong>Estilo / contexto:</strong> ${item.category}</p>
      <div class="dialog-note">
        <strong>Modelagem 3D:</strong>
        esta área está reservada para a integração do modelo
        que será desenvolvido pela equipe.
        <br><br>
        ${item.note}
      </div>
    `;
  } else {
    extra = `
      <p><strong>Região / tradição:</strong> ${item.place}</p>
      <div class="dialog-note">${item.note}</div>
    `;
  }

  return (
    <dialog
      ref={dialogRef}
      id="detailsDialog"
      open={open}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      onCancel={onClose}
    >
      <button id="closeDialog" className="close-dialog" type="button" aria-label="Fechar janela" onClick={onClose}>
        ×
      </button>
      <div id="dialogContent">
        <img
          className="dialog-image"
          src={image(item.photo, 1200)}
          alt={item.title}
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
        />

        <div className="dialog-body">
          <span className="eyebrow dark">{category}</span>
          <h2 id="dialogTitle">{item.title}</h2>
          <p>{item.story}</p>
          <div dangerouslySetInnerHTML={{ __html: extra }} />
        </div>
      </div>
    </dialog>
  );
}

export default function App() {
  const [activeFilter, setActiveFilter] = useState('todos');
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState('legend');
  const [legendsData, setLegendsData] = useState(fallbackData.legends);
  const [livingData, setLivingData] = useState(fallbackData.living);
  const [monumentsData, setMonumentsData] = useState(fallbackData.monuments);
  const [foodsData, setFoodsData] = useState(fallbackData.foods);
  const [heroImage, setHeroImage] = useState('');
  const [featureImage, setFeatureImage] = useState('');

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

  return (
    <>
      <header className="header">
        <a href="#inicio" className="logo">
          <span className="logo-icon">P</span>
          <span>
            PORTUGAL
            <small>ENTRE LENDAS E PATRIMÔNIOS</small>
          </span>
        </a>

        <button
          className="menu-toggle"
          id="menuToggle"
          type="button"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? '×' : '☰'}
        </button>

        <nav id="nav" className={menuOpen ? 'open' : ''}>
          <a href="#lendas" onClick={() => setMenuOpen(false)}>Lendas</a>
          <a href="#vivo" onClick={() => setMenuOpen(false)}>Patrimônio vivo</a>
          <a href="#monumentos" onClick={() => setMenuOpen(false)}>Monumentos</a>
          <a href="#culinaria" onClick={() => setMenuOpen(false)}>Culinária</a>
        </nav>
      </header>

      <main>
        <section
          className="hero"
          id="inicio"
          style={heroImage ? { backgroundImage: `linear-gradient(90deg, rgba(9,35,25,.88), rgba(9,35,25,.3)), url("${image(heroImage, 2000)}")` } : { backgroundImage: 'linear-gradient(90deg, rgba(9,35,25,.88), rgba(9,35,25,.3)), url("/img/descubra-portugal.jpg")', backgroundPosition: 'center 55%', backgroundSize: 'cover' }}
        >
          <div className="hero-content">
            <span className="eyebrow">DESCUBRA PORTUGAL</span>
            <h1>
              Um país de<br />
              <em>histórias eternas.</em>
            </h1>
            <p>
              Viaje pelas lendas, descubra monumentos históricos e conheça
              as tradições e os sabores que fazem parte da identidade portuguesa.
            </p>
            <a href="#explorar" className="button">
              Começar a explorar ↘
            </a>
          </div>
          <div className="hero-caption">CULTURA · HISTÓRIA · TRADIÇÃO</div>
        </section>

        <section className="intro section" id="explorar">
          <span className="eyebrow dark">UMA VIAGEM CULTURAL</span>
          <h2>Conheça Portugal além dos cartões-postais.</h2>
          <p>
            Um lugar é feito de muito mais do que paisagens. São as histórias
            contadas ao longo das gerações, os edifícios que resistem ao tempo
            e os sabores que aproximam as pessoas.
          </p>
          <div className="stats">
            <div>
              <strong>06</strong>
              <span>Mitos e lendas</span>
            </div>
            <div>
              <strong>06</strong>
              <span>Tradições vivas</span>
            </div>
            <div>
              <strong>06</strong>
              <span>Monumentos</span>
            </div>
            <div>
              <strong>06</strong>
              <span>Sabores típicos</span>
            </div>
          </div>
        </section>

        <section className="section" id="lendas">
          <div className="section-heading">
            <div>
              <span className="eyebrow dark">01 / IMAGINÁRIO POPULAR</span>
              <h2>Mitos <em>e lendas</em></h2>
            </div>
            <p>
              Histórias de milagres, personagens misteriosos e acontecimentos
              extraordinários que fazem parte do folclore português.
            </p>
          </div>

          <div className="filters" id="legendFilters">
            {filterOptions.map((item) => (
              <button
                key={item.value}
                className={activeFilter === item.value ? 'filter active' : 'filter'}
                type="button"
                data-filter={item.value}
                onClick={() => setActiveFilter(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="cards" id="legendsGrid">
            {visibleLegends.map((item, index) => (
              <Card key={`${item.title}-${index}`} item={item} index={index} type="legend" onOpen={(detail, type) => { setSelectedItem(detail); setSelectedType(type); }} />
            ))}
          </div>
        </section>

        <section className="section living-section" id="vivo">
          <div className="section-heading">
            <div>
              <span className="eyebrow dark">02 / CULTURA EM MOVIMENTO</span>
              <h2>Patrimônio <em>cultural vivo</em></h2>
            </div>
            <p>
              O patrimônio também está nas músicas, nos ofícios artesanais,
              nas festas e nos conhecimentos transmitidos entre gerações.
            </p>
          </div>

          <div className="cards" id="livingGrid">
            {livingData.map((item, index) => (
              <Card key={`${item.title}-${index}`} item={item} index={index} type="living" onOpen={(detail, type) => { setSelectedItem(detail); setSelectedType(type); }} />
            ))}
          </div>
        </section>

        <section className="feature">
          <div
            className="feature-image"
            role="img"
            aria-label="Paisagem arquitetônica portuguesa"
            style={featureImage ? { backgroundImage: `url("${image(featureImage, 1200)}")`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
          />
          <div className="feature-content">
            <span className="eyebrow">MEMÓRIA E IDENTIDADE</span>
            <h2>O passado continua <em>presente.</em></h2>
            <p>
              Portugal preserva construções que atravessaram séculos e tradições
              que continuam vivas nas comunidades. Conhecer esse patrimônio
              é conhecer a história de um povo.
            </p>
            <a href="#monumentos" className="button button-light">
              Explorar monumentos ↗
            </a>
          </div>
        </section>

        <section className="section" id="monumentos">
          <div className="section-heading">
            <div>
              <span className="eyebrow dark">03 / PATRIMÔNIO ARQUITETÔNICO</span>
              <h2>Construções que <em>contam histórias</em></h2>
            </div>
            <p>
              Seis monumentos que ajudam a compreender a arquitetura,
              a religião, a política e a história de Portugal.
            </p>
          </div>

          <div className="cards" id="monumentsGrid">
            {monumentsData.map((item, index) => (
              <Card key={`${item.title}-${index}`} item={item} index={index} type="monument" onOpen={(detail, type) => { setSelectedItem(detail); setSelectedType(type); }} />
            ))}
          </div>
        </section>

        <section className="section" id="culinaria">
          <div className="section-heading">
            <div>
              <span className="eyebrow dark">05 / GASTRONOMIA</span>
              <h2>Uma cultura que também <em>se prova.</em></h2>
            </div>
            <p>
              Receitas tradicionais que representam diferentes regiões,
              ingredientes e costumes da mesa portuguesa.
            </p>
          </div>

          <div className="cards" id="foodGrid">
            {foodsData.map((item, index) => (
              <Card key={`${item.title}-${index}`} item={item} index={index} type="food" onOpen={(detail, type) => { setSelectedItem(detail); setSelectedType(type); }} />
            ))}
          </div>
        </section>

        <section className="closing">
          <span className="quote">“</span>
          <h2>
            Conhecer Portugal é descobrir as histórias que vivem
            em seus lugares, tradições e sabores.
          </h2>
          <p>UM PAÍS · MUITAS HISTÓRIAS</p>
        </section>
      </main>

      <footer className="footer">
        <a href="#inicio" className="logo">
          <span className="logo-icon">P</span>
          <span>
            PORTUGAL
            <small>ENTRE LENDAS E PATRIMÔNIOS</small>
          </span>
        </a>
        <p>Projeto Integrador · Cultura e história portuguesa</p>
        <a href="#inicio">Voltar ao topo ↑</a>
      </footer>

      <DetailDialog item={selectedItem} type={selectedType} open={Boolean(selectedItem)} onClose={() => setSelectedItem(null)} />
    </>
  );
}
