  // 🔹 Converte data do formato ISO (aaaa-mm-dd) para dd/mm/aaaa
function formatarDataBR(dataISO) {
  if (!dataISO || dataISO === "—" || dataISO === "-") return "—";
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

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
  document.getElementById("petForm").addEventListener("sub", async (e) => {
  e.preventDefault();

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [55, 170]
  });

  // Fundo verde claro
  doc.setFillColor(204, 255, 204);
  doc.rect(0, 0, 170, 55, 'F');

  // Molduras (frente e verso)
  doc.setFillColor(240, 255, 240);
  doc.roundedRect(5, 5, 75, 45, 3, 3, 'F');   // Frente
  doc.roundedRect(90, 5, 75, 45, 3, 3, 'F');  // Verso

  // Capturar dados do formulário
  const nome = document.getElementById("nomePet").value;
  const nascimento = formatarDataBR(document.getElementById("dataNascimento").value);
  const especie = document.getElementById("especie").value;
  const sexo = document.getElementById("sexo").value;
  const porte = document.getElementById("porte").value;
  const estado = document.getElementById("estado").value;
  const cidade = document.getElementById("cidade").value;
  const tutor = document.getElementById("tutor").value;
  const telefone = document.getElementById("telefone").value;
  const observacoes = document.getElementById("observacoes").value;
  const tratamento = document.getElementById("tratamento").value;
  const tipoTratamento = document.getElementById("tipoTratamento").value || "—";
  const sociavel = document.getElementById("sociavel").value;
  const tipoAmbiente = document.getElementById("tipoAmbiente").value;

  // Capturar vacinas marcadas
  const vacinasSelecionadas = [];
  document.querySelectorAll("#listaVacinas input[type='checkbox']").forEach(cb => {
    if (cb.checked) {
      const nomeVacina = cb.nextSibling.textContent.trim();
      const dataAplicacao = document.getElementById(cb.id.replace("check", "data")).value || "—";
      vacinasSelecionadas.push(`${nomeVacina}: ${dataAplicacao}`);
    }
  });

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
  doc.text("Local:", 8, 44);

  doc.setFont("helvetica", "normal");
  doc.text(nome, 22, 20);
  doc.text(nascimento, 30, 26);
  doc.text(tutor, 22, 32);
  doc.text(telefone, 25, 38);
  doc.text(`${cidade}/${estado}`, 22, 44);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(`RG: ${numeroRg}`, 58, 35);

  // ---------- Verso ----------
  const renderVerso = () => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    doc.text("Informações adicionais", 92, 13);

    doc.setFontSize(8);
    doc.text("Espécie:", 92, 20);
    doc.text("Sexo:", 92, 25);
    doc.text("Porte:", 92, 30);
    doc.text("Sociável:", 92, 35);
    doc.text("Ambiente:", 92, 40);
    doc.text("Tratamento:", 92, 45);

    doc.setFont("helvetica", "normal");
    doc.text(especie, 110, 20);
    doc.text(sexo, 110, 25);
    doc.text(porte, 110, 30);
    doc.text(sociavel, 110, 35);
    doc.text(tipoAmbiente, 110, 40);
    doc.text(`${tratamento} - ${tipoTratamento}`, 110, 45);

    // Bloco de vacinas
    doc.setFont("helvetica", "bold");
    doc.text("Vacinas:", 135, 13);
    doc.setFont("helvetica", "normal");
    if (vacinasSelecionadas.length > 0) {
      const listaVacinasTexto = doc.splitTextToSize(vacinasSelecionadas.join(", "), 40);
      doc.text(listaVacinasTexto, 135, 18);
    } else {
      doc.text("Nenhuma vacina registrada", 135, 18);
    }

    // Observações
    if (observacoes.trim()) {
      doc.setFont("helvetica", "bold");
      doc.text("Obs.:", 135, 40);
      doc.setFont("helvetica", "normal");
      const obsTexto = doc.splitTextToSize(observacoes, 40);
      doc.text(obsTexto, 135, 44);
    }
  };

  // ---------- Inserir imagem do pet ----------
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

 function mostrarCampoTratamento() {
  const select = document.getElementById('tratamento');
  const campo = document.getElementById('campoProcedimento');
  campo.style.display = (select.value === 'Sim') ? 'block' : 'none';
}









