require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();
require("solidity-coverage");
require("hardhat-deploy");

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    sepolia: {
      chainId: 11155111,
      url: SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  solidity: {
    compilers: [
      { version: "0.8.0" },
      { version: "0.8.20" },
      { version: "0.8.21" },
      { version: "0.8.24" },
      { version: "0.8.22" },
      { version: "0.8.23" },
    ],
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
    },
  },
};
