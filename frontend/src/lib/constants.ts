import JCDTokenABI from './abi/JCDToken.json';
import JCDMembershipABI from './abi/JCDMembership.json';

export const JCD_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_JCD_TOKEN_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000';
export const JCD_MEMBERSHIP_ADDRESS = process.env.NEXT_PUBLIC_JCD_MEMBERSHIP_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000';

export const JCD_TOKEN_ABI = JCDTokenABI;
export const JCD_MEMBERSHIP_ABI = JCDMembershipABI;
