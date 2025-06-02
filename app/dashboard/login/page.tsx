'use client'
import { motion } from "framer-motion";
import { LoginForm } from "../../components/dashboard/loginform";
import { GiPaperBoat } from "react-icons/gi";
import Image from 'next/image';
import loginimg from '@/public/boat.jpg';

const LoginPage = () => {
  return (
    <main className="relative flex items-center justify-center min-h-screen bg-amber-50/30 dark:bg-slate-900 p-4 overflow-hidden">
      {/* Imagen de fondo animada con overlay */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="fixed inset-0 z-0"
      >
        <Image
          src={loginimg}
          alt="Background"
          fill
          className="object-cover object-center"
          priority
          quality={50}
        />
        <div className="absolute inset-0 bg-gradient-to-t dark:to-slate-900/80 to-amber-50/70 from-white/20 dark:from-slate-900/20" />
      </motion.div>

      {/* Contenedor del formulario */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl shadow-xl shadow-amber-200/50 dark:shadow-slate-950/50 overflow-hidden border border-amber-200 dark:border-slate-700"
        >
          {/* Header con gradiente (amarillo en claro, cyan en oscuro) */}
          <motion.div
            className="flex flex-row bg-gradient-to-r from-amber-400 to-amber-500 dark:from-cyan-600 dark:to-blue-700 p-6 text-center items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex flex-col">
              <motion.h1 
                className="text-3xl font-bold text-white"
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.7 }}
              >
                Bienvenido
              </motion.h1>
              <motion.p 
                className="text-white/90 mt-2"
                initial={{ y: 10 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.8 }}
              >
                Inicia sesión en tu cuenta
              </motion.p>
            </div>
            <motion.div
              initial={{ rotate: -15 }}
              animate={{ rotate: 0 }}
              transition={{ delay: 1, type: 'spring' }}
            >
              <GiPaperBoat className="text-6xl text-white/90" />
            </motion.div>
          </motion.div>

          {/* Formulario */}
          <div className="p-6 sm:p-8">
            <LoginForm />
          </div>
          
          {/* Efecto de acento amarillo en modo claro */}
          <motion.div 
            className="absolute -bottom-1 left-0 right-0 h-1 bg-amber-400 dark:bg-cyan-500"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.2, duration: 0.8, type: 'spring' }}
          />
        </motion.div>
      </motion.div>;
    </main>
  );
};

export default LoginPage;