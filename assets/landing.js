(() => {
  "use strict";

  const form = document.querySelector("[data-media-form]");
  if (!form) return;

  const status = form.querySelector("[data-form-status]");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const subject = `Briefing NiroohNet — ${data.get("empresa") || "nova campanha"}`;
    const lines = [
      "Olá, time Nirooh.",
      "",
      "Quero avaliar um plano de mídia com a NiroohNet.",
      "",
      `Nome: ${data.get("nome") || ""}`,
      `E-mail: ${data.get("email") || ""}`,
      `Empresa: ${data.get("empresa") || ""}`,
      `Perfil: ${data.get("perfil") || ""}`,
      `Objetivo: ${data.get("objetivo") || ""}`,
      `Praças ou regiões: ${data.get("pracas") || ""}`,
      `Período: ${data.get("periodo") || "A confirmar"}`,
      `Informações adicionais: ${data.get("detalhes") || "Não informado"}`
    ];

    const mailto = new URL("mailto:bpompeu@nirooh.com.br");
    mailto.searchParams.set("cc", "vendas@nirooh.com.br");
    mailto.searchParams.set("subject", subject);
    mailto.searchParams.set("body", lines.join("\n"));

    if (status) status.textContent = "Briefing preparado. Abrindo seu aplicativo de e-mail…";
    window.location.href = mailto.toString();
  });
})();
