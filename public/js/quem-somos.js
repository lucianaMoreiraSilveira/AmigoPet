document.getElementById('volunteerForm').addEventListener('submit', async function (e) {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const role = document.getElementById('role').value;
      const formMessage = document.getElementById('formMessage');

      try {
        const res = await fetch('http://localhost:8080/volunteers/register', {
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

    // Gerando o QR Code Pix (só a chave - não EMV)
    const qrCodeData = '00020126360014BR.GOV.BCB.PIX0111889930702955204000053039865802BR5920Ajuda Animal6009Fortaleza62070503***6304E4F5';
    QRCode.toCanvas(document.getElementById('qrcode'), qrCodeData, function (error) {
      if (error) console.error(error);
    });