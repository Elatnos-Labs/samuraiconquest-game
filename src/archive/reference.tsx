import { useLayout } from '@/hooks/useLayout';
import { DefaultLayout } from '@/layouts/default.layout';
import { useEffect, useState } from 'react';

import { Player } from '@lottiefiles/react-lottie-player';
import Comment from '@/assets/lottie/Comment.json';
import { useAccount } from 'wagmi';
import useAPI from '@/hooks/useAPI';
import { useAuth } from '@/hooks/useAuth';

export default function Reference() {
  useAuth();
  const account = useAccount();
  const layout = useLayout();
  const { refer } = useAPI();
  const [topRefers, setTopRefers] = useState([]);
  const [invites, setInvites] = useState([]);

  useEffect(() => {
    layout.update({
      messages: false,
      notifications: false,
      profile: true,
      search: false,
      wallet: true,
    });

    updateTopRefers();
  }, []);

  const updateTopRefers = async () => {
    const data = await refer.getTopRefers();
    setTopRefers(data);
  };

  const updateInvites = async () => {
    const data = await refer.getRefer(account.address);
    setInvites(data);
  };

  const handleClick = () => {
    const currentDomain = window.location.origin;

    navigator.clipboard.writeText(
      `${currentDomain}/register?refer=${account?.address}`,
    );
  };

  return (
    <div className="mx-auto mt-24 flex max-w-screen-2xl flex-col gap-8 px-8 py-6">
      <div className="grid min-h-full grid-cols-9 gap-8">
        <div className="col-span-3 h-full">
          <div className="flex h-full flex-col gap-4 rounded-md bg-neutral-950/30 px-6 py-4 backdrop-blur-2xl">
            <h2 className="mb-2 text-xl font-medium">Your Account</h2>
            <p>
              In order to track your ZETA points, you must verify your wallet
              and Twitter.
            </p>

            <div className="mt-12 flex flex-col">
              <ul className="flex flex-col gap-2">
                <li>
                  <div className="flex items-end ">
                    <span>
                      <b>Nickname:</b>
                    </span>
                    <span className="ml-auto text-lg">Aloshai</span>
                  </div>
                </li>
                <li>
                  <div className="flex items-end ">
                    <span>
                      <b>Invite Point:</b>
                    </span>
                    <span className="ml-auto text-lg">73</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="mt-auto flex flex-col gap-2">
              <button
                onClick={handleClick}
                className="rounded bg-blue-500/50 px-6 py-3 font-medium backdrop-blur-2xl"
              >
                <i className="ri-twitter-fill mr-2"></i>
                Share on Twitter
              </button>

              <button
                onClick={handleClick}
                className="rounded bg-violet-500/50 px-6 py-3 font-medium backdrop-blur-2xl"
              >
                Copy Your Refer Link
              </button>
            </div>
          </div>
        </div>
        <div className="col-span-6">
          <div className="flex flex-col gap-8">
            <div className="items-end rounded-md bg-neutral-950/30 px-8  py-5 backdrop-blur-2xl">
              <div className="flex items-end justify-between">
                <h2 className="text-xl">Top Accounts</h2>
              </div>

              <div className="mt-6 w-full">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-800 text-left">
                      <th className="pb-2">Address</th>
                      <th className="pb-2">SC Points</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-neutral-900 text-sm">
                    {topRefers.map((x, i) => (
                      <tr key={i}>
                        <td className="py-3">{x[0]}</td>
                        <td className="py-3">{x[1]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex min-h-[256px] flex-col rounded-md bg-neutral-950/30  px-8 py-5 backdrop-blur-2xl">
              <div className="flex items-end justify-between">
                <h2 className="text-xl">Your Invites</h2>
              </div>

              <div className="mt-6 w-full">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-800 text-left">
                      <th className="pb-2">Nickname</th>
                      <th className="pb-2">Address</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-neutral-900 text-sm">
                    {invites.map((x, i) => (
                      <tr key={i}>
                        <td className="py-3">{x.nickName}</td>
                        <td className="py-3">{x.address}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Reference.getLayout = function getLayout(page) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
