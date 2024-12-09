const NFT = require("../models/nft");
const User = require("../models/user");
const Transaction = require("../models/transaction");
const Collection = require("../models/collection");
const { nftMarketplace, wallet } = require("../utils/contractInstance");
const { ethers } = require("ethers");
const {
  catchAsync,
  ensureUserExists,
  handleBlockchainTransaction,
} = require("../utils/helpers");

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

exports.getUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

exports.getUserByWallet = catchAsync(async (req, res) => {
  const { walletAddress } = req.params;

  if (!walletAddress) {
    return res.status(400).json({ message: "Wallet address is required" });
  }

  const user = await User.findOne({ walletAddress });
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

exports.createUser = catchAsync(async (req, res) => {
  const { walletAddress, name } = req.body;

  if (!walletAddress || !name) {
    return res
      .status(400)
      .json({ message: "Wallet address and name are required" });
  }

  const newUser = await User.create({ walletAddress, name });
  res.status(201).json(newUser);
});

exports.updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const user = await User.findById(id);
  if (user) {
    user.name = name || user.name;
    await user.save();
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

exports.createNFT = catchAsync(async (req, res) => {
  const { nftContract, tokenId, price, metadataURI, description, isVerified } =
    req.body;

  const callerAddress = await nftMarketplace.runner.address;
  const sellerId = await ensureUserExists(callerAddress);

  const tx = await nftMarketplace.listNFT(
    nftContract,
    tokenId,
    ethers.parseEther(price),
    metadataURI,
    description,
    isVerified
  );
  const txReceipt = await handleBlockchainTransaction(tx);

  const nft = await NFT.create({
    sellerId,
    nftContract,
    tokenId,
    price,
    metadataURI,
    description,
    isVerified,
  });

  res.status(201).json({
    message: "NFT listed successfully",
    nft,
    txReceipt,
  });
});

exports.listNFT = catchAsync(async (req, res) => {
  const {
    nftContract,
    tokenId,
    price,
    name,
    metadataURI,
    description,
    isVerified,
  } = req.body;
  const callerAddress = nftMarketplace.runner.address;

  const sellerId = await ensureUserExists(callerAddress);

  const nftContractInstance = new ethers.Contract(
    nftContract,
    [
      "function getApproved(uint256 tokenId) view returns (address)",
      "function ownerOf(uint256 tokenId) view returns (address)",
    ],
    wallet
  );

  const approvedAddress = await nftContractInstance.getApproved(tokenId);
  if (approvedAddress !== process.env.NFT_MARKETPLACE_CONTRACT_ADDRESS) {
    return res
      .status(400)
      .json({ message: "NFT is not approved for the marketplace." });
  }

  const tx = await nftMarketplace.listNFT(
    nftContract,
    tokenId,
    ethers.parseEther(price.toString()),
    name,
    metadataURI,
    description,
    isVerified
  );
  await handleBlockchainTransaction(tx);

  const nft = await NFT.create({
    sellerId,
    nftContract,
    tokenId,
    price,
    name,
    metadataURI,
    description,
    isVerified,
  });

  res.status(201).json({ message: "NFT listed successfully", nft });
});

exports.buyNFT = catchAsync(async (req, res) => {
  const { nftId, buyerWallet } = req.body;

  if (!nftId || !buyerWallet) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const buyerId = await ensureUserExists(buyerWallet);

  try {
    const nft = await NFT.findOne({ tokenId: Number(nftId) });
    console.log(`NFT Found with tokenID ${nftId}:- `, nft);

    if (!nft) {
      return res.status(404).json({ message: "NFT not found" });
    }

    const priceInEther = ethers.parseUnits(nft.price.toString(), "ether");
    console.log("Price In Ether:- ", priceInEther);

    const tx = await nftMarketplace.buyNFT(nft.tokenId - 1, {
      value: priceInEther,
      from: buyerWallet,
    });

    const receipt = await handleBlockchainTransaction(tx);

    await Transaction.create({
      nftId: nft._id,
      buyerId,
      sellerId: nft.sellerId,
      value: nft.price,
    });

    nft.sellerId = buyerId;
    await nft.save();

    res.status(200).json({
      message: "NFT purchased successfully",
      nft,
      receipt,
    });
  } catch (error) {
    console.error("Error executing transaction on the blockchain:", error);
    res.status(500).json({
      message: "Error executing transaction on the blockchain",
      error: error.message,
    });
  }
});

exports.updateNFT = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { price, description } = req.body;

  const nft = await NFT.findById(id);
  if (!nft) return res.status(404).json({ message: "NFT not found" });

  nft.price = price || nft.price;
  nft.description = description || nft.description;
  await nft.save();

  res.status(200).json({ message: "NFT updated successfully", nft });
});

exports.deleteNFT = catchAsync(async (req, res) => {
  const { id } = req.params;
  const nft = await NFT.findById(id);

  if (!nft) return res.status(404).json({ message: "NFT not found" });

  const tx = await nftMarketplace.deleteNFT(nft.tokenId, nft.nftContract);
  await handleBlockchainTransaction(tx);

  await nft.deleteOne();
  res.status(200).json({ message: "NFT deleted successfully" });
});

exports.verifyNFT = catchAsync(async (req, res) => {
  const { nftContract, tokenId } = req.params;

  const isVerified = await nftMarketplace.isVerifiedNFT(nftContract, tokenId);

  const nft = await NFT.findOne({ nftContract, tokenId });

  if (!nft) {
    return res.status(404).json({ message: "NFT not found" });
  }

  nft.isVerified = isVerified;
  await nft.save();

  res.status(200).json({
    message: "NFT verification status updated",
    nft,
  });
});

exports.getAllNFTs = catchAsync(async (req, res) => {
  const nfts = await NFT.find({ isVerified: true }).populate("sellerId");
  res.status(200).json({ nfts });
});

exports.getNFTById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const nft = await NFT.findById(id);

  if (!nft) {
    return res.status(404).json({ message: "NFT not found" });
  }

  res.status(200).json({ nft });
});

