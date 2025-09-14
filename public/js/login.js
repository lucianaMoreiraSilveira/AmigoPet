
function getUserIdFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.user_id || payload.id || payload.sub || null;
  } catch (e) {
    console.error("Erro ao decodificar token:", e);
    return null;
  }
}

document.querySelector("#btnLogin").addEventListener("click", login);

async function login() {
  const email = document.querySelector("#inputEmail").value;
  const password = document.querySelector("#inputPassword").value;

  if (email === "" || password === "") {
    alert("Preencha os campos");
    return;
  }

  const dataLogin = { email, password };

  try {
    const reply = await fetch("https://amigopet-1.onrender.com/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataLogin),
    });

    if (reply.status !== 200) {
      const errorData = await reply.json();
      alert("Erro no login: " + errorData.message || "Tente novamente.");
      return;
    }

    const data = await reply.json();

    // ✅ Salva o token no localStorage
    if (data.token) {
      localStorage.setItem("token", data.token);


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

    // Salva o objeto user, se existir
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    // Redirecionamento
    if (data.redirect) {
      window.location.href = data.redirect;
    } else {
      window.location.href = "/registerpet.html";
    }

  } catch (error) {
    console.error("Erro ao fazer login:", error);
    alert("Erro ao tentar se conectar ao servidor. Tente novamente mais tarde.");
  }
}
