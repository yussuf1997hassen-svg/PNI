# Threat Model (Placeholder)

Key threats for stablecoin-style systems:
- key compromise (issuer/admin)
- double-minting / replay of deposit references
- false reserve claims (off-chain governance risk)
- blacklist/pause abuse risk (governance/controls)
- oracle manipulation (if you add oracles)
- bridge risk (if multi-chain)

Mitigation:
- strict key management + multisig
- unique deposit/redeem IDs stored on-chain
- publish reserve attestations
- clear governance + transparent policies