exports.getTransactionHistoryByNFTId = catchAsync(async (req, res) => {
  const { nftId } = req.params;

  const transactions = await Transaction.find({ nftId });
  res.status(200).json({ transactions });
});

exports.getAllCollections = catchAsync(async (req, res) => {
  const collections = await Collection.find({});
  res.status(200).json(collections);
});

exports.getCollectionByContract = catchAsync(async (req, res) => {
  const { contractAddress } = req.params;
  const collectionDetails = await nftMarketplace.getCollectionDetails(
    contractAddress
  );

  if (!collectionDetails) {
    return res
      .status(404)
      .json({ error: "Collection not found on the contract" });
  }

  const collection = await Collection.findOne({
    contractAddress: contractAddress.toLowerCase(),
  });

  if (collection) {
    res.status(200).json(collection);
  } else {
    res.status(404).json({ error: "Collection not found in the database" });
  }
});

exports.createCollection = catchAsync(async (req, res) => {
  const { name, description, metadataURI, price, contractAddress, creatorId } =
    req.body;

  if (!name || !metadataURI || !contractAddress || !creatorId) {
    return res.status(400).json({
      error: "Name, metadataURI, contractAddress, and creatorId are required",
    });
  }

  const tx = await nftMarketplace.createCollection(
    name,
    description,
    metadataURI,
    price,
    contractAddress
  );
  const txReceipt = await handleBlockchainTransaction(tx);

  const newCollection = await Collection.create({
    name,
    description,
    metadataURI: metadataURI.toLowerCase(),
    price,
    contractAddress: contractAddress.toLowerCase(),
    creatorId,
  });

  res.status(201).json({ collection: newCollection, txReceipt });
});

exports.updateCollection = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, description, metadataURI, price, isListed, isVerified } =
    req.body;

  if (
    !name &&
    !description &&
    !metadataURI &&
    !price &&
    isListed === undefined &&
    isVerified === undefined
  ) {
    return res.status(400).json({
      error:
        "At least one of name, description, metadataURI, price, isListed, or isVerified must be provided",
    });
  }

  const collection = await Collection.findById(id);
  if (!collection) {
    return res.status(404).json({ error: "Collection not found" });
  }

  if (name || description || metadataURI || price) {
    const tx = await nftMarketplace.updateCollectionDetails(
      collection.contractAddress,
      name,
      description,
      metadataURI,
      price
    );
    await handleBlockchainTransaction(tx);
  }

  if (name) collection.name = name;
  if (description) collection.description = description;
  if (metadataURI) collection.metadataURI = metadataURI.toLowerCase();
  if (price) collection.price = price;
  if (isListed !== undefined) collection.isListed = isListed;
  if (isVerified !== undefined) collection.isVerified = isVerified;

  await collection.save();

  res.status(200).json(collection);
});

