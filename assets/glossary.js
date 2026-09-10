(() => {
  "use strict";

  const search = document.querySelector("[data-glossary-search]");
  const cards = [...document.querySelectorAll("[data-glossary-term]")];
  const buttons = [...document.querySelectorAll("[data-glossary-letter]")];
  const count = document.querySelector("[data-glossary-count]");
  const empty = document.querySelector("[data-glossary-empty]");
  if (!search || !cards.length) return;

  const normalize = (value) => value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  let activeLetter = "all";

  const filter = () => {
    const query = normalize(search.value);
    let visible = 0;

    cards.forEach((card) => {
      const matchesQuery = !query || normalize(card.dataset.term || card.textContent).includes(query);
      const matchesLetter = activeLetter === "all" || card.dataset.letter === activeLetter;
      const show = matchesQuery && matchesLetter;
      card.hidden = !show;
      if (show) visible += 1;
    });

    if (count) count.textContent = `${visible} ${visible === 1 ? "termo encontrado" : "termos encontrados"}`;
    if (empty) empty.hidden = visible !== 0;
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      activeLetter = button.dataset.glossaryLetter || "all";
      buttons.forEach((item) => item.classList.toggle("is-active", item === button));
      filter();
    });
  });

  search.addEventListener("input", filter);
  filter();
})();
