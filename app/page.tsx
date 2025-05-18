"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "next-themes";

import { Lightbulb, Rocket, ShieldCheck } from "lucide-react";
import { ReactNode } from "react";
import Navbar from "./components/nav-bar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
    </div>
  );
}
function HeroSection() {
  return (
    <div className="flex shadow-md flex-col items-center justify-center text-center py-20 px-4 mt-5 md:mt-5 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
      <img
        src="aiface.png" 
        alt="Face"
        className="w-90 h-90 mb-6 rounded-full object-cover"
      />
      <h1 className="text-9xl md:text-9xl font-mono font-bold mb-4">
        FaceTIME
      </h1>
      <p className="text-2xl text-gray-600 text-bold mb-8 mx-0 md:mx-44">
        The first AI-powered acne detection and analysis tool that helps you reach your maximum facial potential.
      </p>
    </div>
  );
}

const FeaturesSection = () => {
  const { theme } = useTheme();
  const bgColor = theme === "dark" ? "bg-transparent" : "bg-gray-50";

  const featureData = [
    {
      icon: <Lightbulb className="w-8 h-8 text-gray-600" />,
      title: "Innovative Solutions",
      description:
        "Access cutting-edge technology designed to drive growth and efficiency.",
    },
    {
      icon: <Rocket className="w-8 h-8 text-gray-600" />,
      title: "Accelerated Growth",
      description:
        "Achieve remarkable success with our proven strategies and expert guidance.",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-gray-600" />,
      title: "Trusted Partnership",
      description:
        "Rely on our dedicated team to provide exceptional support and reliable solutions.",
    },
  ];

  const FeatureCard = ({
    icon,
    title,
    description,
  }: {
    icon: ReactNode;
    title: string;
    description: string;
  }) => {
    return (
      <Card className={`bg-transparent shadow-none border-none`}>
        <CardContent className="flex flex-col items-center p-6">
          <Card className="rounded-lg p-4 mb-4 border-none">{icon}</Card>
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          <p className="text-gray-600 mb-4">{description}</p>
          <Button variant="link" className="text-sm">
            Learn more
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={`${bgColor} py-16`}>
      <div className="max-w-4xl mx-auto text-center px-4">
        <h1 className="text-4xl font-semibold mb-4">
          Empowering Your Journey to Face Perfection
        </h1>
        <p className="text-lg text-gray-600 mb-12">
          We provide the tools needed to help you achieve your best self. Our AI-powered acne detection and tracker allows you to figure out specific areas to improve on and motivates you using a time traveling machine displaying your progress. 
        </p>
        <Link href="/upload">
          <Button className="whitespace-nowrap h-11 text-2xl px-3">Begin Your Journey to Perfection</Button>
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featureData.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
