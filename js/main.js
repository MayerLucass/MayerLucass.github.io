const navbar = document.querySelector('.navbar');

const updateNavbar = () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 24);
};

updateNavbar();
window.addEventListener('scroll', updateNavbar, { passive: true });

document.querySelectorAll('[data-current-year]').forEach((year) => {
  year.textContent = new Date().getFullYear();
});

document.querySelectorAll('.navbar-collapse .nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    const menu = document.querySelector('.navbar-collapse.show');
    if (menu && window.bootstrap) {
      window.bootstrap.Collapse.getOrCreateInstance(menu).hide();
    }
  });
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const contactForm = document.querySelector('#contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }
    const button = contactForm.querySelector('.submit-btn');
    const buttonText = button.querySelector('[data-button-text]');
    const status = contactForm.querySelector('.form-status');
    const originalText = buttonText.textContent;

    button.disabled = true;
    buttonText.textContent = 'Enviando...';
    status.textContent = '';
    status.className = 'form-status';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) throw new Error('No se pudo enviar el formulario.');

      contactForm.reset();
      status.textContent = '¡Mensaje enviado! Te responderé lo antes posible.';
      status.classList.add('success');
      buttonText.textContent = 'Mensaje enviado';

      window.setTimeout(() => {
        buttonText.textContent = originalText;
        button.disabled = false;
      }, 2400);
    } catch (error) {
      status.textContent = 'No se pudo enviar el mensaje. También podés escribirme por WhatsApp.';
      status.classList.add('error');
      buttonText.textContent = originalText;
      button.disabled = false;
    }
  });
}
