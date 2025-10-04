// hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  
  networks: {
    // Local development network
    hardhat: {
      chainId: 1337
    },
    
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337
    },
    
    // Ethereum Sepolia Testnet
    sepolia: {
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111,
    },
    
  },
  
  // Etherscan API key for contract verification
  etherscan: {
    apiKey: {
      sepolia: process.env.API_KEY,
    }
  },
  sourcify: {
    enabled: false,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  
  
};