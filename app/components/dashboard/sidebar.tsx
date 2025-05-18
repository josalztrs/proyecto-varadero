import Link from 'next/link';
import React from 'react';
import { FaBook } from 'react-icons/fa6';
import { GiPaperBoat } from 'react-icons/gi';
import { HiMiniHomeModern, HiWrenchScrewdriver } from 'react-icons/hi2';
import { MdHelp } from 'react-icons/md';
import { PiBoatFill } from 'react-icons/pi';

const DashSidebar = () => {
  return (
    <div className='p-8 flex flex-col items-center justify-between h-full bg-gradient-to-b from-amber-400 to-amber-500 dark:from-cyan-600 dark:to-blue-700 gap-10 text-white dark:text-neutral-200'>
      <div>
        <GiPaperBoat className='text-6xl text-white dark:text-neutral-200' />
      </div>
      <Link
        href='#'
        className='flex flex-row gap-4 items-center font-bold hover:text-amber-700 dark:hover:text-blue-900 transition-colors duration-200'
      >
        <PiBoatFill className="text-xl" />
        Embarcaciones
      </Link>
      <Link
        href='#'
        className='flex flex-row gap-4 items-center font-bold hover:text-amber-700 dark:hover:text-blue-900 transition-colors duration-200'
      >
        <HiMiniHomeModern className="text-xl" />
        Alojamientos
      </Link>
      <Link
        href='#'
        className='flex flex-row gap-4 items-center font-bold hover:text-amber-700 dark:hover:text-blue-900 transition-colors duration-200'
      >
        <HiWrenchScrewdriver className="text-xl" />
        Mantenimiento
      </Link>
      <Link
        href='#'
        className='flex flex-row gap-4 items-center font-bold hover:text-amber-700 dark:hover:text-blue-900 transition-colors duration-200'
      >
        <FaBook className="text-xl" />
        Contabilidad
      </Link>
      <Link
        href='#'
        className='text-4xl font-extrabold hover:text-amber-700 dark:hover:text-blue-900 transition-colors duration-200'>
          <MdHelp/>
        </Link>
    </div>
  );
};

export default DashSidebar;