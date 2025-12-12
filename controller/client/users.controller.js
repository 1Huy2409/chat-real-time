const User = require("../../models/user.model");

module.exports.notFriend = async (req, res) => {
  const userId = res.locals.user.id;

  // Lấy thông tin user với select để giảm data
  const myUser = await User.findOne({
    _id: userId,
  })
    .select("requestFriend acceptFriend friendList")
    .lean();

  const requestFriend = myUser.requestFriend || [];
  const acceptFriend = myUser.acceptFriend || [];
  const friendList = myUser.friendList || [];
  const friendListId = friendList.map((item) => item.user_id);

  const users = await User.find({
    $and: [
      { _id: { $ne: userId } },
      { _id: { $nin: acceptFriend } },
      { _id: { $nin: requestFriend } },
      { _id: { $nin: friendListId } },
    ],
    delete: false,
    status: "active",
  })
    .select("fullName email avatar")
    .limit(50) // Giới hạn 50 users
    .lean();

  console.log("NOT FRIEND PAGE - Found users:", users.length);
  console.log("Current user ID:", userId);

  res.render("client/pages/users/not-friend", {
    pageTitle: "Danh sách người dùng",
    users: users,
    user: res.locals.user,
  });
};

module.exports.request = async (req, res) => {
  const userId = res.locals.user.id;

  const myUser = await User.findOne({
    _id: userId,
  })
    .select("requestFriend")
    .lean();

  const requestFriend = myUser.requestFriend || [];

  const users = await User.find({
    _id: { $in: requestFriend },
    delete: false,
    status: "active",
  })
    .select("fullName email avatar")
    .lean();

  res.render("client/pages/users/request", {
    pageTitle: "Lời mòi đã gửi",
    users: users,
    user: res.locals.user,
  });
};

module.exports.accept = async (req, res) => {
  const userId = res.locals.user.id;

  const myUser = await User.findOne({
    _id: userId,
  })
    .select("acceptFriend")
    .lean();

  const acceptFriend = myUser.acceptFriend || [];

  const users = await User.find({
    _id: { $in: acceptFriend },
    status: "active",
    delete: false,
  })
    .select("fullName email avatar")
    .lean();

  res.render("client/pages/users/accept", {
    pageTitle: "Lời mời kết bạn",
    users: users,
    user: res.locals.user,
  });
};

module.exports.friendList = async (req, res) => {
  const myUserId = res.locals.user.id;

  const myUser = await User.findOne({
    _id: myUserId,
  })
    .select("friendList")
    .lean();

  const friendList = myUser.friendList || [];
  const listUserId = friendList.map((item) => item.user_id);

  const users = await User.find({
    _id: { $in: listUserId },
  })
    .select("fullName email avatar statusOnline")
    .lean();

  // Gán roomChatId cho mỗi friend
  const friendMap = {};
  friendList.forEach((friend) => {
    friendMap[friend.user_id] = friend.room_chat_id;
  });

  users.forEach((user) => {
    user.infoRoomChat = friendMap[user._id.toString()];
  });

  res.render("client/pages/users/friend-list", {
    pageTitle: "Danh sách bạn bè",
    users: users,
    user: res.locals.user,
  });
};

module.exports.info = async (req, res) => {
  const userId = res.locals.user.id;
  const user = await User.findOne({
    _id: userId,
  });

  // Đếm số lượng bạn bè, lời mời...
  const friendCount = user.friendList ? user.friendList.length : 0;
  const requestSentCount = user.requestFriend ? user.requestFriend.length : 0;
  const requestReceivedCount = user.acceptFriend ? user.acceptFriend.length : 0;

  res.render("client/pages/user/info", {
    pageTitle: "Thông tin cá nhân",
    user: user,
    friendCount: friendCount,
    requestSentCount: requestSentCount,
    requestReceivedCount: requestReceivedCount,
  });
};

module.exports.edit = async (req, res) => {
  const userId = res.locals.user.id;
  const user = await User.findOne({
    _id: userId,
  });

  res.render("client/pages/user/edit", {
    pageTitle: "Chỉnh sửa thông tin",
    user: user,
  });
};

module.exports.editPost = async (req, res) => {
  const userId = res.locals.user.id;

  await User.updateOne(
    { _id: userId },
    {
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
    }
  );

  req.flash("success", "Cập nhật thông tin thành công!");
  res.redirect("/users/info");
};

module.exports.changePassword = async (req, res) => {
  res.render("client/pages/user/change-password", {
    pageTitle: "Đổi mật khẩu",
    user: res.locals.user,
  });
};

module.exports.changePasswordPost = async (req, res) => {
  const userId = res.locals.user.id;
  const user = await User.findOne({
    _id: userId,
  });

  const md5 = require("md5");

  // Kiểm tra mật khẩu cũ
  if (md5(req.body.currentPassword) !== user.password) {
    req.flash("error", "Mật khẩu hiện tại không đúng!");
    res.redirect("back");
    return;
  }

  // Kiểm tra mật khẩu mới và xác nhận mật khẩu
  if (req.body.newPassword !== req.body.confirmPassword) {
    req.flash("error", "Xác nhận mật khẩu không khớp!");
    res.redirect("back");
    return;
  }

  // Kiểm tra mật khẩu mới phải khác mật khẩu cũ
  if (req.body.currentPassword === req.body.newPassword) {
    req.flash("error", "Mật khẩu mới phải khác mật khẩu hiện tại!");
    res.redirect("back");
    return;
  }
};
