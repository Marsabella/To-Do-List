// Auth
document.addEventListener("DOMContentLoaded", function () {
  const user = localStorage.getItem("loggedUser");

  // Login
  const loginBtn = document.getElementById("login-btn");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      const username = document.getElementById("login-username").value;
      const password = document.getElementById("login-password").value;
      const stored = JSON.parse(localStorage.getItem("users")) || {};
      if (stored[username] && stored[username] === password) {
        localStorage.setItem("loggedUser", username);
        window.location.href = "dashboard.html";
      } else {
        alert("Login gagal");
      }
    });
  }

  // Register
  const regBtn = document.getElementById("register-btn");
  if (regBtn) {
    regBtn.addEventListener("click", () => {
      const username = document.getElementById("reg-username").value;
      const password = document.getElementById("reg-password").value;
      const stored = JSON.parse(localStorage.getItem("users")) || {};
      if (username in stored) {
        alert("Username sudah terdaftar");
        return;
      }
      stored[username] = password;
      localStorage.setItem("users", JSON.stringify(stored));
      alert("Berhasil daftar! Silakan login.");
      window.location.href = "login.html";
    });
  }

  // Dashboard
  if (window.location.pathname.includes("dashboard.html")) {
    if (!user) {
      window.location.href = "login.html";
    }

    document.getElementById("user-greeting").innerText = "Halo, " + user;
    document.getElementById("logout-btn").addEventListener("click", () => {
      localStorage.removeItem("loggedUser");
      window.location.href = "login.html";
    });

    const tabs = document.querySelectorAll(".tab-btn");
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        const id = tab.getAttribute("data-tab");
        document.querySelectorAll(".tab-content").forEach(c => c.style.display = "none");
        document.getElementById("tab-" + id).style.display = "block";
      });
    });

    const todoForm = document.getElementById("todo-form");
    const todoList = document.getElementById("todo-list");
    const successMsg = document.getElementById("add-success");

    const todos = JSON.parse(localStorage.getItem(`todos-${user}`)) || [];

    const renderTodos = () => {
      todoList.innerHTML = "";
      todos.forEach((t, i) => {
        const li = document.createElement("li");
        li.innerText = `${t.name} (${t.type}) - Deadline: ${t.deadline}, Kumpul: ${t.submission}`;
        todoList.appendChild(li);
      });
    };

    renderTodos();

    todoForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const task = {
        name: document.getElementById("task-name").value,
        deadline: document.getElementById("deadline-date").value,
        submission: document.getElementById("submission-date").value,
        type: document.getElementById("task-type").value,
      };
      todos.push(task);
      localStorage.setItem(`todos-${user}`, JSON.stringify(todos));
      successMsg.style.display = "block";
      renderTodos();
      todoForm.reset();
      setTimeout(() => {
        successMsg.style.display = "none";
      }, 2000);
    });
  }
});