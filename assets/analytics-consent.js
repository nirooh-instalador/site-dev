(() => {
  "use strict";
  const key = "nirooh_analytics_consent";
  const currentScript = document.currentScript;
  const siteRoot = currentScript ? new URL("../", currentScript.src) : new URL("/", window.location.href);

  const updateGoogleConsent = (analyticsGranted) => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "update", {
      analytics_storage: analyticsGranted ? "granted" : "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      functionality_storage: "granted",
      security_storage: "granted"
    });
  };

  const createBanner = () => {
    const language = (document.documentElement.lang || "pt-BR").toLowerCase();
    const privacyUrl = new URL("termos/politica-de-privacidade.html", siteRoot).href;
    const copy = language.startsWith("en")
      ? {
          text: "We use Google Tag Manager and HubSpot analytics to understand site usage and improve your experience.",
          consult: "Read our",
          policy: "Privacy Policy",
          accept: "Accept analytics",
          reject: "Continue without analytics"
        }
      : language.startsWith("es")
        ? {
            text: "Usamos Google Tag Manager y HubSpot Analytics para comprender el uso del sitio y mejorar tu experiencia.",
            consult: "Consulta nuestra",
            policy: "Política de Privacidad",
            accept: "Aceptar analytics",
            reject: "Continuar sin analytics"
          }
        : {
            text: "Usamos Google Tag Manager e analytics do HubSpot para entender a navegação e melhorar sua experiência.",
            consult: "Consulte nossa",
            policy: "Política de Privacidade",
            accept: "Aceitar analytics",
            reject: "Continuar sem analytics"
          };
    const element = document.createElement("div");
    element.className = "cookie-banner";
    element.hidden = true;
    element.setAttribute("data-cookie-banner", "");
    element.innerHTML = '<p>' + copy.text + ' ' + copy.consult + ' <a href="' + privacyUrl + '">' + copy.policy + '</a>.</p>' +
      '<div class="cookie-actions"><button class="cookie-accept" type="button" data-cookie-accept>' + copy.accept + '</button>' +
      '<button class="cookie-reject" type="button" data-cookie-reject>' + copy.reject + '</button></div>';
    document.body.append(element);
    return element;
  };

  const banner = document.querySelector("[data-cookie-banner]") || createBanner();

  const loadHubSpot = () => {
    if (document.querySelector("#hs-script-loader")) return;
    const script = document.createElement("script");
    script.id = "hs-script-loader";
    script.async = true;
    script.defer = true;
    script.src = "https://js.hs-scripts.com/22781321.js";
    document.head.append(script);
  };

  const choice = window.localStorage.getItem(key);
  if (choice === "accepted") {
    updateGoogleConsent(true);
    loadHubSpot();
  } else {
    updateGoogleConsent(false);
  }
  if (banner && !choice) banner.hidden = false;

  banner?.querySelector("[data-cookie-accept]")?.addEventListener("click", () => {
    window.localStorage.setItem(key, "accepted");
    banner.hidden = true;
    updateGoogleConsent(true);
    loadHubSpot();
  });

  banner?.querySelector("[data-cookie-reject]")?.addEventListener("click", () => {
    window.localStorage.setItem(key, "rejected");
    banner.hidden = true;
    updateGoogleConsent(false);
  });
})();
