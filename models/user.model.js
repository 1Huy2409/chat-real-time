const mongoose = require("mongoose");
var slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    tokenUser: {
      type: String,
      unique: true,
    },
    phone: String,
    avatar: String,
    status: {
      type: String,
      default: "active",
    },
    statusOnline: String,
    requestFriend: Array,
    acceptFriend: Array,
    friendList: [
      {
        user_id: String,
        room_chat_id: String,
      },
    ],
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
userSchema.index({ email: 1 });
userSchema.index({ tokenUser: 1 });
userSchema.index({ status: 1, delete: 1 });
userSchema.index({ _id: 1, delete: 1, status: 1 });

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
