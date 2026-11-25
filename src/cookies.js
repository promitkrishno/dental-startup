const STORAGE_KEY = 'zw-consent';

function readConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function initCookies() {
  const banner = document.getElementById('cookie-banner');
  const dialog = document.getElementById('cookie-dialog');
  const form = document.getElementById('cookie-form');
  if (!banner || !dialog || !form) return;

  const necessary = document.getElementById('cookie-necessary');
  const all = document.getElementById('cookie-all');
  const settings = document.getElementById('cookie-settings-open');
  const footerSettings = document.getElementById('cookie-settings');
  const cancel = document.getElementById('cookie-cancel');
  const analytics = document.getElementById('cookie-analytics');
  const marketing = document.getElementById('cookie-marketing');

  const hideBanner = () => { banner.hidden = true; };

  const save = (preferences) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...preferences, savedAt: Date.now() }));
    } catch { /* storage unavailable */ }
    hideBanner();
  };

  const openSettings = () => {
    const stored = readConsent();
    analytics.checked = Boolean(stored?.analytics);
    marketing.checked = Boolean(stored?.marketing);
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  };

  const closeSettings = () => {
    dialog.classList.add('is-closing');
    window.setTimeout(() => {
      dialog.classList.remove('is-closing');
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
    }, 260);
  };

  necessary?.addEventListener('click', () => save({ essential: true, analytics: false, marketing: false }));
  all?.addEventListener('click', () => save({ essential: true, analytics: true, marketing: true }));
  settings?.addEventListener('click', openSettings);
  footerSettings?.addEventListener('click', openSettings);
  cancel?.addEventListener('click', closeSettings);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    save({ essential: true, analytics: analytics.checked, marketing: marketing.checked });
    closeSettings();
  });

  const stored = readConsent();
  if (stored) hideBanner();
  else {
    const showBanner = () => { banner.hidden = false; };
    if ('requestIdleCallback' in window) window.requestIdleCallback(showBanner, { timeout: 2500 });
    else window.setTimeout(showBanner, 1800);
  }
}
