document.addEventListener('DOMContentLoaded', () => {
  const logoutButton = document.getElementById('logoutButton');
  logoutButton?.addEventListener('click', () => {
    window.location.href = 'login.html';
  });
});
