// Carrega dados do item via querystring e monta a página de detalhes.
document.addEventListener("DOMContentLoaded", () => {
  atualizarLogin(); // Header login

  const urlParams = new URLSearchParams(window.location.search);
  const id = parseInt(urlParams.get("id"));
  const type = urlParams.get("type"); // "filme" ou "serie"

  if (!id || !type) return;

  carregarDetalhes(id, type);
});

// Busca o item pelo id/tipo e injeta dados no DOM.
function carregarDetalhes(id, type) {
  const filePath = type === "filme" ? "assets/data/filmes.json" : "assets/data/series.json";
  const fallback = type === "filme" ? window.FILMES_FALLBACK : window.SERIES_FALLBACK;

  fetchComFallback(filePath, fallback)
    .then(data => {
      const lista = type === "filme" ? data.filmes : data.series;
      const item = lista.find(i => i.id === id);
      if (!item) return;

      // Preenche informações principais do item.
      document.getElementById("poster").src = item.poster;
      document.getElementById("poster").alt = item.title;
      document.getElementById("titulo").textContent = item.title;
      document.getElementById("ano").textContent = item.year;
      document.getElementById("genero").textContent = item.genres.join(", ");
      document.getElementById("duracao").textContent = `${item.duration} min`;
      document.getElementById("descricao").textContent = item.description;

      // Converte link de YouTube para embed, se existir.
      document.getElementById("trailer").src = item.trailer?.replace("watch?v=", "embed/") || "";

      // Inicializa botão da Minha Lista e sincroniza estado.
      const btnLista = document.getElementById("btn-mylist");
      atualizarBotaoLista(btnLista, id, type);

      btnLista.addEventListener("click", () => {
        toggleMinhaLista(id, type);
        atualizarBotaoLista(btnLista, id, type);
      });

      // Carrega reviews já gravadas.
      carregarReviews(id, type);

      // Inicializa componente de estrelas e guarda nova review.
      inicializarEstrelas(id, type, item.title);
    })
    .catch(err => console.error("Erro ao carregar detalhes:", err));
}

// Renderiza reviews do item guardadas no localStorage.
function carregarReviews(id, type) {
  const reviewsContainer = document.getElementById("reviews-container");
  reviewsContainer.innerHTML = "";

  const allReviews = JSON.parse(localStorage.getItem("reviews")) || [];
  const itemReviews = allReviews.filter(r => r.id === id && r.type === type);

  itemReviews.forEach(r => {
    const div = document.createElement("div");
    div.classList.add("review-item");
    div.innerHTML = `<span class="review-username">${r.user}:</span> 
                     ${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}
                     <p>${r.comment}</p>`;
    reviewsContainer.appendChild(div);
  });

  atualizarRating(id, type);
}

// Monta UI de estrelas e trata o envio da review.
function inicializarEstrelas(id, type, title) {
  const starsDiv = document.getElementById("rating-stars");
  const textarea = document.getElementById("comentario");
  const btnGuardar = document.getElementById("guardar-review");

  let currentRating = 0;
  const stars = [];
  starsDiv.innerHTML = "";

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.textContent = "★";
    star.style.color = "grey";
    star.classList.add("star");
    star.dataset.value = i;

    star.addEventListener("mouseover", () => colorStars(i));
    star.addEventListener("mouseout", () => colorStars(currentRating));
    star.addEventListener("click", () => currentRating = i);

    stars.push(star);
    starsDiv.appendChild(star);
  }

  function colorStars(rating) {
    stars.forEach(s => s.style.color = s.dataset.value <= rating ? "gold" : "grey");
  }

  // Valida login e campos antes de guardar review.
  btnGuardar.addEventListener("click", () => {
    const comment = textarea.value.trim();
    const user = localStorage.getItem("currentUser");

    if (!user) { alert("Necessitas de estar logado para comentar!"); return; }
    if (!currentRating || !comment) { alert("Preenche as estrelas e o comentário!"); return; }

    const allReviews = JSON.parse(localStorage.getItem("reviews")) || [];
    allReviews.push({ id, type, user, title, rating: currentRating, comment });
    localStorage.setItem("reviews", JSON.stringify(allReviews));

    carregarReviews(id, type);
    textarea.value = "";
    currentRating = 0;
    colorStars(currentRating);
  });
}

// ============================
// Minha Lista
// ============================
// Adiciona/remove item na lista do utilizador atual.
function toggleMinhaLista(id, type) {
  const user = localStorage.getItem("currentUser");
  if (!user) return;

  let users = JSON.parse(localStorage.getItem("localUsers")) || [];
  const currentUser = users.find(u => u.username === user);
  if (!currentUser) return;

  const index = currentUser.mylist.findIndex(f => f.id === id && f.type === type);
  if (index >= 0) currentUser.mylist.splice(index, 1);
  else currentUser.mylist.push({ id, type });

  localStorage.setItem("localUsers", JSON.stringify(users));
}

// Ajusta texto e cor do botão conforme o estado da lista.
function atualizarBotaoLista(btn, id, type) {
  const user = localStorage.getItem("currentUser");
  if (!user) { btn.style.display = "none"; return; }

  btn.style.display = "inline-block";
  const users = JSON.parse(localStorage.getItem("localUsers")) || [];
  const currentUser = users.find(u => u.username === user);

  if (currentUser.mylist.some(f => f.id === id && f.type === type)) {
    btn.textContent = "Remover da Minha Lista";
    btn.style.backgroundColor = "#ff5555";
  } else {
    btn.textContent = "Adicionar à Minha Lista";
    btn.style.backgroundColor = "#ffcc00";
  }
}

// ============================
// Rating médio
// ============================
// Calcula média das reviews e atualiza o widget de rating.
function atualizarRating(id, type) {
  const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
  const itemReviews = reviews.filter(r => r.id === id && r.type === type);
  const media = itemReviews.length ? (itemReviews.reduce((a,b) => a + b.rating,0)/itemReviews.length).toFixed(1) : 0;

  const ratingDiv = document.getElementById("rating-media");
  if (ratingDiv) ratingDiv.textContent = `⭐ ${media} / 5`;
}
