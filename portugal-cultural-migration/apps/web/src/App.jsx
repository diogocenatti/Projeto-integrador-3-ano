import { useMemo, useRef, useState } from 'react';
import {
  foods,
  image,
  legends,
  living,
  monuments,
  monumentModels,
} from '@portugal/shared';

const filterOptions = [
  { value: 'todos', label: 'Todas' },
  { value: 'tradicao', label: 'Tradição popular' },
  { value: 'fe', label: 'Fé e milagres' },
  { value: 'misterio', label: 'Mistério' },
];

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
    <article className="card" data-category={type === 'legend' ? item.category : undefined}>
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
              if (monumentModels[item.title]) {
                window.open(monumentModels[item.title], '_blank');
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

  const visibleLegends = useMemo(() => {
    if (activeFilter === 'todos') return legends;
    return legends.filter((item) => item.category === activeFilter);
  }, [activeFilter]);

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
          <a href="#mapa" onClick={() => setMenuOpen(false)}>Mapa</a>
          <a href="#culinaria" onClick={() => setMenuOpen(false)}>Culinária</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="inicio">
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
              <Card key={item.title} item={item} index={index} type="legend" onOpen={(detail, type) => { setSelectedItem(detail); setSelectedType(type); }} />
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
            {living.map((item, index) => (
              <Card key={item.title} item={item} index={index} type="living" onOpen={(detail, type) => { setSelectedItem(detail); setSelectedType(type); }} />
            ))}
          </div>
        </section>

        <section className="feature">
          <div className="feature-image" role="img" aria-label="Paisagem arquitetônica portuguesa" />
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
            {monuments.map((item, index) => (
              <Card key={item.title} item={item} index={index} type="monument" onOpen={(detail, type) => { setSelectedItem(detail); setSelectedType(type); }} />
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
            {foods.map((item, index) => (
              <Card key={item.title} item={item} index={index} type="food" onOpen={(detail, type) => { setSelectedItem(detail); setSelectedType(type); }} />
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
