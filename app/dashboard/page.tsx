'use client'
import { motion } from "framer-motion";
import Image from 'next/image';
import loginimg from '@/public/boat.jpg';
import { LoginForm } from "../components/dashboard/loginform";

const LoginPage = () => {
  return (
    <main className="relative flex items-center justify-center min-h-screen bg-white dark:bg-slate-900 p-4 overflow-hidden">
      {/* Imagen de fondo animada */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="fixed inset-0 z-0"
      >
        <Image
          src={loginimg}
          alt="Background"
          fill
          className="object-cover object-right"
          priority
          quality={50}
        />
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
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-700"
        >
          {/* Header con gradiente */}
          <motion.div
            className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
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
          </motion.div>

          {/* Formulario */}
          <div className="p-8">
            <LoginForm />
          </div>

          {/* Footer */}
          <motion.div 
            className="px-6 py-4 bg-gray-50 dark:bg-slate-700/30 text-center text-sm text-gray-600 dark:text-slate-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            ¿No tienes cuenta? <a href="#" className="text-cyan-600 dark:text-cyan-400 font-medium hover:underline">Regístrate</a>
          </motion.div>
        </motion.div>
      </motion.div>
    </main>
  );
};

export default LoginPage;