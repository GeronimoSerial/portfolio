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
import { Metadata } from 'next';
import { type CarouselApi } from '@/components/ui/carousel';

// export const metadata: Metadata = {
// 	title: 'Contacto',
// 	description: 'Página de información personal y profesional de Geronimo Serial',
//   }
  

const socials = [
	{
		icon: <X size={20} />,
		href: "https://twitter.com/geroserial",
		label: "X",
		handle: "@geroserial",
	},
	{
		icon: <Mail size={20} />,
		href: "mailto:contacto@geroserial.com",
		label: "Email",
		handle: "contacto@geroserial.com",
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
  }
];

export default function Contact() {
	const [api, setApi] = React.useState<CarouselApi>()
	const [current, setCurrent] = React.useState(0)
	const [count, setCount] = React.useState(0)
	React.useEffect(() => {
		if (!api) {
		  return
		}
	 
		setCount(api.scrollSnapList().length)
		setCurrent(api.selectedScrollSnap() + 1)
	 
		api.on("select", () => {
		  setCurrent(api.selectedScrollSnap() + 1)
		})
	  }, [api])
	return (
		<div className="min-h-screen bg-gradient-to-tl from-indigo-900 via-indigo-400/10 fixed inset-0">
		<Navigation/>
		<Particles className='absolute inset-0 -z-10'/>
		<div className="fixed inset-0 flex items-center justify-center p-4">
		  <div className="w-full max-w-[95vw] md:max-w-[90vw] lg:max-w-[85vw] xl:max-w-[80vw] mx-auto">
			<Carousel setApi={setApi}
			  opts={{
				  align: "center",
				  loop: true,
				  dragFree: false,
				}}
				className="w-full"
				>
			  <CarouselContent className="-ml-4 md:-ml-6">
				{socials.map((social, index) => (
					<CarouselItem 
					key={index} 
					className="pl-4 md:pl-6 basis-full sm:basis-1/2 md:basis-1/3"
					>
					<div className="flex justify-center items-center h-full p-2 md:p-3">
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
			<div className="py-2 text-white text-center text-sm text-muted-foreground">
        	{current} de {count}
		  </div>
		  </div>
		</div>
	  </div>
	);
  }
