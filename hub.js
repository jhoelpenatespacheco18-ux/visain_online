/* Pantalla de inicio: estado de conexión, estado offline e instalación. */
(function () {
  var $ = function (s) { return document.querySelector(s); };
  $('#ver').textContent = '1.0.0';
  function net() { var on = navigator.onLine; var el = $('#net'); el.textContent = on ? '● En línea' : '● Sin internet'; el.className = 'chip ' + (on ? 'ok' : 'off'); }
  addEventListener('online', net); addEventListener('offline', net); net();
  $('#offl').textContent = 'Edición en línea · necesita internet'; $('#offl').className = 'chip';
  var ev; addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); ev = e; $('#install').hidden = false; });
  $('#install').onclick = function () { if (!ev) return; ev.prompt(); ev.userChoice.finally(function () { $('#install').hidden = true; ev = null; }); };
  addEventListener('appinstalled', function () { $('#install').hidden = true; });
})();
