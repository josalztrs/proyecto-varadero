import ExchangeCard from "@/app/components/dashboard/mainpage/exchcard";
import Header from "@/app/components/dashboard/header";
import Historial from "@/app/components/dashboard/mainpage/history";
import DashSidebar from "@/app/components/dashboard/sidebar";
import { DashboardCard } from "@/app/ui/card";
<<<<<<< HEAD
import CalendarWidget from "@/app/components/dashboard/mainpage/calendar";
=======
import { supabase } from "@/app/lib/supabase/supabaseclient";
import { NextResponse } from "next/server";
>>>>>>> 5b82739bfca3cd0308b9a9028b9e6d7ee85f5b42

const DashboardPage = () => {
    if(!supabase.auth.getUser()){
        return NextResponse.redirect('/login');
    }
    return(
        <div className="flex h-screen">
        <div className="w-1/7 pr-4"><DashSidebar/></div>
        <div className="flex-1 flex flex-col gap-4">
            <div><Header/></div>
            <div className="flex gap-4">
                <div className="w-1/3"><ExchangeCard/></div>
                <div className="flex flex-row gap-4 w-1/2">
                    <div className="h-1/2"><DashboardCard/></div>
                    <div className="h-1/2"><DashboardCard/></div>
                    <div className="h-1/2"><DashboardCard/></div>
                </div>
            </div>
            <div className="flex gap-4 p-4">
                <div className="w-1/2"><Historial/></div>
                
                
            </div>
        </div>
        <div className="absolute bottom-4 right-4 z-50">
        <div className="bg-[#1e1e2f] rounded-2xl shadow-xl p-4 text-white max-w-[90vw] sm:max-w-xs">
            <CalendarWidget/>
            </  div>
            </div>
        </div>
    )
}

export default DashboardPage;