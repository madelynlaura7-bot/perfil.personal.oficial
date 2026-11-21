(function ($) {
  'use strict';

  /* ================================================================
     DATOS PERSONALES: editá solo este bloque para cambiar la página.
     Todo se muestra con .text(); el HTML dinámico pasa antes por DOMPurify (anti-XSS).
     ================================================================ */
  var PERFIL = {
    nombre: 'Madelyn Jassiel Laura Condori',
    carrera: 'Ing. Sistemas · UPDS La Paz',
    frase: 'Entre clases, trabajo, fútbol y gym, siempre encuentro tiempo para jugar.',
    insignias: ['⚽ Fútbol', '💪 Gym', '💻 Sistemas', '📍 La Paz, BO'],
    pasatiempos: ['Jugar fútbol', 'Ir al gym', 'Caminar', 'Jugar videojuegos'],
    intereses: ['Programación web', 'Videojuegos móviles', 'Música urbana y corridos'],
    // Completar cuando tengas los datos (dejá '' si todavía no los tenés)
    redes: [
      { icono: '📷', nombre: 'Instagram', detalle: '', url: '' },
      { icono: '🐙', nombre: 'GitHub', detalle: 'madelynlaura7-bot', url: 'https://github.com/madelynlaura7-bot' },
      { icono: '💬', nombre: 'WhatsApp', detalle: '', url: '' }
    ],
    whatsapp: '' // ejemplo: '59171234567' (código de país + número, sin + ni espacios)
  };

  var HORARIO = [
    {
      bloque: '🌅 Mañana',
      filas: [
        ['07:00', 'Salgo de casa'],
        ['08:30', 'Llego a la universidad y tomo clases'],
        ['10:00 – 10:15', 'Receso'],
        ['10:15 – 11:45', 'Vuelvo a clases'],
        ['11:45', 'Salgo de la U y me voy a casa']
      ]
    },
    {
      bloque: '☀️ Tarde',
      filas: [
        ['11:45 – 16:30', 'En casa'],
        ['16:30', 'Empiezo mi trabajo']
      ]
    },
    {
      bloque: '🌙 Noche',
      filas: [
        ['hasta 22:30', 'Trabajo'],
        ['23:10', 'Llego a casa'],
        ['Después', 'Duermo o hago tareas']
      ]
    },
    {
      bloque: '🛌 Domingo',
      ancho: true,
      filas: [['Todo el día', 'Descanso o hago mis tareas']]
    }
  ];

  var MUSICA = [
    {
      grupo: '🎤 Corridos',
      items: [
        { titulo: 'Fuerza Régida', texto: 'Mis corridos de todos los días.', busqueda: 'Fuerza Regida' },
        { titulo: 'Tito Double P', texto: 'Corridos para escuchar en el camino.', busqueda: 'Tito Double P' }
      ]
    },
    {
      grupo: '🔥 Reggaetón',
      items: [
        { titulo: 'Reggaetón', texto: 'Para entrenar en el gym y para bailar.', busqueda: 'reggaeton mix' }
      ]
    }
  ];

  var JUEGOS = [
    { titulo: 'Free Fire', texto: 'Batalla real móvil: sobrevivir hasta el final.', img: 'img/free-fire.svg', url: 'https://ff.garena.com' },
    { titulo: 'Mobile Legends', texto: 'MOBA 5 vs 5 para jugar en equipo desde el celular.', img: 'img/mobile-legends.svg', url: 'https://m.mobilelegends.com' },
    { titulo: 'Minecraft', texto: 'Construir, explorar y sobrevivir en mundos infinitos.', img: 'img/minecraft.svg', url: 'https://www.minecraft.net' }
  ];

  var VIDEOS = [
    { titulo: 'Video 1', texto: 'Un clip mío con edición y música.', src: 'videos/clip-1.mp4', poster: 'videos/clip-1.jpg' },
    { titulo: 'Video 2', texto: 'Mis momentos del día a día.', src: 'videos/clip-2.mp4', poster: 'videos/clip-2.jpg' },
    { titulo: 'Video 3', texto: 'Otro clip de mi galería.', src: 'videos/clip-3.mp4', poster: 'videos/clip-3.jpg' },
    { titulo: 'Video 4', texto: 'Un recuerdo para guardar.', src: 'videos/clip-4.mp4', poster: 'videos/clip-4.jpg' },
    { titulo: 'Video 5', texto: 'Un clip con mi música favorita.', src: 'videos/clip-5.mp4', poster: 'videos/clip-5.jpg' }
  ];

  var CLAVE_MSJ = 'hud.mensajes';
  var CLAVE_FAV = 'hud.favoritos';
  var CATALOGO = [];

  /* ================= Utilidades ================= */

  function leer(clave) {
    try { return JSON.parse(localStorage.getItem(clave)) || []; } catch (e) { return []; }
  }
  function guardar(clave, valor) {
    try { localStorage.setItem(clave, JSON.stringify(valor)); } catch (e) { /* sin almacenamiento */ }
  }

  // DOMPurify: todo HTML dinámico (JSON/BD) se sanitiza antes de inyectarlo con .html()
  function renderizarDetalleSeguro(htmlDesdeServidor) {
    var limpio = window.DOMPurify
      ? DOMPurify.sanitize(htmlDesdeServidor)
      : $('<div>').text(htmlDesdeServidor).html(); // respaldo: si DOMPurify no cargó, se escapa como texto
    $('#detalleProyecto').html(limpio);
  }

  /* ================= Render seguro (solo .text()) ================= */

  function renderPerfil() {
    $('#nombre').text(PERFIL.nombre);
    $('#carrera').text(PERFIL.carrera);
    $('#frase').text(PERFIL.frase);

    var $ins = $('#insignias').empty();
    PERFIL.insignias.forEach(function (t) { $ins.append($('<li>').addClass('hud__insignia').text(t)); });

    ['pasatiempos', 'intereses'].forEach(function (k) {
      var $ul = $('#' + k).empty();
      PERFIL[k].forEach(function (t) {
        $ul.append($('<li>').addClass('chips__item').append($('<span>').addClass('chips__texto').text(t)));
      });
    });
  }

  function renderHorario() {
    var $cont = $('#horario').empty();
    HORARIO.forEach(function (b) {
      var $bloque = $('<article>').addClass('horario__bloque').toggleClass('horario__bloque--ancho', !!b.ancho);
      $bloque.append($('<h3>').addClass('horario__titulo').text(b.bloque));
      b.filas.forEach(function (f) {
        $bloque.append(
          $('<div>').addClass('horario__fila')
            .append($('<span>').addClass('horario__hora').text(f[0]))
            .append($('<span>').addClass('horario__actividad').text(f[1]))
        );
      });
      $cont.append($bloque);
    });
  }

  function enlace(texto, url) {
    return $('<a>').addClass('boton u-tactil').attr({ target: '_blank', rel: 'noopener', href: url }).text(texto);
  }

  function renderMusica() {
    var $cont = $('#musica').empty();
    MUSICA.forEach(function (g) {
      $cont.append($('<h3>').addClass('grupo__titulo').text(g.grupo));
      var $grid = $('<ul>').addClass('rejilla');
      g.items.forEach(function (m) {
        var q = encodeURIComponent(m.busqueda);
        $grid.append(
          $('<li>').addClass('tarjeta').append(
            $('<div>').addClass('tarjeta__cuerpo')
              .append($('<h4>').addClass('tarjeta__titulo u-truncado').text(m.titulo))
              .append($('<p>').addClass('tarjeta__texto u-2-lineas').text(m.texto))
              .append(
                $('<div>').addClass('tarjeta__enlaces')
                  .append(enlace('YouTube', 'https://www.youtube.com/results?search_query=' + q))
                  .append(enlace('Spotify', 'https://open.spotify.com/search/' + q))
              )
          )
        );
      });
      $cont.append($grid);
    });
  }

  function imagenTarjeta(src, alt, w, h) {
    // width/height + aspect-ratio reservan espacio: evita saltos de diseño (CLS ≤ 0.1)
    return $('<img>').addClass('tarjeta__imagen').attr({ src: src, alt: alt, loading: 'lazy', decoding: 'async', width: w, height: h });
  }

  function renderJuegos() {
    var $ul = $('#juegos').empty();
    JUEGOS.forEach(function (j) {
      $ul.append(
        $('<li>').addClass('tarjeta').append(imagenTarjeta(j.img, 'Portada de ' + j.titulo, 320, 180)).append(
          $('<div>').addClass('tarjeta__cuerpo')
            .append($('<h3>').addClass('tarjeta__titulo u-truncado').text(j.titulo))
            .append($('<p>').addClass('tarjeta__texto u-2-lineas').text(j.texto))
            .append(enlace('Ver juego', j.url))
        )
      );
    });
  }

  // Cada video solo se descarga cuando la persona toca "reproducir"
  function renderVideos() {
    var $ul = $('#videos').empty();
    VIDEOS.forEach(function (v) {
      var $img = $('<img>').addClass('clip__imagen')
        .attr({ src: v.poster, alt: 'Vista previa de ' + v.titulo, loading: 'lazy', decoding: 'async', width: 360, height: 480 });
      var $btn = $('<button>').addClass('clip__reproducir u-tactil')
        .attr({ type: 'button', 'data-src': v.src, 'data-poster': v.poster, 'aria-label': 'Reproducir ' + v.titulo })
        .append($('<span>').addClass('clip__icono').attr('aria-hidden', 'true').text('▶'));
      $ul.append(
        $('<li>').addClass('tarjeta')
          .append($('<div>').addClass('clip').append($img).append($btn))
          .append(
            $('<div>').addClass('tarjeta__cuerpo')
              .append($('<h3>').addClass('tarjeta__titulo u-truncado').text(v.titulo))
              .append($('<p>').addClass('tarjeta__texto u-2-lineas').text(v.texto))
          )
      );
    });
  }

  function renderRedes() {
    var $ul = $('#redes').empty();
    PERFIL.redes.forEach(function (r) {
      var activo = !!r.url;
      var $a = $('<a>').addClass('boton boton--bloque u-tactil').attr({ target: '_blank', rel: 'noopener' })
        .append($('<span>').attr('aria-hidden', 'true').text(r.icono))
        .append($('<span>').text(r.nombre))
        .append($('<span>').addClass('boton__detalle u-truncado').text(activo ? r.detalle : 'Pendiente'));
      if (activo) { $a.attr('href', r.url); } else { $a.attr({ 'aria-disabled': 'true', role: 'link' }); }
      $ul.append($('<li>').addClass('redes__item').append($a));
    });
  }

  /* ================= Catálogo asíncrono (fetch + lazy + filtro de 3 capas) ================= */

  function favoritos() { return leer(CLAVE_FAV); }

  function tarjetaCatalogo(it) {
    var esFav = favoritos().indexOf(it.id) !== -1;
    return $('<li>').addClass('tarjeta tarjeta--catalogo').attr('data-id', it.id).append(
      imagenTarjeta(it.portada, 'Imagen de ' + it.titulo, 320, 180),
      $('<div>').addClass('tarjeta__cuerpo')
        .append($('<h3>').addClass('tarjeta__titulo u-truncado').text(it.titulo).attr('title', it.titulo))
        .append($('<p>').addClass('tarjeta__meta u-truncado').text(it.area + ' • ' + it.subarea))
        .append($('<p>').addClass('tarjeta__texto u-2-lineas').text(it.texto))
        .append(
          $('<div>').addClass('tarjeta__enlaces')
            .append($('<button>').attr('type', 'button').addClass('tarjeta__boton tarjeta__boton--destacado u-tactil').toggleClass('tarjeta__boton--activo', esFav).text(esFav ? '★ Favorito' : '☆ Favorito'))
            .append($('<button>').attr('type', 'button').addClass('tarjeta__boton tarjeta__boton--detalle u-tactil').text('Ver detalle'))
        )
    );
  }

  function pintarCatalogo() {
    var a = $('#capa1').val(), s = $('#capa2').val();
    var lista = CATALOGO.filter(function (it) { return (!a || it.area === a) && (!s || it.subarea === s); });
    var $ul = $('#catalogoLista').empty();
    lista.forEach(function (it) { $ul.append(tarjetaCatalogo(it)); });
    var txt = 'Capa 3 · ' + lista.length + ' de ' + CATALOGO.length + ' elementos';
    if (a) { txt += ' en ' + a + (s ? ' › ' + s : ''); }
    $('#resultadoFiltro').text(txt);
  }

  function llenarCapa1() {
    var vistos = [];
    CATALOGO.forEach(function (it) { if (vistos.indexOf(it.area) === -1) { vistos.push(it.area); } });
    var $c1 = $('#capa1').empty().append($('<option>').val('').text('-- Todas las áreas --'));
    vistos.forEach(function (a) { $c1.append($('<option>').val(a).text(a)); });
  }

  function cargarCatalogo() {
    $('#resultadoFiltro').text('Cargando catálogo…');
    fetch('data/catalogo.json')
      .then(function (res) {
        if (!res.ok) { throw new Error('Error al cargar el catálogo (' + res.status + ')'); }
        return res.json();
      })
      .then(function (datos) { CATALOGO = datos; llenarCapa1(); pintarCatalogo(); })
      .catch(function (err) {
        console.error('Fallo en catálogo:', err);
        $('#resultadoFiltro').text('No se pudo cargar el catálogo. Revisa tu conexión.');
      });
  }

  // Cascada: la capa 2 depende de la capa 1 (.off() antes de .on(): sin listeners duplicados)
  $('#capa1').off('change.capas').on('change.capas', function () {
    var a = $(this).val(), $c2 = $('#capa2');
    $c2.empty().append($('<option>').val('').text('-- Todas las subáreas --')).prop('disabled', !a);
    if (a) {
      var vistos = [];
      CATALOGO.forEach(function (it) {
        if (it.area === a && vistos.indexOf(it.subarea) === -1) { vistos.push(it.subarea); $c2.append($('<option>').val(it.subarea).text(it.subarea)); }
      });
    } else {
      $c2.empty().append($('<option>').val('').text('-- Primero elija área --'));
    }
    pintarCatalogo();
  });
  $('#capa2').off('change.capas').on('change.capas', pintarCatalogo);

  // Delegación por Event Bubbling: un único listener para todas las tarjetas
  $('#catalogoLista').off('click.cat')
    .on('click.cat', '.tarjeta__boton--destacado', function () {
      var id = $(this).closest('.tarjeta').data('id');
      var fav = favoritos(), i = fav.indexOf(id);
      if (i === -1) { fav.push(id); } else { fav.splice(i, 1); }
      guardar(CLAVE_FAV, fav);
      $(this).toggleClass('tarjeta__boton--activo', i === -1).text(i === -1 ? '★ Favorito' : '☆ Favorito');
    })
    .on('click.cat', '.tarjeta__boton--detalle', function () {
      var id = $(this).closest('.tarjeta').data('id');
      var it = CATALOGO.filter(function (x) { return x.id === id; })[0];
      if (!it) { return; }
      $('#detalleTitulo').text(it.titulo);
      renderizarDetalleSeguro(it.descripcionHtml || '');
      $('#detalleCard').removeAttr('hidden').hide().slideDown(200);
      $('#detalleCard')[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

  /* ================= Estado de red (Offline-First) ================= */

  function avisar(texto) {
    $('#successAlert').stop(true, true).text(texto).slideDown(250).delay(3000).slideUp(250);
  }

  function actualizarEstadoRed() {
    var $e = $('#estadoRed').removeClass('hud__red--online hud__red--offline');
    if (navigator.onLine) {
      $e.addClass('hud__red--online').text('● En línea');
      sincronizarMensajes();
    } else {
      $e.addClass('hud__red--offline').text('● Modo offline (datos locales)');
    }
  }

  function sincronizarMensajes() {
    var lista = leer(CLAVE_MSJ), n = 0;
    lista.forEach(function (m) { if (m.estado === 'pendiente') { m.estado = 'enviado'; n++; } });
    if (n) { guardar(CLAVE_MSJ, lista); avisar('✓ ' + n + ' mensaje(s) verificado(s) al volver la conexión.'); }
  }

  $(window).off('online.red offline.red').on('online.red offline.red', actualizarEstadoRed);

  /* ================= Eventos (delegación + .off().on()) ================= */

  function mostrarPanel(nombre) {
    $('.panel').attr('hidden', true);
    $('#panel-' + nombre).removeAttr('hidden');
    $('#dock .dock__boton').removeClass('dock__boton--activo').removeAttr('aria-current');
    $('#dock .dock__boton[data-panel="' + nombre + '"]').addClass('dock__boton--activo').attr('aria-current', 'page');
    window.scrollTo(0, 0);
  }

  $('#dock').off('click.nav').on('click.nav', '.dock__boton', function () {
    mostrarPanel($(this).data('panel'));
  });

  // Reproducir video: se crea el <video> solo al tocar el botón
  $('#videos').off('click.video').on('click.video', '.clip__reproducir', function () {
    var $btn = $(this);
    var $video = $('<video>').addClass('clip__video').attr({ controls: true, playsinline: true, preload: 'metadata', poster: $btn.attr('data-poster'), src: $btn.attr('data-src') });
    $btn.closest('.clip').empty().append($video);
    $video[0].play().catch(function () {});
  });

  $('#redes').off('click.redes').on('click.redes', 'a[aria-disabled="true"]', function (e) { e.preventDefault(); });

  // Teclado virtual: se oculta el dock mientras se escribe
  $('#form-contacto')
    .off('focusin.kb focusout.kb')
    .on('focusin.kb', 'input, textarea', function () { $('body').addClass('pagina--teclado'); })
    .on('focusout.kb', 'input, textarea', function () {
      // Pequeña espera: si el toque cae en "Enviar", el dock no reaparece justo debajo del dedo
      setTimeout(function () {
        if (!$('#form-contacto').find('input:focus, textarea:focus').length) { $('body').removeClass('pagina--teclado'); }
      }, 300);
    });

  $('#foto').off('error.foto').on('error.foto', function () {
    if (this.getAttribute('src') !== 'img/avatar.svg') { this.setAttribute('src', 'img/avatar.svg'); }
  });

  /* ---------- Formulario: validación en tiempo real ---------- */

  var REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validarCampo($input, $error, valido) {
    $input.attr('aria-invalid', valido ? 'false' : 'true');
    if (valido) { $error.stop(true, true).fadeOut(200); } else { $error.stop(true, true).fadeIn(200); }
    return valido;
  }
  function validarNombre() { return validarCampo($('#f-nombre'), $('#errNombre'), $.trim($('#f-nombre').val()) !== ''); }
  function validarCorreo() { return validarCampo($('#f-correo'), $('#errCorreo'), REGEX_CORREO.test($.trim($('#f-correo').val()))); }
  function validarMensaje() { return validarCampo($('#f-mensaje'), $('#errMensaje'), $.trim($('#f-mensaje').val()) !== ''); }

  $('#form-contacto')
    .off('input.val')
    .on('input.val', '#f-nombre', validarNombre)
    .on('input.val', '#f-correo', validarCorreo)
    .on('input.val', '#f-mensaje', validarMensaje);

  $('#form-contacto').off('submit.envio').on('submit.envio', function (e) {
    e.preventDefault();
    var ok = [validarNombre(), validarCorreo(), validarMensaje()].every(Boolean);
    if (!ok) { return; }

    var nombre = $.trim($('#f-nombre').val());
    var correo = $.trim($('#f-correo').val());
    var mensaje = $.trim($('#f-mensaje').val());
    var texto = 'Hola, soy ' + nombre + ' (' + correo + '). ' + mensaje;
    $('#vp-texto').text(texto); // .text(): nunca se interpreta como HTML

    var $enlace = $('#vp-enlace');
    if (PERFIL.whatsapp) {
      $enlace.attr('href', 'https://wa.me/' + PERFIL.whatsapp + '?text=' + encodeURIComponent(texto)).show();
    } else {
      $enlace.hide();
    }
    $('#vista-previa').removeAttr('hidden');

    // Offline-First: se guarda primero en el dispositivo; sin red queda "pendiente de envío"
    var lista = leer(CLAVE_MSJ);
    lista.push({ texto: texto, fecha: Date.now(), estado: navigator.onLine ? 'enviado' : 'pendiente' });
    guardar(CLAVE_MSJ, lista);
    avisar(navigator.onLine ? '✓ Mensaje listo para enviar.' : 'Guardado localmente · Pendiente de envío');

    this.reset();
    $('.formulario__error').hide();
    $('#form-contacto input, #form-contacto textarea').removeAttr('aria-invalid');
  });

  /* ================= Inicio (hidratación) ================= */

  renderPerfil();
  renderHorario();
  renderMusica();
  renderVideos();
  renderJuegos();
  renderRedes();
  cargarCatalogo();
  actualizarEstadoRed();
  $('#stage').attr('data-hidratado', 'true');

  function registrarSW() {
    navigator.serviceWorker.register('./sw.js', { scope: './' })
      .then(function (reg) { console.log('SW activo en alcance:', reg.scope); })
      .catch(function (err) { console.error('Error SW:', err); });
  }
  if ('serviceWorker' in navigator) {
    if (document.readyState === 'complete') { registrarSW(); } else { window.addEventListener('load', registrarSW); }
  }
})(jQuery);
