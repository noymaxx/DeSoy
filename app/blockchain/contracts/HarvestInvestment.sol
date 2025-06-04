// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./HarvestToken.sol";
import "./TrustScoreManager.sol";

contract HarvestInvestment is Ownable, ReentrancyGuard {
    HarvestToken public harvestToken;
    TrustScoreManager public trustScoreManager;
    IERC20 public paymentToken;

    struct Investment {
        address investor;
        uint256 amount;
        uint256 investedAt;
        bool isPaid;
        uint256 harvestTokenId;
    }

    mapping(uint256 => Investment[]) public harvestInvestments;
    mapping(address => uint256[]) public investorInvestments;

    event InvestmentMade(
        address indexed investor,
        uint256 indexed harvestTokenId,
        uint256 amount,
        uint256 investedAt
    );

    event InvestmentRepaid(
        uint256 indexed harvestTokenId,
        address indexed investor,
        uint256 amount,
        uint256 interest
    );

    event InvestmentDefaulted(
        uint256 indexed harvestTokenId,
        address indexed investor,
        uint256 amount
    );

    constructor(
        address _harvestToken,
        address _trustScoreManager,
        address _paymentToken
    ) {
        harvestToken = HarvestToken(_harvestToken);
        trustScoreManager = TrustScoreManager(_trustScoreManager);
        paymentToken = IERC20(_paymentToken);
    }

    function invest(uint256 harvestTokenId, uint256 amount) external nonReentrant {
        (
            address farmer,
            uint256 requestedAmount,
            uint256 harvestDate,
            ,
            bool isActive,
            ,
            ,
        ) = harvestToken.getHarvestDetails(harvestTokenId);

        require(isActive, "Harvest is not active");
        require(block.timestamp < harvestDate, "Harvest date has passed");
        require(amount > 0, "Amount must be greater than 0");

        // Calculate total invested amount for this harvest
        uint256 totalInvested = getTotalInvestedAmount(harvestTokenId);
        require(totalInvested + amount <= requestedAmount, "Investment would exceed requested amount");

        // Transfer payment tokens from investor to this contract
        require(paymentToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        // Create new investment
        Investment memory newInvestment = Investment({
            investor: msg.sender,
            amount: amount,
            investedAt: block.timestamp,
            isPaid: false,
            harvestTokenId: harvestTokenId
        });

        harvestInvestments[harvestTokenId].push(newInvestment);
        investorInvestments[msg.sender].push(harvestTokenId);

        // Transfer the investment amount to the farmer
        require(paymentToken.transfer(farmer, amount), "Transfer to farmer failed");

        emit InvestmentMade(msg.sender, harvestTokenId, amount, block.timestamp);
    }

    function repayInvestment(uint256 harvestTokenId) external nonReentrant {
        (
            address farmer,
            ,
            uint256 harvestDate,
            uint256 apy,
            bool isActive,
            ,
            ,
        ) = harvestToken.getHarvestDetails(harvestTokenId);

        require(msg.sender == farmer, "Only farmer can repay");
        require(isActive, "Harvest is not active");

        Investment[] storage investments = harvestInvestments[harvestTokenId];
        uint256 totalRepayment = 0;

        for (uint256 i = 0; i < investments.length; i++) {
            if (!investments[i].isPaid) {
                uint256 interest = calculateInterest(
                    investments[i].amount,
                    investments[i].investedAt,
                    apy
                );
                uint256 repaymentAmount = investments[i].amount + interest;
                totalRepayment += repaymentAmount;

                investments[i].isPaid = true;
                
                emit InvestmentRepaid(
                    harvestTokenId,
                    investments[i].investor,
                    investments[i].amount,
                    interest
                );
            }
        }

        require(paymentToken.transferFrom(msg.sender, address(this), totalRepayment), "Repayment transfer failed");
        
        // Distribute repayments to investors
        for (uint256 i = 0; i < investments.length; i++) {
            if (investments[i].isPaid) {
                uint256 interest = calculateInterest(
                    investments[i].amount,
                    investments[i].investedAt,
                    apy
                );
                uint256 repaymentAmount = investments[i].amount + interest;
                
                require(paymentToken.transfer(investments[i].investor, repaymentAmount), "Investor transfer failed");
            }
        }

        // Update trust score positively
        trustScoreManager.updateScore(farmer, true);
        
        // Mark harvest as completed
        harvestToken.completeHarvest(harvestTokenId);
    }

    function defaultInvestment(uint256 harvestTokenId) external onlyOwner {
        (address farmer, , , , bool isActive, , ,) = harvestToken.getHarvestDetails(harvestTokenId);
        require(isActive, "Harvest is not active");

        Investment[] storage investments = harvestInvestments[harvestTokenId];
        
        for (uint256 i = 0; i < investments.length; i++) {
            if (!investments[i].isPaid) {
                emit InvestmentDefaulted(
                    harvestTokenId,
                    investments[i].investor,
                    investments[i].amount
                );
            }
        }

        // Update trust score negatively
        trustScoreManager.updateScore(farmer, false);
        
        // Mark harvest as defaulted
        harvestToken.defaultHarvest(harvestTokenId);
    }

    function calculateInterest(
        uint256 amount,
        uint256 investedAt,
        uint256 apy
    ) public view returns (uint256) {
        uint256 timeElapsed = block.timestamp - investedAt;
        uint256 yearInSeconds = 365 days;
        
        // Calculate interest: principal * (apy/100) * (timeElapsed/yearInSeconds)
        return (amount * apy * timeElapsed) / (100 * yearInSeconds);
    }

    function getTotalInvestedAmount(uint256 harvestTokenId) public view returns (uint256) {
        Investment[] memory investments = harvestInvestments[harvestTokenId];
        uint256 total = 0;
        
        for (uint256 i = 0; i < investments.length; i++) {
            total += investments[i].amount;
        }
        
        return total;
    }

    function getInvestorInvestments(address investor) external view returns (uint256[] memory) {
        return investorInvestments[investor];
    }

    function getHarvestInvestments(uint256 harvestTokenId) external view returns (
        address[] memory investors,
        uint256[] memory amounts,
        uint256[] memory investmentDates,
        bool[] memory paymentStatuses
    ) {
        Investment[] memory investments = harvestInvestments[harvestTokenId];
        
        investors = new address[](investments.length);
        amounts = new uint256[](investments.length);
        investmentDates = new uint256[](investments.length);
        paymentStatuses = new bool[](investments.length);
        
        for (uint256 i = 0; i < investments.length; i++) {
            investors[i] = investments[i].investor;
            amounts[i] = investments[i].amount;
            investmentDates[i] = investments[i].investedAt;
            paymentStatuses[i] = investments[i].isPaid;
        }
        
        return (investors, amounts, investmentDates, paymentStatuses);
    }
} 