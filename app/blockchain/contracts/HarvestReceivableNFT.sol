// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HarvestReceivableNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;
    address public managerContract;

    modifier onlyManager() {
        require(msg.sender == managerContract, "Not authorized");
        _;
    }

    constructor() ERC721("HarvestReceivable", "DLSNFT") {}

    function setManager(address _manager) external onlyOwner {
        require(_manager != address(0), "Invalid address");
        managerContract = _manager;
    }

    function mint(address to, string memory tokenURI) external onlyManager returns (uint256) {
        uint256 tokenId = ++_tokenIdCounter;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        return tokenId;
    }

    function burn(uint256 tokenId) external onlyManager {
        require(_exists(tokenId), "Token does not exist");
        _burn(tokenId);
    }

    function exists(uint256 tokenId) external view returns (bool) {
        return _exists(tokenId);
    }

    function currentTokenId() external view returns (uint256) {
        return _tokenIdCounter;
    }
}
