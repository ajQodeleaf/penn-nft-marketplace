// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

error NotOwner(address nftContract, uint256 tokenId);
error PriceTooLow(uint256 minPrice);
error NFTNotListed();
error NotApproved(address nftContract, uint256 tokenId);
error InsufficientFunds(uint256 price);
error CollectionNotFound(uint256 collectionId);
error AlreadyVerified();

contract NFTMarketplace {
    struct Listing {
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 price;
        string name;
        string metadataURI;
        string description;
        bool isVerified;
    }

    struct Collection {
        address owner;
        string name;
        string description;
        string metadataURI;
        uint256 price;
        uint256 createdAt;
        bool isVerified;
    }

    struct CollectionStats {
        uint256 tradingVolume;
        uint256 lastUpdated;
        uint256 previousVolume;
    }

    mapping(uint256 => Listing) private listings;
    uint256 private listingCounter;

    mapping(uint256 => Collection) private collections;
    uint256 private collectionCounter;

    mapping(address => uint256) private sellerEarnings;
    mapping(address => uint256[]) private userPurchases;
    mapping(address => CollectionStats) private collectionStats;

    address private admin;
    uint256 private constant MIN_LISTING_PRICE = 0.000001 ether;
    uint256 private constant MIN_COLLECTION_LISTING_PRICE = 0.00001 ether;

    event NFTListed(
        uint256 indexed listingId,
        address indexed seller,
        address indexed nftContract,
        uint256 tokenId,
        uint256 price,
        string name,
        string metadataURI,
        string description
    );

    event NFTBought(
        uint256 indexed listingId,
        address indexed buyer,
        address indexed nftContract,
        uint256 tokenId,
        uint256 price
    );
    event CollectionCreated(
        uint256 indexed collectionId,
        address indexed owner,
        string name,
        string description,
        string metadataURI,
        uint256 price
    );
    event CollectionUpdated(
        uint256 indexed collectionId,
        string name,
        string description,
        string metadataURI,
        uint256 price
    );
    event CollectionDeleted(uint256 indexed collectionId);
    event EarningsWithdrawn(address indexed seller, uint256 amount);
    event NFTVerified(uint256 indexed listingId, bool isVerified);
    event NFTCollectionListed(
        uint256 indexed collectionId,
        address indexed owner,
        address nftContract
    );
    event NFTCollectionCreated(
        uint256 indexed collectionId,
        address indexed owner,
        string name,
        string description,
        string metadataURI,
        uint256 price
    );
    event NFTCollectionUpdated(
        uint256 indexed collectionId,
        string name,
        string description,
        string metadataURI,
        uint256 price
    );
    event NFTCollectionDeleted(uint256 indexed collectionId);
    event NFTCollectionVerified(uint256 indexed collectionId, bool isVerified);

    modifier isOwner(
        address nftContract,
        uint256 tokenId,
        address sender
    ) {
        if (IERC721(nftContract).ownerOf(tokenId) != sender) {
            revert NotOwner(nftContract, tokenId);
        }
        _;
    }

    modifier isListed(uint256 listingId) {
        if (listings[listingId].price == 0) {
            revert NFTNotListed();
        }
        _;
    }

    modifier onlyAdmin() {
        if (msg.sender != admin) {
            revert NotOwner(admin, 0);
        }
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function createCollection(
        string calldata name,
        string calldata description,
        string calldata metadataURI,
        uint256 price
    ) external onlyAdmin {
        if (price < MIN_COLLECTION_LISTING_PRICE) {
            revert PriceTooLow(MIN_COLLECTION_LISTING_PRICE);
        }

        collections[collectionCounter] = Collection(
            msg.sender,
            name,
            description,
            metadataURI,
            price,
            block.timestamp,
            false
        );

        emit CollectionCreated(
            collectionCounter,
            msg.sender,
            name,
            description,
            metadataURI,
            price
        );

        collectionCounter++;
    }

    function listNFT(
        address nftContract,
        uint256 tokenId,
        uint256 price,
        string calldata name,
        string calldata metadataURI,
        string calldata description,
        bool isVerified
    ) external isOwner(nftContract, tokenId, msg.sender) {
        if (price < MIN_LISTING_PRICE) {
            revert PriceTooLow(MIN_LISTING_PRICE);
        }

        if (IERC721(nftContract).getApproved(tokenId) != address(this)) {
            revert NotApproved(nftContract, tokenId);
        }

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        listings[listingCounter] = Listing(
            msg.sender,
            nftContract,
            tokenId,
            price,
            name,
            metadataURI,
            description,
            isVerified
        );

        emit NFTListed(
            listingCounter,
            msg.sender,
            nftContract,
            tokenId,
            price,
            name,
            metadataURI,
            description
        );

        listingCounter++;
    }

    function updateCollection(
        uint256 collectionId,
        string calldata name,
        string calldata description,
        string calldata metadataURI,
        uint256 price
    ) external onlyAdmin {
        Collection storage collection = collections[collectionId];
        if (bytes(collection.name).length == 0) {
            revert CollectionNotFound(collectionId);
        }

        if (price < MIN_COLLECTION_LISTING_PRICE) {
            revert PriceTooLow(MIN_COLLECTION_LISTING_PRICE);
        }

        collection.name = name;
        collection.description = description;
        collection.metadataURI = metadataURI;
        collection.price = price;

        emit CollectionUpdated(
            collectionId,
            name,
            description,
            metadataURI,
            price
        );
    }

    function updateNFT(
        uint256 listingId,
        uint256 price,
        string calldata name,
        string calldata metadataURI,
        string calldata description
    ) external isListed(listingId) {
        Listing storage listing = listings[listingId];
        if (listing.seller != msg.sender) {
            revert NotOwner(listing.seller, listing.tokenId);
        }

        if (price < MIN_LISTING_PRICE) {
            revert PriceTooLow(MIN_LISTING_PRICE);
        }

        listing.price = price;
        listing.name = name;
        listing.metadataURI = metadataURI;
        listing.description = description;

        emit NFTListed(
            listingId,
            msg.sender,
            listing.nftContract,
            listing.tokenId,
            price,
            name,
            metadataURI,
            description
        );
    }

    function deleteCollection(uint256 collectionId) external onlyAdmin {
        if (bytes(collections[collectionId].name).length == 0) {
            revert CollectionNotFound(collectionId);
        }
        delete collections[collectionId];
        emit CollectionDeleted(collectionId);
    }

    function buyNFT(uint256 listingId) external payable isListed(listingId) {
        Listing memory listing = listings[listingId];
        if (msg.value < listing.price) {
            revert InsufficientFunds(listing.price);
        }

        IERC721(listing.nftContract).transferFrom(
            address(this),
            msg.sender,
            listing.tokenId
        );
        updateTradingVolume(listing.nftContract, listing.price);

        sellerEarnings[listing.seller] += msg.value;
        userPurchases[msg.sender].push(listingId);

        emit NFTBought(
            listingId,
            msg.sender,
            listing.nftContract,
            listing.tokenId,
            listing.price
        );
        delete listings[listingId];
    }

    function withdrawEarnings() external {
        uint256 earnings = sellerEarnings[msg.sender];
        if (earnings == 0) {
            revert InsufficientFunds(0);
        }

        sellerEarnings[msg.sender] = 0;
        payable(msg.sender).transfer(earnings);

        emit EarningsWithdrawn(msg.sender, earnings);
    }

    function verifyNFT(uint256 listingId) external onlyAdmin {
        Listing storage listing = listings[listingId];
        if (listing.price == 0) {
            revert NFTNotListed();
        }

        if (listing.isVerified) {
            revert AlreadyVerified();
        }

        listing.isVerified = true;

        emit NFTVerified(listingId, true);
    }

    function verifyCollection(uint256 collectionId) external onlyAdmin {
        Collection storage collection = collections[collectionId];
        if (bytes(collection.name).length == 0) {
            revert CollectionNotFound(collectionId);
        }

        if (collection.isVerified) {
            revert AlreadyVerified();
        }

        collection.isVerified = true;

        emit NFTCollectionVerified(collectionId, true);
    }

    function getAdmin() external view returns (address) {
        return admin;
    }

    function getRankings() external view returns (address[] memory) {
        address[] memory topCollections = new address[](5);
        uint256[] memory volumes = new uint256[](5);
        uint256 i = 0;

        for (uint256 j = 0; j < collectionCounter; j++) {
            address collectionAddress = collections[j].owner;
            uint256 collectionVolume = collectionStats[collectionAddress]
                .tradingVolume;

            if (i < 5) {
                topCollections[i] = collectionAddress;
                volumes[i] = collectionVolume;
                i++;
            } else {
                for (uint256 k = 0; k < 5; k++) {
                    if (volumes[k] < collectionVolume) {
                        volumes[k] = collectionVolume;
                        topCollections[k] = collectionAddress;
                        break;
                    }
                }
            }
        }
        return topCollections;
    }

    function getCollectionStats(
        uint256 collectionId
    ) external view returns (CollectionStats memory) {
        address collectionOwner = collections[collectionId].owner;

        if (bytes(collections[collectionId].name).length == 0) {
            revert CollectionNotFound(collectionId);
        }

        return collectionStats[collectionOwner];
    }

    function getCollection(
        uint256 collectionId
    ) external view returns (Collection memory) {
        if (bytes(collections[collectionId].name).length == 0) {
            revert CollectionNotFound(collectionId);
        }
        return collections[collectionId];
    }

    function getListing(
        uint256 listingId
    ) external view returns (Listing memory) {
        return listings[listingId];
    }

    function getSellerEarnings(address seller) external view returns (uint256) {
        return sellerEarnings[seller];
    }

    function getUserPurchases(
        address user
    ) external view returns (uint256[] memory) {
        return userPurchases[user];
    }

    function updateTradingVolume(address nftContract, uint256 volume) private {
        CollectionStats storage stats = collectionStats[nftContract];
        stats.previousVolume = stats.tradingVolume;
        stats.tradingVolume += volume;
        stats.lastUpdated = block.timestamp;
    }
}
