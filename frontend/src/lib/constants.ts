import JCDTokenABI from './abi/JCDToken.json';
import JCDMembershipABI from './abi/JCDMembership.json';

export const JCD_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_JCD_TOKEN_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000';
export const JCD_MEMBERSHIP_ADDRESS = process.env.NEXT_PUBLIC_JCD_MEMBERSHIP_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000';

export const JCD_TOKEN_ABI = JCDTokenABI;
export const JCD_MEMBERSHIP_ABI = JCDMembershipABI;

// Phase 3 & 4: External Platform URLs
// Snapshot Space URL - 替换为实际的 Snapshot Space 地址
export const SNAPSHOT_SPACE_URL = process.env.NEXT_PUBLIC_SNAPSHOT_SPACE_URL || 'https://snapshot.org/#/jcdao.eth';

// Guild.xyz URL - 替换为实际的 Guild 页面地址
export const GUILD_URL = process.env.NEXT_PUBLIC_GUILD_URL || 'https://guild.xyz/jcdao';

// Polygon Amoy Chain ID
export const POLYGON_AMOY_CHAIN_ID = 80002;
