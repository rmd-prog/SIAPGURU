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

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const nip = nipInput.value.trim();
    const password = passwordInput.value;

    if (!nip || !password) {
      loginMessage.textContent = 'NIP dan kata sandi wajib diisi.';
      loginMessage.className = 'login-message error';
      (!nip ? nipInput : passwordInput).focus();
      return;
    }

    loginMessage.textContent = 'Akun guru akan diproses melalui autentikasi server.';
    loginMessage.className = 'login-message info';
  });
});
