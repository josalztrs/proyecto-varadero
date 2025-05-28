import Header from '@/app/components/dashboard/header';
import DashSidebar from '@/app/components/dashboard/sidebar';
import React from 'react';

const VehicPage = () => {
    return (
        <div className="grid grid-cols-5 grid-rows-5 gap-4">
            <div className="row-span-5"><DashSidebar/></div>
            <div className="col-span-4"><Header/></div>
            <div className="col-start-2 row-start-2">Boton de agregar</div>
            <div className="col-span-4 row-span-3 col-start-2 row-start-3">Tabla</div>
            <div className="col-start-3 row-start-2">Relleno</div>
            <div className="col-start-4 row-start-2">Relleno</div>
            <div className="col-start-5 row-start-2">Relleno</div>
        </div>
    );
};

export default VehicPage;