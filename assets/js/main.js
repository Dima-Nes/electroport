/**
 * ООО «Электропорт» — Интерактивный функционал сайта
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initEstimatorCalc();
  initPortfolioFilter();
  initFaqAccordion();
  initModals();
  initLeadForms();
});

/* ==========================================================================
   Мобильное меню и плавная навигация
   ========================================================================== */
function initMobileNav() {
  const burgerBtn = document.getElementById('burgerBtn');
  const siteNav = document.getElementById('siteNav');
  const navLinks = document.querySelectorAll('.site-nav__link');

  if (burgerBtn && siteNav) {
    burgerBtn.addEventListener('click', () => {
      const header = document.querySelector('.site-header');
      if (header) document.documentElement.style.setProperty('--header-bottom', Math.max(0, header.getBoundingClientRect().bottom) + 'px');
      siteNav.classList.toggle('mobile-active');
      const isOpen = siteNav.classList.contains('mobile-active');
      document.documentElement.classList.toggle('nav-open', isOpen);
      burgerBtn.setAttribute('aria-expanded', isOpen);
      burgerBtn.textContent = isOpen ? '✕' : '☰';
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('mobile-active');
        document.documentElement.classList.remove('nav-open');
        burgerBtn.setAttribute('aria-expanded', false);
        burgerBtn.textContent = '☰';
      });
    });
  }
}

/* ==========================================================================
   Интерактивный сметный калькулятор
   ========================================================================== */
function initEstimatorCalc() {
  const form = document.getElementById('calcForm');
  if (!form) return;

  const totalEl = document.getElementById('calcTotalVal');
  const smrEl = document.getElementById('calcSmrVal');
  const cableEl = document.getElementById('calcCableVal');
  const civilEl = document.getElementById('calcCivilVal');
  const pnrEl = document.getElementById('calcPnrVal');

  function calculate() {
    // Получение выбранных значений
    const power = form.querySelector('input[name="power"]:checked')?.value || 'dc120';
    const ports = parseInt(form.querySelector('input[name="ports"]:checked')?.value || '4', 10);
    const dist = form.querySelector('input[name="dist"]:checked')?.value || '100';
    const hasGnb = form.querySelector('input[name="gnb"]')?.checked;
    const hasSubstation = form.querySelector('input[name="substation"]')?.checked;

    // Базовые ставки СМР в РБ (в белорусских рублях BYN)
    let baseSmr = 6500;
    let baseCable = 8500;
    let baseCivil = 4200;
    let basePnr = 2400;

    // Модификаторы мощности
    if (power === 'ac22') {
      baseSmr = 2800 * (ports / 2);
      baseCivil = 1800 * (ports / 2);
      basePnr = 1200;
    } else if (power === 'dc120') {
      baseSmr = 7500 + (ports - 2) * 2200;
      baseCivil = 4800 + (ports - 2) * 1100;
      basePnr = 2490;
    } else if (power === 'hub360') {
      baseSmr = 14500 + (ports - 2) * 2800;
      baseCivil = 8500 + (ports - 2) * 1400;
      basePnr = 3600;
    }

    // Длина кабельной трассы
    if (dist === '50') {
      baseCable = (power === 'ac22' ? 3200 : 7500);
    } else if (dist === '100') {
      baseCable = (power === 'ac22' ? 6400 : 16500);
    } else if (dist === '200') {
      baseCable = (power === 'ac22' ? 12800 : 29500);
    }

    // Бестраншейный прокол ГНБ под дорогой
    if (hasGnb) {
      baseSmr += 6800; // Прокол 2х25м + трубы ПЭ + котлованы
    }

    // Модернизация ячейки ТП / установка автомата
    if (hasSubstation) {
      baseSmr += 3200;
    }

    const total = baseSmr + baseCable + baseCivil + basePnr;

    // Форматирование чисел с пробелами
    const fmt = n => Math.round(n).toLocaleString('ru-RU') + ' BYN';

    if (totalEl) totalEl.textContent = fmt(total);
    if (smrEl) smrEl.textContent = fmt(baseSmr);
    if (cableEl) cableEl.textContent = fmt(baseCable);
    if (civilEl) civilEl.textContent = fmt(baseCivil);
    if (pnrEl) pnrEl.textContent = fmt(basePnr);
  }

  form.addEventListener('change', calculate);
  calculate(); // Первый запуск
}

