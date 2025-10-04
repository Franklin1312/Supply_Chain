// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SupplyChain is AccessControl, ReentrancyGuard {
    bytes32 public constant FARMER_ROLE = keccak256("FARMER_ROLE");
    bytes32 public constant TRANSPORT_ROLE = keccak256("TRANSPORT_ROLE");
    bytes32 public constant MIDDLEMAN_ROLE = keccak256("MIDDLEMAN_ROLE");
    bytes32 public constant RETAILER_ROLE = keccak256("RETAILER_ROLE");
    
    enum BatchState { Created, InTransit, AtMiddleman, InFinalTransit, Delivered, Sold }
    
    struct Transaction {
        address from;
        address to;
        uint256 amount;
        uint256 timestamp;
        string role; // "farmer", "transporter", "middleman", "retailer"
        string description;
    }
    
    struct Batch {
        uint256 id;
        address farmer;
        address currentOwner;
        string productName;
        string ipfsHash; // Stores detailed product info (origin, certifications, etc)
        uint256 farmerPrice;
        uint256 quantity;
        BatchState state;
        uint256 createdAt;
        bool exists;
        Transaction[] transactions;
    }
    
    struct PaymentSplit {
        address payee;
        uint256 amount;
        string role;
    }
    
    mapping(uint256 => Batch) public batches;
    mapping(uint256 => address[]) public batchParticipants; // Track all participants
    uint256 public nextBatchId;
    
    // Events
    event BatchCreated(
        uint256 indexed batchId, 
        address indexed farmer, 
        string productName,
        string ipfsHash, 
        uint256 farmerPrice,
        uint256 quantity
    );
    
    event BatchPurchased(
        uint256 indexed batchId, 
        address indexed from, 
        address indexed to, 
        uint256 totalAmount,
        PaymentSplit[] splits
    );
    
    event BatchTransferred(
        uint256 indexed batchId, 
        address indexed from, 
        address indexed to, 
        BatchState state
    );
    
    event BatchStateUpdated(uint256 indexed batchId, BatchState state);
    
    event TransactionRecorded(
        uint256 indexed batchId,
        address indexed from,
        address indexed to,
        uint256 amount,
        string role
    );
    
    constructor(address admin) {
    _grantRole(DEFAULT_ADMIN_ROLE, admin);  // ← MODERN
}
    
    /**
     * @dev Farmer creates a new batch of products
     */
    function createBatch(
        string calldata productName,
        string calldata ipfsHash, 
        uint256 farmerPrice,
        uint256 quantity
    ) external onlyRole(FARMER_ROLE) returns (uint256) {
        require(bytes(productName).length > 0, "Product name required");
        require(bytes(ipfsHash).length > 0, "IPFS hash required");
        require(farmerPrice > 0, "Price must be positive");
        require(quantity > 0, "Quantity must be positive");
        
        uint256 id = nextBatchId++;
        Batch storage batch = batches[id];
        
        batch.id = id;
        batch.farmer = msg.sender;
        batch.currentOwner = msg.sender;
        batch.productName = productName;
        batch.ipfsHash = ipfsHash;
        batch.farmerPrice = farmerPrice;
        batch.quantity = quantity;
        batch.state = BatchState.Created;
        batch.createdAt = block.timestamp;
        batch.exists = true;
        
        batchParticipants[id].push(msg.sender);
        
        emit BatchCreated(id, msg.sender, productName, ipfsHash, farmerPrice, quantity);
        
        return id;
    }
    
    /**
     * @dev Purchase batch with automatic payment distribution
     * @param batchId The ID of the batch to purchase
     * @param splits Array of payment distributions (transporter, middlemen, etc)
     */
    function purchaseBatch(
        uint256 batchId,
        PaymentSplit[] calldata splits
    ) external payable nonReentrant {
        Batch storage batch = batches[batchId];
        require(batch.exists, "Batch not found");
        require(batch.currentOwner != msg.sender, "Cannot purchase own batch");
        
        // Calculate total payment and validate
        uint256 totalSplits = 0;
        for (uint256 i = 0; i < splits.length; i++) {
            totalSplits += splits[i].amount;
        }
        require(msg.value == totalSplits, "Payment mismatch");
        require(msg.value >= batch.farmerPrice, "Payment below farmer price");
        
        // Distribute payments
        for (uint256 i = 0; i < splits.length; i++) {
            (bool success, ) = splits[i].payee.call{value: splits[i].amount}("");
            require(success, "Payment failed");
            
            // Record transaction
            batch.transactions.push(Transaction({
                from: msg.sender,
                to: splits[i].payee,
                amount: splits[i].amount,
                timestamp: block.timestamp,
                role: splits[i].role,
                description: string(abi.encodePacked("Payment to ", splits[i].role))
            }));
            
            // Track participant
            if (!isParticipant(batchId, splits[i].payee)) {
                batchParticipants[batchId].push(splits[i].payee);
            }
            
            emit TransactionRecorded(batchId, msg.sender, splits[i].payee, splits[i].amount, splits[i].role);
        }
        
        address previousOwner = batch.currentOwner;
        batch.currentOwner = msg.sender;
        
        // Update state based on buyer role
        if (hasRole(MIDDLEMAN_ROLE, msg.sender)) {
            batch.state = BatchState.AtMiddleman;
        } else if (hasRole(RETAILER_ROLE, msg.sender)) {
            batch.state = BatchState.InFinalTransit;
        }
        
        if (!isParticipant(batchId, msg.sender)) {
            batchParticipants[batchId].push(msg.sender);
        }
        
        emit BatchPurchased(batchId, previousOwner, msg.sender, msg.value, splits);
        emit BatchStateUpdated(batchId, batch.state);
    }
    
    /**
     * @dev Update batch state (for transporters and owners)
     */
    function updateBatchState(uint256 batchId, BatchState newState) external {
        Batch storage batch = batches[batchId];
        require(batch.exists, "Batch not found");
        require(
            hasRole(TRANSPORT_ROLE, msg.sender) || batch.currentOwner == msg.sender,
            "Not authorized"
        );
        require(batch.state != newState, "State already set");
        
        // Validate state transitions
        if (newState == BatchState.InTransit) {
            require(batch.state == BatchState.Created, "Invalid transition");
        } else if (newState == BatchState.AtMiddleman) {
            require(batch.state == BatchState.InTransit, "Invalid transition");
        } else if (newState == BatchState.InFinalTransit) {
            require(
                batch.state == BatchState.AtMiddleman || batch.state == BatchState.InTransit,
                "Invalid transition"
            );
        } else if (newState == BatchState.Delivered) {
            require(batch.state == BatchState.InFinalTransit, "Invalid transition");
        } else if (newState == BatchState.Sold) {
            require(batch.state == BatchState.Delivered, "Invalid transition");
        }
        
        batch.state = newState;
        
        // Record state change transaction
        batch.transactions.push(Transaction({
            from: msg.sender,
            to: batch.currentOwner,
            amount: 0,
            timestamp: block.timestamp,
            role: hasRole(TRANSPORT_ROLE, msg.sender) ? "transporter" : "owner",
            description: string(abi.encodePacked("State updated to ", uint2str(uint256(newState))))
        }));
        
        emit BatchStateUpdated(batchId, newState);
    }
    
    /**
     * @dev Transfer ownership (for internal transfers)
     */
    function transferOwnership(uint256 batchId, address to) external {
        Batch storage batch = batches[batchId];
        require(batch.exists, "Batch not found");
        require(batch.currentOwner == msg.sender, "Not batch owner");
        require(to != address(0), "Invalid address");
        
        address previousOwner = batch.currentOwner;
        batch.currentOwner = to;
        
        if (!isParticipant(batchId, to)) {
            batchParticipants[batchId].push(to);
        }
        
        emit BatchTransferred(batchId, previousOwner, to, batch.state);
    }
    
    /**
     * @dev Get complete batch information (for QR code scanning)
     */
    function getBatch(uint256 batchId) external view returns (
        uint256 id,
        address farmer,
        address currentOwner,
        string memory productName,
        string memory ipfsHash,
        uint256 farmerPrice,
        uint256 quantity,
        BatchState state,
        uint256 createdAt,
        uint256 transactionCount
    ) {
        Batch storage batch = batches[batchId];
        require(batch.exists, "Batch not found");
        
        return (
            batch.id,
            batch.farmer,
            batch.currentOwner,
            batch.productName,
            batch.ipfsHash,
            batch.farmerPrice,
            batch.quantity,
            batch.state,
            batch.createdAt,
            batch.transactions.length
        );
    }
    
    /**
     * @dev Get all transactions for a batch (complete journey)
     */
    function getBatchTransactions(uint256 batchId) external view returns (Transaction[] memory) {
        require(batches[batchId].exists, "Batch not found");
        return batches[batchId].transactions;
    }
    
    /**
     * @dev Get all participants in the supply chain for a batch
     */
    function getBatchParticipants(uint256 batchId) external view returns (address[] memory) {
        require(batches[batchId].exists, "Batch not found");
        return batchParticipants[batchId];
    }
    
    /**
     * @dev Get farmer's received amount from batch
     */
    function getFarmerPayment(uint256 batchId) external view returns (uint256) {
        Batch storage batch = batches[batchId];
        require(batch.exists, "Batch not found");
        
        uint256 total = 0;
        for (uint256 i = 0; i < batch.transactions.length; i++) {
            if (batch.transactions[i].to == batch.farmer) {
                total += batch.transactions[i].amount;
            }
        }
        return total;
    }
    
    /**
     * @dev Check if address is a participant
     */
    function isParticipant(uint256 batchId, address addr) internal view returns (bool) {
        address[] storage participants = batchParticipants[batchId];
        for (uint256 i = 0; i < participants.length; i++) {
            if (participants[i] == addr) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * @dev Helper function to convert uint to string
     */
    function uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
    
    /**
     * @dev Grant role to user (only admin)
     */
    function grantUserRole(address user, bytes32 role) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(role, user);
    }
}