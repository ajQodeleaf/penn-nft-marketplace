const express = require("express");
const {
  listNFT,
  buyNFT,
  getEarnings,
  getAllListings,
  getAllUsers,
  getListing
} = require("../controllers/controllers");

const router = express.Router();

router.post("/list", listNFT);
router.post("/buy/:listingId", buyNFT);
router.get("/earnings", getEarnings);
router.get("/listings", getAllListings);
router.get("/list/:listingId", getListing);
router.get("/users", getAllUsers);

module.exports = router;
