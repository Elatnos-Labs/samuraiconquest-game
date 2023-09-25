import { AgentCard } from '@/components/marketplace/agent.card';
import useBuyNftCommand from '@/features/commands/buy-nft.command';
import { useAuth } from '@/hooks/useAuth';
import { useLayout } from '@/hooks/useLayout';
import { DefaultLayout } from '@/layouts/default.layout';
import { write } from 'fs';
import { useEffect, useState } from 'react';
import { useAccount, useBalance } from 'wagmi';

export default function Marketplace() {
  useAuth();
  const { update: updateLayout, setColor } = useLayout();
  const [nft, setNft] = useState(0);

  const account = useAccount();
  const wallet = useBalance({
    address: account.address,
  });
  const buyNftCommand = useBuyNftCommand(nft);

  const handleBuyClick = async (nft) => {
    setNft(nft);

    if (!account.isConnected) {
      return;
    }

    // TODO: this function needs to implementaion
    if (!buyNftCommand.write) {
      return;
    }

    buyNftCommand.write();
  };

  useEffect(() => {
    updateLayout({
      messages: true,
      notifications: true,
      profile: true,
      wallet: true,
      search: true,
    });
  }, []);

  return (
    <div className="mx-auto px-8 py-6 text-white">
      <div className="mt-24 flex flex-col">
        <h1 className="font-inter marketplace-animate-left text-2xl font-semibold">
          Top Collection
        </h1>
        <div className="mt-6 flex items-center justify-between">
          <div className="marketplace-animate-left flex gap-2 lg:gap-4">
            <button className="font-inter h-12 min-w-[3rem] rounded-full bg-violet-500 px-5 py-3 lg:min-w-[6rem]">
              Female
            </button>
            <button className="font-inter h-12 min-w-[3rem] rounded-full border border-violet-500/10 bg-neutral-900/50 px-5 py-3 font-medium backdrop-blur-sm transition hover:bg-violet-500 lg:min-w-[6rem]">
              Male
            </button>
            <button className="font-inter h-12 min-w-[3rem] rounded-full border border-violet-500/10 bg-neutral-900/50 px-5 py-3 font-medium backdrop-blur-sm transition hover:bg-violet-500 lg:min-w-[6rem]">
              Super Hero
            </button>
            <button className="font-inter h-12 min-w-[3rem] rounded-full border border-violet-500/10 bg-neutral-900/50 px-5 py-3 font-medium backdrop-blur-sm transition hover:bg-violet-500 lg:min-w-[6rem]">
              Legendary
            </button>
          </div>
          <button className="marketplace-animate-right font-inter h-12 min-w-[6rem] rounded-full border border-violet-500/10 bg-neutral-900/50 px-6 py-3 font-medium backdrop-blur-3xl transition hover:bg-violet-500">
            View All
          </button>
        </div>

        <div className="marketplace-fade-in mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
          {new Array(99).fill(0).map((_, i) => (
            <AgentCard
              onClick={handleBuyClick}
              index={i + 1}
              key={i}
            ></AgentCard>
          ))}
        </div>
      </div>
    </div>
  );
}

Marketplace.getLayout = (page: JSX.Element) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};
