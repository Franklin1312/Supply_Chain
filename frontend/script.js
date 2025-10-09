
// script.js - Frontend JavaScript for Supply Chain DApp with Modern Features
// IMPORTANT: Update CONTRACT_ADDRESS after deployment

// ==================== CONFIGURATION ====================
const CONFIG = {
    CONTRACT_ADDRESS: "0x10DA8a6Ff9d8776Df7E6E2C4Aad751320eE26164",
    NETWORK_ID: 11155111, // Sepolia testnet
    NETWORK_NAME: "Sepolia",
    RPC_URLS: [
        "https://rpc.sepolia.org",
        "https://eth-sepolia.public.blastapi.io",
        "https://ethereum-sepolia-rpc.publicnode.com"
    ]
};

const CONTRACT_ABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "admin",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "batchId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "farmer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "productName",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "farmerPrice",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "quantity",
          "type": "uint256"
        }
      ],
      "name": "BatchCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "batchId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "totalAmount",
          "type": "uint256"
        },
        {
          "components": [
            {
              "internalType": "address",
              "name": "payee",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "role",
              "type": "string"
            }
          ],
          "indexed": false,
          "internalType": "struct SupplyChain.PaymentSplit[]",
          "name": "splits",
          "type": "tuple[]"
        }
      ],
      "name": "BatchPurchased",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "batchId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "enum SupplyChain.BatchState",
          "name": "state",
          "type": "uint8"
        }
      ],
      "name": "BatchStateUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "batchId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "enum SupplyChain.BatchState",
          "name": "state",
          "type": "uint8"
        }
      ],
      "name": "BatchTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "previousAdminRole",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "newAdminRole",
          "type": "bytes32"
        }
      ],
      "name": "RoleAdminChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "RoleGranted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "RoleRevoked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "batchId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "role",
          "type": "string"
        }
      ],
      "name": "TransactionRecorded",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "DEFAULT_ADMIN_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "FARMER_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "MIDDLEMAN_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "RETAILER_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "TRANSPORT_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "batchParticipants",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "batches",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "farmer",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "currentOwner",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "productName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "farmerPrice",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "quantity",
          "type": "uint256"
        },
        {
          "internalType": "enum SupplyChain.BatchState",
          "name": "state",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "createdAt",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "exists",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "productName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "farmerPrice",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "quantity",
          "type": "uint256"
        }
      ],
      "name": "createBatch",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "batchId",
          "type": "uint256"
        }
      ],
      "name": "getBatch",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "farmer",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "currentOwner",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "productName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "farmerPrice",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "quantity",
          "type": "uint256"
        },
        {
          "internalType": "enum SupplyChain.BatchState",
          "name": "state",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "createdAt",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "transactionCount",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "batchId",
          "type": "uint256"
        }
      ],
      "name": "getBatchParticipants",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "batchId",
          "type": "uint256"
        }
      ],
      "name": "getBatchTransactions",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "role",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            }
          ],
          "internalType": "struct SupplyChain.Transaction[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "batchId",
          "type": "uint256"
        }
      ],
      "name": "getFarmerPayment",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        }
      ],
      "name": "getRoleAdmin",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "grantRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        }
      ],
      "name": "grantUserRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "hasRole",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "nextBatchId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "batchId",
          "type": "uint256"
        },
        {
          "components": [
            {
              "internalType": "address",
              "name": "payee",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "role",
              "type": "string"
            }
          ],
          "internalType": "struct SupplyChain.PaymentSplit[]",
          "name": "splits",
          "type": "tuple[]"
        }
      ],
      "name": "purchaseBatch",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "renounceRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "revokeRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "batchId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "batchId",
          "type": "uint256"
        },
        {
          "internalType": "enum SupplyChain.BatchState",
          "name": "newState",
          "type": "uint8"
        }
      ],
      "name": "updateBatchState",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];
// State
let provider, signer, contract, userAddress;
let userRoles = [], activeRole = null;
let registeredUsers = [];
let stats = { totalBatches: 0, totalFarmers: 0, deliveredBatches: 0 };
let qrGenerator;
// Initialize

document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadFromLocalStorage();
    initializeTheme();
    initializeLanguage();
    qrGenerator = new QRCodeGenerator({
        width: 300,
        height: 300,
        colorDark: "#2ecc71"
    });
    setTimeout(addDownloadButton, 500);
    // Load registered users on page load
    if (registeredUsers.length > 0) {
        loadRegisteredUsers();
    }
});

// QR Scanner State
let qrStream = null;
let qrScannerActive = false;
/**
 * Handle detected QR code data - Auto download batch info
 * @param {string} qrData - Detected QR code data
 */
