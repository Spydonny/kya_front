export function formatWalletAddress(address?: string | null) {
  if (!address) return "Not connected";
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}
