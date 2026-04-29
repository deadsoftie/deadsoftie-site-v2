// Mobile nav toggle
(function () {
  var toggle = document.getElementById('nav-toggle');
  var drawer = document.getElementById('nav-drawer');
  if (!toggle || !drawer) return;

  toggle.addEventListener('click', function () {
    var open = drawer.classList.toggle('is-open');
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });

  document.addEventListener('click', function (e) {
    if (!toggle.contains(e.target) && !drawer.contains(e.target)) {
      drawer.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}());

// Chrome search: on essays page mirror to essay search; elsewhere submit as ?q=
(function () {
  var chromeInput = document.getElementById('chrome-search');
  var chromeForm  = document.getElementById('chrome-search-form');
  if (!chromeInput) return;

  var essayInput = document.getElementById('essay-search');
  if (essayInput) {
    chromeInput.addEventListener('input', function () {
      essayInput.value = chromeInput.value;
      essayInput.dispatchEvent(new Event('input'));
    });
  } else if (chromeForm) {
    chromeForm.addEventListener('submit', function (e) {
      var q = chromeInput.value.trim();
      if (!q) { e.preventDefault(); return; }
    });
  }
}());

// Copy buttons for code blocks
document.querySelectorAll('[data-copy], .copy').forEach(function (btn) {
  btn.addEventListener('click', function () {
    const pre = btn.closest('.codeblock, figure').querySelector('pre');
    if (!pre) return;
    navigator.clipboard.writeText(pre.innerText).then(function () {
      const orig = btn.textContent;
      btn.textContent = 'copied';
      setTimeout(function () { btn.textContent = orig; }, 1200);
    });
  });
});
