// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TrustScoreManager is Ownable {
    struct TrustScore {
        uint256 score;           // Score from 0 to 100
        uint256 successfulDeals; // Number of successful deals
        uint256 totalDeals;      // Total number of deals
        uint256 lastUpdated;     // Last time the score was updated
    }

    mapping(address => TrustScore) public trustScores;
    mapping(address => bool) public authorizedContracts;

    uint256 public constant INITIAL_SCORE = 50;
    uint256 public constant MIN_SCORE = 0;
    uint256 public constant MAX_SCORE = 100;
    
    uint256 public constant POSITIVE_ADJUSTMENT = 5;
    uint256 public constant NEGATIVE_ADJUSTMENT = 10;

    event ScoreUpdated(
        address indexed farmer,
        uint256 oldScore,
        uint256 newScore,
        bool isPositive
    );

    event ContractAuthorized(address indexed contractAddress);
    event ContractDeauthorized(address indexed contractAddress);

    modifier onlyAuthorized() {
        require(
            msg.sender == owner() || authorizedContracts[msg.sender],
            "Not authorized"
        );
        _;
    }

    function authorizeContract(address contractAddress) external onlyOwner {
        require(contractAddress != address(0), "Invalid address");
        require(!authorizedContracts[contractAddress], "Already authorized");

        authorizedContracts[contractAddress] = true;
        emit ContractAuthorized(contractAddress);
    }

    function deauthorizeContract(address contractAddress) external onlyOwner {
        require(authorizedContracts[contractAddress], "Not authorized");

        authorizedContracts[contractAddress] = false;
        emit ContractDeauthorized(contractAddress);
    }

    function updateScore(address farmer, bool isPositive) external onlyAuthorized {
        if (trustScores[farmer].lastUpdated == 0) {
            initializeScore(farmer);
        }

        TrustScore storage score = trustScores[farmer];
        uint256 oldScore = score.score;

        if (isPositive) {
            score.successfulDeals++;
            score.score = min(score.score + POSITIVE_ADJUSTMENT, MAX_SCORE);
        } else {
            score.score = max(
                score.score > NEGATIVE_ADJUSTMENT ? score.score - NEGATIVE_ADJUSTMENT : 0,
                MIN_SCORE
            );
        }

        score.totalDeals++;
        score.lastUpdated = block.timestamp;

        emit ScoreUpdated(farmer, oldScore, score.score, isPositive);
    }

    function getScore(address farmer) external view returns (
        uint256 score,
        uint256 successfulDeals,
        uint256 totalDeals,
        uint256 lastUpdated
    ) {
        TrustScore memory ts = trustScores[farmer];
        return (
            ts.score,
            ts.successfulDeals,
            ts.totalDeals,
            ts.lastUpdated
        );
    }

    function initializeScore(address farmer) internal {
        require(trustScores[farmer].lastUpdated == 0, "Score already initialized");

        trustScores[farmer] = TrustScore({
            score: INITIAL_SCORE,
            successfulDeals: 0,
            totalDeals: 0,
            lastUpdated: block.timestamp
        });
    }

    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a > b ? a : b;
    }
}
