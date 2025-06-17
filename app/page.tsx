"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { GiPaperBoat, GiAnchor, GiShipWheel, GiSailboat, GiFishCooked } from 'react-icons/gi';
import { FaTwitter, FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import Image from 'next/image';
import varadero from '../public/varadero.jpg';
import { useState } from 'react';
import ReservaModal from '@/app/components/Modal_reserva';

const AtracaderoLanding = () => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);

  const services = [
    {
      title: "Alquiler de espacios",
      description: "Aseguramos tu embarcación con seguridad y comodidad.",
      price: "10REF para Motos | 25 REF para Lanchas | 50REF para Yates",
      icon: <GiAnchor className="text-3xl" />,
      detail: "En nuestro varadero, ofrecemos espacios de atraque exclusivos y seguros para embarcaciones de todos los tamaños. Nuestro muelle está equipado con las mejores instalaciones y servicios auxiliares para garantizar la comodidad y tranquilidad de nuestros clientes. Con ubicación privilegiada en Varadero, somos la opción ideal para quienes buscan un lugar confiable y estratégico para sus embarcaciones. Confíe en nosotros para el cuidado y resguardo de su inversión náutica."
    },
    {
      title: "Mantenimiento",
      description: "Expertos cualificados en mecánica náutica.",
      price: "25REF para Motos | 50REF para Lanchas | 75REF para Yates",
      icon: <GiShipWheel className="text-3xl" />,
      detail: "Nuestro equipo de técnicos altamente capacitados brinda mantenimiento especializado a embarcaciones, asegurando su óptimo funcionamiento y prolongando su vida útil. Desde reparaciones mecánicas hasta limpieza profesional, ofrecemos servicios integrales con los más altos estándares de calidad. En nuestro varadero, su embarcación estará en las mejores manos, con tecnología avanzada y un compromiso inquebrantable con la excelencia."
    },
    {
      title: "Alojamiento",
      description: "Suites con todas las comodidades para tu descanso.",
      price: "50REF",
      icon: <GiSailboat className="text-3xl" />,
      detail: "Para complementar su experiencia náutica, ofrecemos alojamiento cómodo y acogedor, diseñado para satisfacer las necesidades de capitanes, tripulaciones y visitantes. Nuestras instalaciones combinan elegancia y funcionalidad, con servicios personalizados que garantizan una estancia placentera. Ubicados en el corazón de Varadero, somos el refugio perfecto después de un día en el mar."
    },
    {
      title: "Comidas y Bebidas",
      description: "Restaurante con especialidades locales.",
      price: "30REF",
      icon: <GiFishCooked className="text-3xl" />,
      detail: "Disfrute de una exquisita gastronomía en nuestro restaurante, donde fusionamos sabores locales e internacionales para ofrecer una experiencia culinaria inolvidable. Con ingredientes frescos y un servicio impecable, acompañamos sus momentos con bebidas refrescantes y cócteles exclusivos. Ya sea para un desayuno energético, un almuerzo ligero o una cena memorable, nuestro menú está diseñado para satisfacer los paladares más exigentes."
    }
  ];

  return (
    <div className="relative w-full min-h-screen bg-slate-900 overflow-hidden">
      <div className="fixed inset-0 z-0">
        <Image
          src={varadero}
          alt="Atracadero Mar Serena"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 to-slate-900/90" />
      </div>

      <div className="fixed top-6 left-6 z-20 flex flex-col space-y-4">
        {[
          { icon: <FaTwitter />, link: "https://x.com/varadero_apolly" },
          { icon: <FaFacebookF />, link: "https://www.facebook.com/profile.php?id=61576706318962&mibextid=ZbWKwL" },
          { icon: <FaInstagram />, link: "https://www.instagram.com/varadero_apollyon?igsh=enp1cG40Z241Mm50" },
          { icon: <FaWhatsapp />, link: "https://wa.me/584129896675" }
        ].map((social, index) => (
          <motion.a
            key={index}
            href={social.link}
            className="text-white text-2xl p-2 rounded-full hover:bg-amber-500/20 hover:text-amber-400 dark:hover:bg-cyan-500/20 dark:hover:text-cyan-300 transition-all duration-300"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.5 }}
            whileHover={{ 
              scale: 1.2,
              transition: { duration: 0.2 }
            }}
          >
            {social.icon}
          </motion.a>
        ))}
      </div>

      <motion.main className="relative z-10 min-h-screen flex flex-col items-center justify-center py-20 px-6">
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, -5, 5, 0] 
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-10"
        >
          <GiPaperBoat className="text-8xl text-amber-400 dark:text-cyan-400" />
        </motion.div>

        <motion.h1 
          className="text-4xl md:text-6xl font-bold text-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-white">Atracadero </span>
          <span className="text-amber-400 dark:text-cyan-400">Mar Serena</span>
        </motion.h1>

        <motion.p
          className="text-xl text-amber-100 dark:text-cyan-100 mb-12 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Tecnología y experiencia para el mejor cuidado de tu embarcación
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mb-12 relative">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              whileHover={{ 
                y: -10,
                boxShadow: "0 20px 25px -5px rgba(251, 191, 36, 0.1), 0 10px 10px -5px rgba(251, 191, 36, 0.04)"
              }}
              className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-amber-200/30 dark:border-cyan-400/30 shadow-lg hover:shadow-xl hover:shadow-neutral-500/20 transition-all duration-300 cursor-pointer relative"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => setSelectedCard(selectedCard === index ? null : index)}
            >
              {hoveredCard === index && (
                <motion.div 
                  className="absolute -top-3 -right-3 bg-amber-500 dark:bg-cyan-500 text-white text-xs font-bold px-2 py-1 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  Hazme click!
                </motion.div>
              )}

              <div className="text-amber-400 dark:text-cyan-400 mb-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
              <p className="text-gray-300 dark:text-gray-400 mb-4">{service.description}</p>
              <p className="text-amber-400 dark:text-cyan-400 font-bold">{service.price}</p>
            </motion.div>
          ))}

          <AnimatePresence>
            {selectedCard !== null && (
              <motion.div
                className="fixed inset-0 flex items-center justify-center bg-black/50 z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedCard(null)}
              >
                <motion.div 
                  className="bg-white dark:bg-slate-800 p-6 rounded-xl max-w-md mx-4 relative"
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button 
                    className="absolute top-2 right-2 text-gray-500 hover:text-amber-500 dark:hover:text-cyan-400"
                    onClick={() => setSelectedCard(null)}
                  >
                    ✕
                  </button>
                  <h3 className="text-xl font-bold text-amber-600 dark:text-cyan-400 mb-2">
                    {services[selectedCard].title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {services[selectedCard].detail}
                  </p>
                  <div className="mt-4 text-amber-500 dark:text-cyan-400 font-semibold">
                    {services[selectedCard].price}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* BOTÓN: abrir modal de reserva */}
        <motion.button
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 10px 25px rgba(251, 191, 36, 0.4)"
          }}
          whileTap={{ scale: 0.95 }}
          className="bg-amber-500 hover:bg-amber-600 dark:bg-cyan-600 dark:hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:shadow-xl hover:shadow-neutral-500/20 transition-all duration-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={() => setIsReserveModalOpen(true)}
        >
          Reserva tu espacio
        </motion.button>

        <ReservaModal isOpen={isReserveModalOpen} onClose={() => setIsReserveModalOpen(false)} />

        <div className='flex flex-row gap-4 p-4'>
          <a href="/dashboard/login" className='text-white text-sm'>ir a login</a>
          <a href="/dashboard/main" className='text-white text-sm'>ir a dashboard</a>
        </div>
      </motion.main>
    </div>
  );
};

export default AtracaderoLanding;
