'use client'
import { HTMLAttributes } from "react";


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

export { DashboardCard}
