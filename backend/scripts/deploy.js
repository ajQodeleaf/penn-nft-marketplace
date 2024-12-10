import hardhat from "hardhat";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("🚀 Deploying contract to Sepolia network... ⛓️");

  await hardhat.run("compile");
  console.log("🛠️ Contract compiled successfully! ✅");

  const NFTMarketplace = await hardhat.ethers.getContractFactory(
    "NFTMarketplace"
  );
  const nftMarketplace = await NFTMarketplace.deploy();

  console.log(
    "🎉 NFTMarketplace deployed to:",
    await nftMarketplace.getAddress()
  );
  console.log("🚀 Deployment completed. 🎉");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("💥 Error during deployment:", error);
    process.exit(1);
  });
