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

async function carregarNoticias() {
  const container = document.getElementById("cards-container");
  container.innerHTML = `<div class="text-center p-4">Carregando notícias...</div>`;

  try {
    const response = await fetch("https://amigopet.onrender.com/noticias/all");
    if (!response.ok) throw new Error("Falha ao buscar notícias");
    const data = await response.json();
    const noticias = data.noticias || data;

    container.innerHTML = ""; // limpa antes de adicionar os cards

    if (!noticias || noticias.length === 0) {
      container.innerHTML = `<div class="text-center p-4">Nenhuma notícia cadastrada.</div>`;
      return;
    }

    noticias.forEach((noticia) => {
      // Coluna responsiva
      const col = document.createElement("div");
      col.className = "col-sm-6 col-md-4 col-lg-3 mb-4 d-flex"; 
      // sm=2 por linha, md=3 por linha, lg=4 por linha, altura alinhada com d-flex

      const card = document.createElement("div");
      card.className = "card shadow-lg w-100";
      card.style.borderRadius = "18px";
      card.style.overflow = "hidden";

      const imagePath = noticia.imagem || "https://amigopet.onrender.com/600x400";

      card.innerHTML = `
        <img src="${imagePath}" class="card-img-top" alt="${noticia.titulo}" 
             style="height: 280px; object-fit: cover;">
        <div class="card-body text-center p-4">
          <h4 class="card-title mb-3">${noticia.titulo}</h4>
          ${noticia.link 
            ? `<a href="${noticia.link}" target="_blank" class="btn btn-primary btn-lg w-100">Leia mais</a>` 
            : ""}
        </div>
      `;

      col.appendChild(card);
      container.appendChild(col);
    });

  } catch (error) {
    console.error("Erro ao carregar notícias:", error);
    container.innerHTML = `<div class="text-center p-4 text-danger">Erro ao carregar notícias.</div>`;
  }
}

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
<div class="card h-100 shadow-sm mx-auto" style="width: 80%; border-radius: 15px; background: linear-gradient(135deg, #90ee90, #fdfd96, #ffb347);">
  <img src="${imagePath}" class="card-img-top" alt="${pet.name}" style="height: 150px; object-fit: contain; background: white; border-top-left-radius: 15px; border-top-right-radius: 15px;">
  
  <div class="card-body d-flex flex-column justify-content-between">
    <h5 class="card-title">${pet.name}</h5>
    <p class="card-text text-muted">
      ${specie} • ${sex} • ${pet.age} anos • ${size}
    </p>
    <p class="card-text">${pet.description || ''}</p>
  </div>
  
  <div class="card-footer text-muted text-center" style="border-bottom-left-radius: 15px; border-bottom-right-radius: 15px;">
    ${pet.city_id}, ${pet.state_id} <br />
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
      
 <img src="${imagePath}" class="card-img-top" alt="${pet.name}" style="height: 150px; object-fit: contain; background: white; border-top-left-radius: 15px; border-top-right-radius: 15px;">
  
<div class="card h-100 shadow-sm mx-auto" style="width: 80%; border-radius: 15px; background: linear-gradient(135deg, #90ee90, #fdfd96, #ffb347);">
 


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
