const { NFT, User, Collection, Transaction } = require("../models");
const { nftMarketplace, wallet } = require("../utils/contractInstance");
const { ethers } = require("ethers");

const ensureUserExists = async (walletAddress) => {
  if (!walletAddress) {
    throw new Error("Wallet address is required");
  }

  const normalizedAddress = walletAddress.toLowerCase();

  let user = await User.findOne({
    where: {
      walletAddress: normalizedAddress,
    },
  });

  if (!user) {
    user = await User.create({ walletAddress: normalizedAddress });
  }

  return user.id;
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    next(error);
  }
};

exports.getUserByWallet = async (req, res, next) => {
  const { walletAddress } = req.params;
  try {
    const user = await User.findOne({ where: { walletAddress } });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  const { walletAddress, name } = req.body;
  try {
    const newUser = await User.create({ walletAddress, name });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const user = await User.findByPk(id);
    if (user) {
      user.name = name || user.name;
      await user.save();
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    next(error);
  }
};

exports.getAllCollections = async (req, res, next) => {
  try {
    const collections = await Collection.findAll();
    res.status(200).json(collections);
  } catch (error) {
    console.error("Error fetching collections:", error);
    res.status(500).json({ error: "Failed to fetch collections" });
    next(error);
  }
};

exports.getCollectionByContract = async (req, res, next) => {
  const { contractAddress } = req.params;

  try {
    const collectionDetails = await nftMarketplace.getCollectionDetails(
      contractAddress
    );

    if (!collectionDetails) {
      return res
        .status(404)
        .json({ error: "Collection not found on the contract" });
    }

    const collection = await Collection.findOne({
      where: { contractAddress: contractAddress.toLowerCase() },
    });

    if (collection) {
      res.status(200).json(collection);
    } else {
      res.status(404).json({ error: "Collection not found in the database" });
    }
  } catch (error) {
    console.error("Error fetching collection by contract:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch collection by contract address" });
    next(error);
  }
};

exports.createCollection = async (req, res, next) => {
  const { name, description, metadataURI, price, contractAddress, creatorId } =
    req.body;

  if (!name || !metadataURI || !contractAddress || !creatorId) {
    return res.status(400).json({
      error: "Name, metadataURI, contractAddress, and creatorId are required",
    });
  }

  try {
    const tx = await nftMarketplace.createCollection(
      name,
      description,
      metadataURI,
      price,
      contractAddress
    );
    await tx.wait();

    const newCollection = await Collection.create({
      name,
      description,
      metadataURI: metadataURI.toLowerCase(),
      price,
      contractAddress: contractAddress.toLowerCase(),
      creatorId,
    });

    res.status(201).json(newCollection);
  } catch (error) {
    console.error("Error creating collection:", error);
    res.status(500).json({ error: "Failed to create collection" });
    next(error);
  }
};

exports.updateCollection = async (req, res, next) => {
  const { id } = req.params;
  const { name, description, metadataURI, price, isListed, isVerified } =
    req.body;

  if (!name && !metadataURI && !price && !isListed && !isVerified) {
    return res.status(400).json({
      error:
        "At least one of name, description, metadataURI, price, isListed, or isVerified must be provided",
    });
  }

  try {
    const collection = await Collection.findByPk(id);
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
      await tx.wait();
    }

    if (name) collection.name = name;
    if (description) collection.description = description;
    if (metadataURI) collection.metadataURI = metadataURI.toLowerCase();
    if (price) collection.price = price;
    if (isListed !== undefined) collection.isListed = isListed;
    if (isVerified !== undefined) collection.isVerified = isVerified;

    await collection.save();

    res.status(200).json(collection);
  } catch (error) {
    console.error("Error updating collection:", error);
    res.status(500).json({ error: "Failed to update collection" });
    next(error);
  }
};

exports.deleteCollection = async (req, res, next) => {
  const { id } = req.params;

  try {
    const collection = await Collection.findByPk(id);
    if (!collection) {
      return res.status(404).json({ error: "Collection not found" });
    }

    const tx = await nftMarketplace.deleteCollection(
      collection.contractAddress
    );
    await tx.wait();

    await collection.destroy();

    res.status(200).json({ message: "Collection deleted successfully" });
  } catch (error) {
    console.error("Error deleting collection:", error);
    res.status(500).json({ error: "Failed to delete collection" });
    next(error);
  }
};