async function handleQRCodeDetected(qrData) {
    stopQRScanner();
    
    try {
        let batchId = null;
        
        // Try to parse as JSON first
        try {
            const parsedData = JSON.parse(qrData);
            
            if (parsedData.batchId) {
                batchId = parsedData.batchId;
            }
        } catch (jsonError) {
            // If not JSON, treat as plain batch ID
            const trimmedData = qrData.trim();
            if (!isNaN(trimmedData) && trimmedData !== '') {
                batchId = trimmedData;
            }
        }
        
        if (batchId !== null) {
            showToast('✅ QR Code detected! Downloading batch information...', 'success');
            
            // Small delay to show the toast message
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Automatically download batch info
            await window.downloadBatchInfo(batchId);
        } else {
            showToast('⚠️ Invalid QR code format', 'warning');
            console.error('QR data:', qrData);
        }
    } catch (error) {
        console.error('QR handling error:', error);
        showToast('❌ Failed to process QR code: ' + error.message, 'error');
    }
}

/**
 * Stop QR Scanner
 */
function stopQRScanner() {
    qrScannerActive = false;
    
    if (qrStream) {
        qrStream.getTracks().forEach(track => track.stop());
        qrStream = null;
    }
    
    const video = document.getElementById('qrVideo');
    const scannerContainer = document.getElementById('qrScannerContainer');
    
    if (video) {
        video.srcObject = null;
    }
    
    if (scannerContainer) {
        scannerContainer.style.display = 'none';
    }
}

/**
 * Modified downloadBatchInfo function with better error handling
 */
window.downloadBatchInfo = async function(batchId) {
    if (!contract) {
        showToast('Please connect wallet first', 'warning');
        return;
    }
    
    try {
        showLoading(true);
        
        // Fetch batch information from blockchain
        const batch = await contract.getBatch(batchId);
        const transactions = await contract.getBatchTransactions(batchId);
        const participants = await contract.getBatchParticipants(batchId);
        
        // Create formatted text content
        const stateNames = ['Created', 'InTransit', 'AtMiddleman', 'InFinalTransit', 'Delivered', 'Sold'];
        
        let textContent = `========================================\n`;
        textContent += `   AGRICULTURAL SUPPLY CHAIN\n`;
        textContent += `        BATCH INFORMATION\n`;
        textContent += `========================================\n\n`;
        
        textContent += `BATCH DETAILS:\n`;
        textContent += `----------------------------------------\n`;
        textContent += `Batch ID: ${batchId}\n`;
        textContent += `Product Name: ${batch[3]}\n`;
        textContent += `Quantity: ${batch[6].toString()} kg\n`;
        textContent += `Farmer Price: ${ethers.formatEther(batch[5])} ETH\n`;
        textContent += `Current State: ${stateNames[Number(batch[7])]}\n`;
        textContent += `Created At: ${new Date(Number(batch[8]) * 1000).toLocaleString()}\n\n`;
        
        textContent += `FARMER INFORMATION:\n`;
        textContent += `----------------------------------------\n`;
        textContent += `Farmer Address: ${batch[1]}\n`;
        textContent += `Current Owner: ${batch[2]}\n\n`;
        
        if (participants.length > 0) {
            textContent += `SUPPLY CHAIN PARTICIPANTS:\n`;
            textContent += `----------------------------------------\n`;
            participants.forEach((addr, index) => {
                textContent += `${index + 1}. ${addr}\n`;
            });
            textContent += `\n`;
        }
        
        if (transactions.length > 0) {
            textContent += `TRANSACTION HISTORY:\n`;
            textContent += `----------------------------------------\n`;
            transactions.forEach((tx, index) => {
                textContent += `\nTransaction ${index + 1}:\n`;
                textContent += `  From: ${tx.from}\n`;
                textContent += `  To: ${tx.to}\n`;
                textContent += `  Amount: ${ethers.formatEther(tx.amount)} ETH\n`;
                textContent += `  Role: ${tx.role}\n`;
                textContent += `  Date: ${new Date(Number(tx.timestamp) * 1000).toLocaleString()}\n`;
                if (tx.description) {
                    textContent += `  Description: ${tx.description}\n`;
                }
            });
            textContent += `\n`;
        }
        
        textContent += `========================================\n`;
        textContent += `Generated: ${new Date().toLocaleString()}\n`;
        textContent += `Verified on ${CONFIG.NETWORK_NAME} Network\n`;
        textContent += `Contract: ${CONFIG.CONTRACT_ADDRESS}\n`;
        textContent += `========================================\n\n`;
        
        textContent += `AUTHENTICITY VERIFICATION:\n`;
        textContent += `This document contains blockchain-verified\n`;
        textContent += `information and can be independently verified\n`;
        textContent += `on the Ethereum blockchain.\n`;
        
        // Download as .txt file
        const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `AgriChain-Batch-${batchId}-${Date.now()}.txt`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 100);
        
        showToast('✅ Batch information downloaded successfully!', 'success');
        
    } catch (error) {
        console.error('Download error:', error);
        
        // Better error messages
        if (error.message.includes('Batch not found') || error.message.includes('does not exist')) {
            showToast('❌ Batch ID ' + batchId + ' not found', 'error');
        } else {
            showToast('❌ Failed to download: ' + error.message, 'error');
        }
    } finally {
        showLoading(false);
    }
};

