const homeRouter = require("./home.route");
const authRouter = require("./auth.route");
const chatRouter = require("./chat.route");
const usersRouter = require("./users.route");
const roomChatRouter = require("./rooms-chat.route");
const authMiddleware = require("../../middlewares/client/auth.middleware");
const userMiddleware = require("../../middlewares/client/user.middleware");
module.exports = (app) => {
  app.use(userMiddleware.tokenUser);
  app.use("/", homeRouter);
  app.use("/auth", authRouter);
  app.use("/users", usersRouter);
  app.use("/chat", authMiddleware.requireAuth, chatRouter);
  app.use("/rooms-chat", authMiddleware.requireAuth, roomChatRouter);
};
