let allPets = [];

// === Funções de carrinho personalizadas por usuário ===
function getCartKey() {
  const token = localStorage.getItem("token");
  if (!token) return "cart_guest";

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.user_id ? `cart_${payload.user_id}` : "cart_guest";
  } catch (e) {
    console.error("Erro ao decodificar token:", e);
    return "cart_guest";
  }
}

function getCart() {
  return JSON.parse(localStorage.getItem(getCartKey())) || [];
}

function setCart(cart) {
  localStorage.setItem(getCartKey(), JSON.stringify(cart));
}

// === Buscar pets da API ===
async function fetchAllPets() {
  try {
    const response = await fetch("https://amigopet.onrender.com/pet/all");
    const data = await response.json();

    if (!Array.isArray(data.pet)) {
      throw new Error("Resposta da API não é um array.");
    }

    allPets = data.pet;
  } catch (error) {
    console.error("Erro ao buscar todos os pets:", error);
  }
}



// === DOMContentLoaded: carregar carrinho ===
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

// === Exibir itens do carrinho ===
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
          <strong>Espécie:</strong> ${specieMap[pet.especie] || pet.especie}<br>
          <strong>Sexo:</strong> ${sexMap[pet.sexo] || pet.sexo}<br>
          <strong>Idade:</strong> ${pet.idade}<br>
          <strong>Porte:</strong> ${sizeMap[pet.porte] || pet.porte}
        </p>
       <button class="btn btn-info me-2 mb-2 view-more-info" data-id="${pet.id}">Ver mais informações</button>
<button class="btn btn-danger me-2 mb-2 remove-from-cart" data-id="${pet.id}">Remover da Cestinha</button>
<button class="btn btn-success me-2 mb-2" id="adoptButton" data-pet-id="${pet.id}">Quero Adotar!</button>
<button class="btn btn-primary me-2 mb-2  contact-tutor" data-id="${pet.id}">Entrar em contato com tutor</button>


      </div>
    `;


    col.appendChild(card);
    container.appendChild(col);
  });
}

// Depois que o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", async (event) => {
    const button = event.target.closest(".contact-tutor");
    if (!button) return;

    const petId = button.getAttribute("data-id");

    try {
      const response = await fetch(`https://amigopet.onrender.com/pet/${petId}/whatsapp`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      if (!data.phone) throw new Error("Telefone não encontrado");

      const phone = data.phone.replace(/\D/g, "");

      // ✅ Emojis codificados corretamente
    const pet = allPets.find(p => p.id == petId);
const petName = pet ? pet.name : "seu pet";

const rawMessage = `<span>Oi, tudo bem?</span><p>0xE2</p><span> Estou interessado(a) em adotar seu pet ${petName} 🐶🐱 anunciado aqui no Amigo Pet! 🐾</span>`;
const message = encodeURIComponent(rawMessage);
window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
    } catch (error) {
      alert("Não foi possível obter o número do tutor.");
      console.error("Erro:", error);
    }
  });
});



// === Remover pet ===
function removeFromCart(petId) {
  let cart = getCart();
  cart = cart.filter(pet => pet.id !== petId);
  setCart(cart);
  displayCartItems();
  updateCartCount();
  alert('Pet removido da cestinha.');
}

// === Atualizar contador ===
function updateCartCount() {
  const cart = getCart();
  document.getElementById("cartCount").textContent = cart.length;
}

// === Modal detalhado ===
function showPetModal(pet) {
  const specieMap = { G: 'Gato', C: 'Cachorro' };
  const sexMap = { M: 'Macho', F: 'Fêmea' };
  const sizeMap = { P: 'Pequeno', M: 'Médio', G: 'Grande' };
  const imagePath = pet.avatar ? `images/${pet.avatar.split('\\').pop()}` : 'imgs/pet-placeholder.jpg';

  const modalHTML = `
    <div class="modal fade" id="petDetailModal" tabindex="-1" aria-labelledby="petDetailModalLabel" aria-hidden="true">
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
                <p><strong>Local:</strong> ${pet.city_id}, ${pet.state_id}</p>
                <p><strong>Descrição:</strong> ${pet.description}</p>
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
    </div>
  `;

  const existing = document.getElementById('petDetailModal');
  if (existing) existing.remove();

  document.body.insertAdjacentHTML('beforeend', modalHTML);
  const modal = new bootstrap.Modal(document.getElementById("petDetailModal"));
  modal.show();
}

// === Evento de clique global ===
document.addEventListener('click', async function (e) {
  // Remover pet
  if (e.target && e.target.classList.contains("remove-from-cart")) {
    const petId = parseInt(e.target.dataset.id);
    removeFromCart(petId);
  }

  // Ver mais info
  if (e.target && e.target.classList.contains("view-more-info")) {
    const petId = parseInt(e.target.dataset.id);
    const pet = allPets.find(p => p.id === petId);
    if (pet) {
      showPetModal(pet);
    } else {
      alert("Pet não encontrado.");
    }
  }

  // Quero Adotar
  if (e.target && e.target.id === "adoptButton") {
    const petId = parseInt(e.target.dataset.petId);
    const pet = allPets.find(p => p.id === petId);
    if (pet) {
      showAdoptionModal(pet);
    }
  }
});

// === Modal de adoção ===
function showAdoptionModal(pet) {
  if (!document.getElementById("adoptModal")) {
    const modalHTML = `
      <div class="modal fade" id="adoptModal" tabindex="-1" aria-labelledby="adoptModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content" style="border-radius: 10px;">
            <div class="modal-header">
              <h5 class="modal-title">Parabéns pela escolha!</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <p id="adoptMessage"></p>
            </div>
            
          </div>
        </div>
      </div>`;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }

  document.getElementById("adoptMessage").innerHTML = `
    Estamos felizes por você escolher o pet <strong>${pet.name}</strong> para fazer parte da sua vida!
  `;

  const adoptModal = new bootstrap.Modal(document.getElementById("adoptModal"));
  adoptModal.show();
}


  

   


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

document.addEventListener('click', async (e) => {
  if (e.target && e.target.id === 'contactTutorBtn') {
    try {
      // Faça a requisição para a rota do backend
      const response = await fetch('https://amigopet.onrender.com/whatsapp/divulgar');
      if (!response.ok) throw new Error('Erro na requisição');

      const data = await response.json();

      // Exemplo: data = { phone: "5511999999999" }
      const phone = data.phone?.replace(/\D/g, '');
      if (!phone) {
        alert('Número do tutor não encontrado.');
        return;
      }

      // Abrir WhatsApp no número retornado
      const whatsappUrl = `https://wa.me/${phone}`;
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error(error);
      alert('Erro ao buscar número do tutor.');
    }
  }
});
