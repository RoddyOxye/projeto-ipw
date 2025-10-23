 //chamar API
    const API_KEY = "96228938";
    
    const filmesSec = document.getElementById("filmes");
    const seriesSec = document.getElementById("series");
    const banner = document.getElementById("banner");
    const bannerTitle = document.getElementById("banner-title");
    const bannerDesc = document.getElementById("banner-desc");
    const bannerBtn = document.getElementById("banner-btn");

    async function fetchMedia(term) {
      const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${term}`);
      const data = await res.json();
      return data.Search || [];
    }

    async function loadHomepage() {
      const filmes = await Promise.all([
        fetchMedia("Avengers"), fetchMedia("Inception"), fetchMedia("Interstellar")
      ]);

      const series = await Promise.all([
        fetchMedia("Breaking Bad"), fetchMedia("Friends"), fetchMedia("Game of Thrones")
      ]);

      const allFilmes = filmes.flat();
      const allSeries = series.flat();

      renderMedia(allFilmes, filmesSec);
      renderMedia(allSeries, seriesSec);

      // Banner aleatório
      const destaque = allFilmes.concat(allSeries)[Math.floor(Math.random() * (allFilmes.length + allSeries.length))];
      setBanner(destaque);
    }

    function renderMedia(list, container) {
      container.innerHTML = "";
      list.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("media-card");
        div.innerHTML = `
          <img src="${item.Poster !== "N/A" ? item.Poster : "assets/img/noimage.jpg"}">
          <p>${item.Title}</p>
        `;
        div.onclick = () => window.location.href = `detalhes.html?id=${item.imdbID}`;
        container.appendChild(div);
      });
    }

    function setBanner(item) {
      banner.style.backgroundImage = `url(${item.Poster})`;
      bannerTitle.textContent = item.Title;
      bannerDesc.textContent = `Ano: ${item.Year} | Tipo: ${item.Type}`;
      bannerBtn.onclick = () => window.location.href = `detalhes.html?id=${item.imdbID}`;
    }

    // Pesquisa dinâmica
    const searchInput = document.getElementById("search-input");
    const searchSection = document.getElementById("search-results");
    const resultados = document.getElementById("resultados");

    searchInput.addEventListener("keyup", async e => {
      const term = e.target.value.trim();
      if (term.length < 3) {
        searchSection.style.display = "none";
        return;
      }
      const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${term}`);
      const data = await res.json();
      if (data.Response === "True") {
        searchSection.style.display = "block";
        renderMedia(data.Search, resultados);
      } else {
        resultados.innerHTML = "<p>Nenhum resultado encontrado.</p>";
      }
    });

    loadHomepage();