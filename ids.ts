import { keccak256, toHex } from "viem";

/**
 * Matches token-evm scripts:
 *   depositId = keccak256(utf8(depositRef))
 *   redeemId  = keccak256(utf8(redeemRef))
 */
export function idFromRef(ref: string): `0x${string}` {
  return keccak256(toHex(ref));
}
