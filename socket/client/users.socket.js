const User = require("../../models/user.model");
const RoomChat = require("../../models/rooms-chat.model");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User socket connected, socket.userId:", socket.userId);

    //ADD_FRIEND
    socket.on("CLIENT_ADD_FRIEND", async (userId) => {
      const myUserId = socket.userId;
      console.log(
        "CLIENT_ADD_FRIEND received - myUserId:",
        myUserId,
        "targetUserId:",
        userId
      );
      if (!myUserId) {
        console.log("No myUserId found, ignoring request");
        return;
      }
      const existBinA = await User.findOne({
        _id: myUserId,
        requestFriend: userId,
      });
      if (!existBinA) {
        //add id cua b vao request cua a
        await User.updateOne(
          { _id: myUserId },
          {
            $push: { requestFriend: userId },
          }
        );
      }
      const existAinB = await User.findOne({
        _id: userId,
        acceptFriend: myUserId,
      });
      if (!existAinB) {
        //add id cua b vao request cua a
        await User.updateOne(
          { _id: userId },
          {
            $push: { acceptFriend: myUserId },
          }
        );
      }
      const infoUserB = await User.findOne({
        _id: userId,
      });
      const infoUserA = await User.findOne({
        _id: myUserId,
      });
      socket.broadcast.emit("SERVER_RETURN_USERS_ACCEPT_LENGTH", {
        UserIdB: userId,
        acceptLength: infoUserB.acceptFriend.length,
      });
      socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT", {
        infoUserA: infoUserA,
        userIdB: userId,
      });
      socket.broadcast.emit("SERVER_RETURN_ID_REQUEST", {
        userIdA: myUserId,
        userIdB: userId,
      });
    });
    //CANCEL REQUEST
    socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
      const myUserId = socket.userId;
      if (!myUserId) return;

      const existBinA = await User.findOne({
        _id: myUserId,
        requestFriend: userId,
      });
      if (existBinA) {
        //add id cua b vao request cua a
        await User.updateOne(
          { _id: myUserId },
          {
            $pull: { requestFriend: userId },
          }
        );
      }
      const existAinB = await User.findOne({
        _id: userId,
        acceptFriend: myUserId,
      });
      if (existAinB) {
        //add id cua b vao request cua a
        await User.updateOne(
          { _id: userId },
          {
            $pull: { acceptFriend: myUserId },
          }
        );
      }
      const infoUserB = await User.findOne({
        _id: userId,
      });
      socket.broadcast.emit("SERVER_RETURN_USERS_ACCEPT_LENGTH", {
        UserIdB: userId,
        acceptLength: infoUserB.acceptFriend.length,
      });
      socket.broadcast.emit("SERVER_RETURN_ID_ACCEPT", {
        userIdA: myUserId,
        userIdB: userId,
      });
    });
    //REFUSE REQUEST
    socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
      const myUserId = socket.userId;
      if (!myUserId) return;

      const existBinA = await User.findOne({
        _id: myUserId,
        acceptFriend: userId,
      });
      if (existBinA) {
        //add id cua b vao request cua a
        await User.updateOne(
          { _id: myUserId },
          {
            $pull: { acceptFriend: userId },
          }
        );
      }
      const existAinB = await User.findOne({
        _id: userId,
        requestFriend: myUserId,
      });
      if (existAinB) {
        //add id cua b vao request cua a
        await User.updateOne(
          { _id: userId },
          {
            $pull: { requestFriend: myUserId },
          }
        );
      }
    });
    //ACCEPT REQUEST
    socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
      const myUserId = socket.userId;
      if (!myUserId) return;

      //diff: push userId and myUserId into friendList of each other
      const existBinA = await User.findOne({
        _id: myUserId,
        acceptFriend: userId,
      });
      const existAinB = await User.findOne({
        _id: userId,
        requestFriend: myUserId,
      });
      let roomChat;
      if (existAinB && existBinA) {
        roomChat = new RoomChat({
          users: [
            {
              user_id: myUserId,
              role: "user",
            },
            {
              user_id: userId,
              role: "user",
            },
          ],
        });
        await roomChat.save();
      }
      if (existBinA) {
        //add id cua b vao request cua a
        await User.updateOne(
          { _id: myUserId },
          {
            $pull: { acceptFriend: userId },
            $push: {
              friendList: {
                user_id: userId,
                room_chat_id: roomChat.id,
              },
            },
          }
        );
      }
      if (existAinB) {
        await User.updateOne(
          { _id: userId },
          {
            $pull: { requestFriend: myUserId },
            $push: {
              friendList: {
                user_id: myUserId,
                room_chat_id: roomChat.id,
              },
            },
          }
        );
      }
    });
    // SERVER_RETURN_USERS_ACCEPT_LENGTH
  });
};
