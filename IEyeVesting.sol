
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * Simple linear vesting vault:
 * - Admin deposits tokens
 * - Beneficiary claims linearly over duration after start
 *
 * NOTE: For production, consider audited vesting libs or more features.
 */
contract IEyeVesting is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    IERC20 public immutable token;
    address public immutable beneficiary;
    uint64 public immutable start;
    uint64 public immutable duration;
    uint256 public immutable totalAllocation;

    uint256 public released;

    constructor(
        address admin,
        IERC20 _token,
        address _beneficiary,
        uint64 _start,
        uint64 _duration,
        uint256 _totalAllocation
    ) {
        require(admin != address(0), "admin=0");
        require(address(_token) != address(0), "token=0");
        require(_beneficiary != address(0), "beneficiary=0");
        require(_duration > 0, "duration=0");

        token = _token;
        beneficiary = _beneficiary;
        start = _start;
        duration = _duration;
        totalAllocation = _totalAllocation;

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
    }

    function vestedAmount(uint64 timestamp) public view returns (uint256) {
        if (timestamp < start) return 0;
        if (timestamp >= start + duration) return totalAllocation;
        uint256 elapsed = timestamp - start;
        return (totalAllocation * elapsed) / duration;
    }

    function releasable() public view returns (uint256) {
        uint256 vested = vestedAmount(uint64(block.timestamp));
        if (vested <= released) return 0;
        return vested - released;
    }

    function release() external {
        require(msg.sender == beneficiary, "not beneficiary");
        uint256 amount = releasable();
        require(amount > 0, "nothing");
        released += amount;
        require(token.transfer(beneficiary, amount), "transfer failed");
    }
}
