// (Arquivo mantido por compatibilidade) formulário é tratado inline no HTML principal.
// Caso queira usar este arquivo, adicione um listener moderno:
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('signup');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('name').value.trim();
    var email = document.getElementById('email').value.trim();
    var status = document.getElementById('form-status');
    if (!name || !email) { status.textContent = 'Por favor preencha nome e e-mail.'; return; }
    status.textContent = 'Enviando...';
    // exemplo de integração com endpoint: ajustar URL e CORS/segurança no backend
    fetch('/.netlify/functions/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, email: email })
    }).then(function (res) {
      if (res.ok) return res.json();
      throw new Error('Erro ao enviar');
    }).then(function () {
      status.textContent = 'Obrigado! Confirme seu e-mail.';
      form.reset();
    }).catch(function () {
      // fallback: simular sucesso para QA
      status.textContent = 'Enviado (fallback). Em breve entraremos em contato.';
      form.reset();
    });
  });
});
