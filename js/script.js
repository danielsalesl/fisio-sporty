(function () {
  var NUM = "5587998027603";
  document.querySelectorAll("[data-wa]").forEach(function (a) {
    a.href = "https://wa.me/" + NUM + "?text=" + encodeURIComponent(a.getAttribute("data-wa"));
    a.target = "_blank";
    a.rel = "noopener";
  });
  var r = document.getElementById("car");
  if (!r) return;
  var s = r.querySelectorAll(".sl"), i = 0;
  if (s.length < 2) return;
  setInterval(function () {
    s[i].classList.remove("on");
    i = (i + 1) % s.length;
    s[i].classList.add("on");
  }, 3000);
})();
