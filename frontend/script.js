// script.js - Frontend JavaScript for Supply Chain DApp
// IMPORTANT: Update CONTRACT_ADDRESS after deployment

// ==================== CONFIGURATION ====================
const CONFIG = {
    CONTRACT_ADDRESS: "0x10DA8a6Ff9d8776Df7E6E2C4Aad751320eE26164", //  Verified on Sepolia
    NETWORK_ID: 11155111, // Sepolia testnet
    NETWORK_NAME: "Sepolia",
    // Use multiple RPC endpoints for fallback
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadFromLocalStorage();
    checkURLParameters();
});

function initializeEventListeners() {
    document.getElementById('connectWallet').addEventListener('click', connectWallet);
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
}

// Connect Wallet
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

// Get User Roles
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
        
        // Check admin
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

// Update UI for Role
function updateUIForRole() {
    // Hide all sections
    document.getElementById('admin').style.display = 'none';
    document.getElementById('create').style.display = 'none';
    document.getElementById('purchase').style.display = 'none';
    document.getElementById('updateState').style.display = 'none';
    
    // Hide all nav links
    document.getElementById('adminLink').style.display = 'none';
    document.getElementById('createLink').style.display = 'none';
    document.getElementById('purchaseLink').style.display = 'none';
    document.getElementById('updateLink').style.display = 'none';
    
    // Show based on active role
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
    }
    if (activeRole === 'TRANSPORT') {
        document.getElementById('updateState').style.display = 'block';
        document.getElementById('updateLink').style.display = 'block';
    }
    
    // Show role switcher if multiple roles
    if (userRoles.length > 1) {
        document.getElementById('switchRoleBtn').style.display = 'inline-flex';
    }
}

