// Socket handler cho chat
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join room
    socket.on("CLIENT_JOIN_ROOM", (roomChatId) => {
      socket.join(roomChatId);
      console.log(`User ${socket.id} joined room ${roomChatId}`);
    });

    // Send message
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      const { roomChatId, content, userId } = data;

      // Lấy thông tin user từ database
      const User = require("../../models/user.model");
      const user = await User.findById(userId).select("fullName avatar");

      // Lưu vào database
      const Chat = require("../../models/chat.model");
      const chat = new Chat({
        user_id: userId,
        room_chat_id: roomChatId,
        content: content,
      });
      await chat.save();

      // Broadcast to room với thông tin user chính xác
      io.to(roomChatId).emit("SERVER_RETURN_MESSAGE", {
        user_id: userId,
        fullName: user ? user.fullName : "Unknown User",
        content: content,
        createdAt: chat.createdAt,
      });
    });

    // User disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
