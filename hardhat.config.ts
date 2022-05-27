import { HardhatUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-waffle";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "hardhat-docgen";
import "hardhat-gas-reporter";
import "./tasks/accounts";
import "@nomiclabs/hardhat-etherscan";
const fs = require("fs");
const privateKey = fs.readFileSync("privateKey.secret").toString().trim();
// const alchemyKey = fs.readFileSync("alchemyKey.secret").toString().trim();
// const apiScan = fs.readFileSync("apiscan.secret").toString().trim();
const config: HardhatUserConfig = {
  namedAccounts: {
    deployer: 0,
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      saveDeployments: true,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: [privateKey],
      chainId: 1337,
      saveDeployments: true,
    },

    bsc_test: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      accounts: [privateKey],

      saveDeployments: true,
      chainId: 97,
    },
    bsc: {
      url: "https://bsc.getblock.io/mainnet/?api_key=d1f20bc9-593e-4ba2-a1c9-19d132a08d57",
      accounts: [privateKey],
      saveDeployments: true,
      chainId: 56,
      gasPrice: 5 * 1000000000,
      timeout: 60 * 60 * 60 * 3,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.1",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.2",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.2",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.3",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 300,
          },
        },
      },
      {
        version: "0.8.5",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.7",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  gasReporter: {
    currency: "USD",
    enabled: true,

    coinmarketcap: "9e9077a0-349d-45e1-bbeb-f68f3d1a57b5",
    outputFile: "./output.js",
    showTimeSpent: true,
    showMethodSig: true,
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: "your key",
  },
  // paths: {
  //   sources: "./contracts",
  //   tests: "./test",
  //   cache: "./cache",
  //   artifacts: "./artifacts"
  // },
  paths: {
    deploy: "deploy",
    deployments: "deployments",
    imports: "imports",
  },
  mocha: {
    timeout: 200000000,
  },
  docgen: {
    path: "./docs",
    clear: true,
    runOnCompile: true,
  },
};
export default config;
