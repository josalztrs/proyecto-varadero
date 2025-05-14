'use client'
import { motion } from "framer-motion";
import Image, { StaticImageData } from 'next/image';
import { HTMLAttributes } from 'react';
import { GiPaperBoat } from 'react-icons/gi';
import { IoIosArrowDown } from 'react-icons/io';

interface HeroProps extends HTMLAttributes<HTMLDivElement>{
  imageSrc: StaticImageData | string,
  imageAlt: string,
  title: string,
  description: string
}

const HeroSection = ({ imageSrc, imageAlt, title, description }: HeroProps) => {
  return (
    <motion.section 
      id='hero' 
      className='relative flex flex-col-reverse lg:flex-row items-center justify-between bg-white dark:bg-slate-900 min-h-screen w-full'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Text content - Versión compacta */}
      <div className='min-h-auto w-full lg:w-1/2 px-6 md:px-12 py-12 lg:py-16 z-10'>
        <motion.div 
          className='max-w-xl mx-auto flex flex-col gap-4'
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* Logo compacto */}
          <motion.div 
            className='flex items-center gap-2 mb-4'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <motion.div
              initial={{ rotate: -15, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.7 }}
            >
            
            <div className="flex flex-row gap-4 items-center justify-center">
              <span className='text-amber-600 dark:text-amber-200 text-xl font-bold tracking-tight leading-none'>Varadero</span>
              <GiPaperBoat className='text-5xl text-amber-500 dark:text-yellow-400'/>
              <span className='text-amber-600 dark:text-amber-200 text-xl font-bold tracking-tight leading-none'>Apollyon</span>
            </div>
            </motion.div>
          </motion.div>
          
          {/* Título más compacto */}
          <motion.h1 
            className='font-extrabold bg-clip-text text-transparent text-4xl md:text-5xl leading-tight text-left bg-gradient-to-r from-cyan-600 to-blue-700 dark:from-cyan-300 dark:to-blue-400'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
          >
            {title}
          </motion.h1>
          
          {/* Descripción más corta */}
          <motion.p 
            className='text-gray-700 dark:text-slate-300 text-base md:text-lg leading-relaxed text-left mt-3 max-w-md'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            {description}
          </motion.p>
          
          {/* Scroll indicator compacto */}
          <motion.div 
            className='mt-8'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <motion.div
              className="flex items-center gap-2 group cursor-pointer"
              whileHover={{ x: 3 }}
            >
              <motion.div
                animate={{ 
                  y: [0, 5, 0],
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <IoIosArrowDown className='text-xl text-cyan-600 dark:text-cyan-400'/>
              </motion.div>
              <p className='text-sm font-medium text-cyan-600 dark:text-cyan-400'>
                Ver más
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Imagen ajustada */}
      <motion.div 
        className='min-h-screen w-full lg:w-1/2 h-[40vh] lg:h-[80vh] relative'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0 }}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className='object-cover object-center lg:object-right'
          priority
          quality={70}
        />
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;