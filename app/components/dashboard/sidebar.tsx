'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { FaBook } from 'react-icons/fa6';
import { GiPaperBoat } from 'react-icons/gi';
import { HiMiniHomeModern, HiWrenchScrewdriver } from 'react-icons/hi2';
import { MdHelp } from 'react-icons/md';
import { PiBoatFill } from 'react-icons/pi';

const DashSidebar = () => {
  const pathname = usePathname();
  
  const navItems = [
    {
      href: '/embarcaciones',
      icon: <PiBoatFill className="text-xl" />,
      label: 'Embarcaciones'
    },
    {
      href: '/alojamientos',
      icon: <HiMiniHomeModern className="text-xl" />,
      label: 'Alojamientos'
    },
    {
      href: '/mantenimiento',
      icon: <HiWrenchScrewdriver className="text-xl" />,
      label: 'Mantenimiento'
    },
    {
      href: '/contabilidad',
      icon: <FaBook className="text-xl" />,
      label: 'Contabilidad'
    }
  ];

  return (
    <div className='p-4 flex flex-col items-center justify-between h-full bg-gradient-to-b from-amber-400 to-amber-500 dark:from-cyan-600 dark:to-blue-700 gap-6 text-white'>
      {/* Logo */}
      <div className='mt-2 mb-4 items-center justify-center flex flex-col'>
        <GiPaperBoat className='text-6xl text-white'/>
        <h1 className='font-bold'>Varadero Apollyon</h1>
      </div>

      {/* Items */}
      <nav className='flex flex-col items-center justify-evenly w-full gap-2 flex-1 text-2xl'>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-row gap-3 items-center justify-center w-full p-4 rounded-lg transition-all duration-200 font-extrabold
              ${pathname === item.href 
                ? 'bg-white/20 backdrop-blur-sm shadow-md'
                : 'hover:bg-white/10 hover:shadow-sm'
              }`}
          >
            <span className={`text-xl ${pathname === item.href ? 'text-amber-100 dark:text-cyan-100' : 'text-white'}`}>
              {item.icon}
            </span>
            <span className='font-medium text-sm'>
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      {/* Boton Ayuda */}
      <div className='mb-2 w-full flex justify-center'>
        <Link
          href='/ayuda'
          className={`p-3 rounded-full transition-all duration-200 flex items-center gap-2
            ${pathname === '/ayuda'
              ? 'bg-white/20 backdrop-blur-sm shadow-md px-4'
              : 'hover:bg-white/10 hover:shadow-sm'
            }`}
        >
          <MdHelp className='text-xl' />
          {pathname === '/ayuda' && <span className='text-sm font-medium'>Ayuda</span>}
        </Link>
      </div>
    </div>
  );
};

export default DashSidebar;