/* script.js versi localStorage (tanpa Firebase) */
$(document).ready(function () {
  const user = localStorage.getItem("loggedUser");

  // ==== TOGGLE PASSWORD ====
  $(".toggle-password").on("click", function () {
    const input = $(this).prev("input");
    if (input.attr("type") === "password") {
      input.attr("type", "text");
      $(this).text("🙈");
    } else {
      input.attr("type", "password");
      $(this).text("👁️");
    }
  });

  // ==== LUPA PASSWORD ====
  $("#forgot-btn").on("click", function () {
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

  // ==== LOGIN ====
  $("#login-btn").on("click", function () {
    const username = $("#login-username").val();
    const password = $("#login-password").val();
    const users = JSON.parse(localStorage.getItem("users")) || {};

    if (users[username] && users[username].password === password) {
      localStorage.setItem("loggedUser", username);
      window.location.href = "dashboard.html";
    } else {
      alert("Login gagal: Username atau password salah.");
    }
  });

  // ==== REGISTER ====
  $("#register-btn").on("click", function () {
    const username = $("#reg-username").val();
    const password = $("#reg-password").val();
    const password2 = $("#reg-password2").val();
    const email = $("#reg-email").val();
    const dob = $("#reg-dob").val();

    const users = JSON.parse(localStorage.getItem("users")) || {};
    if (users[username]) {
      alert("Username sudah terdaftar.");
      return;
    }
    if (password !== password2) {
      alert("Password tidak cocok.");
      return;
    }

    users[username] = { password, email, dob };
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registrasi berhasil! Silakan login.");
    window.location.href = "login.html";
  });

  // ==== DASHBOARD ====
  if (window.location.pathname.includes("dashboard.html")) {
    if (!user) {
      window.location.href = "login.html";
    }

    $("#user-greeting").text("Halo, " + user);
    $("#logout-button").on("click", function () {
      $("#logout-confirmation").fadeIn();
    });
    $("#confirm-no").on("click", function () {
      $("#logout-confirmation").fadeOut();
    });
    $("#confirm-yes").on("click", function () {
      localStorage.removeItem("loggedUser");
      window.location.href = "login.html";
    });

    // Tab Navigasi
    $(".tab-btn").on("click", function () {
      $(".tab-btn").removeClass("active");
      $(this).addClass("active");
      $(".tab-content").hide();
      $("#tab-" + $(this).data("tab")).fadeIn();
    });

    const todos = JSON.parse(localStorage.getItem(`todos-${user}`)) || [];
    const renderTodos = () => {
      $("#todo-list").empty();
      $("#done-list").empty();
      todos.sort((a, b) => new Date(a.date + "T" + a.time) - new Date(b.date + "T" + b.time));
      todos.forEach((t, i) => {
        const $li = $("<li>").addClass(t.completed ? "todo-completed" : "");
        const priorityClass = (t.priority || "rendah").toLowerCase();
        $li.html(`
          <strong>${t.title}</strong> (${t.category})<br>
          Deadline: ${t.date} ${t.time}<br>
          ${t.category === "tugas" ? "Link: " : "Lokasi:"} ${t.extra}<br>
          Prioritas: <span class="priority ${priorityClass}">${t.priority}</span>
          <div class="todo-actions">
            <button class="done-btn">${t.completed ? "Belum Selesai" : "Selesai"}</button>
            <button class="delete-btn">Hapus</button>
          </div>
        `);
        $li.find(".done-btn").on("click", function () {
          todos[i].completed = !todos[i].completed;
          localStorage.setItem(`todos-${user}`, JSON.stringify(todos));
          renderTodos();
        });
        $li.find(".delete-btn").on("click", function () {
          todos.splice(i, 1);
          localStorage.setItem(`todos-${user}`, JSON.stringify(todos));
          renderTodos();
        });
        if (t.completed) { $("#done-list").append($li); }
        else { $("#todo-list").append($li); }
      });
    };
    renderTodos();

    $("#todo-category").on("change", function () {
      const val = $(this).val();
      const placeholder = val === "tugas" ? "Link Pengumpulan" : val === "meeting" ? "Lokasi Meeting" : "Link/Lokasi";
      $("#todo-extra").attr("placeholder", placeholder);
    });

    $("#todo-form").on("submit", function (e) {
      e.preventDefault();
      const newTask = {
        title: $("#todo-title").val(),
        category: $("#todo-category").val(),
        extra: $("#todo-extra").val(),
        date: $("#todo-deadline").val(),
        time: $("#todo-time").val(),
        priority: $("#todo-priority").val(),
        completed: false,
      };
      todos.push(newTask);
      localStorage.setItem(`todos-${user}`, JSON.stringify(todos));
      $("#add-success").fadeIn().delay(2000).fadeOut();
      renderTodos();
      this.reset();
    });
  }
});
