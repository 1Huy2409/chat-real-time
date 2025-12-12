const express = require("express");
const router = express.Router();
const controller = require("../../controller/client/chat.controller");
const roomMiddleware = require("../../middlewares/client/room.middleware");
router.get("/:roomChatId", roomMiddleware.accessRoom, controller.chat);
module.exports = router;
