
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();

const PK = process.env.DEPLOYER_PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  networks: {
    hardhat: {},
    arbitrum: {
      url: process.env.ARBITRUM_RPC_URL || "",
      accounts: PK ? [PK] : [],
    },
    base: {
      url: process.env.BASE_RPC_URL || "",
      accounts: PK ? [PK] : [],
    },
  },
};

export default config;
