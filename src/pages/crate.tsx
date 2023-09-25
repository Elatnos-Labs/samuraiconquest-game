import { DefaultLayout } from '@/layouts/default.layout';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Sword from '@/assets/pngegg_5.png';
import classNames from 'classnames';
import { useLayout } from '@/hooks/useLayout';
import useMintCommand from '@/features/commands/mint.command';
import useOpenboxCommand from '@/features/commands/open-box.command';
import { useAccount, useWaitForTransaction } from 'wagmi';
import { useAuth } from '@/hooks/useAuth';
import { alchemy } from '@/features/api/alchemy.api';
import config from '@/app/config';
import { waitForTransaction } from '@wagmi/core';

export function CrateCard({ minted, setMint, id }: any) {
  const account = useAccount();
  const { setColor } = useLayout();
  const openBoxCommand = useOpenboxCommand();
  const [active, setActive] = useState(false);

  const [data, setData] = useState<any>(null);

  const classStyle = classNames(
    'crate-inital-animation flex h-[26rem] w-64 items-center justify-center z-50 pointer-events-auto mt-4',
    {
      active: minted == id,
      '': minted != id || !active,
      'animation-shake': active,
    },
  );

  async function handleClick() {
    if (!account.isConnected) {
      return;
    }

    setActive(true);

    await openBoxCommand.writeAsync({
      args: [id],
    });
  }

  useEffect(() => {
    if (!openBoxCommand.isSuccess) {
      return;
    }

    (async () => {
      const boxResult = await alchemy.nft.getNftMetadata(
        config.SAMURAI_WARRIORS_ADDRESS,
        id,
      );

      setData(boxResult.rawMetadata);

      setActive(false);

      setTimeout(() => {
        setMint(id);
      }, 1000);
    })();
  }, [openBoxCommand.isSuccess]);

  useEffect(() => {
    if (minted == id) {
      const element = document.getElementById(`crate-card-${id}`);
      const inventory = document.getElementById(`inventory`);

      if (element && inventory) {
        element.style.transition = 'all 0.5s ease-in-out';
        element.style.position = 'fixed';
        element.style.top = `${element.offsetTop}px`;
        element.style.left = `${element.offsetLeft}px`;
        setColor('red');
      }

      setTimeout(() => {
        element.style.top = `${inventory.clientTop}px`;
        element.style.left = `${inventory.clientLeft}px`;
        element.style.transform = 'translate(-50%, -50%)';
        element.style.scale = '0.1';
        element.style.opacity = '0';
        setColor('violet');
      }, 5000);
    }
  }, [minted]);

  return (
    <button
      id={`crate-card-${id}`}
      data-delay={`${id}s`}
      onClick={() => handleClick()}
      className={classStyle}
    >
      <div className="crate-front">
        <div className="text flex h-full w-full items-center justify-center rounded-md p-4">
          <Image
            className="h-72 w-48 object-contain grayscale-[100%]"
            alt="test"
            src={Sword}
          />
        </div>
        <div className="absolute bottom-0 left-1/2 text-white/50">#{id}</div>
      </div>
      {data && (
        <div className="crate-back">
          <div className="h-full w-full rounded-md bg-neutral-950 p-4">
            <img
              className="h-54 w-full rounded-md object-cover"
              src={'/art/' + id + '.png'}
              alt=""
            />
            <h1 className="mb-2 mt-4 w-full text-center text-xl font-semibold">
              {data.name}
            </h1>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="mb-1 flex items-center text-red-500">
                  <i className="ri-sword-fill mr-1"></i>{' '}
                  <span className="text-sm">{data.attributes[3].value}</span>
                </span>
                <div className="h-2 rounded-full bg-neutral-800">
                  <div
                    className="stats h-2 rounded-full bg-red-500"
                    style={{ maxWidth: `${data.attributes[3].value * 5}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="mb-1 flex items-center text-blue-500">
                  <i className="ri-shield-fill mr-1"></i>{' '}
                  <span className="text-sm">{data.attributes[1].value}</span>
                </span>
                <div className="h-2 rounded-full bg-neutral-800">
                  <div
                    className="stats h-2 rounded-full bg-blue-500"
                    style={{ maxWidth: `${data.attributes[1].value * 5}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="mb-1 flex items-center text-yellow-500">
                  <i className="ri-sword-fill mr-1"></i>{' '}
                  <span className="text-sm">{data.attributes[0].value}</span>
                </span>
                <div className="h-2 rounded-full bg-neutral-800">
                  <div
                    className="stats h-2 rounded-full bg-yellow-500"
                    style={{ maxWidth: `${data.attributes[0].value * 5}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="mb-1 flex items-center text-green-500">
                  <i className="ri-sword-fill mr-1"></i>{' '}
                  <span className="text-sm">{data.attributes[2].value}</span>
                </span>
                <div className="h-2 rounded-full bg-neutral-800">
                  <div
                    className="stats h-2 rounded-full bg-green-500"
                    style={{ maxWidth: `${data.attributes[2].value * 5}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </button>
  );
}

export function CrateWrapper({ boxs }: any) {
  const [minted, setMinted] = useState(null);

  return (
    <div className="pointer-events-none grid grid-cols-3 gap-x-4 gap-y-4">
      {boxs.map((box, i) => {
        return (
          <CrateCard
            key={i}
            minted={minted}
            setMint={setMinted}
            id={box.tokenId}
          ></CrateCard>
        );
      })}
    </div>
  );
}

export default function Crate() {
  useAuth();
  const layout = useLayout();

  const account = useAccount();
  const mintCommand = useMintCommand();

  const [boxs, setBoxs] = useState([]);

  useEffect(() => {
    layout.update({
      search: false,
      messages: true,
      notifications: true,
      profile: true,
      wallet: true,
    });

    updateBoxs();
  }, []);

  useEffect(() => {
    if (!mintCommand.isSuccess) {
      return;
    }

    updateBoxs();
  }, [mintCommand.isSuccess]);

  const handleMint = async () => {
    if (!account.isConnected) {
      return;
    }

    if (!mintCommand) {
      return;
    }

    const result = await mintCommand.writeAsync({
      args: [account.address],
    });
  };

  const updateBoxs = async () => {
    const result = await alchemy.nft.getNftsForOwner(account.address, {
      contractAddresses: [config.SAMURAI_CARD],
    });

    setBoxs(result.ownedNfts);
  };

  return (
    <section className="mx-auto mb-8 mt-32 flex max-w-screen-2xl flex-col items-center px-8">
      <div className="rounded-md bg-neutral-950/50 px-8 py-6">
        <h1 className="mb-4 text-2xl font-semibold">Mysterious cards</h1>
        <p className="w-1/2 text-lg">
          The Samurai NFTs that emerge from within are poised to become the stars of the battle game!
          This mysterious card invites you to forge bonds with the game's fiercest and most reliable comrades. Join forces and embark on epic adventures together!
        </p>
      </div>
      <div className="relative my-6 grid min-h-[512px] w-full grid-cols-3 gap-6">
        <div className="col-span-1 h-max rounded-md bg-neutral-950/50 px-8 py-6">
          <h1 className="text-2xl font-semibold">Boxes</h1>
          <div className="mt-6 grid w-full grid-cols-1 gap-6">
            <div className="col-span-1 mx-auto flex max-w-xs flex-col items-center justify-center rounded-md border border-violet-500/50 px-4 py-4">
              <div
                style={{
                  transformStyle: 'preserve-3d',
                  transform: 'rotateX(45deg) rotateZ(45deg) translateY(-10px)',
                }}
                className="flex h-44 w-28 items-center justify-center rounded bg-neutral-800"
              >
                <Image
                  className=" h-32 w-20 object-contain grayscale-[100%]"
                  alt="test"
                  src={Sword}
                />
              </div>

              <div className="mt-2 flex flex-col text-center">
                <h5 className="text-xl font-medium">Legendary Card</h5>
                <p className="mt-4 text-white/50">
                  This card opens the door for you to explore the game's mightiest and most distinctive characters.
                </p>
                <button
                  onClick={handleMint}
                  className="ml-auto mt-12 rounded-md bg-violet-900 px-12 py-3"
                >
                  {mintCommand.isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border border-t-2 border-violet-900 border-t-white"></div>
                      Minting
                    </div>
                  ) : mintCommand.isError ? (
                    <div className="flex items-center justify-center">
                      <div className="mr-2 h-4 w-4 rounded-full border border-t-2 border-violet-900 border-t-white"></div>
                      Error
                    </div>
                  ) : mintCommand.isSuccess ? (
                    <div className="flex items-center justify-center">
                      Minted
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">Mint</div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2 flex flex-col rounded-md bg-neutral-950/50 px-8 py-6">
          <h1 className="mb-8 text-2xl font-semibold">My Boxes</h1>
          <CrateWrapper boxs={boxs} />
        </div>
      </div>
    </section>
  );
}

Crate.getLayout = function getLayout(page) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
