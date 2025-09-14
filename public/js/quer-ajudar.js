document.getElementById('volunteerForm').addEventListener('submit', async function (e) {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const role = document.getElementById('role').value;
      const formMessage = document.getElementById('formMessage');

      try {
        const res = await fetch('https://amigopet-1.onrender.com/volunteers/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, role })
        });

        const data = await res.json();
        if (res.ok) {
          formMessage.innerHTML = `<div class="alert alert-success">Obrigado por se cadastrar! 🐾</div>`;
        } else {
          formMessage.innerHTML = `<div class="alert alert-danger">${data.error}</div>`;
        }
      } catch (err) {
        formMessage.innerHTML = `<div class="alert alert-danger">Erro ao enviar formulário.</div>`;
      }
    });

    

      const qrCodeData = "https://amigopet.com.br"; // coloque o link, pix ou texto aqui
  QRCode.toCanvas(
    document.getElementById("qrcode"),
    qrCodeData,
    { width: 200, color: { dark: "#000000", light: "#ffffff" } },
    function (error) {
      if (error) console.error(error);
    }
  );