"use client";
import { Github, Mail, X } from "lucide-react";
import Link from "next/link";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";
import {InfiniteCarousel} from "@/app/components/infinite-carousel";


export default function Home() {
	return (
	  <main className="min-h-screen bg-gradient-to-tl from-indigo-900 via-indigo-400/10">
		<Navigation />
		<section className="container mx-auto px-4 py-16 flex items-center justify-center h-screen">
		  {/* <div className="flex items-center justify-center">
			<div className="w-full max-w-7xl"> */}
			  <InfiniteCarousel />
			{/* </div> */}
		  {/* </div> */}
		</section>
	  </main>
	);
  }