export type SeeAddresses = {
  token?: `0x${string}`;
  vault?: `0x${string}`;
  controller?: `0x${string}`;
};

function asAddr(v?: string): `0x${string}` | undefined {
  if (!v) return undefined;
  const s = v.trim();
  if (!s.startsWith("0x") || s.length !== 42) return undefined;
  return s as `0x${string}`;
}

export function getSeeAddresses(chainId?: number): SeeAddresses {
  // Explicit, static env access (Next inlines these safely).
  if (chainId === 31337) {
    return {
      token: asAddr(process.env.NEXT_PUBLIC_SEE_TOKEN_ADDRESS_31337),
      vault: asAddr(process.env.NEXT_PUBLIC_SEE_VAULT_ADDRESS_31337),
      controller: asAddr(process.env.NEXT_PUBLIC_SEE_INTENT_CONTROLLER_ADDRESS_31337),
    };
  }
  if (chainId === 1) {
    return {
      token: asAddr(process.env.NEXT_PUBLIC_SEE_TOKEN_ADDRESS_1),
      vault: asAddr(process.env.NEXT_PUBLIC_SEE_VAULT_ADDRESS_1),
      controller: asAddr(process.env.NEXT_PUBLIC_SEE_INTENT_CONTROLLER_ADDRESS_1),
    };
  }
  if (chainId === 8453) {
    return {
      token: asAddr(process.env.NEXT_PUBLIC_SEE_TOKEN_ADDRESS_8453),
      vault: asAddr(process.env.NEXT_PUBLIC_SEE_VAULT_ADDRESS_8453),
      controller: asAddr(process.env.NEXT_PUBLIC_SEE_INTENT_CONTROLLER_ADDRESS_8453),
    };
  }
  if (chainId === 42161) {
    return {
      token: asAddr(process.env.NEXT_PUBLIC_SEE_TOKEN_ADDRESS_42161),
      vault: asAddr(process.env.NEXT_PUBLIC_SEE_VAULT_ADDRESS_42161),
      controller: asAddr(process.env.NEXT_PUBLIC_SEE_INTENT_CONTROLLER_ADDRESS_42161),
    };
  }

  // Fallback (single-network deployments)
  return {
    token: asAddr(process.env.NEXT_PUBLIC_SEE_TOKEN_ADDRESS),
    vault: asAddr(process.env.NEXT_PUBLIC_SEE_VAULT_ADDRESS),
    controller: asAddr(process.env.NEXT_PUBLIC_SEE_INTENT_CONTROLLER_ADDRESS),
  };
}
