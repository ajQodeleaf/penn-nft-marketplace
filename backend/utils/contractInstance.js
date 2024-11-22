const { ethers } = require("hardhat");
require("dotenv").config();
const nftMarketplaceContractABI =
  require("../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json").abi;

const {
  INFURA_SEPOLIA_API_KEY,
  PRIVATE_KEY,
  NFT_MARKETPLACE_CONTRACT_ADDRESS,
} = process.env;

const provider = new ethers.InfuraProvider("sepolia", INFURA_SEPOLIA_API_KEY);

const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const nftMarketplaceAddress = NFT_MARKETPLACE_CONTRACT_ADDRESS;

const nftMarketplace = new ethers.Contract(
  nftMarketplaceAddress,
  nftMarketplaceContractABI,
  wallet
);

module.exports = { nftMarketplace, wallet};