/**
 * Start QR Code Scanner with improved feedback
 */
async function scanQRCode() {
    const scannerContainer = document.getElementById('qrScannerContainer');
    const video = document.getElementById('qrVideo');
    
    try {
        if (!contract) {
            showToast('⚠️ Please connect your wallet first', 'warning');
            return;
        }
        
        // Request camera access
        qrStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
        });
        
        video.srcObject = qrStream;
        video.play();
        scannerContainer.style.display = 'block';
        qrScannerActive = true;
        
        showToast('📷 QR Scanner started. Point at QR code', 'info');
        
        // Start scanning
        requestAnimationFrame(scanFrame);
        
    } catch (error) {
        console.error('Camera access error:', error);
        
        if (error.name === 'NotAllowedError') {
            showToast('❌ Camera permission denied. Please allow camera access.', 'error');
        } else if (error.name === 'NotFoundError') {
            showToast('❌ No camera found on this device', 'error');
        } else {
            showToast('❌ Failed to access camera: ' + error.message, 'error');
        }
    }
}

/**
 * Scan frame for QR code
 */
function scanFrame() {
    if (!qrScannerActive) return;
    
    const video = document.getElementById('qrVideo');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code) {
            // QR code detected - process it
            handleQRCodeDetected(code.data);
            return; // Stop scanning after detection
        }
    }
    
    // Continue scanning
    requestAnimationFrame(scanFrame);
}

function initializeEventListeners() {
    document.getElementById('connectWallet').addEventListener('click', connectWallet);
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('languageBtn').addEventListener('click', toggleLanguageDropdown);
    document.getElementById('registerUserForm').addEventListener('submit', registerUser);
    document.getElementById('createBatchForm').addEventListener('submit', createBatch);
    document.getElementById('trackBtn').addEventListener('click', trackBatch);
    document.getElementById('purchaseForm').addEventListener('submit', purchaseBatch);
    document.getElementById('updateStateForm').addEventListener('submit', updateBatchState);
    document.getElementById('switchRoleBtn')?.addEventListener('click', showRoleSwitcher);
    
    document.querySelectorAll('.split-amount').forEach(input => {
        input.addEventListener('input', calculateTotalPayment);
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    document.querySelectorAll('.language-option').forEach(option => {
        option.addEventListener('click', () => changeLanguage(option.dataset.lang, option.dataset.code));
    });
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.language-selector')) {
            document.getElementById('languageDropdown').classList.remove('show');
        }
    });
}

// Theme Toggle
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    showToast(`Switched to ${newTheme} mode`, 'success');
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#themeToggle i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Language Support
function initializeLanguage() {
    const savedLang = localStorage.getItem('language') || 'en';
    const savedCode = localStorage.getItem('languageCode') || 'en';
    currentLanguage = savedLang;
    document.getElementById('currentLang').textContent = savedCode.toUpperCase();
    updatePageText();
}

function toggleLanguageDropdown() {
    document.getElementById('languageDropdown').classList.toggle('show');
}

async function changeLanguage(lang, code) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    localStorage.setItem('languageCode', code);
    document.getElementById('currentLang').textContent = code.toUpperCase();
    document.getElementById('languageDropdown').classList.remove('show');
    
    document.querySelectorAll('.language-option').forEach(opt => {
        opt.classList.remove('active');
        if (opt.dataset.lang === lang) opt.classList.add('active');
    });
    
    if (lang === 'en') {
        updatePageText();
    } else {
        await translatePage(lang);
    }
    
    showToast(`Language changed to ${code.toUpperCase()}`, 'success');
}

function updatePageText() {
    const trans = translations[currentLanguage] || translations.en;
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (trans[key]) {
            el.textContent = trans[key];
        }
    });
}

async function translatePage(targetLang) {
    // Get all translatable elements
    const elements = document.querySelectorAll('[data-translate]');
    
    for (const el of elements) {
        const originalText = translations.en[el.getAttribute('data-translate')];
        
        // Call Bhashini API
        const translatedText = await callBhashiniAPI(originalText, 'en', targetLang);
        el.textContent = translatedText;
    }
}

