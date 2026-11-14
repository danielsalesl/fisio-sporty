// Melhorias progressivas. O site funciona sem este arquivo: todos os CTAs já são links wa.me no HTML.
(function () {
  // CTA persistente: só aparece depois que o CTA do hero sai da tela, para não duplicar na mesma dobra.
  var bar = document.getElementById("bar");
  var heroCta = document.getElementById("hero-cta");
  if (bar && heroCta) {
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        var e = entries[0];
        bar.classList.toggle("show", !e.isIntersecting && e.boundingClientRect.top < 0);
      }).observe(heroCta);
    } else {
      bar.classList.add("show");
    }
  }

  // Mapa: o iframe do Google Maps só carrega quando o paciente pede.
  var map = document.getElementById("map");
  var btn = document.getElementById("map-btn");
  if (map && btn) {
    btn.addEventListener("click", function (ev) {
      ev.preventDefault();
      var f = document.createElement("iframe");
      // TODO: trocar a busca pelo endereço exato da clínica quando o cliente informar.
      f.src = "https://www.google.com/maps?q=" + encodeURIComponent("Fisio Sporty, Pesqueira - PE") + "&output=embed";
      f.title = "Mapa: localização da Fisio Sporty em Pesqueira-PE";
      f.loading = "lazy";
      f.referrerPolicy = "no-referrer-when-downgrade";
      f.setAttribute("allowfullscreen", "");
      map.replaceChildren(f);
      map.classList.add("on");
      var link = document.createElement("a");
      link.className = "link map-out";
      link.href = btn.href;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = "Abrir no app de mapas →";
      map.after(link);
      f.focus();
    });
  }
})();
