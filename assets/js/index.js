
$(document).ready(function() {
const socket = io();

// Update memory usage in HTML
function updateMemoryUsage(memoryUsage) {
  const memoryUsageElement = document.getElementById('memory-usage');
  const availableMemoryMB = (memoryUsage.available / (1024 * 1024)).toFixed(2);
  const totalMemoryMB = (memoryUsage.total / (1024 * 1024)).toFixed(2);
  memoryUsageElement.textContent = `${totalMemoryMB} MB | ${availableMemoryMB} MB`;
}

// Listen for memory usage updates from the server
socket.on('memoryUsage', (memoryUsage) => {
  updateMemoryUsage(memoryUsage);
});

// Send an initial request for memory usage
socket.emit('getMemoryUsage');
setInterval(() => {
    socket.emit('getMemoryUsage');
  }, 2000);
// update total user
socket.on('userCountUpdate', (userCount) => {
    updateTotalUsers(userCount);
  });
  
  // Fungsi untuk memperbarui tampilan jumlah pengguna
  function updateTotalUsers(count) {
    const userCountElement = document.getElementById('user-count');
    userCountElement.textContent = count;
}
});