/* ==========================================================================
   Фильтрация портфолио
   ========================================================================== */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; }, 20);
        } else {
          card.style.opacity = '0';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   Аккордеон FAQ
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (question && answer) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Закрыть другие элементы
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherAns = otherItem.querySelector('.faq-answer');
            if (otherAns) otherAns.style.maxHeight = null;
          }
        });

        if (isActive) {
          item.classList.remove('active');
          answer.style.maxHeight = null;
        } else {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 40 + 'px';
        }
      });
    }
  });
}

/* ==========================================================================
   Модальные окна
   ========================================================================== */
function initModals() {
  const modalOverlay = document.getElementById('leadModalOverlay');
  const openModalBtns = document.querySelectorAll('[data-open-modal]');
  const closeModalBtns = document.querySelectorAll('.modal-close-btn');

  function openModal(titleText = 'Заказать расчет сметы') {
    if (!modalOverlay) return;
    const modalTitle = modalOverlay.querySelector('.modal-title');
    if (modalTitle && titleText) {
      modalTitle.textContent = titleText;
    }
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const customTitle = btn.getAttribute('data-modal-title') || 'Заказать расчет сметы по проекту';
      openModal(customTitle);
    });
  });

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay?.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   Обработка отправки форм и Drag&Drop файлов
   ========================================================================== */
function initLeadForms() {
  const forms = document.querySelectorAll('.lead-form, #modalForm');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const phoneInput = form.querySelector('input[type="tel"]');
      if (phoneInput && !phoneInput.value.trim()) {
        alert('Пожалуйста, укажите ваш контактный номер телефона.');
        phoneInput.focus();
        return;
      }

      // Симуляция успешной отправки заявки
      showToast('Заявка успешно отправлена! Инженер свяжется с вами в течение 1 рабочего часа.');
      form.reset();

      // Закрыть модальное окно если форма была в нем
      const modalOverlay = document.getElementById('leadModalOverlay');
      if (modalOverlay && modalOverlay.classList.contains('active')) {
        setTimeout(() => {
          modalOverlay.classList.remove('active');
          document.body.style.overflow = '';
        }, 800);
      }
    });
  });

  // Drag & drop файлов для проектной документации
  const dropZones = document.querySelectorAll('.form-file-drop');
  dropZones.forEach(zone => {
    const fileInput = zone.querySelector('input[type="file"]');
    const textEl = zone.querySelector('.form-file-drop__text');

    zone.addEventListener('click', () => {
      if (fileInput) fileInput.click();
    });

    if (fileInput) {
      fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
          const names = Array.from(fileInput.files).map(f => f.name).join(', ');
          if (textEl) textEl.innerHTML = `<strong style="color:var(--color-accent-cyan)">Выбрано:</strong> ${names}`;
        }
      });
    }

    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zone.style.borderColor = 'var(--color-accent-cyan)';
    });

    zone.addEventListener('dragleave', () => {
      zone.style.borderColor = '';
    });

    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.style.borderColor = '';
      if (e.dataTransfer.files.length > 0 && fileInput) {
        fileInput.files = e.dataTransfer.files;
        const names = Array.from(fileInput.files).map(f => f.name).join(', ');
        if (textEl) textEl.innerHTML = `<strong style="color:var(--color-accent-cyan)">Прикреплено:</strong> ${names}`;
      }
    });
  });
}

function showToast(message) {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast-msg';
    toast.innerHTML = `<span style="color:var(--color-accent-volt); font-size:1.25rem;">✓</span> <span class="toast-text"></span>`;
    document.body.appendChild(toast);
  }

  const textEl = toast.querySelector('.toast-text');
  if (textEl) textEl.textContent = message;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}
