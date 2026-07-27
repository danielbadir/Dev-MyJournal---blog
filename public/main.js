(function () {
  'use strict';
  // Set before the body paints so the CSS below can hide .reveal elements.
  // If this file fails to load, the class is never added, no .reveal is ever
  // hidden, and the whole page stays readable — the animation is the thing
  // that degrades, not the content. Previously .reveal was hidden by default
  // and only JS could reveal it, so one failed request blanked 151 elements
  // across the platform with no error and no fallback.
  document.documentElement.className += ' js';
}());

(function () {
  'use strict';
  // Everything below touches the DOM. main.js is loaded in <head> without
  // defer so the .js flag above lands before first paint — which means the
  // body is NOT parsed yet at this point. Running querySelectorAll here
  // directly matched zero elements, so nothing was ever observed and every
  // .reveal element stayed at opacity:0 permanently. Wait for the DOM.
  function boot() {

    // Category filter
    function setFilter(cat) {
      document.querySelectorAll('.filter-btn').forEach(function (btn) {
        var isActive = btn.dataset.cat === cat;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
      var visible = 0;
      document.querySelectorAll('.post-card').forEach(function (card) {
        var match = cat === 'all' || card.dataset.cat === cat;
        card.style.display = match ? '' : 'none';
        if (match) visible++;
      });
      var emptyMsg = document.getElementById('emptyMsg');
      if (emptyMsg) emptyMsg.classList.toggle('visible', visible === 0);
    }

    // Filter buttons (desktop bar)
    document.querySelectorAll('.filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setFilter(btn.dataset.cat);
      });
    });

    // Desktop nav filter links
    document.querySelectorAll('.nav-links a[data-filter]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        setFilter(a.dataset.filter);
      });
    });

    // Blog notification form
    document.querySelectorAll('.notify-form').forEach(function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var em = f.querySelector('input').value;
        var p = f.dataset.product;
        window.location = 'mailto:contact@lpagesapplabs.com?subject=Blog+notification:+'
          + encodeURIComponent(p)
          + '&body=Please+add+'
          + encodeURIComponent(em)
          + '+to+the+blog+notification+list.';
      });
    });

    // Mobile hamburger + nav
    var ham = document.getElementById('hamburger');
    var navMobile = document.getElementById('navMobile');
    if (ham && navMobile) {
      ham.setAttribute('aria-expanded', 'false');
      ham.setAttribute('aria-controls', 'navMobile');
      ham.addEventListener('click', function () {
        var isOpen = navMobile.classList.toggle('open');
        ham.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
      // Mobile nav filter links — filter + close
      navMobile.querySelectorAll('a[data-filter]').forEach(function (a) {
        a.addEventListener('click', function (e) {
          e.preventDefault();
          setFilter(a.dataset.filter);
          navMobile.classList.remove('open');
          ham.setAttribute('aria-expanded', 'false');
        });
      });
      // All other mobile nav links — just close
      navMobile.querySelectorAll('a:not([data-filter])').forEach(function (a) {
        a.addEventListener('click', function () {
          navMobile.classList.remove('open');
          ham.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // Scroll-reveal for post cards
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.style.opacity = 1;
          e.target.style.transform = 'none';
        }
      });
    }, { threshold: 0.05 });
    document.querySelectorAll('.post-card, .sub-inner').forEach(function (el) {
      el.style.opacity = 0;
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      revealObserver.observe(el);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}());
