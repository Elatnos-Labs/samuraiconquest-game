import { useLayout } from '@/hooks/useLayout';
import { DefaultLayout } from '@/layouts/default.layout';
import { use, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
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
  const [userdata, setUser] = useState([]);

  useEffect(() => {
    layout.update({
      messages: false,
      notifications: false,
      profile: true,
      search: false,
      wallet: true,
    });

    //updateTopRefers();
    getData();
    getUserData();
  }, []);

  const updateTopRefers = async () => {
    const data = await refer.getTopRefers();
    setTopRefers(data);
  };

  const getData = async () => {
    const res = await axios.get(
      'https://api.samuraiconquest.com/refer/' + account.address,
    );
    setInvites(res.data);
  };

  const getUserData = async () => {
    const res = await axios.get(
      'https://api.samuraiconquest.com/user/' + account.address,
    );
    setUser(res.data);
  };

  const referenceUrl = useMemo(() => {
    if (!account?.address) return '';
    if (typeof window === 'undefined') return '';

    return `${window.location.origin}/register?refer=${account?.address}`;
  }, [account]);

  const handleClick = (e: any) => {
    e.preventDefault();

    const currentDomain = window.location.origin;

    navigator.clipboard.writeText(
      `${currentDomain}/register?refer=${account?.address}`,
    );

    e.target.innerText = 'Copied!';

    e.target.value = 'Copied!';
    setTimeout(() => {
      e.target.value = referenceUrl;
      e.target.innerText = 'Copy Link';
    }, 2000);
  };

  return (
    <div className="mx-auto mt-24 flex max-w-screen-2xl flex-col gap-8 px-8 py-6">
      <div className="grid min-h-full grid-cols-9 gap-8">
        <div className="col-span-3 h-full">
          <div className="flex h-full flex-col gap-4 rounded-md bg-neutral-950/30 px-6 py-4 backdrop-blur-2xl">
            <h2 className="mb-2 text-xl font-medium">Your Account</h2>
            <div className="mt-4S flex flex-col">
              <ul className="flex flex-col gap-2">
                <li>
                  <div className="flex items-end ">
                    <span>
                      <b>Nickname:</b>
                    </span>
                    <span className="ml-auto text-lg">
                      {userdata.length > 0 ? userdata[0].nickName : ''}
                    </span>
                  </div>
                </li>
                <hr className="my-2 border-white/10" />
                <li>
                  <div className="flex items-end ">
                    <span>
                      <b>Invite Point:</b>
                    </span>
                    <span className="ml-auto text-lg">{invites.length}</span>
                  </div>
                </li>
                <hr className="my-2 border-white/10" />
                <li>
                  <div className="flex items-end ">
                    <span>
                      <b>Point:</b>
                    </span>
                    <span className="ml-auto text-lg">0 SCP</span>
                  </div>
                </li>
                <hr className="my-2 border-white/10" />
              </ul>
            </div>

            <div className="mt-12 flex flex-col gap-1">
              <span className="mb-2 text-sm">Reference Address</span>
              <input
                readOnly
                defaultValue={referenceUrl}
                onClick={handleClick}
                className="cursor-pointer rounded border border-violet-500/50 bg-black/10 px-6 py-3 font-medium backdrop-blur-2xl"
              ></input>

              <button
                onClick={handleClick}
                className="ml-auto mt-4 w-max rounded border border-violet-500/50 bg-black/10 px-6 py-3 font-medium backdrop-blur-2xl transition hover:border-violet-500/20 hover:bg-violet-500/20"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
        <div className="col-span-6">
          <div className="flex flex-col gap-8">
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
