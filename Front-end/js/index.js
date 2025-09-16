document.addEventListener('DOMContentLoaded', () => {
  carregarPets();
  configurarMenuAdotar();
  configurarMenuCadastrarPet();
  carregarNoticias();
  carregarPetsAdotados();
});

// Função para validar o token
function isTokenValid(token) {
  if (!token) return false;
  try {
    const decoded = jwt_decode(token);
    const now = Date.now() / 1000;
    return decoded.exp > now;
  } catch {
    return false;
  }
}




// ==========================
// 2. Menu "Quero Adotar"
// ==========================
function configurarMenuAdotar() {
  const botao = document.querySelector('#menu-quer-adotar');
  if (botao) {
    botao.addEventListener('click', (e) => {
      e.preventDefault();
      const token = localStorage.getItem('token');
      if (isTokenValid(token)) {
        window.location.href = 'quer_adotar.html';
      } else {
        alert("Seu token expirou, faça login novamente.");
        window.location.href = 'login.html';
      }
    });
  }
}

// ==========================
// 3. Menu "Cadastrar Pet"
// ==========================
function configurarMenuCadastrarPet() {
  const botao = document.querySelector('#menu-cadastrar-pet');
  if (botao) {
    botao.addEventListener('click', (e) => {
      e.preventDefault();
      const token = localStorage.getItem('token');
      if (isTokenValid(token)) {
        window.location.href = 'quer_divulgar.html';
      } else {
        alert("Sessão expirada. Faça login novamente.");
        window.location.href = 'login.html';
      }
    });
  }
}

// ==========================
// 4. Carrossel de Notícias
// ==========================
function carregarNoticias() {
  const noticias = [
    {
      titulo: "Projeto na Alece prevê microchips para identificar cães e gatos e mutirões de castração",
      descricao: "Inicialmente, programa será voltado para animais em situação de rua ou sob tutela de pessoas em vulnerabilidade social.",
      imagem: "images/cadastro.jpg",
      link: "https://diariodonordeste.verdesmares.com.br/pontopoder/projeto-na-alece-preve-microchips-para-identificar-caes-e-gatos-e-mutiroes-de-castracao-1.3646111/"
    },
    {
      titulo: "Secretaria de Saúde de Jaguaruana promove Dia D Antirrábica dos Pets",
      descricao: "Vacinação em diversos pontos por toda a cidade. Veja como foi este dia.",
      imagem: "images/buceta-marrom-apos-cirurgia-injecao-para-um-animal-veterinario-de-luvas-com-uma-injecao (1).jpg",
      link: "https://www.jaguaruana.ce.gov.br/informa/3293/secretaria-de-sa-de-da-prefeitura-de-jaguaruana-pr"
    },
    {
      titulo: "Pet Móvel Ceará",
      descricao: "Pet Móvel Ceará realizou 1.000 castrações em poucos dias de funcionamento!",
      imagem: "images/Pet-Ceara-Movel-696x464.jpeg",
      link: "https://oestadoce.com.br/ceara/pet-movel-ceara-realizou-1-000-castracoes-em-poucos-dias-de-funcionamento/"
    },
    {
      titulo: "Sana 2025",
      descricao: "59 cães e gatos adotados no Maior Evento de Adoção do Ceará!",
      imagem: "images/pet-696x435.png",
      link: "https://www.ceara.gov.br/2025/02/25/22-animais-foram-adotados-na-i-feira-de-adocao-de-animais-da-arena-castelao/"
    }
  ];

  const carouselInner = document.getElementById('carousel-news');

  noticias.forEach((noticia, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'carousel-item' + (index === 0 ? ' active' : '');

    itemDiv.innerHTML = `
      <img src="${noticia.imagem}" class="d-block w-100" alt="${noticia.titulo}" style="max-height: 1600px; object-fit: cover;" />
      <div class="card-img-overlay d-flex flex-column justify-content-end">
  <h5 class="card-title">${noticia.titulo}</h5>
  <p class="card-text">${noticia.descricao}</p>
  <a href="${noticia.link}" target="_blank" class="btn btn-primary mt-2">Saiba mais</a>
</div>
    `;

    carouselInner.appendChild(itemDiv);
  });
}


