document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("searchPetForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const specieMap = { Gato: 'G', Cachorro: 'C' };
    const sexMap = { Macho: 'M', Fêmea: 'F' };
    const sizeMap = { Pequeno: 'P', Médio: 'M', Grande: 'G' };

    const rawData = {
      name: document.getElementById("pet_name").value.trim(),
      specie: specieMap[document.getElementById("pet_specie").value] || '',
      sex: sexMap[document.getElementById("pet_sex").value] || '',
      age: document.getElementById("pet_age").value.trim(),
      size: sizeMap[document.getElementById("pet_size").value] || '',
      adotado: false  // Adicione este campo conforme exigido pelo backend
    };

    const petData = {};
    for (const key in rawData) {
      if (rawData[key] !== '') {
        petData[key] = rawData[key];
      }
    }

    try {
      const response = await fetch("https://amigopet.onrender.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(petData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      const pets = Array.isArray(result) ? result : (result.pet || []);
      displayResults(pets);
    } catch (error) {
      console.error("Erro ao buscar pets:", error);
      document.getElementById("petResults").innerHTML =
        "<div class='col-12 text-danger'>Erro ao buscar pets: " + error.message + "</div>";
    }
  });



  function displayResults(pets) {
    const container = document.getElementById("petResults");
    container.innerHTML = "";

    if (!pets.length) {
      container.innerHTML = "<div class='col-12 text-muted'>Nenhum pet encontrado.</div>";
      return;
    }

    const specieMap = { G: 'Gato', C: 'Cachorro' };
    const sexMap = { M: 'Macho', F: 'Fêmea' };
    const sizeMap = { P: 'Pequeno', M: 'Médio', G: 'Grande' };

    pets.forEach(pet => {
      const card = document.createElement("div");
      card.className = "col-custom-5";

      const imagePath = pet.avatar
        ? `images/${pet.avatar.split('\\').pop()}`
        : "imgs/pet-placeholder.jpg";

      card.innerHTML = `
        <div class="card pet-card">
          <img src="${imagePath}" class="card-img-top" alt="${pet.name}">
          <div class="card-body">
            <h5 class="card-title">${pet.name}</h5>
            <p class="card-text">
              Espécie: ${specieMap[pet.specie] || pet.specie}<br>
              Sexo: ${sexMap[pet.sex] || pet.sex}<br>
              Idade: ${pet.age} anos<br>
              Porte: ${sizeMap[pet.size] || pet.size}
            </p>
            <button class="btn btn-success" onclick="marcarAdotado(${pet.id}, '${pet.name}')">
              Marcar como Adotado
            </button>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  }

  window.marcarAdotado = async function(petId, nome) {
    try {
      const response = await fetch(`https://amigopet.onrender.com/pet/${petId}/adotar`, {
        method: "PUT"
      });

      if (response.ok) {
        alert(`${nome} foi marcado como adotado!`);
        document.getElementById("searchPetForm").dispatchEvent(new Event("submit")); // Recarrega os resultados
      } else {
        throw new Error("Erro ao marcar como adotado");
      }
    } catch (error) {
      alert("Erro ao marcar como adotado.");
      console.error(error);
    }
  };








// Busca Usuário


document.getElementById('searchUserForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const id = document.getElementById('searchId').value.trim();
  const name = document.getElementById('searchName').value.trim();
  const container = document.getElementById('userResults');
  container.innerHTML = ''; // limpa antes de exibir resultados

  try {
    let res;
    if (id) {
      res = await fetch(`https://amigopet.onrender.com/user/${id}/all`);
    } else if (name) {
      res = await fetch("https://amigopet.onrender.com/user/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: name })
      });
    } else {
      container.innerHTML = `<p class="text-danger">Informe o ID ou o nome do usuário.</p>`;
      return;
    }

    if (!res.ok) throw new Error('Usuário não encontrado');
    const data = await res.json();

    // Garantir que sempre seja um array
    const users = Array.isArray(data) ? data : [data];
    users.forEach(user => displayUserById(user));

  } catch (err) {
    container.innerHTML = `<p class="text-danger">Erro: ${err.message}</p>`;
  }
});

