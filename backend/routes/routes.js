const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUser,
  getUserByWallet,
  createUser,
  updateUser,
  getAllCollections,
  getCollectionByContract,
  createCollection,
  updateCollection,
  deleteCollection,
  verifyCollection,
  getAllNFTs,
  getNFTById,
  createNFT,
  updateNFT,
  deleteNFT,
  listNFT,
  buyNFT,
  verifyNFT,
  getAllTransactions,
  getTransactionHistoryByNFTId,
  createTransaction,
  getEarnings,
  withdrawEarnings,
  getRankings,
} = require("../controllers/controllers");

router.get("/users", getAllUsers);
router.get("/user/:id", getUser);
router.get("/user/wallet/:walletAddress", getUserByWallet);
router.post("/user", createUser);
router.put("/user/:id", updateUser);

router.get("/collections", getAllCollections);
router.get("/collection/:contractAddress", getCollectionByContract);
router.post("/collection", createCollection);
router.put("/collection/:contractAddress", updateCollection);
router.delete("/collection/:contractAddress", deleteCollection);
router.post("/collection/verify/:contractAddress", verifyCollection);

router.get("/nfts", getAllNFTs);
router.get("/nft/:id", getNFTById);
router.post("/nft", createNFT);
router.put("/nft/:id", updateNFT);
router.delete("/nft/:id", deleteNFT);
router.post("/nft/list", listNFT);
router.post("/nft/buy/", buyNFT);
router.post("/nft/verify/:id", verifyNFT);

router.get("/transactions", getAllTransactions);
router.get("/transaction/:nftId", getTransactionHistoryByNFTId);
router.post("/transaction", createTransaction);

router.get("/earnings", getEarnings);
router.post("/earnings/withdraw", withdrawEarnings);

router.get("/rankings", getRankings);

module.exports = router;
