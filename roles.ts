import { keccak256, toHex } from "viem";

export const ROLES = {
  DEFAULT_ADMIN_ROLE: ("0x" + "00".repeat(32)) as `0x${string}`,
  ISSUER_ROLE: keccak256(toHex("ISSUER_ROLE")),
  PAUSER_ROLE: keccak256(toHex("PAUSER_ROLE")),
  MINTER_ROLE: keccak256(toHex("MINTER_ROLE")),
  BLACKLIST_ROLE: keccak256(toHex("BLACKLIST_ROLE")),
  POLICY_ADMIN_ROLE: keccak256(toHex("POLICY_ADMIN_ROLE")),
} as const;
