// Menú de tweaks para ver el prototipo fuera de Claude Design.
// Lee las opciones (data-props) del propio .dc.html, las aplica en vivo con
// __dcSetProps y las guarda en localStorage. El botón se puede arrastrar.
(function () {
  'use strict';
  var PAGINA = location.pathname.split('/').pop() || 'index';
  var CLAVE = 'solfit_tweaks:' + PAGINA;
  var CLAVE_POS = 'solfit_tweaks_pos';
  var CLAVE_AJUSTE = 'solfit_tweaks_ajuste';
  var esApp = /app/i.test(PAGINA);

  function leer(k, def) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch (e) { return def; } }
  function guardar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  function meta() {
    var el = document.querySelector('script[data-dc-script]');
    try { return JSON.parse(el.getAttribute('data-props')) || {}; } catch (e) { return {}; }
  }

  var valores = leer(CLAVE, {});

  function aplicar() {
    if (typeof window.__dcSetProps !== 'function' || typeof window.__dcRootName !== 'function') return false;
    window.__dcSetProps(window.__dcRootName(), valores);
    return true;
  }

  // Ajuste al celular: escala el teléfono de 390×844 para que quepa en la pantalla.
  function ajustar() {
    if (!esApp) return;
    var host = document.querySelector('#dc-root > .sc-host > div') || document.querySelector('#dc-root > div > div');
    if (!host) return;
    var on = leer(CLAVE_AJUSTE, true);
    var chico = window.innerWidth < 500;
    if (on && chico) {
      host.style.padding = '0';
      var z = Math.min(window.innerWidth / 390, window.innerHeight / 844);
      host.style.zoom = String(Math.min(1, z));
    } else {
      host.style.padding = '';
      host.style.zoom = '';
    }
  }

  function css() {
    var s = document.createElement('style');
    s.textContent = [
      '#tw-btn{position:fixed;z-index:2147483646;width:52px;height:52px;border-radius:50%;border:0;',
      'background:#F39200;color:#10140F;font:700 22px/52px system-ui,sans-serif;text-align:center;',
      'box-shadow:0 6px 18px rgba(0,0,0,.35);cursor:grab;touch-action:none;user-select:none;opacity:.92}',
      '#tw-pan{position:fixed;z-index:2147483647;left:50%;bottom:16px;transform:translateX(-50%);',
      'width:min(360px,calc(100vw - 24px));max-height:75vh;overflow:auto;box-sizing:border-box;',
      'background:#161D1A;color:#F2F5F0;border:1px solid #3A4740;border-radius:22px;padding:14px 16px 16px;',
      'font:14px/1.4 Montserrat,system-ui,sans-serif;box-shadow:0 20px 50px rgba(0,0,0,.5);display:none}',
      '#tw-pan.ab{display:block}',
      '#tw-pan h3{margin:0 0 8px;font:600 18px Oswald,system-ui,sans-serif;display:flex;justify-content:space-between;align-items:center}',
      '#tw-pan h4{margin:14px 0 6px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#8FA39A}',
      '#tw-pan label{display:block;margin:8px 0 4px;font-weight:600}',
      '#tw-pan .ops{display:flex;flex-wrap:wrap;gap:6px}',
      '#tw-pan .op{border:1px solid #3A4740;background:transparent;color:#F2F5F0;border-radius:999px;padding:8px 12px;font:600 13px Montserrat,system-ui,sans-serif;min-height:36px}',
      '#tw-pan .op.on{background:#F39200;border-color:#F39200;color:#10140F}',
      '#tw-pan input[type=range]{width:100%;accent-color:#F39200}',
      '#tw-pan .fila{display:flex;gap:8px;margin-top:14px;flex-wrap:wrap}',
      '#tw-pan .fila a,#tw-pan .fila button{flex:1;text-align:center;border:1px solid #3A4740;background:#0E1311;color:#F2F5F0;border-radius:14px;padding:10px;font:600 13px Montserrat,system-ui,sans-serif;text-decoration:none}',
      '#tw-x{border:0;background:transparent;color:#8FA39A;font-size:22px;cursor:pointer}'
    ].join('');
    document.head.appendChild(s);
  }

  function nombre(k) {
    var n = { paleta: 'Paleta', tema: 'Tema', plan: 'Plan', primerIngreso: 'Primer ingreso (consentimientos)',
      descansoSeg: 'Descanso entre series', halo: 'Halo de respiración', inicioDeMes: 'Inicio de mes',
      avanzarDias: 'Avanzar días', seccionInicial: 'Sección inicial' }[k];
    return n || k;
  }

  function construir() {
    var M = meta();
    var pan = document.getElementById('tw-pan');
    var h = '<h3>Tweaks <button id="tw-x" aria-label="Cerrar">×</button></h3>';
    var porSeccion = {};
    Object.keys(M).forEach(function (k) { var sec = M[k].section || 'General'; (porSeccion[sec] = porSeccion[sec] || []).push(k); });
    Object.keys(porSeccion).forEach(function (sec) {
      h += '<h4>' + sec + '</h4>';
      porSeccion[sec].forEach(function (k) {
        var m = M[k], v = k in valores ? valores[k] : m.default;
        if (m.editor === 'enum') {
          h += '<label>' + nombre(k) + '</label><div class="ops">' + m.options.map(function (o) {
            return '<button class="op' + (o === v ? ' on' : '') + '" data-k="' + k + '" data-v="' + o + '">' + o + '</button>';
          }).join('') + '</div>';
        } else if (m.editor === 'boolean') {
          h += '<label>' + nombre(k) + '</label><div class="ops">' +
            '<button class="op' + (v ? ' on' : '') + '" data-k="' + k + '" data-b="1">Sí</button>' +
            '<button class="op' + (!v ? ' on' : '') + '" data-k="' + k + '" data-b="0">No</button></div>';
        } else if (m.editor === 'range') {
          h += '<label>' + nombre(k) + ': <span id="tw-v-' + k + '">' + v + (m.unit || '') + '</span></label>' +
            '<input type="range" data-k="' + k + '" min="' + m.min + '" max="' + m.max + '" step="' + (m.step || 1) + '" value="' + v + '">';
        }
      });
    });
    if (esApp) {
      var aj = leer(CLAVE_AJUSTE, true);
      h += '<h4>Vista</h4><label>Ajustar el teléfono a la pantalla</label><div class="ops">' +
        '<button class="op' + (aj ? ' on' : '') + '" data-aj="1">Sí</button><button class="op' + (!aj ? ' on' : '') + '" data-aj="0">No</button></div>';
    }
    h += '<div class="fila"><a href="' + (esApp ? 'panel.dc.html' : 'app.dc.html') + '">Ir a ' + (esApp ? 'Panel de Sol' : 'App alumna') + '</a>' +
      '<button id="tw-reset">Restablecer tweaks</button></div>' +
      '<div class="fila"><button id="tw-datos">Borrar datos de prueba</button></div>';
    pan.innerHTML = h;
  }

  function montar() {
    css();
    var btn = document.createElement('button');
    btn.id = 'tw-btn'; btn.type = 'button'; btn.textContent = '⚙'; btn.setAttribute('aria-label', 'Tweaks');
    var pos = leer(CLAVE_POS, null);
    btn.style.right = '14px'; btn.style.top = '40%';
    if (pos) { btn.style.right = 'auto'; btn.style.left = pos.x + 'px'; btn.style.top = pos.y + 'px'; }
    var pan = document.createElement('div'); pan.id = 'tw-pan';
    document.body.appendChild(btn); document.body.appendChild(pan);
    construir();

    // Arrastrar el botón (mouse y dedo); un toque sin moverse abre el menú.
    var ini = null, movido = false;
    btn.addEventListener('pointerdown', function (e) {
      var r = btn.getBoundingClientRect();
      ini = { x: e.clientX, y: e.clientY, l: r.left, t: r.top }; movido = false;
      btn.setPointerCapture(e.pointerId);
    });
    btn.addEventListener('pointermove', function (e) {
      if (!ini) return;
      var dx = e.clientX - ini.x, dy = e.clientY - ini.y;
      if (Math.abs(dx) + Math.abs(dy) > 6) movido = true;
      if (!movido) return;
      var x = Math.max(0, Math.min(window.innerWidth - 52, ini.l + dx));
      var y = Math.max(0, Math.min(window.innerHeight - 52, ini.t + dy));
      btn.style.right = 'auto'; btn.style.left = x + 'px'; btn.style.top = y + 'px';
    });
    btn.addEventListener('pointerup', function () {
      if (!ini) return;
      if (movido) { var r = btn.getBoundingClientRect(); guardar(CLAVE_POS, { x: Math.round(r.left), y: Math.round(r.top) }); }
      else { construir(); pan.classList.toggle('ab'); }
      ini = null;
    });

    pan.addEventListener('click', function (e) {
      var t = e.target;
      if (t.id === 'tw-x') { pan.classList.remove('ab'); return; }
      if (t.id === 'tw-reset') { valores = {}; guardar(CLAVE, valores); aplicar(); construir(); return; }
      if (t.id === 'tw-datos') {
        if (confirm('¿Borrar los datos de prueba guardados en este teléfono (rutinas, chat, comidas)?')) {
          try { localStorage.removeItem('solfit_sync'); } catch (err) {}
          location.reload();
        }
        return;
      }
      if (t.dataset.aj) { guardar(CLAVE_AJUSTE, t.dataset.aj === '1'); ajustar(); construir(); return; }
      if (t.dataset.k) {
        valores[t.dataset.k] = t.dataset.b ? t.dataset.b === '1' : t.dataset.v;
        guardar(CLAVE, valores); aplicar(); construir();
      }
    });
    pan.addEventListener('input', function (e) {
      var t = e.target; if (!t.dataset.k) return;
      var M = meta()[t.dataset.k] || {};
      valores[t.dataset.k] = Number(t.value);
      var lab = document.getElementById('tw-v-' + t.dataset.k); if (lab) lab.textContent = t.value + (M.unit || '');
      guardar(CLAVE, valores); aplicar();
    });
  }

  // Espera a que el prototipo arranque, aplica lo guardado y monta el menú.
  var intentos = 0;
  (function esperar() {
    if (aplicar() && document.getElementById('dc-root')) {
      if (document.body) montar();
      setTimeout(ajustar, 300); setTimeout(ajustar, 1500);
      window.addEventListener('resize', ajustar);
      return;
    }
    if (++intentos < 200) setTimeout(esperar, 100);
  })();
})();
