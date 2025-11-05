"use client";
import Image from "next/image";
import React from "react";
import { heroBlack, heroWhite } from "@/data/assets";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

const Hero = () => {
  const { mode } = useThemeStore();

  return (
    <div className="relative w-full h-[80vh] flex flex-col items-center justify-center mt-32">
      <div className="text-center absolute top-5 md:-top-16">
        <h1 className="font-black text-3xl md:text-5xl">
          Find Your Tribe, <br /> Build Your Network
        </h1>
        <p className="font-semibold text-base md:text-xl mt-2">
          Connect with like-minded people for fun, <br /> friendships and future
          opportunities.
        </p>
        <div className="flex gap-5 items-center justify-center mt-5">
          <Button size="lg" className="font-medium text-lg">
            Join for Free
            <ArrowRight />
          </Button>
          <Button variant="outline" size="lg" className="font-medium text-lg">
            Join for Free
            <ArrowRight />
          </Button>
        </div>
      </div>
      <div className="w-full mt-8">
        <Image
          src={mode === "light" ? heroWhite : heroBlack}
          alt="hero-img"
          width={1000}
          height={600}
          className="w-full h-auto"
          priority
        />
      </div>
    </div>
  );
};

export default Hero;
