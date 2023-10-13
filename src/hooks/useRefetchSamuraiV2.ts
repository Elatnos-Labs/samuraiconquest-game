import config from '@/app/config';
import { useGame } from './useGame';
import { readContract } from 'wagmi/actions';

export function useRefetchSamuraiV2() {
  const { setSamurai, updateOrCreateDeck } = useGame();

  async function refetchSamurai(id: number) {
    const contract: any = await readContract({
      address: config.GAME_ADDRESS as any,
      abi: [
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_id",
              type: "uint256"
            }
          ],
          name: "viewSamurai",
          outputs: [
            {
              components: [
                {
                  internalType: "uint256",
                  name: "season",
                  type: "uint256"
                },
                {
                  internalType: "uint256",
                  name: "lightStones",
                  type: "uint256"
                },
                {
                  internalType: "uint256",
                  name: "campTime",
                  type: "uint256"
                },
                {
                  internalType: "uint256",
                  name: "deploymentTime",
                  type: "uint256"
                },
                {
                  internalType: "address",
                  name: "owner",
                  type: "address"
                },
                {
                  internalType: "uint8",
                  name: "location",
                  type: "uint8"
                },
                {
                  internalType: "uint8",
                  name: "attack",
                  type: "uint8"
                },
                {
                  internalType: "uint8",
                  name: "defence",
                  type: "uint8"
                },
                {
                  internalType: "uint8",
                  name: "chakra",
                  type: "uint8"
                },
                {
                  internalType: "uint8",
                  name: "maxAgility",
                  type: "uint8"
                },
                {
                  internalType: "uint8",
                  name: "currentAgility",
                  type: "uint8"
                },
                {
                  internalType: "uint8",
                  name: "status",
                  type: "uint8"
                }
              ],
              internalType: "struct Registration.Samurai",
              name: "",
              type: "tuple"
            }
          ],
          stateMutability: "view",
          type: "function"
        }

      ],
      functionName: 'viewSamurai',
      args: [BigInt(Number(id))],
    });

    const payload = {
      Season: Number(contract.season),
      LightStones: Number(contract.lightStones),
      Chakra: Number(contract.chakra),
      Attack: Number(contract.attack),
      Defence: Number(contract.defence),
      MaxAgility: Number(contract.maxAgility),
      CurrentAgility: Number(contract.currentAgility),
      Location: Number(contract.location),
      Status: Number(contract.status),
      // IsInjured: contract.isInjured,
      CampTime: Number(contract.campTime),
      DeploymentTime: Number(contract.deploymentTime),
      Owner: contract.owner,
      Id: id,
      id: id,
    };

    updateOrCreateDeck(payload);
    setSamurai(payload);
  }

  return {
    refetchSamurai,
  };
}
