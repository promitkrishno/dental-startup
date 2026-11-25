import { initI18n } from './i18n.js';
import { initMotion } from './motion.js';
import { initComparer } from './comparer.js';
import { initCookies } from './cookies.js';
import { initBooking } from './booking.js';
import { initEstimator } from './estimator.js';

document.documentElement.classList.add('js-enabled');

initI18n();
const booking = initBooking();
initEstimator({ onReserve: (treatment) => booking.open(treatment) });
initComparer();
initCookies();
initMotion();
