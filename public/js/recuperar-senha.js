import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

  // Inicialize o Supabase
  const supabaseUrl = 'https://SEU_SUPABASE_URL';
  const supabaseAnonKey = 'SUA_CHAVE_ANON';
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const form = document.getElementById('forgotPasswordForm');
  const messageDiv = document.getElementById('message');

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    messageDiv.innerHTML = '';

    const email = document.getElementById('email').value.trim();
    if (!email) {
      messageDiv.innerHTML = `<div class="alert alert-warning">Digite seu e-mail.</div>`;
      return;
    }

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://amigopet.onrender.com/redefinir-senha.html'
      });

      if (error) {
        messageDiv.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
      } else {
        messageDiv.innerHTML = `<div class="alert alert-success">E-mail de redefinição enviado! Verifique sua caixa de entrada.</div>`;
      }
    } catch (err) {
      console.error(err);
      messageDiv.innerHTML = `<div class="alert alert-danger">Erro ao enviar o e-mail.</div>`;
    }
  });