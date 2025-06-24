'use client'; // Importante para usar hooks de React y framer-motion

import { motion } from "framer-motion";
import { MdPassword } from "react-icons/md";
import { BiUser } from "react-icons/bi";
// Importa tu Server Action LogIn
import { LogIn } from "@/app/lib/auth"; // Asegúrate de que esta ruta sea correcta

export const LoginForm = () => {
  // Estado para controlar la animación de clic del botón
  // No es para el estado de carga del formulario, sino solo para el feedback visual del clic.

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="w-full space-y-6"
    >
      {/* El formulario seguirá apuntando a tu Server Action LogIn */}
      <form className="w-full space-y-6">
        {/* Campo Usuario con animación */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <label htmlFor="user" className="flex items-center text-gray-700 dark:text-neutral-300 font-medium">
            <BiUser className="text-xl mr-2 text-amber-500 dark:text-cyan-400" />
            Usuario
          </label>
          <motion.input
            type="email"
            id="user"
            name="email" // Asegúrate de que el 'name' esté presente para que formAction funcione
            className="w-full px-4 py-3 bg-white dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 text-gray-800 dark:text-neutral-200 placeholder-gray-400 dark:placeholder-slate-500 transition-all duration-200"
            placeholder="Tu correo electrónico"
            whileFocus={{
              borderColor: "#f59e0b",
              boxShadow: "0 0 0 3px rgba(251, 191, 36, 0.2)",
            }}
            autoComplete="username"
            required
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
            <MdPassword className="text-xl mr-2 text-amber-500 dark:text-cyan-400" />
            Contraseña
          </label>
          <motion.input
            type="password"
            id="pwd"
            name="password" // Asegúrate de que el 'name' esté presente para que formAction funcione
            className="w-full px-4 py-3 bg-white dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 text-gray-800 dark:text-neutral-200 placeholder-gray-400 dark:placeholder-slate-500 transition-all duration-200"
            placeholder="••••••••"
            whileFocus={{
              borderColor: "#f59e0b",
              boxShadow: "0 0 0 3px rgba(251, 191, 36, 0.2)",
            }}
            autoComplete="current-password"
            required
          />
        </motion.div>

        {/* Botón con animación de clic */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className=" flex items-center justify-center"
        >
          <motion.button
            type="submit"
            formAction={LogIn} // Esto hará que el botón envíe el formulario a tu Server Action
            className="px-6 py-3 text-lg font-bold text-white bg-gradient-to-br rounded-lg from-blue-600 to-blue-500 dark:from-blue-700 dark:to-blue-600 shadow-md hover:shadow-lg shadow-blue-500/30 dark:shadow-blue-600/20 flex items-center justify-center min-w-[170px]"
            // Animaciones de Framer Motion para el botón mismo
            whileHover={{ scale: 1.02 }} // Mantiene la animación de hover existente
            whileTap={{ scale: 0.95, y: 2 }} // Animación al hacer clic (escalado y ligero movimiento hacia abajo)
            transition={{ type: "spring", stiffness: 400, damping: 10 }} // Transición más elástica para el clic
          >
            Iniciar Sesión
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
};
