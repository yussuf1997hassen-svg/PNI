const fs = require("fs");
const path = require("path");
const { ethers, network } = require("hardhat");

async function main() {
  const mintTokens = process.env.MINT_TOKENS || "1000000";
  const wallet1 = process.env.WALLET1;
  const wallet2 = process.env.WALLET2;
  if (!wallet1 || !wallet2) throw new Error("WALLET1/WALLET2 env required (0x... addresses)");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address, "Network:", network.name);

  const Token = await ethers.getContractFactory("TruDATToken");
  const token = await Token.deploy(deployer.address);
  await token.waitForDeployment();
  const addr = await token.getAddress();

  const amountWei = BigInt(mintTokens) * (10n ** 18n);
  console.log("Token:", addr, "MintEach:", mintTokens, "Wei:", amountWei.toString());

  const tx1 = await token.mint(wallet1, amountWei); await tx1.wait();
  const tx2 = await token.mint(wallet2, amountWei); await tx2.wait();

  const b1 = await token.balanceOf(wallet1);
  const b2 = await token.balanceOf(wallet2);

  const out = {
    network: network.name,
    chainId: network.config.chainId,
    contract: addr,
    symbol: "TDAT",
    decimals: 18,
    wallet1,
    wallet2,
    amountEach: mintTokens,
    amountEachWei: amountWei.toString(),
    balance1Wei: b1.toString(),
    balance2Wei: b2.toString()
  };

  const distDir = path.resolve(__dirname, "..", "..", "dist");
  fs.mkdirSync(distDir, { recursive: true });
  const receipt = path.join(distDir, `testnet_receipt_${network.name}.json`);
  fs.writeFileSync(receipt, JSON.stringify(out, null, 2));
  console.log("OK:", receipt);
  console.log(out);
}
main().catch((e) => { console.error(e); process.exit(1); });
