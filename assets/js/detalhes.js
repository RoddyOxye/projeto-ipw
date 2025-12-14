document.addEventListener("DOMContentLoaded", () => {
  atualizarLogin(); // Header login

  const urlParams = new URLSearchParams(window.location.search);
  const id = parseInt(urlParams.get("id"));
  const type = urlParams.get("type"); // "filme" ou "serie"

  if (!id || !type) return;

  carregarDetalhes(id, type);
});

function carregarDetalhes(id, type) {
  const filePath = type === "filme" ? "assets/data/filmes.json" : "assets/data/series.json";

  fetch(filePath)
    .then(res => res.json())
    .then(data => {
      const item = data[type === "filme" ? "filmes" : "series"].find(i => i.id === id);
      if (!item) return;

      // Preenche informações
      document.getElementById("poster").src = item.poster;
      document.getElementById("poster").alt = item.title;
      document.getElementById("titulo").textContent = item.title;
      document.getElementById("ano").textContent = item.year;
      document.getElementById("genero").textContent = item.genres.join(", ");
      document.getElementById("duracao").textContent = `${item.duration} min`;
      document.getElementById("descricao").textContent = item.description;

      // Trailer
      document.getElementById("trailer").src = item.trailer.replace("watch?v=", "embed/");

      // Inicializa botão lista
      const btnLista = document.getElementById("btn-mylist");
      atualizarBotaoLista(btnLista, id, type);

      btnLista.addEventListener("click", () => {
        toggleMinhaLista(id, type);
        atualizarBotaoLista(btnLista, id, type);
      });

      // Carregar reviews
      carregarReviews(id, type);

      // Inicializar estrelas para review
      inicializarEstrelas(id, type, item.title);
    });
}

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

// Adiciona título ao salvar review
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

  btnGuardar.addEventListener("click", () => {
    const comment = textarea.value.trim();
    const user = localStorage.getItem("currentUser");

    if (!user) {
      alert("Necessitas de estar logado para comentar!");
      return;
    }

    if (!currentRating || !comment) {
      alert("Preenche as estrelas e o comentário!");
      return;
    }

    const allReviews = JSON.parse(localStorage.getItem("reviews")) || [];
    allReviews.push({
      id,
      type,
      user,
      title,       // <-- título do filme/série salvo aqui
      rating: currentRating,
      comment
    });
    localStorage.setItem("reviews", JSON.stringify(allReviews));

    carregarReviews(id, type);
    textarea.value = "";
    currentRating = 0;
    colorStars(currentRating);
  });
}

// ============================
// Funções Minha Lista
// ============================
function toggleMinhaLista(id, type) {
  const user = localStorage.getItem("currentUser");
  if (!user) return;

  let users = JSON.parse(localStorage.getItem("localUsers")) || [];
  const currentUser = users.find(u => u.username === user);
  if (!currentUser) return;

  const index = currentUser.mylist.findIndex(f => f.id === id && f.type === type);
  if (index >= 0) {
    currentUser.mylist.splice(index, 1);
  } else {
    currentUser.mylist.push({ id, type });
  }

  localStorage.setItem("localUsers", JSON.stringify(users));
}

function atualizarBotaoLista(btn, id, type) {
  const user = localStorage.getItem("currentUser");
  if (!user) {
    btn.style.display = "none";
    return;
  }

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
function atualizarRating(id, type) {
  const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
  const itemReviews = reviews.filter(r => r.id === id && r.type === type);
  const media = itemReviews.length ? (itemReviews.reduce((a,b) => a + b.rating,0)/itemReviews.length).toFixed(1) : 0;

  const ratingDiv = document.getElementById("rating-media");
  if (ratingDiv) ratingDiv.textContent = `⭐ ${media} / 5`;
}
