const RoomChat = require("../../models/rooms-chat.model");
const User = require("../../models/user.model");
module.exports.index = async (req, res) => {
  // show ra danh sách phòng chat của một user
  const rooms = await RoomChat.find({
    typeRoom: "group",
    "users.user_id": res.locals.user.id,
  });
  res.render("client/pages/rooms/index.pug", {
    pageTitle: "Danh sách phòng chat",
    rooms: rooms,
    user: res.locals.user,
  });
};
module.exports.create = async (req, res) => {
  //lay ra danh sach ban be
  const myUserId = res.locals.user.id;
  const myUser = await User.findOne({
    _id: myUserId,
  });
  const friendList = myUser.friendList;
  for (let friend of friendList) {
    const infoUser = await User.findOne({
      _id: friend.user_id,
    });
    friend.infoUser = infoUser;
  }
  res.render("client/pages/rooms/create", {
    pageTitle: "Tạo phòng",
    friendList: friendList,
    user: res.locals.user,
  });
};
module.exports.createPost = async (req, res) => {
  const usersId = req.body.usersId;
  const dataRoom = {
    title: req.body.title,
    typeRoom: "group",
    users: [],
  };
  for (let userId of usersId) {
    dataRoom.users.push({
      user_id: userId,
      role: "user",
    });
  }
  dataRoom.users.push({
    user_id: res.locals.user.id,
    role: "superAdmin",
  });
  const roomChat = new RoomChat(dataRoom);
  await roomChat.save();
  res.redirect("/rooms-chat");
};
