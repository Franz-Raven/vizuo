"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Footer from "@/components/footer";
import Background from "@/components/background";
import BackgroundBlobs from "@/components/background-blobs"

export default function Landing() {
  // Dummy images for the floating gallery
  const galleryImages = [
    { id: 1, src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop", alt: "Design 1", delay: 0 },
    { id: 2, src: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&h=400&fit=crop", alt: "Design 2", delay: 0.5 },
    { id: 3, src: "https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=500&h=500&fit=crop", alt: "Design 3", delay: 1 },
    { id: 4, src: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&h=300&fit=crop", alt: "Design 4", delay: 1.5 },
    { id: 5, src: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&h=400&fit=crop", alt: "Design 5", delay: 2 },
    { id: 6, src: "https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=400&h=500&fit=crop", alt: "Design 6", delay: 2.5 },
    { id: 7, src: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=350&h=400&fit=crop", alt: "Design 7", delay: 3 },
  ];

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <BackgroundBlobs />
      
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-4">
        <Link href="/landing" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-purple-200/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-purple-400/30">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-purple-300">
              <path d="M4 4L20 20M4 20L20 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-2xl font-bold text-white">Vizuo</span>
        </Link>
        
        <Link href="/login">
          <Button variant="ghost" className="text-foreground hover:bg-foreground/10">
            Sign in
          </Button>
        </Link>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pb-8 mb-16">
        <div className="text-center max-w-6xl mx-auto mb-6">
          <h1 className="text-5xl md:text-6xl lg:text-7xl text-white mb-4 leading-tight">
            <span className="font-medium">Where Designers </span>
            <span className="animated-gradient-text font-bold">Share</span>
            .<br />
            <span className="font-medium">Creators </span>
            <span className="animated-gradient-text font-bold">Build</span>
            .
          </h1>
          <p className="text-gray-400 text-base md:text-lg mb-6 max-w-2xl mx-auto">
            Explore community-made assets and bring your ideas to life.
          </p>
          <Link href="/login">
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-gray-200 text-base px-8 py-5 rounded-full font-semibold"
            >
              Join Now
            </Button>
          </Link>
        </div>

        {/* Floating images gallery */}
        <div className="relative w-full h-[300px] mt-4">
          {/* Far left */}
          <div className="floating-image" style={{ left: '3%', top: '8%', animationDelay: '0s' }}>
            <div className="image-card">
              <Image 
                src={galleryImages[0].src} 
                alt={galleryImages[0].alt}
                width={200}
                height={200}
                className="rounded-2xl object-cover"
              />
            </div>
          </div>
          
          {/* Left */}
          <div className="floating-image" style={{ left: '16%', top: '48%', animationDelay: '1s' }}>
            <div className="image-card">
              <Image 
                src={galleryImages[1].src} 
                alt={galleryImages[1].alt}
                width={190}
                height={190}
                className="rounded-2xl object-cover"
              />
            </div>
          </div>
          
          {/* Center-left */}
          <div className="floating-image" style={{ left: '30%', top: '5%', animationDelay: '2s' }}>
            <div className="image-card">
              <Image 
                src={galleryImages[2].src} 
                alt={galleryImages[2].alt}
                width={180}
                height={220}
                className="rounded-2xl object-cover"
              />
            </div>
          </div>
          
          {/* Center */}
          <div className="floating-image" style={{ left: '43%', top: '45%', animationDelay: '0.5s' }}>
            <div className="image-card">
              <Image 
                src={galleryImages[3].src} 
                alt={galleryImages[3].alt}
                width={240}
                height={280}
                className="rounded-2xl object-cover"
              />
            </div>
          </div>
          
          {/* Center-right */}
          <div className="floating-image" style={{ left: '62%', top: '12%', animationDelay: '1.5s' }}>
            <div className="image-card">
              <Image 
                src={galleryImages[4].src} 
                alt={galleryImages[4].alt}
                width={190}
                height={190}
                className="rounded-2xl object-cover"
              />
            </div>
          </div>
          
          {/* Right */}
          <div className="floating-image" style={{ left: '77%', top: '50%', animationDelay: '2.5s' }}>
            <div className="image-card">
              <Image 
                src={galleryImages[5].src} 
                alt={galleryImages[5].alt}
                width={180}
                height={220}
                className="rounded-2xl object-cover"
              />
            </div>
          </div>
          
          {/* Far right */}
          <div className="floating-image" style={{ left: '90%', top: '15%', animationDelay: '3s' }}>
            <div className="image-card">
              <Image 
                src={galleryImages[6].src} 
                alt={galleryImages[6].alt}
                width={170}
                height={210}
                className="rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
