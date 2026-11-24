"use strict";

// ==========================================
// 1. CONFIGURAÇÃO DAS IMAGENS
// ==========================================

const image = (photo, width = 900) => {
  if (photo.startsWith("img/")) {
    return photo;
  }

  return `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=${width}&q=82`;
};


// ==========================================
// 2. MITOS E LENDAS DE PORTUGAL
// ==========================================

const legends = [
  {
    title: "Lenda do Galo de Barcelos",
    place: "Barcelos, norte de Portugal",
    category: "tradicao",
    photo: "img/galo-de-barcelos.jpg",
    short: "Um galo que canta para provar a inocência de um peregrino.",
    story: `Conta-se que um peregrino galego, a caminho de Santiago de Compostela, foi injustamente acusado de um crime em Barcelos. Condenado à morte, pediu para falar com o juiz e apontou para um galo assado que estava sobre a mesa. Disse que o galo cantaria para provar sua inocência. Quando o peregrino estava prestes a ser enforcado, o galo assado teria cantado. O juiz correu para impedir a execução e salvar o homem.`,
    note: "O galo colorido tornou-se um dos símbolos populares mais conhecidos de Portugal. A narrativa é uma lenda tradicional, não um fato histórico comprovado."
  },
  {
    title: "Milagre das Rosas",
    place: "Tradição ligada à rainha Santa Isabel",
    category: "fe",
    photo: "img/imagesMilagreDasRosas.jpg",
    short: "Uma rainha generosa e o pão que teria se transformado em rosas.",
    story: `Santa Isabel, rainha de Portugal, era conhecida por ajudar os pobres. Segundo a lenda, costumava levar pão escondido no manto para distribuir aos necessitados, apesar da oposição do rei D. Dinis. Quando o rei perguntou o que ela carregava, Isabel respondeu que eram rosas. Ao abrir o manto, o pão teria se transformado em flores.`,
    note: "A história é lembrada como símbolo de solidariedade, generosidade e fé."
  },
  {
    title: "Lenda da Sopa da Pedra",
    place: "Almeirim, Ribatejo",
    category: "tradicao",
    photo: "img/Almeirim.jpg",
    short: "Um frade transforma uma simples pedra numa sopa para todos.",
    story: `Um frade pobre e faminto chegou a uma aldeia e pediu uma panela para fazer uma sopa de pedra. Curiosos, os moradores aceitaram. Ele começou com água e uma pedra, mas depois sugeriu acrescentar sal, azeite, batatas, feijão e chouriço. No fim, todos puderam compartilhar uma sopa saborosa, enquanto o frade guardou a pedra para outra ocasião.`,
    note: "A história está associada a Almeirim e ao prato tradicional conhecido como sopa da pedra. Também transmite uma mensagem sobre colaboração e partilha."
  },
  {
    title: "A história de Teresa Fidalgo",
    place: "Lenda urbana associada a Sintra",
    category: "misterio",
    photo: "img/Fotografia do fantasma de Teresa Fidalgo, ou Teresa Fidalga.jpg",
    short: "Uma jovem de branco aparece numa estrada durante a noite.",
    story: `Na versão popular, jovens que viajam de carro à noite encontram uma mulher vestida de branco. Ela se apresenta como Teresa Fidalgo e aponta para um local onde afirma ter sofrido um acidente fatal. Em seguida, acontece um episódio assustador com os ocupantes do carro. A narrativa se espalhou por vídeos e mensagens na internet.`,
    note: "Teresa Fidalgo ficou conhecida por uma produção audiovisual de ficção. Não há evidências confiáveis de que seja um fantasma real."
  },
  {
    title: "Bentinho da Porta Aberta",
    place: "Terras de Bouro, região do Gerês",
    category: "fe",
    photo: "img/imagesS.Bento.jpg",
    short: "Uma história de esperança associada à devoção religiosa.",
    story: `Segundo a versão popular apresentada neste projeto, Bentinho era um menino pobre que pediu ajuda a Nossa Senhora da Porta Aberta para que sua mãe doente melhorasse. A lenda conta que sua oração foi atendida e que a mãe se recuperou. A história tornou-se uma narrativa de fé e esperança.`,
    note: "Esta narrativa deve ser apresentada como tradição religiosa popular. É recomendável confirmar a versão local com fontes do santuário."
  },
  {
    title: "Obras de Santa Engrácia",
    place: "Lisboa",
    category: "misterio",
    photo: "img/panteao-nacional-lisboa-portuga-1024x683.jpg",
    short: "Uma condenação injusta ligada à expressão sobre obras intermináveis.",
    story: `A lenda conta que Simão Pires foi acusado injustamente de roubo na Igreja de Santa Engrácia. Antes de morrer, teria declarado que a igreja nunca seria terminada. Como as obras se prolongaram durante séculos, surgiu a expressão popular "obras de Santa Engrácia", usada para falar de algo que demora muito para ficar pronto.`,
    note: "A expressão é usada em Portugal para descrever trabalhos demorados. A lenda deve ser distinguida dos fatos documentados sobre a construção da igreja."
  }
];


