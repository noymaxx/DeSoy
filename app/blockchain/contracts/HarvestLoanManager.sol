// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./HarvestReceivableNFT.sol";

interface ITrustScoreManager {
    function updateScore(address farmer, bool isPositive) external;
}

contract HarvestLoanManager {
    struct Proposal {
        address farmer;
        uint256 expectedReturn;
        uint256 targetAmount;
        uint256 fundedAmount;
        uint256 startTime;
        uint256 duration;
        uint256 tokenId;
        bool repaid;
        bool defaulted;
        bool nftTransferred;
    }

    HarvestReceivableNFT public nft;
    ITrustScoreManager public scoreManager;
    uint256 public proposalCounter;

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => uint256)) public contributions;
    mapping(uint256 => address[]) public investors;

    constructor(address _nft, address _scoreManager) {
        nft = HarvestReceivableNFT(_nft);
        scoreManager = ITrustScoreManager(_scoreManager);
    }

    function createProposal(uint256 expectedReturn, uint256 durationDays, string memory tokenURI) external payable {
        require(msg.value > 0, "Colateral required");

        uint256 targetAmount = msg.value * 10;
        uint256 tokenId = nft.mint(msg.sender, tokenURI);

        proposals[++proposalCounter] = Proposal({
            farmer: msg.sender,
            expectedReturn: expectedReturn,
            targetAmount: targetAmount,
            fundedAmount: 0,
            startTime: 0,
            duration: durationDays * 1 days,
            tokenId: tokenId,
            repaid: false,
            defaulted: false,
            nftTransferred: false
        });
    }

    function fundProposal(uint256 id) external payable {
        Proposal storage p = proposals[id];
        require(!p.repaid && !p.defaulted, "Proposal settled");
        require(p.fundedAmount < p.targetAmount, "Fully funded");
        require(msg.value > 0, "Must fund positive amount");

        uint256 amountToAccept = p.targetAmount - p.fundedAmount;
        uint256 amountAccepted = msg.value > amountToAccept ? amountToAccept : msg.value;

        if (contributions[id][msg.sender] == 0) {
            investors[id].push(msg.sender);
        }

        p.fundedAmount += amountAccepted;
        contributions[id][msg.sender] += amountAccepted;

        payable(p.farmer).transfer(amountAccepted);

        if (p.startTime == 0 && p.fundedAmount >= p.targetAmount) {
            p.startTime = block.timestamp;
            if (!p.nftTransferred) {
                nft.safeTransferFrom(p.farmer, address(this), p.tokenId);
                p.nftTransferred = true;
            }
        }

        if (msg.value > amountAccepted) {
            payable(msg.sender).transfer(msg.value - amountAccepted);
        }
    }

    function repay(uint256 id) external payable {
        Proposal storage p = proposals[id];
        require(msg.sender == p.farmer, "Not farmer");
        require(!p.repaid && !p.defaulted, "Already settled");
        require(p.fundedAmount >= p.targetAmount, "Not fully funded");

        uint256 elapsed = block.timestamp - p.startTime;
        require(elapsed <= p.duration, "Too late");

        uint256 repayAmount = p.targetAmount + ((p.expectedReturn - p.targetAmount) * elapsed) / p.duration;
        require(msg.value >= repayAmount, "Insufficient repay");

        p.repaid = true;
        nft.burn(p.tokenId);
        scoreManager.updateScore(p.farmer, true);

        address[] storage investorList = investors[id];
        for (uint i = 0; i < investorList.length; i++) {
            address contributor = investorList[i];
            uint256 contribution = contributions[id][contributor];
            if (contribution > 0) {
                uint256 share = (repayAmount * contribution) / p.fundedAmount;
                contributions[id][contributor] = 0;
                payable(contributor).transfer(share);
            }
        }

        if (msg.value > repayAmount) {
            payable(msg.sender).transfer(msg.value - repayAmount);
        }
    }

    function markAsDefault(uint256 id) external {
        Proposal storage p = proposals[id];
        require(!p.repaid && !p.defaulted, "Already settled");
        require(p.fundedAmount >= p.targetAmount, "Not fully funded");
        require(block.timestamp > p.startTime + p.duration, "Not expired");

        p.defaulted = true;
        nft.burn(p.tokenId);
        scoreManager.updateScore(p.farmer, false);
    }
}
