'use client'
import ServiceCard from "./servicecard";

interface Service {
  title: string,
  description:string,
  icon:string
}
interface ServiceProps{
  services: Service[]

}

// components/ServicesSection.jsx
const ServicesSection: React.FC<ServiceProps> = ({ services }) => {
  return (
    <section id='servicios' className='min-h-screen w-full pt-24 md:pt-24 bg-gradient-to-b from-gray-100 via-gray-50 to-white dark:from-slate-800 dark:via-slate-900/70 dark:to-slate-900/100 snap-start'>
      <div className='max-w-7xl mx-auto px-6 flex flex-col items-center'>
        {/* Section Heading - Swapped gradients for better contrast */}
        <h2 className='text-5xl md:text-6xl lg:text-7xl font-extrabold text-center mb-12 md:mb-20 bg-clip-text text-transparent bg-gradient-to-br from-cyan-600 via-cyan-700 to-blue-700 dark:from-cyan-200 dark:via-cyan-400 dark:to-blue-500'>
          Nuestros Servicios
        </h2>

        {/* Services Grid - Unchanged */}
        <div className='w-full grid grid-cols-1 md:grid-cols-4 gap-6 mb-12'>
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};
  export default ServicesSection;