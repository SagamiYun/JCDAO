import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Dashboard } from '../Dashboard';
import React from 'react';

// Mock wagmi
vi.mock('wagmi', () => ({
    useAccount: vi.fn(),
}));

// Mock rainbowkit
vi.mock('@rainbow-me/rainbowkit', () => ({
    ConnectButton: () => <button data-testid="connect-button">Connect Wallet</button>,
}));

// Mock useJCDUser hook
vi.mock('@/hooks/useJCDUser', () => ({
    useJCDUser: vi.fn(),
}));

// Mock viem
vi.mock('viem', () => ({
    formatEther: (val: bigint) => val.toString(),
}));

import { useAccount } from 'wagmi';
import { useJCDUser } from '@/hooks/useJCDUser';

describe('Dashboard Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should show connect button when not connected', () => {
        (useAccount as any).mockReturnValue({ isConnected: false });
        (useJCDUser as any).mockReturnValue({ isMember: false, jcdTokenBalance: BigInt(0), isLoading: false });

        render(<Dashboard />);

        expect(screen.getByText('连接您的钱包')).toBeDefined();
        expect(screen.getByTestId('connect-button')).toBeDefined();
    });

    it('should show welcome message for member when connected', () => {
        (useAccount as any).mockReturnValue({ isConnected: true });
        (useJCDUser as any).mockReturnValue({
            isMember: true,
            jcdTokenBalance: BigInt(100),
            isLoading: false
        });

        render(<Dashboard />);

        expect(screen.getByText('欢迎，JCDAO 成员')).toBeDefined();
        expect(screen.getByText('100')).toBeDefined(); // Mock formatEther returns string
    });

    it('should show non-member message when connected but not a member', () => {
        (useAccount as any).mockReturnValue({ isConnected: true });
        (useJCDUser as any).mockReturnValue({
            isMember: false,
            jcdTokenBalance: BigInt(0),
            isLoading: false
        });

        render(<Dashboard />);

        expect(screen.getByText('非成员')).toBeDefined();
    });

    it('should show loading state', () => {
        (useAccount as any).mockReturnValue({ isConnected: true });
        (useJCDUser as any).mockReturnValue({
            isMember: false,
            jcdTokenBalance: BigInt(0),
            isLoading: true
        });

        render(<Dashboard />);

        expect(screen.getByText('加载中...')).toBeDefined();
    });
});
