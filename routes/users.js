const express = require("express");
const router = express.Router();
const { getUsersData } = require("../controllers/users");

router.route("/:username").get(getUsersData);

module.exports = router;
