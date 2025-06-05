require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');

const ORACLE_ABI = [
  "function updatePrice(string commodity, uint256 priceInCents) external",
  "function getPrice(string memory commodity) external view returns (uint256, uint256)"
];

async function updatePrices() {
  try {
    // Read mock data
    const mockData = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '../mock/prices.json'),
        'utf8'
      )
    );

    // Setup provider and wallet
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const oracle = new ethers.Contract(process.env.ORACLE_ADDRESS, ORACLE_ABI, wallet);

    console.log('Starting price updates...');

    // Update each price in the mock data
    for (const price of mockData.prices) {
      try {
        console.log(`Updating ${price.asset} price to ${price.priceInCents} cents...`);
        const tx = await oracle.updatePrice(price.asset, price.priceInCents);
        await tx.wait();
        console.log(`✅ ${price.asset} price updated successfully!`);
        
        // Verify the update
        const [currentPrice, timestamp] = await oracle.getPrice(price.asset);
        console.log(`Verified: ${price.asset} price is now ${currentPrice} cents, updated at ${new Date(timestamp * 1000).toISOString()}`);
      } catch (error) {
        console.error(`Failed to update ${price.asset} price:`, error.message);
      }
    }

    console.log('Price updates completed!');
  } catch (error) {
    console.error('Script failed:', error);
  }
}

updatePrices().catch(console.error); 