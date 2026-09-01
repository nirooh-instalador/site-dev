(() => {
  "use strict";

  const config = window.NIROOH_HUBSPOT || { portalId: "", forms: {} };
  const params = new URLSearchParams(window.location.search);
  const cookieValue = (name) => document.cookie.split("; ").find((entry) => entry.startsWith(`${name}=`))?.split("=").slice(1).join("=") || "";

  const attribution = {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_content: params.get("utm_content") || "",
    utm_term: params.get("utm_term") || "",
    page_uri: window.location.href,
    page_name: document.title
  };

  document.querySelectorAll("form[data-lead-form]").forEach((form) => {
    const leadType = form.dataset.leadType || "publisher";
    const hubSpotLeadType = leadType === "advertiser" ? "buyer" : leadType;
    const formGuid = config.forms?.[hubSpotLeadType] || "";
    const status = form.querySelector("[data-form-status]");
    const submit = form.querySelector("[type='submit']");

    Object.entries(attribution).forEach(([name, value]) => {
      const input = form.querySelector(`[name='${name}']`);
      if (input) input.value = value;
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const data = new FormData(form);
      const consent = form.querySelector("[name='consent']");
      if (consent && !consent.checked) {
        if (status) status.textContent = "Confirme o consentimento para continuar.";
        return;
      }

      if (submit) submit.disabled = true;
      if (status) status.textContent = "Enviando seus dados…";

      const ignored = new Set(["consent", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "page_uri", "page_name"]);
      const readable = [...data.entries()]
        .filter(([name, value]) => !ignored.has(name) && String(value).trim())
        .map(([name, value]) => `${name.replaceAll("_", " ")}: ${value}`)
        .join("\n");

      const standardFields = ["firstname", "lastname", "email", "phone", "company", "jobtitle"]
        .filter((name) => data.get(name))
        .map((name) => ({ objectTypeId: "0-1", name, value: String(data.get(name)) }));

      standardFields.push({
        objectTypeId: "0-1",
        name: "message",
        value: `${readable}\n\npersona: ${leadType}\nconversion point: ${form.dataset.conversionPoint || "website_form"}\nutm source: ${attribution.utm_source}\nutm medium: ${attribution.utm_medium}\nutm campaign: ${attribution.utm_campaign}`
      });

      if (config.portalId && formGuid) {
        try {
          const context = {
            pageUri: attribution.page_uri,
            pageName: attribution.page_name
          };
          const hubSpotCookie = cookieValue("hubspotutk");
          if (hubSpotCookie) context.hutk = hubSpotCookie;

          const response = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${config.portalId}/${formGuid}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              submittedAt: Date.now(),
              fields: standardFields,
              context,
              legalConsentOptions: {
                consent: {
                  consentToProcess: true,
                  text: "Concordo que a Nirooh utilize meus dados para responder a esta solicitação."
                }
              }
            })
          });

          if (!response.ok) throw new Error(`HubSpot response ${response.status}`);
          form.reset();
          if (status) status.textContent = "Recebemos seus dados. Um especialista da Nirooh entrará em contato.";
          form.dispatchEvent(new CustomEvent("nirooh:lead-success", { bubbles: true, detail: { leadType } }));
          return;
        } catch (error) {
          console.warn("Não foi possível concluir a submissão pelo HubSpot.", error);
        } finally {
          if (submit) submit.disabled = false;
        }
      }

      const subject = hubSpotLeadType === "buyer" ? "Briefing NiroohNet" : hubSpotLeadType === "course" ? "Interesse no curso Nirooh Academy" : "Diagnóstico de inventário Nirooh";
      const mailto = new URL("mailto:bpompeu@nirooh.com.br");
      mailto.searchParams.set("cc", "vendas@nirooh.com.br");
      mailto.searchParams.set("subject", `${subject} — ${data.get("company") || data.get("firstname") || "novo lead"}`);
      mailto.searchParams.set("body", `${readable}\n\nPágina: ${attribution.page_uri}`);
      if (status) status.textContent = "Abrindo seu aplicativo de e-mail para concluir o envio…";
      window.location.href = mailto.toString();
      if (submit) submit.disabled = false;
    });
  });
})();