document.addEventListener("DOMContentLoaded", () => {
  // ====== VACINAS DISPONÍVEIS ======
const vacinasDisponiveis = [
  { id: 1, nome: "V8-contra cinomose, hepatite.", tipo: "Cachorro", descricao: "Protege contra cinomose, hepatite, parvovirose, entre outras doenças caninas." },
  { id: 2, nome: "V10-mesmo do V8 mais leptospirose", tipo: "Cachorro", descricao: "Versão mais completa da V8, incluindo proteção adicional contra leptospirose." },
  { id: 3, nome: "Antirrábica-contra a raiva, obrig. por lei", tipo: "Cachorro e Gato", descricao: "Protege contra a raiva, obrigatória por lei." },
  { id: 4, nome: "V4-rinotraqueíte,calicivirose,panleucopenia", tipo: "Gato", descricao: "Previne rinotraqueíte, calicivirose e panleucopenia felina." },
  { id: 5, nome: "FeLV-leucemia", tipo: "Gato", descricao: "Protege contra leucemia felina (FeLV)." }
];


  const listaVacinas = document.getElementById('listaVacinas');
  const filtroEspecie = document.getElementById('filtroEspecie');

  function filtrarVacinas() {
    const especieSelecionada = filtroEspecie ? filtroEspecie.value : "Todas";
    listaVacinas.innerHTML = '';

    const vacinasFiltradas = vacinasDisponiveis.filter(v =>
      especieSelecionada === 'Todas' || v.tipo.includes(especieSelecionada)
    );

    if (vacinasFiltradas.length === 0) {
      listaVacinas.innerHTML = '<p class="text-muted fst-italic">Nenhuma vacina disponível para essa espécie.</p>';
      return;
    }

    vacinasFiltradas.forEach(vacina => {
      const div = document.createElement('div');
      div.classList.add('border', 'rounded', 'p-2', 'bg-white', 'mb-2');

      div.innerHTML = `
        <div class="form-check">
          <input class="form-check-input vacina-check" type="checkbox" value="${vacina.nome}" id="vacina_${vacina.id}">
          <label class="form-check-label fw-semibold" for="vacina_${vacina.id}">
            ${vacina.nome} <small class="text-muted">(${vacina.tipo})</small>
          </label>
        </div>
        <div class="row mt-2 ms-3">
          <div class="col-md-5">
            <label class="form-label">Data da Aplicação:</label>
            <input type="date" class="form-control vacina-data" id="data_${vacina.id}">
          </div>
          <div class="col-md-5">
            <label class="form-label">Próxima Dose:</label>
            <input type="date" class="form-control vacina-proxima" id="proxima_${vacina.id}">
          </div>
        </div>
      `;

      listaVacinas.appendChild(div);
    });
  }

  // Inicializa
  filtrarVacinas();
  if (filtroEspecie) filtroEspecie.addEventListener('change', filtrarVacinas);
});

// ===== GERAR PDF =====
document.getElementById("petForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  // Fundo azul
  const azulFundo = [179, 224, 255];
  const textoAzul = [0, 51, 102];
  doc.setFillColor(...azulFundo);
  doc.rect(0, 0, 210, 297, "F");

  // Cabeçalho
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...textoAzul);
  doc.text("CARTEIRA DE VACINAÇÃO DO PET", 105, 20, { align: "center" });

  // Foto
  const imgPreview = document.getElementById("imagemPreview");
  if (imgPreview && imgPreview.src && !imgPreview.src.includes("placeholder")) {
    const image = await fetch(imgPreview.src).then(res => res.blob()).then(blob => createImageBitmap(blob));
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 80;
    canvas.height = 80;
    ctx.drawImage(image, 0, 0, 80, 80);
    const imgData = canvas.toDataURL("image/jpeg");
    doc.addImage(imgData, "JPEG", 15, 30, 40, 40);
  }

  // ====== DADOS DO PET ======
