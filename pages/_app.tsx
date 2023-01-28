import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { Analytics } from "@vercel/analytics/react";
import { Chain } from "@rainbow-me/rainbowkit";

export const moonriver: Chain = {
  id: 1285,
  rpcUrls: {
    default: { http: ["https://moonriver.public.blastapi.io"] },
  },
  name: "Moonriver",
  network: "moonriver",
  nativeCurrency: { decimals: 18, name: "Moonriver", symbol: "MOVR" },
  iconUrl: "./moonriver.webp",
};

import { publicProvider } from "wagmi/providers/public";

const { chains, provider, webSocketProvider } = configureChains([moonriver], [publicProvider()]);

const { connectors } = getDefaultWallets({
  appName: "RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} modalSize="compact">
        <Component {...pageProps} />
        <Analytics />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
