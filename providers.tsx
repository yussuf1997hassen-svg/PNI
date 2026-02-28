"use client";

import * as React from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { mainnet, arbitrum, base, hardhat } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * NOTE:
 * - This config is intentionally conservative: injected wallet only.
 * - For production, add WalletConnect with a projectId, and pin RPC URLs.
 */
const config = createConfig({
  chains: [hardhat, arbitrum, base, mainnet],
  connectors: [injected()],
  transports: {
    [hardhat.id]: http("http://127.0.0.1:8545"),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [mainnet.id]: http(),
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
