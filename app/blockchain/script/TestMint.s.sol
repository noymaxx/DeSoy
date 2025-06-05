// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "forge-std/Script.sol";

import "../contracts/HarvestLoanManager.sol";
import "../contracts/HarvestReceivableNFT.sol";

contract TestMintNFT is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(pk);

        // Referência dos contratos já deployados
        HarvestLoanManager manager = HarvestLoanManager(
            payable(0x8447980CDa681919e96d237E9AA2d5CF369921dB)
        );
        HarvestReceivableNFT nft = HarvestReceivableNFT(
            payable(0x9BEA0C3F43A951619bc44D911447F3780c1b8e3d)
        );

        // Cria uma proposta com 0.1 FLR de colateral
        manager.createProposal{value: 0.1 ether}(
            1 ether,  // expectedReturn
            30,       // durationDays
            "ipfs://meu-nft-teste"
        );

        // Pega o último token ID mintado
        uint256 tokenId = nft.currentTokenId();
        console.log("NFT mintado com tokenId:", tokenId);

        // Lê a proposta no índice 1 (ou você pode tornar isso dinâmico)
        (
            address farmer,
            uint256 expectedReturn,
            uint256 targetAmount,
            uint256 fundedAmount,
            uint256 startTime,
            uint256 duration,
            uint256 mintedTokenId,
            bool repaid,
            bool defaulted,
            bool nftTransferred
        ) = manager.proposals(1);

        console.log("Proposta criada:");
        console.log("Farmer:", farmer);
        console.log("Expected return:", expectedReturn);
        console.log("Target amount:", targetAmount);
        console.log("Token associado:", mintedTokenId);

        vm.stopBroadcast();
    }
}
