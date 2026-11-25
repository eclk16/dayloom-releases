/* Dayloom site: shared behaviour for every page.
   Language (?lang= > saved choice > browser), translations, language menu, download buttons, seller line.
   The small inline script in each page's <head> has already chosen the language and started loading i18n/<lang>.js. */
(function () {
  var W = window, D = document, html = D.documentElement;
  var ROOT = W.DAYLOOM_ROOT || '', L = W.DAYLOOM_LANG || 'en';
  var SITE = 'https://eclk16.github.io/dayloom-releases/';
  var NAMES = { en: 'English', tr: 'Türkçe', de: 'Deutsch', fr: 'Français', es: 'Español', pt: 'Português', id: 'Bahasa Indonesia', 'zh-Hans': '简体中文', ja: '日本語', ko: '한국어', ar: 'العربية', ur: 'اردو', ru: 'Русский', hi: 'हिन्दी', bn: 'বাংলা', vi: 'Tiếng Việt' };
  var isMac = !html.classList.contains('not-mac');
  var listeners = [], applied = false;

  function dict(l) { return (W.DAYLOOM_I18N || {})[l || L]; }
  function t(k, vars) {
    var d = dict() || {}, s = d[k] || '';
    if (vars) Object.keys(vars).forEach(function (v) { s = s.split('{' + v + '}').join(String(vars[v])); });
    return s;
  }
  function each(sel, fn) { Array.prototype.forEach.call(D.querySelectorAll(sel), fn); }

  function mailto() {
    var url = SITE + (L === 'en' ? '' : '?lang=' + L);
    return 'mailto:?subject=' + encodeURIComponent(t('nonmac.subject') || 'Dayloom') + '&body=' + encodeURIComponent((t('nonmac.body', { url: url }) || url));
  }
  function apply() {
    var d = dict(); if (!d) return;
    html.lang = L; html.dir = (L === 'ar' || L === 'ur') ? 'rtl' : 'ltr';
    each('[data-i]', function (el) { var v = d[el.getAttribute('data-i')]; if (v) el.textContent = v; });
    each('[data-alt]', function (el) { var v = d[el.getAttribute('data-alt')]; if (v) el.alt = v; });
    each('[data-aria]', function (el) { var v = d[el.getAttribute('data-aria')]; if (v) el.setAttribute('aria-label', v); });
    var tk = html.getAttribute('data-title'), dk = html.getAttribute('data-desc');
    if (tk && d[tk]) {
      var title = tk === 'meta.title' ? d[tk] : d[tk] + ' · Dayloom';
      D.title = title; each('meta[property="og:title"],meta[name="twitter:title"]', function (m) { m.content = title; });
    }
    if (dk && d[dk]) each('meta[name="description"],meta[property="og:description"],meta[name="twitter:description"]', function (m) { m.content = d[dk]; });
    each('link[rel="canonical"][data-self]', function (c) { c.href = c.getAttribute('data-self') + (L === 'en' ? '' : '?lang=' + L); });
    each('meta[property="og:url"][data-self]', function (c) { c.content = c.getAttribute('data-self') + (L === 'en' ? '' : '?lang=' + L); });
    if (!isMac) each('a[data-dl]', function (a) { a.href = mailto(); a.removeAttribute('download'); });
    applied = true;
    html.classList.remove('i18n-wait');
    listeners.forEach(function (fn) { try { fn(L); } catch (e) { if (W.console) console.error(e); } });
  }
  function load(l, cb) {
    if (dict(l)) { cb(); return; }
    var id = 'i18n-' + l, s = D.getElementById(id);
    if (!s) { s = D.createElement('script'); s.id = id; s.src = ROOT + 'i18n/' + l + '.js'; s.async = true; D.head.appendChild(s); }
    s.addEventListener('load', cb);
    s.addEventListener('error', function () { html.classList.remove('i18n-wait'); });
  }
  function setLang(l) {
    if (!NAMES[l]) return;
    L = l; W.DAYLOOM_LANG = l;
    try { localStorage.setItem('dayloom-lang', l); } catch (e) {}
    try {
      var u = new URL(location.href);
      if (u.searchParams.has('lang') || html.hasAttribute('data-lang-url')) { if (l === 'en') u.searchParams.delete('lang'); else u.searchParams.set('lang', l); history.replaceState(null, '', u.pathname + u.search + u.hash); }
    } catch (e) {}
    load(l, apply);
  }

  // Non-Mac visitors: the download cannot run there, so the buttons offer to email the link instead.
  if (!isMac) {
    each('a[data-dl] [data-i]', function (el) { el.setAttribute('data-i', 'nonmac.btn'); });
    each('[data-nonmac-i]', function (el) { el.setAttribute('data-i', el.getAttribute('data-nonmac-i')); });
  }

  // Language menu
  var sel = D.getElementById('lang');
  if (sel) {
    Object.keys(NAMES).forEach(function (c) { var o = D.createElement('option'); o.value = c; o.textContent = NAMES[c]; o.lang = c; sel.appendChild(o); });
    sel.value = L;
    sel.addEventListener('change', function () { setLang(sel.value); });
  }

  // Seller line in the footer (empty fields are skipped)
  var S = W.DAYLOOM_SELLER || {}, sl = D.getElementById('seller');
  if (sl) [S.name, S.address, S.email, S.phone].filter(Boolean).forEach(function (v, i) {
    if (i) sl.appendChild(D.createTextNode(' · '));
    if (v === S.email) { var a = D.createElement('a'); a.href = 'mailto:' + v; a.textContent = v; sl.appendChild(a); } else sl.appendChild(D.createTextNode(v));
  });

  W.Dayloom = {
    t: t, lang: function () { return L; }, isMac: isMac, setLang: setLang, names: NAMES,
    locale: function () { return L === 'zh-Hans' ? 'zh-CN' : L; },
    // Runs fn now if the strings are ready, and again after every language change.
    onLang: function (fn) { listeners.push(fn); if (applied) fn(L); }
  };
  load(L, apply);
})();
