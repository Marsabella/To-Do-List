$(document).ready(function() {
    // Fungsi menambah item to-do baru
    $('#add-btn').click(function() {
      const task = $('#todo-input').val().trim();
      if (task !== '') {
        const listItem = $(`
          <li class="todo-item">
            <span class="task-text">${task}</span>
            <div class="todo-buttons">
              <button class="done-btn">Selesai</button>
              <button class="delete-btn">Hapus</button>
            </div>
          </li>
        `);
        $('#todo-list').append(listItem.hide().fadeIn(300)); // jQuery animasi
        $('#todo-input').val(''); // Kosongkan input setelah tambah
      }
    });
  
    // Event delegation untuk tombol "Selesai"
    $('#todo-list').on('click', '.done-btn', function() {
      $(this).closest('.todo-item').toggleClass('done');
    });
  
    // Event delegation untuk tombol "Hapus"
    $('#todo-list').on('click', '.delete-btn', function() {
      $(this).closest('.todo-item').fadeOut(300, function() {
        $(this).remove(); // Hapus elemen setelah animasi
      });
    });
  
    // Tambah tugas saat tekan Enter
    $('#todo-input').keypress(function(e) {
      if (e.which === 13) {
        $('#add-btn').click();
      }
    });
  });
  