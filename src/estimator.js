import { lang, onLanguageChange, t } from './i18n.js';

const BASE = { checkup: 95, repair: 180, whitening: 420, crown: 890 };

function formatEuro(amount) {
  return new Intl.NumberFormat(lang() === 'de' ? 'de-DE' : 'en-GB', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function selectedTreatment() {
  const checked = document.querySelector('#estimator-form input[name="treatment"]:checked');
  return checked?.value ?? 'checkup';
}

export function initEstimator({ onReserve }) {
  const form = document.getElementById('estimator-form');
  const visits = document.getElementById('est-visits');
  const visitsOut = document.getElementById('est-visits-out');
  const total = document.getElementById('est-total');
  const monthly = document.getElementById('est-monthly');
  const cta = document.getElementById('est-cta');
  if (!form || !visits || !visitsOut || !total || !monthly || !cta) return;

  const render = () => {
    const treatment = selectedTreatment();
    const count = Number(visits.value);
    const payment = form.querySelector('input[name="payment"]:checked')?.value ?? 'full';
    const amount = (BASE[treatment] ?? BASE.checkup) + (count - 1) * 60;

    visitsOut.textContent = String(count);
    total.textContent = formatEuro(amount);

    if (payment === 'full') {
      monthly.textContent = t('est_monthly_full');
    } else {
      const months = payment === 'six' ? 6 : 3;
      monthly.textContent = t('est_monthly_plan', {
        amount: formatEuro(Math.round(amount / months)),
        months,
      });
    }
  };

  form.addEventListener('input', render);
  form.addEventListener('change', render);
  cta.addEventListener('click', () => onReserve(selectedTreatment()));
  onLanguageChange(render);
  render();
}
