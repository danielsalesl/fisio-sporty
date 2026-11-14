// Melhorias progressivas. O site funciona sem este arquivo: todos os CTAs já são links wa.me no HTML.
(function () {
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
