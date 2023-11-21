'use client';

import useRegisterCommand from '@/features/commands/register.command';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import localFont from 'next/font/local';
import { useAuth } from '@/hooks/useAuth';
import { LoginConnectButton } from '@/components/rainbow/login-connect-button.component';
import Swal from 'sweetalert2';
import Link from 'next/link';

import { SnickerdoodleWebIntegration } from '@snickerdoodlelabs/web-integration';
import { EVMContractAddress } from '@snickerdoodlelabs/objects';

import { useEthersSigner } from '../components/ethers';
import { bscTestnet } from 'wagmi/chains';

const myFont = localFont({
  src: '../assets/font.otf',
});

export default function Register() {
  useAuth();
  const [connected, setConnected] = useState(false);
  const account = useAccount({
    onConnect: () => {
      setConnected(true);
    },
  });
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const refer =
    (router.query.refer as string) ||
    '0xF0b92297C8fFBD5014d94A57569ccA2ff82910Af';

  useEffect(() => {
    setConnected(account.isConnected);
  }, []);

  const ethersSigner = useEthersSigner();
  const { isConnected } = useAccount();
  const network = useNetwork();

  // This shows how to authenticate the user's account with an Ethers signer
  // This option will present the user with a Snickerdoodle controlled personal sign message
  useEffect(() => {
    if (isConnected) {
      const webIntegration = new SnickerdoodleWebIntegration(
        {
          consentAddress: EVMContractAddress(
            '0x40e2C538478F743161c7Bf29eF21A5C06DE805fA',
          ),
        },
        ethersSigner,
      );
      webIntegration.initialize();
    }
  }, [isConnected, ethersSigner]);

  const registerCommand = useRegisterCommand();

  const handleClick = async () => {
    if (!account.isConnected) {
      return;
    }

    if (!nickname) {
      return;
    }

    const writeResult = await registerCommand.writeAsync({
      args: [nickname, refer as any],
    });
  };

  useEffect(() => {
    if (registerCommand.isSuccess) {
      router.push('/');
    }
  }, [registerCommand.isSuccess]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <video
        className="fixed left-0 top-0 h-full w-full object-cover blur-sm"
        autoPlay
        muted
      >
        <source src="/output.mp4" type="video/mp4" />
      </video>

      <div className="z-50 grid w-full max-w-screen-xl grid-cols-3 gap-8">
        <div
          className={
            'z-50 col-span-3 w-full text-center text-[8rem] text-white ' +
            myFont.className
          }
        >
          Samurai Conquest
        </div>
        <div className="rounded-md bg-neutral-950/20 px-8 py-6 backdrop-blur-3xl">
          <div className={'text-4xl text-white ' + myFont.className}>
            Samurai Conquest
          </div>
          <p className="mt-4">
            Legendary battle where strategy and NFT meet! Embark on an adventure
            full of politics and strategy in this game where each kingdom has
            its own community. Kingdoms act together with their communities as
            they develop Defensive, Offensive and Farming strategies on the
            hexagonal game map. Players must regularly move to certain hexagons,
            defending, farming or attacking territories, as if moving chess
            pieces. In the game, kingdoms must manage their resources
            effectively and capture the map. Once a hexagon is captured, it must
            be both defended and developed. The main goal in the universe is not
            just to attack, but to develop a strategy.
          </p>
        </div>
        <div className="col-span-2 flex items-center justify-center rounded-md border border-violet-500/10 bg-neutral-950/20 px-8 py-6 backdrop-blur-3xl">
          {(!connected || network.chain?.id != bscTestnet.id) && (
            <LoginConnectButton></LoginConnectButton>
          )}
          {connected && network.chain && network.chain.id == bscTestnet.id && (
            <div className="flex h-full w-full flex-col gap-8">
              <div className={'text-4xl text-white ' + myFont.className}>
                Nickname
              </div>

              <div className="flex flex-col gap-4">
                <input
                  onChange={(e) => setNickname(e.target.value)}
                  value={nickname}
                  className="w-full rounded-md bg-neutral-950/20 px-8 py-6 backdrop-blur-3xl"
                  type="text"
                  placeholder="Enter your nickname"
                />
              </div>
              <button
                onClick={handleClick}
                disabled={!nickname && registerCommand.isLoading}
                className="ml-auto mt-auto rounded-md bg-neutral-950/50 px-12 py-3 text-white"
              >
                {registerCommand.isLoading && (
                  <i className="ri-loader-4-line mr-2 animate-spin"></i>
                )}
                Register
              </button>
            </div>
          )}
        </div>
        <div className="z-50 col-span-3 flex items-center gap-4">
          <Link
            active-class="!text-violet-500"
            href="https://linktr.ee/samuraiconquest"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-950/50"
          >
            <i className="ri-links-line text-2xl"></i>
          </Link>
          <Link
            active-class="!text-violet-500"
            href="https://samuraiconquest.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-950/50"
          >
            <i className="ri-pages-fill text-2xl"></i>
          </Link>
          <Link
            active-class="!text-violet-500"
            href="https://twitter.com/ConquestSamurai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-950/50"
          >
            <i className="ri-twitter-fill text-2xl"></i>
          </Link>
          <Link
            active-class="!text-violet-500"
            href="https://discord.gg/wkdUvWEv"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-950/50"
          >
            <i className="ri-discord-fill text-2xl"></i>
          </Link>
          <Link
            active-class="!text-violet-500"
            href="https://t.me/samuraiconquestofficial"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-950/50"
          >
            <i className="ri-telegram-line text-2xl"></i>
          </Link>
          <Link
            active-class="!text-violet-500"
            href="https://drive.google.com/file/d/1bGhG1iwm43-XcNAl1Z7V5quyUv13jfkd/view"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-950/50"
          >
            <i className="ri-newspaper-fill text-2xl"></i>
          </Link>

          <div className="relative z-40 ml-auto flex h-12 items-center justify-center overflow-hidden rounded-full bg-neutral-950/50 px-32">
            <div
              style={{
                clipPath: 'polygon(0 0, 100% 0%, 75% 100%, 0% 100%)',
              }}
              className="absolute left-0 h-full w-1/2 bg-blue-500/40"
            ></div>
            <span className="z-50">Donate</span>
          </div>
        </div>
      </div>
    </div>
  );
}
