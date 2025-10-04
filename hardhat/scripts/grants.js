// quickGrantRoles.js - Grant roles to your address
const hre = require("hardhat");

async function main() {
    const CONTRACT_ADDRESS = "0x10DA8a6Ff9d8776Df7E6E2C4Aad751320eE26164";
    const USER_ADDRESS = "0x45D246d7749936E61399E61Fc7e04e090aEDECE1"; // Your address
    
    console.log(" Granting roles...");
    console.log("Contract:", CONTRACT_ADDRESS);
    console.log("User:", USER_ADDRESS);
    
    const [admin] = await hre.ethers.getSigners();
    console.log("Admin:", admin.address);
    
    // Get contract
    const SupplyChain = await hre.ethers.getContractFactory("SupplyChain");
    const contract = SupplyChain.attach(CONTRACT_ADDRESS);
    
    // Get role hashes
    const FARMER_ROLE = await contract.FARMER_ROLE();
    const TRANSPORT_ROLE = await contract.TRANSPORT_ROLE();
    const MIDDLEMAN_ROLE = await contract.MIDDLEMAN_ROLE();
    const RETAILER_ROLE = await contract.RETAILER_ROLE();
    
    console.log("\n Role Hashes:");
    console.log("FARMER:", FARMER_ROLE);
    console.log("TRANSPORT:", TRANSPORT_ROLE);
    console.log("MIDDLEMAN:", MIDDLEMAN_ROLE);
    console.log("RETAILER:", RETAILER_ROLE);
    
    // Grant all roles
    console.log("\n Granting roles to:", USER_ADDRESS);
    
    try {
        const tx1 = await contract.grantUserRole(USER_ADDRESS, FARMER_ROLE);
        await tx1.wait();
        console.log(" Granted FARMER_ROLE");
        
        const tx2 = await contract.grantUserRole(USER_ADDRESS, TRANSPORT_ROLE);
        await tx2.wait();
        console.log(" Granted TRANSPORT_ROLE");
        
        const tx3 = await contract.grantUserRole(USER_ADDRESS, MIDDLEMAN_ROLE);
        await tx3.wait();
        console.log(" Granted MIDDLEMAN_ROLE");
        
        const tx4 = await contract.grantUserRole(USER_ADDRESS, RETAILER_ROLE);
        await tx4.wait();
        console.log(" Granted RETAILER_ROLE");
        
        console.log("\n All roles granted successfully!");
        
        // Verify roles
        console.log("\n🔍 Verifying roles...");
        const hasFarmer = await contract.hasRole(FARMER_ROLE, USER_ADDRESS);
        const hasTransport = await contract.hasRole(TRANSPORT_ROLE, USER_ADDRESS);
        const hasMiddleman = await contract.hasRole(MIDDLEMAN_ROLE, USER_ADDRESS);
        const hasRetailer = await contract.hasRole(RETAILER_ROLE, USER_ADDRESS);
        
        console.log("FARMER:", hasFarmer ? "Yes" : "No");
        console.log("TRANSPORT:", hasTransport ? "Yes" : "No");
        console.log("MIDDLEMAN:", hasMiddleman ? "Yes" : "No");
        console.log("RETAILER:", hasRetailer ? "Yes" : "No");
        
    } catch (error) {
        console.error(" Error granting roles:", error.message);
        
        // Check if we have admin rights
        try {
            const DEFAULT_ADMIN_ROLE = await contract.DEFAULT_ADMIN_ROLE();
            const isAdmin = await contract.hasRole(DEFAULT_ADMIN_ROLE, admin.address);
            console.log("\nAre you admin?", isAdmin ? "Yes " : "No ");
            
            if (!isAdmin) {
                console.log("\n You don't have admin rights!");
                console.log("The deployer address needs to grant roles.");
            }
        } catch (e) {
            console.error("Error checking admin:", e.message);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });