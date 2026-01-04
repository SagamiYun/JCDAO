import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

// 从环境变量读取私钥和 RPC URL
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const POLYGON_AMOY_RPC_URL = process.env.POLYGON_AMOY_RPC_URL || "https://rpc-amoy.polygon.technology";
const POLYGON_MAINNET_RPC_URL = process.env.POLYGON_MAINNET_RPC_URL || "https://polygon-rpc.com";
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || "";

// 验证私钥格式是否有效（64位十六进制，可带0x前缀）
function getAccounts(): string[] {
    if (!PRIVATE_KEY) return [];
    const key = PRIVATE_KEY.startsWith("0x") ? PRIVATE_KEY.slice(2) : PRIVATE_KEY;
    // 必须是64位十六进制字符
    if (/^[0-9a-fA-F]{64}$/.test(key)) {
        return [PRIVATE_KEY.startsWith("0x") ? PRIVATE_KEY : `0x${PRIVATE_KEY}`];
    }
    return [];
}

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
            accounts: getAccounts(),
            chainId: 80002,
            timeout: 60000,
        },
        polygonMainnet: {
            url: POLYGON_MAINNET_RPC_URL,
            accounts: getAccounts(),
            chainId: 137,
        },
    },
    etherscan: {
        apiKey: {
            polygon: POLYGONSCAN_API_KEY,
            polygonAmoy: POLYGONSCAN_API_KEY,
        },
        customChains: [],
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
