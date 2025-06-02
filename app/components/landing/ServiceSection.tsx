'use client'

import ServiceCard from "./ServiceCard";
interface Service {
  title: string,
  description:string,
  icon:string,
  price:string
}
interface ServiceProps{
  services: Service[]

}

// components/ServicesSection.jsx
const ServicesSection: React.FC<ServiceProps> = ({ services }) => {
  return (
        <div className='flex flex-row'>
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
  );
};
  export default ServicesSection;