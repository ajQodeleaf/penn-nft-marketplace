import { ethers } from "ethers";
import dotenv from "dotenv";
import nftMarketplaceArtifact from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json" assert { type: "json" };

dotenv.config();

const {
  INFURA_SEPOLIA_API_KEY,
  PRIVATE_KEY,
  NFT_MARKETPLACE_CONTRACT_ADDRESS,
} = process.env;

if (
  !INFURA_SEPOLIA_API_KEY ||
  !PRIVATE_KEY ||
  !NFT_MARKETPLACE_CONTRACT_ADDRESS
) {
  throw new Error(
    "Missing one or more required environment variables: INFURA_SEPOLIA_API_KEY, PRIVATE_KEY, NFT_MARKETPLACE_CONTRACT_ADDRESS"
  );
}

const provider = new ethers.InfuraProvider("sepolia", INFURA_SEPOLIA_API_KEY);

const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const nftMarketplace = new ethers.Contract(
  NFT_MARKETPLACE_CONTRACT_ADDRESS,
  nftMarketplaceArtifact.abi,
  wallet
);

export { nftMarketplace, wallet };
