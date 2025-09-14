 document.getElementById('forgotPasswordForm').addEventListener('submit', async function(e) {
      e.preventDefault();

      const email = document.getElementById('email').value;
      const messageDiv = document.getElementById('message');
      
      try {
        const response = await fetch('https://amigopet-1.onrender.com/forgot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
          messageDiv.innerHTML = `<div class="alert alert-success">${data.message}</div>`;
          localStorage.setItem('emailParaRedefinir', email);

          setTimeout(() => {
            window.location.href = 'redefinir-senha.html';
          }, 2000);
        } else {
          messageDiv.innerHTML = `<div class="alert alert-danger">${data.error || 'Erro ao enviar e-mail.'}</div>`;
        }

      } catch (err) {
        messageDiv.innerHTML = `<div class="alert alert-danger">Erro ao enviar o link de redefinição de senha.</div>`;
      }
    });