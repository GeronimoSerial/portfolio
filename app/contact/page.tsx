import React from 'react';
import { Github, Mail, Twitter } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SocialCard } from "@/app/contact/SocialCard"
import { Navigation } from '../components/nav';

const socials = [
  {
    icon: <Twitter size={20} />,
    href: "https://twitter.com/example",
    label: "Twitter",
    handle: "@example",
  },
  {
    icon: <Mail size={20} />,
    href: "mailto:example@example.com",
    label: "Email",
    handle: "example@example.com",
  },
  {
    icon: <Github size={20} />,
    href: "https://github.com/example",
    label: "Github",
    handle: "example",
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

function App() {
  return (
	  <div className="min-h-screen bg-gradient-to-tl from-indigo-900 via-zinc-400/10 fixed inset-0">
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="w-full ">
			<Navigation/>
          <Carousel
            opts={{
              align: "start",
              loop: true,
              dragFree: true,
            }}
            className="container mx-auto"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {socials.map((social, index) => (
                <CarouselItem key={index} className="pl-6 pr-6 md:pl-8 md:pr-8 basis-full xs:basis-2/3 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <SocialCard {...social} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex -left-2 sm:-left-4 lg:-left-12" />
            <CarouselNext className="hidden sm:flex -right-2 sm:-right-4 lg:-right-12" />
          </Carousel>
        </div>
      </div>
    </div>
  );
}

export default App;