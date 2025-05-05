const DashboardPage = () => {
    return(
        <div className="grid grid-cols-5 grid-rows-6 gap-4">
            <div className="row-span-6">Menu Lateral</div>
            <div className="col-span-4">Header</div>
            <div className="col-span-2 row-span-2 col-start-4 row-start-5">Calendario</div>
            <div className="col-span-2 row-span-2 col-start-2 row-start-5">Historial</div>
            <div className="col-start-2 row-start-2">Tasa BCV</div>
            <div className="row-span-2 col-start-3 row-start-2">Estadistica</div>
            <div className="row-span-2 col-start-4 row-start-2">Estadistica</div>
            <div className="row-span-2 col-start-5 row-start-2">Estadistica</div>
        </div>
    )
}

export default DashboardPage;