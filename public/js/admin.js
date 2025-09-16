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
  container.innerHTML = '';

  try {
    let res;
    if (id) {
      // busca por ID
      res = await fetch(`https://amigopet.onrender.com/user/${id}/all`);
    } else if (name) {
      // busca por nome
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

    const users = Array.isArray(data) ? data : [data]; 
    users.forEach(displayUser);

  } catch (err) {
    container.innerHTML = `<p class="text-danger">Erro: ${err.message}</p>`;
  }
});


  function displayUser(user) {
    const container = document.getElementById('userResults');
    container.innerHTML = '';

    const div = document.createElement('div');
    div.className = 'col-md-6';
    div.innerHTML = `
      <div class="user-card">
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
        <button class="btn btn-success me-2" onclick="editarUsuario(${user.id}, this)">Salvar</button>
        <button class="btn btn-danger" onclick="deletarUsuario(${user.id})">Excluir</button>
      </div>
    `;

    container.appendChild(div);
  }

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

  window.deletarUsuario = async function(id) {
    if (!confirm("Tem certeza que deseja deletar este usuário?")) return;

    try {
      const res = await fetch(`https://amigopet.onrender.com/user/${id}`, { method: 'DELETE' });

      if (res.ok) {
        alert('Usuário deletado com sucesso!');
        document.getElementById('userResults').innerHTML = '';
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
