// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AgriPriceOracle {
    address public owner;
    mapping(string => uint256) public commodityPrices;
    mapping(string => uint256) public lastUpdated;

    event PriceUpdated(string commodity, uint256 price, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function updatePrice(string memory commodity, uint256 priceInCents) external onlyOwner {
        commodityPrices[commodity] = priceInCents;
        lastUpdated[commodity] = block.timestamp;
        emit PriceUpdated(commodity, priceInCents, block.timestamp);
    }

    function getPrice(string memory commodity) external view returns (uint256, uint256) {
        return (commodityPrices[commodity], lastUpdated[commodity]);
    }
}