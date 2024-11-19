const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🚀 Deploying contract to Sepolia network... ⛓️");

  await hre.run("compile");
  console.log("🛠️ Contract compiled successfully! ✅");

  const ELA = await hre.ethers.getContractFactory("ELA");
  const ela = await ELA.deploy();

  console.log(
    "🎉 Token contract deployed to:",
    await ela.getAddress()
  );
  console.log("🚀 Deployment completed. 🎉");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("💥 Error during deployment:", error);
    process.exit(1);
  });
