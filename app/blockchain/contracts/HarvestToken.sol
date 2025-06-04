// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract HarvestToken is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Harvest {
        address farmer;
        uint256 amount;          // Amount requested in credits
        uint256 harvestDate;     // Expected harvest date
        uint256 apy;             // Annual Percentage Yield
        bool isActive;           // Whether the token is still active
        string cropType;         // Type of crop
        uint256 quantity;        // Quantity of crop
        uint256 createdAt;       // Token creation timestamp
    }

    mapping(uint256 => Harvest) public harvests;
    mapping(address => uint256[]) public farmerTokens;

    address public investmentContract;

    event HarvestTokenized(
        uint256 indexed tokenId,
        address indexed farmer,
        uint256 amount,
        uint256 harvestDate,
        uint256 apy,
        string cropType,
        uint256 quantity
    );

    event HarvestCompleted(uint256 indexed tokenId);
    event HarvestDefaulted(uint256 indexed tokenId);

    constructor() ERC721("HarvestToken", "HRVST") {}

    modifier onlyInvestmentContract() {
        require(msg.sender == investmentContract, "Only investment contract can call");
        _;
    }

    function setInvestmentContract(address _contract) external onlyOwner {
        investmentContract = _contract;
    }

    function tokenizeHarvest(
        uint256 amount,
        uint256 harvestDate,
        uint256 apy,
        string memory cropType,
        uint256 quantity
    ) external returns (uint256) {
        require(harvestDate > block.timestamp, "Invalid harvest date");
        require(amount > 0, "Amount must be greater than 0");
        require(quantity > 0, "Quantity must be greater than 0");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(msg.sender, newTokenId);

        harvests[newTokenId] = Harvest({
            farmer: msg.sender,
            amount: amount,
            harvestDate: harvestDate,
            apy: apy,
            isActive: true,
            cropType: cropType,
            quantity: quantity,
            createdAt: block.timestamp
        });

        farmerTokens[msg.sender].push(newTokenId);

        emit HarvestTokenized(
            newTokenId,
            msg.sender,
            amount,
            harvestDate,
            apy,
            cropType,
            quantity
        );

        return newTokenId;
    }

    function completeHarvest(uint256 tokenId) external onlyInvestmentContract {
        require(_exists(tokenId), "Token does not exist");
        require(harvests[tokenId].isActive, "Harvest not active");

        harvests[tokenId].isActive = false;
        emit HarvestCompleted(tokenId);
    }

    function defaultHarvest(uint256 tokenId) external onlyInvestmentContract {
        require(_exists(tokenId), "Token does not exist");
        require(harvests[tokenId].isActive, "Harvest not active");

        harvests[tokenId].isActive = false;
        emit HarvestDefaulted(tokenId);
    }

    function getFarmerTokens(address farmer) external view returns (uint256[] memory) {
        return farmerTokens[farmer];
    }

    function getHarvestDetails(uint256 tokenId) external view returns (
        address farmer,
        uint256 amount,
        uint256 harvestDate,
        uint256 apy,
        bool isActive,
        string memory cropType,
        uint256 quantity,
        uint256 createdAt
    ) {
        require(_exists(tokenId), "Token does not exist");
        Harvest memory harvest = harvests[tokenId];
        return (
            harvest.farmer,
            harvest.amount,
            harvest.harvestDate,
            harvest.apy,
            harvest.isActive,
            harvest.cropType,
            harvest.quantity,
            harvest.createdAt
        );
    }
}
