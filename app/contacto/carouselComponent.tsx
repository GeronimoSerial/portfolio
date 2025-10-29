"use client";
import { type CarouselApi } from "@/components/ui/carousel";
import React from "react";
import { Github, Mail, X, Instagram, MessageCircleIcon } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SocialCard } from "@/components/shared/SocialCard";
const socials = [
    {
      icon: <Mail size={20} />,
      href: "mailto:serialgeronimo@gmail.com",
      label: "Email",
      handle: "serialgeronimo@gmail.com",
    },
    {
        icon: <Github size={20} />,
        href: "https://github.com/geronimoserial",
        label: "GitHub",
        handle: "geronimoserial",
    },
    {
        icon: <Instagram size={20} />,
        href: "https://instagram.com/geroserial",
        label: "Instagram",
        handle: "@geroserial",
    },
    {
        icon: <MessageCircleIcon size={20} />,
        href: "https://wa.me/543794376025",
        label: "WhatsApp",
        handle: "Enviame un mensaje",
    },
    {
      icon: <X size={20} />,
      href: "https://twitter.com/geroserial",
      label: "X",
      handle: "@geroserial",
    },
];

export const CarouselComponent = () => {
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    const updateCarouselState = () => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap() + 1);
    };

    // Initial state
    updateCarouselState();

    // Update on selection
    api.on("select", updateCarouselState);

    // Cleanup listener
    return () => {
      api.off("select", updateCarouselState);
    };
  }, [api]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative w-full max-w-6xl">
      <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-950 to-gray-400 font-sans text-center mb-8 mt-4">
          ¿Charlamos?
      </h1>
        <Carousel
          setApi={setApi}
          opts={{
            align: "center",
            loop: true,
            dragFree: false,
            slidesToScroll: 1,
          }}
          className="w-full"
        >
          <CarouselContent className="flex">
            {socials.map((social, index) => (
              <CarouselItem
                key={index}
                className="basis-full sm:basis-1/2 lg:basis-1/3 flex-shrink-0"
              >
                <div className="p-2">
                  <SocialCard {...social} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="sm:block hidden">
            <CarouselPrevious className="absolute -left-4 md:-left-8 lg:-left-12 transform -translate-y-1/2 top-1/2" />
            <CarouselNext className="absolute -right-4 md:-right-8 lg:-right-12 transform -translate-y-1/2 top-1/2" />
          </div>
        </Carousel>
        <div className="py-2 text-gray-400 text-center text-sm text-muted-foreground">
          {current} de {count}
        </div>
        <div className="relative w-full h-1 bg-slate-800 mt-2">
          <div
            className="absolute h-full bg-indigo-800 transition-all duration-300 rounded"
            style={{ width: `${(current / count) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
