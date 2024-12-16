// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ELA is ERC721 {
    uint256 private _nextTokenId = 1;
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    error Unauthorized(address caller);
    error InvalidAddress();
    
    modifier onlyOwner() {
        if (msg.sender != _owner) {
            revert Unauthorized(msg.sender);
        }
        _;
    }

    constructor() ERC721("ELA Token", "ELA") {
        _owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    function mint(address to) public onlyOwner {
        _safeMint(to, _nextTokenId);
        _nextTokenId++;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        if (newOwner == address(0)) {
            revert InvalidAddress();
        }
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }

    function getNextTokenId() public view returns (uint256) {
        return _nextTokenId;
    }

    function owner() public view returns (address) {
        return _owner;
    }
}
