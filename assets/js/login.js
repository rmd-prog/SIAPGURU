document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const nipInput = document.getElementById('nip');
  const passwordInput = document.getElementById('password');
  const togglePassword = document.getElementById('togglePassword');
  const loginMessage = document.getElementById('loginMessage');
  const API_BASE = 'https://siapguru.adm-sd.workers.dev/api';

  if (togglePassword) {
    togglePassword.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      togglePassword.textContent = isPassword ? 'Sembunyikan' : 'Tampilkan';
      togglePassword.setAttribute('aria-pressed', String(isPassword));
    });
  }

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const nip = nipInput.value.trim();
    const password = passwordInput.value;

    if (!nip || !password) {
      loginMessage.textContent = 'NIP dan kata sandi wajib diisi.';
      loginMessage.className = 'login-message error';
      (!nip ? nipInput : passwordInput).focus();
      return;
    }

    const submitButton = form.querySelector('.login-submit');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Memproses...';
    }
    loginMessage.textContent = 'Memeriksa akun guru...';
    loginMessage.className = 'login-message info';

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nip, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.ok) {
        throw new Error(data.message || 'NIP atau kata sandi salah.');
      }

      sessionStorage.setItem('siapguru_user', JSON.stringify(data.user));
      loginMessage.textContent = `Selamat datang, ${data.user?.nama || 'Guru'}.`;
      loginMessage.className = 'login-message success';

      window.location.href = 'index.html';
    } catch (error) {
      loginMessage.textContent = error?.message || 'Login gagal. Coba lagi.';
      loginMessage.className = 'login-message error';
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Masuk ke SIAP GURU';
      }
    }
  });
});
