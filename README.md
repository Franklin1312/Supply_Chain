# 🌱 AgriChain - Blockchain-Based Agricultural Supply Chain

![License](https://img.shields.io/badge/license-MIT-green)
![Solidity](https://img.shields.io/badge/Solidity-0.8.19-blue)
![Ethereum](https://img.shields.io/badge/Network-Sepolia-purple)
![Status](https://img.shields.io/badge/Status-Active-success)

A decentralized supply chain platform that ensures transparency and fair compensation for farmers through blockchain technology. Track agricultural products from farm to consumer with immutable records and automated payments.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Smart Contract](#smart-contract)
- [Installation](#installation)
- [Usage](#usage)
- [Roles & Permissions](#roles--permissions)
- [Screenshots](#screenshots)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## 🎯 Overview

AgriChain solves critical problems in agricultural supply chains:

- **🚜 For Farmers**: Guaranteed fair prices with direct payment through smart contracts
- **🚚 For Transporters**: Transparent tracking and automated commission payments
- **🏪 For Retailers**: Verified product origin and quality certifications
- **👥 For Consumers**: Complete product journey visibility via QR codes

### Problem Statement

Traditional agricultural supply chains suffer from:
- Lack of transparency in pricing
- Multiple intermediaries reducing farmer income
- No way to verify product origin
- Delayed payments to farmers
- Price manipulation by middlemen

### Our Solution

A blockchain-based platform that:
- Records every transaction immutably
- Automates fair payment distribution
- Provides end-to-end traceability
- Eliminates exploitative practices
- Empowers consumers with information

## ✨ Features

### Core Functionality

- 📦 **Batch Management**: Create and track product batches with detailed metadata
- 💰 **Automated Payments**: Smart contract-based payment splits to all stakeholders
- 🔍 **Complete Traceability**: Track products from farm gate to consumer
- 📱 **QR Code Integration**: Generate and scan QR codes for instant product information
- 👤 **Role-Based Access**: Granular permissions for different supply chain participants
- 📊 **Real-Time Statistics**: Live dashboard with batch counts and delivery status

### Advanced Features

- 🔐 **Admin Panel**: User registration and role management
- 🔄 **Role Switching**: Seamless switching between multiple assigned roles
- 📈 **Transaction History**: Complete audit trail of all batch movements
- 🎨 **Responsive UI**: Works perfectly on desktop, tablet, and mobile
- 🌐 **Multi-Network Support**: Deploy on Ethereum, Polygon, BSC, or any EVM chain
- 💾 **Local Storage**: Offline user management for quick access

## 🛠 Technology Stack

### Blockchain

- **Smart Contract**: Solidity 0.8.19
- **Framework**: Hardhat
- **Network**: Ethereum Sepolia Testnet (Mainnet ready)
- **Standards**: OpenZeppelin AccessControl, ReentrancyGuard

### Frontend

- **Core**: HTML5, CSS3, JavaScript (ES6+)
- **Web3**: Ethers.js v6.4.0
- **Wallet**: MetaMask integration
- **QR Codes**: QRCode.js
- **Icons**: Font Awesome 6.4.0
=

## 📜 Smart Contract

### Contract Address

**Sepolia Testnet**: `0x10DA8a6Ff9d8776Df7E6E2C4Aad751320eE26164`

[View on Etherscan](https://sepolia.etherscan.io/address/0x10DA8a6Ff9d8776Df7E6E2C4Aad751320eE26164)

### Key Functions

```solidity
// Create a new product batch
function createBatch(
    string calldata productName,
    string calldata ipfsHash,
    uint256 farmerPrice,
    uint256 quantity
) external returns (uint256)

// Purchase batch with automatic payment distribution
function purchaseBatch(
    uint256 batchId,
    PaymentSplit[] calldata splits
) external payable

// Update batch delivery status
function updateBatchState(
    uint256 batchId,
    uint8 newState
) external

// Track complete batch information
function getBatch(uint256 batchId) external view returns (...)
function getBatchTransactions(uint256 batchId) external view returns (...)
function getBatchParticipants(uint256 batchId) external view returns (...)
```

### Smart Contract Features

- ✅ Role-based access control (Farmer, Transport, Middleman, Retailer, Admin)
- ✅ Automated payment distribution
- ✅ State machine for batch lifecycle
- ✅ Complete transaction history
- ✅ Participant tracking
- ✅ Reentrancy protection
- ✅ Gas optimized

## 🚀 Installation

### Prerequisites

- Node.js v16+ and npm
- MetaMask browser extension
- Git

### Quick Start

1. **Clone the Repository**

```bash
git clone https://github.com/yourusername/agrichain.git
cd agrichain
```

2. **Install Dependencies (for smart contract development)**

```bash
npm install
```

3. **Configure Environment**

```bash
cp .env.example .env
# Edit .env with your private key and RPC URLs
```

4. **Compile Smart Contracts**

```bash
npx hardhat compile
```

5. **Deploy to Network**

```bash
# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia

# Deploy to local network
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

6. **Update Frontend Configuration**

Edit `script.js`:
```javascript
const CONFIG = {
    CONTRACT_ADDRESS: "YOUR_DEPLOYED_CONTRACT_ADDRESS",
    NETWORK_ID: 11155111, // Sepolia
    NETWORK_NAME: "Sepolia"
};
```

7. **Launch Frontend**

Simply open `index.html` in your browser or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Or use Live Server extension in VS Code
```

8. **Connect MetaMask**

- Add Sepolia network to MetaMask
- Get test ETH from [Sepolia Faucet](https://sepoliafaucet.com/)
- Connect your wallet
- Start using the platform!

## 📖 Usage

### For Administrators

1. **Connect Wallet** with admin rights
2. Navigate to **Admin Panel**
3. **Register New Users**:
   - Enter wallet address
   - Enter user name (optional)
   - Select roles to grant
   - Submit registration
4. **View Registered Users** to manage platform access

### For Farmers

1. **Connect Wallet** (must have FARMER role)
2. Go to **Create Batch** section
3. Fill in product details:
   - Product name
   - Quantity (in kg)
   - Price (in ETH)
   - Origin location
   - Certifications
   - Description
4. **Submit** to create batch on blockchain
5. Receive **Batch ID** for tracking

### For Transporters

1. **Connect Wallet** (must have TRANSPORT role)
2. Go to **Update State** section
3. Enter **Batch ID**
4. Select new state:
   - In Transit
   - At Middleman
   - In Final Transit
   - Delivered
   - Sold
5. **Submit** to update blockchain

### For Retailers/Middlemen

1. **Connect Wallet** (must have RETAILER or MIDDLEMAN role)
2. Go to **Purchase** section
3. Enter **Batch ID**
4. Configure **Payment Distribution**:
   - Farmer payment + address
   - Transporter fee + address
   - Middleman commission + address
5. Review total payment
6. **Submit** to purchase (payment distributed automatically)

### For Consumers

1. Visit platform (no wallet needed)
2. Go to **Track Product**
3. Enter **Batch ID** or scan QR code
4. View complete information:
   - Product details
   - Current status
   - Farmer information
   - Price transparency
   - Complete journey timeline
   - All participants
5. **Download QR code** to share

## 🔐 Roles & Permissions

| Role | Create Batch | Purchase | Update State | Register Users | Track Products |
|------|--------------|----------|--------------|----------------|----------------|
| **Admin** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Farmer** | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Transport** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Middleman** | ❌ | ✅ | ❌ | ❌ | ✅ |
| **Retailer** | ❌ | ✅ | ❌ | ❌ | ✅ |
| **Consumer** | ❌ | ❌ | ❌ | ❌ | ✅ |

### Granting Roles

**Via Hardhat Script:**

```bash
# Update quickGrantRoles.js with user address
npx hardhat run quickGrantRoles.js --network sepolia
```

**Via Admin Panel:**

1. Login as admin
2. Navigate to Admin Panel
3. Register new user with desired roles

## 📸 Screenshots

### Dashboard
![Dashboard](docs/images/dashboard.png)
*Real-time statistics and hero section*

### Create Batch (Farmer View)
![Create Batch](docs/images/create-batch.png)
*Farmer creates new product batch*

### Track Product
![Track Product](docs/images/track-product.png)
*Complete product journey with QR code*

### Admin Panel
![Admin Panel](docs/images/admin-panel.png)
*User registration and role management*

### Purchase Flow
![Purchase](docs/images/purchase.png)
*Automated payment distribution*

## 🏗 Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (Web)                       │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   HTML/CSS  │  │  JavaScript  │  │   Ethers.js  │      │
│  └─────────────┘  └──────────────┘  └──────────────┘      │
└───────────────────────────┬─────────────────────────────────┘
                            │
                  ┌─────────▼──────────┐
                  │     MetaMask       │
                  │  (Web3 Provider)   │
                  └─────────┬──────────┘
                            │
         ┌──────────────────▼───────────────────┐
         │      Ethereum Blockchain             │
         │  ┌────────────────────────────────┐  │
         │  │   SupplyChain Smart Contract   │  │
         │  │  - Role Management (AccessC.)  │  │
         │  │  - Batch Creation              │  │
         │  │  - Payment Distribution        │  │
         │  │  - State Management            │  │
         │  │  - Transaction History         │  │
         │  └────────────────────────────────┘  │
         └──────────────────────────────────────┘
```

### Data Flow

```
Farmer Creates Batch
    ↓
Batch Stored on Blockchain
    ↓
QR Code Generated
    ↓
Transporter Updates State
    ↓
Retailer Purchases
    ↓
Smart Contract Distributes Payment
    ↓
Consumer Scans QR Code
    ↓
Views Complete Journey
```

### Smart Contract State Machine

```
Created → InTransit → AtMiddleman → InFinalTransit → Delivered → Sold
```



## 🔒 Security

### Smart Contract Security

- ✅ **OpenZeppelin** libraries for standard implementations
- ✅ **ReentrancyGuard** protection on payment functions
- ✅ **Role-based access control** for all critical functions
- ✅ **Input validation** on all parameters
- ✅ **State machine** validation for batch lifecycle
- ✅ **No delegatecall** or complex assembly
- ✅ **Gas optimizations** without sacrificing safety

### Frontend Security

- ✅ **No private key storage** in browser
- ✅ **MetaMask** for secure transaction signing
- ✅ **Input sanitization** on all forms
- ✅ **CORS** configuration for API calls
- ✅ **No localStorage** for sensitive data

### Recommended Audits

Before mainnet deployment:
1. Professional smart contract audit
2. Penetration testing
3. Code review by security experts
4. Bug bounty program

## 🚀 Deployment

### Mainnet Deployment Checklist

- [ ] Complete security audit
- [ ] Thorough testing on testnet
- [ ] Gas optimization review
- [ ] Frontend security review
- [ ] Backup deployment keys securely
- [ ] Prepare deployment documentation
- [ ] Set up monitoring and alerts
- [ ] Prepare emergency pause mechanism
- [ ] Verify contract on Etherscan
- [ ] Update frontend configuration
- [ ] Test with real users
- [ ] Prepare support documentation

### Networks Supported

- ✅ Ethereum (Mainnet, Sepolia, Goerli)
- ✅ Polygon (Mainnet, Mumbai)
- ✅ Binance Smart Chain (Mainnet, Testnet)
- ✅ Any EVM-compatible chain

## 📊 Project Structure

```
agrichain/
├── contracts/
│   └── SupplyChain.sol          # Main smart contract
├── scripts/
│   ├── deploy.js                # Deployment script
│   ├── grant.js            # Role management
├── test/
│   └── lock.js      # Contract tests
├── frontend/
│   ├── index.html               # Main UI
│   ├── style.css                # Styling
│   └── script.js                # Web3 integration
│   └── qr.js                    # Qr Generator
├── hardhat.config.js            # Hardhat configuration
├── package.json                 # Dependencies
├── .env.example                 # Environment template
└── README.md                    # This file
```

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork the Repository**
2. **Create Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit Changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open Pull Request**

### Contribution Guidelines

- Follow Solidity style guide
- Add tests for new features
- Update documentation
- Keep commits atomic and descriptive
- Ensure all tests pass

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 AgriChain

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
## 🙏 Acknowledgments

- OpenZeppelin for secure smart contract libraries
- Hardhat for development framework
- Ethers.js for Web3 integration
- Font Awesome for icons
- The Ethereum community

## 📈 Roadmap

### Phase 1: MVP ✅
- [x] Smart contract development
- [x] Basic frontend
- [x] Role management
- [x] Payment distribution
- [x] QR code generation
---

<div align="center">

**Built with ❤️ for farmers worldwide**

⭐ Star us on GitHub — it helps!

[Website](https://agrichain.example.com) • [Docs](https://docs.agrichain.example.com) • [Demo](https://demo.agrichain.example.com)

</div>
