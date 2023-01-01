// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/// @author Bahador Ghadamkheir
/// @title A sample contract for airdroping tokens
/// @notice As this contract is not audited carefully, 
/// it should be better you use this contract for experimental and educational usage
contract Airdrop is ReentrancyGuard, Context, Ownable {
    using SafeMath for uint256;
    
    mapping(address => bool) private Claimed;
    mapping(address => bool) private _isWhitelist;
    mapping(address => uint256) private _valDrop;
    
    IERC20 private _token;
    uint64 private _tokenDecimal;
    bool public airdropLive = false;
    
    event AirdropClaimed(address indexed receiver, uint256 amount);
    event WhitelistSetted(IERC20 indexed tokenAddress, address[] recipient, uint256[] amount);

    
     /// @param recipients participant's wallet addresses
     /// @param amount token amount for every participant
     function setWhitelist(address[] calldata recipients, uint256[] calldata amount) external onlyOwner {
        uint participants = recipients.length;
        for(uint i = 0; i < participants; i++){
            require(recipients[i] != address(0), "Address 0 can not be in!");
            _valDrop[recipients[i]] = amount[i];
        }
        emit WhitelistSetted(_token, recipients, amount);
    }


    /// @dev Withdraw collected funds(based on native coin of network)
    function withdraw() external onlyOwner {
        require(address(this).balance > 0, "Sry, contract has no money yet");
        address payable wallet = payable(msg.sender);
        wallet.transfer(address(this).balance);
    }


    /// @dev Start Airdrop by defining ERC20 token address and token decimal numbers
    /// @param tokenAddress the ERC20 token address
    /// @param tokenDecimal decimals numbers of the ERC20 token
    function startAirdrop(IERC20 tokenAddress, uint64 tokenDecimal) public onlyOwner {
        require(airdropLive == false, "Airdrop already started!");
        require(tokenDecimal <= 18, "Token decimals must be lower than 18");
        _token = tokenAddress;
        _tokenDecimal = tokenDecimal;
        airdropLive = true;
    }


    function stopAirdrop() public onlyOwner{
        require(airdropLive == true, "Airdrop is not running right now!");
        airdropLive = false;
    }


    /// @dev Claim tokens by participants
    function claimTokens() public nonReentrant {
        require(airdropLive == true, "Airdrop not started yet");
        require(Claimed[msg.sender] == false, "Airdrop already claimed!");
        if(_token.balanceOf(address(this)) == 0) { airdropLive = false; return;}
        Claimed[msg.sender] = true;
        uint256 amount = _valDrop[msg.sender].mul(tokenDecimals());
        _token.transfer(msg.sender, amount);
        emit AirdropClaimed(msg.sender, amount);
    }
    
    
    /// @dev Withdraw remaining tokens in the airdrop contract
    /// @param tokenAddress enter specific token address which want be taken
    function takeTokens(IERC20 tokenAddress) public onlyOwner {
        IERC20 tokenERC = tokenAddress;
        uint256 tokenAmt = tokenERC.balanceOf(address(this));
        require(tokenAmt > 0, "BEP-20 balance is 0");
        address payable wallet = payable(msg.sender);
        tokenERC.transfer(wallet, tokenAmt);
    }
    

    function tokenDecimals() public view returns (uint64) {
        return uint64(10 ** _tokenDecimal);
    }

}
