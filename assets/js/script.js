/* ================================
   MOVIEVERSE - SCRIPT PRINCIPAL
   JSON local com fallback
================================ */

document.addEventListener("DOMContentLoaded", () => {
  if (typeof atualizarLogin === "function") {
    atualizarLogin();
  }

  carregarFilmes();
  carregarSeries();
  atualizarBanner();
});

/* ================================
   CARREGAR FILMES
================================ */
async function carregarFilmes() {
  const container = document.getElementById("filmes");
  if (!container) return;

  const data = await fetchComFallback(
    "assets/data/filmes.json",
    window.FILMES_FALLBACK
  );

  const filmes = data.filmes;
  container.innerHTML = "";

  filmes.forEach(filme => {
    const card = document.createElement("div");
    card.className = "media-card";

    card.innerHTML = `
      <img src="${filme.poster}" alt="${filme.title}">
      <p>${filme.title}</p>
    `;

    card.addEventListener("click", () => {
      window.location.href = `detalhes.html?id=${filme.id}&type=filme`;
    });

    container.appendChild(card);
  });
}

/* ================================
   CARREGAR SÉRIES
================================ */
async function carregarSeries() {
  const container = document.getElementById("series");
  if (!container) return;

  const data = await fetchComFallback(
    "assets/data/series.json",
    window.SERIES_FALLBACK
  );

  const series = data.series;
  container.innerHTML = "";

  series.forEach(serie => {
    const card = document.createElement("div");
    card.className = "media-card";

    card.innerHTML = `
      <img src="${serie.poster}" alt="${serie.title}">
      <p>${serie.title}</p>
    `;

    card.addEventListener("click", () => {
      window.location.href = `detalhes.html?id=${serie.id}&type=serie`;
    });

    container.appendChild(card);
  });
}

/* ================================
   BANNER ALEATÓRIO
================================ */
async function atualizarBanner() {
  const filmesData = await fetchComFallback(
    "assets/data/filmes.json",
    window.FILMES_FALLBACK
  );

  const seriesData = await fetchComFallback(
    "assets/data/series.json",
    window.SERIES_FALLBACK
  );

  const filmes = filmesData.filmes.map(f => ({ ...f, type: "filme" }));
  const series = seriesData.series.map(s => ({ ...s, type: "serie" }));

  const todos = [...filmes, ...series];
  if (!todos.length) return;

  const escolhido = todos[Math.floor(Math.random() * todos.length)];

  const banner = document.getElementById("banner");
  const titulo = document.getElementById("banner-title");
  const desc = document.getElementById("banner-desc");
  const btn = document.getElementById("banner-btn");

  if (!banner || !titulo || !desc || !btn) return;

  banner.style.backgroundImage = `url('${escolhido.poster}')`;
  titulo.textContent = escolhido.title;
  desc.textContent = escolhido.description || "Sem descrição disponível.";

  btn.onclick = () => {
    window.location.href = `detalhes.html?id=${escolhido.id}&type=${escolhido.type}`;
  };
}

/* ================================
   BARRA DE PESQUISA
================================ */
const searchInput = document.getElementById("search-input");

if (searchInput) {
  searchInput.addEventListener("keypress", async e => {
    if (e.key !== "Enter") return;

    const termo = e.target.value.trim().toLowerCase();
    if (termo.length < 2) return;

    const filmesData = await fetchComFallback(
      "assets/data/filmes.json",
      window.FILMES_FALLBACK
    );

    const seriesData = await fetchComFallback(
      "assets/data/series.json",
      window.SERIES_FALLBACK
    );

    const filmes = filmesData.filmes.filter(f =>
      f.title.toLowerCase().includes(termo)
    );

    const series = seriesData.series.filter(s =>
      s.title.toLowerCase().includes(termo)
    );

    sessionStorage.setItem("pesquisaFilmes", JSON.stringify(filmes));
    sessionStorage.setItem("pesquisaSeries", JSON.stringify(series));

    window.location.href = "pesquisar.html?q=" + encodeURIComponent(termo);
  });
}
