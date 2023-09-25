import '@sweetalert2/theme-dark/dark.css';
import '@rainbow-me/rainbowkit/styles.css';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store } from '@/app/store';

// #region wagmi
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { bscTestnet, polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        return {
          http: 'https://polygon-mumbai-bor.publicnode.com/',
        };
      },
    }),
    publicProvider(),
  ],
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

// #endregion

export default function App({ Component, pageProps }: AppProps) {
  const getLayout = ((Component as any).getLayout as any) || ((page) => page);
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url) => setLoading(true);
    const handleComplete = (url) => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  });

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider theme={darkTheme()} chains={chains}>
        <Provider store={store}>
          {loading && (
            <div className="absolute left-0 top-0 z-50 flex h-screen w-screen flex-col items-center justify-center">
              <h1 className="font-jakosta mb-8 text-6xl">Samurai Conquest</h1>
              <div className="flex h-32 w-32 animate-spin items-center justify-center rounded-full border-r-2 border-white">
                <i className="ri-sword-fill text-3xl"> </i>
              </div>
            </div>
          )}
          {!loading && getLayout(<Component {...pageProps} />)}
        </Provider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
