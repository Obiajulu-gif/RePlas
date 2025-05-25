// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title RePlasImpactNFT
 * @dev NFT contract for tokenizing verified impact
 */
contract RePlasImpactNFT is ERC721URIStorage, AccessControl {
    using Counters for Counters.Counter;
    
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    Counters.Counter private _tokenIds;
    
    // Mapping from token ID to impact data
    mapping(uint256 => ImpactData) public impactData;
    
    // Impact data struct
    struct ImpactData {
        string impactType;
        uint256 amount;
        string unit;
        string location;
        uint256 timestamp;
        string[] batchIds;
    }
    
    // Events
    event ImpactNFTMinted(
        uint256 tokenId,
        address recipient,
        string impactType,
        uint256 amount,
        string unit
    );
    
    /**
     * @dev Constructor
     * @param name NFT name
     * @param symbol NFT symbol
     */
    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
    }
    
    /**
     * @dev Mints a new impact NFT
     * @param recipient Address to receive the NFT
     * @param tokenURI URI for token metadata
     * @param impactType Type of impact (e.g., "CO2 Offset", "Plastic Recycled")
     * @param amount Amount of impact
     * @param unit Unit of measurement (e.g., "kg", "tons")
     * @param location Location of impact
     * @param batchIds Array of batch IDs associated with this impact
     * @return tokenId ID of the minted token
     */
    function mintImpactNFT(
        address recipient,
        string memory tokenURI,
        string memory impactType,
        uint256 amount,
        string memory unit,
        string memory location,
        string[] memory batchIds
    ) external returns (uint256) {
        require(hasRole(MINTER_ROLE, msg.sender), "Must have minter role");
        require(recipient != address(0), "Cannot mint to zero address");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _mint(recipient, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        // Store impact data
        impactData[newTokenId] = ImpactData({
            impactType: impactType,
            amount: amount,
            unit: unit,
            location: location,
            timestamp: block.timestamp,
            batchIds: batchIds
        });
        
        // Emit event
        emit ImpactNFTMinted(newTokenId, recipient, impactType, amount, unit);
        
        return newTokenId;
    }
    
    /**
     * @dev Gets impact data for a token
     * @param tokenId Token ID to query
     * @return Impact data
     */
    function getImpactData(uint256 tokenId) external view returns (
        string memory,
        uint256,
        string memory,
        string memory,
        uint256,
        string[] memory
    ) {
        require(_exists(tokenId), "Token does not exist");
        
        ImpactData storage data = impactData[tokenId];
        
        return (
            data.impactType,
            data.amount,
            data.unit,
            data.location,
            data.timestamp,
            data.batchIds
        );
    }
    
    /**
     * @dev Grants minter role to an account
     * @param account Account to grant role to
     */
    function grantMinterRole(address account) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Must have admin role");
        grantRole(MINTER_ROLE, account);
    }
    
    /**
     * @dev Required override for ERC721 + AccessControl
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
