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
  const btnVerTodos = document.getElementById('btnVerTodos');
  container.innerHTML = `<div class="text-center p-4">Carregando pets...</div>`;

  try {
    const response = await fetch('https://amigopet.onrender.com/pet/all');
    if (!response.ok) throw new Error(`HTTP ${response.status} - ${response.statusText}`);

    const data = await response.json();
    const pets = data.pet;

    if (!Array.isArray(pets) || pets.length === 0) {
      container.innerHTML = `<div class="text-center p-4">Nenhum pet cadastrado.</div>`;
      if (btnVerTodos) btnVerTodos.style.display = "none";
      return;
    }

    // Ordena por mais recentes
    const petsOrdenados = pets.slice().reverse();

    // Mostrar inicialmente 5
    let mostrandoTodos = false;
    exibirPets(petsOrdenados.slice(0, 5));

    // Mostra botão apenas se tiver mais de 5
    if (petsOrdenados.length > 5) {
      btnVerTodos.style.display = "inline-block";
    } else {
      btnVerTodos.style.display = "none";
    }

    // Evento do botão
    btnVerTodos.onclick = () => {
      mostrandoTodos = !mostrandoTodos;

      if (mostrandoTodos) {
        exibirPets(petsOrdenados);
        btnVerTodos.textContent = "Ver menos";
      } else {
        exibirPets(petsOrdenados.slice(0, 5));
        btnVerTodos.textContent = "Ver todos";
      }
    };

    // Função auxiliar para renderizar os pets
    function exibirPets(lista) {
      container.innerHTML = "";

      const specieMap = { 'G': 'Gato', 'C': 'Cachorro' };
      const sizeMap = { 'P': 'Pequeno', 'M': 'Médio', 'G': 'Grande' };
      const sexMap = { 'M': 'Macho', 'F': 'Fêmea' };

      lista.forEach(pet => {
        const specie = specieMap[pet.specie] || 'Desconhecido';
        const size = sizeMap[pet.size] || 'Desconhecido';
        const sex = sexMap[pet.sex] || 'Desconhecido';
        const avatar = pet.avatar ? pet.avatar.split('\\').pop() : null;
        const imagePath = avatar ? `images/${avatar}` : 'imgs/pet-placeholder.jpg';

        const col = document.createElement('div');
        col.className = 'pet-wrapper';

      col.innerHTML = `
  <div class="pet-card h-100 shadow-sm border-0">
    <img src="${imagePath}" alt="${pet.name}">
    <div class="card-body text-center">
      <h5 class="card-title">${pet.name}</h5>
      <p class="card-text text-muted mb-2">${size} • ${sex} • ${pet.age} ${pet.age === 1 ? 'ano' : 'anos'}</p>
      <p class="small">${pet.description || ''}</p>
    </div>
  </div>
`;
        container.appendChild(col);
      });
    }

  } catch (error) {
    console.error("Erro ao carregar pets:", error);
    container.innerHTML = `<div class="text-center p-4 text-danger">Erro ao carregar pets.</div>`;
    if (btnVerTodos) btnVerTodos.style.display = "none";
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

const loginModal = document.getElementById('loginModal');
const btnAbrirLogin = document.getElementById('abrirLogin');
const fecharLogin = document.getElementById('fecharLogin');

// Seções internas
const loginSection = document.getElementById('loginSection');
const forgotSection = document.getElementById('forgotSection');
const resetSection = document.getElementById('resetSection');

// Botões
const btnLoginModal = document.getElementById('btnLoginModal');
const btnForgotPassword = document.getElementById('btnForgotPassword');
const btnVoltarLogin = document.getElementById('btnVoltarLogin');
const btnVoltarLogin2 = document.getElementById('btnVoltarLogin2');
const btnEnviarReset = document.getElementById('btnEnviarReset');
const btnRedefinir = document.getElementById('btnRedefinir');

// Abrir modal
btnAbrirLogin.addEventListener('click', (e) => {
  e.preventDefault();
  loginModal.classList.add('mostrar');
  showSection('login');
});

// Fechar
fecharLogin.addEventListener('click', () => loginModal.classList.remove('mostrar'));
window.addEventListener('click', (e) => {
  if (e.target === loginModal) loginModal.classList.remove('mostrar');
});

// ===== Alternar telas =====
function showSection(section) {
  loginSection.style.display = 'none';
  forgotSection.style.display = 'none';
  resetSection.style.display = 'none';

  if (section === 'login') loginSection.style.display = 'block';
  if (section === 'forgot') forgotSection.style.display = 'block';
  if (section === 'reset') resetSection.style.display = 'block';
}

btnForgotPassword.addEventListener('click', () => showSection('forgot'));
btnVoltarLogin.addEventListener('click', () => showSection('login'));
btnVoltarLogin2.addEventListener('click', () => showSection('login'));

// ===== LOGIN =====
btnLoginModal.addEventListener('click', async () => {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  if (!email || !password) return alert('Preencha todos os campos!');

  try {
    const response = await fetch('https://amigopet.onrender.com/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
  // Salva token
  localStorage.setItem('token', data.token);

  alert('Login realizado com sucesso!');
  loginModal.classList.remove('mostrar');

  // Pequeno delay para o modal fechar antes do redirecionamento
  setTimeout(() => {
    window.location.href = redirect;
  }, 500);

    } else {
      alert(data.error || 'Erro ao fazer login.');
    }
  } catch (error) {
    console.error(error);
    alert('Não foi possível conectar ao servidor.');
  }
});

// ===== ESQUECI SENHA =====
btnEnviarReset.addEventListener('click', async () => {
  const email = document.getElementById('forgotEmail').value.trim();
  const msg = document.getElementById('messageForgot');

  if (!email) return alert('Digite seu e-mail.');

  try {
    const res = await fetch('https://amigopet.onrender.com/request-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await res.json();

    if (res.ok) {
      msg.innerHTML = `<div style="color:green;">${data.message}</div>`;
    } else {
      msg.innerHTML = `<div style="color:red;">${data.error || 'Erro ao enviar e-mail.'}</div>`;
    }
  } catch {
    msg.innerHTML = `<div style="color:red;">Erro de conexão.</div>`;
  }
});

// ===== REDEFINIÇÃO =====
btnRedefinir.addEventListener('click', async () => {
  const newPassword = document.getElementById('newPassword').value.trim();
  const msg = document.getElementById('messageReset');
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');

  if (!token || !newPassword) return msg.innerHTML = `<div style="color:red;">Token ou senha inválida.</div>`;

  try {
    const res = await fetch('https://amigopet.onrender.com/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword })
    });

    const data = await res.json();

    if (res.ok) {
      msg.innerHTML = `<div style="color:green;">${data.message}</div>`;
      document.getElementById('newPassword').value = '';
    } else {
      msg.innerHTML = `<div style="color:red;">${data.error || 'Erro na redefinição.'}</div>`;
    }
  } catch {
    msg.innerHTML = `<div style="color:red;">Erro ao redefinir a senha.</div>`;
  }
});

// Lida com os botões "Quero Adotar" e "Cadastrar Pet"
document.querySelectorAll('.abrir-login').forEach(botao => {
  botao.addEventListener('click', (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const textoBotao = botao.textContent.trim().toLowerCase();

    if (isTokenValid(token)) {
      // Usuário logado → redireciona conforme o texto do botão
      if (textoBotao.includes('adotar')) {
        window.location.href = 'quer_adotar.html';
      } else if (textoBotao.includes('cadastrar')) {
        window.location.href = 'quer_divulgar.html';
      }
    } else {
      // Usuário não logado → mostra modal
      showSection('login');
      loginModal.classList.add('mostrar');
    }
  });
});
