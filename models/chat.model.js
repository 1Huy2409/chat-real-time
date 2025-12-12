const mongoose = require("mongoose");
var slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const chatSchema = new mongoose.Schema(
  {
    user_id: String,
    room_chat_id: String,
    content: String,
    images: Array,
    delete: {
      type: Boolean,
      default: false,
    },
    deleteAt: Date,
  },
  {
    timestamps: true,
  }
);

// Thêm index để tăng tốc query
chatSchema.index({ room_chat_id: 1, createdAt: -1 });
chatSchema.index({ user_id: 1 });
chatSchema.index({ delete: 1 });

const Chat = mongoose.model("Chat", chatSchema, "chats");
module.exports = Chat;
