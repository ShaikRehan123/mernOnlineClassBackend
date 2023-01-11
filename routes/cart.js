const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../lib/lib");
const cart_controller = require("../controllers/cart");

router.post("/add", isLoggedIn, cart_controller.addToCart);
router.get("/getCart", isLoggedIn, cart_controller.getCart);
router.post("/remove", isLoggedIn, cart_controller.removeFromCart);

module.exports = router;
