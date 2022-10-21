import { HardhatUserConfig, task } from "hardhat/config";
require("solidity-coverage");
import "@nomicfoundation/hardhat-toolbox";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
dotenvConfig({ path: resolve(__dirname, "./.env") });

const MNEMONIC = process.env.MNEMONIC || "";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(await account.getAddress());
    }
});

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    solidity: {
        compilers: [
            {
                version: "0.8.12",
            },
        ],
    },
    networks: {
        hardhat: {
            accounts: {
                mnemonic: MNEMONIC,
            },
        },
        goerli: {
            url: process.env.GOERLI_URL,
            accounts: {
                mnemonic: MNEMONIC,
            },
        },
        bsctestnet: {
            url: process.env.BSCTESTNET_URL,
            accounts: {
                mnemonic: MNEMONIC,
            },
        },
    },
    gasReporter: {
        // enabled: process.env.REPORT_GAS !== undefined,
        enabled: true,
        currency: "USD",
    },

    // settings: {
    //     optimizer: {
    //         enabled: true,
    //         runs: 1000,
    //     },
    // },
    etherscan: {
        apiKey: process.env.POLYGONSCAN_API_KEY,
    },
    typechain: {
        outDir: "typechain",
        target: "ethers-v5",
    },
};

export default config;
