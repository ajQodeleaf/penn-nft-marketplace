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

---

# NFT Marketplace API Controllers

This repository contains controllers for managing various entities in an NFT marketplace. The controllers provide methods for interacting with the following database tables:

- `Users`
- `Collections`
- `NFTs`
- `Transactions`

Each controller method is responsible for performing specific CRUD (Create, Read, Update, Delete) operations or other functionalities, such as logging transactions or fetching data for the marketplace.

---

## **Table of Contents**

- [Controller Methods Overview](#controller-methods-overview)
- [Methods to Table Mapping](#methods-to-table-mapping)
- [Database Tables](#database-tables)
- [Additional Notes](#additional-notes)

---

## **Controller Methods Overview**

The following methods are implemented in the controllers:

1. **User Management:**

   - `getUser`: Fetches details of a user by ID.
   - `createUser`: Adds a new user to the database.
   - `updateUser`: Updates user details, such as profile information.
   - `getUserByWallet`: Retrieves user details based on their wallet address.

2. **Collection Management:**

   - `createCollection`: Adds a new collection to the database.
   - `getCollectionByContract`: Fetches a collection by its contract address.
   - `getAllCollections`: Fetches all collections.

3. **NFT Management:**

   - `createNFT`: Adds a new NFT to the database and links it to a collection.
   - `getNFTById`: Fetches NFT details by ID.
   - `updateNFT`: Updates metadata or status of an NFT.
   - `deleteNFT`: Deletes an NFT from the database.
   - `getAllNFTs`: Fetches all NFTs in the marketplace.
   - `listNFT`: Marks an NFT as listed for sale.
   - `verifyNFT`: Marks an NFT as verified.

4. **Transaction Management:**

   - `createTransaction`: Logs a new transaction in the database.
   - `getTransactionHistoryByNFTId`: Fetches transaction history for a specific NFT.
   - `getEarnings`: Fetches total earnings for a user.
   - `getAllTransactions`: Fetches all transactions in the marketplace.

5. **Marketplace Operations:**
   - `getAllListings`: Fetches all NFTs currently listed for sale.
   - `getListing`: Fetches details of a specific listing.
   - `buyNFT`: Updates ownership of an NFT and logs the purchase transaction.
   - `getAllUsers`: Fetches all users in the marketplace.

---

## **Methods to Table Mapping**

The table below maps each method to its respective database operations:

| **Controller Method**            | **Operation Type** | **Table(s) Queried**       | **Table(s) Modified** | **Description**                                                                              |
| -------------------------------- | ------------------ | -------------------------- | --------------------- | -------------------------------------------------------------------------------------------- |
| **getUser**                      | Read               | Users                      | None                  | Fetches details of a specific user by their ID.                                              |
| **createUser**                   | Write              | None                       | Users                 | Adds a new user to the `Users` table.                                                        |
| **createCollection**             | Write              | Users (validate ownerId)   | Collections           | Adds a new collection to the `Collections` table.                                            |
| **createNFT**                    | Write              | Collections (validate ID)  | NFTs                  | Adds a new NFT to the `NFTs` table, linked to a collection.                                  |
| **getCollectionByContract**      | Read               | Collections                | None                  | Fetches a collection by its associated contract address.                                     |
| **verifyNFT**                    | Update             | NFTs                       | NFTs                  | Marks an NFT as verified in the `NFTs` table.                                                |
| **createTransaction**            | Write              | NFTs, Users (validate IDs) | Transactions          | Logs a new transaction involving an NFT in the `Transactions` table.                         |
| **getNFTById**                   | Read               | NFTs                       | None                  | Fetches details of a specific NFT by its ID.                                                 |
| **updateNFT**                    | Update             | NFTs                       | NFTs                  | Updates metadata or status of an NFT in the `NFTs` table.                                    |
| **deleteNFT**                    | Delete             | NFTs                       | NFTs                  | Deletes an NFT from the `NFTs` table by its ID.                                              |
| **getTransactionHistoryByNFTId** | Read               | Transactions               | None                  | Fetches all transactions associated with a specific NFT ID.                                  |
| **getAllListings**               | Read               | NFTs                       | None                  | Fetches all NFTs marked as "listed" in the `NFTs` table.                                     |
| **getListing**                   | Read               | NFTs                       | None                  | Fetches details of a specific listing (NFT marked as listed) by its ID.                      |
| **getEarnings**                  | Read               | Transactions               | None                  | Calculates and fetches earnings for a specific user from the `Transactions` table.           |
| **getAllCollections**            | Read               | Collections                | None                  | Fetches all collections from the `Collections` table.                                        |
| **getAllNFTs**                   | Read               | NFTs                       | None                  | Fetches all NFTs from the `NFTs` table.                                                      |
| **getUserByWallet**              | Read               | Users                      | None                  | Fetches user details based on their wallet address.                                          |
| **updateUser**                   | Update             | Users                      | Users                 | Updates user details, such as profile information.                                           |
| **getAllTransactions**           | Read               | Transactions               | None                  | Fetches all transactions from the `Transactions` table.                                      |
| **getAllUsers**                  | Read               | Users                      | None                  | Fetches all users from the `Users` table.                                                    |
| **listNFT**                      | Update             | NFTs                       | NFTs                  | Marks an NFT as listed for sale in the `NFTs` table.                                         |
| **buyNFT**                       | Write/Update       | NFTs, Transactions         | NFTs, Transactions    | Updates NFT ownership in the `NFTs` table and logs the purchase in the `Transactions` table. |

---

## **Database Tables**

1. **Users**: Stores information about marketplace users.
2. **Collections**: Stores details about collections created by users.
3. **NFTs**: Stores information about individual NFTs, including metadata and listing status.
4. **Transactions**: Logs all transactions (e.g., purchases, listings, sales).

---

## **Additional Notes**

- Ensure proper validations and checks before modifying any database entries.
- All updates to the `Transactions` table should be logged through `createTransaction` or similar methods.
- This project uses **PostgreSQL** for database management and interacts with smart contracts for blockchain-related functionalities.

---
