const { ethers } = require("ethers");
const pool = require("../db/pool");
const nftMarketplace = require("../utils/contractInstance");

const ensureUserExists = async (walletAddress) => {
  const userQuery = "SELECT id FROM users WHERE wallet_address = $1";
  const userResult = await pool.query(userQuery, [walletAddress]);

  if (userResult.rows.length === 0) {
    const insertUserQuery = `
      INSERT INTO users (wallet_address) 
      VALUES ($1) RETURNING id;
    `;
    const insertUserResult = await pool.query(insertUserQuery, [walletAddress]);
    return insertUserResult.rows[0].id;
  }

  return userResult.rows[0].id;
};

exports.listNFT = async (req, res, next) => {
  try {
    const { nftContract, tokenId, price, metadataURI } = req.body;
    const callerAddress = await nftMarketplace.runner.address;
    const sellerId = await ensureUserExists(callerAddress);

    const tx = await nftMarketplace.listNFT(
      nftContract,
      tokenId,
      ethers.parseEther(price),
      metadataURI
    );

    const query = `
      INSERT INTO nfts (seller_id, nft_contract, token_id, price, metadata_uri)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    const result = await pool.query(query, [
      sellerId,
      nftContract,
      tokenId,
      price,
      metadataURI,
    ]);

    res.status(201).json({
      message: "NFT listed successfully",
      listing: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

exports.buyNFT = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const callerAddress = await nftMarketplace.runner.address;
    await ensureUserExists(callerAddress);

    const listingQuery = "SELECT * FROM nfts WHERE id = $1";
    const listingResult = await pool.query(listingQuery, [listingId]);

    if (listingResult.rows.length === 0) {
      return res.status(404).json({ error: "Listing not found" });
    }

    const listing = listingResult.rows[0];

    const tx = await nftMarketplace.buyNFT(listingId, {
      value: ethers.utils.parseEther(listing.price.toString()),
    });

    const deleteQuery = "DELETE FROM nfts WHERE id = $1";
    await pool.query(deleteQuery, [listingId]);

    res.status(200).json({ message: "NFT purchased successfully" });
  } catch (error) {
    next(error);
  }
};

exports.getEarnings = async (req, res, next) => {
  try {
    const callerAddress = await nftMarketplace.runner.address;

    const earnings = await nftMarketplace.getEarnings(callerAddress);

    res.status(200).json({
      seller: callerAddress,
      earnings: ethers.utils.formatEther(earnings),
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllListings = async (req, res, next) => {
  try {
    const query = "SELECT * FROM nfts";
    const listings = await nftMarketplace.getAllListings(callerAddress);
    const result = await pool.query(query);

    res.status(200).json({ listings: result.rows });
  } catch (error) {
    next(error);
  }
};

exports.getListing = async (req, res, next) => {
  try {
    const query = "SELECT * FROM nfts";
    const { listingId } = req.params;
    const listing = await nftMarketplace.getListing(listingId - 1);
    console.log("Fetched Listing:- ", listing);
    const result = await pool.query(query);

    res.status(200).json({ listings: result.rows });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const query = "SELECT * FROM users";
    const result = await pool.query(query);

    res.status(200).json({ users: result.rows });
  } catch (error) {
    next(error);
  }
};
