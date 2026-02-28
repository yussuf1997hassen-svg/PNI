"use client";

import * as React from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useChainId,
  useSwitchChain,
  useReadContract,
  useWriteContract,
  usePublicClient,
} from "wagmi";
import { parseEventLogs, isAddress } from "viem";
import type { Hash } from "viem";

import { Card, Field, Input, Button, Badge } from "@/components/Card";
import { TxStatus } from "@/components/TxStatus";
import { getSeeAddresses } from "@/lib/addresses";
import { seeAbi, vaultAbi, controllerAbi } from "@/lib/abis";
import { ROLES } from "@/lib/roles";
import { idFromRef } from "@/lib/ids";
import { safeFormatUnits, safeParseUnits } from "@/lib/units";

function shortAddr(a?: string) {
  if (!a) return "-";
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

type EventRow =
  | { kind: "Transfer"; from: string; to: string; value: bigint; blockNumber: bigint }
  | { kind: "MintOnDeposit"; to: string; amount: bigint; depositId: string; blockNumber: bigint }
  | { kind: "BurnOnRedeem"; from: string; amount: bigint; redeemId: string; blockNumber: bigint };

export default function Page() {
  const chainId = useChainId();
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const publicClient = usePublicClient();
  const addrs = React.useMemo(() => getSeeAddresses(chainId), [chainId]);
  const token = addrs.token;
  const vault = addrs.vault;
  const controller = addrs.controller;

  const [approveAmount, setApproveAmount] = React.useState("0");
  const [mintTo, setMintTo] = React.useState("");
  const [mintAmount, setMintAmount] = React.useState("0");
  const [depositRef, setDepositRef] = React.useState("");
  const [burnFrom, setBurnFrom] = React.useState("");
  const [burnAmount, setBurnAmount] = React.useState("0");
  const [redeemRef, setRedeemRef] = React.useState("");

  const [sessionKey, setSessionKey] = React.useState("");
  const [sessionEnabled, setSessionEnabled] = React.useState(true);
  const [sessionExpiry, setSessionExpiry] = React.useState(""); // unix seconds
  const [sessionMintCap, setSessionMintCap] = React.useState("0");
  const [sessionBurnCap, setSessionBurnCap] = React.useState("0");
  const [sessionEnforceAllow, setSessionEnforceAllow] = React.useState(false);

  const [txHash, setTxHash] = React.useState<Hash | undefined>(undefined);

  // ---- Reads ----
  const tokenName = useReadContract({
    address: token,
    abi: seeAbi,
    functionName: "name",
    query: { enabled: !!token },
  });

  const tokenSymbol = useReadContract({
    address: token,
    abi: seeAbi,
    functionName: "symbol",
    query: { enabled: !!token },
  });

  const tokenDecimals = useReadContract({
    address: token,
    abi: seeAbi,
    functionName: "decimals",
    query: { enabled: !!token },
  });

  const decimals = Number(tokenDecimals.data ?? 18);

  const tokenBalance = useReadContract({
    address: token,
    abi: seeAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!token && !!address },
  });

  const allowance = useReadContract({
    address: token,
    abi: seeAbi,
    functionName: "allowance",
    args: address && vault ? [address, vault] : undefined,
    query: { enabled: !!token && !!vault && !!address },
  });

  const blacklistEnabled = useReadContract({
    address: token,
    abi: seeAbi,
    functionName: "blacklistEnabled",
    query: { enabled: !!token },
  });

  const youBlacklisted = useReadContract({
    address: token,
    abi: seeAbi,
    functionName: "blacklisted",
    args: address ? [address] : undefined,
    query: { enabled: !!token && !!address },
  });

  const isIssuer = useReadContract({
    address: vault,
    abi: vaultAbi,
    functionName: "hasRole",
    args: address ? [ROLES.ISSUER_ROLE, address] : undefined,
    query: { enabled: !!vault && !!address },
  });

  const isPauser = useReadContract({
    address: token,
    abi: seeAbi,
    functionName: "hasRole",
    args: address ? [ROLES.PAUSER_ROLE, address] : undefined,
    query: { enabled: !!token && !!address },
  });

  const isBlacklistAdmin = useReadContract({
    address: token,
    abi: seeAbi,
    functionName: "hasRole",
    args: address ? [ROLES.BLACKLIST_ROLE, address] : undefined,
    query: { enabled: !!token && !!address },
  });

  const isPolicyAdmin = useReadContract({
    address: controller,
    abi: controllerAbi,
    functionName: "hasRole",
    args: address ? [ROLES.POLICY_ADMIN_ROLE, address] : undefined,
    query: { enabled: !!controller && !!address },
  });

  const sessionInfo = useReadContract({
    address: controller,
    abi: controllerAbi,
    functionName: "sessionKeys",
    args: isAddress(sessionKey) ? [sessionKey as `0x${string}`] : undefined,
    query: { enabled: !!controller && isAddress(sessionKey) },
  });

  // ---- Writes ----
  const { writeContractAsync, isPending: isWriting, error: writeError } = useWriteContract();

  async function doApprove() {
    if (!token || !vault) return;
    const amt = safeParseUnits(approveAmount, decimals);
    if (amt === null) return alert("Invalid amount");
    const hash = await writeContractAsync({
      address: token,
      abi: seeAbi,
      functionName: "approve",
      args: [vault, amt],
    });
    setTxHash(hash);
  }

  async function doMintOnDeposit() {
    if (!vault) return;
    if (!depositRef.trim()) return alert("Deposit ref is required");
    const to = mintTo.trim() || address || "";
    if (!isAddress(to)) return alert("Invalid 'to' address");
    const amt = safeParseUnits(mintAmount, decimals);
    if (amt === null) return alert("Invalid amount");
    const depositId = idFromRef(depositRef.trim());
    const hash = await writeContractAsync({
      address: vault,
      abi: vaultAbi,
      functionName: "mintOnDeposit",
      args: [depositId, to as `0x${string}`, amt],
    });
    setTxHash(hash);
  }

  async function doBurnOnRedeem() {
    if (!vault) return;
    if (!redeemRef.trim()) return alert("Redeem ref is required");
    const from = burnFrom.trim() || address || "";
    if (!isAddress(from)) return alert("Invalid 'from' address");
    const amt = safeParseUnits(burnAmount, decimals);
    if (amt === null) return alert("Invalid amount");
    const redeemId = idFromRef(redeemRef.trim());
    const hash = await writeContractAsync({
      address: vault,
      abi: vaultAbi,
      functionName: "burnOnRedeem",
      args: [redeemId, from as `0x${string}`, amt],
    });
    setTxHash(hash);
  }

  async function doPause() {
    if (!token) return;
    const hash = await writeContractAsync({ address: token, abi: seeAbi, functionName: "pause" });
    setTxHash(hash);
  }

  async function doUnpause() {
    if (!token) return;
    const hash = await writeContractAsync({ address: token, abi: seeAbi, functionName: "unpause" });
    setTxHash(hash);
  }

  async function doSetBlacklistEnabled(enabled: boolean) {
    if (!token) return;
    const hash = await writeContractAsync({
      address: token,
      abi: seeAbi,
      functionName: "setBlacklistEnabled",
      args: [enabled],
    });
    setTxHash(hash);
  }

  async function doSetSessionKey() {
    if (!controller) return;
    if (!isAddress(sessionKey)) return alert("Invalid session key address");
    const expiresAt = BigInt(sessionExpiry || "0");
    const mintCap = safeParseUnits(sessionMintCap, decimals);
    const burnCap = safeParseUnits(sessionBurnCap, decimals);
    if (mintCap === null || burnCap === null) return alert("Invalid caps");
    if (expiresAt <= 0n) return alert("expiresAt must be unix seconds > 0");

    const hash = await writeContractAsync({
      address: controller,
      abi: controllerAbi,
      functionName: "setSessionKey",
      args: [
        sessionKey as `0x${string}`,
        sessionEnabled,
        expiresAt, // uint64 (prefer bigint to avoid precision loss).
        mintCap,
        burnCap,
        sessionEnforceAllow,
      ],
    });
    setTxHash(hash);
  }

  // ---- Logs (optional, lightweight) ----
  const [events, setEvents] = React.useState<EventRow[]>([]);
  const [eventsErr, setEventsErr] = React.useState<string>("");

  async function refreshEvents() {
    try {
      setEventsErr("");
      if (!publicClient || !token || !vault) return;

      const latest = await publicClient.getBlockNumber();
      const fromBlock = latest > 5000n ? latest - 5000n : 0n;

      const [tokenLogs, vaultLogs] = await Promise.all([
        publicClient.getLogs({ address: token, fromBlock, toBlock: latest }),
        publicClient.getLogs({ address: vault, fromBlock, toBlock: latest }),
      ]);

      const parsedToken = parseEventLogs({ abi: seeAbi, logs: tokenLogs, strict: false });
      const parsedVault = parseEventLogs({ abi: vaultAbi, logs: vaultLogs, strict: false });

      const rows: EventRow[] = [];

      for (const l of parsedToken) {
        if (l.eventName === "Transfer") {
          const { from, to, value } = l.args as any;
          rows.push({ kind: "Transfer", from, to, value, blockNumber: l.blockNumber! });
        }
      }
      for (const l of parsedVault) {
        if (l.eventName === "MintOnDeposit") {
          const { depositId, to, amount } = l.args as any;
          rows.push({ kind: "MintOnDeposit", depositId, to, amount, blockNumber: l.blockNumber! });
        }
        if (l.eventName === "BurnOnRedeem") {
          const { redeemId, from, amount } = l.args as any;
          rows.push({ kind: "BurnOnRedeem", redeemId, from, amount, blockNumber: l.blockNumber! });
        }
      }

      rows.sort((a, b) => Number((b.blockNumber - a.blockNumber)));
      setEvents(rows.slice(0, 25));
    } catch (e: any) {
      setEventsErr(e?.message ?? String(e));
    }
  }

  React.useEffect(() => {
    setTxHash(undefined);
  }, [chainId, address]);

  React.useEffect(() => {
    // friendly defaults
    if (address && !mintTo) setMintTo(address);
    if (address && !burnFrom) setBurnFrom(address);
  }, [address, mintTo, burnFrom]);

  const missingAddrs = !token || !vault;

  return (
    <main style={{ padding: 24, fontFamily: "ui-sans-serif, system-ui", background: "#f9fafb", minHeight: "100vh" }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>sEE — Stablecoin Scaffold Console</h1>
            <p style={{ marginTop: 8, color: "#374151" }}>
              Wallet connect + token/vault operations. Use on a devnet first; audit before mainnet.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <Badge tone={isConnected ? "ok" : "warn"}>{isConnected ? "Connected" : "Disconnected"}</Badge>
            {!isConnected ? (
              <Button onClick={() => connect({ connector: connectors[0]! })} disabled={isPending}>
                {isPending ? "Connecting…" : "Connect"}
              </Button>
            ) : (
              <Button onClick={() => disconnect()}>Disconnect</Button>
            )}
          </div>
        </header>

        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
          <Card
            title="Network"
            right={
              <Button onClick={() => switchChain({ chainId: 31337 })} disabled={isSwitching}>
                {isSwitching ? "Switching…" : "Hardhat (31337)"}
              </Button>
            }
          >
            <Field label="Address" value={<span style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>{address ?? "-"}</span>} />
            <Field label="Chain ID" value={chainId} />
            <Field label="Token" mono value={token ?? "Set env"} />
            <Field label="Vault" mono value={vault ?? "Set env"} />
            <Field label="Intent Controller" mono value={controller ?? "(optional)"} />
            {missingAddrs && (
              <div style={{ marginTop: 10, color: "#92400e", fontSize: 13 }}>
                Missing contract addresses for this chain. Copy <code>.env.local.example</code> → <code>.env.local</code>,
                paste addresses from <code>token-evm/scripts/deploy.ts</code> output, then restart <code>next dev</code>.
              </div>
            )}
          </Card>

          <Card title="Token status">
            <Field label="Name" value={tokenName.data ?? "-"} />
            <Field label="Symbol" value={tokenSymbol.data ?? "-"} />
            <Field label="Decimals" value={tokenDecimals.data?.toString() ?? "-"} />
            <Field label="Your balance" value={`${safeFormatUnits(tokenBalance.data as any, decimals)} ${tokenSymbol.data ?? ""}`} />
            <Field label="Vault allowance" value={`${safeFormatUnits(allowance.data as any, decimals)} ${tokenSymbol.data ?? ""}`} />
            <Field label="Blacklist enabled" value={blacklistEnabled.data ? <Badge tone="warn">Yes</Badge> : <Badge tone="ok">No</Badge>} />
            <Field label="You blacklisted" value={youBlacklisted.data ? <Badge tone="bad">Yes</Badge> : <Badge tone="ok">No</Badge>} />
          </Card>

          <Card title="User action: approve vault (required for redemption burn)">
            <Input label={`Amount (${tokenSymbol.data ?? "token"})`} value={approveAmount} onChange={(e) => setApproveAmount(e.target.value)} />
            <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Button onClick={doApprove} disabled={!isConnected || !token || !vault || isWriting}>
                {isWriting ? "Writing…" : "Approve"}
              </Button>
            </div>
            <TxStatus hash={txHash} />
          </Card>

          <Card title="Issuer console: mint on deposit (ISSUER_ROLE required)">
            <div style={{ marginBottom: 8 }}>
              {isIssuer.data ? <Badge tone="ok">You have ISSUER_ROLE</Badge> : <Badge tone="warn">No ISSUER_ROLE</Badge>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Input label="Deposit ref (string, must be unique)" value={depositRef} onChange={(e) => setDepositRef(e.target.value)} />
              <Input label="To address" value={mintTo} onChange={(e) => setMintTo(e.target.value)} placeholder="0x…" />
              <Input label={`Amount (${tokenSymbol.data ?? "token"})`} value={mintAmount} onChange={(e) => setMintAmount(e.target.value)} />
              <div />
            </div>

            <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Button
                onClick={doMintOnDeposit}
                disabled={!isConnected || !vault || !isIssuer.data || isWriting}
              >
                {isWriting ? "Writing…" : "Mint"}
              </Button>
              <Badge tone="info">
                depositId = keccak256(utf8(depositRef))
              </Badge>
            </div>

            <TxStatus hash={txHash} />
          </Card>

          <Card title="Issuer console: burn on redeem (ISSUER_ROLE required)">
            <div style={{ marginBottom: 8 }}>
              {isIssuer.data ? <Badge tone="ok">You have ISSUER_ROLE</Badge> : <Badge tone="warn">No ISSUER_ROLE</Badge>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Input label="Redeem ref (string, must be unique)" value={redeemRef} onChange={(e) => setRedeemRef(e.target.value)} />
              <Input label="From address" value={burnFrom} onChange={(e) => setBurnFrom(e.target.value)} placeholder="0x…" />
              <Input label={`Amount (${tokenSymbol.data ?? "token"})`} value={burnAmount} onChange={(e) => setBurnAmount(e.target.value)} />
              <div />
            </div>

            <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Button
                onClick={doBurnOnRedeem}
                disabled={!isConnected || !vault || !isIssuer.data || isWriting}
              >
                {isWriting ? "Writing…" : "Burn"}
              </Button>
              <Badge tone="info">
                redeemId = keccak256(utf8(redeemRef))
              </Badge>
            </div>

            <TxStatus hash={txHash} />
          </Card>

          <Card title="Token admin (PAUSER_ROLE / BLACKLIST_ROLE)">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {isPauser.data ? <Badge tone="ok">PAUSER_ROLE</Badge> : <Badge tone="warn">No PAUSER_ROLE</Badge>}
              {isBlacklistAdmin.data ? <Badge tone="ok">BLACKLIST_ROLE</Badge> : <Badge tone="warn">No BLACKLIST_ROLE</Badge>}
            </div>

            <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Button onClick={doPause} disabled={!isConnected || !token || !isPauser.data || isWriting}>
                Pause transfers
              </Button>
              <Button onClick={doUnpause} disabled={!isConnected || !token || !isPauser.data || isWriting}>
                Unpause
              </Button>
              <Button
                onClick={() => doSetBlacklistEnabled(!blacklistEnabled.data)}
                disabled={!isConnected || !token || !isBlacklistAdmin.data || isWriting}
              >
                Set blacklistEnabled = {blacklistEnabled.data ? "false" : "true"}
              </Button>
            </div>

            <TxStatus hash={txHash} />
          </Card>

          <Card title="Optional: intent controller policy (POLICY_ADMIN_ROLE)">
            {controller ? (
              <>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {isPolicyAdmin.data ? <Badge tone="ok">POLICY_ADMIN_ROLE</Badge> : <Badge tone="warn">No POLICY_ADMIN_ROLE</Badge>}
                </div>

                <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <Input label="Session key address" value={sessionKey} onChange={(e) => setSessionKey(e.target.value)} placeholder="0x…" />
                  <Input
                    label="expiresAt (unix seconds)"
                    value={sessionExpiry}
                    onChange={(e) => setSessionExpiry(e.target.value)}
                    placeholder={`${Math.floor(Date.now() / 1000) + 3600}`}
                  />
                  <Input label={`dailyMintCap (${tokenSymbol.data ?? "token"})`} value={sessionMintCap} onChange={(e) => setSessionMintCap(e.target.value)} />
                  <Input label={`dailyBurnCap (${tokenSymbol.data ?? "token"})`} value={sessionBurnCap} onChange={(e) => setSessionBurnCap(e.target.value)} />
                </div>

                <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                  <label style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 13 }}>
                    <input type="checkbox" checked={sessionEnabled} onChange={(e) => setSessionEnabled(e.target.checked)} />
                    enabled
                  </label>
                  <label style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 13 }}>
                    <input type="checkbox" checked={sessionEnforceAllow} onChange={(e) => setSessionEnforceAllow(e.target.checked)} />
                    enforce recipient allowlist
                  </label>

                  <Button onClick={doSetSessionKey} disabled={!isConnected || !controller || !isPolicyAdmin.data || isWriting}>
                    {isWriting ? "Writing…" : "Set session policy"}
                  </Button>
                </div>

                {sessionInfo.data && (
                  <div style={{ marginTop: 10, fontSize: 13, color: "#374151" }}>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>Current on-chain policy for this key</div>
                    <div style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
                      enabled={String((sessionInfo.data as any)[0])},{" "}
                      expiresAt={String((sessionInfo.data as any)[1])},{" "}
                      dailyMintCap={String((sessionInfo.data as any)[2])},{" "}
                      dailyBurnCap={String((sessionInfo.data as any)[3])},{" "}
                      enforceAllow={String((sessionInfo.data as any)[4])}
                    </div>
                  </div>
                )}

                <TxStatus hash={txHash} />
              </>
            ) : (
              <div style={{ color: "#374151", fontSize: 13 }}>
                No controller address set for this chain. Deploy with <code>ENABLE_INTENT_CONTROLLER=true</code> if you want delegation.
              </div>
            )}
          </Card>

          <Card
            title="Recent events (last ~5000 blocks)"
            right={<Button onClick={refreshEvents} disabled={!publicClient || !token || !vault}>Refresh</Button>}
          >
            {eventsErr && <pre style={{ whiteSpace: "pre-wrap", color: "#991b1b" }}>{eventsErr}</pre>}
            {!events.length ? (
              <div style={{ color: "#6b7280", fontSize: 13 }}>Click Refresh to fetch logs (dev-friendly; not a production indexer).</div>
            ) : (
              <div style={{ display: "grid", gap: 8 }}>
                {events.map((e, i) => (
                  <div key={i} style={{ padding: 10, border: "1px solid #e5e7eb", borderRadius: 12, background: "#fff" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                        <Badge tone="info">{e.kind}</Badge>
                        <span style={{ fontSize: 12, color: "#6b7280" }}>block {e.blockNumber.toString()}</span>
                      </div>
                    </div>

                    {e.kind === "Transfer" && (
                      <div style={{ marginTop: 6, fontSize: 13 }}>
                        {shortAddr(e.from)} → {shortAddr(e.to)}{" "}
                        <b>{safeFormatUnits(e.value, decimals)} {tokenSymbol.data ?? ""}</b>
                      </div>
                    )}
                    {e.kind === "MintOnDeposit" && (
                      <div style={{ marginTop: 6, fontSize: 13 }}>
                        to {shortAddr(e.to)}{" "}
                        <b>{safeFormatUnits(e.amount, decimals)} {tokenSymbol.data ?? ""}</b>
                        <div style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 12, color: "#6b7280" }}>
                          depositId: {e.depositId}
                        </div>
                      </div>
                    )}
                    {e.kind === "BurnOnRedeem" && (
                      <div style={{ marginTop: 6, fontSize: 13 }}>
                        from {shortAddr(e.from)}{" "}
                        <b>{safeFormatUnits(e.amount, decimals)} {tokenSymbol.data ?? ""}</b>
                        <div style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 12, color: "#6b7280" }}>
                          redeemId: {e.redeemId}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {(connectError || writeError) && (
          <pre style={{ marginTop: 16, whiteSpace: "pre-wrap", color: "#991b1b" }}>
            {(connectError ?? writeError)?.message}
          </pre>
        )}
      </div>
    </main>
  );
}
