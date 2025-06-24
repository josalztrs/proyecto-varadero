// app/layout.tsx o RootLayout.tsx

import { FC, PropsWithChildren } from "react";
import "@/app/ui/globals.css";
import { nunito } from "./ui/fonts";
import { Toaster } from "sonner";

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="es">
      <head>
        <title>Atracadero Mar Serena</title>
      </head>
      <body
        className={`${nunito.className} antialiased bg-white dark:bg-slate-900 transition-colors duration-300`}
      >
        {children}
        <Toaster
          richColors
          position="top-right"
          theme="light"
          duration={3000}
        />
        {/* Contenedor portal para modales */}
        <div id="portal-root"></div>
      </body>
    </html>
  );
};

export default RootLayout;