exports.verifyCollection = async (req, res, next) => {
  const { id } = req.params;

  try {
    const collection = await Collection.findByPk(id);
    if (!collection) {
      return res.status(404).json({ error: "Collection not found" });
    }

    const tx = await nftMarketplace.verifyCollection(
      collection.contractAddress
    );
    await tx.wait();

    collection.isVerified = true;
    await collection.save();

    res.status(200).json({ message: "Collection verified successfully" });
  } catch (error) {
    console.error("Error verifying collection:", error);
    res.status(500).json({ error: "Failed to verify collection" });
    next(error);
  }
};

exports.updateNFT = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { price, description } = req.body;

    const nft = await NFT.findByPk(id);

    if (!nft) {
      return res.status(404).json({ message: "NFT not found" });
    }

    nft.price = price;
    nft.description = description;
    await nft.save();

    res.status(200).json({
      message: "NFT updated successfully",
      nft,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteNFT = async (req, res, next) => {
  try {
    const { id } = req.params;
    const nft = await NFT.findByPk(id);

    if (!nft) {
      return res.status(404).json({ message: "NFT not found" });
    }

    await nftMarketplace.deleteNFT(nft.tokenId, nft.nftContract);
    await nft.destroy();

    res.status(200).json({ message: "NFT deleted successfully", nft });
  } catch (error) {
    next(error);
  }
};

exports.createNFT = async (req, res, next) => {
  try {
    const {
      nftContract,
      tokenId,
      price,
      metadataURI,
      description,
      isVerified,
    } = req.body;

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

    const nft = await NFT.create({
      sellerId: sellerId,
      nftContract: nftContract,
      tokenId: tokenId,
      price,
      metadataURI: metadataURI,
      description,
      isVerified: isVerified,
    });

    res.status(201).json({
      message: "NFT listed successfully",
      nft,
      tx,
    });
  } catch (error) {
    next(error);
  }
};

exports.getNFTById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const nft = await NFT.findByPk(id);

    if (!nft) {
      return res.status(404).json({ message: "NFT not found" });
    }

    res.status(200).json({ nft });
  } catch (error) {
    next(error);
  }
};

exports.verifyNFT = async (req, res, next) => {
  try {
    const { nftContract, tokenId } = req.params;

    const isVerified = await nftMarketplace.isVerifiedNFT(nftContract, tokenId);

    const nft = await NFT.findOne({
      where: { nftContract: nftContract, tokenId: tokenId },
    });

    if (!nft) {
      return res.status(404).json({ message: "NFT not found" });
    }

    nft.isVerified = isVerified;
    await nft.save();

    res.status(200).json({
      message: "NFT verification status updated",
      nft,
    });
  } catch (error) {
    next(error);
  }
};

exports.listNFT = async (req, res, next) => {
  try {
    const {
      nftContract,
      tokenId,
      price,
      metadataURI,
      description,
      isVerified,
    } = req.body;

    const callerAddress = await nftMarketplace.runner.address;

    const sellerId = await ensureUserExists(callerAddress);

    const MINIMAL_ERC721_ABI = [
      "function isApprovedForAll(address owner, address operator) public view returns (bool)",
      "function getApproved(uint256 tokenId) public view returns (address)",
      "function ownerOf(uint256 tokenId) public view returns (address)",
    ];

    const nftContractInstance = new ethers.Contract(
      nftContract,
      MINIMAL_ERC721_ABI,
      wallet
    );

    if (!callerAddress || !process.env.NFT_MARKETPLACE_CONTRACT_ADDRESS) {
      throw new Error(
        "Caller address or marketplace contract address is invalid."
      );
    }

    const approvedAddress = await nftContractInstance.getApproved(tokenId);

    if (approvedAddress !== process.env.NFT_MARKETPLACE_CONTRACT_ADDRESS) {
      return res
        .status(400)
        .json({ message: "NFT is not approved for the marketplace." });
    }

    const priceInEther = ethers.parseEther(price.toString()).toString();

    const existingNFT = await NFT.findOne({
      where: {
        nftContract: nftContract,
        tokenId: tokenId,
        sellerId: sellerId,
      },
    });

    if (existingNFT) {
      return res
        .status(400)
        .json({ message: "NFT is already listed by this seller." });
    }

    const tx = await nftMarketplace.listNFT(
      nftContract,
      tokenId,
      priceInEther,
      metadataURI,
      description,
      isVerified
    );

    if (!tx || !tx.hash) {
      return res
        .status(500)
        .json({ message: "Failed to list NFT on the blockchain." });
    }

    const nft = await NFT.create({
      sellerId: sellerId,
      nftContract: nftContract,
      tokenId: tokenId,
      price: priceInEther,
      metadataURI: metadataURI,
      description,
      isVerified: isVerified,
      name: "NFT",
    });

    res.status(201).json({
      message: "NFT listed successfully",
      nft,
      tx,
    });
  } catch (error) {
    next(error);
  }
};

