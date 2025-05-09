import { HTMLAttributes } from "react";

const CardContainer = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div 
      className={`
        /* Background */
        bg-gray-200/60 hover:bg-gray-200/80 
        dark:bg-slate-800/80 dark:hover:bg-slate-700/70
        
        /* Borders */
        border border-gray-300 hover:border-gray-400 
        dark:border-slate-700 dark:hover:border-cyan-400/30
        
        /* Effects */
        hover:-translate-y-1 
        hover:shadow-lg hover:shadow-gray-400/20 
        dark:hover:shadow-cyan-500/10
        backdrop-blur-sm
        
        /* Layout */
        rounded-xl p-6 
        flex flex-col gap-3 
        transition-all duration-300
        
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default CardContainer;