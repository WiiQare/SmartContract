import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-network-helpers";
import "solidity-coverage";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    maticmainnet: {
      url: `​https://rpc-mainnet.matic.network`,
      accounts: undefined,
    },
  },
};

export default config;
