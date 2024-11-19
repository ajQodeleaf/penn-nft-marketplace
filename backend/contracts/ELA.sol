// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ELA is ERC721, Ownable {
    uint256 private _nextTokenId = 1;

    constructor() ERC721("ELA Token", "ELA") Ownable(msg.sender) {}

    /**
     * @dev Mint a new NFT to the specified address.
     * @param to Address to receive the NFT.
     */
    function mint(address to) public onlyOwner {
        _safeMint(to, _nextTokenId);
        _nextTokenId++;
    }

    /**
     * @dev Return the next token ID to be minted.
     */
    function getNextTokenId() public view returns (uint256) {
        return _nextTokenId;
    }
}
