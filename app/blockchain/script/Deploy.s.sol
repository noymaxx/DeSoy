// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../contracts/HarvestToken.sol";
import "../contracts/HarvestInvestment.sol";
import "../contracts/TrustScoreManager.sol";

contract DeployScript is Script {
    function run() external {
        // Retrieve private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy TrustScoreManager first
        TrustScoreManager trustScoreManager = new TrustScoreManager();
        console.log("TrustScoreManager deployed at:", address(trustScoreManager));

        // Deploy HarvestToken
        HarvestToken harvestToken = new HarvestToken();
        console.log("HarvestToken deployed at:", address(harvestToken));

        // Get payment token address from environment (e.g., USDC on Flare)
        address paymentToken = vm.envAddress("PAYMENT_TOKEN_ADDRESS");

        // Deploy HarvestInvestment with required dependencies
        HarvestInvestment harvestInvestment = new HarvestInvestment(
            address(harvestToken),
            address(trustScoreManager),
            paymentToken
        );
        console.log("HarvestInvestment deployed at:", address(harvestInvestment));

        // Authorize HarvestInvestment contract to update trust scores
        trustScoreManager.authorizeContract(address(harvestInvestment));
        console.log("HarvestInvestment authorized in TrustScoreManager");

        vm.stopBroadcast();
    }
} 