function displayUserById(user) {
  const container = document.getElementById('userResults');

  const div = document.createElement('div');
  div.className = 'col-md-6 mb-3';
  div.innerHTML = `
    <div class="user-card card p-3">
      <div class="mb-2">
        <label>Nome:</label>
        <input type="text" class="form-control nome" value="${user.nome || ''}">
      </div>
      <div class="mb-2">
        <label>Email:</label>
        <input type="email" class="form-control email" value="${user.email || ''}">
      </div>
      <div class="mb-2">
        <label>WhatsApp:</label>
        <input type="text" class="form-control whatsapp" value="${user.whatsapp || ''}">
      </div>
      <button type="button" class="btn btn-success me-2" onclick="editarUsuario(${user.id}, this)">Editar</button>
      <button type="button" class="btn btn-danger" onclick="deletarUsuario(${user.id}, this)">Deletar</button>
    </div>
  `;

  container.appendChild(div);
}

// Função para editar usuário
window.editarUsuario = async function(id, btn) {
  const card = btn.closest('.user-card');
  const nome = card.querySelector('.nome').value.trim();
  const email = card.querySelector('.email').value.trim();
  const whatsapp = card.querySelector('.whatsapp').value.trim();

  if (!nome) {
    alert('O nome é obrigatório!');
    return;
  }

  try {
    const res = await fetch(`https://amigopet.onrender.com/user/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, whatsapp })
    });

    if (res.ok) {
      alert('Usuário atualizado com sucesso!');
    } else {
      const data = await res.json();
      alert('Erro ao atualizar: ' + (data.error || 'Erro desconhecido'));
    }
  } catch (error) {
    alert('Erro ao atualizar usuário.');
    console.error(error);
  }
};

// Função para deletar usuário
window.deletarUsuario = async function(id, btn) {
  if (!confirm("Tem certeza que deseja deletar este usuário?")) return;

  try {
    const res = await fetch(`https://amigopet.onrender.com/user/${id}`, { method: 'DELETE' });

    if (res.ok) {
      alert('Usuário deletado com sucesso!');
      // Remove o card da tela
      const card = btn.closest('.col-md-6');
      card.remove();
    } else {
      const data = await res.json();
      alert('Erro ao deletar: ' + (data.error || 'Erro desconhecido'));
    }
  } catch (error) {
    alert('Erro ao deletar usuário.');
    console.error(error);
  }
  };

  
});
// Busca Pet por ID
document.getElementById('searchPetByIdForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const id = document.getElementById('petSearchId').value.trim();
  const container = document.getElementById('petByIdResults');
  container.innerHTML = '';

  try {
    const res = await fetch(`https://amigopet.onrender.com/pet/${id}/all`);
    if (!res.ok) throw new Error('Pet não encontrado');
    const pet = await res.json();

    displayPetById(pet);
  } catch (err) {
    container.innerHTML = `<p class="text-danger">Erro: ${err.message}</p>`;
  }
});

function displayPetById(pet) {
  const container = document.getElementById('petByIdResults');
  container.innerHTML = '';

  const div = document.createElement('div');
  div.className = 'col-md-6';
  
  // Para simplificar, avatar é um input texto com URL (pode adaptar para upload depois)
  div.innerHTML = `
    <div class="user-card">
      <div class="mb-2">
        <label>Nome:</label>
        <input type="text" class="form-control pet-name" value="${pet.name || ''}">
      </div>
      <div class="mb-2">
        <label>Avatar (URL):</label>
        <input type="text" class="form-control pet-avatar" value="${pet.avatar || ''}">
      </div>
      <button class="btn btn-success me-2" onclick="editarPet(${pet.id}, this)">Salvar</button>
      <button class="btn btn-danger" onclick="deletarPet(${pet.id})">Excluir</button>
    </div>
  `;

  container.appendChild(div);
}

window.editarPet = async function(id, btn) {
  const card = btn.closest('.user-card');
  const name = card.querySelector('.pet-name').value.trim();
  const avatar = card.querySelector('.pet-avatar').value.trim();

  if (!name) {
    alert('O nome é obrigatório!');
    return;
  }

  try {
    const res = await fetch(`https://amigopet.onrender.com/pet/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, avatar })
    });

    if (res.ok) {
      alert('Pet atualizado com sucesso!');
    } else {
      const data = await res.json();
      alert('Erro ao atualizar: ' + (data.error || 'Erro desconhecido'));
    }
  } catch (error) {
    alert('Erro ao atualizar pet.');
    console.error(error);
  }
};

window.deletarPet = async function(id) {
  if (!confirm("Tem certeza que deseja deletar este pet?")) return;

  try {
    const res = await fetch(`https://amigopet.onrender.com/pet/${id}`, { method: 'DELETE' });

    if (res.ok) {
      alert('Pet deletado com sucesso!');
      document.getElementById('petByIdResults').innerHTML = '';
    } else {
      const data = await res.json();
      alert('Erro ao deletar: ' + (data.error || 'Erro desconhecido'));
    }
  } catch (error) {
    alert('Erro ao deletar pet.');
    console.error(error);
  }
};



// Buscar voluntário
document.getElementById('searchVolunteersForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const idValue = document.getElementById('volunteerSearchId').value.trim();
  const id = Number(idValue);
  const container = document.getElementById('volunteersResults');
  container.innerHTML = '';

  if (!idValue || isNaN(id) || id <= 0) {
    alert('Por favor, digite um ID numérico válido.');
    return;
  }

  try {
    const res = await fetch(`https://amigopet.onrender.com/volunteers/${id}/all`);
    if (!res.ok) throw new Error('Voluntário não encontrado');
    const volunteer = await res.json();
    displayVolunteer(volunteer);
  } catch (err) {
    container.innerHTML = `<p class="text-danger">Erro: ${err.message}</p>`;
    console.error(err);
  }
});

