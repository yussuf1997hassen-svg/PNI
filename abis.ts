/**
 * Minimal ABIs for the scaffold contracts.
 * Keep these small; when you add features, expand deliberately.
 */

export const seeAbi = [
  { type: "function", name: "name", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { type: "function", name: "symbol", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { type: "function", name: "decimals", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] },
  { type: "function", name: "cap", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },

  { type: "function", name: "balanceOf", stateMutability: "view", inputs: [{ type: "address", name: "a" }], outputs: [{ type: "uint256" }] },
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [{ type: "address", name: "owner" }, { type: "address", name: "spender" }],
    outputs: [{ type: "uint256" }],
  },
  { type: "function", name: "approve", stateMutability: "nonpayable", inputs: [{ type: "address", name: "spender" }, { type: "uint256", name: "amount" }], outputs: [{ type: "bool" }] },

  // Admin controls
  { type: "function", name: "pause", stateMutability: "nonpayable", inputs: [], outputs: [] },
  { type: "function", name: "unpause", stateMutability: "nonpayable", inputs: [], outputs: [] },
  { type: "function", name: "blacklistEnabled", stateMutability: "view", inputs: [], outputs: [{ type: "bool" }] },
  { type: "function", name: "setBlacklistEnabled", stateMutability: "nonpayable", inputs: [{ type: "bool", name: "enabled" }], outputs: [] },
  { type: "function", name: "blacklisted", stateMutability: "view", inputs: [{ type: "address", name: "user" }], outputs: [{ type: "bool" }] },
  { type: "function", name: "setBlacklisted", stateMutability: "nonpayable", inputs: [{ type: "address", name: "user" }, { type: "bool", name: "isBlacklisted" }], outputs: [] },

  // AccessControl
  { type: "function", name: "hasRole", stateMutability: "view", inputs: [{ type: "bytes32", name: "role" }, { type: "address", name: "account" }], outputs: [{ type: "bool" }] },

  // Events
  { type: "event", name: "Transfer", inputs: [{ indexed: true, name: "from", type: "address" }, { indexed: true, name: "to", type: "address" }, { indexed: false, name: "value", type: "uint256" }], anonymous: false },
  { type: "event", name: "Approval", inputs: [{ indexed: true, name: "owner", type: "address" }, { indexed: true, name: "spender", type: "address" }, { indexed: false, name: "value", type: "uint256" }], anonymous: false },
] as const;

export const vaultAbi = [
  { type: "function", name: "see", stateMutability: "view", inputs: [], outputs: [{ type: "address" }] },
  { type: "function", name: "depositUsed", stateMutability: "view", inputs: [{ type: "bytes32", name: "depositId" }], outputs: [{ type: "bool" }] },
  { type: "function", name: "redeemUsed", stateMutability: "view", inputs: [{ type: "bytes32", name: "redeemId" }], outputs: [{ type: "bool" }] },

  { type: "function", name: "mintOnDeposit", stateMutability: "nonpayable", inputs: [{ type: "bytes32", name: "depositId" }, { type: "address", name: "to" }, { type: "uint256", name: "amount" }], outputs: [] },
  { type: "function", name: "burnOnRedeem", stateMutability: "nonpayable", inputs: [{ type: "bytes32", name: "redeemId" }, { type: "address", name: "from" }, { type: "uint256", name: "amount" }], outputs: [] },

  // AccessControl
  { type: "function", name: "hasRole", stateMutability: "view", inputs: [{ type: "bytes32", name: "role" }, { type: "address", name: "account" }], outputs: [{ type: "bool" }] },

  // Events
  { type: "event", name: "MintOnDeposit", inputs: [{ indexed: true, name: "depositId", type: "bytes32" }, { indexed: true, name: "to", type: "address" }, { indexed: false, name: "amount", type: "uint256" }], anonymous: false },
  { type: "event", name: "BurnOnRedeem", inputs: [{ indexed: true, name: "redeemId", type: "bytes32" }, { indexed: true, name: "from", type: "address" }, { indexed: false, name: "amount", type: "uint256" }], anonymous: false },
] as const;

export const controllerAbi = [
  {
    type: "function",
    name: "setSessionKey",
    stateMutability: "nonpayable",
    inputs: [
      { type: "address", name: "key" },
      { type: "bool", name: "enabled" },
      { type: "uint64", name: "expiresAt" },
      { type: "uint256", name: "dailyMintCap" },
      { type: "uint256", name: "dailyBurnCap" },
      { type: "bool", name: "enforceRecipientAllowlist" },
    ],
    outputs: [],
  },
  { type: "function", name: "sessionKeys", stateMutability: "view", inputs: [{ type: "address", name: "key" }], outputs: [
      { type: "bool", name: "enabled" },
      { type: "uint64", name: "expiresAt" },
      { type: "uint256", name: "dailyMintCap" },
      { type: "uint256", name: "dailyBurnCap" },
      { type: "bool", name: "enforceRecipientAllowlist" },
    ] 
  },
  { type: "function", name: "setRecipientAllowed", stateMutability: "nonpayable", inputs: [{ type: "address", name: "key" }, { type: "address", name: "recipient" }, { type: "bool", name: "allowed" }], outputs: [] },
  { type: "function", name: "allowedRecipients", stateMutability: "view", inputs: [{ type: "address", name: "key" }, { type: "address", name: "recipient" }], outputs: [{ type: "bool" }] },
  { type: "function", name: "hasRole", stateMutability: "view", inputs: [{ type: "bytes32", name: "role" }, { type: "address", name: "account" }], outputs: [{ type: "bool" }] },
] as const;
