import { useAccount, useReadContracts } from 'wagmi';
import { JCD_TOKEN_ADDRESS, JCD_TOKEN_ABI, JCD_MEMBERSHIP_ADDRESS, JCD_MEMBERSHIP_ABI } from '@/lib/constants';

export function useJCDUser() {
    const { address, isConnected } = useAccount();

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
            enabled: !!address && isConnected,
        }
    });

    const jcdTokenBalance = result.data?.[0].result;
    const jcdMembershipBalance = result.data?.[1].result;

    const isMember = jcdMembershipBalance ? jcdMembershipBalance > BigInt(0) : false;

    return {
        jcdTokenBalance,
        isMember,
        isLoading: result.isLoading,
        isError: result.isError,
        error: result.error,
        refetch: result.refetch,
    };
}
