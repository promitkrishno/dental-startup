export function initMotion() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Skeleton shimmer clears as soon as each photograph is decoded.
  document.querySelectorAll('.skeleton img').forEach((img) => {
    const clear = () => img.closest('.skeleton')?.classList.add('is-loaded');
    if (img.complete) clear();
    else {
      img.addEventListener('load', clear, { once: true });
      img.addEventListener('error', clear, { once: true });
    }
  });

  // Three quiet reveal vocabularies; the hero has its own orchestrated entrance.
  const revealNodes = document.querySelectorAll('[data-reveal]');
  if (!reduced && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealNodes.forEach((node) => observer.observe(node));
  } else {
    revealNodes.forEach((node) => node.classList.add('in-view'));
  }

  // Treatment journal accordion.
  const triggers = document.querySelectorAll('.journal-trigger');
  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const willOpen = trigger.getAttribute('aria-expanded') !== 'true';
      triggers.forEach((other) => other.setAttribute('aria-expanded', 'false'));
      if (willOpen) trigger.setAttribute('aria-expanded', 'true');
    });
  });

  // Magnetic response on primary CTAs, only for precise pointers.
  if (!reduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.magnetic').forEach((button) => {
      button.addEventListener('pointermove', (event) => {
        const rect = button.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        button.style.transform = `translate(${x * 9}px, ${y * 5}px)`;
      });
      button.addEventListener('pointerleave', () => {
        button.style.transform = '';
      });
    });
  }
}