// ==========================================
// 3. PATRIMÔNIO CULTURAL VIVO
// ==========================================

const living = [
  {
    title: "Fado",
    place: "Lisboa e outras regiões",
    category: "Música tradicional",
    photo: "img/Fado.jpg",
    short: "Canto expressivo acompanhado frequentemente pela guitarra portuguesa.",
    story: `O fado é uma expressão musical portuguesa marcada pela interpretação vocal e pelo acompanhamento instrumental. Suas letras podem abordar saudade, amor, quotidiano e experiências humanas. É uma tradição musical que continua presente em casas de fado e apresentações.`,
    note: "O Fado foi inscrito pela UNESCO na Lista Representativa do Patrimônio Cultural Imaterial da Humanidade em 2011."
  },
  {
    title: "Cante alentejano",
    place: "Alentejo",
    category: "Canto coletivo",
    photo: "img/imagesCante.jpg",
    short: "Canto em grupo, tradicionalmente realizado sem instrumentos.",
    story: `O cante alentejano é uma forma de canto coletivo praticada por grupos de cantadores. As vozes se organizam em diferentes linhas melódicas, formando uma sonoridade característica ligada à vida comunitária e à identidade do Alentejo.`,
    note: "O Cante Alentejano foi reconhecido pela UNESCO como Patrimônio Cultural Imaterial em 2014."
  },
  {
    title: "Olaria negra de Bisalhães",
    place: "Bisalhães, Vila Real",
    category: "Artesanato",
    photo: "img/imagesOlaria.jpg",
    short: "Técnica artesanal de cerâmica que produz peças de tonalidade escura.",
    story: `A olaria negra de Bisalhães é um ofício tradicional que envolve moldagem, decoração e cozedura de peças de barro. O processo artesanal confere à cerâmica a sua característica cor negra, e os conhecimentos são transmitidos entre gerações.`,
    note: "A técnica foi inscrita pela UNESCO em 2016 na lista de patrimônio imaterial que necessita de salvaguarda urgente."
  },
  {
    title: "Figurado de Estremoz",
    place: "Estremoz, Alentejo",
    category: "Arte popular",
    photo: "img/imagesEstremoz.jpg",
    short: "Pequenas figuras de barro modeladas e pintadas artesanalmente.",
    story: `O figurado de Estremoz reúne técnicas tradicionais para criar figuras de barro coloridas. As peças representam temas religiosos, profissões, festas e cenas da vida quotidiana, preservando conhecimentos transmitidos entre artesãos.`,
    note: "O figurado em barro de Estremoz foi inscrito pela UNESCO como Patrimônio Cultural Imaterial em 2017."
  },
  {
    title: "Arte chocalheira",
    place: "Regiões rurais de Portugal",
    category: "Ofício tradicional",
    photo: "img/imagesArte.jpg",
    short: "Fabricação artesanal de chocalhos usados na pastorícia.",
    story: `A arte chocalheira envolve conhecimentos especializados para fabricar chocalhos metálicos usados tradicionalmente para identificar e localizar animais nos rebanhos. O ofício reúne técnicas artesanais e faz parte da cultura rural portuguesa.`,
    note: "A manufatura de chocalhos foi inscrita pela UNESCO em 2015 na lista de patrimônio imaterial que necessita de salvaguarda urgente."
  },
  {
    title: "Dieta mediterrânica",
    place: "Portugal e região mediterrânica",
    category: "Prática cultural",
    photo: "img/DietaMediterranea.jpg",
    short: "Práticas alimentares, receitas e costumes de partilha das refeições.",
    story: `A dieta mediterrânica não se limita aos alimentos: envolve a preparação e partilha das refeições, o uso de ingredientes sazonais e a transmissão de conhecimentos culinários. Em Portugal, relaciona-se com tradições de consumo de vegetais, leguminosas, cereais, azeite e peixe.`,
    note: "A dieta mediterrânica é reconhecida pela UNESCO como patrimônio cultural imaterial multinacional, do qual Portugal faz parte."
  }
];


