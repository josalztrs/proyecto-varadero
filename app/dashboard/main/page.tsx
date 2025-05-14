import ExchangeCard from "@/app/components/dashboard/mainpage/exchcard";
import Header from "@/app/components/dashboard/mainpage/header";

const DashboardPage = () => {
    return(
        <div className="flex h-screen">
        <div className="w-1/5">Menu Lateral</div>
        <div className="flex-1 flex flex-col gap-4">
            <div><Header/></div>
            <div className="flex gap-4">
            <div className="w-1/3"><ExchangeCard/></div>
            <div className="flex flex-row gap-4 w-1/2">
                <div className="h-1/2">Estadistica</div>
                <div className="h-1/2">Estadistica</div>
                <div className="h-1/2">Estadistica</div>
            </div>
            </div>
            <div className="flex gap-4">
            <div className="w-1/2">Historial</div>
            <div className="w-1/2">Calendario</div>
            </div>
        </div>
        </div>
    )
}

export default DashboardPage;