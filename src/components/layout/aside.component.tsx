import Link from 'next/link';

export function Aside() {
  return (
    <>
      <aside className="sticky top-0 z-50 flex h-screen w-16 flex-col items-center border-r border-r-violet-500/20 bg-neutral-950/10 px-4 py-6 text-neutral-600 backdrop-blur-lg">
        <Link
          active-class="!text-violet-500"
          href="/"
          className="flex h-12 w-12 items-center justify-center rounded-full hover:bg-neutral-800"
        >
          <i className="ri-earth-line text-2xl"></i>
        </Link>
        {/* <Link
          active-class="!text-violet-500"
          href="/marketplace"
          className="flex h-12 w-12 items-center justify-center rounded-full hover:bg-neutral-800"
        >
          <i className="ri-store-2-line text-2xl"></i>
        </Link> */}
        <Link
          id="inventory"
          active-class="!text-violet-500"
          href="/inventory"
          className="flex h-12 w-12 items-center justify-center rounded-full hover:bg-neutral-800"
        >
          <i className="ri-briefcase-3-line text-2xl"></i>
        </Link>
        <Link
          id="crate"
          active-class="!text-violet-500"
          href="/crate"
          className="flex h-12 w-12 items-center justify-center rounded-full hover:bg-neutral-800"
        >
          <i className="ri-dropbox-fill text-2xl"></i>
        </Link>
        {/* <Link
          id="vote"
          active-class="!text-violet-500"
          href="/vote"
          className="flex h-12 w-12 items-center justify-center rounded-full hover:bg-neutral-800"
        >
          <i className="ri-chat-poll-fill text-2xl"></i>
        </Link> */}
        <Link
          href="/profile"
          active-class="!text-violet-500"
          className="flex h-12 w-12 items-center justify-center rounded-full hover:bg-neutral-800"
        >
          <i className="ri-user-line text-2xl"></i>
        </Link>
        <Link
          href="/reference"
          active-class="!text-violet-500"
          className="flex h-12 w-12 items-center justify-center rounded-full hover:bg-neutral-800"
        >
          <i className="ri-shining-line text-2xl"></i>
        </Link> 
        <Link
          href="/top"
          active-class="!text-violet-500"
          className="flex h-12 w-12 items-center justify-center rounded-full hover:bg-neutral-800"
        >
          <i className="ri-arrow-up-double-line text-2xl"></i>
        </Link>
        <button className="mt-auto flex h-12 w-12 items-center justify-center rounded-full hover:bg-neutral-800">
          <i className="ri-question-mark text-2xl text-violet-500"></i>
        </button>
      </aside>
    </>
  );
}
