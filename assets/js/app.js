(() => {
  'use strict';

  const button = document.getElementById('checkButton');
  const result = document.getElementById('checkResult');

  if (!button || !result) return;

  button.addEventListener('click', () => {
    result.textContent = 'Sistem dasar SIAP GURU aktif ✓';
  });
})();