// ==========================================
// 4. MONUMENTOS HISTÓRICOS
// ==========================================

const monuments = [
  {
    title: "Mosteiro dos Jerónimos",
    place: "Belém, Lisboa",
    date: "Construção iniciada em 1502",
    category: "Arquitetura manuelina",
    photo: "img/lisboa-mosteiro-dos-jeronimos.jpg",
    short: "Um grande símbolo da época das navegações portuguesas.",
    story: `Mandado construir durante o reinado de D. Manuel I, o Mosteiro dos Jerónimos é um dos grandes exemplos do estilo manuelino. Sua ornamentação apresenta elementos inspirados na natureza e no universo marítimo. O edifício está ligado ao período das navegações portuguesas.`,
    note: "O Mosteiro dos Jerónimos integra a lista do Patrimônio Mundial da UNESCO desde 1983."
  },
  {
    title: "Torre de Belém",
    place: "Belém, Lisboa",
    date: "Construída entre 1514 e 1519",
    category: "Fortificação manuelina",
    photo: "img/torre-de-belem.jpg",
    short: "Uma fortificação histórica que protegia a entrada do porto de Lisboa.",
    story: `Construída junto ao rio Tejo, a Torre de Belém fazia parte do sistema defensivo de Lisboa. Com o tempo, tornou-se um símbolo das navegações portuguesas. Sua arquitetura combina funções militares com uma decoração detalhada do estilo manuelino.`,
    note: "A Torre de Belém integra o Patrimônio Mundial da UNESCO desde 1983, juntamente com o Mosteiro dos Jerónimos."
  },
  {
    title: "Mosteiro da Batalha",
    place: "Batalha, região Centro",
    date: "Construção iniciada em 1386",
    category: "Gótico e manuelino",
    photo: "img/mosteiroB.jpg",
    short: "Monumento ligado à vitória portuguesa na Batalha de Aljubarrota.",
    story: `D. João I mandou erguer o Mosteiro de Santa Maria da Vitória para celebrar a vitória portuguesa na Batalha de Aljubarrota, em 1385. O conjunto é uma referência do gótico português e inclui elementos manuelinos, além das célebres Capelas Imperfeitas.`,
    note: "O Mosteiro da Batalha foi inscrito na lista do Patrimônio Mundial da UNESCO em 1983."
  },
  {
    title: "Convento de Cristo",
    place: "Tomar",
    date: "Fundação em 1160",
    category: "Templários e Ordem de Cristo",
    photo: "img/top_convento_de_cristo_de_tomar_5b05f68f39dcf.jpg",
    short: "Um conjunto monumental ligado aos Templários e à Ordem de Cristo.",
    story: `O conjunto monumental de Tomar nasceu ligado à Ordem dos Templários e foi ampliado ao longo de vários séculos. Reúne diferentes estilos arquitetônicos, incluindo elementos românicos, góticos, manuelinos e renascentistas. A famosa janela manuelina é um dos seus elementos mais conhecidos.`,
    note: "O Convento de Cristo integra a lista do Patrimônio Mundial da UNESCO desde 1983."
  },
  {
    title: "Palácio Nacional da Pena",
    place: "Sintra",
    date: "Transformado no século XIX",
    category: "Arquitetura romântica",
    photo: "img/Sintra_-_Palacio_da_Pena_(20332995770).jpg",
    short: "Um palácio colorido que combina diferentes estilos arquitetônicos.",
    story: `D. Fernando II transformou as estruturas de um antigo mosteiro num palácio durante o século XIX. Suas torres, cores e misturas de estilos fazem dele um dos monumentos mais reconhecíveis de Portugal. O palácio está inserido numa paisagem cultural de grande importância.`,
    note: "O Palácio da Pena faz parte da Paisagem Cultural de Sintra, inscrita pela UNESCO em 1995."
  },
  {
    title: "Santuário do Bom Jesus do Monte",
    place: "Braga, norte de Portugal",
    date: "Desenvolvimento desde o século XVI",
    category: "Barroco, rococó e neoclássico",
    photo: "img/santuarioBomJesus.jpg",
    short: "Santuário famoso pela escadaria monumental e pelo conjunto paisagístico.",
    story: `O Santuário do Bom Jesus do Monte desenvolveu-se ao longo de vários séculos. É conhecido pela escadaria monumental que conduz à basílica e representa uma subida simbólica de caráter espiritual. O conjunto inclui capelas, fontes, jardins e diferentes estilos arquitetônicos.`,
    note: "O Santuário do Bom Jesus do Monte foi inscrito na lista do Patrimônio Mundial da UNESCO em 2019."
  }
];