const nomePet = document.getElementById("nomePet").value || "";
const nascimento = formatarDataBR(document.getElementById("dataNascimento").value || "");
const especie = document.getElementById("especie").value || "";
const sexo = document.getElementById("sexo").value || "";
const porte = document.getElementById("porte").value || "";
const tutor = document.getElementById("tutor").value || "";
const telefone = document.getElementById("telefone").value || "";
const cidade = document.getElementById("cidade").value || "";
const estado = document.getElementById("estado").value || "";
const tratamento = document.getElementById("tratamento").value || "";
const tipoTratamento = document.getElementById("tipoTratamento").value || "—";
const sociavel = document.getElementById("sociavel").value || "";
const tipoAmbiente = document.getElementById("tipoAmbiente").value || "";

doc.setFont("helvetica", "normal");
doc.setFontSize(12);
doc.setTextColor(0, 0, 0);

// Coluna da direita (dados principais)
doc.text(`Nome do Pet: ${nomePet}`, 65, 40);
doc.text(`Espécie: ${especie}`, 65, 48);
doc.text(`Sexo: ${sexo}`, 65, 56);
doc.text(`Porte: ${porte}`, 65, 64);
doc.text(`Nascimento: ${nascimento}`, 65, 72);

// Coluna da esquerda (dados do tutor)
doc.text(`Tutor: ${tutor}`, 15, 90);
doc.text(`Telefone: ${telefone}`, 15, 98);
doc.text(`Cidade/UF: ${cidade} - ${estado}`, 15, 106);

// Linha adicional acima da ficha
doc.setFont("helvetica", "italic");
doc.setFontSize(11);
doc.text(`Sociável: ${sociavel}`, 120, 35);
doc.text(`Ambiente: ${tipoAmbiente}`, 120, 40);
doc.text(`Tratamento: ${tratamento === "Sim" ? tipoTratamento : "Nenhum"}`, 120, 45);



 
// Vacinas Aplicadas
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...textoAzul);
  doc.text("Vacinas Aplicadas", 15, 120);

  const startY = 128;
  doc.setFillColor(0, 102, 204);
  doc.setTextColor(255, 255, 255);
  doc.rect(15, startY - 6, 180, 8, "F");
  doc.text("Vacina", 25, startY - 0.5);
  doc.text("Data da aplicação", 95, startY -0.5);
  doc.text("Próxima vacina", 150, startY - 0.5);

  // Coleta vacinas selecionadas
  const vacinasSelecionadas = [];
  document.querySelectorAll(".vacina-check:checked").forEach((chk) => {
    const id = chk.id.split("_")[1];
    const nome = chk.value;
    const dataInput = document.getElementById(`data_${id}`).value;
    const proximaInput = document.getElementById(`proxima_${id}`).value;
    const data = formatarDataBR(dataInput);
    const proxima = formatarDataBR(proximaInput);
   vacinasSelecionadas.push({ nome, data, proxima });
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);

  if (vacinasSelecionadas.length === 0) {
    doc.text("Nenhuma vacina registrada", 105, startY + 10, { align: "center" });
  } else {
    // Adiciona um espaço abaixo do cabeçalho (linha azul)
    let linha = startY + 10; // antes era +4, agora +10 para dar respiro

    vacinasSelecionadas.forEach(v => {
      doc.rect(15, linha - 5, 180, 8);
      doc.text(v.nome, 20, linha);
      doc.text(v.data, 100, linha);
      doc.text(v.proxima, 155, linha);
      linha += 10;
    });
  }

  // Rodapé
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.setTextColor(...textoAzul);
  doc.text("Emitido automaticamente pelo sistema Amigo Pet", 105, 285, { align: "center" });

  doc.save(`Carteira_${nomePet}.pdf`);
});

// ====== VACINAS DISPONÍVEIS (para informação na carteirinha) ======
doc.setFont("helvetica", "bold");
doc.setFontSize(14);
doc.setTextColor(...textoAzul);
doc.text("Informações das Vacinas", 5, 15);

