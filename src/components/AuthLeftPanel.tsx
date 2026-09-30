import TestimonialCarousel from './TestimonialCarousel.tsx';
import { ITestimonalData } from '../types/user.ts';
import React from 'react';
import logo from '../assets/logo1.png';
interface ILeftPanelProps {
  testimonialData: ITestimonalData[];
}

const AuthLeftPanel: React.FC<ILeftPanelProps> = ({ testimonialData }) => {
  return (
    <div className="hidden md:block relative w-full h-full bg-black overflow-hidden rounded-r-xl">
      {/* Animated Green Aurora Background */}
      <div className="absolute inset-0 opacity-60">
        <div className="absolute top-0 left-0 w-full h-full">
          <svg className="w-full h-full" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="aurora1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00ff00" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#00cc00" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#00aa00" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="aurora2" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00ff88" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#00dd44" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#00bb22" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            
            {/* First flowing wave */}
            <path 
              d="M0,200 Q100,100 200,150 T400,200 L400,600 Q300,500 200,550 T0,600 Z" 
              fill="url(#aurora1)"
              className="animate-pulse"
            />
            
            {/* Second flowing wave */}
            <path 
              d="M0,400 Q150,300 300,350 T400,400 L400,800 Q250,700 100,750 T0,800 Z" 
              fill="url(#aurora2)"
              className="animate-pulse"
              style={{ animationDelay: '1s' }}
            />
            
            {/* Third accent wave */}
            <path 
              d="M0,600 Q200,500 400,600 L400,800 L0,800 Z" 
              fill="url(#aurora1)"
              opacity="0.3"
              className="animate-pulse"
              style={{ animationDelay: '2s' }}
            />
          </svg>
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col h-full p-8 text-white">
        
        {/* Logo Section */}
        <div className="mb-8">
          <img src={logo} alt="HouseBank Logo" className="h-9 w-10" />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center max-w-sm">
          <h1 className="text-4xl font-bold mb-6 leading-tight">
            Rent, Buy & Invest with HouseBank
          </h1>
          <p className="text-lg leading-relaxed opacity-90 mb-4">
            Be in control of your next house for Rent, Buy or Investment, you are in charge.
          </p>
          <p className="text-lg leading-relaxed opacity-90">
            Sign up and be in control of the future
          </p>
        </div>

        {/* Testimonial Section - Bottom */}
        <div className="mt-auto">
          <TestimonialCarousel testimonials={testimonialData} />
        </div>
      </div>

      {/* Additional glow effects */}
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-green-400 rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute bottom-1/4 left-0 w-48 h-48 bg-green-300 rounded-full opacity-20 blur-3xl"></div>
    </div>
  );
};

export default AuthLeftPanel;