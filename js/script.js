// Melhorias progressivas. O site funciona sem este arquivo: todos os CTAs já são links no HTML.
(function () {
  // Mapa interativo do Google: entra sozinho quando a seção "Como chegar" se aproxima da tela
  // (ou na hora, se o paciente tocar no botão). Nunca carrega junto com a página.
  var map = document.getElementById("map");
  var btn = document.getElementById("map-btn");
  if (!map || !btn) return;

  var loaded = false;
  function load() {
    if (loaded) return;
    loaded = true;
    var f = document.createElement("iframe");
    f.src = "https://www.google.com/maps?q=" + encodeURIComponent(map.getAttribute("data-q")) + "&z=16&hl=pt-BR&output=embed";
    f.title = "Mapa interativo: Fisio Sporty, Av. Dom Adalberto Sobral, Prado, Pesqueira-PE";
    f.referrerPolicy = "no-referrer-when-downgrade";
    f.setAttribute("allowfullscreen", "");
    map.replaceChildren(f);
    map.classList.add("on");
  }

  btn.addEventListener("click", function (ev) {
    ev.preventDefault();
    load();
  });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        io.disconnect();
        load();
      }
    }, { rootMargin: "400px 0px" });
    io.observe(map);
  }
})();
