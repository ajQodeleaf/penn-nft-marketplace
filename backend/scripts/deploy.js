const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🚀 Deploying contract to Sepolia network... ⛓️");

  await hre.run("compile");
  console.log("🛠️ Contract compiled successfully! ✅");

  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
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
