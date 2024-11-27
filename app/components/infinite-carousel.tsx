"use client";
import * as React from "react";
import { Github, Mail, X } from "lucide-react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { Card } from "./card";

export function InfiniteCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      skipSnaps: false,
    },
    [
      Autoplay({ playOnInit: true, delay: 3000, stopOnInteraction: false }),
      WheelGesturesPlugin(),
    ]
  );

  const socials = [
    {
      icon: <X size={20} />,
      href: "https://twitter.com/geroserial",
      label: "X",
      handle: "@geroserial",
    },
    {
      icon: <Mail size={20} />,
      href: "mailto:serialgeronimo@gmail.com",
      label: "Email",
      handle: "serialgeronimo@gmail.com",
    },
    {
      icon: <Github size={20} />,
      href: "https://github.com/geronimoserial",
      label: "Github",
      handle: "geronimoserial",
    },
    
  ];

  const [scrollProgress, setScrollProgress] = React.useState(0);

  const onScroll = React.useCallback(() => {
    if (!emblaApi) return;
    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
    setScrollProgress(progress * 100);
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("scroll", onScroll);
    onScroll();
  }, [emblaApi, onScroll]);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 py-8">
      <Carousel
        opts={{
          align: "start",
          loop: true,
          
        }}
        className="w-full"
        ref={emblaRef}
      >
        <CarouselContent>
          {socials.map((social, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className = "h-full">
              <Card>
                
                <Link
                  href={social.href}
                  target="_blank"
                  className="p-4 relative flex flex-col items-center gap-4 duration-700 group md:gap-8 md:py-24  lg:pb-48  md:p-16"
                >
                 <span
									className="absolute w-px h-2/3 bg-gradient-to-b from-zinc-500 via-zinc-500/50 to-transparent"
									aria-hidden="true"
								/>
								<span className="relative z-10 flex items-center justify-center w-12 h-12 text-sm duration-1000 border rounded-full text-zinc-200 group-hover:text-white group-hover:bg-zinc-900 border-zinc-500 bg-zinc-900 group-hover:border-zinc-200 drop-shadow-orange">
									{social.icon}
								</span>{" "}
								<div className="z-10 flex flex-col items-center">
									<span className="lg:text-xl font-medium duration-150 xl:text-3xl text-zinc-200 group-hover:text-white font-display">
										{social.handle}
									</span>
									<span className="mt-4 text-sm text-center duration-1000 text-zinc-400 group-hover:text-zinc-200">
										{social.label}
									</span>
								</div>
                </Link>
              </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center justify-end gap-2 mt-4">
          {/* <CarouselPrevious className="relative" />
          <CarouselNext className="relative" /> */}
        </div>
      </Carousel>

      {/* <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-200 dark:bg-zinc-800">
        <div
          className="h-full bg-zinc-900 dark:bg-zinc-200 transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div> */}
    </div>
  );
}