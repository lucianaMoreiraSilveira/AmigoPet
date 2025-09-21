document.getElementById('forgotPasswordForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const messageDiv = document.getElementById('message');

  try {
    const response = await fetch('/api/request-reset', {  // seu endpoint backend
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (response.ok) {
      messageDiv.innerHTML = `<div class="alert alert-success">${data.message}</div>`;
      setTimeout(() => {
        window.location.href = 'redefinir-senha.html';
      }, 2000);
    } else {
      messageDiv.innerHTML = `<div class="alert alert-danger">${data.error}</div>`;
    }

  } catch (err) {
    messageDiv.innerHTML = `<div class="alert alert-danger">Erro ao enviar email</div>`;
    console.error(err);
  }
});
