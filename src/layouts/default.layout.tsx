'use client';

import { Aside } from '@/components/layout/aside.component';
import { Navbar } from '@/components/layout/navbar.component';
import { useLayout } from '@/hooks/useLayout';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { bscTestnet } from 'wagmi/chains';

export type DefaultLayoutProps = {
  children: JSX.Element;
};

export function DefaultLayout({ children }: DefaultLayoutProps) {
  const account = useAccount();
  const network = useNetwork();
  const layout = useLayout();

  const switchNetwork = useSwitchNetwork();

  return (
    <>
      {!!network.chain && network.chain.id != bscTestnet.id && (
        <div className="fixed inset-0 z-[9999999] flex w-full items-center justify-center bg-black text-white">
          <button
            onClick={() => {
              switchNetwork.switchNetworkAsync(bscTestnet.id);
            }}
            className="rounded bg-red-500 px-6 py-4 text-white"
          >
            CHANGE YOUR NETWORK TO BSC TESTNET
          </button>
        </div>
      )}
      <div className="sticky top-10 mx-auto flex h-full w-full max-w-screen-lg justify-center">
        <div
          className={`absolute h-[500px] w-[500px] blur-[500px] transition-all duration-1000 bg-${layout.layout.color}-500`}
        ></div>
      </div>
      <div className="flex">
        <Aside></Aside>
        <main className="relative flex max-w-full grow flex-col">
          <div className="absolute flex w-full px-6 py-8">
            <Navbar className="w-full"></Navbar>
          </div>
          <div className="grow">{children}</div>
        </main>
      </div>
    </>
  );
}
