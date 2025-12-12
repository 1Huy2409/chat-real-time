const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

module.exports.chat = async (req, res) => {
  const roomChatId = req.params.roomChatId;
  const fullName = res.locals.user.fullName;
  const userId = res.locals.user.id;

  // Lấy danh sách chat với limit để tránh load quá nhiều
  const chats = await Chat.find({
    room_chat_id: roomChatId,
    delete: false,
  })
    .sort({ createdAt: -1 })
    .limit(100) // Giới hạn 100 tin nhắn gần nhất
    .lean(); // Sử dụng lean() để tăng tốc

  // Lấy danh sách user_id duy nhất
  const userIds = [...new Set(chats.map((chat) => chat.user_id))];

  // Query 1 lần duy nhất thay vì N lần (Fix N+1 problem)
  const users = await User.find({
    _id: { $in: userIds },
  })
    .select("fullName avatar")
    .lean();

  // Tạo map để lookup nhanh
  const userMap = {};
  users.forEach((user) => {
    userMap[user._id.toString()] = user;
  });

  // Gán thông tin user vào chat
  chats.forEach((chat) => {
    chat.infoUser = userMap[chat.user_id] || { fullName: "Unknown" };
  });

  // Đảo ngược lại để hiển thị từ cũ đến mới
  chats.reverse();

  res.render("client/pages/chat/index", {
    pageTitle: "Chat",
    chats: chats,
    user: res.locals.user,
  });
};
