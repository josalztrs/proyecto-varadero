import { motion } from "framer-motion";
import { MdPassword } from "react-icons/md";
import { BiUser } from "react-icons/bi";
import PrimaryButton from "../../ui/buttons";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase/supabase";

export const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email: username,
      password: password,
    });

    if (error) {
      setError("Usuario o contraseña incorrectos");
    } else {
      router.push("/dashboard/main");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="w-full space-y-6"
    >
      <form className="w-full space-y-6" onSubmit={handleSubmit}>
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Botón con animación */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className=" flex items-center justify-center"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <PrimaryButton type="submit">
              Iniciar Sesion
            </PrimaryButton>
          </motion.div>
        </motion.div>
      </form>
    </motion.div>
  );
};