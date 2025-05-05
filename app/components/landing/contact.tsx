import { FaFacebook, FaInstagram, FaWhatsapp, FaXTwitter } from "react-icons/fa6";

const ContactPage: React.FC = () => {
    return (
      <div className="py-16 md:py-24 bg-white dark:bg-slate-900 transition-colors duration-500 flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-slate-100 mb-8 text-center">
          Nuestros medios de contacto
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 justify-items-center">
          <div className="flex flex-col items-center">
            <a href="#" className="text-4xl text-blue-500 hover:text-blue-600 transition-colors duration-300">
              <FaXTwitter />
            </a>
            <p className="mt-2 text-gray-600 dark:text-slate-300">Síguenos en X</p>
          </div>
          <div className="flex flex-col items-center">
            <a href="#" className="text-4xl text-blue-600 hover:text-blue-700 transition-colors duration-300">
              <FaFacebook />
            </a>
            <p className="mt-2 text-gray-600 dark:text-slate-300">Encuéntranos en Facebook</p>
          </div>
          <div className="flex flex-col items-center">
            <a href="#" className="text-4xl text-pink-500 hover:text-pink-600 transition-colors duration-300">
              <FaInstagram />
            </a>
            <p className="mt-2 text-gray-600 dark:text-slate-300">Visítanos en Instagram</p>
          </div>
          <div className="flex flex-col items-center">
            <a href='#' className="text-4xl text-green-500 hover:text-green-600 transition-colors duration-300">
              <FaWhatsapp/>
            </a>
            <p className="mt-2 text-gray-600 dark:text-slate-300">Contáctanos por WhatsApp</p>
          </div>
        </div>
      </div>
    );
  };

export default ContactPage;