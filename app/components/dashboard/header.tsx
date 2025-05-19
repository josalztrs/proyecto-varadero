import LocalTime from '@/app/lib/datetime';
import React from 'react';
import { IoExit } from 'react-icons/io5';
import Notification from './mainpage/notification';
import { signOut } from '@/app/lib/auth';
import Link from 'next/link';

const Header = () => {
    return (
      <header className="sticky top-0 z-50 flex justify-between items-center px-4 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-cyan-500/20 shadow-sm dark:shadow-slate-700/10 transition-all duration-300">
        {/* Left section */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-neutral-100 tracking-tight">
            Admin<span className="text-amber-500 dark:text-cyan-400">Dashboard</span>
          </h1>
        </div>
  
        {/* Right section */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <div className="hidden md:flex items-center space-x-4">
            <LocalTime className="text-sm md:text-base text-gray-600 dark:text-neutral-300 hover:text-amber-500 dark:hover:text-cyan-400 transition-colors duration-200 font-medium" />
            
            <Notification />

          </div>
  
          <div className="flex items-center space-x-2">
            <Link
              title="Cerrar sesión"
              onClick={signOut}
              href="/"
              className="p-2 text-gray-500 dark:text-neutral-400 hover:text-amber-500 dark:hover:text-cyan-400 transition-colors duration-200"
              aria-label="Cerrar sesión"
            >
              <IoExit className="text-xl md:text-2xl" />
            </Link>
          </div>
        </div>
      </header>
    );
  };

export default Header;