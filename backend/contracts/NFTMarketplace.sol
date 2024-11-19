// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NFTMarketplace {
    bool private _entered;

    struct Listing {
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 price;
        string metadataURI;
    }

    mapping(uint256 => Listing) private listings;
    uint256 private listingCounter;

    mapping(address => uint256) private sellerEarnings;

    event NFTListed(
        uint256 indexed listingId,
        address indexed seller,
        address indexed nftContract,
        uint256 tokenId,
        uint256 price,
        string metadataURI
    );
    event NFTBought(
        uint256 indexed listingId,
        address indexed buyer,
        address indexed nftContract,
        uint256 tokenId,
        uint256 price
    );
    event EarningsWithdrawn(address indexed seller, uint256 amount);

    modifier isOwner(
        address nftContract,
        uint256 tokenId,
        address sender
    ) {
        require(
            IERC721(nftContract).ownerOf(tokenId) == sender,
            "Not the NFT owner"
        );
        _;
    }

    modifier isListed(uint256 listingId) {
        require(listings[listingId].price > 0, "NFT not listed");
        _;
    }

    modifier nonReentrant() {
        require(!_entered, "ReentrancyGuard: reentrant call");
        _entered = true;
        _;
        _entered = false;
    }

    function listNFT(
        address nftContract,
        uint256 tokenId,
        uint256 price,
        string calldata metadataURI
    ) external isOwner(nftContract, tokenId, msg.sender) {
        require(price > 0, "Price must be greater than zero");

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        listings[listingCounter] = Listing(
            msg.sender,
            nftContract,
            tokenId,
            price,
            metadataURI
        );
        emit NFTListed(
            listingCounter,
            msg.sender,
            nftContract,
            tokenId,
            price,
            metadataURI
        );
        listingCounter++;
    }

    function buyNFT(
        uint256 listingId
    ) external payable isListed(listingId) nonReentrant {
        Listing memory listing = listings[listingId];
        require(msg.value >= listing.price, "Insufficient funds");

        IERC721(listing.nftContract).transferFrom(
            address(this),
            msg.sender,
            listing.tokenId
        );

        sellerEarnings[listing.seller] += msg.value;

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
        require(earnings > 0, "No earnings to withdraw");

        sellerEarnings[msg.sender] = 0;
        (bool success, ) = msg.sender.call{value: earnings}("");
        require(success, "Transfer failed");

        emit EarningsWithdrawn(msg.sender, earnings);
    }

    function getListing(
        uint256 listingId
    ) external view isListed(listingId) returns (Listing memory) {
        return listings[listingId];
    }

    function getEarnings(address seller) external view returns (uint256) {
        return sellerEarnings[seller];
    }
}