// ==========================================
// MODELOS 3D DOS SEIS MONUMENTOS
// ==========================================

const monumentModels = {
  "Mosteiro dos Jerónimos":
    "./mosteiro/index.html",
 
  "Torre de Belém":
    "./torre de belem/index.html",
 
  "Mosteiro da Batalha":
    "./mosteiro da batalha/index.html",
 
  "Convento de Cristo":
    "./convento de cristo/index.html",
 
  "Palácio Nacional da Pena":
    "./palacio da pena/index.html",
 
  "Santuário do Bom Jesus do Monte":
    "./santuario jesus/index.html"
};
// ==========================================
// 5. CULINÁRIA PORTUGUESA
// ==========================================

const foods = [
  {
    title: "Bolinhos de bacalhau",
    place: "Tradição nacional",
    category: "Salgado",
    photo: "img/imagesBolinho.jpg",
    short: "Bolinhos dourados, crocantes por fora e macios por dentro.",
    story: `Preparados com bacalhau desfiado, batata, ovos e temperos, os bolinhos de bacalhau são um petisco muito conhecido da culinária portuguesa. Podem ser servidos como entrada, lanche ou acompanhamento.`,
    note: "O bacalhau tem um lugar importante na gastronomia portuguesa e aparece em muitas receitas regionais."
  },
  {
    title: "Travesseiros de Sintra",
    place: "Sintra",
    category: "Doce regional",
    photo: "img/imagesSintra.jpg",
    short: "Massa folhada com recheio doce à base de amêndoa e ovos.",
    story: `Os travesseiros são uma especialidade famosa de Sintra. O doce é preparado com massa folhada e um recheio característico à base de amêndoa, ovos e açúcar, normalmente servido polvilhado com açúcar.`,
    note: "É um dos doces mais associados à tradição de pastelaria da vila de Sintra."
  },
  {
    title: "Pastéis de nata",
    place: "Lisboa e todo o país",
    category: "Doce",
    photo: "img/Pasteis de Nata.jpg",
    short: "Pequenas tortas de massa folhada recheadas com creme de ovos.",
    story: `Os pastéis de nata são um dos doces portugueses mais conhecidos internacionalmente. Têm uma base de massa folhada e um recheio cremoso à base de leite e ovos, assado até a superfície ficar dourada.`,
    note: "São encontrados em pastelarias por todo o país e costumam ser servidos mornos."
  },
  {
    title: "Caldo verde",
    place: "Norte de Portugal",
    category: "Sopa tradicional",
    photo: "img/bk-6324-blog-caldo-verde-2-1.jpg",
    short: "Sopa de batata com couve cortada em tiras finas e azeite.",
    story: `O caldo verde é uma sopa tradicional preparada principalmente com batata e couve-galega cortada em tiras muito finas. Muitas versões incluem rodelas de chouriço e um fio de azeite.`,
    note: "É uma sopa muito associada às festas e às reuniões familiares portuguesas."
  },
  {
    title: "Francesinha",
    place: "Porto",
    category: "Prato típico",
    photo: "img/francesinha_a_moda_do_porto_2083_600.jpg",
    short: "Sanduíche com carnes, queijo derretido e molho quente característico.",
    story: `Associada à cidade do Porto, a francesinha é preparada com pão e diferentes carnes, coberta com queijo derretido e servida com um molho quente cuja receita varia entre estabelecimentos. É frequentemente acompanhada por batatas fritas.`,
    note: "É um dos pratos mais conhecidos da gastronomia do Porto."
  },
  {
    title: "Arroz-doce",
    place: "Tradição nacional",
    category: "Sobremesa",
    photo: "img/imagesArrozDoce.jpg",
    short: "Sobremesa cremosa de arroz, leite, açúcar e canela.",
    story: `O arroz-doce é uma sobremesa presente em muitas casas e celebrações portuguesas. É preparado lentamente com arroz, leite e açúcar, e costuma ser decorado com canela em pó.`,
    note: "As receitas variam de família para família e podem incluir casca de limão ou canela durante o preparo."
  }
];


