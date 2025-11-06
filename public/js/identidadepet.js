document.addEventListener("DOMContentLoaded", () => {
  const estadoSelect = document.getElementById("estado");
  const cidadeSelect = document.getElementById("cidade");

  // 🔹 Carregar estados do IBGE
  fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
    .then(res => res.json())
    .then(estados => {
      estados.forEach(estado => {
        const option = document.createElement("option");
        option.value = estado.sigla;
        option.textContent = estado.nome;
        estadoSelect.appendChild(option);
      });
    });

  // 🔹 Carregar cidades quando o estado mudar
  estadoSelect.addEventListener("change", () => {
    cidadeSelect.innerHTML = '';
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelect.value}/municipios`)
      .then(res => res.json())
      .then(cidades => {
        cidades.forEach(cidade => {
          let opt = document.createElement("option");
          opt.value = cidade.nome;
          opt.textContent = cidade.nome;
          cidadeSelect.appendChild(opt);
        });
      });
  });

  // 🔹 Verifica se o token ainda é válido
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

  // 🔹 Redireciona "Quero Adotar"
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

  // 🔹 Redireciona "Cadastrar Pet"
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

  // 🔹 Preview da imagem do pet
  window.previewImage = function () {
    const file = document.getElementById('imagemPet').files[0];
    const preview = document.getElementById('imagemPreview');

    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        preview.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // 🔹 Gerar PDF (RG do Pet)
  document.getElementById("petForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [55, 170]
    });

    // Fundo
    doc.setFillColor(204, 255, 204);
    doc.rect(0, 0, 170, 55, 'F');

    // Molduras
    doc.setFillColor(240, 255, 240);
    doc.roundedRect(5, 5, 75, 45, 3, 3, 'F');   // Frente
    doc.roundedRect(90, 5, 75, 45, 3, 3, 'F');  // Verso

    // Dados
    const nome = document.getElementById("nomePet").value;
    const nascimento = document.getElementById("dataNascimento").value;
    const especie = document.getElementById("especie").value;
    const sexo = document.getElementById("sexo").value;
    const porte = document.getElementById("porte").value;
    const estado = estadoSelect.value;
    const cidade = cidadeSelect.value;
    const tutor = document.getElementById("tutor").value;
    const telefone = document.getElementById("telefone").value;
    const observacoes = document.getElementById("observacoes").value;
    const castrado = document.querySelector('#castrado')?.value || 'Não informado';
    const vacinado = document.querySelector('#vacinado')?.value || 'Não informado';
    const numeroRg = 'PET-' + Math.floor(Math.random() * 1000000);

    // ---------- Frente ----------
    doc.setFont("helvetica", "bold");
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(14);
    doc.text("RG PET", 8, 12);

    doc.setFontSize(9);
    doc.text("Nome:", 8, 20);
    doc.text("Nascimento:", 8, 26);
    doc.text("Tutor:", 8, 32);
    doc.text("Telefone:", 8, 38);
    doc.text("Local de nasc.:", 8, 44);

    doc.setFont("helvetica", "normal");
    doc.text(nome, 20, 20);
    doc.text(nascimento, 30, 26);
    doc.text(tutor, 25, 32);
    doc.text(telefone, 25, 38);
    doc.text(`${cidade}/${estado}`, 30, 44);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(`RG: ${numeroRg}`, 58, 35);

    // ---------- Verso ----------
    const renderVerso = () => {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(10);
      doc.text("Informações adicionais", 92, 13);

      doc.setFontSize(9);
      doc.text("Espécie:", 92, 20);
      doc.text("Sexo:", 92, 25);
      doc.text("Porte:", 92, 30);
      doc.text("Castrado:", 92, 35);
      doc.text("Vacinado:", 92, 40);
      doc.text("Observações:", 135, 20);

      doc.setFont("helvetica", "normal");
      doc.text(especie, 110, 20);
      doc.text(sexo, 110, 25);
      doc.text(porte, 110, 30);
      doc.text(castrado, 110, 35);
      doc.text(vacinado, 110, 40);
      doc.text(doc.splitTextToSize(observacoes, 30), 135, 25);
    };

    const file = document.getElementById("imagemPet").files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
          doc.setFillColor(255, 255, 245);
          doc.roundedRect(58, 12, 20, 20, 2, 2, 'F');
          doc.addImage(img, 'JPEG', 58, 12, 20, 20);

          renderVerso();
          doc.save(`${nome}_RG.pdf`);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      renderVerso();
      doc.save(`${nome}_RG.pdf`);
    }
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
