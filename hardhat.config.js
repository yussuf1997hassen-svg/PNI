require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PK = process.env.DEPLOYER_PRIVATE_KEY || "";
if (!PK) {
  // Don't throw here to allow compile without keys.
}

module.exports = {
  solidity: "0.8.24",
  networks: {
    arbitrumSepolia: {
      url: process.env.ARBITRUM_SEPOLIA_RPC_URL || "",
      accounts: PK ? [PK] : [],
      chainId: 421614
    },
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC_URL || "",
      accounts: PK ? [PK] : [],
      chainId: 84532
    }
  }
};
