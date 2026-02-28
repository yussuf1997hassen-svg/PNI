
import { ethers } from "hardhat";

// Fixed supply: 12,000,000,000,000,000,000 tokens with 18 decimals
// -> 12_000_000_000_000_000_000 * 10^18
const FIXED_SUPPLY = BigInt("12000000000000000000") * (10n ** 18n);

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const blacklistEnabled = false; // toggle if you truly want blacklist functionality

  const Token = await ethers.getContractFactory("IEyeToken");
  const token = await Token.deploy(deployer.address, FIXED_SUPPLY, blacklistEnabled);
  await token.waitForDeployment();

  console.log("IEyeToken deployed to:", await token.getAddress());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
