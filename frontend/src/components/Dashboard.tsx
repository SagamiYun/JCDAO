import React from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useJCDUser } from '@/hooks/useJCDUser';
import { formatEther } from 'viem';

export function Dashboard() {
    const { isConnected } = useAccount();
    const { isMember, jcdTokenBalance, isLoading } = useJCDUser();

    if (!isConnected) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] p-4">
                <Card className="w-full max-w-md shadow-lg border-0 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            连接您的钱包
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                            请连接钱包以访问 JCDAO 仪表盘
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center pb-8">
                        <ConnectButton />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[50vh] p-4">
            <Card className="w-full max-w-lg shadow-xl border-0 bg-white/5 backdrop-blur-lg dark:bg-black/40 ring-1 ring-white/10">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center">
                        {isLoading ? (
                            <span className="animate-pulse">加载中...</span>
                        ) : isMember ? (
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
                                欢迎，JCDAO 成员
                            </span>
                        ) : (
                            <span className="text-gray-500">非成员</span>
                        )}
                    </CardTitle>
                    <CardDescription className="text-center text-lg mt-2">
                        个人资产概览
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="p-6 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                        <div className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">
                            $JCD 代币余额
                        </div>
                        <div className="text-4xl font-mono font-bold mt-2 text-indigo-600 dark:text-indigo-400">
                            {isLoading ? (
                                <span className="animate-pulse">...</span>
                            ) : (
                                formatEther(jcdTokenBalance || BigInt(0))
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
