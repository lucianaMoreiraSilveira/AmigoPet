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
