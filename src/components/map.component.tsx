import * as THREE from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky.js';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { DeployCommandButton } from './commands/deploy-command.button';
import { MoveCommandButton } from './commands/move-command.button';
import { HealCommandButton } from './commands/heal-command.button';
import { CampCommandButton } from './commands/camp-command.button';
import { useGame } from '@/hooks/useGame';
import { UncampCommandButton } from './commands/uncamp-command.button';
import { DropButtonCommand } from './commands/drop-command.button';
import useAPI from '@/hooks/useAPI';
import { useUser } from '@/hooks/useUser';
import { UndeployCommandButton } from './commands/undeploy-command.button';
import { CollectCommandButton } from './commands/collect.button';
import { prepareMove } from '@/features/commands/move.command';
import { useContractRead } from 'wagmi';
import EventEmitter from 'events';

import config from '@/app/config';

import Stats from 'stats.js';
import { useFetchSamurai } from '@/features/useFetchSamurai';
import { gsap } from 'gsap';

const DateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export function LandCard() {
  const { game } = useGame();

  return (
    <div className="map-agent-in absolute bottom-0 flex w-full justify-center">
      <div className="mx-auto flex w-full max-w-screen-md items-center rounded-t-xl bg-neutral-950/50 px-6 py-6 backdrop-blur-2xl">
        <div className="flex w-max flex-col">
          <Image
            width={256}
            height={256}
            className="h-20 w-20 rounded-2xl"
            alt="test"
            src={'/art/' + game.samurai.Id + '.png'}
          />
          <div className="flex flex-col items-center">
            <div className="mt-1 w-full">
              <span className="mb-0.5 flex items-center text-yellow-500">
                <i className="ri-run-fill mr-1"></i>{' '}
                <span className="text-sm">
                  {game.samurai.CurrentAgility}/{game.samurai.MaxAgility}
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className="ml-4 flex h-full flex-col">
          <h4 className="font-medium">SamuraiWarrior #{game.samurai.Id}</h4>
          <p
            className={
              'mt-1 text-sm ' +
              (game.samurai.IsInjured == true
                ? 'text-red-500'
                : 'text-green-500')
            }
          >
            <span>Health: </span>
            {game.samurai?.IsInjured ? 'Injured' : 'Healtly'}
          </p>
          <p className="mt-1 text-sm">
            <span>Status: </span>
            {game.samurai?.Status == 1
              ? 'In War'
              : game.samurai?.Status == 2
                ? 'Camp'
                : 'Available'}
          </p>
          {(game.samurai?.Status == 1 || game.samurai?.Status == 2) && (
            <p>
              {DateFormatter.format(
                new Date(
                  game.samurai.Status == 2
                    ? Number(game.samurai.CampTime * 1000)
                    : Number(game.samurai.DeploymentTime * 1000),
                ),
              )}
            </p>
          )}
        </div>
        <div className="ml-auto grid w-full max-w-sm grid-cols-2 gap-4">
          <div className="col-span-1">
            <span className="mb-1 flex items-center text-red-500">
              <i className="ri-sword-fill mr-1"></i>{' '}
              <span className="text-sm">{game.samurai.Attack}</span>
            </span>
            <div className="h-2 rounded-full bg-neutral-800">
              <div
                className="stats h-2 rounded-full bg-red-500"
                style={{ maxWidth: game.samurai.Attack * 10 + '%' }}
              ></div>
            </div>
          </div>
          <div className="col-span-1">
            <span className="mb-1 flex items-center text-blue-500">
              <i className="ri-shield-fill mr-1"></i>{' '}
              <span className="text-sm">{game.samurai.Defence}</span>
            </span>
            <div className="h-2 rounded-full bg-neutral-800">
              <div
                className="stats h-2 rounded-full bg-green-500"
                style={{ maxWidth: game.samurai.Defence * 10 + '%' }}
              ></div>
            </div>
          </div>
          <div className="col-span-1">
            <span className="mb-1 flex items-center text-yellow-500">
              <i className="ri-fire-fill mr-1"></i>{' '}
              <span className="text-sm">{game.samurai.Chakra}</span>
            </span>
            <div className="h-2 rounded-full bg-neutral-800">
              <div
                className="stats h-2 rounded-full bg-blue-500"
                style={{ maxWidth: game.samurai.Chakra * 10 + '%' }}
              ></div>
            </div>
          </div>
          <div className="col-span-1">
            <span className="mb-1 flex items-center text-green-500">
              <i className="ri-flashlight-fill mr-1"></i>{' '}
              <span className="text-sm">{game.samurai.CurrentAgility}</span>
            </span>
            <div className="h-2 rounded-full bg-neutral-800">
              <div
                className="stats h-2 rounded-full bg-yellow-500"
                style={{ maxWidth: game.samurai.CurrentAgility * 5 + '%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DeckItem({ id, onClick }) {
  const game = useGame();
  const fetchSamurai = useFetchSamurai({
    id,
    onSuccess: (data) => {
      console.log('deck item', data);
      game.updateOrCreateDeck(data);
    },
  });

  if (fetchSamurai.contract.isLoading) {
    return (
      <button className="flex items-center justify-center rounded-full border-4 border-neutral-800 border-l-blue-500 border-r-red-500">
        <i className="ri-loader-4-line animate-spin text-2xl"></i>
      </button>
    );
  }

  return (
    <button
      onClick={() => onClick(id, fetchSamurai.samurai)}
      className="rounded-full border-4 border-neutral-800 border-l-blue-500 border-r-red-500"
    >
      <Image
        height={56}
        width={56}
        className="h-14 w-14 rounded-full"
        alt="test"
        src={'/art/' + id + '.png'}
      />
    </button>
  );
}

export function Map() {
  const user = useUser();
  const [area, setArea] = useState(null);
  const [sideMeshes, setSideMeshes] = useState([]);

  const [eventEmitter, setEventEmitter] = useState(new EventEmitter());

  const { game, setLand, setSamurai, setLands, setClans, updateOrCreateDeck } =
    useGame();
  const { land: landAPI, user: userApi } = useAPI();
  const [locations, setLocations] = useState([]);
  const [deckIDS, setDeckIDS] = useState([]);

  const [selectedAgent, setSelectedAgent] = useState(-1);

  const [landModal, setLandModal] = useState(false);

  useContractRead({
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
    args: [BigInt(Number(selectedAgent))],
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
        IsInjured: data.isInjured,
        CampTime: Number(data.campTime),
        DeploymentTime: Number(data.deploymentTime),
        Owner: data.owner,
        Id: selectedAgent,
        id: selectedAgent,
      };

      setSamurai(payload);

      if (payload.Location != 0) {
        setArea(payload.Location);
        eventEmitter.emit('selectArea', payload.Location);
      }
    },
  });

  const onAgentSelect = async (data) => {
    setSelectedAgent(data);
  };

  const onAreaSelect = (id: string) => {
    if (!id) {
      return;
    }

    setArea(Number(id));
  };

  useEffect(() => {
    onAreaChanged(area);
  }, [area]);

  const onAreaChanged = async (id: number) => {
    if (id == null) {
      setLandModal(false);
      return;
    }

    let landData: any = await landAPI.getLand(id);

    landData = landData[0];

    if (!landModal) {
      setLandModal(true);
    }

    if (landData) {
      setLand(landData);

      // Işığı eklemek için gerekli işlemler
      const selectedHexagon = locations.find((hexagon) => hexagon.id === id);

      // Eğer seçili hexagon üzerinde bir ışık varsa, önce onu kaldıralım
      if (selectedHexagon) {
        const hexagonPosition = selectedHexagon.location;

        // Koni geometrisi ve malzemesi oluşturun
        const coneGeometry = new THREE.ConeGeometry(10, 20, 32);
        const coneMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

        // Seçili alanın merkez noktasını hesaplayın
        const centerPoint = new THREE.Vector3();
        selectedHexagon.mesh.geometry.computeBoundingBox();
        selectedHexagon.mesh.geometry.boundingBox!.getCenter(centerPoint);

        // Koni nesnesini oluşturun
        const coneMesh = new THREE.Mesh(coneGeometry, coneMaterial);
        coneMesh.rotation.z = THREE.MathUtils.degToRad(90);
        coneMesh.rotation.x = THREE.MathUtils.degToRad(-90);

        // Koni nesnesinin pozisyonunu seçilen alanın merkezine ayarlayın
        coneMesh.position.copy(centerPoint);
        coneMesh.position.x += 10;
        selectedHexagon.mesh.add(coneMesh);
      }

      // Diğer alanlardaki konileri kaldırın
      locations.forEach((hexagon) => {
        if (hexagon.id !== id && hexagon.mesh.children.length > 0) {
          hexagon.mesh.remove(hexagon.mesh.children[0]);
        }
      });
    } else {
      setLand(null);
    }
  };

  // onAreaChanged fonksiyonunu çağıran useEffect ekleyin
  useEffect(() => {
    onAreaChanged(area);
  }, [area]);

  useEffect(() => {
    (async () => {
      const lands = await landAPI.getLands().then((data) => {
        setLands(data);

        return data;
      });

      await landAPI.getClans().then((data) => {
        setClans(data);
      });

      await getDeckIDS().then(async () => {
        await setup({
          locations: lands,
          lands: lands,
          area: area,
          setLocations: setLocations,
          setArea: onAreaSelect,
          deck: deckIDS,
          sideMeshes: sideMeshes,
          setSideMeshes: setSideMeshes,
          onSideSelect: (scene, mesh) => { },
          eventEmitter,
        });
        setLocations([...locations]);
      });
    })();

    return () => {
      const canvas = document.getElementById('canvas');

      if (!canvas) {
        return;
      }

      const newCanvas = document.createElement('div');
      newCanvas.id = 'canvas';
      newCanvas.className = 'h-full w-full transform-gpu';
      canvas.parentNode.replaceChild(newCanvas, canvas);
    };
  }, []);

  const getDeckIDS = async () => {
    const _deckIDS = await userApi.getOwnedNFTs(user.user.address);

    setDeckIDS(_deckIDS);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div
        className="absolute flex h-full w-full items-center justify-center"
        id="loading-area"
      >
        <div className="rounded bg-black/80 px-6 py-4 text-lg">
          <h1
            className="text-2xl font-medium text-white"
            id="loading-text"
          ></h1>
        </div>
      </div>
      <div className="h-full w-full transform-gpu" id="canvas"></div>
      <div className="absolute top-5 flex w-full justify-center gap-2">
        {deckIDS.map((x, i) => (
          <DeckItem
            onClick={(id: number, samurai: any) => {
              onAgentSelect(id);
              eventEmitter.emit('selectArea', samurai.Location);
            }}
            key={i}
            id={x}
          />
        ))}
      </div>

      {landModal && game.land && (
        <div className="map-land-in absolute right-0 top-0 z-50 flex h-full w-full max-w-md flex-col overflow-y-auto bg-neutral-950/50 px-8 py-4 backdrop-blur-2xl">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className="mb-2 text-2xl font-medium">
                {game.land.name} #{game.land.id}
              </h1>
              <p className="text-sm">{game.land.desc}</p>
            </div>
            <button onClick={() => setLandModal(false)}>
              <i className="ri-close-fill text-2xl"></i>
            </button>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4">
            <div className="col-span-1 flex flex-col rounded-xl bg-neutral-950/50 px-6 py-4">
              <div className="flex items-center justify-between">
                <h1 className="font-medium text-white/90">Land Details</h1>

                <div className="ml-auto">
                  <div
                    className={
                      'flex h-6 w-10 items-center justify-center rounded ' +
                      (game.land.clan == 1
                        ? 'bg-red-300'
                        : game.land.clan == 2
                          ? 'bg-blue-300'
                          : game.land.clan == 3
                            ? 'bg-purple-300'
                            : 'bg-white')
                    }
                  >
                    <i className="ri-sword-fill text-lg text-black"></i>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-6">
                <div className="col-span-1">
                  <div className="flex items-end justify-between rounded-xl ">
                    <span className="text-sm text-white/80">Resource:</span>
                    <span className="text-base">{game.land.value}</span>
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="flex items-end justify-between rounded-xl ">
                    <span className="text-sm text-white/80">Status:</span>
                    <span className="text-base">
                      {game.land.attackerClan == 0 ? 'Peace' : 'War'}
                    </span>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center justify-center rounded-xl ">
                    <span className="mr-2 text-sm text-white/80">
                      Governance:
                    </span>
                    <span className="text-base">
                      {game.lands.find((x) => x.id == game.land.clan)?.name ||
                        'Neutral zone'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-col rounded-xl bg-neutral-950/50 px-6 py-4 backdrop-blur-2xl">
            <h1 className="font-medium text-white/90">Your NFTs is here</h1>

            <div className="mt-4">
              <div className="flex flex-col gap-4">
                <h2 className="text-sm text-white/50">Avaiable NFTs</h2>
                {game.deck
                  .filter((x) => x.Location == game.land.id)
                  .map((x, i) => (
                    <Image
                      key={i}
                      className="rounded-full"
                      src={'/art/' + x.Id + '.png'}
                      width={48}
                      height={48}
                      alt="no_camped"
                    />
                  ))}
              </div>
              <div className="mt-4 flex flex-col gap-4">
                <h2 className="text-sm text-white/50">Camped NFTs</h2>
                {game.deck
                  .filter((x) => x.Location == game.land.id && x.CampTime != 0)
                  .map((x, i) => (
                    <Image
                      key={i}
                      className="rounded-full"
                      src={'/art/' + x.Id + '.png'}
                      width={48}
                      height={48}
                      alt="no_camped"
                    />
                  ))}
              </div>
            </div>
          </div>

          {game.land?.lastWarTime != 0 && (
            <div className="mt-6">
              <div className="grid grid-cols-3 items-center justify-between gap-4 rounded-xl bg-neutral-950/50 px-6 py-6">
                <div className="col-span-1 flex flex-col">
                  <div className="flex h-full flex-col items-center text-center">
                    <i className="ri-sword-fill mb-1 text-2xl"></i>
                    <span className="font-medium">
                      {
                        game.lands.find((x) => x.id == game.land.attackerClan)?.name

                      }
                    </span>
                  </div>
                </div>

                <div className="col-span-1 flex flex-col items-center">
                  <div className="flex flex-col items-center">
                    <i className="ri-sword-fill mb-1 text-2xl text-white/50"></i>
                    <span className="text-xs text-white/30">
                      {game.land?.lastWarTime != 0 && (
                        <span>
                          {DateFormatter.format(
                            new Date(game.land.lastWarTime * 1000),
                          )}
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="col-span-1 flex flex-col items-center text-center">
                  <div className="flex h-full flex-col items-center">
                    <i className="ri-shield-fill mb-1 text-2xl"></i>
                    <span className="whitespace-pre-line font-medium">
                      {game.lands.find((x) => x.id == game.land.clan)?.name}
                    </span>
                  </div>
                </div>

                <div className="col-span-1 flex justify-center gap-1">
                  <img src="/art/1.png" className="h-8 w-8 rounded-full" />
                  <img src="/art/1.png" className="h-8 w-8 rounded-full" />
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-black">
                    +{game.land.attackersPower}
                  </div>
                </div>
                <div className="col-span-1"></div>
                <div className="col-span-1 flex justify-center gap-1">
                  <img src="/art/1.png" className="h-8 w-8 rounded-full" />
                  <img src="/art/1.png" className="h-8 w-8 rounded-full" />
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-black">
                    +{game.land.defendersPower}
                  </div>
                </div>
                <div className="col-span-1 flex justify-center">
                  Power:{' '}
                  <span className="font-medium">
                    +{game.land.attackersPower}
                  </span>
                </div>
                <div className="col-span-1"></div>
                <div className="col-span-1 flex justify-center">
                  Power:{' '}
                  <span className="font-medium">
                    +{game.land.defendersPower}
                  </span>
                </div>
              </div>
            </div>
          )}

          {game.land.war_id != 0 && game.land.uri != "xx.com/1" && (
            <div className="col-span-1 mt-6 h-32">
              <img
                className="h-full w-full rounded-xl"
                alt="asd"
                src={game.land.uri + '.ads.png'}
              />
            </div>
          )}

          {game.land.attackerClan != 0 && (
            <>
              <div className="mt-6">
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-neutral-950/50 px-6 py-6">
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex flex-col items-center">
                      <i className="ri-shield-fill mb-1 text-2xl"></i>
                      <span className="text-sm">
                        {game.lands.find((x) => x.id == game.land.clan)?.name ||
                          'Neutral zone'}
                      </span>
                    </div>
                    <div className="mt-8 w-full text-sm ">
                      <ul className="flex flex-col gap-1">
                        <li className="text-white/70">
                          Total Power: {game.land.defendersPower}
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div>/</div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex flex-col items-center">
                      <i className="ri-sword-fill mb-1 text-2xl"></i>
                      <span className="text-sm">
                        {' '}
                        {game.lands.find((x) => x.id == game.land.attackerClan)
                          ?.name || 'Neutral zone'}
                      </span>
                    </div>
                    <div className="mt-8 w-full text-sm">
                      <ul className="flex flex-col gap-1">
                        <li className="text-white/70">
                          Total Power: {game.land.attackersPower}
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 w-full">
                    <h2 className="text-sm text-white">Your NFTs</h2>
                    <div className="mt-4 flex flex-col">
                      <ul className="flex w-full flex-col">
                        {deckIDS
                          .filter(
                            (x) =>
                              x.Location == game.land.id &&
                              x.DeploymentTime != 0,
                          )
                          .map((x, i) => (
                            <li key={i} className="flex items-center">
                              <span>{x.TokenName}</span>
                              <div className="ml-auto flex items-center gap-2 text-sm">
                                <span className="flex items-center">
                                  <i className="ri-sword-fill mr-1"></i>
                                  {x.Attack}
                                </span>
                                <span className="flex items-center">
                                  <i className="ri-shield-fill mr-1"></i>
                                  {x.Defence}
                                </span>
                              </div>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="mt-auto">
            <div className="mt-auto grid grid-cols-3 gap-3">
              {game.samurai &&
                game.land &&
                game.samurai?.Location == game.land.id &&
                game.land.id !=
                game.clans.find((x) => x.ID == user.user.clan)
                  ?.baseLocation &&
                game.samurai.DeploymentTime == 0 && (
                  <DeployCommandButton></DeployCommandButton>
                )}
              {game.samurai &&
                game.land &&
                game.samurai?.Location == game.land.id &&
                game.samurai.DeploymentTime != 0 && (
                  <UndeployCommandButton></UndeployCommandButton>
                )}

              {game.samurai &&
                game.land &&
                game.samurai?.Location != game.land.id &&
                game.samurai.CampTime == 0 &&
                game.samurai.DeploymentTime == 0 &&
                prepareMove(
                  game.lands.find((x) => x.id == game.samurai?.Location),
                  game.land,
                ) &&

                // (game.lands.find((x) => x.id == game.samurai.Location)?.id ==
                //   game.clans.find((x) => x.ID == user.user.clan)
                //     ?.baseLocation
                //   ||
                //   game.land.id ==
                //   game.clans.find((x) => x.ID == user.user.clan)
                //     ?.baseLocation) && (
                //   <MoveCommandButton></MoveCommandButton>
                // )
                (game.lands.find((x) => x.id == game.samurai.Location)?.owner ==
                  String(user.user?.clan)
                  // ||
                  // (
                  //   game.land.id ==
                  //   game.clans.find((x) => x.ID == user.user.clan)
                  //     ?.baseLocation

                ) && (
                  <MoveCommandButton></MoveCommandButton>
                )
              }

              {game.samurai &&
                game.land &&
                game.samurai.Location == game.land.id &&
                game.samurai.CampTime == 0 &&
                game.clans.find((x) => x.ID == user.user.clan)?.baseLocation ==
                game.samurai?.Location && (
                  <HealCommandButton></HealCommandButton>
                )}
              {game.samurai &&
                game.land &&
                game.samurai.Location == game.land.id &&
                user.user.clan == game.land.clan && (
                  <CollectCommandButton></CollectCommandButton>
                )}
              {game.samurai &&
                game.land &&
                game.samurai.Location == game.land.id &&
                user.user.clan == game.land.clan && (
                  <DropButtonCommand></DropButtonCommand>
                )}
              {game.samurai &&
                game.land &&
                game.samurai.Location == game.land.id &&
                String(user.user.clan) == game.land.owner &&
                game.samurai.CampTime == 0 &&
                game.samurai.DeploymentTime == 0 &&

                (
                  <CampCommandButton></CampCommandButton>
                )}
              {game.samurai &&
                game.land &&
                // game.samurai.Location == game.land.id &&
                // user.user.clan == game.land.clan &&
                game.samurai.CampTime != 0 && (
                  <UncampCommandButton></UncampCommandButton>
                )}
            </div>
          </div>
        </div>
      )}
      {game.samurai && <LandCard></LandCard>}
    </div>
  );
}

async function setup({
  locations,
  lands,
  area,
  setLocations,
  setArea,
  deck,
  sideMeshes,
  setSideMeshes,
  onSideSelect,
  eventEmitter,
}) {
  let container, water;
  let camera, scene, renderer, composer, effectFXAA;
  let blueOutlinePass, redOutlinePass, purpleOutlinePass, outlinePass;
  let upscalePass, upscalePass1, upscalePass2, upscalePass3;
  let areas = [];
  let stats = new Stats();

  /*const textureLoader = new THREE.TextureLoader();
  const cloudTexture = textureLoader.load('/cloud.jpg', function (texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
  });

  const cloudPlaneMaterial = new THREE.MeshStandardMaterial({
    alphaMap: cloudTexture,
    color: 0xffffff,
    transparent: true,
  });

  cloudPlaneMaterial.alphaMap.repeat.set(10, 10);
  cloudPlaneMaterial.opacity = 0.3;
*/
  await init();
  animate();

  let mouse = new THREE.Vector2();
  let raycaster = new THREE.Raycaster();
  let activeSide;
  let selectedObjects;

  document.addEventListener('click', onMouseClick, false);

  function onMouseClick(event: MouseEvent) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster
      .intersectObjects(scene.children, true)
      .filter((x) => x.object.name.includes('side'));
    if (intersects.length == 0) return;
    const point = intersects[0].point;

    const onAreaSelect = (name: string) => {
      let selectedArea: number | null = null;

      switch (true) {
        case name.startsWith('side_'): {
          const id = name.substring(5);
          selectedArea = Number(id);
          break;
        }
        case name.startsWith('Circle'): {
          const parts = name.split('_');
          const id = parts[parts.length - 1];
          selectedArea = Number(id);
          break;
        }
        default:
          break;
      }

      if (selectedArea !== null && area !== selectedArea) {
        setArea(selectedArea);
      }
    };
  }

  async function init() {
    container = document.getElementById('canvas');

    //

    const manager = new THREE.LoadingManager();
    manager.onStart = function (url, itemsLoaded, itemsTotal) {
      console.log(
        'Started loading file: ' +
        url +
        '.\nLoaded ' +
        itemsLoaded +
        ' of ' +
        itemsTotal +
        ' files.',
      );

      document.getElementById('loading-area').classList.remove('hidden');
      document.getElementById('loading-text').innerHTML =
        'Started loading file: ' +
        url +
        '.\nLoaded ' +
        itemsLoaded +
        ' of ' +
        itemsTotal +
        ' files.';
    };

    manager.onLoad = function () {
      console.log('Loading complete!');
      document.getElementById('loading-area').classList.add('hidden');
    };

    manager.onProgress = function (url, itemsLoaded, itemsTotal) {
      console.log(
        'Loading file: ' +
        url +
        '.\nLoaded ' +
        itemsLoaded +
        ' of ' +
        itemsTotal +
        ' files.',
      );

      document.getElementById('loading-text').innerHTML =
        'Loading file: ' +
        url +
        '.\nLoaded ' +
        itemsLoaded +
        ' of ' +
        itemsTotal +
        ' files.';
    };

    manager.onError = function (url) {
      console.log('There was an error loading ' + url);

      document.getElementById('loading-text').innerHTML =
        'There was an error loading ' + url;
    };

    renderer = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: 'high-performance',
    });

    renderer.shadowMap.autoUpdate = false;
    renderer.shadowMap.needsUpdate = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);

    stats.showPanel(0);
    container.appendChild(stats.dom);

    container.appendChild(renderer.domElement);

    //

    scene = new THREE.Scene();

    scene.fog = new THREE.Fog(0x87ceeb, 1, 1000);

    camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      1,
      1000,
    );
    camera.rotation.x = -Math.PI / 3;
    camera.position.set(0, 210, 150);

    composer = new EffectComposer(renderer);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(container.clientWidth, container.clientHeight),
      1.5,
      0.4,
      0.85,
    );
    bloomPass.threshold = 0;
    bloomPass.strength = 0.18;
    bloomPass.radius = 0.1;
    bloomPass.renderToScreen = true;

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    composer.addPass(bloomPass);

    const sky = new Sky();
    sky.scale.setScalar(450000);

    const uniforms = sky.material.uniforms;

    uniforms['turbidity'].value = 10;
    uniforms['rayleigh'].value = 2;
    uniforms['mieCoefficient'].value = 0.005;
    uniforms['mieDirectionalG'].value = 0.8;

    const phi = THREE.MathUtils.degToRad(90 - 90);
    const theta = THREE.MathUtils.degToRad(90);

    const sunPosition = new THREE.Vector3();

    sunPosition.setFromSphericalCoords(1, phi, theta);

    uniforms['sunPosition'].value.copy(sunPosition);

    scene.add(sky);

    const waterGeometry = new THREE.PlaneGeometry(2048, 2048);

    const waterMesh = new THREE.Mesh(
      waterGeometry,
      new THREE.MeshBasicMaterial({
        color: 0x218dff,
        transparent: true,
        opacity: 0.8,
      }),
    );

    waterMesh.castShadow = false;
    waterMesh.receiveShadow = true;

    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.y = 50;
    scene.add(waterMesh);
    const controls = new OrbitControls(camera, renderer.domElement);

    // positiyon y
    controls.target.set(0, 55, 0);
    controls.enableZoom = true;
    controls.minDistance = 100;
    controls.maxDistance = 350;
    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = Math.PI / 2;
    controls.maxAzimuthAngle = Math.PI / 2;
    controls.maxZoom = 1.5;

    window.addEventListener('resize', onWindowResize);

    const re = new THREE.AmbientLight(0xececec, 0.7);
    re.position.set(0, 200, 0);
    scene.add(re);

    const directionLight = new THREE.DirectionalLight(0xffffff, 1);
    directionLight.shadow.camera.top = 200;
    directionLight.shadow.camera.bottom = -200;
    directionLight.shadow.camera.left = -200;
    directionLight.shadow.camera.right = 200;
    directionLight.shadow.camera.near = 100;
    directionLight.shadow.camera.far = 500;
    directionLight.shadow.blurSamples = 16;
    directionLight.shadow.camera.lookAt(0, 0, 0);
    directionLight.shadow.radius = 14;
    directionLight.shadow.mapSize.width = 8192; // Yüksek çözünürlük
    directionLight.shadow.mapSize.height = 8192;

    directionLight.castShadow = true;

    directionLight.position.set(-250, 250, 0);
    scene.add(directionLight);

    const loader = new GLTFLoader(manager);

    const group = await new Promise<THREE.Group>((resolve, reject) => {
      loader.load(
        '/map/MAP.gltf',
        (gltf) => {
          resolve(gltf.scene);

          gltf.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }

            if (child.name.includes('side_')) {
              const id = Number(child.name.replace('side_', ''));

              if (isNaN(id)) {
                return;
              }

              setSideMeshes([
                ...sideMeshes,
                {
                  id: id,
                  mesh: child,
                },
              ]);
            }

            if (!child.name.includes('area_')) {
              return;
            }

            const id = Number(child.name.replace('area_', ''));

            if (isNaN(id)) {
              return;
            }

            areas.push(child);

            const _land = lands.find((l) => l.id === id);

            if (_land) {
              switch (Number(_land.owner)) {
                case 1:
                  (child as any).material = new THREE.MeshBasicMaterial({
                    color: 0xff0000,
                    opacity: 0.2,
                    side: THREE.DoubleSide,
                    transparent: true,
                  });

                  break;
                case 2:
                  (child as any).material = new THREE.MeshBasicMaterial({
                    color: 0x0000ff,
                    opacity: 0.2,
                    side: THREE.DoubleSide,
                    transparent: true,
                  });
                  break;
                case 3:
                  (child as any).material = new THREE.MeshBasicMaterial({
                    color: 0xff93ff,
                    opacity: 0.4,
                    side: THREE.DoubleSide,
                    transparent: true,
                  });
                  break;
                default:
                  (child as any).material = new THREE.MeshBasicMaterial({
                    color: 0x800080,
                    opacity: 0,
                    transparent: true,
                  });
                  break;
              }
            }
          });
        },
        undefined,
        reject,
      );
    });

    // Mouse'un ekran koordinatlarını almak için kullanılacak değişkenler
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    // Tıklama olayını dinlemek için event listener ekleyin
    window.addEventListener('click', onMapClick);

    eventEmitter.on('selectArea', (id: number) => {
      const _area = areas.find((a) => a.name === 'area_' + id);

      areas.forEach((a) => {
        if (a.oldMaterial) {
          a.material = a.oldMaterial;
        }
      });

      if (!_area) {
        return;
      }

      _area.oldMaterial = _area.material;
      _area.material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        opacity: 0.4,
        side: THREE.DoubleSide,
        transparent: true,
      });
    });

    eventEmitter.on('selectAgent', (id: number) => { });

    function onMapClick(event) {
      // Fare koordinatlarını ekran boyutuna göre hesaplayın
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Raycaster'ı tıklanan noktaya yönlendirin
      raycaster.setFromCamera(mouse, camera);

      // Raycaster ile tıklama noktasını hesaplayın
      const intersects = raycaster.intersectObjects(group.children, true);

      // Eğer tıklama noktası varsa
      if (intersects.length > 0) {
        const intersect = intersects.find(
          (i) =>
            !isNaN(Number(i.object.parent.name)) ||
            i.object.parent.name.includes('KINGDOM'),
        );

        if (!intersect) {
          return;
        }

        const clickedObject = intersect.object;

        const parentObject = clickedObject.parent;
        // Tıklanan hexagonun ismini almak
        const groupName = clickedObject.parent.name;

        selectedObjects = [];
        selectedObjects.push(clickedObject);

        console.log('Tıklanan hexagonun grubu:', groupName);

        const position = parentObject.position; // Ana nesnenin konumu
        console.log('Tıklanan hexagonın konumu:', position);
        // Tıklanan nesnenin adını veya diğer özelliklerini kullanabilirsiniz
        const payload = getPayload(position, groupName);

        if (!payload) {
          return;
        }

        const location = locations.find((l) => l.id === payload.id);

        if (!location) {
          return;
        }

        const _area = areas.find((a) => a.name === 'area_' + location.id);

        areas.forEach((a) => {
          if (a.oldMaterial) {
            a.material = a.oldMaterial;
          }
        });

        _area.oldMaterial = _area.material;
        _area.material = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          opacity: 0.4,
          side: THREE.DoubleSide,
          transparent: true,
        });

        console.log('clickedObject', clickedObject);
        console.log('parentObject', parentObject);
        console.log('groupName', groupName);
        console.log('position', position);

        onSideSelect(scene, scene.getObjectByName('area_' + location.id));

        setArea(location.id);
      }

      // ...
    }

    const getPayload = (position: any, groupName: string) => {
      if (groupName.includes('KINGDOM')) {
        const idStr = groupName.replace('KINGDOM', '');
        const kingdomId = Number(idStr.trim());
        return {
          name: 'kingdom_' + groupName,
          id: kingdomId,
          location: position,
        };
      }

      let payloadObj: payload = {
        name: 'side_' + groupName,
        id: Number(groupName),
        location: position,
      };
      return payloadObj;
    };
    interface payload {
      name: string;
      location: number;
      id: number;
    }

    const formattedName = 'side_' + parent.name;
    parent.name = formattedName;

    group.scale.set(1.3, 1.3, 1.3);
    group.position.y = 50;
    group.position.z = 50;
    group.position.x = -110;
    scene.add(group);
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate() {
    requestAnimationFrame(animate);

    stats.begin();

    composer.render({
      depth: true,
    });

    // water.material.uniforms['time'].value += 1.0 / 60.0;

    stats.end();
    //cloudPlaneMaterial.alphaMap.offset.y -= 0.00005;
  }
}
