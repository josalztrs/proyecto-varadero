'use client'
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { HTMLAttributes } from "react";

const LandingCard = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => {
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
    
    x.set((xVal - 0.5) * 20);
    y.set((0.5 - yVal) * 20);
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
        bg-white dark:bg-slate-800
        border border-gray-200 dark:border-slate-700
        rounded-xl p-6 
        flex flex-col gap-3
        shadow-lg hover:shadow-xl dark:hover:shadow-slate-700/50
        transition-all duration-300
        cursor-pointer
        ${className}
      `}
      {...props}
    >
      {/* Efecto de iluminación (ajustado para modo oscuro) */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 pointer-events-none"
        style={{
          background: useMotionTemplate`radial-gradient(
            600px circle at ${x.get() * 40 + 50}% ${y.get() * 40 + 50}%,
            rgba(99, 102, 241, 0.15) dark:rgba(167, 139, 250, 0.1),
            transparent 80%
          )`,
        }}
      />
      {children}
    </motion.div>
  );
};

const DashboardCard = ({children, className, ...props}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`relative bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6  flex flex-col gap-3 shadow-lg hover:shadow-xl dark:hover:shadow-slate-700/50 transition-all duration-300 cursor-pointer
        ${className}
      `}
      {...props}>
        {children}
    </div>
  );
};

export default LandingCard;
export { DashboardCard}
