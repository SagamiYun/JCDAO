import { useAccount, useReadContracts } from 'wagmi';
import { JCD_TOKEN_ADDRESS, JCD_TOKEN_ABI, JCD_MEMBERSHIP_ADDRESS, JCD_MEMBERSHIP_ABI } from '@/lib/constants';

const TEST_WALLET_ADDRESS = process.env.NEXT_PUBLIC_TEST_WALLET_ADDRESS as `0x${string}` | undefined;

export function useJCDUser() {
    const { address: walletAddress, isConnected } = useAccount();

    const address = TEST_WALLET_ADDRESS || walletAddress;
    const effectiveIsConnected = !!TEST_WALLET_ADDRESS || isConnected;

    const result = useReadContracts({
        contracts: [
            {
                address: JCD_TOKEN_ADDRESS,
                abi: JCD_TOKEN_ABI,
                functionName: 'balanceOf',
                args: address ? [address] : undefined,
            },
            {
                address: JCD_MEMBERSHIP_ADDRESS,
                abi: JCD_MEMBERSHIP_ABI,
                functionName: 'balanceOf',
                args: address ? [address] : undefined,
            },
        ],
        query: {
            enabled: !!address && effectiveIsConnected,
        }
    });

    const jcdTokenBalance = result.data?.[0].result;
    const jcdMembershipBalance = result.data?.[1].result;
    const isMember = jcdMembershipBalance ? jcdMembershipBalance > BigInt(0) : false;

    return {
        address,
        isConnected: effectiveIsConnected,
        jcdTokenBalance,
        isMember,
        isLoading: result.isLoading,
        isError: result.isError,
        error: result.error,
        refetch: result.refetch,
    };
}
