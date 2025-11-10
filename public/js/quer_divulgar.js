async function registerPet() {
  // Mapear os valores de specie e size antes de enviar
  const specieMap = {
    'Gato': 'G',
    'Cachorro': 'C'
  };
  
  const sizeMap = {
    'Pequeno': 'P',
    'Médio': 'M',
    'Grande': 'G'
  };
  
  const sexMap = {
    'Macho': 'M',
    'Fêmea': 'F'
  };


  const petData = {
  name: document.getElementById("pet_name").value,
  specie: specieMap[document.getElementById("pet_specie").selectedOptions[0].text] || 'G',
  sex: sexMap[document.getElementById("pet_sex").selectedOptions[0].text] || 'M',
  age: document.getElementById("pet_age").value,
  size: sizeMap[document.getElementById("pet_size").selectedOptions[0].text] || 'P',
  state_id: document.getElementById("pet_state").value,
  city_id: document.getElementById("pet_city").value,
  description: document.getElementById("pet_description").value,
  avatar: document.getElementById("pet_avatar").value,
  tutor_id: document.getElementById("tutor_id").value, // ✅ Adicionado aqui


    // Cuidados veterinários
    castrated: document.getElementById("castrated").checked,
    vaccinated: document.getElementById("vaccinated").checked,
    vermifugate: document.getElementById("vermifugate").checked,
    need_special_care: document.getElementById("special_care").checked,

    // Temperamento
    docile: document.getElementById("docile").checked,
    aggressive: document.getElementById("aggressive").checked,
    calm: document.getElementById("calm").checked,
    playful: document.getElementById("playful").checked,
    sociable: document.getElementById("sociable").checked,
    aloof: document.getElementById("aloof").checked,
    independent: document.getElementById("independent").checked,
    needy: document.getElementById("needy").checked,

    // Vive bem com
    friendly_with_house_with_backyard: document.getElementById("friendly_backyard").checked,
    friendly_with_apartment: document.getElementById("friendly_apartment").checked,

    // Sociabilidade
    sociability_cats: document.getElementById("sociability_cats").checked,
    sociability_dogs: document.getElementById("sociability_dogs").checked,
    sociability_children: document.getElementById("sociability_children").checked,
    sociability_unknown: document.getElementById("sociability_unknown").checked,
  };

  try {
    const response = await fetch("https://amigopet.onrender.com/pet/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(petData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      alert("Erro ao cadastrar pet: " + errorText);
      return;
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);

    alert("Registro realizado com sucesso!");
    window.location.href = "index.html";

  } catch (err) {
    console.error("Erro na requisição:", err);
    alert("Erro inesperado ao registrar pet. Tente novamente mais tarde.");
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerpetForm");
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      await registerPet();
    });
  } else {
    console.warn("Formulário #registerpetForm não encontrado.");
  }
});



// busca estado e cidade brasil

const stateSelect = document.getElementById('pet_state');
const citySelect = document.getElementById('pet_city');

// Carregar estados
fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
  .then(res => res.json())
  .then(states => {
    states.forEach(state => {
      const option = document.createElement('option');
      option.value = state.sigla;
      option.textContent = `${state.sigla} - ${state.nome}`;
      stateSelect.appendChild(option);
    });
  });

// Quando o estado for selecionado, carregar cidades
stateSelect.addEventListener('change', () => {
  const uf = stateSelect.value;
  citySelect.innerHTML = '<option value="">Carregando...</option>';
  citySelect.disabled = true;

  fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
    .then(res => res.json())
    .then(cities => {
      citySelect.innerHTML = '<option value="">Selecione a cidade</option>';
      cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.nome;
        option.textContent = city.nome;
        citySelect.appendChild(option);
      });
      citySelect.disabled = false;
    });
});

 // Preview da imagem do pet
  const petAvatarInput = document.getElementById('pet_avatar');
  const imagemContainer = document.getElementById('imagemContainer');

  petAvatarInput.addEventListener('change', () => {
      const file = petAvatarInput.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = e => {
              imagemContainer.innerHTML = `<img src="${e.target.result}" alt="Preview do Pet" class="img-fluid rounded shadow-sm" style="max-height:200px;">`;
          };
          reader.readAsDataURL(file);
      }
  });
 document.addEventListener("DOMContentLoaded", () => {
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

  // ===== Função para alternar telas =====
  function showSection(section) {
    loginSection.style.display = 'none';
    forgotSection.style.display = 'none';
    resetSection.style.display = 'none';

    if (section === 'login') loginSection.style.display = 'block';
    if (section === 'forgot') forgotSection.style.display = 'block';
    if (section === 'reset') resetSection.style.display = 'block';
  }

  // ===== Abrir modal =====
  if (btnAbrirLogin) {
    btnAbrirLogin.addEventListener('click', (e) => {
      e.preventDefault();
      loginModal.classList.add('mostrar');
      showSection('login');
    });
  }

  // ===== Fechar modal =====
  if (fecharLogin) {
    fecharLogin.addEventListener('click', () => loginModal.classList.remove('mostrar'));
  }

  window.addEventListener('click', (e) => {
    if (e.target === loginModal) loginModal.classList.remove('mostrar');
  });

  // ===== Alternar telas =====
  if (btnForgotPassword) btnForgotPassword.addEventListener('click', () => showSection('forgot'));
  if (btnVoltarLogin) btnVoltarLogin.addEventListener('click', () => showSection('login'));
  if (btnVoltarLogin2) btnVoltarLogin2.addEventListener('click', () => showSection('login'));

  // ===== LOGIN =====
  if (btnLoginModal) {
    btnLoginModal.addEventListener('click', async () => {
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value.trim();

      if (!email || !password) {
        alert('Preencha todos os campos!');
        return;
      }

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

          // Redireciona após login (corrigido)
          setTimeout(() => {
            window.location.href = "index.html"; // ✅ substitui variável indefinida "redirect"
          }, 500);
        } else {
          alert(data.error || 'Erro ao fazer login.');
        }
      } catch (error) {
        console.error(error);
        alert('Não foi possível conectar ao servidor.');
      }
    });
  }

  // ===== ESQUECI SENHA =====
  if (btnEnviarReset) {
    btnEnviarReset.addEventListener('click', async () => {
      const email = document.getElementById('forgotEmail').value.trim();
      const msg = document.getElementById('messageForgot');

      if (!email) {
        alert('Digite seu e-mail.');
        return;
      }

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
  }

  // ===== REDEFINIÇÃO DE SENHA =====
  if (btnRedefinir) {
    btnRedefinir.addEventListener('click', async () => {
      const newPassword = document.getElementById('newPassword').value.trim();
      const msg = document.getElementById('messageReset');
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (!token || !newPassword) {
        msg.innerHTML = `<div style="color:red;">Token ou senha inválida.</div>`;
        return;
      }

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
  }
});
// ===== MODAL LGPD =====
document.addEventListener("DOMContentLoaded", () => {
  const lgpdModal = document.getElementById("lgpdModal");
  const aceitarLgpd = document.getElementById("aceitarLgpd");

  // Verifica se o usuário já aceitou antes
  if (!localStorage.getItem("lgpdAceito")) {
    lgpdModal.classList.add("mostrar");
  }

  aceitarLgpd.addEventListener("click", () => {
    lgpdModal.classList.remove("mostrar");
    localStorage.setItem("lgpdAceito", "true");
  });
});
