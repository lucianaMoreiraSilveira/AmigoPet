document.getElementById('forgotPasswordForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const messageDiv = document.getElementById('message');

  try {
    const res = await fetch('https://amigopet.onrender.com/request-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();

    if (res.ok) {
      messageDiv.innerHTML = `<div style="color:green;">${data.message}</div>`;
    } else {
      messageDiv.innerHTML = `<div style="color:red;">${data.error}</div>`;
    }
  } catch (err) {
    messageDiv.innerHTML = `<div style="color:red;">Erro ao enviar email</div>`;
    console.error(err);
  }
});