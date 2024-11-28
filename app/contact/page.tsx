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
		<div className="fixed inset-0 flex items-center justify-center">
		  <div className="relative w-full max-w-[90vw] lg:max-w-[85vw] xl:max-w-[80vw] mx-auto">
			<Carousel
			  opts={{
				align: "center",
				loop: true,
				dragFree: false,
				containScroll: "trimSnaps",
			  }}
			  className="w-full px-4 sm:px-6 md:px-8"
			>
			  <CarouselContent className="-ml-4 md:-ml-6">
				{socials.map((social, index) => (
				  <CarouselItem 
					key={index} 
					className="pl-4 md:pl-6 basis-full xs:basis-2/3 sm:basis-1/2 md:basis-1/3"
				  >
					<div className="flex justify-center items-center h-full">
					  <SocialCard {...social} />
					</div>
				  </CarouselItem>
				))}
			  </CarouselContent>
			  <div className="hidden sm:block">
				<CarouselPrevious className="absolute -left-12 lg:-left-16 transform -translate-y-1/2 top-1/2" />
				<CarouselNext className="absolute -right-12 lg:-right-16 transform -translate-y-1/2 top-1/2" />
			  </div>
			</Carousel>
		  </div>
		</div>
	  </div>
	);
  }
