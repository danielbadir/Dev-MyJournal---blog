(function () {
  'use strict';

  // Reading progress bar
  var bar = document.getElementById('progress-bar');
  if (bar) {
    window.addEventListener('scroll', function () {
      var total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        bar.style.width = Math.round((window.scrollY / total) * 100) + '%';
      }
    });
  }

  // Active TOC link highlights current heading in viewport
  var headings = document.querySelectorAll('.prose h2[id], .prose h3[id]');
  var tocLinks = document.querySelectorAll('.toc-list a');
  if (headings.length && tocLinks.length) {
    var tocObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          tocLinks.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    headings.forEach(function (h) { tocObserver.observe(h); });
  }
}());
