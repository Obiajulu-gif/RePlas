// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title RePlasEscrow
 * @dev Escrow contract for payment settlement between recyclers and producers
 */
contract RePlasEscrow is AccessControl, ReentrancyGuard {
    bytes32 public constant PRODUCER_ROLE = keccak256("PRODUCER_ROLE");
    bytes32 public constant RECYCLER_ROLE = keccak256("RECYCLER_ROLE");
    bytes32 public constant ARBITER_ROLE = keccak256("ARBITER_ROLE");
    
    // Payment struct
    struct Payment {
        uint256 id;
        address producer;
        address recycler;
        uint256 amount;
        string batchId;
        string description;
        bool released;
        bool disputed;
        uint256 createdAt;
    }
    
    // Dispute struct
    struct Dispute {
        uint256 paymentId;
        string reason;
        address initiator;
        bool resolved;
        string resolution;
    }
    
    // State variables
    IERC20 public token;
    uint256 private _paymentIdCounter;
    
    // Mappings
    mapping(uint256 => Payment) public payments;
    mapping(uint256 => Dispute) public disputes;
    mapping(string => uint256[]) public batchPayments;
    
    // Events
    event PaymentCreated(
        uint256 paymentId,
        address producer,
        address recycler,
        uint256 amount,
        string batchId
    );
    event PaymentReleased(uint256 paymentId);
    event DisputeRaised(uint256 paymentId, string reason);
    event DisputeResolved(uint256 paymentId, string resolution);
    
    /**
     * @dev Constructor
     * @param _token Address of the ERC20 token used for payments
     */
    constructor(address _token) {
        require(_token != address(0), "Token address cannot be zero");
        token = IERC20(_token);
        
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ARBITER_ROLE, msg.sender);
    }
    
    /**
     * @dev Creates a new payment
     * @param recycler Address of the recycler
     * @param amount Amount to pay
     * @param batchId Batch ID associated with the payment
     * @param description Description of the payment
     * @return paymentId ID of the created payment
     */
    function createPayment(
        address recycler,
        uint256 amount,
        string memory batchId,
        string memory description
    ) external nonReentrant returns (uint256) {
        require(hasRole(PRODUCER_ROLE, msg.sender), "Must have producer role");
        require(recycler != address(0), "Recycler address cannot be zero");
        require(amount > 0, "Amount must be greater than 0");
        require(bytes(batchId).length > 0, "Batch ID cannot be empty");
        
        // Transfer tokens from producer to contract
        require(
            token.transferFrom(msg.sender, address(this), amount),
            "Token transfer failed"
        );
        
        // Create payment
        uint256 paymentId = _paymentIdCounter++;
        
        payments[paymentId] = Payment({
            id: paymentId,
            producer: msg.sender,
            recycler: recycler,
            amount: amount,
            batchId: batchId,
            description: description,
            released: false,
            disputed: false,
            createdAt: block.timestamp
        });
        
        // Add to batch payments
        batchPayments[batchId].push(paymentId);
        
        // Emit event
        emit PaymentCreated(paymentId, msg.sender, recycler, amount, batchId);
        
        return paymentId;
    }
    
    /**
     * @dev Releases a payment to the recycler
     * @param paymentId ID of the payment to release
     */
    function releasePayment(uint256 paymentId) external nonReentrant {
        Payment storage payment = payments[paymentId];
        
        require(
            msg.sender == payment.producer || hasRole(ARBITER_ROLE, msg.sender),
            "Must be producer or arbiter"
        );
        require(!payment.released, "Payment already released");
        require(!payment.disputed, "Payment is disputed");
        
        // Mark as released
        payment.released = true;
        
        // Transfer tokens to recycler
        require(
            token.transfer(payment.recycler, payment.amount),
            "Token transfer failed"
        );
        
        // Emit event
        emit PaymentReleased(paymentId);
    }
    
    /**
     * @dev Raises a dispute for a payment
     * @param paymentId ID of the payment to dispute
     * @param reason Reason for the dispute
     */
    function raiseDispute(uint256 paymentId, string memory reason) external {
        Payment storage payment = payments[paymentId];
        
        require(
            msg.sender == payment.producer || msg.sender == payment.recycler,
            "Must be producer or recycler"
        );
        require(!payment.released, "Payment already released");
        require(!payment.disputed, "Payment already disputed");
        require(bytes(reason).length > 0, "Reason cannot be empty");
        
        // Mark as disputed
        payment.disputed = true;
        
        // Create dispute
        disputes[paymentId] = Dispute({
            paymentId: paymentId,
            reason: reason,
            initiator: msg.sender,
            resolved: false,
            resolution: ""
        });
        
        // Emit event
        emit DisputeRaised(paymentId, reason);
    }
    
    /**
     * @dev Resolves a dispute
     * @param paymentId ID of the payment with the dispute
     * @param resolution Resolution description
     * @param releaseToRecycler Whether to release the payment to the recycler
     */
    function resolveDispute(
        uint256 paymentId,
        string memory resolution,
        bool releaseToRecycler
    ) external nonReentrant {
        require(hasRole(ARBITER_ROLE, msg.sender), "Must have arbiter role");
        
        Payment storage payment = payments[paymentId];
        Dispute storage dispute = disputes[paymentId];
        
        require(payment.disputed, "Payment not disputed");
        require(!dispute.resolved, "Dispute already resolved");
        require(bytes(resolution).length > 0, "Resolution cannot be empty");
        
        // Mark dispute as resolved
        dispute.resolved = true;
        dispute.resolution = resolution;
        
        // If releasing to recycler
        if (releaseToRecycler) {
            payment.released = true;
            
            // Transfer tokens to recycler
            require(
                token.transfer(payment.recycler, payment.amount),
                "Token transfer failed"
            );
        } else {
            // Return tokens to producer
            require(
                token.transfer(payment.producer, payment.amount),
                "Token transfer failed"
            );
        }
        
        // Emit event
        emit DisputeResolved(paymentId, resolution);
    }
    
    /**
     * @dev Gets payment details
     * @param paymentId Payment ID to query
     * @return Payment details
     */
    function getPayment(uint256 paymentId) external view returns (
        uint256,
        address,
        address,
        uint256,
        string memory,
        string memory,
        bool,
        bool,
        uint256
    ) {
        Payment storage payment = payments[paymentId];
        
        return (
            payment.id,
            payment.producer,
            payment.recycler,
            payment.amount,
            payment.batchId,
            payment.description,
            payment.released,
            payment.disputed,
            payment.createdAt
        );
    }
    
    /**
     * @dev Gets dispute details
     * @param paymentId Payment ID to query
     * @return Dispute details
     */
    function getDispute(uint256 paymentId) external view returns (
        uint256,
        string memory,
        address,
        bool,
        string memory
    ) {
        Dispute storage dispute = disputes[paymentId];
        
        return (
            dispute.paymentId,
            dispute.reason,
            dispute.initiator,
            dispute.resolved,
            dispute.resolution
        );
    }
    
    /**
     * @dev Gets payment IDs for a batch
     * @param batchId Batch ID to query
     * @return Array of payment IDs
     */
    function getPaymentsForBatch(string memory batchId) external view returns (uint256[] memory) {
        return batchPayments[batchId];
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
}
