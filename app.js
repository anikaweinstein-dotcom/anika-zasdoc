// Dibuja la página con lo que hay en datos.js. No hace falta tocar este archivo.
(function () {
  var d = window.DATOS || {};
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var MESES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  var fecha = function (iso) {
    var p = String(iso || "").split("-");
    if (p.length < 2) return esc(iso);
    var m = MESES[parseInt(p[1], 10) - 1] || "";
    return p.length === 3 ? parseInt(p[2], 10) + " de " + m + " " + p[0] : m + " " + p[0];
  };

  // Colores y tipografía de la marca
  var c = d.colores || {};
  var r = document.documentElement.style;
  if (c.marca) r.setProperty("--marca", c.marca);
  if (c.acento) r.setProperty("--acento", c.acento);
  if (c.tinta) r.setProperty("--tinta", c.tinta);
  if (c.fondo) r.setProperty("--fondo", c.fondo);
  if (d.fuente) {
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=" + encodeURIComponent(d.fuente) + ":wght@400;500;700;800&display=swap";
    document.head.appendChild(l);
    r.setProperty("--fuente", "'" + d.fuente + "', system-ui, sans-serif");
  }

  document.title = (d.cliente || "Cliente") + " · Avances con " + (d.yo || "Anika");
  $("kicker").textContent = (d.cliente || "") + " × " + (d.yo || "Anika");
  $("titulo").textContent = d.titulo || "Avances del proyecto";
  $("sub").textContent = d.resumen || "";
  $("meta").textContent = d.actualizado ? "Actualizado el " + fecha(d.actualizado) : "";

  var hide = function (id, list) { if (!list || !list.length) $(id).style.display = "none"; return list || []; };

  $("logros").innerHTML = hide("sec-logros", d.logros).map(function (x) {
    return '<div class="stat"><div class="num">' + esc(x.numero) + '</div><div class="lbl">' + esc(x.texto) + "</div></div>";
  }).join("");

  var ESTADOS = { hecho: "Logrado", curso: "En curso", pendiente: "Por empezar" };
  $("objetivos").innerHTML = hide("sec-objetivos", d.objetivos).map(function (x) {
    var e = x.estado || "pendiente";
    var pct = typeof x.progreso === "number" ? Math.max(0, Math.min(100, x.progreso)) : (e === "hecho" ? 100 : null);
    return '<div class="goal"><div class="goal-top"><span class="goal-name">' + esc(x.titulo) + '</span>' +
      '<span class="badge ' + esc(e) + '">' + (ESTADOS[e] || esc(e)) + (pct != null && e !== "hecho" ? " · " + pct + "%" : "") + "</span></div>" +
      (x.detalle ? '<p class="goal-desc">' + esc(x.detalle) + "</p>" : "") +
      (pct != null ? '<div class="bar"><span style="width:' + pct + '%"></span></div>' : "") + "</div>";
  }).join("");

  var av = hide("sec-avances", d.avances).slice().sort(function (a, b) { return String(b.fecha).localeCompare(String(a.fecha)); });
  $("avances").innerHTML = av.map(function (x) {
    var link = x.link && /^https?:\/\//.test(x.link)
      ? '<a class="t-link" href="' + esc(x.link) + '" target="_blank" rel="noopener">' + esc(x.textoLink || "Ver") + " →</a>" : "";
    return '<li><div class="t-date">' + fecha(x.fecha) + '</div><div class="t-title">' + esc(x.titulo) + "</div>" +
      (x.detalle ? '<p class="t-text">' + esc(x.detalle) + "</p>" : "") + link + "</li>";
  }).join("");

  $("proximos").innerHTML = hide("sec-proximos", d.proximos).map(function (x) {
    return "<li>" + esc(x) + "</li>";
  }).join("");

  $("pie").innerHTML = "Edición y contenido: " + esc(d.yo || "Anika") +
    (d.contacto ? ' · <a href="' + esc(d.contacto) + '" target="_blank" rel="noopener">Contacto</a>' : "");
})();
