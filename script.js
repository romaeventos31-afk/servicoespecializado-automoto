/* =========================================================
   AUTO MOTO ESCOLA AVENIDA — script.js
   Autor: DeepSeek (Dev Sênior)
   Módulos:
   1. Menu Mobile (toggle + fechar ao clicar em link)
   2. Header com sombra ao rolar
   3. Contadores animados no Hero (IntersectionObserver)
   4. Reveal on Scroll (animações de entrada)
   5. Smooth Scroll (fallback para navegadores antigos)
   6. Máscara de telefone no formulário
   7. Validação e envio do formulário de contato
   8. Modal de Política de Privacidade (abrir/fechar, ESC, clique fora)
   9. Ano automático no footer
   ========================================================= */

(function () {
  'use strict';

  /* =========================================================
     1. MENU MOBILE
     ========================================================= */
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');

  function closeMenu() {
    if (!nav || !menuToggle) return;
    nav.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    const icon = menuToggle.querySelector('i');
    if (icon) icon.className = 'fa-solid fa-bars';
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isActive = nav.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', String(isActive));
      const icon = menuToggle.querySelector('i');
      if (icon) {
        icon.className = isActive ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      }
    });

    // Fecha ao clicar em qualquer link do menu
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Fecha ao clicar fora do menu
    document.addEventListener('click', (e) => {
      if (
        nav.classList.contains('active') &&
        !nav.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        closeMenu();
      }
    });
  }

  /* =========================================================
     2. HEADER COM SOMBRA AO ROLAR
     ========================================================= */
  const header = document.getElementById('header');

  function handleHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 30) {
      header.style.boxShadow = '0 8px 24px rgba(0,0,0,0.10)';
    } else {
      header.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
    }
  }
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* =========================================================
     3. CONTADORES ANIMADOS (HERO)
     ========================================================= */
  const counters = document.querySelectorAll('.hero__stats strong[data-count]');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1800; // ms
    const startTime = performance.now();

    // Formata número com separador de milhar
    function formatNumber(n) {
      return n.toLocaleString('pt-BR');
    }

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = formatNumber(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = formatNumber(target);
      }
    }

    requestAnimationFrame(update);
  }

  if (counters.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));
  } else {
    // Fallback: define valor final diretamente
    counters.forEach((el) => {
      el.textContent = parseInt(el.getAttribute('data-count'), 10).toLocaleString('pt-BR');
    });
  }

  /* =========================================================
     4. REVEAL ON SCROLL
     ========================================================= */
  const revealTargets = document.querySelectorAll(
    '.section__head, .card, .diferencial, .sobre__text, .sobre__card, .info-card, .contato__form'
  );

  revealTargets.forEach((el) => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: mostra tudo
    revealTargets.forEach((el) => el.classList.add('visible'));
  }

  /* =========================================================
     5. SMOOTH SCROLL (fallback para navegadores antigos)
     ========================================================= */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      const headerHeight = header ? header.offsetHeight : 0;
      const targetPosition =
        targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    });
  });

  /* =========================================================
     6. MÁSCARA DE TELEFONE
     ========================================================= */
  const telefoneInput = document.getElementById('telefone');

  function maskPhone(value) {
    value = value.replace(/\D/g, '').slice(0, 11);

    if (value.length === 0) return '';
    if (value.length <= 2) return `(${value}`;
    if (value.length <= 6) return `(${value.slice(0, 2)}) ${value.slice(2)}`;
    if (value.length <= 10)
      return `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
    return `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
  }

  if (telefoneInput) {
    telefoneInput.addEventListener('input', (e) => {
      e.target.value = maskPhone(e.target.value);
    });
  }

  /* =========================================================
     7. FORMULÁRIO DE CONTATO
     ========================================================= */
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');

  function setFeedback(message, type) {
    if (!feedback) return;
    feedback.textContent = message;
    feedback.className = 'form-feedback ' + (type || '');
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validateForm() {
    const nome = document.getElementById('nome');
    const email = document.getElementById('email');
    const telefone = document.getElementById('telefone');
    const curso = document.getElementById('curso');
    const mensagem = document.getElementById('mensagem');

    if (!nome.value.trim() || nome.value.trim().length < 3) {
      setFeedback('Por favor, informe seu nome completo.', 'error');
      nome.focus();
      return false;
    }

    if (!validateEmail(email.value.trim())) {
      setFeedback('Por favor, informe um e-mail válido.', 'error');
      email.focus();
      return false;
    }

    const telDigits = telefone.value.replace(/\D/g, '');
    if (telDigits.length < 10) {
      setFeedback('Por favor, informe um telefone válido com DDD.', 'error');
      telefone.focus();
      return false;
    }

    if (!curso.value) {
      setFeedback('Selecione o curso de interesse.', 'error');
      curso.focus();
      return false;
    }

    if (!mensagem.value.trim() || mensagem.value.trim().length < 10) {
      setFeedback('Escreva uma mensagem com pelo menos 10 caracteres.', 'error');
      mensagem.focus();
      return false;
    }

    return true;
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!validateForm()) return;

      // Simulação de envio (substituir por fetch para API real)
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalHTML = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
      setFeedback('', '');

      setTimeout(() => {
        // Aqui você faria:
        // fetch('https://sua-api.com/contato', { method: 'POST', body: new FormData(form) })
        //   .then(...)

        setFeedback(
          '✅ Mensagem enviada com sucesso! Entraremos em contato em breve.',
          'success'
        );
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
        form.reset();

        // Limpa o feedback após 6s
        setTimeout(() => setFeedback('', ''), 6000);
      }, 1400);
    });
  }

  /* =========================================================
     8. MODAL POLÍTICA DE PRIVACIDADE
     ========================================================= */
  const policyModal = document.getElementById('policyModal');
  const openPolicyBtn = document.getElementById('openPolicy');
  const closePolicyBtn = document.getElementById('closePolicy');

  function openPolicyModal() {
    if (!policyModal) return;
    policyModal.classList.add('active');
    policyModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (closePolicyBtn) closePolicyBtn.focus();
  }

  function closePolicyModal() {
    if (!policyModal) return;
    policyModal.classList.remove('active');
    policyModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (openPolicyBtn) openPolicyBtn.focus();
  }

  if (openPolicyBtn) openPolicyBtn.addEventListener('click', openPolicyModal);
  if (closePolicyBtn) closePolicyBtn.addEventListener('click', closePolicyModal);

  if (policyModal) {
    // Fecha ao clicar no backdrop
    policyModal.querySelectorAll('[data-close-modal]').forEach((el) => {
      el.addEventListener('click', closePolicyModal);
    });

    // Fecha com ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && policyModal.classList.contains('active')) {
        closePolicyModal();
      }
    });

    // Focus trap básico
    policyModal.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusable = policyModal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  /* =========================================================
     9. ANO AUTOMÁTICO NO FOOTER
     ========================================================= */
  const anoAtual = document.getElementById('anoAtual');
  if (anoAtual) anoAtual.textContent = new Date().getFullYear();

  /* =========================================================
     LOG DE BOAS-VINDAS (remover em produção se preferir)
     ========================================================= */
  console.log(
    '%c🚗 Auto Moto Escola Avenida',
    'font-size:16px; font-weight:bold; color:#0B6E4F;'
  );
  console.log(
    '%c29 anos formando condutores com segurança. 💚',
    'color:#0077B6;'
  );
})();
