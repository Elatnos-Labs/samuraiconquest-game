// import useHealCommand from '@/features/commands/heal.command';
// import { useGame } from '@/hooks/useGame';
// import { useRefetchSamuraiV2 } from '@/hooks/useRefetchSamuraiV2';
// import { waitForTransaction } from 'wagmi/actions';
// import classNames from 'classnames';
// import { useAccount } from 'wagmi';

// export function HealCommandButton() {
//   const refetchSamurai = useRefetchSamuraiV2();

//   const { game } = useGame();
//   const account = useAccount();

//   const { isError, data, writeAsync, error } = useHealCommand();

//   const handleClick = async (e) => {
//     e.preventDefault();

//     if (!account.isConnected) {
//       return;
//     }

//     if (!game.samurai) {
//       return;
//     }

//     const _result = await writeAsync({
//       args: [BigInt(game.samurai.Id)],
//     });

//     const transaction = await waitForTransaction({
//       hash: _result.hash,
//     });

//     if (transaction.status != 'success') return;

//     await refetchSamurai.refetchSamurai(game.samurai.Id);
//   };

//   const className = classNames(
//     'flex items-center justify-center rounded-full  px-4 py-2 bg-neutral-950/50',
//   );

//   return (
//     <button onClick={handleClick} className={className}>
//       <i className="ri-landscape-line mr-1 text-2xl"></i>
//       <span>Heal</span>
//     </button>
//   );
// }
