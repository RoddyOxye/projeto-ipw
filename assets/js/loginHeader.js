// loginHeader.js
function atualizarLogin() {
  const loginLink = document.getElementById("login-link");
  const dropdown = document.getElementById("user-dropdown");
  const perfilBtn = document.getElementById("perfil-btn");
  const mylistBtn = document.getElementById("mylist-btn");
  const logoutBtn = document.getElementById("logout-btn");

  const currentUser = localStorage.getItem("currentUser");

  if (currentUser) {
    loginLink.textContent = currentUser;
    loginLink.href = "#";

    // Remove listeners antigos
    const newLoginLink = loginLink.cloneNode(true);
    loginLink.parentNode.replaceChild(newLoginLink, loginLink);

    // Toggle dropdown ao clicar
    newLoginLink.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation(); // evita fechar imediatamente
      dropdown.classList.toggle("hidden");
    });

    // Botões do dropdown
    perfilBtn.onclick = () => window.location.href = "perfil.html";
    mylistBtn.onclick = () => window.location.href = "mylist.html";
    logoutBtn.onclick = () => {
      if (confirm("Deseja terminar a sessão?")) {
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("currentUser");
        window.location.reload();
      }
    };

    // Fecha dropdown se clicar fora
    document.addEventListener("click", () => {
      dropdown.classList.add("hidden");
    });

  } else {
    loginLink.textContent = "Login";
    loginLink.href = "login.html";
  }
}

// Chama ao carregar a página
document.addEventListener("DOMContentLoaded", atualizarLogin);
