'use client'
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { HTMLAttributes } from "react";

const CardContainer = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const transform = useMotionTemplate`
    perspective(1000px)
    rotateX(${y}deg)
    rotateY(${x}deg)
  `;

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xVal = (e.clientX - rect.left) / rect.width;
    const yVal = (e.clientY - rect.top) / rect.height;
    
    x.set((xVal - 0.5) * 10); // Ajusta la sensibilidad aquí
    y.set((0.5 - yVal) * 10);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform }}
      className={`
        relative
        bg-gray-200/60 dark:bg-slate-800/80
        border border-gray-300 dark:border-slate-700
        rounded-xl p-6 
        flex flex-col gap-3
        shadow-lg hover:shadow-xl
        transition-shadow duration-300
        cursor-pointer
        ${className}
      `}
      {...props}
    >
      {/* Efecto de iluminación que sigue al mouse */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 pointer-events-none"
        style={{
          background: useMotionTemplate`radial-gradient(
            600px circle at ${x.get() * 40 + 50}% ${y.get() * 40 + 50}%,
            rgba(99, 102, 241, 0.15),
            transparent 80%
          )`,
        }}
      />
      {children}
    </motion.div>
  );
};

export default CardContainer;