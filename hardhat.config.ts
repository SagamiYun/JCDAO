import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

// 从环境变量读取私钥和 RPC URL
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const POLYGON_AMOY_RPC_URL = process.env.POLYGON_AMOY_RPC_URL || "https://rpc-amoy.polygon.technology";
const POLYGON_MAINNET_RPC_URL = process.env.POLYGON_MAINNET_RPC_URL || "https://polygon-rpc.com";
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || "";

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.24",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    networks: {
        hardhat: {
            chainId: 31337,
        },
        localhost: {
            url: "http://127.0.0.1:8545",
        },
        polygonAmoy: {
            url: POLYGON_AMOY_RPC_URL,
            accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
            chainId: 80002,
        },
        polygonMainnet: {
            url: POLYGON_MAINNET_RPC_URL,
            accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
            chainId: 137,
        },
    },
    etherscan: {
        apiKey: {
            polygon: POLYGONSCAN_API_KEY,
            polygonAmoy: POLYGONSCAN_API_KEY,
        },
        customChains: [
            {
                network: "polygonAmoy",
                chainId: 80002,
                urls: {
                    apiURL: "https://api-amoy.polygonscan.com/api",
                    browserURL: "https://amoy.polygonscan.com",
                },
            },
        ],
    },
    gasReporter: {
        enabled: process.env.REPORT_GAS === "true",
        currency: "USD",
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts",
    },
};

export default config;