// Update Wallet UI
function updateWalletUI() {
    document.getElementById('walletStatus').style.display = 'block';
    document.getElementById('connectedAddress').textContent = 
        userAddress.substring(0, 6) + '...' + userAddress.substring(38);
    document.getElementById('activeRole').textContent = activeRole || 'No roles';
    document.getElementById('networkName').textContent = CONFIG.NETWORK_NAME;
    
    const btn = document.getElementById('connectWallet');
    btn.innerHTML = '<i class="fas fa-check-circle"></i> Connected';
    btn.style.background = '#27ae60';
    btn.disabled = true;
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

// Register User (Admin)
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
        
        // Grant roles
        for (const roleName of selectedRoles) {
            const roleHash = await contract[`${roleName}_ROLE`]();
            const tx = await contract.grantUserRole(address, roleHash);
            await tx.wait();
        }
        
        // Save to local storage
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

// Load Registered Users
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
            <small style="color: #95a5a6; margin-top: 0.5rem; display: block;">
                Registered: ${new Date(user.registeredAt).toLocaleString()}
            </small>
        `;
        
        usersList.appendChild(card);
    });
}

// Create Batch
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
        
    } catch (error) {
        console.error('Create batch error:', error);
        showToast('Failed to create batch: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// Track Batch
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
        const transactions = await contract.getBatchTransactions(batchId);
        const participants = await contract.getBatchParticipants(batchId);
        
        displayBatchDetails(batch, transactions, participants, batchId);
        generateQRCode(batchId);
        
    } catch (error) {
        console.error('Track error:', error);
        showToast('Batch not found', 'error');
    } finally {
        showLoading(false);
    }
}

// Display Batch Details
function displayBatchDetails(batch, transactions, participants, batchId) {
    const stateNames = ['Created', 'InTransit', 'AtMiddleman', 'InFinalTransit', 'Delivered', 'Sold'];
    const state = Number(batch.state);
    
    document.getElementById('batchProductName').textContent = batch.productName;
    document.getElementById('batchState').textContent = stateNames[state];
    document.getElementById('batchState').className = 'badge ' + stateNames[state].toLowerCase();
    
    document.getElementById('detailBatchId').textContent = batchId;
    document.getElementById('detailFarmer').textContent = 
        batch.farmer.substring(0, 10) + '...' + batch.farmer.substring(32);
    document.getElementById('detailOwner').textContent = 
        batch.currentOwner.substring(0, 10) + '...' + batch.currentOwner.substring(32);
    document.getElementById('detailQuantity').textContent = batch.quantity.toString() + ' kg';
    document.getElementById('detailPrice').textContent = 
        ethers.formatEther(batch.farmerPrice) + ' ETH';
    document.getElementById('detailCreated').textContent = 
        new Date(Number(batch.createdAt) * 1000).toLocaleString();
    
    displayTimeline(transactions);
    displayParticipants(participants, batch.farmer);
    
    document.getElementById('batchDetails').style.display = 'block';
    document.getElementById('batchDetails').scrollIntoView({ behavior: 'smooth' });
}

// Display Timeline
function displayTimeline(transactions) {
    const timeline = document.getElementById('journeyTimeline');
    timeline.innerHTML = '';
    
    if (transactions.length === 0) {
        timeline.innerHTML = '<p style="text-align: center; color: #95a5a6;">No transactions yet</p>';
        return;
    }
    
    transactions.forEach(tx => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        
        const content = document.createElement('div');
        content.className = 'timeline-content';
        
        const amount = tx.amount > 0 ? 
            `<strong>Amount:</strong> ${ethers.formatEther(tx.amount)} ETH<br>` : '';
        
        content.innerHTML = `
            <strong>${tx.role}</strong> - ${tx.description}<br>
            ${amount}
            <strong>From:</strong> ${tx.from.substring(0, 10)}...<br>
            <strong>To:</strong> ${tx.to.substring(0, 10)}...
            <span class="time">${new Date(Number(tx.timestamp) * 1000).toLocaleString()}</span>
        `;
        
        item.appendChild(content);
        timeline.appendChild(item);
    });
}

// Display Participants
function displayParticipants(participants, farmer) {
    const list = document.getElementById('participantsList');
    list.innerHTML = '';
    
    participants.forEach(addr => {
        const item = document.createElement('div');
        item.className = 'participant-item';
        
        const icon = addr.toLowerCase() === farmer.toLowerCase() ? 
            '<i class="fas fa-seedling"></i>' : '<i class="fas fa-user"></i>';
        
        const label = addr.toLowerCase() === farmer.toLowerCase() ? ' (Farmer)' : '';
        
        item.innerHTML = `
            ${icon}
            <span>${addr.substring(0, 10)}...${addr.substring(32)}${label}</span>
        `;
        
        list.appendChild(item);
    });
}

// Generate QR Code
function generateQRCode(batchId) {
    const qrContainer = document.getElementById('qrCode');
    qrContainer.innerHTML = '';
    
    const url = `${window.location.origin}${window.location.pathname}?batch=${batchId}`;
    
    new QRCode(qrContainer, {
        text: url,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
    });
    
    document.getElementById('downloadQR').onclick = () => {
        const canvas = qrContainer.querySelector('canvas');
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `batch-${batchId}-qr.png`;
        link.href = url;
        link.click();
    };
}

// Purchase Batch
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
        const splitItems = document.querySelectorAll('.payment-split-item');
        
        for (const item of splitItems) {
            const amount = item.querySelector('.split-amount').value;
            const address = item.querySelector('.split-address').value;
            const role = item.querySelector('.split-amount').dataset.role;
            
            if (amount && address && parseFloat(amount) > 0) {
                splits.push({
                    payee: address,
                    amount: ethers.parseEther(amount),
                    role: role
                });
            }
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

// Update Batch State
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

// Update Stats
async function updateStats() {
    try {
        if (!contract) return;
        
        const totalBatches = await contract.nextBatchId();
        stats.totalBatches = Number(totalBatches);
        stats.totalFarmers = registeredUsers.filter(u => u.roles.includes('FARMER')).length;
        
        // Count delivered batches
        let deliveredCount = 0;
        for (let i = 0; i < stats.totalBatches; i++) {
            try {
                const batch = await contract.getBatch(i);
                if (Number(batch.state) >= 4) { // Delivered or Sold
                    deliveredCount++;
                }
            } catch (e) {}
        }
        stats.deliveredBatches = deliveredCount;
        
        document.getElementById('totalBatches').textContent = stats.totalBatches;
        document.getElementById('totalFarmers').textContent = stats.totalFarmers;
        document.getElementById('deliveredBatches').textContent = stats.deliveredBatches;
        
    } catch (error) {
        console.error('Stats error:', error);
    }
}

// Calculate Total Payment
function calculateTotalPayment() {
    const amounts = document.querySelectorAll('.split-amount');
    let total = 0;
    amounts.forEach(input => {
        total += parseFloat(input.value) || 0;
    });
    document.getElementById('totalPayment').textContent = total.toFixed(4) + ' ETH';
}

// Local Storage
function saveToLocalStorage() {
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('registeredUsers');
    if (saved) {
        registeredUsers = JSON.parse(saved);
    }
}

// Navigation
function handleNavigation(e) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute('href'));
    if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');
    }
}

// Check URL Parameters
function checkURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const batchId = urlParams.get('batch');
    if (batchId) {
        document.getElementById('trackBatchId').value = batchId;
        setTimeout(() => {
            document.querySelector('#track').scrollIntoView({ behavior: 'smooth' });
        }, 1000);
    }
}

// Utility Functions
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

console.log(' AgriChain Loaded - Contract:', CONFIG.CONTRACT_ADDRESS);