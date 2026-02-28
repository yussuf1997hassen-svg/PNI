"use client";

import * as React from "react";

export function Card(props: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <section
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: 16,
        background: "#fff",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{props.title}</h2>
        {props.right}
      </div>
      <div style={{ marginTop: 12 }}>{props.children}</div>
    </section>
  );
}

export function Field(props: { label: string; value?: React.ReactNode; mono?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "6px 0" }}>
      <div style={{ color: "#374151" }}>{props.label}</div>
      <div style={{ fontFamily: props.mono ? "ui-monospace, SFMono-Regular, Menlo, monospace" : undefined }}>
        {props.value ?? "-"}
      </div>
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <label style={{ display: "block" }}>
      <div style={{ fontSize: 12, color: "#374151", marginBottom: 6 }}>{label}</div>
      <input
        {...rest}
        style={{
          width: "100%",
          padding: "10px 12px",
          border: "1px solid #d1d5db",
          borderRadius: 12,
          outline: "none",
        }}
      />
    </label>
  );
}

export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { style, ...rest } = props;
  return (
    <button
      {...rest}
      style={{
        padding: "10px 14px",
        border: "1px solid #d1d5db",
        borderRadius: 12,
        background: props.disabled ? "#f3f4f6" : "#fff",
        cursor: props.disabled ? "not-allowed" : "pointer",
        ...style,
      }}
    />
  );
}

export function Badge(props: { children: React.ReactNode; tone?: "ok" | "warn" | "bad" | "info" }) {
  const tone = props.tone ?? "info";
  const bg = tone === "ok" ? "#ecfdf5" : tone === "warn" ? "#fffbeb" : tone === "bad" ? "#fef2f2" : "#eff6ff";
  const fg = tone === "ok" ? "#065f46" : tone === "warn" ? "#92400e" : tone === "bad" ? "#991b1b" : "#1e40af";
  return (
    <span
      style={{
        fontSize: 12,
        padding: "4px 8px",
        borderRadius: 999,
        background: bg,
        color: fg,
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {props.children}
    </span>
  );
}
