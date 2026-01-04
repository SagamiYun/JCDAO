'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Dashboard } from '@/components/Dashboard';
import { useJCDUser } from '@/hooks/useJCDUser';

export default function DashboardPage() {
    const router = useRouter();
    const { isConnected } = useAccount();
    const { isMember, isLoading } = useJCDUser();

    useEffect(() => {
        if (!isLoading && (!isConnected || !isMember)) {
            router.push('/');
        }
    }, [isConnected, isMember, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="text-white text-xl animate-pulse">加载中...</div>
            </div>
        );
    }

    if (!isConnected || !isMember) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <nav className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                        JCDAO
                    </span>
                </div>
                <ConnectButton />
            </nav>
            <Dashboard />
        </div>
    );
}
