import { footerLinks } from "@/data/layout";
import Link from "next/link";
import React from "react";
import Logo from "./logo";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

const Footer = () => {
  return (
    <Card className="h-auto bg-background text-foreground m-0 rounded-none">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 pt-8">
        <div className="flex flex-col justify-between items-start">
          <Logo />
          <div className="mt-5">
            <h4 className="font-semibold text-xl mb-3">
              Subscribe to our newsletter
            </h4>
            <p className="text-sm text-gray-400 mb-3">
              Get updates about new meetups, communities, and features.
            </p>
            <form className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="border-[1px] border-gray-200"
              />
              <Button
                size="lg"
                type="submit"
                className="bg-primary px-4 py-2 rounded-lg text-sm hover:bg-primary/90 transition-colors"
              >
                Subscribe
              </Button>
            </form>
          </div>
          <div className="mt-8 flex items-center gap-4">
            <Link href="https://facebook.com" target="_blank" className="">
              <Facebook size={20} fill="white" />
            </Link>
            <Link href="https://twitter.com" target="_blank" className="">
              <Twitter size={20} fill="white" />
            </Link>
            <Link href="https://instagram.com" target="_blank" className="">
              <Instagram size={20} fill="white" />
            </Link>
            <Link href="https://linkedin.com" target="_blank" className="">
              <Linkedin size={20} fill="white" />
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-foreground mt-10 md:0">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-5 text-gray-400">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="text-primary font-[900] text-[75px] sm:text-[200px] md:[300px] lg:text-[450px] leading-tight m-0 text-center">
        connect
      </div>
    </Card>
  );
};

export default Footer;
