/* ============================================================
   Portfolio — interactions
   ============================================================ */

/* ------------------------------------------------------------------
   CONFIGURATION DU FORMULAIRE
   ------------------------------------------------------------------
   Laisse la chaîne vide → le formulaire ouvre le client mail avec le
   message pré-rempli (fonctionne partout, sans inscription).

   Pour recevoir les messages directement dans ta boîte :
   1. Crée un formulaire gratuit sur https://formspree.io (50 envois/mois)
   2. Colle l'URL fournie ci-dessous, par exemple :
      const FORM_ENDPOINT = 'https://formspree.io/f/xxxxxxxx';

   Sur Netlify, tu peux aussi ajouter l'attribut `netlify` à la balise
   <form> dans index.html : les envois arrivent dans le dashboard.
   ------------------------------------------------------------------ */
const FORM_ENDPOINT = 'https://formspree.io/f/maeyowod';
const CONTACT_EMAIL = 'amouguid771@gmail.com';

(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;

  /* ---------- Année ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Thème ---------- */
  const sun =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 1.5v2.2M12 20.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M1.5 12h2.2M20.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6"/></svg>';
  const moon =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  const toggle = document.querySelector('[data-theme-toggle]');
  // Le portfolio est conçu en sombre : c'est le mode par défaut, le clair reste accessible.
  let theme = 'dark';
  const paint = () => {
    root.setAttribute('data-theme', theme);
    if (!toggle) return;
    toggle.innerHTML = theme === 'dark' ? sun : moon;
    toggle.setAttribute(
      'aria-label',
      theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'
    );
  };
  paint();
  toggle?.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    paint();
  });

  /* ---------- Header + barre de progression ---------- */
  const header = document.getElementById('header');
  const bar = document.getElementById('progressBar');
  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle('is-scrolled', y > 12);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
  };
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Menu mobile ---------- */
  const menuBtn = document.getElementById('menuBtn');
  const mobileNav = document.getElementById('mobileNav');
  menuBtn?.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  });
  mobileNav?.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      mobileNav.classList.remove('is-open');
      menuBtn?.setAttribute('aria-expanded', 'false');
    })
  );

  /* ---------- Reveal au scroll ---------- */
  const revealables = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (!e.isIntersecting) return;
          setTimeout(() => e.target.classList.add('is-in'), i * 70);
          io.unobserve(e.target);
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
    );
    revealables.forEach((el) => io.observe(el));
  } else {
    revealables.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- Compteurs ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const runCount = (el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if (reduced) {
      el.textContent = target + suffix;
      return;
    }
    const dur = 1400;
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    const co = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          runCount(e.target);
          co.unobserve(e.target);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => co.observe(el));
  } else counters.forEach(runCount);

  /* ---------- Barres de compétences ---------- */
  const bars = document.querySelectorAll('[data-bar]');
  if ('IntersectionObserver' in window) {
    const bo = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const fill = e.target.querySelector('i');
          if (fill) fill.style.width = e.target.dataset.bar + '%';
          bo.unobserve(e.target);
        });
      },
      { threshold: 0.5 }
    );
    bars.forEach((el) => bo.observe(el));
  } else {
    bars.forEach((el) => {
      const fill = el.querySelector('i');
      if (fill) fill.style.width = el.dataset.bar + '%';
    });
  }

  /* ---------- Texte scramble au survol ---------- */
  const GLYPHS = '#$%&*+-<>/\\{}[]0123456789';
  const scramble = (el) => {
    if (reduced || el.dataset.busy === '1') return;
    const original = el.dataset.original || el.textContent;
    el.dataset.original = original;
    el.dataset.busy = '1';
    const chars = original.split('');
    let frame = 0;
    const total = 26;
    const id = setInterval(() => {
      frame++;
      el.textContent = chars
        .map((c, i) => {
          if (c === ' ') return ' ';
          if (i < (frame / total) * chars.length) return c;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join('');
      if (frame >= total) {
        clearInterval(id);
        el.textContent = original;
        el.dataset.busy = '0';
      }
    }, 28);
  };
  document.querySelectorAll('[data-scramble]').forEach((el) => {
    el.addEventListener('pointerenter', () => scramble(el));
  });

  /* ---------- Curseur personnalisé ---------- */
  const cursor = document.getElementById('cursor');
  const dot = document.getElementById('cursorDot');
  if (cursor && dot && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mx = innerWidth / 2,
      my = innerHeight / 2,
      cx = mx,
      cy = my;
    addEventListener('pointermove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      document.body.classList.add('cursor-on');
    });
    const loop = () => {
      cx += (mx - cx) * 0.16;
      cy += (my - cy) * 0.16;
      cursor.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(loop);
    };
    loop();
    document
      .querySelectorAll('a, button, [data-magnetic], .project__media, .chips li')
      .forEach((el) => {
        el.addEventListener('pointerenter', () => cursor.classList.add('is-active'));
        el.addEventListener('pointerleave', () => cursor.classList.remove('is-active'));
      });
  }

  /* ---------- Boutons magnétiques ---------- */
  if (!reduced && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.22}px, ${y * 0.3}px)`;
      });
      el.addEventListener('pointerleave', () => {
        el.style.transform = '';
      });
    });

    /* ---------- Tilt sur les visuels projets ---------- */
    document.querySelectorAll('[data-tilt] .project__media').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(1000px) rotateX(${-py * 5}deg) rotateY(${px * 6}deg) translateZ(0)`;
      });
      el.addEventListener('pointerleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* ---------- Formulaire de contact ---------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (form && status) {
    const setError = (input, msg) => {
      const field = input.closest('.field');
      const slot = field?.querySelector('.field__error');
      field?.classList.toggle('is-invalid', Boolean(msg));
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (slot) slot.textContent = msg || '';
      return !msg;
    };

    const validate = () => {
      const name = form.elements.name;
      const email = form.elements.email;
      const message = form.elements.message;
      let ok = true;
      ok = setError(name, name.value.trim().length < 2 ? 'Indiquez votre nom.' : '') && ok;
      ok =
        setError(
          email,
          /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())
            ? ''
            : 'Adresse email invalide.'
        ) && ok;
      ok =
        setError(
          message,
          message.value.trim().length < 12 ? 'Décrivez votre projet en quelques mots.' : ''
        ) && ok;
      return ok;
    };

    ['name', 'email', 'message'].forEach((n) => {
      const el = form.elements[n];
      el?.addEventListener('blur', () => {
        if (el.value.trim()) validate();
      });
      el?.addEventListener('input', () => {
        if (el.closest('.field')?.classList.contains('is-invalid')) validate();
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.className = 'form__status';
      status.textContent = '';

      if (form.elements._gotcha.value) return; // piège à robots
      if (!validate()) {
        status.classList.add('is-error');
        status.textContent = 'Vérifiez les champs signalés.';
        return;
      }

      const data = {
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(),
        projet: form.elements.projet.value,
        message: form.elements.message.value.trim(),
      };

      // Sans endpoint configuré : ouverture du client mail pré-rempli.
      if (!FORM_ENDPOINT) {
        const subject = `Nouveau projet — ${data.projet} (${data.name})`;
        const body = `Nom : ${data.name}\nEmail : ${data.email}\nType de projet : ${data.projet}\n\n${data.message}`;
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
          subject
        )}&body=${encodeURIComponent(body)}`;
        status.classList.add('is-ok');
        status.textContent = 'Votre messagerie s\'ouvre avec le message pré-rempli.';
        return;
      }

      form.classList.add('is-sending');
      status.textContent = 'Envoi en cours…';
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        form.reset();
        status.classList.add('is-ok');
        status.textContent = 'Message envoyé. Je reviens vers vous sous 24 h.';
      } catch (err) {
        status.classList.add('is-error');
        status.textContent =
          "L'envoi a échoué. Écrivez-moi directement à " + CONTACT_EMAIL + '.';
      } finally {
        form.classList.remove('is-sending');
      }
    });
  }

  /* ---------- Champ de particules (canvas) ---------- */
  const canvas = document.getElementById('fieldCanvas');
  if (canvas && !reduced) {
    const ctx = canvas.getContext('2d');
    let w = 0,
      h = 0,
      dpr = Math.min(devicePixelRatio || 1, 2);
    let particles = [];
    const pointer = { x: -9999, y: -9999 };

    const styles = () => getComputedStyle(root);

    const resize = () => {
      w = innerWidth;
      h = innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const density = Math.round((w * h) / 22000);
      const count = Math.max(28, Math.min(110, density));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.4 + 0.6,
      }));
    };

    addEventListener('resize', resize);
    addEventListener('pointermove', (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    });
    addEventListener('pointerleave', () => {
      pointer.x = pointer.y = -9999;
    });

    let visible = true;
    document.addEventListener('visibilitychange', () => {
      visible = !document.hidden;
    });

    const draw = () => {
      requestAnimationFrame(draw);
      if (!visible) return;
      const cs = styles();
      const dotColor = cs.getPropertyValue('--dot').trim() || 'rgba(77,240,196,.5)';
      const netColor = cs.getPropertyValue('--link-net').trim() || 'rgba(120,200,180,.15)';

      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 20000 && d2 > 1) {
          const f = (1 - d2 / 20000) * 0.9;
          const d = Math.sqrt(d2);
          p.x += (dx / d) * f;
          p.y += (dy / d) * f;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();
      }

      ctx.strokeStyle = netColor;
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i],
            b = particles[j];
          const dx = a.x - b.x,
            dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 16000) {
            ctx.globalAlpha = 1 - d2 / 16000;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    resize();
    draw();
  }
})();
