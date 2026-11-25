import { lang, onLanguageChange, t } from './i18n.js';

function todayISO() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(lang() === 'de' ? 'de-DE' : 'en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(date);
}

export function initBooking() {
  const drawer = document.getElementById('booking-drawer');
  const scrim = document.getElementById('drawer-scrim');
  const form = document.getElementById('booking-form');
  if (!drawer || !scrim || !form) return { open() {} };

  const steps = [...drawer.querySelectorAll('.booking-step')];
  const indicators = [...drawer.querySelectorAll('.step-indicator li')];
  const next = document.getElementById('booking-next');
  const back = document.getElementById('booking-back');
  const done = document.getElementById('booking-done');
  const closeButton = document.getElementById('booking-close');
  const dateField = form.querySelector('[name="date"]');

  let step = 1;
  let lastFocus = null;
  let closeTimer = null;
  let reference = '';

  const focusable = () => [...drawer.querySelectorAll(
    'button:not([disabled]):not([hidden]), a[href], input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])',
  )].filter((element) => element.getClientRects().length > 0);

  function fillSummary() {
    const treatment = form.querySelector('input[name="concern"]:checked')?.value;
    const key = treatment === 'other' ? 'step_1_other' : `est_opt_${treatment ?? 'checkup'}`;
    document.getElementById('summary-treatment').textContent = t(key);
    document.getElementById('summary-date').textContent = formatDate(dateField.value);
    document.getElementById('summary-time').textContent = form.querySelector('input[name="time"]:checked')?.value ?? '—';
    document.getElementById('summary-name').textContent = form.elements.namedItem('name')?.value ?? '—';
    if (!reference) reference = `ZW-${String(Date.now()).slice(-4)}`;
    document.getElementById('booking-ref').textContent = reference;
  }

  function goTo(nextStep) {
    step = nextStep;
    steps.forEach((section) => { section.hidden = Number(section.dataset.step) !== step; });
    indicators.forEach((item, index) => {
      item.classList.toggle('is-current', index === step - 1);
      item.classList.toggle('is-done', index < step - 1);
    });
    back.hidden = step === 1 || step === 4;
    next.hidden = step === 4;
    done.hidden = step !== 4;
    if (step === 4) fillSummary();
    const heading = steps[step - 1]?.querySelector('h3');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  }

  function validate(currentStep) {
    const section = steps[currentStep - 1];
    if (!section) return false;
    const invalid = [...section.querySelectorAll('input, textarea, select')]
      .find((element) => !element.checkValidity());
    if (invalid) {
      invalid.reportValidity();
      return false;
    }
    return true;
  }

  function open(prefill) {
    window.clearTimeout(closeTimer);
    lastFocus = document.activeElement;
    if (prefill) {
      const radio = form.querySelector(`input[name="concern"][value="${prefill}"]`);
      if (radio) radio.checked = true;
    }
    if (dateField) {
      dateField.min = todayISO();
      if (!dateField.value) dateField.value = todayISO();
    }
    drawer.hidden = false;
    scrim.hidden = false;
    document.body.classList.add('is-locked');
    goTo(1);
    window.requestAnimationFrame(() => {
      drawer.classList.add('is-open');
      scrim.classList.add('is-open');
      closeButton?.focus({ preventScroll: true });
    });
  }

  function close() {
    drawer.classList.remove('is-open');
    scrim.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    closeTimer = window.setTimeout(() => {
      drawer.hidden = true;
      scrim.hidden = true;
    }, 620);
    lastFocus?.focus?.({ preventScroll: true });
  }

  next?.addEventListener('click', () => {
    if (validate(step) && step < 3) goTo(step + 1);
    else if (validate(step) && step === 3) goTo(4);
  });
  back?.addEventListener('click', () => { if (step > 1) goTo(step - 1); });
  done?.addEventListener('click', close);
  closeButton?.addEventListener('click', close);
  scrim.addEventListener('click', close);
  form.addEventListener('submit', (event) => event.preventDefault());

  drawer.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = focusable();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  document.querySelectorAll('.js-open-booking').forEach((button) => {
    button.addEventListener('click', () => open());
  });

  onLanguageChange(() => { if (step === 4) fillSummary(); });

  return { open };
}
