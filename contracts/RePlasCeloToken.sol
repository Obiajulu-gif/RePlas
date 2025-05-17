// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title RePlasCeloToken
 * @dev ERC20 token for the RePlas platform on Celo
 */
contract RePlasCeloToken is ERC20, AccessControl, Pausable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    
    // Events
    event RewardDistributed(address indexed to, string role, uint256 amount, string metadata);
    
    // Reward rates per role (can be updated by admin)
    mapping(string => uint256) public rewardRates;
    
    // Total rewards distributed
    uint256 public totalRewardsDistributed;
    
    /**
     * @dev Constructor
     * @param name Token name
     * @param symbol Token symbol
     * @param initialSupply Initial token supply
     */
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        _setupRole(PAUSER_ROLE, msg.sender);
        
        // Mint initial supply to deployer
        _mint(msg.sender, initialSupply * 10**decimals());
        
        // Set default reward rates
        rewardRates["consumer"] = 1;
        rewardRates["producer"] = 2;
        rewardRates["recycler"] = 3;
    }
    
    /**
     * @dev Distributes rewards to a user based on their role
     * @param to Address to receive rewards
     * @param role User role (consumer, producer, recycler)
     * @param amount Base amount of tokens to distribute
     * @param metadata Additional information about the reward
     * @return success Whether the distribution was successful
     */
    function distributeRewards(
        address to,
        string memory role,
        uint256 amount,
        string memory metadata
    ) external returns (bool) {
        require(hasRole(MINTER_ROLE, msg.sender), "Must have minter role");
        require(to != address(0), "Cannot distribute to zero address");
        require(bytes(role).length > 0, "Role cannot be empty");
        
        // Apply role-based multiplier
        uint256 roleRate = rewardRates[role];
        if (roleRate == 0) {
            roleRate = 1; // Default multiplier if role not found
        }
        
        uint256 adjustedAmount = amount * roleRate;
        
        // Mint tokens to recipient
        _mint(to, adjustedAmount);
        
        // Update total rewards
        totalRewardsDistributed += adjustedAmount;
        
        // Emit event
        emit RewardDistributed(to, role, adjustedAmount, metadata);
        
        return true;
    }
    
    /**
     * @dev Updates the reward rate for a specific role
     * @param role User role
     * @param rate New reward rate
     */
    function updateRewardRate(string memory role, uint256 rate) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Must have admin role");
        require(bytes(role).length > 0, "Role cannot be empty");
        require(rate > 0, "Rate must be greater than 0");
        
        rewardRates[role] = rate;
    }
    
    /**
     * @dev Pauses token transfers
     */
    function pause() external {
        require(hasRole(PAUSER_ROLE, msg.sender), "Must have pauser role");
        _pause();
    }
    
    /**
     * @dev Unpauses token transfers
     */
    function unpause() external {
        require(hasRole(PAUSER_ROLE, msg.sender), "Must have pauser role");
        _unpause();
    }
    
    /**
     * @dev Hook that is called before any transfer of tokens
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
}
