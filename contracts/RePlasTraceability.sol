// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title RePlasTraceability
 * @dev Contract for tracking plastic waste batches on the Celo blockchain
 */
contract RePlasTraceability is AccessControl, Pausable {
    bytes32 public constant PRODUCER_ROLE = keccak256("PRODUCER_ROLE");
    bytes32 public constant RECYCLER_ROLE = keccak256("RECYCLER_ROLE");
    bytes32 public constant CONSUMER_ROLE = keccak256("CONSUMER_ROLE");
    
    // Plastic batch struct
    struct PlasticBatch {
        string batchId;
        uint256 weight;
        string plasticType;
        address producer;
        uint256 timestamp;
        address[] consumers;
        address[] recyclers;
        string status;
    }
    
    // Mapping from batch ID to batch data
    mapping(string => PlasticBatch) public batches;
    
    // Array of all batch IDs
    string[] public allBatchIds;
    
    // Events
    event BatchLogged(string batchId, uint256 weight, string plasticType, address producer);
    event ConsumerLinked(string batchId, address consumer);
    event RecyclerLinked(string batchId, address recycler);
    event BatchStatusUpdated(string batchId, string status);
    
    /**
     * @dev Constructor
     */
    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    /**
     * @dev Logs a new plastic batch
     * @param batchId Unique identifier for the batch
     * @param weight Weight of the batch in grams
     * @param plasticType Type of plastic (e.g., PET, HDPE)
     * @return success Whether the batch was logged successfully
     */
    function logPlasticBatch(
        string memory batchId,
        uint256 weight,
        string memory plasticType
    ) external returns (bool) {
        require(
            hasRole(PRODUCER_ROLE, msg.sender) || hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Must have producer or admin role"
        );
        require(bytes(batchId).length > 0, "Batch ID cannot be empty");
        require(weight > 0, "Weight must be greater than 0");
        require(bytes(plasticType).length > 0, "Plastic type cannot be empty");
        require(batches[batchId].timestamp == 0, "Batch ID already exists");
        
        // Create new batch
        PlasticBatch storage newBatch = batches[batchId];
        newBatch.batchId = batchId;
        newBatch.weight = weight;
        newBatch.plasticType = plasticType;
        newBatch.producer = msg.sender;
        newBatch.timestamp = block.timestamp;
        newBatch.status = "pending";
        
        // Add to array of all batch IDs
        allBatchIds.push(batchId);
        
        // Emit event
        emit BatchLogged(batchId, weight, plasticType, msg.sender);
        
        return true;
    }
    
    /**
     * @dev Links a consumer to a batch
     * @param batchId Batch ID to link to
     * @return success Whether the consumer was linked successfully
     */
    function linkConsumerToBatch(string memory batchId) external returns (bool) {
        require(
            hasRole(CONSUMER_ROLE, msg.sender) || hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Must have consumer or admin role"
        );
        require(batches[batchId].timestamp > 0, "Batch does not exist");
        
        PlasticBatch storage batch = batches[batchId];
        
        // Check if consumer is already linked
        bool alreadyLinked = false;
        for (uint256 i = 0; i < batch.consumers.length; i++) {
            if (batch.consumers[i] == msg.sender) {
                alreadyLinked = true;
                break;
            }
        }
        
        require(!alreadyLinked, "Consumer already linked to this batch");
        
        // Link consumer
        batch.consumers.push(msg.sender);
        
        // Emit event
        emit ConsumerLinked(batchId, msg.sender);
        
        return true;
    }
    
    /**
     * @dev Links a recycler to a batch
     * @param batchId Batch ID to link to
     * @return success Whether the recycler was linked successfully
     */
    function linkRecyclerToBatch(string memory batchId) external returns (bool) {
        require(
            hasRole(RECYCLER_ROLE, msg.sender) || hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Must have recycler or admin role"
        );
        require(batches[batchId].timestamp > 0, "Batch does not exist");
        
        PlasticBatch storage batch = batches[batchId];
        
        // Check if recycler is already linked
        bool alreadyLinked = false;
        for (uint256 i = 0; i < batch.recyclers.length; i++) {
            if (batch.recyclers[i] == msg.sender) {
                alreadyLinked = true;
                break;
            }
        }
        
        require(!alreadyLinked, "Recycler already linked to this batch");
        
        // Link recycler
        batch.recyclers.push(msg.sender);
        
        // Emit event
        emit RecyclerLinked(batchId, msg.sender);
        
        return true;
    }
    
    /**
     * @dev Updates the status of a batch
     * @param batchId Batch ID to update
     * @param status New status
     * @return success Whether the status was updated successfully
     */
    function updateBatchStatus(string memory batchId, string memory status) external returns (bool) {
        require(
            hasRole(RECYCLER_ROLE, msg.sender) || 
            hasRole(PRODUCER_ROLE, msg.sender) || 
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Must have recycler, producer, or admin role"
        );
        require(batches[batchId].timestamp > 0, "Batch does not exist");
        require(bytes(status).length > 0, "Status cannot be empty");
        
        PlasticBatch storage batch = batches[batchId];
        
        // Update status
        batch.status = status;
        
        // Emit event
        emit BatchStatusUpdated(batchId, status);
        
        return true;
    }
    
    /**
     * @dev Gets information about a batch
     * @param batchId Batch ID to query
     * @return Batch information
     */
    function getBatchInfo(string memory batchId) external view returns (
        string memory,
        uint256,
        string memory,
        address,
        uint256,
        address[] memory,
        address[] memory,
        string memory
    ) {
        require(batches[batchId].timestamp > 0, "Batch does not exist");
        
        PlasticBatch storage batch = batches[batchId];
        
        return (
            batch.batchId,
            batch.weight,
            batch.plasticType,
            batch.producer,
            batch.timestamp,
            batch.consumers,
            batch.recyclers,
            batch.status
        );
    }
    
    /**
     * @dev Gets the total number of batches
     * @return Total number of batches
     */
    function getTotalBatches() external view returns (uint256) {
        return allBatchIds.length;
    }
    
    /**
     * @dev Gets a batch ID by index
     * @param index Index in the array
     * @return Batch ID
     */
    function getBatchIdByIndex(uint256 index) external view returns (string memory) {
        require(index < allBatchIds.length, "Index out of bounds");
        return allBatchIds[index];
    }
    
    /**
     * @dev Grants a role to an account
     * @param role Role to grant
     * @param account Account to grant role to
     */
    function grantRoleTo(bytes32 role, address account) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Must have admin role");
        grantRole(role, account);
    }
    
    /**
     * @dev Pauses the contract
     */
    function pause() external {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Must have admin role");
        _pause();
    }
    
    /**
     * @dev Unpauses the contract
     */
    function unpause() external {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Must have admin role");
        _unpause();
    }
}
