document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const nipInput = document.getElementById('nip');
  const passwordInput = document.getElementById('password');
  const togglePassword = document.getElementById('togglePassword');
  const loginMessage = document.getElementById('loginMessage');

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

    loginMessage.textContent = 'Memeriksa akun guru...';
    loginMessage.className = 'login-message info';

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ nip, password })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || data.error || 'NIP atau kata sandi tidak valid.');
      }

      if (data.token) {
        sessionStorage.setItem('siap_guru_token', data.token);
      }
      if (data.user) {
        sessionStorage.setItem('siap_guru_user', JSON.stringify(data.user));
      }

      loginMessage.textContent = 'Login berhasil. Membuka ruang kerja guru...';
      loginMessage.className = 'login-message success';

      window.location.href = 'index.html';
    } catch (error) {
      loginMessage.textContent = error.message || 'Login gagal. Periksa koneksi atau akun guru.';
      loginMessage.className = 'login-message error';
    }
  });
});