exports.buyNFT = async (req, res, next) => {
  try {
    const { nftId, buyerWallet } = req.body;

    const buyerId = await ensureUserExists(buyerWallet);
    const nft = await NFT.findByPk(nftId);

    if (!nft) {
      return res.status(404).json({ message: "NFT not found" });
    }

    const tx = await nftMarketplace.buyNFT(nft.id, {
      value: nft.price,
    });

    const receipt = await tx.wait();

    await Transaction.create({
      nftId: nftId,
      buyerId: buyerId,
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
    console.error("Error buying NFT: ", error);
    next(error);
  }
};

exports.getAllNFTs = async (req, res, next) => {
  try {
    const nfts = await NFT.findAll({
      where: { isVerified: true },
      include: [{ model: User, as: "seller" }],
    });
    res.status(200).json({ nfts });
  } catch (error) {
    next(error);
  }
};

exports.getTransactionHistoryByNFTId = async (req, res, next) => {
  try {
    const { nftId } = req.params;
    const transactions = await Transaction.findAll({
      where: { nftId: nftId },
    });
    res.status(200).json({ transactions });
  } catch (error) {
    next(error);
  }
};

exports.getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.findAll({
      include: [
        { model: User, as: "buyer" },
        { model: User, as: "seller" },
        { model: NFT, as: "nft" },
      ],
    });

    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
    next(error);
  }
};

exports.getTransactionHistoryByNFTId = async (req, res, next) => {
  try {
    const { nftId } = req.params;
    const transactions = await Transaction.findAll({
      where: { nftId: nftId },
    });
    res.status(200).json({ transactions });
  } catch (error) {
    next(error);
  }
};

exports.createTransaction = async (req, res, next) => {
  try {
    const { nftId, buyerId, sellerId, amount } = req.body;

    const buyer = await User.findByPk(buyerId);
    const seller = await User.findByPk(sellerId);

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
  } catch (error) {
    next(error);
  }
};

exports.getEarnings = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const transactions = await Transaction.findAll({
      where: { sellerId: userId, status: "Completed" },
    });

    const earnings = transactions.reduce(
      (total, transaction) => total + parseFloat(transaction.amount),
      0
    );

    res.status(200).json({ earnings });
  } catch (error) {
    next(error);
  }
};

exports.withdrawEarnings = async (req, res, next) => {
  try {
    const { sellerAddress } = req.body;

    if (!sellerAddress) {
      return res.status(400).json({ message: "Seller address is required" });
    }

    const earnings = await marketplaceContract.methods
      .getSellerEarnings(sellerAddress)
      .call();

    if (earnings <= 0) {
      return res
        .status(400)
        .json({ message: "No earnings available for withdrawal" });
    }

    const withdrawTransaction = await marketplaceContract.methods
      .withdrawEarnings()
      .send({ from: sellerAddress });

    console.log("Withdraw Transaction: ", withdrawTransaction);

    res.status(200).json({
      message: "Earnings withdrawn successfully",
      amount: earnings,
      transactionHash: withdrawTransaction.transactionHash,
    });
  } catch (error) {
    console.error("Error withdrawing earnings: ", error);
    next(error);
  }
};

exports.getRankings = async (req, res, next) => {
  try {
    const rankings = await User.findAll({
      include: [
        {
          model: Transaction,
          attributes: [
            [Sequelize.fn("sum", Sequelize.col("amount")), "totalEarnings"],
          ],
          group: ["User.id"],
          order: [[Sequelize.fn("sum", Sequelize.col("amount")), "DESC"]],
        },
      ],
      limit: 10,
    });

    res.status(200).json({ rankings });
  } catch (error) {
    next(error);
  }
};
