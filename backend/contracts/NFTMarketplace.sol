// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

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
        require(
            IERC721(nftContract).ownerOf(tokenId) == sender,
            "You are not the owner of this NFT"
        );
        _;
    }

    modifier isListed(uint256 listingId) {
        require(listings[listingId].price > 0, "This NFT is not listed");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
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
        require(price >= MIN_COLLECTION_LISTING_PRICE, "Price too low");

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
        require(
            price >= MIN_LISTING_PRICE,
            "Price must be at least 0.000001 ETH"
        );
        require(
            IERC721(nftContract).getApproved(tokenId) == address(this),
            "NFT must be approved for transfer to the marketplace"
        );

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

    function getCollection(
        uint256 collectionId
    ) external view returns (Collection memory) {
        require(
            bytes(collections[collectionId].name).length > 0,
            "Collection does not exist"
        );
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

    function updateCollection(
        uint256 collectionId,
        string calldata name,
        string calldata description,
        string calldata metadataURI,
        uint256 price
    ) external onlyAdmin {
        Collection storage collection = collections[collectionId];
        require(bytes(collection.name).length > 0, "Collection does not exist");
        require(price >= MIN_COLLECTION_LISTING_PRICE, "Price too low");

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
        require(
            listing.seller == msg.sender,
            "Only the seller can update the listing"
        );
        require(
            price >= MIN_LISTING_PRICE,
            "Price must be at least 0.000001 ETH"
        );

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
        require(
            bytes(collections[collectionId].name).length > 0,
            "Collection does not exist"
        );
        delete collections[collectionId];
        emit CollectionDeleted(collectionId);
    }

    function buyNFT(uint256 listingId) external payable isListed(listingId) {
        Listing memory listing = listings[listingId];
        require(
            msg.value >= listing.price,
            "Insufficient funds to buy this NFT"
        );

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
        require(earnings > 0, "You have no earnings to withdraw");

        sellerEarnings[msg.sender] = 0;
        payable(msg.sender).transfer(earnings);

        emit EarningsWithdrawn(msg.sender, earnings);
    }

    function verifyNFT(uint256 listingId) external onlyAdmin {
        Listing storage listing = listings[listingId];
        require(listing.price > 0, "This NFT is not listed");
        require(!listing.isVerified, "NFT is already verified");

        listing.isVerified = true;

        emit NFTVerified(listingId, true);
    }

    function verifyCollection(uint256 collectionId) external onlyAdmin {
        Collection storage collection = collections[collectionId];
        require(bytes(collection.name).length > 0, "Collection does not exist");
        require(!collection.isVerified, "Collection is already verified");

        collection.isVerified = true;

        emit NFTCollectionVerified(collectionId, true);
    }

    function getAdmin() external view returns (address) {
        return admin;
    }

    function updateTradingVolume(address nftContract, uint256 price) private {
        CollectionStats storage stats = collectionStats[nftContract];
        stats.previousVolume = stats.tradingVolume;
        stats.tradingVolume += price;
        stats.lastUpdated = block.timestamp;
    }

    function getCollectionStats(
        address nftContract
    ) external view returns (CollectionStats memory) {
        return collectionStats[nftContract];
    }

    function getRankings() external view returns (address[] memory) {
        uint256 length = collectionCounter;
        address[] memory rankedCollections = new address[](length);
        uint256 index = 0;

        for (uint256 i = 0; i < length; i++) {
            if (collections[i].isVerified) {
                rankedCollections[index] = collections[i].owner;
                index++;
            }
        }

        return rankedCollections;
    }
}
