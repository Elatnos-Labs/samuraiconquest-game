import config from '@/app/config';
import { useState } from 'react';
import { useContractRead } from 'wagmi';

export function useFetchSamurai({ id, onSuccess }) {
  const [samurai, setSamurai] = useState<any>(null);

  const contract = useContractRead({
    address: config.GAME_ADDRESS as any,
    abi: [
      {
        inputs: [
          {
            internalType: 'uint256',
            name: '_id',
            type: 'uint256',
          },
        ],
        name: 'viewSamurai',
        outputs: [
          {
            components: [
              {
                internalType: 'uint256',
                name: 'season',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'lightStones',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'campTime',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'deploymentTime',
                type: 'uint256',
              },
              {
                internalType: 'address',
                name: 'owner',
                type: 'address',
              },
              {
                internalType: 'uint8',
                name: 'location',
                type: 'uint8',
              },
              {
                internalType: 'uint8',
                name: 'attack',
                type: 'uint8',
              },
              {
                internalType: 'uint8',
                name: 'defence',
                type: 'uint8',
              },
              {
                internalType: 'uint8',
                name: 'chakra',
                type: 'uint8',
              },
              {
                internalType: 'uint8',
                name: 'maxAgility',
                type: 'uint8',
              },
              {
                internalType: 'uint8',
                name: 'currentAgility',
                type: 'uint8',
              },
              {
                internalType: 'bool',
                name: 'isInjured',
                type: 'bool',
              },
              {
                internalType: 'uint8',
                name: 'status',
                type: 'uint8',
              },
            ],
            internalType: 'struct Registration.Samurai',
            name: '',
            type: 'tuple',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'viewSamurai',
    args: [BigInt(Number(id))],
    enabled: true,

    onSuccess: (data: any) => {
      const payload = {
        Season: Number(data.season),
        LightStones: Number(data.lightStones),
        Chakra: Number(data.chakra),
        Attack: Number(data.attack),
        Defence: Number(data.defence),
        MaxAgility: Number(data.maxAgility),
        CurrentAgility: Number(data.currentAgility),
        Location: Number(data.location),
        Status: Number(data.status),
        // IsInjured: data.isInjured,
        CampTime: Number(data.campTime),
        DeploymentTime: Number(data.deploymentTime),
        Owner: data.owner,
        Id: id,
        id: id,
      };

      setSamurai(payload);

      onSuccess && onSuccess(payload);
    },
  });

  return {
    samurai,
    contract,
    setSamurai,
  };
}
