import { useLayout } from '@/hooks/useLayout';
import { DefaultLayout } from '@/layouts/default.layout';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper';

import 'swiper/css';
import 'swiper/css/effect-cards';
import { useAuth } from '@/hooks/useAuth';

export function Card() {
  return (
    <div className="relative mx-auto flex w-full  flex-col rounded-xl border border-violet-500/10 bg-neutral-900 backdrop-blur-lg">
      <div className="grid grid-cols-3">
        <div className="col-span-1 flex flex-col items-center justify-center border-b-2 border-b-red-500 px-4 py-4">
          <h3 className="text-xl font-bold">25</h3>
          <p>Your Entries</p>
        </div>
        <div className="col-span-1 flex flex-col items-center justify-center border-b-2 border-b-blue-500 px-4 py-4">
          <h3 className="text-xl font-bold">595</h3>
          <p>Total Entries</p>
        </div>
        <div className="col-span-1 flex flex-col items-center justify-center border-b-2 border-b-purple-500 px-4 py-4">
          <h3 className="text-xl font-bold">3</h3>
          <p>Days left</p>
        </div>
      </div>

      <div className="relative flex flex-col px-6 py-8 ">
        <div className="flex flex-col items-center text-center">
          <h3 className="mb-4 text-2xl font-semibold">
            Samurai Conquest Legendary Agen Win
          </h3>
          <p className="max-w-screen-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore aut
            consequatur, libero necessitatibus, error recusandae quaerat cum eos
            minus veniam dignissimos vel alias pariatur aspernatur tempore
            placeat itaque reiciendis. Sunt!
          </p>
        </div>

        <div className="mt-12 flex flex-col items-center">
          <ul className="w-full">
            <li className="flex w-full items-center gap-2 px-4 py-4 text-center hover:bg-neutral-900/50">
              <i className="ri-youtube-line text-2xl"></i>
              <span>Subscribe to our Youtube channel</span>
              <i className="ri-check-line ml-auto text-2xl"></i>
            </li>
            <li className="flex w-full items-center gap-2 px-4 py-4 text-center hover:bg-neutral-900/50">
              <i className="ri-youtube-line text-2xl"></i>
              <span>Subscribe to our Youtube channel</span>
              <i className="ri-check-line ml-auto text-2xl"></i>
            </li>
            <li className="flex w-full items-center gap-2 px-4 py-4 text-center hover:bg-neutral-900/50">
              <i className="ri-youtube-line text-2xl"></i>
              <span>Subscribe to our Youtube channel</span>
              <i className="ri-close-line ml-auto text-2xl"></i>
            </li>
            <li className="flex w-full items-center gap-2 px-4 py-4 text-center hover:bg-neutral-900/50">
              <i className="ri-youtube-line text-2xl"></i>
              <span>Subscribe to our Youtube channel</span>
              <i className="ri-close-line ml-auto text-2xl"></i>
            </li>
            <li className="flex w-full items-center gap-2 px-4 py-4 text-center hover:bg-neutral-900/50">
              <i className="ri-youtube-line text-2xl"></i>
              <span>Subscribe to our Youtube channel</span>
              <i className="ri-close-line ml-auto text-2xl"></i>
            </li>
            <li className="flex w-full items-center gap-2 px-4 py-4 text-center hover:bg-neutral-900/50">
              <i className="ri-youtube-line text-2xl"></i>
              <span>Subscribe to our Youtube channel</span>
              <i className="ri-close-line ml-auto text-2xl"></i>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function Giveaway() {
  useAuth();
  const layout = useLayout();

  useEffect(() => {
    layout.update({
      messages: false,
      notifications: false,
      profile: true,
      search: false,
      wallet: true,
    });
  }, []);

  return (
    <div className="flex min-h-screen flex-col gap-8 px-8 py-16">
      <div className="mx-auto max-w-screen-lg text-center">
        <h1 className="text-2xl font-semibold text-white">Giveaway</h1>
        <p className="mt-2 text-sm text-neutral-300 ">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam quaerat
          dolore veniam maxime laudantium modi quos debitis commodi architecto
          inventore distinctio esse itaque nostrum tempora, deserunt, sed
          possimus? Cumque, mollitia.
        </p>
      </div>

      <Swiper
        className="w-full max-w-screen-md"
        effect="cards"
        grabCursor={true}
        modules={[EffectCards]}
      >
        <SwiperSlide>
          <Card></Card>
        </SwiperSlide>
        <SwiperSlide>
          <Card></Card>
        </SwiperSlide>
        <SwiperSlide>
          <Card></Card>
        </SwiperSlide>
        <SwiperSlide>
          <Card></Card>
        </SwiperSlide>
        <SwiperSlide>
          <Card></Card>
        </SwiperSlide>
        <SwiperSlide>
          <Card></Card>
        </SwiperSlide>
        <SwiperSlide>
          <Card></Card>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

Giveaway.getLayout = function getLayout(page) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
