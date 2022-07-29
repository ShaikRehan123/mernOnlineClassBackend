const express = require("express");
const router = express.Router();
const { verifyAdmin } = require("../lib/lib");

const admin_controller = require("../controllers/admin");

router.post("/create_admin", admin_controller.create_admin);

router.post("/create_role", verifyAdmin, admin_controller.create_role);
router.get("/get_users", verifyAdmin, admin_controller.get_users);

module.exports = router;
