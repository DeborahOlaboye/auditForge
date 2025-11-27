import { createAppKit } from '@reown/appkit';
import { createWagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

// Configure Wagmi
const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

export const appkit = createAppKit({
  dapp: {
    name: 'AuditForge',
    description: 'AI-powered smart contract security auditor',
    url: 'https://auditforge.xyz', // Update with your domain
    icon: 'https://auditforge.xyz/icon.png', // Update with your icon
  },
  // Get your project ID from Reown Dashboard
  projectId: process.env.REACT_APP_REOWN_PROJECT_ID || 'YOUR_REOWN_PROJECT_ID',
  adapters: [
    createWagmiAdapter({
      config,
      // Optional: Configure which wallets to show
      walletConnectProjectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || 'YOUR_WALLETCONNECT_ID',
    }),
  ],
});

export const { connectors, useConnect, useDisconnect, useAccount } = appkit.hooks;