//noticias
async function carregarNoticias() {
  try {
    const response = await fetch("https://amigopet.onrender.com/noticias/all");
    if (!response.ok) throw new Error("Falha ao buscar notícias");

    const data = await response.json();
    const noticias = data.noticias; // ✅ acessar a propriedade 'noticias'
    
    const carousel = document.getElementById("carousel-news");
    carousel.innerHTML = ""; // limpa antes de renderizar

    if (!noticias || noticias.length === 0) {
      carousel.innerHTML = `<div class="text-center p-4">Nenhuma notícia cadastrada.</div>`;
      return;
    }

    noticias.forEach((noticia, index) => {
      const ativo = index === 0 ? "active" : "";
      carousel.innerHTML += `
        <div class="carousel-item ${ativo}">
          <img src="${noticia.imagem || "https://amigopet.onrender.com/600x400"}" 
               class="d-block w-100" 
               alt="${noticia.titulo}">
          <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-2">
            <h5>${noticia.titulo}</h5>
            <p>${noticia.descricao || ""}</p>
            ${noticia.link ? `<a href="${noticia.link}" target="_blank" class="btn btn-light btn-sm">Leia mais</a>` : ""}
          </div>
        </div>
      `;
    });
  } catch (error) {
    console.error("Erro ao carregar notícias:", error);
  }
}

// Chamar logo ao carregar a página
window.addEventListener("DOMContentLoaded", carregarNoticias);


// ==========================
// 1. Carregar pets disponíveis
// ==========================
async function carregarPets() {
  const container = document.getElementById('pets-container');

  try {
    const response = await fetch('https://amigopet.onrender.com/pet/all');
    if (!response.ok) throw new Error(`HTTP ${response.status} - ${response.statusText}`);

    const data = await response.json();
    const pets = data.pet;

    if (!Array.isArray(pets)) throw new Error("A chave 'pet' não contém um array");

    const lastPets = pets.slice(-20);
    container.innerHTML = '';

    const specieMap = { 'G': 'Gato', 'C': 'Cachorro' };
    const sizeMap = { 'P': 'Pequeno', 'M': 'Médio', 'G': 'Grande' };
    const sexMap = { 'M': 'Macho', 'F': 'Fêmea' };

    lastPets.forEach(pet => {
  const specie = specieMap[pet.specie] || 'Desconhecido';
  const size = sizeMap[pet.size] || 'Desconhecido';
  const sex = sexMap[pet.sex] || 'Desconhecido';
  const avatar = pet.avatar ? pet.avatar.split('\\').pop() : null;
  const imagePath = avatar ? `images/${avatar}` : 'imgs/pet-placeholder.jpg';
  const isAdotado = pet.adotado === true;

  const card = document.createElement('div');
  card.className = 'col-md-4 col-lg-3 mb-4 d-flex align-items-stretch';

  const cardInner = document.createElement('div');
  cardInner.className = 'card pet-card w-100';

cardInner.innerHTML = `
  <div class="card h-100 shadow-sm w-100">
    <img src="${imagePath}" class="card-img-top" alt="${pet.name}" style="height: 150px; object-fit: contain; background-color: #fefefe;">
    <div class="card-body d-flex flex-column justify-content-between">
      <h5 class="card-title">${pet.name}</h5>
      <p class="card-text text-muted">
        ${specie} • ${sex} • ${pet.age} anos • ${size}
      </p>
      <p class="card-text">${pet.description || ''}</p>
    </div>
    <div class="card-footer text-muted text-center">
      ${pet.city_id}, ${pet.state_id}
      <br />
      <button class="btn ${isAdotado ? 'btn-danger' : 'btn-success'} add-to-cart rounded-pill px-3"
        ${isAdotado ? 'disabled' : ''}
        data-id="${pet.id}"
        data-name="${pet.name}"
        data-image="${imagePath}"
        data-specie="${pet.specie}"
        data-sex="${pet.sex}"
        data-age="${pet.age}"
        data-size="${pet.size}"
         onclick="window.location.href='login.html'">
        ${isAdotado ? 'Adotado' : 'Adotar'}
      </button>
    </div>
  </div>
`;
  card.appendChild(cardInner);
  container.appendChild(card);
    });

  } catch (error) {
    console.error('Erro ao carregar pets:', error);
    container.innerHTML = '<p class="text-danger">Erro ao carregar os pets. Tente novamente mais tarde.</p>';
  }
}
  updateCartCount(); // Atualiza contagem do carrinho ao carregar a página

 document.getElementById("searchForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const specieMap = { Gato: 'G', Cachorro: 'C' };
  const sexMap = { Macho: 'M', Fêmea: 'F' };
  const sizeMap = { Pequeno: 'P', Médio: 'M', Grande: 'G' };

  const rawData = {
    name: document.getElementById("pet_name").value.trim(),
    specie: specieMap[document.getElementById("pet_specie").value] || '',
    sex: sexMap[document.getElementById("pet_sex").value] || '',
    age: document.getElementById("pet_age").value,
    size: sizeMap[document.getElementById("pet_size").value] || ''
  };

 const petData = {};
Object.keys(rawData).forEach(key => {
  if (rawData[key]) petData[key] = rawData[key];
});

// Adiciona filtro fixo para pets NÃO adotados
petData.adotado = false;
  try {
    const response = await fetch("https://amigopet.onrender.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(petData)
    });

    if (!response.ok) throw new Error("Erro ao buscar pets");

    const result = await response.json();
    displayResults(result.pet);
  } catch (error) {
    console.error("Erro na requisição:", error);
    document.getElementById("petResults").innerHTML =
      "<div class='col-12 text-center text-danger'>Erro ao buscar pets.</div>";
  }
});

