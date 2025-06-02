import { HTMLAttributes } from "react";
import LandingCard from "../../ui/card";

interface ServiceCardProps extends HTMLAttributes<HTMLDivElement>{
  icon: string,
  title: string,
  description:string,
  price: string,
}
// components/ServiceCard.jsx
const ServiceCard = ({ title, description, icon, className, price }: ServiceCardProps) => (
  <LandingCard className={`flex ${className || ''}`}>
    {/* Contenedor del icono modificado */}
    <div className='text-4xl mb-5 text-cyan-500 dark:text-cyan-400 group-hover:scale-110 transition-transform duration-300'>
      {icon}
    </div>
      <h3 className='text-gray-800 dark:text-slate-100 text-xl font-bold mb-3'>{title}</h3>
    <div className='flex flex-col justify-evenly'>
      <p className='text-gray-600 dark:text-slate-300/90 leading-relaxed'>{description}</p>
      <p className='text-gray-600 dark:text-slate-300/90 leading-relaxed'>{price}</p>
    </div>
  </LandingCard>
);
  
  export default ServiceCard;