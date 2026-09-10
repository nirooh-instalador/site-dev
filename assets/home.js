(() => {
  "use strict";

  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("[data-nav]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const navLinks = nav ? [...nav.querySelectorAll('a[href^="#"]')] : [];

  const closeMenu = () => {
    if (!nav || !menuToggle) return;
    nav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  };

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const shouldOpen = menuToggle.getAttribute("aria-expanded") !== "true";
      menuToggle.setAttribute("aria-expanded", String(shouldOpen));
      nav.classList.toggle("is-open", shouldOpen);
      document.body.classList.toggle("menu-open", shouldOpen);
    });

    navLinks.forEach((link) => link.addEventListener("click", closeMenu));

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 980) closeMenu();
    });
  }

  const updateHeader = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if ("IntersectionObserver" in window && navLinks.length) {
    const sections = navLinks
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
      });
    }, {
      rootMargin: "-30% 0px -58% 0px",
      threshold: [0.01, 0.2, 0.5]
    });

    sections.forEach((section) => observer.observe(section));
  }

  const orbitSystem = document.querySelector("[data-orbit-system]");

  if (orbitSystem) {
    const nodes = [...orbitSystem.querySelectorAll("[data-orbit-node]")];
    const inventoryNodes = nodes.filter((node) => node.dataset.layer === "inventory");
    const sspNodes = nodes.filter((node) => node.dataset.layer === "ssp");
    const core = orbitSystem.querySelector("[data-orbit-core]");
    const status = orbitSystem.querySelector("[data-orbit-status]");
    const beam = orbitSystem.querySelector("[data-connection-beam]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const startTime = performance.now();
    let bounds = orbitSystem.getBoundingClientRect();

    const radiiFor = () => {
      const size = Math.min(bounds.width, bounds.height);
      return {
        audience: size * 0.145,
        inventory: size * 0.275,
        ssp: size * 0.415
      };
    };

    const circularDistance = (a, b) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));

    const averageAngle = (a, b) => Math.atan2(Math.sin(a) + Math.sin(b), Math.cos(a) + Math.cos(b));

    const updateOrbit = (timestamp) => {
      const elapsed = reduceMotion.matches ? 0 : (timestamp - startTime) / 1000;
      const radii = radiiFor();

      nodes.forEach((node) => {
        const initial = (Number(node.dataset.angle || 0) * Math.PI) / 180;
        const speed = Number(node.dataset.speed || 0);
        const angle = initial + elapsed * speed;
        const radius = radii[node.dataset.layer] || 0;

        node._orbitAngle = angle;
        node.style.setProperty("--orbit-x", `${Math.cos(angle) * radius}px`);
        node.style.setProperty("--orbit-y", `${Math.sin(angle) * radius}px`);
      });

      let match = null;
      inventoryNodes.forEach((inventory) => {
        sspNodes.forEach((ssp) => {
          const distance = circularDistance(inventory._orbitAngle, ssp._orbitAngle);
          if (!match || distance < match.distance) match = { inventory, ssp, distance };
        });
      });

      nodes.forEach((node) => node.classList.remove("is-match"));
      const aligned = Boolean(match && match.distance < 0.13);
      orbitSystem.classList.toggle("is-aligned", aligned);

      if (aligned) {
        match.inventory.classList.add("is-match");
        match.ssp.classList.add("is-match");
        const angle = averageAngle(match.inventory._orbitAngle, match.ssp._orbitAngle);
        beam?.style.setProperty("--beam-angle", `${angle}rad`);
        beam?.style.setProperty("--beam-length", `${radii.ssp + 12}px`);
        if (core) core.setAttribute("aria-label", "Conexão elegível detectada");
        if (status) status.textContent = `${match.inventory.dataset.label} → ${match.ssp.dataset.label}`;
      } else {
        if (core) core.setAttribute("aria-label", "Motor POES da Nirooh monitorando oportunidades");
        if (status) status.textContent = "Monitorando oportunidades elegíveis";
      }

      if (!reduceMotion.matches) window.requestAnimationFrame(updateOrbit);
    };

    if ("ResizeObserver" in window) {
      const resizeObserver = new ResizeObserver(() => {
        bounds = orbitSystem.getBoundingClientRect();
      });
      resizeObserver.observe(orbitSystem);
    } else {
      window.addEventListener("resize", () => {
        bounds = orbitSystem.getBoundingClientRect();
      });
    }

    window.requestAnimationFrame(updateOrbit);
  }

  const calculator = document.querySelector("#cpm-calculator");

  if (calculator) {
    const fields = {
      campaignValue: calculator.querySelector("#campaign-value"),
      dailyImpacts: calculator.querySelector("#daily-impacts"),
      campaignDays: calculator.querySelector("#campaign-days"),
      targetCpm: calculator.querySelector("#target-cpm"),
      slotDuration: calculator.querySelector("#slot-duration"),
      loopDuration: calculator.querySelector("#loop-duration"),
      operationHours: calculator.querySelector("#operation-hours")
    };

    const outputs = {
      effectiveCpm: calculator.querySelector("#effective-cpm"),
      comparison: calculator.querySelector("#cpm-comparison"),
      totalImpacts: calculator.querySelector("#total-impacts"),
      suggestedValue: calculator.querySelector("#suggested-value"),
      shareOfVoice: calculator.querySelector("#share-of-voice"),
      playsPerDay: calculator.querySelector("#plays-per-day")
    };

    const copyButton = calculator.querySelector("[data-copy-calculation]");
    const currency = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    const integer = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });

    const readNumber = (input, fallback = 0) => {
      const value = Number(input?.value);
      return Number.isFinite(value) ? Math.max(value, 0) : fallback;
    };

    let latestResult = null;

    const calculate = () => {
      const campaignValue = readNumber(fields.campaignValue);
      const dailyImpacts = readNumber(fields.dailyImpacts);
      const campaignDays = Math.max(readNumber(fields.campaignDays, 1), 1);
      const targetCpm = readNumber(fields.targetCpm);
      const slotDuration = readNumber(fields.slotDuration);
      const loopDuration = Math.max(readNumber(fields.loopDuration, 1), 1);
      const operationHours = Math.min(readNumber(fields.operationHours), 24);

      const totalImpacts = dailyImpacts * campaignDays;
      const effectiveCpm = totalImpacts > 0 ? (campaignValue / totalImpacts) * 1000 : 0;
      const suggestedValue = (totalImpacts / 1000) * targetCpm;
      const shareOfVoice = Math.min((slotDuration / loopDuration) * 100, 100);
      const playsPerDay = Math.floor(3600 / loopDuration) * operationHours;

      let comparison = "Adicione um CPM de referência para comparar.";
      if (targetCpm > 0 && effectiveCpm > 0) {
        const difference = ((effectiveCpm - targetCpm) / targetCpm) * 100;
        if (Math.abs(difference) < 0.5) {
          comparison = "Alinhado ao CPM de referência informado.";
        } else if (difference > 0) {
          comparison = `${Math.abs(difference).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}% acima do CPM de referência informado.`;
        } else {
          comparison = `${Math.abs(difference).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}% abaixo do CPM de referência informado.`;
        }
      }

      outputs.effectiveCpm.textContent = currency.format(effectiveCpm);
      outputs.comparison.textContent = comparison;
      outputs.totalImpacts.textContent = integer.format(totalImpacts);
      outputs.suggestedValue.textContent = currency.format(suggestedValue);
      outputs.shareOfVoice.textContent = `${shareOfVoice.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;
      outputs.playsPerDay.textContent = integer.format(playsPerDay);

      latestResult = {
        campaignValue,
        dailyImpacts,
        campaignDays,
        targetCpm,
        totalImpacts,
        effectiveCpm,
        suggestedValue,
        shareOfVoice,
        playsPerDay,
        comparison
      };
    };

    calculator.addEventListener("input", calculate);
    calculator.addEventListener("change", calculate);
    calculator.addEventListener("reset", () => window.requestAnimationFrame(calculate));

    const copyText = async (text) => {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return;
      }

      const temporary = document.createElement("textarea");
      temporary.value = text;
      temporary.setAttribute("readonly", "");
      temporary.style.position = "fixed";
      temporary.style.opacity = "0";
      document.body.appendChild(temporary);
      temporary.select();
      document.execCommand("copy");
      temporary.remove();
    };

    if (copyButton) {
      copyButton.addEventListener("click", async () => {
        if (!latestResult) calculate();
        const result = latestResult;
        const summary = [
          "Simulação de CPM — Nirooh",
          `Valor comercial: ${currency.format(result.campaignValue)}`,
          `Impressões estimadas por dia: ${integer.format(result.dailyImpacts)}`,
          `Período: ${integer.format(result.campaignDays)} dias`,
          `Impressões estimadas no período: ${integer.format(result.totalImpacts)}`,
          `CPM efetivo: ${currency.format(result.effectiveCpm)}`,
          `CPM de referência: ${currency.format(result.targetCpm)}`,
          `Preço no CPM de referência: ${currency.format(result.suggestedValue)}`,
          `Share of voice: ${result.shareOfVoice.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`,
          `Exibições estimadas por dia: ${integer.format(result.playsPerDay)}`,
          "Estimativa educacional; valide audiência, formato, localização e política comercial."
        ].join("\n");

        try {
          await copyText(summary);
          const originalLabel = copyButton.textContent;
          copyButton.textContent = "Resumo copiado";
          copyButton.classList.add("is-copied");
          window.setTimeout(() => {
            copyButton.textContent = originalLabel;
            copyButton.classList.remove("is-copied");
          }, 2200);
        } catch (error) {
          copyButton.textContent = "Não foi possível copiar";
          window.setTimeout(() => {
            copyButton.textContent = "Copiar resumo da simulação";
          }, 2200);
        }
      });
    }

    calculate();
  }

  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });
})();