// ===== UTILITÁRIOS DO CARRINHO POR USUÁRIO =====


function getCartKey() {
  const token = localStorage.getItem('token');
  const userId = getUserIdFromToken(token);
  return userId ? `cart_${userId}` : 'cart_guest';
}


function getUserIdFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.user_id || payload.id || payload.sub || null;
  } catch (e) {
    console.error("Erro ao decodificar token:", e);
    return null;
  }
}



function getCart() {
  return JSON.parse(localStorage.getItem(getCartKey())) || [];
}

function setCart(cart) {
  localStorage.setItem(getCartKey(), JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const el = document.getElementById("cartCount");
  if (el) el.textContent = cart.length;
}


// ===== EXIBIÇÃO DOS PETS NA BUSCA =====

function displayResults(pets) {
  const container = document.getElementById("petResults");
  container.innerHTML = "";

  if (!pets || pets.length === 0) {
    container.innerHTML = "<div class='col-12 text-center text-muted'>Nenhum pet encontrado.</div>";
    return;
  }

  const specieMap = { G: 'Gato', C: 'Cachorro' };
  const sexMap = { M: 'Macho', F: 'Fêmea' };
  const sizeMap = { P: 'Pequeno', M: 'Médio', G: 'Grande' };

  pets.forEach(pet => {
    const col = document.createElement("div");
    col.className = "col-custom-5 d-flex align-items-stretch";

    const card = document.createElement("div");
    card.className = "card pet-card";

    const avatarFilename = pet.avatar ? pet.avatar.split('\\').pop() : null;
    const imagePath = avatarFilename ? `images/${avatarFilename}` : 'imgs/pet-placeholder.jpg';

    card.innerHTML = `
      <img src="${imagePath}" class="card-img-top" alt="${pet.name}" style="height: 150px; width: 100%; object-fit: contain;">
      <div class="card-body d-flex flex-column justify-content-between">
        <h5 class="card-title">${pet.name}</h5>
        <p class="card-text">
          Espécie: ${specieMap[pet.specie] || pet.specie}<br>
          Sexo: ${sexMap[pet.sex] || pet.sex}<br>
          Idade: ${pet.age} anos<br>
          Porte: ${sizeMap[pet.size] || pet.size}
        </p>
        <div class="mt-auto text-center">
          <button class="btn btn-success add-to-cart"
            data-id="${pet.id}"
            data-name="${pet.name}"
            data-image="${imagePath}"
            data-specie="${pet.specie}"
            data-sex="${pet.sex}"
            data-age="${pet.age}"
            data-size="${pet.size}"
            onclick="window.location.href='login.html'">
           Adotar
          </button>
        </div>
      </div>
    `;

    col.appendChild(card);
    container.appendChild(col);
  });
}

// ===== PÁGINA DE DETALHE DO PET =====

document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("pet-detalhes");
  const petData = localStorage.getItem("petSelecionado");

  if (!petData) {
    container.innerHTML = "<p class='text-danger'>Nenhum pet selecionado.</p>";
    return;
  }

  const pet = JSON.parse(petData);

  const specieMap = { G: "Gato", C: "Cachorro" };
  const sexMap = { M: "Macho", F: "Fêmea" };
  const sizeMap = { P: "Pequeno", M: "Médio", G: "Grande" };

  const imagePath = pet.avatar
    ? `images/${pet.avatar.split("\\").pop()}`
    : "imgs/pet-placeholder.jpg";

  container.innerHTML = `
    <div class="row justify-content-center">
      <div class="col-md-4">
        <div class="card h-100 shadow-sm rounded">
          <img src="${imagePath}" class="card-img-top" alt="${pet.name}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${pet.name}</h5>
            <p class="card-text">
              ${specieMap[pet.specie]} • ${sexMap[pet.sex]} • ${pet.age} anos • ${sizeMap[pet.size]}
            </p>
            <p class="text-muted">${pet.description || ""}</p>
            <button class="btn btn-success mt-auto add-to-cart"
              data-id="${pet.id}"
              data-name="${pet.name}"
              data-image="${imagePath}"
              data-specie="${pet.specie}"
              data-sex="${pet.sex}"
              data-age="${pet.age}"
              data-size="${pet.size}">
              Adotar
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
});

//menu tempo do token

function isTokenValid(token) {
  if (!token) return false;
  try {
    const decoded = jwt_decode(token); // já disponível globalmente
    const now = Date.now() / 1000; // tempo atual em segundos
    return decoded.exp > now;
  } catch {
    return false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const botaoAdotar = document.querySelector('#menu-quer-adotar');

  if (botaoAdotar) {
    botaoAdotar.addEventListener('click', (e) => {
      e.preventDefault();

      const token = window.localStorage.getItem('token');
      if (isTokenValid(token)) {
        window.location.href = 'quer_adotar.html';
      } else {
        alert("Seu token expirou, faça login novamente.");
        window.location.href = 'login.html';
      }
    });
  }
});


function isTokenValid(token) {
  if (!token) return false;
  try {
    const decoded = jwt_decode(token);
    const now = Date.now() / 1000;
    return decoded.exp > now;
  } catch {
    return false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const botaoCadastrarPet = document.querySelector('#menu-cadastrar-pet');

  if (botaoCadastrarPet) {
    botaoCadastrarPet.addEventListener('click', (e) => {
      e.preventDefault();

      const token = window.localStorage.getItem('token');

      if (isTokenValid(token)) {
        window.location.href = 'quer_divulgar.html';
      } else {
        alert("Sessão expirada. Faça login novamente.");
        window.location.href = 'login.html';
      }
    });
  }
});


 document.addEventListener("DOMContentLoaded", () => {
  console.log("Script carregado");

  const btnLogout = document.getElementById("btnLogout");
  if (!btnLogout) {
    console.warn("Botão #btnLogout não encontrado");
    return;
  }

  btnLogout.addEventListener("click", () => {
    console.log("Botão logout clicado");

    // Limpa dados
    const cartKey = "cart"; // opcional se usa carrinho
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("pet");
    localStorage.removeItem(cartKey);

    // Redireciona
   window.location.href = "login.html";
  });
});

 // Função de busca de pets
    document.getElementById('searchForm').addEventListener('submit', async function (e) {
      e.preventDefault();

      const petName = document.getElementById('pet_name').value;
      const petSpecie = document.getElementById('pet_specie').value;
      const petSex = document.getElementById('pet_sex').value;
      const petAge = document.getElementById('pet_age').value;
      const petSize = document.getElementById('pet_size').value;

      // Aqui você pode enviar a requisição para o servidor
      // Exemplo de resposta fictícia para teste
      const response = {
        pets: [
          {
            id: 1,
            name: 'Rex',
            specie: 'Cachorro',
            sex: 'Macho',
            age: 3,
            size: 'Médio',
            image: 'https://placeimg.com/300/200/animals',
          },
          {
            id: 2,
            name: 'Mia',
            specie: 'Gato',
            sex: 'Fêmea',
            age: 2,
            size: 'Pequeno',
            image: 'https://placeimg.com/300/200/animals',
          },
        ],
      };

    
    });
