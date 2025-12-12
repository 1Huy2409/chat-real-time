const express = require("express");
const router = express.Router();

const controller = require("../../controller/client/users.controller");

router.get("/not-friend", controller.notFriend);
router.get("/friend", controller.friendList);
router.get("/request", controller.request);
router.get("/accept", controller.accept);
router.get("/info", controller.info);
router.get("/edit", controller.edit);
router.post("/edit", controller.editPost);
router.get("/change-password", controller.changePassword);
router.post("/change-password", controller.changePasswordPost);

module.exports = router;
