let allPets = [];

/* ============================================================
   🔑 Funções de Carrinho (com token por usuário)
============================================================ */
function getCartKey() {
  const token = localStorage.getItem('token');
  if (!token) return 'cart_guest';

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.user_id || payload.id || payload.sub || null;
    return userId ? `cart_${userId}` : 'cart_guest';
  } catch (e) {
    console.error('Erro ao decodificar token:', e);
    return 'cart_guest';
  }
}
function getCart() {
  return JSON.parse(localStorage.getItem(getCartKey())) || [];
}

function setCart(cart) {
  localStorage.setItem(getCartKey(), JSON.stringify(cart));
}

/* ============================================================
   🐾 Buscar Pets da API
============================================================ */
async function fetchAllPets() {
  try {
    const response = await fetch("https://amigopet.onrender.com/pet/all");
    const data = await response.json();

    if (!Array.isArray(data.pet)) throw new Error("Resposta da API não é um array.");
    allPets = data.pet;
  } catch (error) {
    console.error("Erro ao buscar todos os pets:", error);
  }
}

/* ============================================================
   🛒 Exibição e Manipulação do Carrinho
============================================================ */
function displayCartItems() {
  const cart = getCart();
  const container = document.getElementById("cartItems");
  if (!container) return;

  container.innerHTML = '';

  if (cart.length === 0) {
    container.innerHTML = "<div class='col-12 text-center text-muted'>Seu carrinho está vazio.</div>";
    return;
  }

  const specieMap = { G: 'Gato', C: 'Cachorro' };
  const sexMap = { M: 'Macho', F: 'Fêmea' };
  const sizeMap = { P: 'Pequeno', M: 'Médio', G: 'Grande' };

  cart.forEach(pet => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-3";

    const card = document.createElement("div");
    card.className = "card shadow-sm h-100";

    const avatarFilename = pet.image?.split('/').pop();
    const imagePath = avatarFilename ? `images/${avatarFilename}` : 'imgs/pet-placeholder.jpg';

    card.innerHTML = `
      <img src="${imagePath}" class="card-img-top pet-avatar" alt="${pet.name}" />
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${pet.name}</h5>
        <p class="card-text">
          <strong>Espécie:</strong> ${specieMap[pet.specie] || pet.specie}<br>
          <strong>Sexo:</strong> ${sexMap[pet.sex] || pet.sex}<br>
          <strong>Idade:</strong> ${pet.age}<br>
          <strong>Porte:</strong> ${sizeMap[pet.size] || pet.size}
        </p>
        <button class="btn btn-info me-2 mb-2 view-more-info" data-id="${pet.id}">Ver mais informações</button>
        <button class="btn btn-danger me-2 mb-2 remove-from-cart" data-id="${pet.id}">Remover da Cestinha</button>
        <button class="btn btn-success me-2 mb-2 adopt-button" data-pet-id="${pet.id}">Quero Adotar!</button>
      </div>
    `;

    col.appendChild(card);
    container.appendChild(col);
  });
}

function removeFromCart(petId) {
  let cart = getCart().filter(pet => pet.id !== petId);
  setCart(cart);
  displayCartItems();
  updateCartCount();
  alert('Pet removido da cestinha.');
}

function updateCartCount() {
  const cart = getCart();
  const el = document.getElementById("cartCount");
  if (el) el.textContent = cart.length;
}

