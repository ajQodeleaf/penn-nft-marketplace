# NFT Marketplace Project

This project contains a smart contract for an NFT marketplace, deployed and managed using Hardhat. Follow the instructions below to set up, deploy, verify, and run the server for this project.

## Prerequisites

- Node.js and npm installed on your machine.
- Hardhat installed as a dependency (included in the `package.json`).
- A `.env` file for storing sensitive information like contract addresses, API keys, etc.

## Getting Started

### 1. Install Dependencies

To install all required dependencies, run:

```shell
npm i
```

### 2. Deploy the Contract

The deployment script (`scripts/deploy.js`) compiles and deploys and verifies the `NFTMarketplace.sol` contract to the specified `network-name`. To run the script:

```shell
npx hardhat run scripts/deploy.js --network <network-name>
```

### 3. Save the Contract Address

After deploying, copy the contract address and save it in the `.env` file as follows:
NFT_MARKETPLACE_CONTRACT_ADDRESS=<your-contract-address>

### 4. Verify the Contract

To verify the deployed contract on the blockchain (using hardhat command from cli), use:

```shell
npx hardhat verify --network <network-name> <contract-address>
```

or we can also do it programmatically by using the command:-

```shell
npx hardhat run scripts/verify.js --network <network-name>
```

### 5. Start the Server

To start the server and run the application:

```shell
npm run start
```

## Summary of Commands

| Step                   | Command                                                          |
| ---------------------- | ---------------------------------------------------------------- |
| Install dependencies   | `npm i`                                                          |
| Deploy contract        | `npx hardhat run scripts/deploy.js--network <network-name>`      |
| Verify contract (cli)  | `npx hardhat verify --network <network-name> <contract-address>` |
| Verify contract (code) | `npx hardhat run scripts/deploy.js--network <network-name>`      |
| Start server           | `npm run start`                                                  |

## Additional Notes

- Ensure your `.env` file includes all necessary environment variables. Check out the `.env.example` file for more information
- Ensure the `network-name` is present, if you want to deploy the contract to a particular network, if not specified, deployment is done to local hardhat network.
- Don't forget to save the delpoyedcontract address to the environment variable `NFT_MARKETPLACE_CONTRACT_ADDRESS`
- Refer to `hardhat.config.js` to set up custom networks if necessary.
