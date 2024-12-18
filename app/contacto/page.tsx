"use client";
import React from 'react';
import { Github, Mail, X, Instagram, MessageCircleIcon } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SocialCard } from "@/app/components/SocialCard"
import { Navigation } from '../components/nav';
import Particles from '../components/particles';
import { type CarouselApi } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';

const socials = [
  {
    icon: <X size={24} />,
    href: "https://twitter.com/geroserial",
    label: "X",
    handle: "@geroserial",
  },
  {
    icon: <Mail size={24} />,
    href: "mailto:serialgeronimo@gmail.com",
    label: "Email",
    handle: "serialgeronimo@gmail.com",
  },
  {
    icon: <Github size={24} />,
    href: "https://github.com/geronimoserial",
    label: "GitHub",
    handle: "geronimoserial",
  },
  {
    icon: <Instagram size={24} />,
    href: "https://instagram.com/geroserial",
    label: "Instagram",
    handle: "@geroserial",
  },
  {
    icon: <MessageCircleIcon size={24} />,
    href: "https://wa.me/543794376025",
    label: "WhatsApp",
    handle: "Enviame un mensaje",
  }
];

export default function Contact() {
  const [api, setApi] = React.useState<CarouselApi | null>(null)
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) return;

    const updateCarouselState = () => {
      setCount(api.scrollSnapList().length)
      setCurrent(api.selectedScrollSnap() + 1)
    }

    // Initial state
    updateCarouselState()

    // Update on selection
    api.on("select", updateCarouselState)

    // Cleanup listener
    return () => {
      api.off("select", updateCarouselState)
    }
  }, [api])

  return (
    <div className="bg-gradient-to-tl from-indigo-900 via-indigo-400/10 fixed inset-0">
      <Navigation />
      <Particles className="absolute inset-0 -z-10" />
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative w-full max-w-6xl">
          {/* <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-indigo-900 to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-indigo-900 to-transparent z-10"></div> */}
          <Carousel
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
                <CarouselItem key={index} className="basis-full sm:basis-1/2 lg:basis-1/3 flex-shrink-0">
                  <div className="p-2">
                    <SocialCard {...social} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
}