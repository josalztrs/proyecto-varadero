// app/page.jsx
import Header from "./components/landing/header";
import HeroSection from "./components/landing/HeroSection";
import ServicesSection from "./components/landing/ServiceSection";
import varadero from '../public/varadero.jpg';
import PricingPage from "./components/landing/pricing";
import ContactPage from "./components/landing/contact";

const Inicio = () => {
  return (
    <main className="flex flex-col min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      <Header/>
      <HeroSection 
        imageSrc={varadero}
        imageAlt="Instalaciones del varadero"
        title="Varar aquí es fácil y seguro"
        description="Tecnología y experiencia para el mejor cuidado de tu embarcación."
        className="snap-start"
      />
      <ServicesSection services={services}/>
      <PricingPage />
      <ContactPage/>
    </main>
  );
};

const services = [
    {
        title: "Alquiler de espacios",
        description: "Dock premium con vigilancia 24/7 y sistemas de amarre de última generación.",
        icon: "⚓"
    },
    {
        title: "Mantenimiento",
        description: "Técnicos certificados con herramientas especializadas y repuestos originales.",
        icon: "🔧"
    },
    {
        title: "Alojamiento",
        description: "Suites con todas las comodidades para tu descanso.",
        icon: "🏚️"
    },
    {
        title: "Comidas y Bebidas",
        description: "Restaurante gourmet con especialidades locales e internacionales.",
        icon: "🍴"
    }
];

export default Inicio;