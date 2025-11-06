async function register() {
  const inputWhatsApp = document.querySelector("#user_whatsapp");
  const itiWhatsApp = window.intlTelInputGlobals.getInstance(inputWhatsApp);
  const formattedWhatsApp = itiWhatsApp.getNumber(); // Garantir que o número está formatado corretamente

  const dataLogin = {
    nome: document.getElementById("user_name").value,
    email: document.getElementById("user_email").value,
    whatsapp: formattedWhatsApp,
    password: document.getElementById("user_password").value,
    entrou_com_facebook: false,
    entrou_com_google: false,
    quer_divulgar: document.getElementById("divulgar").checked,
    quer_adotar: document.getElementById("adotar").checked,
    criado_em: new Date().toISOString()
  };

  try {
    const reply = await fetch("https://amigopet.onrender.com/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataLogin),
    });

    // se o backend retornar erro (ex: 409 email duplicado)
    if (!reply.ok) {
      const errorData = await reply.json().catch(() => ({}));
      alert("Erro no cadastro: " + (errorData.error || reply.statusText));
      return;
    }

    const data = await reply.json();

    // se backend responder com erro explícito no JSON
    if (data.error) {
      alert("Erro no cadastro: " + data.error);
      return;
    }

    const token = data.token;
    if (!token) {
      alert("cadastrado com sucesso");
      return;
    }

    // se chegou até aqui -> deu certo
    localStorage.setItem("token", token);
    const decoded = jwt_decode(token);

    if (decoded.userRole === "admin") {
      window.location.href = "admin.html";
    } else if (decoded.quer_adotar === true) {
      window.location.href = "quer_adotar.html";
    } else {
      window.location.href = "quer_divulgar.html";
    }

  } catch (err) {
    console.error("Erro na requisição:", err);
    alert("Erro na requisição: " + err.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const inputWhatsApp = document.querySelector("#user_whatsapp");

  const itiWhatsApp = window.intlTelInput(inputWhatsApp, {
    preferredCountries: ["br", "us"],
    separateDialCode: true,
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
  });

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    await register();
  });
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
