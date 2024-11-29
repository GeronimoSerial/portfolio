import React from 'react';
import { Github, Mail, Twitter, X, Instagram } from 'lucide-react';
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
  {
    icon: <Twitter size={20} />,
    href: "https://twitter.com/example2",
    label: "Twitter",
    handle: "@example2",
  },
  {
    icon: <Mail size={20} />,
    href: "mailto:example2@example.com",
    label: "Email",
    handle: "example2@example.com",
  }
];

export default function Contact() {
	return (
		<div className="min-h-screen bg-gradient-to-tl from-indigo-900 via-indigo-400/10 fixed inset-0">
		<Navigation/>
		<Particles className='absolute inset-0 -z-10'/>
		<div className="fixed inset-0 flex items-center justify-center p-4">
		  <div className="w-full max-w-[95vw] md:max-w-[90vw] lg:max-w-[85vw] xl:max-w-[80vw] mx-auto">
			<Carousel
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
		  </div>
		</div>
	  </div>
	);
  }
