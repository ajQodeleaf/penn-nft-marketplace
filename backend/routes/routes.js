const express = require("express");
const router = express.Router();
const {
  getUser,
  createUser,
  createCollection,
  createNFT,
  getCollectionByContract,
  verifyNFT,
  createTransaction,
  getNFTById,
  updateNFT,
  deleteNFT,
  getTransactionHistoryByNFTId,
  getAllListings,
  getListing,
  getEarnings,
  getAllCollections,
  getAllNFTs,
  getUserByWallet,
  updateUser,
  getAllTransactions,
  getAllUsers,
  listNFT,
  buyNFT,
} = require("../controllers/controllers");

router.get("/users", getAllUsers);
router.get("/user/:id", getUser);
router.get("/user/:walletAddress", getUserByWallet);
router.post("/user", createUser);
router.put("/user/:id", updateUser);

router.get("/collections", getAllCollections);
router.get("/collection/:contractAddress", getCollectionByContract);
router.post("/collection", createCollection);

router.get("/nfts", getAllNFTs);
router.get("/nft/:id", getNFTById);
router.post("/nft", createNFT);
router.put("/nft/:id", updateNFT);
router.delete("/nft/:id", deleteNFT);
router.post("/nft/list", listNFT);
router.post("/nft/buy/:listingId", buyNFT);
router.post("/nft/verify/:id", verifyNFT);

router.get("/transactions", getAllTransactions);
router.get("/transaction/:nftId", getTransactionHistoryByNFTId);
router.post("/transaction", createTransaction);

router.get("/listings", getAllListings);
router.get("/listing/:listingId", getListing);

router.get("/earnings", getEarnings);

module.exports = router;
