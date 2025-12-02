document.addEventListener("DOMContentLoaded", () => {
  const API_KEY = "96228938";

  // Atualiza header/login
  if (typeof atualizarLogin === "function") {
    atualizarLogin();
  }

  // Pega o título da URL
  const params = new URLSearchParams(window.location.search);
  const titulo = params.get("titulo");

  if (!titulo) {
    alert("Nenhum filme/serie selecionado!");
    return;
  }

  // Elementos do DOM
  const posterEl = document.getElementById("poster");
  const tituloEl = document.getElementById("titulo");
  const anoEl = document.getElementById("ano");
  const generoEl = document.getElementById("genero");
  const duracaoEl = document.getElementById("duracao");
  const realizadorEl = document.getElementById("realizador");
  const atoresEl = document.getElementById("atores");
  const descricaoEl = document.getElementById("descricao");
  const trailerEl = document.getElementById("trailer");

  const comentarioEl = document.getElementById("comentario");
  const guardarBtn = document.getElementById("guardar-review");
  const reviewsContainer = document.getElementById("reviews-container");

  // Função que busca detalhes na OMDb pelo título
  async function fetchDetalhes(titulo) {
    try {
      const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(titulo)}&plot=full`);
      const data = await res.json();

      if (data.Response === "True") {
        preencherDetalhes(data);
        carregarReviews(data.Title);
      } else {
        alert("Não foi possível carregar os detalhes: " + data.Error);
        console.log(data);
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes:", error);
      alert("Ocorreu um erro ao buscar os detalhes.");
    }
  }

  function preencherDetalhes(data) {
    posterEl.src = data.Poster && data.Poster !== "N/A" ? data.Poster : "assets/img/noimage.jpg";
    tituloEl.textContent = data.Title || "Sem título";
    anoEl.textContent = data.Year || "Desconhecido";
    generoEl.textContent = data.Genre || "Desconhecido";
    duracaoEl.textContent = data.Runtime || "Desconhecido";
    realizadorEl.textContent = data.Director || "Desconhecido";
    atoresEl.textContent = data.Actors || "Desconhecido";
    descricaoEl.textContent = data.Plot || "Sem descrição";

    // Trailer do YouTube via pesquisa pelo título
    trailerEl.src = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(data.Title + " trailer")}`;
  }

  function carregarReviews(filmeTitulo) {
    const allReviews = JSON.parse(localStorage.getItem("reviews")) || {};
    const filmeReviews = allReviews[filmeTitulo] || [];
    reviewsContainer.innerHTML = "";

    filmeReviews.forEach(r => {
      const div = document.createElement("div");
      div.classList.add("review-card");
      div.innerHTML = `<strong>${r.user}</strong> (${r.rating}★)<p>${r.comment}</p>`;
      reviewsContainer.appendChild(div);
    });
  }

  guardarBtn.addEventListener("click", () => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      alert("Faz login para deixar uma review!");
      return;
    }

    const comment = comentarioEl.value.trim();
    if (!comment) {
      alert("Escreve algo antes de guardar!");
      return;
    }

    const rating = 5; // por enquanto fixo
    const allReviews = JSON.parse(localStorage.getItem("reviews")) || {};
    if (!allReviews[titulo]) allReviews[titulo] = [];
    allReviews[titulo].push({ user, comment, rating });

    localStorage.setItem("reviews", JSON.stringify(allReviews));
    comentarioEl.value = "";
    carregarReviews(titulo);
  });

  // Chama a API
  fetchDetalhes(titulo);
});