/* ============================================================
   📌 Modais
============================================================ */
function showPetModal(pet) {
  const specieMap = { G: 'Gato', C: 'Cachorro' };
  const sexMap = { M: 'Macho', F: 'Fêmea' };
  const sizeMap = { P: 'Pequeno', M: 'Médio', G: 'Grande' };
  const imagePath = pet.image ? pet.image : 'imgs/pet-placeholder.jpg';

  const modalHTML = `
    <div class="modal fade" id="petDetailModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content" style="background-color: #e6f4ea; border-radius: 1rem;">
          <div class="modal-header border-0">
            <h5 class="modal-title">${pet.name}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-5">
                <img src="${imagePath}" class="img-fluid rounded" alt="${pet.name}">
              </div>
              <div class="col-md-7">
                <p><strong>Espécie:</strong> ${specieMap[pet.specie]}</p>
                <p><strong>Sexo:</strong> ${sexMap[pet.sex]}</p>
                <p><strong>Idade:</strong> ${pet.age} anos</p>
                <p><strong>Porte:</strong> ${sizeMap[pet.size]}</p>
                <p><strong>Local:</strong> ${pet.city_id || ''}, ${pet.state_id || ''}</p>
                <p><strong>Descrição:</strong> ${pet.description || ''}</p>
                <p><strong>Castrado:</strong> ${pet.castrated ? 'Sim' : 'Não'}</p>
                <p><strong>Vacinado:</strong> ${pet.vaccinated ? 'Sim' : 'Não'}</p>
                <p><strong>Comportamento:</strong> 
                  ${pet.docile ? 'Dócil, ' : ''}${pet.aggressive ? 'Agressivo, ' : ''}
                  ${pet.calm ? 'Calmo, ' : ''}${pet.playful ? 'Brincalhão, ' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;

  const existing = document.getElementById('petDetailModal');
  if (existing) existing.remove();

  document.body.insertAdjacentHTML('beforeend', modalHTML);
  new bootstrap.Modal(document.getElementById("petDetailModal")).show();
}

function showAdoptionModal(pet) {
  if (!document.getElementById("adoptModal")) {
    const modalHTML = `
      <div class="modal fade" id="adoptModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content" style="border-radius: 10px;">
            <div class="modal-header">
              <h5 class="modal-title">Parabéns pela escolha!</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <p id="adoptMessage"></p>
              <button class="btn btn-primary mt-3" id="contactTutorBtn" data-id="">Entrar em contato com tutor</button>
            </div>
          </div>
        </div>
      </div>`;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }

  document.getElementById("adoptMessage").innerHTML =
    `Estamos felizes por você escolher o pet <strong>${pet.name}</strong> para fazer parte da sua vida!`;

  const contactBtn = document.getElementById("contactTutorBtn");
  contactBtn.setAttribute("data-id", pet.id);

  new bootstrap.Modal(document.getElementById("adoptModal")).show();
}

/* ============================================================
   📲 Contato via WhatsApp
============================================================ */
async function contactTutor(petId) {
  try {
    const response = await fetch(`https://amigopet.onrender.com/pet/${petId}/whatsapp`);
    if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);
    const data = await response.json();

    if (!data.phone) throw new Error("Telefone não encontrado");
    const phone = data.phone.replace(/\D/g, "");

    const pet = allPets.find(p => p.id == petId);
    const petName = pet ? pet.name : "seu pet";

    const message = encodeURIComponent(
      `Oi, tudo bem? Estou interessado(a) em adotar seu pet ${petName} 🐶🐱 anunciado aqui no Amigo Pet! 🐾`
    );

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  } catch (error) {
    alert("Não foi possível obter o número do tutor.");
    console.error("Erro:", error);
  }
}

/* ============================================================
   🔐 Validação de Token
============================================================ */
function isTokenValid(token) {
  if (!token) return false;
  try {
    const decoded = jwt_decode(token);
    return decoded.exp > (Date.now() / 1000);
  } catch {
    return false;
  }
}

/* ============================================================
   📌 Eventos Globais
============================================================ */
document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Você precisa estar logado para acessar o carrinho.');
    window.location.href = '/login.html';
    return;
  }

  await fetchAllPets();
  displayCartItems();
  updateCartCount();
});

document.addEventListener('click', async (e) => {
  if (e.target.classList.contains("remove-from-cart")) {
    removeFromCart(parseInt(e.target.dataset.id));
  }
  if (e.target.classList.contains("view-more-info")) {
    const pet = allPets.find(p => p.id === parseInt(e.target.dataset.id));
    pet ? showPetModal(pet) : alert("Pet não encontrado.");
  }
  if (e.target.classList.contains("adopt-button")) {
    const pet = allPets.find(p => p.id === parseInt(e.target.dataset.petId));
    if (pet) showAdoptionModal(pet);
  }
  if (e.target.id === "contactTutorBtn") {
    await contactTutor(e.target.dataset.id);
  }
});

/* ============================================================
   📌 Menu - Redirecionamentos com Token
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const botaoAdotar = document.querySelector('#menu-quer-adotar');
  if (botaoAdotar) {
    botaoAdotar.addEventListener('click', (e) => {
      e.preventDefault();
      const token = localStorage.getItem('token');
      isTokenValid(token) ? window.location.href = 'quer_adotar.html'
        : (alert("Seu token expirou, faça login novamente."), window.location.href = 'login.html');
    });
  }

  const botaoCadastrarPet = document.querySelector('#menu-cadastrar-pet');
  if (botaoCadastrarPet) {
    botaoCadastrarPet.addEventListener('click', (e) => {
      e.preventDefault();
      const token = localStorage.getItem('token');
      isTokenValid(token) ? window.location.href = 'quer_divulgar.html'
        : (alert("Sessão expirada. Faça login novamente."), window.location.href = 'login.html');
    });
  }
});

/* ============================================================
   📲 Botão Contato Geral
============================================================ */
document.addEventListener('click', async (e) => {
  if (e.target.id === 'contactTutorBtn') {
    try {
      const response = await fetch('https://amigopet.onrender.com/whatsapp/divulgar');
      if (!response.ok) throw new Error('Erro na requisição');
      const data = await response.json();

      const phone = data.phone?.replace(/\D/g, '');
      if (!phone) return alert('Número do tutor não encontrado.');

      window.open(`https://wa.me/${phone}`, '_blank');
    } catch (error) {
      console.error(error);
      alert('Você será direcionado ao whatsapp do tutor.');
    }
  }
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
