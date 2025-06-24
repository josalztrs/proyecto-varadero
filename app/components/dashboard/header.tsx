"use client";

import LocalTime from "@/app/lib/datetime";
import React from "react";
import { IoExit } from "react-icons/io5";
import ReservaNotification from "./mainpage/Notificaciones/notification_reserva";
import { signOut } from "@/app/lib/auth";
import Link from "next/link";

const Header = () => {
  return (
    <header className="rounded-full sticky top-4 z-50 flex justify-between items-center px-4 py-3 bg-white/75 dark:bg-slate-900/75 backdrop-blur-lg border border-yellow-500/20 dark:border-cyan-500/20 shadow-lg dark:shadow-slate-900/90 transition-all duration-300">
      {/* Left */}
      <div className="flex items-center space-x-4 md:space-x-6 px-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-neutral-100 tracking-tight">
          Panel de <span className="text-amber-500 dark:text-cyan-400">Administración</span>
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center space-x-4 md:space-x-6">
        <div className="hidden md:flex items-center space-x-4">
          <LocalTime className="text-sm md:text-base text-gray-600 dark:text-neutral-300 hover:text-amber-500 dark:hover:text-cyan-400 transition-colors duration-200 font-medium" />
          <ReservaNotification />
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
