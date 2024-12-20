import dotenv from 'dotenv';
import hardhat from 'hardhat';
import fs from 'fs';

dotenv.config();

async function main() {
  console.log('🚀 Deploying contract to Sepolia network... ⛓️');

  await hardhat.run('compile');
  console.log('🛠️ Contract compiled successfully! ✅');

  const NFTMarketplace = await hardhat.ethers.getContractFactory('NFTMarketplace');

  const nftMarketplace = await NFTMarketplace.deploy();

  const deployedAddress = await nftMarketplace.getAddress();
  console.log('🎉 NFTMarketplace deployed to:', deployedAddress);
  console.log('🚀 Deployment completed. 🎉');

  fs.writeFileSync('deployed_address.txt', deployedAddress);
  console.log('✅ Deployed address written to deployed_address.txt');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Error during deployment:', error);
    process.exit(1);
  });
