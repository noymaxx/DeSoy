// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";

import "../contracts/HarvestToken.sol";
import "../contracts/HarvestInvestment.sol";
import "../contracts/TrustScoreManager.sol";
import "../contracts/HarvestReceivableNFT.sol";
import "../contracts/HarvestLoanManager.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address paymentToken = vm.envAddress("PAYMENT_TOKEN_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy TrustScoreManager
        TrustScoreManager trustScoreManager = new TrustScoreManager();
        console.log("TrustScoreManager deployed at:", address(trustScoreManager));

        // 2. Deploy HarvestToken (caso seja usado internamente)
        HarvestToken harvestToken = new HarvestToken();
        console.log("HarvestToken deployed at:", address(harvestToken));

        // 3. Deploy HarvestInvestment
        HarvestInvestment harvestInvestment = new HarvestInvestment(
            address(harvestToken),
            address(trustScoreManager),
            paymentToken
        );
        console.log("HarvestInvestment deployed at:", address(harvestInvestment));

        // 4. Autoriza o HarvestInvestment a atualizar score
        trustScoreManager.authorizeContract(address(harvestInvestment));
        console.log("HarvestInvestment autorizado no TrustScoreManager");

        // 5. Deploy NFT
        HarvestReceivableNFT nft = new HarvestReceivableNFT();
        console.log("HarvestReceivableNFT deployed at:", address(nft));

        // 6. Deploy LoanManager e linka NFT + Score
        HarvestLoanManager loanManager = new HarvestLoanManager(
            address(nft),
            address(trustScoreManager)
        );
        console.log("HarvestLoanManager deployed at:", address(loanManager));

        // 7. Autoriza o LoanManager a mintar/burnar NFTs
        nft.setManager(address(loanManager));
        console.log("LoanManager autorizado no NFT");

        vm.stopBroadcast();
    }
}
