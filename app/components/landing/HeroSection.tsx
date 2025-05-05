// components/HeroSection.jsx
import Image from 'next/image';
import { HTMLAttributes } from 'react';
import { GiPaperBoat } from 'react-icons/gi';
import { IoIosArrowDown } from 'react-icons/io';

interface HeroProps extends HTMLAttributes<HTMLDivElement>{
  imageSrc: string,
  imageAlt: string,
  title: string,
  description: string
}

const HeroSection = ({ imageSrc, imageAlt, title, description }: HeroProps) => {
  return (
    <section id='hero' className='relative flex flex-col md:flex-row items-center w-full bg-white dark:bg-slate-900 min-h-[calc(100svh-4rem)] transition-colors duration-500'>
      {/* Image container */}
      <div className='w-full md:w-3/5 h-[50vh] md:h-[calc(100svh-4rem)] relative'>
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className='object-cover object-right'
          priority
          quality={50}
        />
      </div>
      
      {/* Text content */}
      <div className='w-full md:w-2/5 px-6 md:px-12 py-12 md:py-24 z-10'>
        <div className='max-w-md mx-auto flex flex-col gap-8'>
          {/* Logo */}
          <div className='flex items-center justify-center gap-2'>
            <span className='text-amber-600 dark:text-amber-200 text-2xl font-bold tracking-tight'>Varadero</span>
            <GiPaperBoat className='w-8 h-8 text-amber-500 dark:text-yellow-400'/>
            <span className='text-amber-600 dark:text-amber-200 text-2xl font-bold tracking-tight'>Apollyon</span>
          </div>
          
          {/* Title */}
          <h1 className='font-extrabold bg-clip-text text-transparent text-7xl leading-tight text-center bg-gradient-to-br from-cyan-600 via-cyan-700 to-blue-700 dark:from-cyan-200 dark:via-cyan-400 dark:to-blue-500'>
            {title}
          </h1>
          
          {/* Description */}
          <p className='text-gray-700 dark:text-slate-200/90 text-lg md:text-xl leading-relaxed text-center'>
            {description}
          </p>
          
          {/* Scroll indicator */}
          <ScrollDownIndicator />
        </div>
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-100/10 via-gray-100/50 to-gray-100/100 dark:from-slate-800/30 dark:via-slate-800/70 dark:to-slate-800/100 z-0"></div>
    </section>
  );
};

const ScrollDownIndicator = () => (
  <div className='flex flex-col items-center mt-6 animate-bounce'>
    <p className='text-3xl font-semibold text-cyan-600 dark:text-cyan-400 mb-1'>Explora nuestros servicios</p>
    <div className='bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-700 dark:from-cyan-400 dark:to-blue-500'>
      <IoIosArrowDown className='text-3xl text-cyan-600 dark:text-cyan-400'/>
    </div>
  </div>
);

export default HeroSection;