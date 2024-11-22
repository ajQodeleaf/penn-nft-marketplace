const { User, NFT, Transaction, Collection } = require("../models");
const { ethers } = require("ethers");
const { nftMarketplace, wallet } = require("../utils/contractInstance");

const ensureUserExists = async (walletAddress) => {
  let user = await User.findOne({ where: { walletAddress: walletAddress } });

  if (!user) {
    user = await User.create({ walletAddress: walletAddress });
  }

  return user.id;
};

exports.createUser = async (req, res, next) => {
  try {
    const { walletAddress } = req.body;
    const userId = await ensureUserExists(walletAddress);
    res.status(201).json({ message: "User created successfully", userId });
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

exports.createCollection = async (req, res, next) => {
  try {
    const { name, description, contractAddress } = req.body;
    const creatorAddress = await nftMarketplace.runner.address;
    const creatorId = await ensureUserExists(creatorAddress);

    const collection = await Collection.create({
      name,
      description,
      contractAddress: contractAddress,
      creatorId: creatorId,
    });

    res.status(201).json({
      message: "Collection created successfully",
      collection,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCollectionByContract = async (req, res, next) => {
  try {
    const { contractAddress } = req.params;

    const collection = await Collection.findOne({
      where: { contractAddress: contractAddress },
    });

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    res.status(200).json({ collection });
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

exports.createTransaction = async (req, res, next) => {
  try {
    const { nftId, buyerWallet, amount } = req.body;

    const buyerId = await ensureUserExists(buyerWallet);
    const nft = await NFT.findByPk(nftId);

    if (!nft) {
      return res.status(404).json({ message: "NFT not found" });
    }

    const sellerId = nft.sellerId;

    const transaction = await Transaction.create({
      nftId: nftId,
      buyerId: buyerId,
      sellerId: sellerId,
      amount,
    });

    res.status(201).json({
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllCollections = async (req, res, next) => {
  try {
    const collections = await Collection.findAll();
    res.status(200).json({ collections });
  } catch (error) {
    next(error);
  }
};

exports.getEarnings = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const totalEarnings = await Transaction.sum("amount", {
      where: { sellerId: userId },
    });

    res.status(200).json({ totalEarnings: totalEarnings || 0 });
  } catch (error) {
    next(error);
  }
};

exports.getListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const nft = await NFT.findByPk(id);

    if (!nft) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json({ listing: nft });
  } catch (error) {
    next(error);
  }
};

exports.getAllListings = async (req, res, next) => {
  try {
    const listings = await NFT.findAll({ where: { isVerified: true } });
    res.status(200).json({ listings });
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

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

exports.listNFT = async (req, res, next) => {
  try {
    console.log("Body content passed:- ", req.body);
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
      "function setApprovalForAll(address operator, bool approved) public",
      "function approve(address to, uint256 tokenId) public",
      "function transferFrom(address from, address to, uint256 tokenId) public",
    ];

    const nftContractInstance = new ethers.Contract(
      nftContract,
      MINIMAL_ERC721_ABI,
      wallet
    );
    console.log(
      "NFT Contract Instance:- ",
      nftContractInstance,
      callerAddress,
      process.env.NFT_MARKETPLACE_CONTRACT_ADDRESS
    );

    if (!callerAddress || !process.env.NFT_MARKETPLACE_CONTRACT_ADDRESS) {
      throw new Error(
        "Caller address or marketplace contract address is invalid."
      );
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
        .json({ message: "NFT is already listed by this seller" });
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
        .json({ message: "Failed to list NFT on the blockchain" });
    }

    const nft = await NFT.create({
      sellerId: sellerId,
      nftContract: nftContract,
      tokenId: tokenId,
      price: priceInEther,
      metadataURI: metadataURI,
      description,
      isVerified: true,
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

    const tx = await nftMarketplace.buyNFT(nft.nftContract, nft.tokenId, {
      value: ethers.parseEther(nft.price.toString()),
    });

    await Transaction.create({
      nftId: nftId,
      buyerId: buyerId,
      sellerId: nft.sellerId,
      amount: nft.price,
    });

    nft.sellerId = buyerId;
    await nft.save();

    res.status(200).json({
      message: "NFT purchased successfully",
      nft,
      tx,
    });
  } catch (error) {
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

exports.getUserByWallet = async (req, res, next) => {
  try {
    const { walletAddress } = req.params;
    const user = await User.findOne({
      where: { walletAddress: walletAddress },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.findAll({
      include: [
        { model: NFT, as: "nft" },
        { model: User, as: "buyer" },
        { model: User, as: "seller" },
      ],
    });

    res.status(200).json({ transactions });
  } catch (error) {
    next(error);
  }
};
