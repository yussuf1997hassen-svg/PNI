
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * i👁️ (IEye) — ERC20 with:
 * - Fixed supply minted at deploy (no inflation)
 * - Optional burns (holder-initiated)
 * - Pause (role-gated)
 * - Optional blacklist (role-gated toggle)
 *
 * NOTE: This is a scaffold. Review and audit before production.
 */
contract IEyeToken is ERC20, ERC20Burnable, Pausable, AccessControl {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant BLACKLIST_ROLE = keccak256("BLACKLIST_ROLE");

    // Optional blacklist switch
    bool public blacklistEnabled;
    mapping(address => bool) public blacklisted;

    constructor(
        address admin,
        uint256 fixedSupplyWei, // supply in smallest units (e.g., 12e18...)
        bool _blacklistEnabled
    ) ERC20("i👁️", "i👁️") {
        require(admin != address(0), "admin=0");
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
        _grantRole(BLACKLIST_ROLE, admin);

        blacklistEnabled = _blacklistEnabled;

        _mint(admin, fixedSupplyWei);
    }

    function pause() external onlyRole(PAUSER_ROLE) { _pause(); }
    function unpause() external onlyRole(PAUSER_ROLE) { _unpause(); }

    function setBlacklistEnabled(bool enabled) external onlyRole(DEFAULT_ADMIN_ROLE) {
        blacklistEnabled = enabled;
    }

    function setBlacklisted(address user, bool isBlacklisted) external onlyRole(BLACKLIST_ROLE) {
        blacklisted[user] = isBlacklisted;
    }

    function _update(address from, address to, uint256 value) internal override whenNotPaused {
        if (blacklistEnabled) {
            require(!blacklisted[from], "from blacklisted");
            require(!blacklisted[to], "to blacklisted");
        }
        super._update(from, to, value);
    }
}
