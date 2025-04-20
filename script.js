document.addEventListener("DOMContentLoaded", function () {
  const user = localStorage.getItem("loggedUser");

  // ===== LOGIN =====
  const loginBtn = document.getElementById("login-btn");
  // Toggle password via icon span
const toggleIcons = document.querySelectorAll(".toggle-password");
toggleIcons.forEach((icon) => {
  icon.addEventListener("click", function () {
    const inputId = this.previousElementSibling.id;
    const input = document.getElementById(inputId);
    if (input.type === "password") {
      input.type = "text";
      this.textContent = "🙈";
    } else {
      input.type = "password";
      this.textContent = "👁️";
    }
  });
});
// ===== LUPA PASSWORD =====
const forgotBtn = document.getElementById("forgot-btn");
if (forgotBtn) {
  forgotBtn.addEventListener("click", () => {
    const username = prompt("Masukkan username:");
    const dob = prompt("Masukkan tanggal lahir (YYYY-MM-DD):");
    const newPass = prompt("Masukkan password baru:");
    const confirmPass = prompt("Ulangi password baru:");

    const users = JSON.parse(localStorage.getItem("users")) || {};
    if (!users[username]) {
      alert("Username tidak ditemukan.");
    } else if (users[username].dob !== dob) {
      alert("Tanggal lahir tidak sesuai.");
    } else if (newPass !== confirmPass) {
      alert("Password baru tidak cocok.");
    } else {
      users[username].password = newPass;
      localStorage.setItem("users", JSON.stringify(users));
      alert("Password berhasil diubah.");
    }
  });
}

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      const username = document.getElementById("login-username").value;
      const password = document.getElementById("login-password").value;
      const stored = JSON.parse(localStorage.getItem("users")) || {};

      // Validasi login
      if (stored[username] && stored[username].password === password) {
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
      const password2 = document.getElementById("reg-password2").value;
      const email = document.getElementById("reg-email").value;
      const dob = document.getElementById("reg-dob").value;
  
      const stored = JSON.parse(localStorage.getItem("users")) || {};
      if (username in stored) {
        alert("Username sudah terdaftar.");
        return;
      }
      if (password !== password2) {
        alert("Password tidak cocok.");
        return;
      }
      stored[username] = {
        password: password,
        email: email,
        dob: dob
      };
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

    // Tab navigasi
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
    const priorityInput = document.getElementById("todo-priority"); // Ambil elemen prioritas

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

        const priorityClass = t.priority?.toLowerCase() || "rendah";

        li.innerHTML = `
          <strong>${t.title}</strong> (${t.category})<br>
          Deadline: ${t.deadline}<br>
          ${t.category === "tugas" ? "Link: " : "Lokasi: "}${t.extra}<br>
          Prioritas: <span class="priority ${priorityClass}">${t.priority}</span>
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
        priority: priorityInput.value, // Ambil nilai prioritas
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