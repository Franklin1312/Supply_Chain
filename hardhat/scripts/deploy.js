// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  console.log("Starting deployment...");
  console.log("Network:", hre.network.name);
  
  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");
  
  // Deploy SupplyChain contract
  console.log("\nDeploying SupplyChain contract...");
  const SupplyChain = await hre.ethers.getContractFactory("SupplyChain");
  
  // Deploy with admin address (deployer)
  const supplyChain = await SupplyChain.deploy(deployer.address);
  
  await supplyChain.waitForDeployment();
  const contractAddress = await supplyChain.getAddress();
  
  console.log(" SupplyChain deployed to:", contractAddress);
  
  // Grant initial roles
  console.log("\n Setting up initial roles...");
  
  // Get role hashes
  const FARMER_ROLE = await supplyChain.FARMER_ROLE();
  const TRANSPORT_ROLE = await supplyChain.TRANSPORT_ROLE();
  const MIDDLEMAN_ROLE = await supplyChain.MIDDLEMAN_ROLE();
  const RETAILER_ROLE = await supplyChain.RETAILER_ROLE();
  
  console.log("\nRole Hashes:");
  console.log("FARMER_ROLE:", FARMER_ROLE);
  console.log("TRANSPORT_ROLE:", TRANSPORT_ROLE);
  console.log("MIDDLEMAN_ROLE:", MIDDLEMAN_ROLE);
  console.log("RETAILER_ROLE:", RETAILER_ROLE);
  
  // Example: Grant deployer all roles for testing (optional)
  console.log("\nGranting test roles to deployer...");
  
  const tx1 = await supplyChain.grantUserRole(deployer.address, FARMER_ROLE);
  await tx1.wait();
  console.log(" Granted FARMER_ROLE to deployer");
  
  const tx2 = await supplyChain.grantUserRole(deployer.address, TRANSPORT_ROLE);
  await tx2.wait();
  console.log(" Granted TRANSPORT_ROLE to deployer");
  
  const tx3 = await supplyChain.grantUserRole(deployer.address, MIDDLEMAN_ROLE);
  await tx3.wait();
  console.log("Granted MIDDLEMAN_ROLE to deployer");
  
  const tx4 = await supplyChain.grantUserRole(deployer.address, RETAILER_ROLE);
  await tx4.wait();
  console.log("Granted RETAILER_ROLE to deployer");
  
  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contractAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    roles: {
      FARMER_ROLE: FARMER_ROLE,
      TRANSPORT_ROLE: TRANSPORT_ROLE,
      MIDDLEMAN_ROLE: MIDDLEMAN_ROLE,
      RETAILER_ROLE: RETAILER_ROLE
    }
  };
  
  // Write to file
  const fs = require('fs');
  const path = require('path');
  
  const deploymentsDir = path.join(__dirname, '../deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  const filename = `${hre.network.name}-${Date.now()}.json`;
  const filepath = path.join(deploymentsDir, filename);
  
  fs.writeFileSync(filepath, JSON.stringify(deploymentInfo, null, 2));
  console.log("\nDeployment info saved to:", filepath);
  
  // Verification instructions
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\nTo verify contract on Etherscan, run:");
    console.log(`npx hardhat verify --network ${hre.network.name} ${contractAddress} "${deployer.address}"`);
  }
  
  console.log("\n Deployment completed successfully!");
  console.log("\n Summary:");
  console.log("Contract Address:", contractAddress);
  console.log("Network:", hre.network.name);
  console.log("Deployer:", deployer.address);
  console.log("\nNext Steps:");
  console.log("1. Save the contract address for frontend integration");
  console.log("2. Grant roles to actual users (farmers, transporters, etc.)");
  console.log("3. Update your frontend config with the contract address");
  console.log("4. Test the contract functions");
  
  return {
    contractAddress,
    deployer: deployer.address,
    roles: {
      FARMER_ROLE,
      TRANSPORT_ROLE,
      MIDDLEMAN_ROLE,
      RETAILER_ROLE
    }
  };
}

// Handle errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(" Deployment failed:", error);
    process.exit(1);
  });

//contract address : 0x10DA8a6Ff9d8776Df7E6E2C4Aad751320eE26164
//verify address   : https://sepolia.etherscan.io/address/0x10DA8a6Ff9d8776Df7E6E2C4Aad751320eE26164#code