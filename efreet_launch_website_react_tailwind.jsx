import React from 'react';

// Efreet Chain - Landing Page React Component
// TailwindCSS utility classes used throughout. Default export for preview.

export default function EfreetLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-zinc-900 text-white antialiased">
      <header className="max-w-6xl mx-auto p-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Inline EFRT emblem simplified */}
          <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <defs>
              <linearGradient id="g1" x1="0" x2="1">
                <stop offset="0" stopColor="#FF7A18" />
                <stop offset="1" stopColor="#FFD24C" />
              </linearGradient>
            </defs>
            <rect width="64" height="64" rx="8" fill="#0b0b0b" />
            <g transform="translate(8 8)">
              <path d="M24 0C18 6 16 12 10 18C6 22 6 26 10 30C14 34 20 34 24 28C28 22 34 18 30 10C28 6 26 2 24 0Z" fill="url(#g1)" />
              <circle cx="24" cy="24" r="18" stroke="#2b2b2b" strokeWidth="2" fill="none" />
            </g>
          </svg>
          <div>
            <h1 className="text-xl font-semibold">Efreet Chain</h1>
            <p className="text-xs text-zinc-400">Sovereign Flame • Titanium Constitution</p>
          </div>
        </div>
        <nav className="hidden md:flex space-x-6 text-sm text-zinc-300">
          <a href="#constitution" className="hover:text-white">Constitution</a>
          <a href="#sentinel" className="hover:text-white">Sentinel</a>
          <a href="#tokenomics" className="hover:text-white">Tokenomics</a>
          <a href="#join" className="hover:text-white">Join</a>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-4xl font-extrabold leading-tight">Efreet Chain — The Sovereign Flame</h2>
            <p className="mt-6 text-zinc-300">Forged in titanium, guarded by the Sentinel, and sworn to the Titanium Constitution. A privacy-first, deflationary chain built to outlast empires.</p>
            <div className="mt-8 flex space-x-4">
              <a href="#genesis" className="px-5 py-3 bg-gradient-to-r from-orange-600 to-yellow-400 text-black rounded-md font-semibold shadow-lg">Enter the Forge</a>
              <a href="#constitution" className="px-5 py-3 border border-zinc-700 rounded-md text-zinc-300">Read the Constitution</a>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#111] to-[#1a0f05] p-8 rounded-2xl shadow-2xl">
            <div className="text-sm text-zinc-400">Genesis Snapshot</div>
            <pre className="mt-4 bg-black/40 p-4 rounded text-xs overflow-auto">{`{
  "genesis_id": "EFREET_CHAIN_BLOCK_0",
  "constitution_hash": "efrt_9f44b6e25d...",
  "total_supply_cap": 1000000000
}`}</pre>
            <div className="mt-6 text-xs text-zinc-400">Block 0 will be ceremonially signed by 21 Notaries. The Eternal Flame address is precommitted in genesis.</div>
          </div>
        </section>

        <section id="constitution" className="mt-16">
          <h3 className="text-2xl font-bold">The Titanium Constitution</h3>
          <p className="mt-3 text-zinc-300">Enshrining scarcity, privacy, anti-oligarchy and the Ritual of Amendment. Encoded at genesis and physically archived.</p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card title="Scarcity">
              <p>Supply cap: 1,000,000,000 EFRT. Burn minimum: 50% of fees.</p>
            </Card>
            <Card title="Privacy">
              <p>Mandatory zk-STARK transactions with 24h veil.</p>
            </Card>
            <Card title="Governance">
              <p>5% burn to propose. 88% approval over 3 lunar cycles. Chaos Gauntlet enforced.</p>
            </Card>
          </div>
        </section>

        <section id="sentinel" className="mt-16">
          <h3 className="text-2xl font-bold">The Ifrit Sentinel</h3>
          <p className="mt-3 text-zinc-300">An off-chain AI guardian that monitors for threats and quarantines malicious payloads. It cannot change state; it can only lock and alert.</p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-black/40 rounded">Threat detection, anomaly scoring, coordinated defender response.</div>
            <div className="p-6 bg-black/40 rounded">On-chain triggers for emergency burns, chain halts, and governance emergency procedures.</div>
          </div>
        </section>

        <section id="tokenomics" className="mt-16">
          <h3 className="text-2xl font-bold">Tokenomics & Mechanics</h3>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card title="Supply">Fixed at 1,000,000,000 EFRT</Card>
            <Card title="Burns">50% minimum of all fees burned</Card>
            <Card title="Anti-Oligarchy">Max stake per entity: 15%</Card>
          </div>
        </section>

        <section id="join" className="mt-16 mb-24">
          <h3 className="text-2xl font-bold">Join the Forge</h3>
          <p className="mt-3 text-zinc-300">Validator seats will be distributed via the Summoning Ritual. Auditors, artists, and defenders welcome.</p>

          <div className="mt-6 flex items-center gap-4">
            <a className="px-4 py-2 bg-zinc-800 rounded">Apply to Audit</a>
            <a className="px-4 py-2 border border-zinc-700 rounded">Become a Notary</a>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800 py-8 mt-8">
        <div className="max-w-6xl mx-auto px-6 text-zinc-500 text-sm">© Efreet Chain — The Sovereign Flame. Constitution Hash: efrt_9f44b6e25db2f...</div>
      </footer>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="p-6 rounded-lg bg-gradient-to-br from-black/50 to-black/30 border border-zinc-800">
      <h4 className="font-semibold">{title}</h4>
      <div className="mt-3 text-sm text-zinc-300">{children}</div>
    </div>
  );
}
