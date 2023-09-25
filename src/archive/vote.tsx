import useSubmitProposalCommand from '@/features/commands/submit-proposal';
import useVoteCommand from '@/features/commands/vote.command';
import useAPI from '@/hooks/useAPI';
import { useAuth } from '@/hooks/useAuth';
import { DefaultLayout } from '@/layouts/default.layout';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAccount, useContractRead } from 'wagmi';
import config from '@/app/config';

function ProposalCard({ title, status, yesVote, noVote, description, id }) {
  useAuth();
  const account = useAccount();
  const voteCommand = useVoteCommand();

  const sendVote = async (payload) => {
    const result = await voteCommand.writeAsync?.({
      args: [payload.id, payload.vote],
    });

    Swal.fire({
      title: 'Success',
      text: 'Your vote has been submitted',
      icon: 'success',
    });
  };

  const prepareHandleVote = async (e, _vote) => {
    e.preventDefault();

    if (!account.isConnected) {
      Swal.fire({
        title: 'Error',
        text: 'You need to connect your wallet first',
        icon: 'error',
      });

      return;
    }

    const payload = {
      id: id,
      vote: Boolean(_vote),
    };

    sendVote(payload);
  };

  return (
    <div className="rounded-xl border border-white/20">
      <div className="flex items-center justify-between px-4 py-4">
        <div>
          <h1 className="mb-1 text-lg font-semibold">{title}</h1>
          <p className="my-2 text-sm text-white/80">{description}</p>
          <p className="text-sm text-white/50">
            {status ? 'Voting Contiune' : 'Vote ended'}
          </p>
        </div>
      </div>

      <hr className="border-white/20" />

      <div className="grid grid-cols-1 gap-8 px-4 py-4">
        <div className="relative flex w-full flex-col">
          <div className="flex w-full justify-between">
            <div className="flex flex-col">
              <h2>Yes Votes</h2>
              <p className="mt-1 text-sm">
                <b>{Number(yesVote)}</b>{' '}
                <span className="text-xs text-gray-100/50">
                  {yesVote
                    ? (Number(yesVote) / (Number(yesVote) + Number(noVote))) *
                      100
                    : 0}
                  %
                </span>
              </p>
            </div>
            <div className="flex flex-col">
              <h2>No Votes</h2>
              <p className="mt-1 text-sm">
                <b>{Number(noVote)}</b>{' '}
                <span className="text-xs text-gray-100/50">
                  {noVote
                    ? (Number(noVote) / (Number(yesVote) + Number(noVote))) *
                      100
                    : 0}
                  %
                </span>
              </p>
            </div>
          </div>
          <div className="relative mt-2 h-2 w-full rounded-full bg-cyan-500">
            <div
              style={{
                width: `${
                  (Number(yesVote) / (Number(yesVote) + Number(noVote))) * 100
                }%`,
              }}
              className="absolute left-0 top-0 z-20 h-2 rounded-full bg-cyan-500"
            ></div>
            <div className="absolute right-0 top-0 z-10 h-2 w-full rounded-full bg-white">
              {' '}
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2">
            <button onClick={(e) => prepareHandleVote(e, true)}>
              <i className="ri-thumb-up-line mr-2 text-xl text-white/50"></i>
            </button>
            <button onClick={(e) => prepareHandleVote(e, false)}>
              <i className="ri-thumb-down-line text-xl text-white/50"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Vote() {
  const [enabled, setEnabled] = useState(true);
  const account = useAccount({
    onConnect: () => {
      setEnabled(true);
    },
  });
  const [size, setSize] = useState(0);
  const sizeContract = useContractRead({
    address: config.VOTE_ADDRESS,
    abi: [
      {
        inputs: [
          {
            internalType: 'address',
            name: '_owner',
            type: 'address',
          },
        ],
        name: 'getNFTBalance',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'getNFTBalance',
    args: [account.address],
    enabled: enabled && account.isConnected,
    onSuccess(data) {
      setSize(Number(data));
    },
  });

  const { proposal, alchemy } = useAPI();
  const [proposals, setProposals] = useState<any[]>([]);
  const [proposalTest, setProposalTest] = useState<number>(1);
  const [proposalSend, setProposalSend] = useState<boolean>(false);
  const [proposalCount, setProposalCount] = useState(0);
  const [modal, setModal] = useState({
    active: false,
    title: '',
    description: '',
  });

  useContractRead({
    address: config.VOTE_ADDRESS,
    abi: [
      {
        inputs: [],
        name: 'proposalCount',
        outputs: [
          {
            internalType: 'uint32',
            name: '',
            type: 'uint32',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'proposalCount',
    args: [],
    enabled: true,
    onSuccess(data) {
      setProposalCount(Number(data));
    },
  });

  useContractRead({
    address: config.VOTE_ADDRESS,
    abi: [
      {
        inputs: [
          {
            internalType: 'uint32',
            name: '',
            type: 'uint32',
          },
        ],
        name: 'proposals',
        outputs: [
          {
            internalType: 'string',
            name: 'title',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'proposal',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'proposalOwner',
            type: 'address',
          },
          {
            internalType: 'uint32',
            name: 'yesVote',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'noVote',
            type: 'uint32',
          },
          {
            internalType: 'bool',
            name: 'status',
            type: 'bool',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'proposals',
    args: [proposalTest],
    enabled: proposalSend,
    onSuccess(data) {
      proposals.push(data);
    },
  });

  useEffect(() => {
    if (proposalCount > 0) {
      setProposalSend(true);

      for (let i = 1; i < proposalCount; i++) {
        setTimeout(() => {
          setProposalTest(i);
        }, 500 * i);
      }
    }
  }, [proposalCount]);

  const getPropsalCount = async () => {};

  const submitProposalCommand = useSubmitProposalCommand();

  const handleModal = (e, payload: any) => {
    e.preventDefault();

    setModal({
      ...modal,
      ...payload,
    });
  };

  const sendProposal = async () => {
    if (modal.title.length < 3) {
      return Swal.fire({
        title: 'Error',
        text: 'Title must be at least 3 characters',
        icon: 'error',
      });
    }

    if (modal.description.length < 3) {
      return Swal.fire({
        title: 'Error',
        text: 'Description must be at least 3 characters',
        icon: 'error',
      });
    }

    if (!submitProposalCommand.writeAsync) {
      const result = await submitProposalCommand.refetch();

      if (result.isError) {
        return Swal.fire({
          title: 'Error',
          text: 'Something went wrong',
          icon: 'error',
        });
      }
    }

    console.log(modal);

    const result = await submitProposalCommand.writeAsync?.({
      args: [modal.title, modal.description],
    });

    await result.wait();

    Swal.fire({
      title: 'Success',
      text: 'Your proposal has been submitted',
      icon: 'success',
    });
  };

  useEffect(() => {}, []);

  const getProposals = async () => {
    const data = await proposal.getProposals();
    data.sort((a, b) => b.id - a.id);
    setProposals(data);
  };

  return (
    <div className="mx-auto mb-8 mt-32 flex max-w-screen-2xl flex-col items-center px-8">
      <div className="grid w-full grid-cols-6 gap-4">
        <div className="col-span-4 flex flex-col rounded-md bg-neutral-950/50 px-6 py-8 backdrop-blur-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className="mr-4 h-8 w-8 rounded bg-violet-950/50"></div>

              <span className="text-xl">Samurai Conquest</span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="mt-12 h-96 w-full">
              <img
                src="https://media.discordapp.net/attachments/1097614586724765806/1097712113134358609/debb3221-7bc4-471b-8df2-0671285fb344.jpg"
                alt="Samurai Conquest"
                className="h-full w-full rounded-md object-cover"
              />
            </div>
          </div>
          <div className="mt-6 w-full">
            <div className="flex justify-between">
              <div className="text-sm text-neutral-100/50">
                {proposalCount} Proposals
              </div>
              <div className="flex items-center">
                <button className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border border-green-500/50">
                    <i className="ri-add-line text-green-500/50"></i>
                  </div>
                  <span
                    onClick={(e) => handleModal(e, { active: true })}
                    className="text-green-500/50"
                  >
                    New Proposal
                  </span>
                </button>
              </div>
            </div>
            <div className="mt-4 flex w-full flex-col gap-y-4">
              {proposals.map((x, i) => (
                <ProposalCard
                  id={i + 1}
                  title={x[0]}
                  description={x[1]}
                  status={Boolean(x[5])}
                  yesVote={Number(x[3])}
                  noVote={Number(x[4])}
                  key={i}
                ></ProposalCard>
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-2 flex flex-col gap-4">
          <div className="rounded-md bg-neutral-950/50 px-6 py-6 backdrop-blur-2xl">
            <div className="flex items-center">
              <h1 className="text-lg font-medium">My governance power</h1>
              <a
                href={`https://mumbai.polygonscan.com/address/${account.address}`}
                className="ml-auto flex items-center text-white/50"
              >
                View On Mumbaiscan
                <i className="ri-arrow-right-s-line ml-1 text-sm text-white/50"></i>
              </a>
            </div>
            <p className="mt-8 text-sm text-white/50">
              Your NFTs = <span className="text-lg">{size}</span>
            </p>
          </div>
          <div className="rounded-md bg-neutral-950/50 px-6 py-6 backdrop-blur-2xl">
            <div className="flex items-center">
              <h1 className="text-lg font-medium">DAO Wallets & Assets</h1>
              <span className="ml-auto flex items-center text-white/50">
                View
                <i className="ri-arrow-right-s-line ml-1 text-sm text-white/50"></i>
              </span>
            </div>
            <div className="mt-6 flex w-full flex-col rounded-lg bg-neutral-950 px-4 py-3">
              <h3>Treasury Balance</h3>
              <span className="mt-1 text-2xl">$96,433,926</span>
            </div>
            <div className="mt-6 flex flex-col gap-4">
              <div className="flex items-center rounded-lg border border-neutral-100/20 p-4">
                <img
                  className="h-9 w-9 object-contain"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ethereum_logo_2014.svg/1257px-Ethereum_logo_2014.svg.png"
                />
                <div className="flex flex-col">
                  <h3 className="text-sm">Ethereum</h3>
                  <span className="text-xs text-white/50">0.000000 ETH</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {modal.active && (
        <div className="fixed right-0 top-0 h-full min-h-screen w-full max-w-screen-sm bg-neutral-950/50 backdrop-blur-2xl">
          <div className="flex flex-col px-6 py-4">
            <h1 className="mt-4 text-2xl font-medium">New Proposal</h1>
            <div className="mt-6 w-full">
              <input
                onChange={(e) => handleModal(e, { title: e.target.value })}
                value={modal.title}
                className="w-full rounded-md border border-white/50 bg-neutral-950 px-4 py-3"
                placeholder="Title"
                type="text"
              />
              <div className="mt-4">
                <textarea
                  onChange={(e) =>
                    handleModal(e, { description: e.target.value })
                  }
                  value={modal.description}
                  placeholder="Proposal description..."
                  className="w-full rounded-md border border-white/50 bg-neutral-950 px-4 py-3"
                ></textarea>
              </div>
            </div>

            <div className="ml-auto flex gap-4">
              <button
                onClick={(e) => handleModal(e, { active: false })}
                className="mt-12 rounded-md bg-neutral-900/90 px-6 py-3 text-white"
              >
                Cancel
              </button>
              <button
                onClick={sendProposal}
                className="mt-12 rounded-md bg-white px-6 py-3 text-black"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Vote.getLayout = function getLayout(page) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
