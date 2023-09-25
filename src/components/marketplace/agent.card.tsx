import Image from 'next/image';

export function AgentCard({ index, onClick }) {
  return (
    <div className="group relative flex flex-col rounded-2xl border border-violet-500/10 bg-neutral-900/20 px-6 py-4 backdrop-blur-xl transition hover:bg-neutral-800/50">
      <Image
        width={290}
        height={290}
        loading="lazy"
        className="rounded-2xl"
        src={`/art/${index}.png`}
        alt="qweqw"
      />
      <div className="mt-4 flex items-center justify-between">
        <h3 className="font-inter font-medium text-neutral-200">
          Green Eyes Samurai
        </h3>
        <span className="text-sm font-light text-neutral-400">#01</span>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <div className="flex flex-col">
          <span className="mb-1 flex items-center text-red-500">
            <i className="ri-sword-fill mr-1"></i>{' '}
            <span className="text-sm">8</span>
          </span>
          <div className="h-2 rounded-full bg-neutral-800">
            <div
              className="stats h-2 rounded-full bg-red-500"
              style={{ maxWidth: '80%' }}
            ></div>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="mb-1 flex items-center text-blue-500">
            <i className="ri-shield-fill mr-1"></i>{' '}
            <span className="text-sm">8</span>
          </span>
          <div className="h-2 rounded-full bg-neutral-800">
            <div
              className="stats h-2 rounded-full bg-blue-500"
              style={{ maxWidth: '80%' }}
            ></div>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="mb-1 flex items-center text-yellow-500">
            <i className="ri-fire-fill mr-1"></i>{' '}
            <span className="text-sm">8</span>
          </span>
          <div className="h-2 rounded-full bg-neutral-800">
            <div
              className="stats h-2 rounded-full bg-yellow-500"
              style={{ maxWidth: '80%' }}
            ></div>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="mb-1 flex items-center text-green-500">
            <i className="ri-flashlight-fill mr-1"></i>{' '}
            <span className="text-sm">8</span>
          </span>
          <div className="h-2 rounded-full bg-neutral-800">
            <div
              className="stats h-2 rounded-full bg-green-500"
              style={{ maxWidth: '80%' }}
            ></div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-between">
        <div className="flex flex-col">
          <span className="text-neutral-500 group-hover:text-violet-500">
            Current Bid
          </span>
          <span className="font-semibold text-neutral-300">1.35 BNB</span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => onClick(1)}
          className="ml-auto rounded-xl bg-violet-500 px-6 py-2 hover:bg-violet-600"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
