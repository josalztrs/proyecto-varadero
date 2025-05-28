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
      href: '/dashboard/main/embarcaciones',
      icon: <PiBoatFill className="text-xl" />,
      label: 'Embarcaciones'
    },
    {
      href: '/dashboard/main/alojamientos',
      icon: <HiMiniHomeModern className="text-xl" />,
      label: 'Alojamientos'
    },
    {
      href: '/dashboard/main/mantenimiento',
      icon: <HiWrenchScrewdriver className="text-xl" />,
      label: 'Mantenimiento'
    },
    {
      href: '/dashboard/main/contabilidad',
      icon: <FaBook className="text-xl" />,
      label: 'Contabilidad'
    }
  ];

  return (
    <div
      className={`
        flex md:flex-col flex-row
        items-center justify-between
        h-16 md:h-full
        bg-gradient-to-b from-amber-400 to-amber-500 dark:from-cyan-600 dark:to-blue-700
        text-white p-2 md:p-4
        w-full md:w-[220px]
        fixed md:fixed bottom-0 md:top-0 left-0 right-0 z-50 md:z-10
        md:h-screen md:max-w-[220px]
      `}
    >
      {/* Logo (solo visible en md+) */}
      <div className='hidden md:flex mt-2 mb-4 items-center justify-center flex-col'>
        <GiPaperBoat className='text-6xl text-white'/>
        <h1 className='font-bold'>Varadero Apollyon</h1>
      </div>

      {/* Items */}
      <nav
        className={`
          flex flex-1 w-full
          md:flex-col flex-row items-center justify-evenly gap-2 text-2xl
        `}
      >
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex flex-col md:flex-row gap-1 md:gap-3 items-center justify-center
              w-full md:p-4 p-2 rounded-lg transition-all duration-200 font-extrabold
              ${pathname === item.href 
                ? 'bg-white/20 backdrop-blur-sm shadow-md'
                : 'hover:bg-white/10 hover:shadow-sm'
              }
            `}
          >
            <span className={`text-xl ${pathname === item.href ? 'text-amber-100 dark:text-cyan-100' : 'text-white'}`}>
              {item.icon}
            </span>
            <span className='font-medium text-xs md:text-sm'>
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      {/* Botón Ayuda */}
      <div className='w-full flex justify-center mb-2 md:mb-0'>
        <Link
          href='/dashboard/main/ayuda'
          className={`
            p-2 md:p-3 rounded-full transition-all duration-200 flex items-center gap-2
            ${pathname === '/ayuda'
              ? 'bg-white/20 backdrop-blur-sm shadow-md md:px-4'
              : 'hover:bg-white/10 hover:shadow-sm'
            }
          `}
        >
          <MdHelp className='text-xl' />
          <span className='hidden md:inline text-sm font-medium'>Ayuda</span>
        </Link>
      </div>
    </div>
  );
};

export default DashSidebar;