// Menú de tweaks para ver el prototipo fuera de Claude Design.
// Lee las opciones (data-props) del propio .dc.html, las aplica en vivo con
// __dcSetProps y las guarda en localStorage. El botón se puede arrastrar.
(function () {
  'use strict';
  var PAGINA = location.pathname.split('/').pop() || 'index';
  var CLAVE = 'solfit_tweaks:' + PAGINA;
  var CLAVE_POS = 'solfit_tweaks_pos';
  var CLAVE_AJUSTE = 'solfit_modo_app_v2';
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

  // Modo app: en el celular quita el marco del iPhone y llena la pantalla
  // (ancho de diseño 390 px escalado al ancho real; el alto se adapta).
  // Espacio que el diseño reserva para la barra de estado del iPhone: en Android
  // ya existe la barra real, así que se recorta (px de diseño).
  // El diseño deja ~50-68 px arriba para la barra del iPhone; se recortan 46
  // (quedan ~4-22 px). Si Android dibuja la página debajo de la barra de estado
  // (pantalla de borde a borde), se devuelve ese alto para no tapar nada.
  var RECORTE_BASE = 46;
  var RECORTE = RECORTE_BASE;
  function cssApp() {
    return [
      'html.modo-app,html.modo-app body{background:var(--sf-abajo,#fff)!important;overflow:hidden;height:100%;overscroll-behavior:none}',
      'html.modo-app [data-om-starter="ios-frame"]{border-radius:0!important;box-shadow:none!important}',
      // Como app nativa: sin el destello azul al tocar ni selección de texto al mantener apretado.
      'html.modo-app,html.modo-app *{-webkit-tap-highlight-color:transparent!important;-webkit-touch-callout:none!important;-webkit-user-select:none!important;user-select:none!important}',
      'html.modo-app input,html.modo-app textarea,html.modo-app [contenteditable="true"]{-webkit-user-select:text!important;user-select:text!important;-webkit-touch-callout:default!important}',
      'html.modo-app [data-om-starter="ios-frame"]>div:nth-child(1),',
      'html.modo-app [data-om-starter="ios-frame"]>div:nth-child(2),',
      'html.modo-app [data-om-starter="ios-frame"]>div:nth-child(4){display:none!important}',
      'html.modo-app [data-sf-cont]{margin-top:-' + RECORTE + 'px!important}',
      'html.modo-app [data-sf-cont] nav{padding-bottom:var(--sf-pie,6px)!important}',
      // Sin costuras: las franjas de arriba montan 1px sobre el cuerpo y el
      // fondo de la barra se alarga hacia abajo para tapar la rendija del borde.
      'html.modo-app [data-sf-cont] nav>span:nth-child(1),html.modo-app [data-sf-cont] nav>span:nth-child(2){height:9px!important}',
      'html.modo-app [data-sf-cont] nav::after{content:"";position:absolute;left:0;right:0;top:calc(100% - 2px);height:12px;background:var(--card);pointer-events:none}',
      // Animaciones infinitas fuera de la pantalla: en pausa (ver pausarOcultas).
      '[data-sf-quieta]{animation-play-state:paused!important}'
    ].join('');
  }

  // Los aros que giran (agua, respiración) y otras animaciones infinitas siguen
  // corriendo aunque estén en otra página del carrusel o en una tarjeta cerrada,
  // y le quitan cuadros a todo lo demás. Se pausan mientras no se ven.
  var ioAnim = ('IntersectionObserver' in window) ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) e.target.removeAttribute('data-sf-quieta');
      else e.target.setAttribute('data-sf-quieta', '');
    });
  }) : null;
  function pausarOcultas() {
    if (!ioAnim || !document.getAnimations) return;
    document.getAnimations().forEach(function (a) {
      var ef = a.effect, el = ef && ef.target;
      if (!el || el.__sfVigilada || ef.getTiming().iterations !== Infinity) return;
      el.__sfVigilada = true; ioAnim.observe(el);
    });
  }
  setInterval(function () { if (!document.hidden) pausarOcultas(); }, 1000);
  function ajustar() {
    if (!esApp) return;
    var frame = document.querySelector('[data-om-starter="ios-frame"]');
    if (!frame) return;
    var host = frame.closest('div[style*="min-height"]') || frame.parentElement;
    var contenido = frame.querySelector('[data-sf-cont]') || frame.querySelector('div[style*="height: 844px"]');
    if (contenido) contenido.setAttribute('data-sf-cont', '1');
    var on = leer(CLAVE_AJUSTE, true);
    var chico = Math.min(window.innerWidth, screen.width || 9999) < 600;
    var raiz = document.documentElement;
    // Escalado nativo del navegador (viewport de 390 px) en vez de CSS zoom:
    // el zoom obliga a recalcular todo en cada cuadro y baja los fps.
    var vp = document.querySelector('meta[name="viewport"]');
    var vpApp = 'width=390, user-scalable=no, viewport-fit=cover';
    var vpNormal = 'width=device-width, initial-scale=1, viewport-fit=cover';
    if (vp) { var quiero = (on && chico) ? vpApp : vpNormal; if (vp.getAttribute('content') !== quiero) vp.setAttribute('content', quiero); }
    if (on && chico) {
      var z = 1;
      RECORTE = Math.max(0, Math.round(RECORTE_BASE - inset('top') / z));
      var s = document.getElementById('sf-css-app');
      if (!s) { s = document.createElement('style'); s.id = 'sf-css-app'; document.head.appendChild(s); }
      s.textContent = cssApp();
      raiz.classList.add('modo-app');
      // La app llega hasta el borde de abajo; la barra de navegación de la app
      // se alarga lo que mida la barra de Android, para pintarla con su color.
      raiz.style.setProperty('--sf-pie', Math.round(6 + inset('bottom') / z) + 'px');
      var alto = Math.round(window.innerHeight / z) + 'px';
      host.style.padding = '0'; host.style.display = 'block'; host.style.minHeight = '0'; host.style.zoom = '';
      frame.style.height = alto;
      if (contenido) contenido.style.height = (parseInt(alto, 10) + RECORTE) + 'px';
    } else {
      raiz.classList.remove('modo-app');
      host.style.padding = ''; host.style.display = ''; host.style.minHeight = ''; host.style.zoom = '';
      frame.style.height = '844px';
      if (contenido) contenido.style.height = '844px';
    }
  }

  // Barras del sistema (arriba y abajo) con los colores de la app:
  // mide el color de lo que está pegado al borde superior e inferior.
  var sonda;
  function inset(lado) {
    if (!sonda) {
      sonda = document.createElement('div');
      sonda.style.cssText = 'position:fixed;left:0;bottom:0;width:0;height:0;visibility:hidden;pointer-events:none;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)';
      document.body.appendChild(sonda);
    }
    var cs = getComputedStyle(sonda);
    return parseFloat(lado === 'top' ? cs.paddingTop : cs.paddingBottom) || 0;
  }
  function insetAbajo() { return inset('bottom'); }
  function colorEn(x, y) {
    var el = document.elementFromPoint(x, y);
    while (el && el !== document.documentElement) {
      if (el.id !== 'tw-btn' && el.id !== 'tw-pan') {
        var c = getComputedStyle(el).backgroundColor;
        var m = c && c.match(/rgba?\(([^)]+)\)/);
        if (m) {
          var p = m[1].split(',').map(parseFloat);
          if (p.length < 4 || p[3] > 0.6) return 'rgb(' + Math.round(p[0]) + ',' + Math.round(p[1]) + ',' + Math.round(p[2]) + ')';
        }
      }
      el = el.parentElement;
    }
    return null;
  }
  var ultArriba = '', ultAbajo = '';
  function colorearBarras() {
    if (!document.body) return;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'theme-color'; document.head.appendChild(meta); }
    var x = 12;
    var arriba = colorEn(x, 2) || getComputedStyle(document.body).getPropertyValue('--bg').trim();
    // Abajo: si está la barra de navegación de la app, su color (--card).
    // Abajo: color de fondo de la barra de navegación de la app (sin tocar el DOM).
    var nav = document.querySelector('[data-sf-cont] nav');
    var abajo = null;
    if (nav) {
      var r = nav.getBoundingClientRect();
      if (r.height) abajo = colorEn(x, Math.min(window.innerHeight - 1, r.top + r.height / 2));
    }
    // Pantallas oscuras a pantalla completa (ejercicio, temporizador...): su fondo.
    if (!abajo) {
      var oscs = document.querySelectorAll('[data-oscuro="1"]');
      for (var i = 0; i < oscs.length && !abajo; i++) {
        var q = oscs[i].getBoundingClientRect();
        if (q.width > window.innerWidth * 0.9 && q.bottom >= window.innerHeight - 4 && q.top < window.innerHeight / 2) {
          var bg = getComputedStyle(oscs[i]).backgroundColor, mm = bg.match(/rgba?\(([^)]+)\)/);
          if (mm) { var pp = mm[1].split(',').map(parseFloat); if (pp.length < 4 || pp[3] > 0.6) abajo = 'rgb(' + Math.round(pp[0]) + ',' + Math.round(pp[1]) + ',' + Math.round(pp[2]) + ')'; }
        }
      }
    }
    abajo = abajo || colorEn(x, window.innerHeight - insetAbajo() - 2) || arriba;
    if (arriba && arriba !== ultArriba) { meta.setAttribute('content', arriba); ultArriba = arriba; }
    if (abajo && abajo !== ultAbajo) { document.documentElement.style.setProperty('--sf-abajo', abajo); ultAbajo = abajo; }
  }
  // Solo se mide después de tocar algo (cuando la pantalla terminó de cambiar)
  // y cada 3 s, para no interrumpir las animaciones.
  var tColor = null;
  var tColor2 = null;
  function colorLuego() { clearTimeout(tColor); clearTimeout(tColor2); tColor = setTimeout(colorearBarras, 700); tColor2 = setTimeout(colorearBarras, 1600); }
  window.addEventListener('pointerup', colorLuego, { passive: true });
  window.addEventListener('load', colorLuego);
  setInterval(function () { if (!document.hidden) colorearBarras(); }, 3000);

  // App instalable (PWA): service worker mínimo.
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('./sw.js').catch(function () {}); });
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
      h += '<h4>Vista</h4><label>Pantalla completa (sin marco de iPhone)</label><div class="ops">' +
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
      // Si el prototipo vuelve a dibujar el marco, se reaplica el modo app.
      var pend = null, root = document.getElementById('dc-root');
      new MutationObserver(function () {
        if (pend) return;
        pend = setTimeout(function () { pend = null; var f = document.querySelector('[data-om-starter="ios-frame"]'); if (f && !f.querySelector('[data-sf-cont]')) ajustar(); }, 50);
      }).observe(root, { childList: true, subtree: true });
      return;
    }
    if (++intentos < 200) setTimeout(esperar, 100);
  })();
})();
