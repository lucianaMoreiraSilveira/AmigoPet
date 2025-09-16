 // Função para validar token
    function isTokenValid(token) {
      if (!token) return false;
      try {
        const decoded = jwt_decode(token);
        return decoded.exp > Date.now() / 1000;
      } catch {
        return false;
      }
    }

    // Login
    document.querySelector("#btnLogin").addEventListener("click", async () => {
  const email = document.querySelector("#inputEmail").value;
  const password = document.querySelector("#inputPassword").value;

  if (!email || !password) {
    alert("Preencha os campos!");
    return;
  }

  try {
    const reply = await fetch("https://amigopet.onrender.com/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await reply.json();

    // Salva token e user
    if (data.token) localStorage.setItem("token", data.token);
    if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

    // Redirecionamento
    if (data.redirect && data.redirect !== "") {
      window.location.href = data.redirect;
    } else if (data.user && data.user.quer_adotar) {
      window.location.href = "quer_adotar.html";
    } else if (data.user && data.user.quer_divulgar) {
      window.location.href = "quer_divulgar.html";
    } else {
      window.location.href = "registerpet.html";
    }

  } catch (err) {
    console.error("Erro ao logar:", err);
    alert("Erro ao conectar com o servidor. Tente novamente mais tarde.");
  }
});

    // Protege menus
    document.addEventListener('DOMContentLoaded', () => {
      const botaoAdotar = document.querySelector('#menu-quer-adotar');
      if (botaoAdotar) {
        botaoAdotar.addEventListener('click', (e) => {
          e.preventDefault();
          const token = localStorage.getItem('token');
          if (isTokenValid(token)) {
            window.location.href = 'quer_adotar.html';
          } else {
            alert("Sessão expirada. Faça login novamente.");
            window.location.href = 'login.html';
          }
        });
      }

      const botaoCadastrarPet = document.querySelector('#menu-cadastrar-pet');
      if (botaoCadastrarPet) {
        botaoCadastrarPet.addEventListener('click', (e) => {
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
    });