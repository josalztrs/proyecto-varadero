'use client'
import { motion } from "framer-motion";
import { MdPassword } from "react-icons/md";
import { BiUser } from "react-icons/bi";
import { FiLock } from "react-icons/fi";
import PrimaryButton from "../../ui/buttons";

export const LoginForm = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="w-full space-y-6"
    >
      {/* Encabezado con animación */}
      <motion.div 
        className="flex items-center justify-center mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          initial={{ rotate: -15, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, delay: 0.6 }}
        >
          <FiLock className="text-cyan-500 dark:text-cyan-400 text-3xl mr-3" />
        </motion.div>
        <motion.h1 
          className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-300 dark:to-blue-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Iniciar Sesión
        </motion.h1>
      </motion.div>

      <form className="w-full space-y-6">
        {/* Campo Usuario con animación */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <label htmlFor="user" className="flex items-center text-gray-700 dark:text-neutral-300 font-medium">
            <BiUser className="text-xl mr-2 text-cyan-500 dark:text-cyan-400" />
            Usuario
          </label>
          <motion.input
            type="text"
            id="user"
            className="w-full px-4 py-3 bg-white dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 text-gray-800 dark:text-neutral-200 placeholder-gray-400 dark:placeholder-slate-500 transition-all duration-200"
            placeholder="Tu nombre de usuario"
            whileFocus={{
              borderColor: "#06b6d4",
              boxShadow: "0 0 0 3px rgba(6, 182, 212, 0.2)"
            }}
          />
        </motion.div>

        {/* Campo Contraseña con animación */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
        >
          <label htmlFor="pwd" className="flex items-center text-gray-700 dark:text-neutral-300 font-medium">
            <MdPassword className="text-xl mr-2 text-cyan-500 dark:text-cyan-400" />
            Contraseña
          </label>
          <motion.input
            type="password"
            id="pwd"
            className="w-full px-4 py-3 bg-white dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 text-gray-800 dark:text-neutral-200 placeholder-gray-400 dark:placeholder-slate-500 transition-all duration-200"
            placeholder="••••••••"
            whileFocus={{
              borderColor: "#06b6d4",
              boxShadow: "0 0 0 3px rgba(6, 182, 212, 0.2)"
            }}
          />
        </motion.div>

        {/* Botón con animación */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className=" flex items-center justify-center"
        >
          <PrimaryButton 
            href="#"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Iniciar Sesión
          </PrimaryButton>
        </motion.div>
      </form>
    </motion.div>
  );
};