import { formatUnits, parseUnits } from "viem";

export function safeParseUnits(value: string, decimals: number): bigint | null {
  const v = value.trim();
  if (!v) return null;
  // Basic input validation: allow digits + optional single decimal point.
  if (!/^(\d+)(\.\d+)?$/.test(v)) return null;
  try {
    return parseUnits(v as `${number}`, decimals);
  } catch {
    return null;
  }
}

export function safeFormatUnits(value?: bigint, decimals?: number): string {
  if (value === undefined) return "";
  return formatUnits(value, decimals ?? 18);
}