// Mostrar voluntário com campos editáveis e botões
function displayVolunteer(volunteer) {
  const container = document.getElementById('volunteersResults');
 container.innerHTML = `
  <div class="card p-3 mb-3 user-card">
    <h4>Voluntário ID: ${volunteer.id}</h4>

    <div class="mb-2">
      <label class="form-label">Nome:</label>
      <input type="text" class="form-control name" value="${volunteer.name}">
    </div>

    <div class="mb-2">
      <label class="form-label">Email:</label>
      <input type="email" class="form-control email" value="${volunteer.email}">
    </div>

    <div class="mb-3">
      <label class="form-label">Função:</label>
      <input type="text" class="form-control role" value="${volunteer.role}">
    </div>

    <div class="row">
      <div class="col-auto">
        <button class="btn btn-success me-2" onclick="editVolunteer(${volunteer.id}, this)">Salvar</button>
      </div>
      <div class="col-auto">
        <button class="btn btn-danger" onclick="deleteVolunteer(${volunteer.id})">Deletar</button>
      </div>
    </div>
  </div>
`;
}
// Editar voluntário
window.editVolunteer = async function(id, btn) {
  const card = btn.closest('.user-card');
  const name = card.querySelector('.name').value.trim();
  const email = card.querySelector('.email').value.trim();
  const role = card.querySelector('.role').value.trim();

  if (!name) {
    alert('O nome é obrigatório!');
    return;
  }

  try {
    const res = await fetch(`https://amigopet.onrender.com/volunteers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, role })
    });

    if (res.ok) {
      alert('Voluntário atualizado com sucesso!');
    } else {
      const data = await res.json();
      alert('Erro ao atualizar: ' + (data.error || 'Erro desconhecido'));
    }
  } catch (error) {
    alert('Erro ao atualizar voluntário.');
    console.error(error);
  }
};

// Deletar voluntário
window.deleteVolunteer = async function(id) {
  if (!confirm("Tem certeza que deseja deletar este voluntário?")) return;

  try {
    const res = await fetch(`https://amigopet.onrender.com/volunteers/${id}`, { method: 'DELETE' });

    if (res.ok) {
      alert('Voluntário deletado com sucesso!');
      document.getElementById('volunteersResults').innerHTML = '';
    } else {
      const data = await res.json();
      alert('Erro ao deletar: ' + (data.error || 'Erro desconhecido'));
    }
  } catch (error) {
    alert('Erro ao deletar voluntário.');
    console.error(error);
  }
};

document.getElementById("newsForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const titulo = document.getElementById("newsTitle").value.trim();
  const imagem = document.getElementById("newsImage").value.trim();
  const descricao = document.getElementById("newsDescription").value.trim();
  const link = document.getElementById("newsLink").value.trim();

  console.log("Dados que vão pro back:", { titulo, imagem, descricao, link });

  try {
    const response = await fetch("https://amigopet.onrender.com/noticias/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, imagem, descricao, link })
    });

    if (response.ok) {
      document.getElementById("newsMessage").innerHTML =
        `<div class="alert alert-success">Notícia cadastrada com sucesso!</div>`;
      document.getElementById("newsForm").reset();
    } else {
      const err = await response.json();
      document.getElementById("newsMessage").innerHTML =
        `<div class="alert alert-danger">Erro: ${err.error || "Falha ao salvar notícia"}</div>`;
    }
  } catch (error) {
    console.error("Erro:", error);
    document.getElementById("newsMessage").innerHTML =
      `<div class="alert alert-danger">Erro ao salvar notícia: ${error.message}</div>`;
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
