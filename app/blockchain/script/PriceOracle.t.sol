// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../contracts/PriceOracle.sol";

contract PriceOracleTest is Test {
    AgriPriceOracle public oracle;
    address public owner;
    address public user;
    event PriceUpdated(string commodity, uint256 price, uint256 timestamp);

    function setUp() public {
        // Deploy the contract
        oracle = new AgriPriceOracle();
        owner = address(this);
        user = address(0xb21eB4b34485bC72F7f314314d8D49C7D05D22de);
        vm.label(owner, "Owner");
        vm.label(user, "User");
        console.log("Test setup complete:");
        console.log("- Owner address:", owner);
        console.log("- User address:", user);
        console.log("- Oracle address:", address(oracle));
    }

    function testInitialState() public {
        console.log("\nTesting initial state...");
        assertEq(oracle.owner(), owner, "Owner should be test contract");
        (uint256 price, uint256 timestamp) = oracle.getPrice("corn");
        console.log("Initial corn price:", price);
        console.log("Initial timestamp:", timestamp);
        assertEq(price, 0, "Initial price should be 0");
        assertEq(timestamp, 0, "Initial timestamp should be 0");
        console.log("Initial state verified successfully");
    }

    function testUpdatePrice() public {
        console.log("\nTesting price update...");
        uint256 priceInCents = 543; // $5.43
        string memory commodity = "corn";
        
        console.log("Updating price for %s to %d cents", commodity, priceInCents);
        // Update price
        oracle.updatePrice(commodity, priceInCents);
        
        // Check updated values
        (uint256 price, uint256 timestamp) = oracle.getPrice(commodity);
        console.log("New price:", price);
        console.log("Update timestamp:", timestamp);
        assertEq(price, priceInCents, "Price should be updated");
        assertEq(timestamp, block.timestamp, "Timestamp should be updated");
        console.log("Price update verified successfully");
    }

    function testUpdatePriceEmitsEvent() public {
        console.log("\nTesting event emission...");
        uint256 priceInCents = 543;
        string memory commodity = "corn";
        
        console.log("Expecting event PriceUpdated(%s, %d, %d)", 
            commodity, priceInCents, block.timestamp);
        // Test event emission
        vm.expectEmit(true, true, true, true);
        emit PriceUpdated(commodity, priceInCents, block.timestamp);
        oracle.updatePrice(commodity, priceInCents);
        console.log("Event emission verified successfully");
    }

    function testFailUpdatePriceUnauthorized() public {
        console.log("\nTesting unauthorized access...");
        console.log("Attempting update from unauthorized address:", user);
        // Switch to user account
        vm.prank(user);
        
        // This should fail because user is not the owner
        oracle.updatePrice("corn", 543);
        // This line should never be reached
        console.log("This line should not be printed - test should fail");
    }

    function testMultipleCommodities() public {
        console.log("\nTesting multiple commodities...");
        // Update multiple commodities
        oracle.updatePrice("corn", 543);
        oracle.updatePrice("wheat", 725);
        oracle.updatePrice("soybean", 1432);

        console.log("Verifying prices:");
        // Check corn price
        (uint256 cornPrice, ) = oracle.getPrice("corn");
        console.log("- Corn price:", cornPrice);
        assertEq(cornPrice, 543, "Corn price should be 543");

        // Check wheat price
        (uint256 wheatPrice, ) = oracle.getPrice("wheat");
        console.log("- Wheat price:", wheatPrice);
        assertEq(wheatPrice, 725, "Wheat price should be 725");

        // Check soybean price
        (uint256 soybeanPrice, ) = oracle.getPrice("soybean");
        console.log("- Soybean price:", soybeanPrice);
        assertEq(soybeanPrice, 1432, "Soybean price should be 1432");
        console.log("All commodity prices verified successfully");
    }

    function testTimestampUpdate() public {
        console.log("\nTesting timestamp updates...");
        // Set block timestamp
        uint256 initialTime = 1000;
        vm.warp(initialTime);
        console.log("Initial block time set to:", initialTime);
        
        // Update price
        oracle.updatePrice("corn", 543);
        
        // Check timestamp
        (, uint256 timestamp1) = oracle.getPrice("corn");
        console.log("First update timestamp:", timestamp1);
        assertEq(timestamp1, initialTime, "Timestamp should match block.timestamp");
        
        // Move forward in time
        uint256 newTime = initialTime + 3600;
        vm.warp(newTime); // 1 hour later
        console.log("Moving time forward to:", newTime);
        oracle.updatePrice("corn", 550);
        
        // Check new timestamp
        (, uint256 timestamp2) = oracle.getPrice("corn");
        console.log("Second update timestamp:", timestamp2);
        assertEq(timestamp2, initialTime + 3600, "Timestamp should be updated");
        console.log("Timestamp updates verified successfully");
    }
} 