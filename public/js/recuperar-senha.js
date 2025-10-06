 const API_URL = "https://amigopet.onrender.com";

  document.getElementById('forgotPasswordForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = '';

    try {
      const response = await fetch(`${API_URL}/request-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        messageDiv.innerHTML = `
          <div class="alert alert-success">
            ${data.message}.<br> Verifique sua caixa de entrada.
          </div>`;
      } else {
        messageDiv.innerHTML = `
          <div class="alert alert-danger">
            ${data.error || 'Erro ao enviar e-mail.'}
          </div>`;
      }
    } catch (err) {
      console.error(err);
      messageDiv.innerHTML = `
        <div class="alert alert-danger">
          Não foi possível conectar ao servidor. Tente novamente em alguns segundos.
        </div>`;
    }
  });