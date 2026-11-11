/* Visor de diapositivas del plan de compensación (sin dependencias).
   Teclas: → / espacio siguiente · ← anterior · N notas · F pantalla completa · Inicio/Fin. Desliza en el celular. */
(function () {
  var $ = function (s) { return document.querySelector(s); };
  var slides = [].slice.call(document.querySelectorAll('.slide')), idx = 0, KEY = 'visainPlanSlide';
  var stage = $('#stage'), jump = $('#jump'), notes = $('#notes');
  try { var sv = parseInt(localStorage.getItem(KEY), 10); if (sv >= 0 && sv < slides.length) idx = sv; } catch (e) { }
  var h = parseInt((location.hash || '').replace('#', ''), 10); if (h >= 1 && h <= slides.length) idx = h - 1;

  jump.innerHTML = slides.map(function (s, i) { return '<option value="' + i + '">' + (i + 1) + ' · ' + (s.getAttribute('data-title') || s.id) + '</option>'; }).join('');

  function fit() { var k = Math.min(innerWidth / 1920, (innerHeight - 56) / 1080); stage.style.transform = 'scale(' + k + ')'; }
  function show(i) {
    idx = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach(function (s, j) { s.classList.toggle('on', j === idx); });
    $('#count').textContent = (idx + 1) + ' / ' + slides.length; jump.value = idx;
    var a = slides[idx].querySelector('aside'); $('#notesText').textContent = a ? a.textContent.trim() : 'Esta diapositiva no tiene notas.';
    try { localStorage.setItem(KEY, idx); } catch (e) { }
    try { history.replaceState(null, '', '#' + (idx + 1)); } catch (e) { }
  }
  function next() { show(idx + 1); } function prev() { show(idx - 1); }
  $('#bNext').onclick = next; $('#bPrev').onclick = prev; jump.onchange = function () { show(+jump.value); };
  $('#bNotes').onclick = function () { notes.hidden = !notes.hidden; };
  $('#bPrint').onclick = function () { window.print(); };
  function full() { try { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); } catch (e) { } }
  $('#bFull').onclick = full;
  document.addEventListener('keydown', function (e) {
    if (/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) return;
    if (e.key === 'ArrowRight' || e.code === 'Space' || e.key === 'PageDown') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); prev(); }
    else if (e.key === 'Home') show(0); else if (e.key === 'End') show(slides.length - 1);
    else if (e.key === 'n' || e.key === 'N') notes.hidden = !notes.hidden; else if (e.key === 'f' || e.key === 'F') full();
  });
  stage.addEventListener('click', function (e) { var r = stage.getBoundingClientRect(); (e.clientX - r.left < r.width * 0.3) ? prev() : next(); });
  var x0 = null; document.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(dx) > 50) (dx < 0 ? next() : prev()); });
  var idle; function wake() { document.body.classList.remove('idle'); clearTimeout(idle); idle = setTimeout(function () { if (document.fullscreenElement) document.body.classList.add('idle'); }, 3000); }
  ['mousemove', 'mousedown', 'keydown', 'touchstart'].forEach(function (ev) { document.addEventListener(ev, wake); }); wake();
  addEventListener('resize', fit); fit(); show(idx);
})();
