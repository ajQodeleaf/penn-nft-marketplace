import dotenv from 'dotenv';
import hardhat from 'hardhat';
import fs from 'fs';

dotenv.config();

async function main() {
  let contractAddress = process.env.NFT_MARKETPLACE_CONTRACT_ADDRESS;

  if (!contractAddress) {
    try {
      contractAddress = fs.readFileSync('deployed_address.txt', 'utf8').trim();
      console.log('📄 Contract address loaded from deployed_address.txt:', contractAddress);
    } catch (error) {
      console.error(
        '❌ Could not read deployed_address.txt. Please ensure the file exists and contains the contract address.', error
      );
      process.exit(1);
    }
  }

  if (!contractAddress) {
    console.error('❌ Contract address is missing. Unable to proceed with verification.');
    process.exit(1);
  }

  console.log('🔍 Verifying contract at address:', contractAddress);

  try {
    await hardhat.run('verify:verify', {
      address: contractAddress,
      constructorArguments: [],
    });
    console.log('✅ Contract verified on Etherscan! 🎉');
  } catch (error) {
    console.error('❌ Error verifying contract:', error.message);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Error during contract verification:', error.message);
    process.exit(1);
  });
