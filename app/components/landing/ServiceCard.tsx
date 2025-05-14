import { HTMLAttributes } from "react";
import LandingCard from "../../ui/card";

interface ServiceCardProps extends HTMLAttributes<HTMLDivElement>{
  icon: string,
  title: string,
  description:string,
}
// components/ServiceCard.jsx
const ServiceCard = ({ title, description, icon, className }: ServiceCardProps) => (
  <LandingCard className={`relative ${className || ''}`}>
    {/* Contenedor del icono modificado */}
    <div className='text-4xl mb-5 text-cyan-500 dark:text-cyan-400 group-hover:scale-110 transition-transform duration-300'>
      {icon}
    </div>
    
    <h3 className='text-gray-800 dark:text-slate-100 text-xl font-bold mb-3'>{title}</h3>
    <p className='text-gray-600 dark:text-slate-300/90 leading-relaxed'>{description}</p>
    
    <div className="absolute bottom-4 left-4 w-8 h-0.5 bg-cyan-400/0 group-hover:bg-cyan-400/80 transition-all duration-500"></div>
  </LandingCard>
);
  
  export default ServiceCard;