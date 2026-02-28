"use client";

import * as React from "react";
import { useWaitForTransactionReceipt } from "wagmi";
import type { Hash } from "viem";
import { Badge } from "./Card";

export function TxStatus(props: { hash?: Hash }) {
  const { data, isLoading, isSuccess, isError, error } = useWaitForTransactionReceipt({
    hash: props.hash,
    query: { enabled: !!props.hash },
  });

  if (!props.hash) return null;

  return (
    <div style={{ marginTop: 10, fontSize: 12 }}>
      <div>
        <b>Tx:</b>{" "}
        <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
          {props.hash}
        </span>
      </div>

      <div style={{ marginTop: 6 }}>
        {isLoading && <Badge tone="info">Pending…</Badge>}
        {isSuccess && <Badge tone="ok">Confirmed (block {data?.blockNumber?.toString()})</Badge>}
        {isError && <Badge tone="bad">Failed</Badge>}
      </div>

      {error && (
        <pre style={{ marginTop: 8, whiteSpace: "pre-wrap", color: "#991b1b" }}>{error.message}</pre>
      )}
    </div>
  );
}
