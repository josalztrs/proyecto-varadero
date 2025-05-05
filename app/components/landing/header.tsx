import { GiPaperBoat } from 'react-icons/gi';

const Header = () => {
  return (
    <header className='sticky top-0 z-50 flex justify-between items-center p-4 bg-white/60 dark:bg-neutral-950/60 backdrop-blur-sm border-b border-gray-200 dark:border-cyan-500/30 transition-colors duration-300'>
      {/* Sección izquierda - Navegación */}
      <div className='flex items-center space-x-6 p-4'>
        {
        <a 
          href='/dashboard' 
          className='text-base md:text-lg text-gray-700 dark:text-neutral-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors duration-200 font-semibold'
        >
          Iniciar Sesión
        </a>
        /*
        <a 
          href='#' 
          className='text-base md:text-lg text-blue-600 dark:text-cyan-400 hover:text-blue-500 dark:hover:text-cyan-300 transition-colors duration-200 font-semibold'
        >
          Registrarse
        </a>
        */}
      </div>

      {/* Logo central */}
      <div className='absolute left-1/2 transform -translate-x-1/2 flex items-center'>
        <span className='text-xl md:text-2xl font-medium text-gray-900 dark:text-neutral-100'>Varadero</span>
        <GiPaperBoat className='w-6 h-6 md:w-7 md:h-7 mx-2 text-yellow-500 dark:text-yellow-400'/>
        <span className='text-xl md:text-2xl font-medium text-gray-900 dark:text-neutral-100'>Apollyon</span>
      </div>
      
      {/* Sección derecha - Contacto */}
      <div className='flex items-center'>
        {/*
        <a 
          href='#' 
          className='text-base md:text-lg text-gray-700 dark:text-neutral-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors duration-200 font-semibold'
        >
          Contacto
        </a>
        */}
      </div>
    </header>
  );
};
export default Header;