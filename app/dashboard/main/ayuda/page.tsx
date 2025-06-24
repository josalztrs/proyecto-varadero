'use client'
import Header from '@/app/components/dashboard/header';
import DashSidebar from '@/app/components/dashboard/sidebar';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaDownload } from 'react-icons/fa';

const HelpPage = () => {
  const contactItems = [
    {
      name: "Jose Salazar",
      image: "https://github.com/josalztrs.png",
      phone: "04267869980",
      email: "josesalazartrmsk16@gmail.com",
      github: "josalztrs"
    },
    {
      name: "Samuel Wettel",
      image: "https://github.com/xxelaifaxx.png",
      phone: "04167998593",
      email: "samuelwettel@gmail.com",
      github: "xxelaifaxx"
    }
  ];

  return (
    <div className='bg-gray-100 dark:bg-gray-950 pt-8 pr-8'>
      <div className="grid grid-cols-5 grid-rows-[auto_1fr] gap-4 min-h-screen text-black dark:text-white">
        {/* Sidebar */}
        <div className="row-span-2">
          <DashSidebar />
        </div>

        {/* Header */}
        <div className="col-span-4">
          <Header />
        </div>

        {/* Contenido principal */}
        <motion.div 
          className="col-span-4 col-start-2 row-start-2 flex flex-col justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-full max-w-6xl bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 space-y-8 border border-amber-200/30 dark:border-cyan-500/30">
            {/* Título principal */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-amber-500 dark:text-cyan-400 mb-2">
                Ayuda y Soporte
              </h1>
            </motion.div>

            {/* Manual de usuario */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center p-6 rounded-xl"
            >
              <h2 className="text-xl font-semibold text-amber-600 dark:text-cyan-400 mb-4">
                Documentación del Sistema
              </h2>
              <a
                href="/help/Manual_Usuario_Varadero.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 dark:bg-cyan-600 dark:hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 shadow-md hover:shadow-lg"
              >
                <FaDownload /> Descargar Manual del Usuario
              </a>
            </motion.div>

            {/* Contactos */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-center text-amber-500 dark:text-cyan-400 mb-8">
                ¿Necesitas Asistencia Adicional?
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {contactItems.map((person, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-slate-700 p-6 rounded-xl shadow-md border border-gray-200 dark:border-slate-600 flex flex-col items-center"
                  >
                    <div className="relative mb-4">
                      <Image
                        src={person.image}
                        width={120}
                        height={120}
                        alt={`Foto de ${person.name}`}
                        className="rounded-full border-4 border-amber-400 dark:border-cyan-500"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-amber-500 dark:bg-cyan-600 text-white rounded-full px-2 py-1 text-xs font-bold">
                        Dev
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                      {person.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 mt-3 text-gray-700 dark:text-gray-300">
                      <FaPhone className="text-amber-500 dark:text-cyan-400" />
                      <span>{person.phone}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1 text-gray-700 dark:text-gray-300">
                      <FaEnvelope className="text-amber-500 dark:text-cyan-400" />
                      <a 
                        href={`mailto:${person.email}`} 
                        className="hover:text-amber-600 dark:hover:text-cyan-300 transition-colors underline"
                      >
                        {person.email}
                      </a>
                    </div>

                    <a
                      href={`https://github.com/${person.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 text-sm text-amber-600 dark:text-cyan-400 hover:underline"
                    >
                      Ver perfil en GitHub
                    </a>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
          <div className='p-4 text-sm text-slate-500 justify-center gap-3'>
            <p>ACLARACIONES ADICIONALES:</p>
            <ul>
              <li>A) Los datos proporcionados en la grafica de &apos;Distribucion de Ingresos&apos; son producto de la suma total de las ganancias de cada sector.</li>
              <li>B) Los datos proporcionados en la grafica de &apos;Cantidad de Transacciones&apos; son producto de la suma total de la cantidad de transacciones segun la medida de tiempo escogida por el usuario.</li>
              <li>C) Los datos porporcionados en la seccion &apos;Estadisticas de Transacciones&apos; son producto de: 1- El total de transacciones realizadas. 2- La suma de todas las ganancias recibidas en transacciones. 3- La suma de todas las perdidas recibidas en transacciones. 4- La suma de todas las transacciones cuyo estado sea Pendiente 5- La suma de todas las transacciones cuyo estado sea Completado.</li>
            </ul>
            <p className=''>El equipo no se hace responsable del mal uso o abandono del software por parte de su comprador.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HelpPage;