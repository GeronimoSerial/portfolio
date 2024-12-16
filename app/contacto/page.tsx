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
	<div className="min-h-screen bg-gradient-to-tl from-indigo-900 via-indigo-400/10 fixed inset-0 overflow-hidden flex flex-col justify-center">
	<Navigation />
	<Particles className="absolute inset-0 -z-10" />
	
	{/* Contenedor que ocupa toda la pantalla y centra el contenido */}
	<div className="flex flex-col justify-center items-center w-full h-full p-4">
	  <div className="w-full max-w-[95vw] md:max-w-[90vw] lg:max-w-[1200px] xl:max-w-[1400px] mx-auto">
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
		  <CarouselContent className="flex gap-4 -ml-4 md:-ml-6">
			{socials.map((social, index) => (
			  <CarouselItem
				key={index}
				className="
				  pl-4 md:pl-6
				  basis-full 
				  sm:basis-[calc(50%-1rem)]
				  md:basis-[calc(33.333%-1.5rem)]
				"
			  >
				<div className="aspect-[9/16] w-full">
				  <SocialCard {...social} />
				</div>
			  </CarouselItem>
			))}
		  </CarouselContent>
		  <div className="hidden sm:block">
			<CarouselPrevious 
			  className="
				absolute 
				-left-4 md:-left-8 lg:-left-12 
				transform -translate-y-1/2 top-1/2
				text-white hover:text-zinc-200
			  "
			/>
			<CarouselNext 
			  className="
				absolute 
				-right-4 md:-right-8 lg:-right-12 
				transform -translate-y-1/2 top-1/2
				text-white hover:text-zinc-200
			  "
			/>
		  </div>
		</Carousel>
		<div className="py-2 text-white text-center text-sm text-muted-foreground">
		  {current} de {count}
		</div>
	  </div>
	</div>
  </div>
  );  
}