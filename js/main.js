/* =========================================================
   Vishal Vishwakarma — Portfolio interactions
   Vanilla JS, no dependencies.
   ========================================================= */
(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Year ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky nav + scroll progress ---------- */
  const nav = $('#nav');
  const progress = $('#scrollProgress');

  function onScroll() {
    const y = window.scrollY || window.pageYOffset;
    if (nav) nav.classList.toggle('is-scrolled', y > 24);

    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = h > 0 ? (y / h) * 100 + '%' : '0%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  const toggle = $('#navToggle');
  const navLinks = $('#navLinks');

  function closeMenu() {
    if (!navLinks) return;
    navLinks.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    $$('.nav__link', navLinks).forEach((a) => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  }

  /* ---------- Active section highlighting ---------- */
  const sections = $$('main section[id]');
  const linkMap = new Map();
  $$('.nav__link').forEach((link) => {
    const id = link.getAttribute('href').replace('#', '');
    linkMap.set(id, link);
  });

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          linkMap.forEach((l) => l.classList.remove('is-active'));
          if (linkMap.has(id)) linkMap.get(id).classList.add('is-active');
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );
  sections.forEach((s) => spy.observe(s));

  /* ---------- Reveal on scroll ---------- */
  const reveals = $$('.reveal');
  if (prefersReduced) {
    reveals.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObs = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            // gentle stagger for grouped elements
            const delay = Math.min(i * 60, 240);
            setTimeout(() => entry.target.classList.add('is-visible'), delay);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    reveals.forEach((el) => revealObs.observe(el));
  }

  /* ---------- Hero typing effect ---------- */
  const typed = $('#typed');
  if (typed) {
    const phrases = [
      'thinking like the attacker.',
      'securing ai & cloud, fast.',
      'chaining low bugs into critical impact.',
      'breaking llms before they ship.',
      'automating the boring, hunting the hard.',
      'earning every byte of access.',
    ];

    if (prefersReduced) {
      typed.textContent = phrases[0];
    } else {
      let pi = 0, ci = 0, deleting = false;
      function tick() {
        const current = phrases[pi];
        if (!deleting) {
          typed.textContent = current.slice(0, ++ci);
          if (ci === current.length) { deleting = true; return setTimeout(tick, 1700); }
        } else {
          typed.textContent = current.slice(0, --ci);
          if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
        }
        setTimeout(tick, deleting ? 38 : 70);
      }
      tick();
    }
  }

  /* ---------- Animated stat counters ---------- */
  const stats = $$('.stat__num');
  const countObs = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10) || 0;
        if (prefersReduced) { el.textContent = target; obs.unobserve(el); return; }

        const dur = 1400;
        const start = performance.now();
        function step(now) {
          const t = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(target * eased);
          if (t < 1) requestAnimationFrame(step);
          else el.textContent = target;
        }
        requestAnimationFrame(step);
        obs.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );
  stats.forEach((s) => countObs.observe(s));

  /* ---------- Checklist: persistence + progress ---------- */
  const checklist = $('#checklist');
  if (checklist) {
    const boxes = $$('input[type="checkbox"]', checklist);
    const barFill = $('#clBarFill');
    const countEl = $('#clCount');
    const resetBtn = $('#clReset');
    const STORAGE_KEY = 'vv_bb_checklist_v1';

    // give each box a stable index-based id
    boxes.forEach((b, i) => (b.dataset.idx = i));

    function load() {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        boxes.forEach((b, i) => { b.checked = !!saved[i]; });
      } catch (e) { /* ignore corrupt storage */ }
    }
    function save() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(boxes.map((b) => b.checked)));
      } catch (e) { /* storage may be unavailable */ }
    }
    function render() {
      const done = boxes.filter((b) => b.checked).length;
      const total = boxes.length;
      if (barFill) barFill.style.width = total ? (done / total) * 100 + '%' : '0%';
      if (countEl) countEl.textContent = `${done} / ${total} complete`;
    }

    boxes.forEach((b) => b.addEventListener('change', () => { save(); render(); }));
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        boxes.forEach((b) => (b.checked = false));
        save(); render();
      });
    }

    load();
    render();
  }

  /* ---------- Recommendations carousel ---------- */
  const recCarousel = $('#recCarousel');
  if (recCarousel) {
    const track = $('#recTrack');
    const slides = $$('.rec-slide', track);
    const dotsWrap = $('#recDots');
    const prevBtn = $('#recPrev');
    const nextBtn = $('#recNext');
    const INTERVAL = 5000;
    let idx = 0;
    let timer = null;

    if (slides.length > 1) {
      // build dot controls
      const dots = slides.map((_, i) => {
        const b = document.createElement('button');
        b.className = 'rec-dot' + (i === 0 ? ' is-active' : '');
        b.type = 'button';
        b.setAttribute('aria-label', 'Show recommendation ' + (i + 1));
        b.addEventListener('click', () => { go(i); restart(); });
        dotsWrap.appendChild(b);
        return b;
      });

      const go = (n) => {
        idx = (n + slides.length) % slides.length;
        track.style.transform = 'translateX(-' + idx * 100 + '%)';
        dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
      };
      const start = () => { if (!prefersReduced && !timer) timer = setInterval(() => go(idx + 1), INTERVAL); };
      const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
      const restart = () => { stop(); start(); };

      if (prevBtn) prevBtn.addEventListener('click', () => { go(idx - 1); restart(); });
      if (nextBtn) nextBtn.addEventListener('click', () => { go(idx + 1); restart(); });

      // pause while the visitor is reading / hovering
      recCarousel.addEventListener('mouseenter', stop);
      recCarousel.addEventListener('mouseleave', start);
      document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

      go(0);
      start();
    } else {
      // single recommendation: hide controls
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
    }
  }

})();
