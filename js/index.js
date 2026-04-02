// =============================================
// AB.BAT — Login (Supabase)
// =============================================

document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const btn      = document.getElementById('loginBtn');
  const btnText  = document.getElementById('btnText');
  const spinner  = document.getElementById('spinner');

  btn.disabled = true;
  btnText.style.display = 'none';
  spinner.classList.remove('hidden');

  try {
    const SUPABASE_URL = 'https://evswmrofxjiygrezobwu.supabase.co';
    const SUPABASE_KEY = 'sb_publishable_UNLWlnZdQaNtKs2N-U_rLQ_d56nqHEX';
    const { createClient } = supabase;
    const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Récupérer l'utilisateur par username
    const { data: users, error } = await sb
      .from('users')
      .select('*')
      .eq('username', username)
      .limit(1);

    if (error || !users || users.length === 0) {
      showError('Nom d\'utilisateur ou mot de passe incorrect.');
      return;
    }

    const user = users[0];

    // Vérifier le mot de passe avec bcrypt (via API)
    const ok = await verifyPassword(password, user.password_hash);
    if (!ok) {
      showError('Nom d\'utilisateur ou mot de passe incorrect.');
      return;
    }

    // Sauvegarder la session
    localStorage.setItem('abbat_session', JSON.stringify({
      id: user.id,
      username: user.username,
      role: user.role
    }));

    window.location.href = 'dashboard.html';

  } catch (err) {
    showError('Erreur de connexion. Réessayez.');
    console.error(err);
  } finally {
    btn.disabled = false;
    btnText.style.display = '';
    spinner.classList.add('hidden');
  }
});

// Vérification bcrypt côté client via une fonction simple
// On utilise une comparaison via l'API Supabase Edge ou bcryptjs
async function verifyPassword(password, hash) {
  // Charger bcryptjs dynamiquement
  if (typeof dcodeIO === 'undefined') {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/bcryptjs/2.4.3/bcrypt.min.js');
  }
  return dcodeIO.bcrypt.compareSync(password, hash);
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src; s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
}

function showError(msg) {
  let el = document.getElementById('loginError');
  if (!el) {
    el = document.createElement('div');
    el.id = 'loginError';
    el.style.cssText = 'color:#f43f5e;font-size:13px;text-align:center;margin-top:12px;padding:10px;background:rgba(244,63,94,.1);border-radius:8px;border:1px solid rgba(244,63,94,.2)';
    document.getElementById('loginForm').appendChild(el);
  }
  el.textContent = msg;
  const btn = document.getElementById('loginBtn');
  btn.disabled = false;
  document.getElementById('btnText').style.display = '';
  document.getElementById('spinner').classList.add('hidden');
}

// Toggle password
document.getElementById('togglePassword').addEventListener('click', function() {
  const input = document.getElementById('password');
  const open  = document.getElementById('eyeOpen');
  const closed = document.getElementById('eyeClosed');
  if (input.type === 'password') {
    input.type = 'text';
    open.classList.add('hidden');
    closed.classList.remove('hidden');
  } else {
    input.type = 'password';
    open.classList.remove('hidden');
    closed.classList.add('hidden');
  }
});
