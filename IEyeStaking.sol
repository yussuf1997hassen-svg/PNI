
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * OPTIONAL staking scaffold.
 * This version is intentionally minimal and NOT production-ready without design decisions:
 * - reward source (pre-funded vs mint)
 * - reward rate model
 * - emergency withdraw rules
 *
 * For fixed supply tokens, rewards must come from a pre-funded pool, not minting.
 */
contract IEyeStaking is ReentrancyGuard, AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    IERC20 public immutable token;
    IERC20 public immutable rewardToken;

    // Simple accounting
    mapping(address => uint256) public staked;
    uint256 public totalStaked;

    constructor(address admin, IERC20 _token, IERC20 _rewardToken) {
        require(admin != address(0), "admin=0");
        token = _token;
        rewardToken = _rewardToken;
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
    }

    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "amount=0");
        totalStaked += amount;
        staked[msg.sender] += amount;
        require(token.transferFrom(msg.sender, address(this), amount), "transferFrom failed");
    }

    function unstake(uint256 amount) external nonReentrant {
        require(amount > 0, "amount=0");
        require(staked[msg.sender] >= amount, "insufficient");
        staked[msg.sender] -= amount;
        totalStaked -= amount;
        require(token.transfer(msg.sender, amount), "transfer failed");
    }

    // Reward mechanics intentionally omitted pending your policy decision.
}