let linhaVacinaInfo = 123;
doc.setFillColor(0, 102, 204);
doc.setTextColor(255, 255, 255);
doc.rect(15, linhaVacinaInfo - 6, 180, 8, "F");
doc.text("Vacina", 25, linhaVacinaInfo - 1);
doc.text("Espécie", 80, linhaVacinaInfo - 1);
doc.text("Descrição", 120, linhaVacinaInfo - 1);

// Conteúdo da tabela
linhaVacinaInfo += 1;
doc.setFont("helvetica", "normal");
doc.setFontSize(10);
doc.setTextColor(0, 0, 0);

vacinasDisponiveis.forEach(v => {
  // Nome e espécie
  doc.text(v.nome, 25, linhaVacinaInfo);
  doc.text(v.tipo, 80, linhaVacinaInfo);

  // Quebra automática da descrição (caso seja longa)
  const descricaoQuebrada = doc.splitTextToSize(v.descricao, 90);
  doc.text(descricaoQuebrada, 120, linhaVacinaInfo);

  // Calcula altura da linha
  const altura = Math.max(8, descricaoQuebrada.length * 4);
  doc.rect(15, linhaVacinaInfo - 5, 180, altura + 3); // borda ao redor
  linhaVacinaInfo += altura + 5;
});

// ====== SEÇÃO DE VACINAS APLICADAS ======
linhaVacinaInfo += 8; // espaço abaixo da tabela
doc.setFont("helvetica", "bold");
doc.setFontSize(14);
doc.setTextColor(...textoAzul);
doc.text("Vacinas Aplicadas", 15, linhaVacinaInfo);

// Cabeçalho da tabela
const startY = linhaVacinaInfo + 8;
doc.setFillColor(0, 102, 204);
doc.setTextColor(255, 255, 255);
doc.rect(15, startY - 6, 180, 8, "F");
doc.text("Vacina", 25, startY - 1);
doc.text("Data que tomou", 95, startY - 1);
doc.text("Próxima vacina", 115, startY - 1);

// Coleta vacinas selecionadas
const vacinasSelecionadas = [];
document.querySelectorAll(".vacina-check:checked").forEach((chk) => {
  const id = chk.id.split("_")[1];
  const nome = chk.value;
  const data = document.getElementById(`data_${id}`).value || "-";
  const proxima = document.getElementById(`proxima_${id}`).value || "-";
  vacinasSelecionadas.push({ nome, data, proxima });
});

doc.setFont("helvetica", "normal");
doc.setFontSize(11);
doc.setTextColor(0, 0, 0);

if (vacinasSelecionadas.length === 0) {
  doc.text("Nenhuma vacina registrada", 105, startY + 10, { align: "center" });
} else {
  let linha = startY + 10;

  vacinasSelecionadas.forEach(v => {
    doc.rect(15, linha - 5, 180, 8);
    doc.text(v.nome, 8, linha);
    doc.text(v.data, 95, linha);
    doc.text(v.proxima, 115, linha);
    linha += 8;
  });
}
vacinasSelecionadas.forEach(v => {
  // Quebra o nome da vacina em linhas que caibam na largura da coluna
  const linhasNome = doc.splitTextToSize(v.nome, 60); 
  
  // Define altura mínima da célula para 3 linhas de texto
  const alturaCelula = Math.max(linhasNome.length, 3) * 16; // 6 é a altura de cada linha

  // Desenha a célula "Vacina" com altura ajustada
  doc.rect(15, linha - 5, 80, alturaCelula); 
  doc.text(linhasNome, 17, linha); // posição x e y iniciais

  // Coluna Data
  doc.rect(95, linha - 5, 50, alturaCelula);
  doc.text(v.data, 95 + 5, linha);

  // Coluna Próxima
  doc.rect(145, linha - 5, 50, alturaCelula);
  doc.text(v.proxima, 145 + 5, linha);

  // Pula para a próxima linha (altura da célula atual)
  linha += alturaCelula + 2; // +2 para espaçamento extra entre linhas
});