// ==========================================
// 6. CRIAÇÃO DOS CARTÕES
// ==========================================

function createCard(item, index, type) {
  const card = document.createElement("article");
  card.className = "card";

  if (type === "legend") {
    card.dataset.category = item.category;
  }

  const imageAlt = `${item.title} — ${item.place}`;

  const meta = type === "monument"
    ? item.date
    : type === "legend"
      ? item.place
      : item.category;

  const buttonText = type === "legend"
    ? "Ler a história"
    : type === "monument"
      ? "Conhecer monumento"
      : type === "living"
        ? "Conhecer tradição"
        : "Conhecer o prato";

const modelTag = type === "monument"
  ? `<button class="model-tag" type="button">
       ◇ Visualizar modelo 3D
     </button>`
  : "";
 
 

  card.innerHTML = `
    <div class="card-image">
      <img
        src="${image(item.photo)}"
        alt="${imageAlt}"
        loading="lazy"
        onerror="this.style.display='none'"
      >

      <span class="card-number">
        ${String(index + 1).padStart(2, "0")} / 06
      </span>
    </div>

    <div class="card-body">
      <div class="card-meta">${meta}</div>

      <h3>${item.title}</h3>

      <p>${item.short}</p>

      ${modelTag}

     <button class="card-action" type="button">
  ${buttonText} ↗
</button>
 

 
    </div>
  `;

  card.querySelector(".card-action").addEventListener("click", () => {
    openDetails(item, type);
  });
  const modelButton = card.querySelector(".model-tag");
 
if (modelButton && type === "monument") {
  modelButton.addEventListener("click", () => {
    const modelPath = monumentModels[item.title];
 
    if (modelPath) {
      window.open(modelPath, "_blank");
    }
  });
}
  return card;
}


// ==========================================
// 7. JANELA COM A HISTÓRIA COMPLETA
// ==========================================

const detailsDialog = document.getElementById("detailsDialog");
const dialogContent = document.getElementById("dialogContent");
const closeDialogButton = document.getElementById("closeDialog");

