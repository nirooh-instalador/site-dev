(function () {
  "use strict";

  document.body.classList.add("site-v3");
  document.querySelectorAll(".academy-banner").forEach(function (banner) { banner.hidden = true; });
  document.querySelectorAll("[data-year]").forEach(function (year) { year.textContent = new Date().getFullYear(); });

  var header = document.querySelector("header[data-header]");
  var toggle = header && header.querySelector("[data-global-menu-toggle]");
  var menu = header && header.querySelector("[data-global-nav]");
  toggle.addEventListener("click", function () {
    var open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    menu.classList.toggle("is-open", !open);
    document.body.classList.toggle("menu-open", !open);
  });

  menu.addEventListener("click", function (event) {
    if (!event.target.closest("a")) return;
    toggle.setAttribute("aria-expanded", "false");
    menu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  });

  window.addEventListener("scroll", function () {
    header.classList.toggle("is-scrolled", window.scrollY > 16);
  }, { passive: true });

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    document.querySelectorAll("[data-reveal]").forEach(function (element) { observer.observe(element); });
  } else {
    document.querySelectorAll("[data-reveal]").forEach(function (element) { element.classList.add("is-visible"); });
  }

  var heroNetworkTimers = [];
  var heroReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll("[data-hero-network]").forEach(function (network) {
    var orderedNodes = [".ssp-a", ".ssp-b", ".screen-b", ".screen-a"].map(function (selector) {
      return network.querySelector(".poes-node" + selector);
    }).filter(Boolean);
    var networkWindow = network.closest(".product-window");
    var networkStatus = networkWindow && networkWindow.querySelector("[data-network-status]");

    if (!orderedNodes.length) return;
    if (heroReducedMotion) {
      orderedNodes.forEach(function (node) { node.classList.add("is-active"); });
      if (networkStatus) networkStatus.textContent = "Rede mapeada";
      return;
    }

    var currentNode = -1;
    var activateNextNode = function () {
      orderedNodes.forEach(function (node) { node.classList.remove("is-active"); });
      currentNode = (currentNode + 1) % orderedNodes.length;
      orderedNodes[currentNode].classList.add("is-active");
      if (networkStatus) networkStatus.textContent = orderedNodes[currentNode].getAttribute("data-network-event") || "Conexão ativa";
    };

    heroNetworkTimers.push(window.setTimeout(function () {
      activateNextNode();
      heroNetworkTimers.push(window.setInterval(activateNextNode, 1800));
    }, 900));
  });
  if (heroNetworkTimers.length) {
    window.addEventListener("pagehide", function () {
      heroNetworkTimers.forEach(function (timer) {
        window.clearTimeout(timer);
        window.clearInterval(timer);
      });
    }, { once: true });
  }

  var demandRadar = document.querySelector("[data-demand-radar]");
  if (demandRadar) {
    var radarSignals = Array.prototype.slice.call(demandRadar.querySelectorAll(".radar-demand"));
    var radarStatus = document.querySelector("[data-radar-status]");
    var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var radarDelays = [800, 1800, 3600, 5100];
    var radarCycle = 6400;
    var radarTimers = [];

    var detectDemand = function (signal) {
      radarSignals.forEach(function (item) { item.classList.remove("is-detected"); });
      signal.classList.add("is-detected");
      if (radarStatus) radarStatus.textContent = signal.getAttribute("data-demand-name") + " detectada";
      radarTimers.push(window.setTimeout(function () {
        signal.classList.remove("is-detected");
        if (radarStatus) radarStatus.textContent = "Varredura ativa";
      }, 850));
    };

    if (reducedMotion) {
      radarSignals.forEach(function (signal) { signal.classList.add("is-detected"); });
      if (radarStatus) radarStatus.textContent = "Demandas mapeadas";
    } else {
      var scheduleRadar = function () {
        radarSignals.forEach(function (signal, index) {
          radarTimers.push(window.setTimeout(function () { detectDemand(signal); }, radarDelays[index]));
        });
        radarTimers.push(window.setTimeout(scheduleRadar, radarCycle));
      };
      scheduleRadar();
      window.addEventListener("pagehide", function () { radarTimers.forEach(function (timer) { window.clearTimeout(timer); }); }, { once: true });
    }
  }
})();
