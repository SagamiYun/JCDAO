'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { JCD_MEMBERSHIP_ADDRESS, JCD_MEMBERSHIP_ABI } from '@/lib/constants';
import { isAddress } from 'viem';

/**
 * Admin Panel - 仅对合约 Owner 显示
 * 功能: 为新用户铸造 JCDMembership SBT
 */
export function AdminMintPanel() {
    const { address } = useAccount();
    const [recipientAddress, setRecipientAddress] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // 读取合约 Owner
    const { data: contractOwner } = useReadContract({
        address: JCD_MEMBERSHIP_ADDRESS,
        abi: JCD_MEMBERSHIP_ABI,
        functionName: 'owner',
    });

    // 检查接收者是否已持有 SBT
    const { data: alreadyHasMembership, refetch: refetchMembership } = useReadContract({
        address: JCD_MEMBERSHIP_ADDRESS,
        abi: JCD_MEMBERSHIP_ABI,
        functionName: 'hasMembership',
        args: recipientAddress && isAddress(recipientAddress) ? [recipientAddress] : undefined,
    });

    // Mint 交易
    const { writeContract, data: hash, isPending, reset } = useWriteContract();

    // 等待交易确认
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    // 检查当前用户是否为 Owner
    const isOwner = address && contractOwner &&
        address.toLowerCase() === (contractOwner as string).toLowerCase();

    // 处理铸造
    const handleMint = useCallback(() => {
        setError('');
        setSuccessMessage('');

        // 验证地址
        if (!recipientAddress) {
            setError('请输入接收者地址');
            return;
        }

        if (!isAddress(recipientAddress)) {
            setError('无效的以太坊地址');
            return;
        }

        // 检查是否已持有
        if (alreadyHasMembership) {
            setError('该地址已持有 SBT');
            return;
        }

        try {
            writeContract({
                address: JCD_MEMBERSHIP_ADDRESS,
                abi: JCD_MEMBERSHIP_ABI,
                functionName: 'mint',
                args: [recipientAddress as `0x${string}`],
            });
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : '铸造失败';
            setError(errorMessage);
        }
    }, [recipientAddress, alreadyHasMembership, writeContract]);

    // 交易成功后的处理 - 必须在条件返回之前！
    useEffect(() => {
        if (isSuccess && hash) {
            setSuccessMessage(`✅ SBT 铸造成功! 交易: ${hash.slice(0, 10)}...${hash.slice(-8)}`);
            setRecipientAddress('');
            refetchMembership();
            // 5秒后重置状态
            const timer = setTimeout(() => {
                reset();
                setSuccessMessage('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, hash, reset, refetchMembership]);

    // 如果不是 Owner，不渲染组件 - 必须在所有 hooks 之后！
    if (!isOwner) {
        return null;
    }

    return (
        <Card className="w-full max-w-lg shadow-xl border-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 ring-1 ring-amber-500/30 mt-6">
            <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <span className="text-2xl">👑</span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500">
                        管理员面板
                    </span>
                </CardTitle>
                <CardDescription className="text-amber-200/70">
                    为新用户铸造 JCDMembership SBT
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* 输入框 */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        接收者钱包地址
                    </label>
                    <input
                        type="text"
                        value={recipientAddress}
                        onChange={(e) => {
                            setRecipientAddress(e.target.value);
                            setError('');
                        }}
                        placeholder="0x..."
                        className="w-full px-4 py-3 rounded-xl bg-black/30 border border-amber-500/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 font-mono text-sm"
                        disabled={isPending || isConfirming}
                    />
                </div>

                {/* 已持有提示 */}
                {recipientAddress && isAddress(recipientAddress) && alreadyHasMembership && (
                    <div className="text-amber-400 text-sm flex items-center gap-2">
                        <span>⚠️</span>
                        该地址已持有 SBT
                    </div>
                )}

                {/* 错误提示 */}
                {error && (
                    <div className="text-red-400 text-sm flex items-center gap-2">
                        <span>❌</span>
                        {error}
                    </div>
                )}

                {/* 成功提示 */}
                {successMessage && (
                    <div className="text-green-400 text-sm flex items-center gap-2">
                        <span>✅</span>
                        {successMessage}
                    </div>
                )}

                {/* 铸造按钮 */}
                <button
                    onClick={handleMint}
                    disabled={isPending || isConfirming || !recipientAddress || !!alreadyHasMembership}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-amber-500/25 flex items-center justify-center gap-2"
                >
                    {isPending ? (
                        <>
                            <span className="animate-spin">⏳</span>
                            等待签名...
                        </>
                    ) : isConfirming ? (
                        <>
                            <span className="animate-spin">⏳</span>
                            确认中...
                        </>
                    ) : (
                        <>
                            <span>🎫</span>
                            铸造 SBT
                        </>
                    )}
                </button>

                {/* 交易状态 */}
                {hash && !isSuccess && (
                    <div className="text-sm text-gray-400 text-center">
                        交易哈希:
                        <a
                            href={`https://amoy.polygonscan.com/tx/${hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-400 hover:underline ml-1"
                        >
                            {hash.slice(0, 10)}...{hash.slice(-8)}
                        </a>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
