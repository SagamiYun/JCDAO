'use client';

import * as React from 'react';
import {
    RainbowKitProvider,
    getDefaultWallets,
    getDefaultConfig,
    darkTheme,
} from '@rainbow-me/rainbowkit';
import {
    argentWallet,
    trustWallet,
    ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { polygonAmoy, polygon } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';

import '@rainbow-me/rainbowkit/styles.css';

// 获取钱包配置
const { wallets } = getDefaultWallets();

// Wagmi 配置
// 注意：NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID 需要在 .env.local 中配置
// 可在 https://cloud.walletconnect.com 免费申请
const config = getDefaultConfig({
    appName: 'JCDAO',
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
    wallets: [
        ...wallets,
        {
            groupName: 'Other',
            wallets: [argentWallet, trustWallet, ledgerWallet],
        },
    ],
    chains: [
        polygonAmoy, // Polygon Amoy 测试网（优先）
        polygon,     // Polygon 主网
    ],
    ssr: true, // 启用 SSR 支持
});

// React Query 客户端
const queryClient = new QueryClient();

/**
 * Web3Provider - 提供 Web3 相关的上下文
 * 包含 WagmiProvider, QueryClientProvider, RainbowKitProvider
 */
export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    theme={darkTheme({
                        accentColor: '#7c3aed', // 紫色主题色
                        accentColorForeground: 'white',
                        borderRadius: 'medium',
                    })}
                    locale="zh-CN" // 中文界面
                >
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
