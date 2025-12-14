/* ================================
   MOVIEVERSE - SCRIPT PRINCIPAL
   Usa JSON local (sem API)
================================ */

document.addEventListener("DOMContentLoaded", () => {
  // Atualiza estado do login no header
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
function carregarFilmes() {
  fetch("assets/data/filmes.json")
    .then(res => res.json())
    .then(data => {
      const filmes = data.filmes;
      const container = document.getElementById("filmes");

      if (!container) return;
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
    })
    .catch(err => {
      console.error("Erro ao carregar filmes:", err);
    });
}

/* ================================
   CARREGAR SÉRIES
   (assume assets/data/series.json)
================================ */
function carregarSeries() {
  fetch("assets/data/series.json")
    .then(res => res.json())
    .then(data => {
      const series = data.series;
      const container = document.getElementById("series");

      if (!container) return;
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
    })
    .catch(err => {
      console.error("Erro ao carregar séries:", err);
    });
}

/* ================================
   BANNER ALEATÓRIO
================================ */
function atualizarBanner() {
  Promise.all([
    fetch("assets/data/filmes.json").then(res => res.json()),
    fetch("assets/data/series.json").then(res => res.json())
  ])
    .then(([filmesData, seriesData]) => {
      const filmes = filmesData.filmes.map(f => ({ ...f, type: "filme" }));
      const series = seriesData.series.map(s => ({ ...s, type: "serie" }));

      const todos = [...filmes, ...series];
      if (todos.length === 0) return;

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
    })
    .catch(err => {
      console.error("Erro ao atualizar banner:", err);
    });
}
// ================================
// BARRA DE PESQUISA
// ================================
const searchInput = document.getElementById("search-input");
if (searchInput) {
  searchInput.addEventListener("keypress", async e => {
    if (e.key === "Enter") {
      const termo = e.target.value.trim().toLowerCase();
      if (termo.length < 2) return;

      // Fetch dos JSONs
      const [filmesRes, seriesRes] = await Promise.all([
        fetch("assets/data/filmes.json").then(r => r.json()),
        fetch("assets/data/series.json").then(r => r.json())
      ]);

      const filmes = filmesRes.filmes.filter(f => f.title.toLowerCase().includes(termo));
      const series = seriesRes.series.filter(s => s.title.toLowerCase().includes(termo));

      // Guardar resultados no sessionStorage e redirecionar
      sessionStorage.setItem("pesquisaFilmes", JSON.stringify(filmes));
      sessionStorage.setItem("pesquisaSeries", JSON.stringify(series));
      window.location.href = "pesquisar.html?q=" + encodeURIComponent(termo);
    }
  });
}