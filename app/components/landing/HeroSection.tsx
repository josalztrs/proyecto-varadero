'use client'
import { motion } from "framer-motion";
import Image, { StaticImageData } from 'next/image';
import { HTMLAttributes } from 'react';
import { GiPaperBoat } from 'react-icons/gi';

interface HeroProps extends HTMLAttributes<HTMLDivElement>{
  imageSrc: StaticImageData | string,
  imageAlt: string,
  title: string,
}

const HeroSection = ({ imageSrc, imageAlt }: HeroProps) => {
  const services = [
    {
      title: "Alquiler de espacios",
      description: "Aseguramos tu embarcación con seguridad y comodidad. No te proecupes por los amarres, ofrecemos extra.",
      icon: "⚓",
      price: "Desde 10REF"
    },
    {
      title: "Mantenimiento",
      description: "Tenemos expertos cualificados en el área de mecánica, listos para ayudarte ante cualquier avería.",
      icon: "🔧",
      price: "Desde 25REF"
    },
    {
      title: "Alojamiento",
      description: "Suites con todas las comodidades para tu descanso.",
      icon: "🏚️",
      price: "Desde 50REF"
    },
    {
      title: "Comidas y Bebidas",
      description: "Restaurante gourmet con especialidades locales e internacionales.",
      icon: "🍴",
      price: "Desde 30REF"
    }
  ];

return (
  <motion.section
    id="hero"
    className="relative flex flex-col-reverse lg:flex-row items-center justify-between bg-white dark:bg-slate-900 min-h-[90vh] w-full overflow-hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
  >
    {/* Contenido de texto */}
    <div className="w-full lg:w-1/2 px-6 md:px-12 py-8 lg:py-16 z-10 flex items-center justify-center min-h-[50vh] lg:min-h-[90vh]">
      <motion.div
        className="max-w-2xl mx-auto flex flex-col gap-6 w-full"
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {/* Encabezado */}
        <motion.div
          className="flex flex-col gap-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ rotate: -15, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.7 }}
            >
              <GiPaperBoat className="text-5xl sm:text-6xl text-amber-500 dark:text-yellow-400" />
            </motion.div>
            <span className="text-amber-600 dark:text-amber-200 text-xl sm:text-2xl font-bold tracking-tight">
              Atracadero Mar Serena
            </span>
          </div>

          <motion.h1
            className="font-extrabold text-5xl sm:text-5xl md:text-5xl leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-700 dark:from-cyan-300 dark:to-blue-400">
              Varar aquí es fácil y seguro
            </span>
          </motion.h1>
        </motion.div>

        {/* Servicios - Usando el array services */}
        <motion.div 
          className="flex flex-col gap-4 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          {services.map((service, index) => (
            <div key={index} className="border-l-4 border-amber-500 dark:border-amber-400 pl-4">
              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">{service.title}</h3>
              <p className="text-md text-gray-600 dark:text-gray-300 mt-1">{service.description}</p>
              {service.price && (
                <p className="text-amber-500 dark:text-amber-300 font-medium mt-1">
                  {service.price}
                </p>
              )}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>

    {/* Imagen */}
    <motion.div
      className="min-h-[40vh] sm:min-h-[50vh] lg:min-h-[90vh] w-full lg:w-1/2 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.0 }}
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover object-center lg:object-right"
        priority
        quality={70}
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
    </motion.div>
  </motion.section>
);
};

export default HeroSection;