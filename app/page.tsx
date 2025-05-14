// app/page.jsx
import Header from "./components/landing/header";
import HeroSection from "./components/landing/HeroSection";
import ServicesSection from "./components/landing/ServiceSection";
import PricingPage from "./components/landing/pricing";
import varad from '../public/varadero.jpg'

const Inicio = () => {
  return (
    <main className="flex flex-col bg-white dark:bg-slate-900 transition-colors duration-300 mt-0">
      <Header/>
      <HeroSection 
        imageSrc={varad}
        imageAlt="Instalaciones del varadero"
        title="Varar aquí es fácil y seguro"
        description="En Apollyon, entendemos la pasión y el orgullo que sientes por tu embarcación. Es por eso que nos dedicamos a ofrecer servicios de varadero de la más alta calidad, realizados por un equipo de profesionales experimentados y comprometidos con la excelencia."
        className="snap-start"
      />
      <ServicesSection services={services}/>
      <PricingPage />
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