// Wallet Connection
async function connectWallet() {
    try {
        if (!window.ethereum) {
            showToast('Please install MetaMask!', 'error');
            return;
        }
        
        showLoading(true);
        
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAddress = accounts[0];
        
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        
        const network = await provider.getNetwork();
        if (Number(network.chainId) !== CONFIG.NETWORK_ID) {
            showToast(`Please switch to ${CONFIG.NETWORK_NAME}`, 'warning');
            await switchNetwork();
            return;
        }
        
        contract = new ethers.Contract(CONFIG.CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        
        await getUserRoles();
        updateWalletUI();
        await updateStats();
        
        showToast('Wallet connected successfully!', 'success');
        
        window.ethereum.on('accountsChanged', () => window.location.reload());
        window.ethereum.on('chainChanged', () => window.location.reload());
        
    } catch (error) {
        console.error('Connection error:', error);
        showToast('Failed to connect: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

async function switchNetwork() {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x' + CONFIG.NETWORK_ID.toString(16) }],
        });
        setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
        console.error('Network switch failed:', error);
    }
}

// User Roles
async function getUserRoles() {
    try {
        const roles = ['FARMER', 'TRANSPORT', 'MIDDLEMAN', 'RETAILER'];
        userRoles = [];
        
        for (const roleName of roles) {
            const roleHash = await contract[`${roleName}_ROLE`]();
            const hasRole = await contract.hasRole(roleHash, userAddress);
            if (hasRole) {
                userRoles.push(roleName);
            }
        }
        
        const adminRole = await contract.DEFAULT_ADMIN_ROLE();
        const isAdmin = await contract.hasRole(adminRole, userAddress);
        if (isAdmin) {
            userRoles.push('ADMIN');
        }
        
        activeRole = userRoles[0] || null;
        updateUIForRole();
        
    } catch (error) {
        console.error('Error getting roles:', error);
    }
}

function updateUIForRole() {
    document.getElementById('admin').style.display = 'none';
    document.getElementById('create').style.display = 'none';
    document.getElementById('purchase').style.display = 'none';
    document.getElementById('updateState').style.display = 'none';
    
    document.getElementById('adminLink').style.display = 'none';
    document.getElementById('createLink').style.display = 'none';
    document.getElementById('purchaseLink').style.display = 'none';
    document.getElementById('updateLink').style.display = 'none';
    
    if (activeRole === 'ADMIN') {
        document.getElementById('admin').style.display = 'block';
        document.getElementById('adminLink').style.display = 'block';
    }
    if (activeRole === 'FARMER') {
        document.getElementById('create').style.display = 'block';
        document.getElementById('createLink').style.display = 'block';
    }
    if (activeRole === 'RETAILER' || activeRole === 'MIDDLEMAN') {
        document.getElementById('purchase').style.display = 'block';
        document.getElementById('purchaseLink').style.display = 'block';
        updatePurchaseFormForRole();
    }
    if (activeRole === 'TRANSPORT') {
        document.getElementById('updateState').style.display = 'block';
        document.getElementById('updateLink').style.display = 'block';
    }
    
    if (userRoles.length > 1) {
        document.getElementById('switchRoleBtn').style.display = 'inline-flex';
    }
}

function updateWalletUI() {
    document.getElementById('walletStatus').style.display = 'block';
    document.getElementById('connectedAddress').textContent = 
        userAddress.substring(0, 6) + '...' + userAddress.substring(38);
    document.getElementById('activeRole').textContent = activeRole || 'No roles';
    document.getElementById('networkName').textContent = CONFIG.NETWORK_NAME;
    
    const btn = document.getElementById('connectWallet');
    btn.innerHTML = '<i class="fas fa-check-circle"></i> <span>Connected</span>';
    btn.style.background = '#27ae60';
    btn.disabled = true;
}

function updatePurchaseFormForRole() {
    const farmerSplit = document.getElementById('farmerPaymentSplit');
    const transporterSplit = document.getElementById('transporterPaymentSplit');
    const middlemanSplit = document.getElementById('middlemanPaymentSplit');
    
    // Reset all to visible first
    if (farmerSplit) farmerSplit.style.display = 'block';
    if (transporterSplit) transporterSplit.style.display = 'block';
    if (middlemanSplit) middlemanSplit.style.display = 'block';
    
    if (activeRole === 'MIDDLEMAN') {
        // Middleman sees farmer and transporter fields only
        if (middlemanSplit) middlemanSplit.style.display = 'none';
    }
    
    if (activeRole === 'RETAILER') {
        // Retailer sees only middleman field
        if (farmerSplit) farmerSplit.style.display = 'none';
        if (transporterSplit) transporterSplit.style.display = 'none';
    }
}

// Role Switcher
function showRoleSwitcher() {
    const modal = document.getElementById('roleSwitcherModal');
    const rolesList = document.getElementById('rolesList');
    
    rolesList.innerHTML = '';
    
    const roleIcons = {
        'ADMIN': 'fa-user-shield',
        'FARMER': 'fa-seedling',
        'TRANSPORT': 'fa-truck',
        'MIDDLEMAN': 'fa-handshake',
        'RETAILER': 'fa-store'
    };
    
    const roleDescriptions = {
        'ADMIN': 'Manage users and grant roles',
        'FARMER': 'Create product batches',
        'TRANSPORT': 'Update delivery status',
        'MIDDLEMAN': 'Purchase and distribute',
        'RETAILER': 'Purchase for final sale'
    };
    
    userRoles.forEach(role => {
        const card = document.createElement('div');
        card.className = `role-card ${role === activeRole ? 'active' : ''}`;
        card.innerHTML = `
            <i class="fas ${roleIcons[role]}"></i>
            <div class="role-info">
                <h4>${role}</h4>
                <p>${roleDescriptions[role]}</p>
            </div>
        `;
        card.onclick = () => switchRole(role);
        rolesList.appendChild(card);
    });
    
    modal.style.display = 'flex';
}

function closeRoleSwitcher() {
    document.getElementById('roleSwitcherModal').style.display = 'none';
}

function switchRole(role) {
    activeRole = role;
    updateUIForRole();
    updateWalletUI();
    closeRoleSwitcher();
    showToast(`Switched to ${role} role`, 'success');
}

// Admin Functions
async function registerUser(e) {
    e.preventDefault();
    
    if (!contract || activeRole !== 'ADMIN') {
        showToast('Admin access required', 'error');
        return;
    }
    
    try {
        showLoading(true);
        
        const address = document.getElementById('userAddress').value;
        const name = document.getElementById('userName').value || 'Unknown';
        const selectedRoles = Array.from(document.querySelectorAll('input[name="role"]:checked'))
            .map(cb => cb.value);
        
        if (selectedRoles.length === 0) {
            showToast('Please select at least one role', 'warning');
            showLoading(false);
            return;
        }
        
        for (const roleName of selectedRoles) {
            const roleHash = await contract[`${roleName}_ROLE`]();
            const tx = await contract.grantUserRole(address, roleHash);
            await tx.wait();
        }
        
        registeredUsers.push({
            address,
            name,
            roles: selectedRoles,
            registeredAt: new Date().toISOString()
        });
        saveToLocalStorage();
        
        showToast('User registered successfully!', 'success');
        e.target.reset();
        loadRegisteredUsers();
        await updateStats();
        
    } catch (error) {
        console.error('Register error:', error);
        showToast('Failed to register: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

function loadRegisteredUsers() {
    const usersList = document.getElementById('usersList');
    
    if (registeredUsers.length === 0) {
        usersList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users"></i>
                <p>No registered users yet</p>
            </div>
        `;
        return;
    }
    
    usersList.innerHTML = '';
    
    registeredUsers.forEach(user => {
        const card = document.createElement('div');
        card.className = 'user-card';
        
        const rolesHTML = user.roles.map(role => 
            `<span class="role-badge ${role.toLowerCase()}">${role}</span>`
        ).join('');
        
        card.innerHTML = `
            <div class="user-card-header">
                <h4><i class="fas fa-user"></i> ${user.name}</h4>
            </div>
            <div class="user-address">${user.address}</div>
            <div class="user-roles">${rolesHTML}</div>
            <small style="color: var(--gray); margin-top: 0.5rem; display: block;">
                Registered: ${new Date(user.registeredAt).toLocaleString()}
            </small>
        `;
        
        usersList.appendChild(card);
    });
}

// Batch Functions
async function createBatch(e) {
    e.preventDefault();
    
    if (!contract || activeRole !== 'FARMER') {
        showToast('Farmer role required', 'error');
        return;
    }
    
    try {
        showLoading(true);
        
        const productName = document.getElementById('productName').value;
        const quantity = document.getElementById('quantity').value;
        const farmerPrice = document.getElementById('farmerPrice').value;
        const origin = document.getElementById('origin').value;
        const certifications = document.getElementById('certifications').value;
        const description = document.getElementById('description').value;
        
        const metadata = {
            origin,
            certifications,
            description,
            timestamp: new Date().toISOString()
        };
        
        const ipfsHash = "Qm" + btoa(JSON.stringify(metadata)).substring(0, 44);
        const priceInWei = ethers.parseEther(farmerPrice);
        
        const tx = await contract.createBatch(productName, ipfsHash, priceInWei, quantity);
        showToast('Transaction submitted...', 'info');
        
        const receipt = await tx.wait();
        
        let batchId = 'Unknown';
        for (const log of receipt.logs) {
            try {
                const parsed = contract.interface.parseLog(log);
                if (parsed && parsed.name === 'BatchCreated') {
                    batchId = parsed.args.batchId.toString();
                    break;
                }
            } catch (e) {}
        }
        
        showToast(`Batch created! ID: ${batchId}`, 'success');
        e.target.reset();
        await updateStats();
        loadMyBatches();
        
    } catch (error) {
        console.error('Create batch error:', error);
        showToast('Failed to create batch: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

async function loadMyBatches() {
    if (!contract || !userAddress) {
        showToast('Please connect wallet first', 'warning');
        return;
    }
    
    try {
        showLoading(true);
        const list = document.getElementById('myBatchesList');
        list.innerHTML = '<p style="text-align: center; color: var(--gray);">Loading...</p>';
        
        const totalBatches = await contract.nextBatchId();
        const myBatches = [];
        
        for (let i = 0; i < Number(totalBatches); i++) {
            try {
                const batch = await contract.getBatch(i);
                // getBatch returns an array, not an object
                // [id, farmer, currentOwner, productName, ipfsHash, farmerPrice, quantity, state, createdAt, transactionCount]
                if (batch[1].toLowerCase() === userAddress.toLowerCase()) {
                    myBatches.push({
                        id: Number(batch[0]),
                        farmer: batch[1],
                        currentOwner: batch[2],
                        productName: batch[3],
                        ipfsHash: batch[4],
                        farmerPrice: batch[5],
                        quantity: batch[6],
                        state: batch[7],
                        createdAt: batch[8],
                        transactionCount: batch[9]
                    });
                }
            } catch (e) {
                console.log('Skipping batch', i, e.message);
            }
        }
        
        if (myBatches.length === 0) {
            list.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-box-open"></i>
                    <p>No batches created yet</p>
                </div>
            `;
            return;
        }
        
        list.innerHTML = '';
        const stateNames = ['Created', 'InTransit', 'AtMiddleman', 'InFinalTransit', 'Delivered', 'Sold'];
        
        myBatches.forEach(batch => {
            const card = document.createElement('div');
            card.className = 'batch-card';
            card.onclick = () => {
                document.getElementById('trackBatchId').value = batch.id;
                document.querySelector('#track').scrollIntoView({ behavior: 'smooth' });
                trackBatch();
            };
            
            card.innerHTML = `
                <div class="batch-card-header">
                    <h4><i class="fas fa-box"></i> ${batch.productName}</h4>
                    <span class="badge ${stateNames[Number(batch.state)].toLowerCase()}">${stateNames[Number(batch.state)]}</span>
                </div>
                <div class="batch-card-info">
                    <div class="batch-info-pill">
                        <strong>ID:</strong> ${batch.id}
                    </div>
                    <div class="batch-info-pill">
                        <strong>Quantity:</strong> ${batch.quantity.toString()} kg
                    </div>
                    <div class="batch-info-pill">
                        <strong>Price:</strong> ${ethers.formatEther(batch.farmerPrice)} ETH
                    </div>
                </div>
                <div class="batch-card-footer">
                    Created: ${new Date(Number(batch.createdAt) * 1000).toLocaleString()}
                </div>
            `;
            
            list.appendChild(card);
        });
        
        showToast(`Found ${myBatches.length} batches`, 'success');
        
    } catch (error) {
        console.error('Load batches error:', error);
        showToast('Failed to load batches: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

async function loadMyPurchases() {
    if (!contract || !userAddress) {
        showToast('Please connect wallet first', 'warning');
        return;
    }
    
    try {
        showLoading(true);
        const list = document.getElementById('myPurchasesList');
        list.innerHTML = '<p style="text-align: center; color: var(--gray);">Loading...</p>';
        
        const totalBatches = await contract.nextBatchId();
        const myPurchases = [];
        
        for (let i = 0; i < Number(totalBatches); i++) {
            try {
                const batch = await contract.getBatch(i);
                const transactions = await contract.getBatchTransactions(i);
                
                const isOwner = batch.currentOwner.toLowerCase() === userAddress.toLowerCase();
                const hasTransaction = transactions.some(tx => 
                    tx.from.toLowerCase() === userAddress.toLowerCase() || 
                    tx.to.toLowerCase() === userAddress.toLowerCase()
                );
                
                if (isOwner || hasTransaction) {
                    myPurchases.push({ id: i, ...batch, isCurrentOwner: isOwner });
                }
            } catch (e) {
                console.log('Skipping batch', i);
            }
        }
        
        if (myPurchases.length === 0) {
            list.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-bag"></i>
                    <p>No purchase history yet</p>
                </div>
            `;
            return;
        }
        
        list.innerHTML = '';
        const stateNames = ['Created', 'InTransit', 'AtMiddleman', 'InFinalTransit', 'Delivered', 'Sold'];
        
        myPurchases.forEach(batch => {
            const card = document.createElement('div');
            card.className = 'batch-card';
            card.onclick = () => {
                document.getElementById('trackBatchId').value = batch.id;
                document.querySelector('#track').scrollIntoView({ behavior: 'smooth' });
                trackBatch();
            };
            
            const ownershipBadge = batch.isCurrentOwner ? 
                '<span style="background: #27ae60; color: white; padding: 0.25rem 0.5rem; border-radius: 5px; font-size: 0.8rem;">Current Owner</span>' : 
                '<span style="background: #95a5a6; color: white; padding: 0.25rem 0.5rem; border-radius: 5px; font-size: 0.8rem;">Past Transaction</span>';
            
            card.innerHTML = `
                <div class="batch-card-header">
                    <h4><i class="fas fa-shopping-cart"></i> ${batch.productName}</h4>
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                        ${ownershipBadge}
                        <span class="badge ${stateNames[Number(batch.state)].toLowerCase()}">${stateNames[Number(batch.state)]}</span>
                    </div>
                </div>
                <div class="batch-card-info">
                    <div class="batch-info-pill">
                        <strong>ID:</strong> ${batch.id}
                    </div>
                    <div class="batch-info-pill">
                        <strong>Quantity:</strong> ${batch.quantity.toString()} kg
                    </div>
                    <div class="batch-info-pill">
                        <strong>Price:</strong> ${ethers.formatEther(batch.farmerPrice)} ETH
                    </div>
                </div>
                <div class="batch-card-footer">
                    Farmer: ${batch.farmer.substring(0, 10)}... | Created: ${new Date(Number(batch.createdAt) * 1000).toLocaleString()}
                </div>
            `;
            
            list.appendChild(card);
        });
        
        showToast(`Found ${myPurchases.length} transactions`, 'success');
        
    } catch (error) {
        console.error('Load purchases error:', error);
        showToast('Failed to load purchases', 'error');
    } finally {
        showLoading(false);
    }
}

async function trackBatch() {
    if (!contract) {
        showToast('Please connect wallet first', 'warning');
        return;
    }
    
    const batchId = document.getElementById('trackBatchId').value;
    
    if (!batchId) {
        showToast('Please enter a batch ID', 'warning');
        return;
    }
    
    try {
        showLoading(true);
        
        const batch = await contract.getBatch(batchId);
        const batchDetails = document.getElementById('batchDetails');
        
        const stateNames = ['Created', 'InTransit', 'AtMiddleman', 'InFinalTransit', 'Delivered', 'Sold'];
        const state = Number(batch.state);
        
        batchDetails.innerHTML = `
            <div style="padding: 2rem; background: var(--bg-primary); border-radius: 12px; box-shadow: var(--shadow);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 2px solid var(--light-color);">
                    <h3 style="margin: 0; color: var(--text-dark);">${batch.productName}</h3>
                    <span class="badge ${stateNames[state].toLowerCase()}">${stateNames[state]}</span>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                    <div style="padding: 1rem; background: var(--light-color); border-radius: 8px;">
                        <strong>Batch ID:</strong> ${batchId}
                    </div>
                    <div style="padding: 1rem; background: var(--light-color); border-radius: 8px;">
                        <strong>Quantity:</strong> ${batch.quantity.toString()} kg
                    </div>
                    <div style="padding: 1rem; background: var(--light-color); border-radius: 8px;">
                        <strong>Price:</strong> ${ethers.formatEther(batch.farmerPrice)} ETH
                    </div>
                    <div style="padding: 1rem; background: var(--light-color); border-radius: 8px;">
                        <strong>Created:</strong> ${new Date(Number(batch.createdAt) * 1000).toLocaleString()}
                    </div>
                </div>
                
                <div style="padding: 1rem; background: var(--light-color); border-radius: 8px;">
                    <strong>Farmer:</strong> ${batch.farmer}
                </div>
            </div>
        `;
        const qrContainer = document.createElement('div');
        qrContainer.id = 'batchQRCode';
        qrContainer.style.cssText = 'text-align: center; margin: 2rem 0; padding: 1rem; background: white; border-radius: 8px;';
        
        batchDetails.appendChild(qrContainer);
        
        // Initialize QR Generator
        const qrGen = new QRCodeGenerator({
            width: 300,
            height: 300,
            colorDark: "#2ecc71"
        });
        
        await qrGen.generateBatchQR(batchId, qrContainer);
        
        // Add download button
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'btn btn-primary';
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download QR Code';
        downloadBtn.onclick = () => qrGen.downloadQRCode(qrContainer, `batch-${batchId}-qr.png`);
        batchDetails.appendChild(downloadBtn);
        
        batchDetails.style.display = 'block';
        showToast('Batch loaded successfully!', 'success');
        
    } catch (error) {
        console.error('Track error:', error);
        showToast('Batch not found', 'error');
    } finally {
        showLoading(false);
    }
}

async function purchaseBatch(e) {
    e.preventDefault();
    
    if (!contract || (activeRole !== 'RETAILER' && activeRole !== 'MIDDLEMAN')) {
        showToast('Retailer or Middleman role required', 'error');
        return;
    }
    
    try {
        showLoading(true);
        
        const batchId = document.getElementById('purchaseBatchId').value;
        const splits = [];
        
        const farmerAmount = document.getElementById('farmerAmount').value;
        const farmerAddress = document.getElementById('farmerAddress').value;
        const transporterAmount = document.getElementById('transporterAmount').value;
        const transporterAddress = document.getElementById('transporterAddress').value;
        const middlemanAmount = document.getElementById('middlemanAmount').value;
        const middlemanAddress = document.getElementById('middlemanAddress').value;
        
        if (farmerAmount && farmerAddress && parseFloat(farmerAmount) > 0) {
            splits.push({
                payee: farmerAddress,
                amount: ethers.parseEther(farmerAmount),
                role: "farmer"
            });
        }
        
        if (transporterAmount && transporterAddress && parseFloat(transporterAmount) > 0) {
            splits.push({
                payee: transporterAddress,
                amount: ethers.parseEther(transporterAmount),
                role: "transporter"
            });
        }
        
        if (middlemanAmount && middlemanAddress && parseFloat(middlemanAmount) > 0) {
            splits.push({
                payee: middlemanAddress,
                amount: ethers.parseEther(middlemanAmount),
                role: "middleman"
            });
        }
        
        if (splits.length === 0) {
            showToast('Please add at least one payment split', 'warning');
            showLoading(false);
            return;
        }
        
        const totalAmount = splits.reduce((sum, split) => sum + split.amount, 0n);
        
        const tx = await contract.purchaseBatch(batchId, splits, { value: totalAmount });
        showToast('Transaction submitted...', 'info');
        
        await tx.wait();
        showToast('Batch purchased successfully!', 'success');
        
        e.target.reset();
        calculateTotalPayment();
        
    } catch (error) {
        console.error('Purchase error:', error);
        showToast('Failed to purchase: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

async function updateBatchState(e) {
    e.preventDefault();
    
    if (!contract || activeRole !== 'TRANSPORT') {
        showToast('Transport role required', 'error');
        return;
    }
    
    try {
        showLoading(true);
        
        const batchId = document.getElementById('stateBatchId').value;
        const newState = document.getElementById('newState').value;
        
        const tx = await contract.updateBatchState(batchId, newState);
        showToast('Transaction submitted...', 'info');
        
        await tx.wait();
        showToast('Batch state updated!', 'success');
        
        e.target.reset();
        await updateStats();
        
    } catch (error) {
        console.error('Update error:', error);
        showToast('Failed to update: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// Statistics
async function updateStats() {
    try {
        if (!contract) return;
        
        const totalBatches = await contract.nextBatchId();
        document.getElementById('totalBatches').textContent = Number(totalBatches);
        document.getElementById('totalFarmers').textContent = registeredUsers.filter(u => u.roles.includes('FARMER')).length;
        
        let deliveredCount = 0;
        for (let i = 0; i < Number(totalBatches); i++) {
            try {
                const batch = await contract.getBatch(i);
                if (Number(batch.state) >= 4) {
                    deliveredCount++;
                }
            } catch (e) {}
        }
        document.getElementById('deliveredBatches').textContent = deliveredCount;
        
    } catch (error) {
        console.error('Stats error:', error);
    }
}

// Utility Functions
function calculateTotalPayment() {
    const amounts = document.querySelectorAll('.split-amount');
    let total = 0;
    amounts.forEach(input => {
        total += parseFloat(input.value) || 0;
    });
    document.getElementById('totalPayment').textContent = total.toFixed(4) + ' ETH';
}

function saveToLocalStorage() {
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('registeredUsers');
    if (saved) {
        registeredUsers = JSON.parse(saved);
    }
}

function handleNavigation(e) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute('href'));
    if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');
    }
}

function showLoading(show) {
    document.getElementById('loadingOverlay').style.display = show ? 'flex' : 'none';
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

console.log('🌾 AgriChain Enhanced - Loaded Successfully');
