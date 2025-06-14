document.addEventListener('DOMContentLoaded', () => {
  // Inject header & footer partials
  ['header', 'footer'].forEach(part => {
    const placeholder = document.getElementById(`include-${part}`);
    if (placeholder) {
      fetch(`partials/${part}.html`)
        .then(res => res.text())
        .then(html => {
          placeholder.innerHTML = html;
          if (part === 'header') initNavToggle();
        });
    }
  });

  function initNavToggle() {
    const toggleBtn = document.getElementById('custom-btn');
    const nav = document.getElementById('navbar');
    const closeBtn = document.querySelector('.close-btn');
    if (!toggleBtn || !nav) return;
    toggleBtn.addEventListener('click', () => nav.classList.toggle('show'));
    if (closeBtn) closeBtn.addEventListener('click', () => nav.classList.remove('show'));
  }
});
