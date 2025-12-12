// Singleton pattern để tránh tạo nhiều socket connections
if (typeof window.socket === "undefined") {
  // Lấy userId từ body attribute
  const myUserId = document.body.getAttribute("my-user-id");

  window.socket = io({
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    transports: ["websocket", "polling"], // Ưu tiên websocket
    auth: {
      userId: myUserId,
    },
  });

  window.socket.on("connect", () => {
    console.log("Socket connected:", window.socket.id);
    // Set userId vào socket instance để dùng ở server
    window.socket.userId = myUserId;
  });

  window.socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

  window.socket.on("reconnect", (attemptNumber) => {
    console.log("Socket reconnected after", attemptNumber, "attempts");
  });
}

// Export socket để dùng trong các file khác
var socket = window.socket;
