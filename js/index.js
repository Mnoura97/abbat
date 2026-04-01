// ── Toggle mot de passe ─────────────────────────────────────
const passwordInput = document.getElementById('password');
const toggleBtn     = document.getElementById('togglePassword');
const eyeOpen       = document.getElementById('eyeOpen');
const eyeClosed     = document.getElementById('eyeClosed');

toggleBtn.addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';
  eyeOpen.classList.toggle('hidden');
  eyeClosed.classList.toggle('hidden');
});

// ── Soumission du formulaire ─────────────────────────────────
const form    = document.getElementById('loginForm');
const btn     = document.getElementById('loginBtn');
const btnText = document.getElementById('btnText');
const spinner = document.getElementById('spinner');

// Message d'erreur (créé dynamiquement)
function showError(msg) {
  let el = document.getElementById('loginError');
  if (!el) {
    el = document.createElement('p');
    el.id = 'loginError';
    el.style.cssText = 'color:#f97316;font-size:0.9rem;text-align:center;margin-top:-0.5rem;';
    form.insertBefore(el, btn);
  }
  el.textContent = msg;
}

function clearError() {
  const el = document.getElementById('loginError');
  if (el) el.textContent = '';
}

form.addEventListener('submit', async function(e) {
  e.preventDefault();
  clearError();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  // UI → état chargement
  btn.disabled = true;
  btnText.classList.add('hidden');
  spinner.classList.remove('hidden');

  try {
    const response = await fetch('php/traitement-login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (data.success) {
      // Redirige vers la page d'accueil
      window.location.href = data.redirect || 'home.html';
    } else {
      showError(data.message || 'Identifiants incorrects.');
    }

  } catch (err) {
    showError('Impossible de contacter le serveur. Vérifiez que WAMP est démarré.');
    console.error(err);
  } finally {
    btn.disabled = false;
    btnText.classList.remove('hidden');
    spinner.classList.add('hidden');
  }
});
