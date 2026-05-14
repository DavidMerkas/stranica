// Špoljaričinke — Hamburger mobile nav
(function () {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (!hamburger || !mobileNav) return;

  function open() {
    hamburger.classList.add('open');
    mobileNav.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileNav.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    hamburger.querySelector('span').style.background = 'var(--bone)';
    hamburger.querySelectorAll('span')[1].style.background = 'var(--bone)';
  }

  function close() {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    hamburger.querySelectorAll('span').forEach(s => s.style.background = '');
  }

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? close() : open();
  });

  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  // Mark active link
  const path = window.location.pathname.split('/').pop() || 'index.html';
  mobileNav.querySelectorAll('a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('on');
  });
})();

// Špoljaričinke — Dynamic nav status (open / closed)
(function () {
  const status = document.querySelector('.nav-status');
  if (!status) return;

  // Wrap existing text in a span (if not already done)
  if (!status.querySelector('.status-text')) {
    const dot = status.querySelector('.dot');
    const text = Array.from(status.childNodes)
      .find(n => n.nodeType === 3 && n.textContent.trim());
    if (text) {
      const span = document.createElement('span');
      span.className = 'status-text';
      span.textContent = text.textContent.trim();
      text.replaceWith(span);
    }
  }

  function update() {
    const now    = new Date();
    const day    = now.getDay();   // 0 = ned, 6 = sub
    const h      = now.getHours();
    const m      = now.getMinutes();
    const time   = h + m / 60;

    const isWeekend = day === 0 || day === 6;
    const openAt    = isWeekend ? 10 : 9;
    const closeAt   = isWeekend ? 23 : 22;
    const isOpen    = time >= openAt && time < closeAt;

    const dot      = status.querySelector('.dot');
    const textEl   = status.querySelector('.status-text');

    if (isOpen) {
      dot.style.background   = '#6BCB77';
      dot.style.animation    = '';
      status.classList.remove('closed');
      textEl.textContent     = `Otvoreno · do ${closeAt}h`;
    } else {
      dot.style.background   = '#E85D2F';
      dot.style.animation    = 'none';
      status.classList.add('closed');

      // Determine next opening
      const opensToday    = time < openAt;
      const tomorrowDay   = (day + 1) % 7;
      const tomorrowWknd  = tomorrowDay === 0 || tomorrowDay === 6;
      const tomorrowOpen  = tomorrowWknd ? 10 : 9;

      textEl.textContent = opensToday
        ? `Zatvoreno · otvara ${openAt}h`
        : `Zatvoreno · sutra ${tomorrowOpen}h`;
    }
  }

  update();

  // Re-check every minute
  const now = new Date();
  const msToNextMin = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
  setTimeout(() => { update(); setInterval(update, 60000); }, msToNextMin);
})();
