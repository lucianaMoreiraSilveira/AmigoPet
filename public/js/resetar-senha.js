document.getElementById('resetPasswordForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const token = document.getElementById('token').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    const messageDiv = document.getElementById('message');

    if (!token || !newPassword) {
      messageDiv.innerHTML = `<div class="alert alert-warning">Preencha todos os campos.</div>`;
      return;
    }

    try {
      const response = await fetch('https://amigopet.onrender.com/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password: newPassword }), // <- ALTERADO AQUI
      });

      const data = await response.json();

      if (response.ok) {
        messageDiv.innerHTML = `<div class="alert alert-success">${data.message}</div>`;
      } else {
        messageDiv.innerHTML = `<div class="alert alert-danger">${data.error || 'Erro na redefinição.'}</div>`;
      }
    } catch (err) {
      console.error(err); // Para debug
      messageDiv.innerHTML = `<div class="alert alert-danger">Erro ao redefinir a senha.</div>`;
    }
  });