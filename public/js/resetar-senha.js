 const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('access_token'); // token enviado pelo Supabase
  document.getElementById('token').value = token;

  document.getElementById('resetPasswordForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const newPassword = document.getElementById('newPassword').value.trim();
    const messageDiv = document.getElementById('message');

    if (!newPassword) {
      messageDiv.innerHTML = `<div class="alert alert-warning">Digite a nova senha.</div>`;
      return;
    }

    try {
      const response = await fetch('https://amigopet.onrender.com/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: newPassword })
      });

      const data = await response.json();

      if (response.ok) {
        messageDiv.innerHTML = `<div class="alert alert-success">${data.message}</div>`;
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 2000);
      } else {
        messageDiv.innerHTML = `<div class="alert alert-danger">${data.error || 'Erro na redefinição.'}</div>`;
      }
    } catch (err) {
      console.error(err);
      messageDiv.innerHTML = `<div class="alert alert-danger">Erro ao redefinir a senha.</div>`;
    }
  });