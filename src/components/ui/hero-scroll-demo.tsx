"use client"
import { ContainerScroll } from './container-scroll-animation'

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden pb-[260px] pt-[180px]">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Make studying feel like a <br />
              <span className="text-4xl md:text-[5rem] font-bold mt-1 leading-none">
                Game.
              </span>
            </h1>
            <p className="mt-6 text-base md:text-lg text-gray-700 dark:text-gray-200">
              Build decks, play quick rounds, keep a combo, and level up.
            </p>
          </>
        }
      >
        <img
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80"
          alt="Study desk"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full w-full object-center"
          draggable={false}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </ContainerScroll>
    </div>
  )
}
