// ==========================
// login.js — Login e Registo
// ==========================

// Controla login/registo usando localStorage.
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerLink = document.getElementById("register-link");

  // Carregar dados do localStorage
  const localUsers = JSON.parse(localStorage.getItem("localUsers")) || [];

  // Alternar entre login e criar conta
  registerLink.addEventListener("click", (e) => {
    e.preventDefault();
    const box = document.querySelector(".login-box");
    const isLogin = box.querySelector("h2").textContent === "Iniciar Sessão";

    if (isLogin) {
      box.querySelector("h2").textContent = "Criar Conta";
      box.querySelector("button").textContent = "Registar";
      registerLink.textContent = "Já tens conta? Inicia sessão";
    } else {
      box.querySelector("h2").textContent = "Iniciar Sessão";
      box.querySelector("button").textContent = "Entrar";
      registerLink.textContent = "Criar conta";
    }
  });

  // Submissão do formulário
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();
      const mode = document.querySelector(".login-box h2").textContent;

      if (!username || !password) {
        alert("Preenche todos os campos!");
        return;
      }

      // Recupera utilizadores guardados
      let users = JSON.parse(localStorage.getItem("localUsers")) || [];

      if (mode === "Criar Conta") {
        // Verifica se já existe
        const exists = users.find(u => u.username === username);
        if (exists) {
          alert("Este nome de utilizador já existe!");
          return;
        }

        // Adiciona novo utilizador
        users.push({ username, password, mylist: [] });
        localStorage.setItem("localUsers", JSON.stringify(users));
        alert("Conta criada com sucesso! Agora inicia sessão.");

        // Voltar para login
        document.querySelector(".login-box h2").textContent = "Iniciar Sessão";
        document.querySelector(".login-box button").textContent = "Entrar";
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
      } else {
        // Login
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
          localStorage.setItem("loggedIn", "true");
          localStorage.setItem("currentUser", user.username);
          alert(`Bem-vindo(a), ${user.username}!`);
          window.location.href = "index.html";
        } else {
          alert("Nome de utilizador ou palavra-passe incorretos.");
        }
      }
    });
  }
});

// Atualiza header com menu do utilizador e ações rápidas.
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

    loginLink.addEventListener("click", (e) => {
      e.preventDefault();
      dropdown.classList.toggle("hidden");
    });

    perfilBtn.addEventListener("click", () => window.location.href = "perfil.html");
    mylistBtn.addEventListener("click", () => window.location.href = "mylist.html");

    logoutBtn.addEventListener("click", () => {
      if (confirm("Deseja terminar a sessão?")) {
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("currentUser");
        window.location.reload();
      }
    });

    // Fecha dropdown se clicar fora
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".user-menu")) {
        dropdown.classList.add("hidden");
      }
    });

  } else {
    loginLink.textContent = "Login";
    loginLink.href = "login.html";
  }
}
