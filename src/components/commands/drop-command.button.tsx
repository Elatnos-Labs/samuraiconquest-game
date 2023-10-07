import useDropCommand from '@/features/commands/drop.command';
import { useGame } from '@/hooks/useGame';
import { useRefetchSamuraiV2 } from '@/hooks/useRefetchSamuraiV2';
import { waitForTransaction } from 'wagmi/actions';
import classNames from 'classnames';
import { useAccount } from 'wagmi';

export function DropButtonCommand() {
  const refetchSamurai = useRefetchSamuraiV2();

  const { game } = useGame();
  const account = useAccount();

  const { isError, data, isLoading, isSuccess, writeAsync, error } =
    useDropCommand();

  const handleClick = async (e) => {
    e.preventDefault();

    if (!account.isConnected) {
      return;
    }

    if (!game.samurai) {
      return;
    }

    const _result = await writeAsync({
      args: [BigInt(game.samurai.Id)],
    });

    const transaction = await waitForTransaction({
      hash: _result?.hash,
    });

    if (transaction.status != 'success') return;

    await refetchSamurai.refetchSamurai(game.samurai.Id);
  };

  const className = classNames(
    'flex items-center justify-center rounded-full  px-4 py-2',
    {
      'bg-neutral-950/50': isSuccess,
      'bg-neutral-950/10': isLoading,
      'bg-neutral-950/20': !isLoading && !isSuccess,
      'bg-red-500/50': isError,
    },
  );

  return (
    <button onClick={handleClick} disabled={isLoading} className={className}>
      <i className="ri-landscape-line mr-1 text-2xl"></i>
      <span>
        {isLoading ? 'Droping...' : isSuccess && !isLoading ? 'Droped' : 'Drop'}
      </span>
    </button>
  );
}
