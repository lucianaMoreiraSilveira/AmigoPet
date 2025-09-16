document.getElementById('forgotPasswordForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const messageDiv = document.getElementById('message');

  try {
    const response = await fetch('https://amigopet.onrender.com/request-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    // Mensagem genérica por segurança
    messageDiv.innerHTML = `<div class="alert alert-success">${data.message}</div>`;

    setTimeout(() => {
      // Redireciona para a página de redefinição de senha
      window.location.href = 'redefinir-senha.html';
    }, 2000);

  } catch (err) {
    console.error(err);
    messageDiv.innerHTML = `<div class="alert alert-danger">Erro ao enviar o link de redefinição de senha.</div>`;
  }
});
