import hardhat from "hardhat";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const contractAddress = process.env.TOKEN_CONTRACT_ADDRESS;

  if (!contractAddress) {
    console.error(
      "❌ Contract address is not set in the environment variable TOKEN_CONTRACT_ADDRESS."
    );
    process.exit(1);
  }

  console.log("🔍 Verifying contract at address:", contractAddress);

  try {
    await hardhat.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
    });
    console.log("✅ Contract verified on Etherscan! 🎉");
  } catch (error) {
    console.error("❌ Error verifying contract:", error.message);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("💥 Error during contract verification:", error.message);
    process.exit(1);
  });
