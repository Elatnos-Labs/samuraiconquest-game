import { useContractWrite, useWaitForTransaction } from 'wagmi';
import Config from '@/app/config';

const useCampCommand = () => {
  const { data, error, isError, writeAsync } = useContractWrite({
    address: Config.GAME_ADDRESS as any,
    abi: [
      {
        inputs: [
          {
            internalType: 'uint256',
            name: '_id',
            type: 'uint256',
          },
        ],
        name: 'camp',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    functionName: 'camp',
    mode: 'recklesslyUnprepared',
  });

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return { data, error, isError, isLoading, isSuccess, writeAsync };
};

export default useCampCommand;