exports.deleteCollection = catchAsync(async (req, res) => {
  const { id } = req.params;
  const collection = await Collection.findById(id);
  if (!collection) {
    return res.status(404).json({ error: "Collection not found" });
  }

  const tx = await nftMarketplace.deleteCollection(collection.contractAddress);
  await handleBlockchainTransaction(tx);

  await collection.remove();

  res.status(200).json({ message: "Collection deleted successfully" });
});

exports.verifyCollection = catchAsync(async (req, res) => {
  const { id } = req.params;
  const collection = await Collection.findById(id);

  if (!collection)
    return res.status(404).json({ error: "Collection not found" });

  const tx = await nftMarketplace.verifyCollection(collection.contractAddress);
  await handleBlockchainTransaction(tx);

  collection.isVerified = true;
  await collection.save();

  res.status(200).json({ message: "Collection verified successfully" });
});

exports.createTransaction = catchAsync(async (req, res) => {
  const { nftId, buyerId, sellerId, amount } = req.body;

  const buyer = await User.findById(buyerId);
  const seller = await User.findById(sellerId);

  if (!buyer || !seller) {
    return res.status(404).json({ message: "Buyer or Seller not found" });
  }

  const transaction = await Transaction.create({
    nftId,
    buyerId,
    sellerId,
    amount,
    status: "Completed",
  });

  res
    .status(201)
    .json({ message: "Transaction created successfully", transaction });
});

exports.getAllTransactions = catchAsync(async (req, res) => {
  const transactions = await Transaction.find({})
    .populate("buyerId", "name email")
    .populate("sellerId", "name email")
    .populate("nftId", "name price");
  res.status(200).json({ transactions });
});

exports.getEarnings = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const transactions = await Transaction.find({
    sellerId: userId,
    status: "Completed",
  });

  const earnings = transactions.reduce(
    (total, transaction) => total + parseFloat(transaction.amount),
    0
  );

  res.status(200).json({ earnings });
});

exports.withdrawEarnings = catchAsync(async (req, res) => {
  const { sellerAddress } = req.body;

  if (!sellerAddress)
    return res.status(400).json({ message: "Seller address is required" });

  const earnings = await nftMarketplace.getSellerEarnings(sellerAddress);
  if (earnings <= 0)
    return res
      .status(400)
      .json({ message: "No earnings available for withdrawal" });

  const tx = await nftMarketplace.withdrawEarnings({ from: sellerAddress });
  const receipt = await handleBlockchainTransaction(tx);

  res.status(200).json({
    message: "Earnings withdrawn successfully",
    amount: ethers.formatEther(earnings),
    transactionHash: receipt.transactionHash,
  });
});

exports.getRankings = catchAsync(async (req, res) => {
  const rankings = await Transaction.aggregate([
    {
      $match: { status: "Completed" },
    },
    {
      $group: {
        _id: "$sellerId",
        totalEarnings: { $sum: { $toDouble: "$amount" } },
      },
    },
    {
      $sort: { totalEarnings: -1 },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "sellerDetails",
      },
    },
    {
      $unwind: "$sellerDetails",
    },
    {
      $project: {
        _id: 0,
        seller: "$sellerDetails.username",
        wallet: "$sellerDetails.wallet",
        totalEarnings: 1,
      },
    },
  ]);

  if (!rankings.length) {
    return res.status(404).json({ message: "No rankings found." });
  }

  const formattedRankings = rankings.map((rank, index) => ({
    rank: index + 1,
    seller: rank.seller,
    wallet: rank.wallet,
    totalEarnings: ethers.formatEther(rank.totalEarnings),
  }));

  res.status(200).json({ rankings: formattedRankings });
});
