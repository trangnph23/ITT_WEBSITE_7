(function () {
  function initMobileNav() {
    var toggle = document.querySelector('.mobile-nav-toggle');
    var nav = document.querySelector('.main-nav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', function () {
      var isOpen = nav.style.display === 'flex';
      nav.style.display = isOpen ? 'none' : 'flex';
      nav.style.flexDirection = 'column';
      nav.style.position = 'absolute';
      nav.style.top = '72px';
      nav.style.left = '0';
      nav.style.right = '0';
      nav.style.background = '#fff';
      nav.style.padding = '16px 24px';
      nav.style.borderBottom = '1px solid #E1E6EF';
    });
  }

  // Silent Google Form submission: posts to a hidden iframe so the page never
  // navigates away or shows Google's UI. Requires the form element to carry
  // data-gform-action (the form's .../formResponse URL) and its inputs to use
  // the matching entry.XXXXXXX names pulled from the real Google Form.
  function initSilentForms() {
    document.querySelectorAll('form[data-gform-action]').forEach(function (form) {
      var iframeName = 'hidden-submit-' + Math.random().toString(36).slice(2);
      var iframe = document.createElement('iframe');
      iframe.name = iframeName;
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      form.setAttribute('action', form.getAttribute('data-gform-action'));
      form.setAttribute('method', 'POST');
      form.setAttribute('target', iframeName);

      form.addEventListener('submit', function () {
        var checked = form.querySelector('input[name="type"]:checked');
        var type = checked ? checked.value : '';
        setTimeout(function () {
          form.reset();
          form.dispatchEvent(new Event('reset'));
          var confirmEl = form.parentElement.querySelector('.confirm-msg');
          if (confirmEl) {
            var msg = confirmEl.getAttribute('data-' + type);
            if (msg) confirmEl.textContent = msg;
            confirmEl.classList.add('show');
          }
        }, 400);
      });
    });
  }

  function initBioToggles() {
    document.querySelectorAll('.bio-toggle').forEach(function (btn) {
      var bio = btn.parentElement.querySelector('.trainer-bio');
      btn.addEventListener('click', function () {
        var open = bio.classList.toggle('clamp') === false;
        btn.textContent = open ? 'Thu gọn' : 'Xem thêm';
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });
  }

  // Contact page: show only the questions that match Doanh nghiệp / Cá nhân.
  // Hidden groups are disabled so they are neither validated nor sent.
  function initContactToggle() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    var btn = document.getElementById('submit-btn');
    function apply() {
      var checked = form.querySelector('input[name="type"]:checked');
      var type = checked ? checked.value : '';
      form.querySelectorAll('.form-extra').forEach(function (g) {
        var grp = g.getAttribute('data-group');
        var show = type && (grp === 'shared' || grp === type);
        g.hidden = !show;
        g.querySelectorAll('input,select,textarea').forEach(function (f) { f.disabled = !show; });
      });
      if (btn) {
        btn.hidden = !type;
        btn.textContent = type === 'student' ? 'Gửi đăng ký' : 'Gửi liên hệ';
      }
      var c = form.parentElement.querySelector('.confirm-msg');
      if (c && type) c.classList.remove('show');
    }
    form.addEventListener('change', apply);
    form.addEventListener('reset', function () { setTimeout(apply, 0); });
    apply();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initContactToggle();
    initBioToggles();
    initMobileNav();
    initSilentForms();
  });
})();
