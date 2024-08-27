const express = require("express");
const {
  allMessages,
  sendMessage,
} = require("../controllers/messageControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

//get all chats of a single chat
router.route("/:chatId").get(protect, allMessages);

//send a message
router.route("/").post(protect, sendMessage);

module.exports = router;
