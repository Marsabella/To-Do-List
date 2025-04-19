document.addEventListener("DOMContentLoaded", function () {
  const user = localStorage.getItem("loggedUser");

  // ===== LOGIN =====
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
        alert("Login gagal: Username atau password salah.");
      }
    });
  }

  // ===== REGISTER =====
  const regBtn = document.getElementById("register-btn");
  if (regBtn) {
    regBtn.addEventListener("click", () => {
      const username = document.getElementById("reg-username").value;
      const password = document.getElementById("reg-password").value;
      const stored = JSON.parse(localStorage.getItem("users")) || {};
      if (username in stored) {
        alert("Username sudah terdaftar.");
        return;
      }
      stored[username] = password;
      localStorage.setItem("users", JSON.stringify(stored));
      alert("Registrasi berhasil! Silakan login.");
      window.location.href = "login.html";
    });
  }

  // ===== DASHBOARD =====
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
    const categoryInput = document.getElementById("todo-category");
    const extraInput = document.getElementById("todo-extra");

    const todos = JSON.parse(localStorage.getItem(`todos-${user}`)) || [];

    categoryInput.addEventListener("change", () => {
      if (categoryInput.value === "tugas") {
        extraInput.placeholder = "Link Pengumpulan";
      } else if (categoryInput.value === "meeting") {
        extraInput.placeholder = "Lokasi Meeting";
      } else {
        extraInput.placeholder = "Link/Lokasi";
      }
    });

    const renderTodos = () => {
      todoList.innerHTML = "";
      todos.forEach((t, i) => {
        const li = document.createElement("li");
        li.className = t.completed ? "todo-completed" : "";

        li.innerHTML = `
          <strong>${t.title}</strong> (${t.category})<br>
          Deadline: ${t.deadline}<br>
          ${t.category === "tugas" ? "Link: " : "Lokasi: "}${t.extra}
          <div class="todo-actions">
            <button class="done-btn">${t.completed ? "Belum Selesai" : "Selesai"}</button>
            <button class="delete-btn">Hapus</button>
          </div>
        `;

        li.querySelector(".done-btn").addEventListener("click", () => {
          todos[i].completed = !todos[i].completed;
          localStorage.setItem(`todos-${user}`, JSON.stringify(todos));
          renderTodos();
        });

        li.querySelector(".delete-btn").addEventListener("click", () => {
          todos.splice(i, 1);
          localStorage.setItem(`todos-${user}`, JSON.stringify(todos));
          renderTodos();
        });

        todoList.appendChild(li);
      });
    };

    renderTodos();

    todoForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const newTask = {
        title: document.getElementById("todo-title").value,
        category: categoryInput.value,
        extra: extraInput.value,
        deadline: document.getElementById("todo-deadline").value,
        completed: false,
      };
      todos.push(newTask);
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