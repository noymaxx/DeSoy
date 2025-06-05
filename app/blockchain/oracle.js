require('dotenv').config();
const axios = require('axios');
const { ethers } = require('ethers');
const abi = [
  "function updatePrice(string commodity, uint256 priceInCents) external",
];

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

// Fetch corn price (example source: CommoditiesAPI, or free Yahoo Finance APIs)
async function getCornPrice() {
  const response = await axios.get('https://api.example.com/corn-price');
  return Math.round(response.data.price_usd * 100); // e.g. $5.43 → 543 cents
}

async function updateOracle() {
  const cornPrice = await getCornPrice();
  const tx = await contract.updatePrice("corn", cornPrice);
  await tx.wait();
  console.log(`Updated corn price to ${cornPrice} cents.`);
}

updateOracle().catch(console.error);
