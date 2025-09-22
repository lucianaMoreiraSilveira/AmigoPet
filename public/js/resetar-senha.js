document.getElementById('resetPasswordForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  // Pega o token automaticamente da URL
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');

  const newPassword = document.getElementById('newPassword').value.trim();
  const messageDiv = document.getElementById('message');

  if (!token || !newPassword) {
    messageDiv.innerHTML = `<div class="alert alert-warning">Token inválido ou senha vazia.</div>`;
    return;
  }

  try {
    const response = await fetch('https://amigopet.onrender.com/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }) // mantém `newPassword`
    });

    const data = await response.json();

    if (response.ok) {
      messageDiv.innerHTML = `<div class="alert alert-success">${data.message}</div>`;
      document.getElementById('resetPasswordForm').reset();
    } else {
      messageDiv.innerHTML = `<div class="alert alert-danger">${data.error || 'Erro na redefinição.'}</div>`;
    }
  } catch (err) {
    console.error(err);
    messageDiv.innerHTML = `<div class="alert alert-danger">Erro ao redefinir a senha.</div>`;
  }
});