function openDetails(item, type) {
  if (!detailsDialog || !dialogContent) {
    console.error("A janela de detalhes não foi encontrada.");
    return;
  }

  let category = "Culinária portuguesa";
  let extra = "";

  if (type === "legend") {
    category = "Mitos e lendas";

    extra = `
      <div class="dialog-note">
        <strong>Local associado:</strong> ${item.place}
        <br><br>
        ${item.note}
      </div>
    `;
  } else if (type === "living") {
    category = "Patrimônio cultural vivo";

    extra = `
      <p><strong>Local / região:</strong> ${item.place}</p>
      <p><strong>Categoria:</strong> ${item.category}</p>

      <div class="dialog-note">
        ${item.note}
      </div>
    `;
  } else if (type === "monument") {
    category = "Patrimônio histórico";

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

      <div class="dialog-note">
        ${item.note}
      </div>
    `;
  }

  dialogContent.innerHTML = `
    <img
      class="dialog-image"
      src="${image(item.photo, 1200)}"
      alt="${item.title}"
      onerror="this.style.display='none'"
    >

    <div class="dialog-body">
      <span class="eyebrow dark">${category}</span>

      <h2 id="dialogTitle">${item.title}</h2>

      <p>${item.story}</p>

      ${extra}
    </div>
  `;
 
if (!detailsDialog.open) {
  detailsDialog.showModal();
}
}


// ==========================================
// 8. EXIBIR OS CARTÕES NAS SEÇÕES
// ==========================================

const legendsGrid = document.getElementById("legendsGrid");
const livingGrid = document.getElementById("livingGrid");
const monumentsGrid = document.getElementById("monumentsGrid");
const foodGrid = document.getElementById("foodGrid");

if (legendsGrid) {
  legends.forEach((item, index) => {
    legendsGrid.appendChild(createCard(item, index, "legend"));
  });
}

if (livingGrid) {
  living.forEach((item, index) => {
    livingGrid.appendChild(createCard(item, index, "living"));
  });
}

if (monumentsGrid) {
  monuments.forEach((item, index) => {
    monumentsGrid.appendChild(createCard(item, index, "monument"));
  });
}

if (foodGrid) {
  foods.forEach((item, index) => {
    foodGrid.appendChild(createCard(item, index, "food"));
  });
}


// ==========================================
// 9. LISTA DE LOCALIZAÇÕES NO MAPA
// ==========================================

const placesList = document.getElementById("placesList");

if (placesList) {
  monuments.forEach((item, index) => {
    const place = document.createElement("div");
    place.className = "place";

    place.innerHTML = `
      <span class="place-number">${index + 1}</span>

      <span>
        <strong>${item.title}</strong>
        <small>${item.place}</small>
      </span>
    `;

    placesList.appendChild(place);
  });
}


// ==========================================
// 10. FILTROS DAS LENDAS
// ==========================================

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(filter => {
      filter.classList.remove("active");
    });

    button.classList.add("active");

    const selected = button.dataset.filter;

    document.querySelectorAll("#legendsGrid .card").forEach(card => {
      card.hidden =
        selected !== "todos" &&
        card.dataset.category !== selected;
    });
  });
});


// ==========================================
// 11. MENU PARA CELULAR
// ==========================================

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");

    menuToggle.textContent = isOpen ? "×" : "☰";
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Fechar menu" : "Abrir menu"
    );
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.textContent = "☰";
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menu");
    });
  });
}


// ==========================================
// 12. FECHAR A JANELA DE DETALHES
// ==========================================

if (detailsDialog && closeDialogButton) {

  // Fecha ao clicar no botão X
  closeDialogButton.addEventListener("click", event => {
    event.preventDefault();
    detailsDialog.close();
  });

  // Fecha ao clicar no fundo da janela
  detailsDialog.addEventListener("click", event => {
    if (event.target === detailsDialog) {
      detailsDialog.close();
    }
  });

  // Permite fechar usando a tecla Escape
  detailsDialog.addEventListener("cancel", () => {
    detailsDialog.close();
  });

} else {
  console.error(
    "Popup ou botão de fechar não encontrado. Confira os IDs no HTML."
  );
}