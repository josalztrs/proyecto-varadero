import { NextRequest, NextResponse } from "next/server";
import { getUser, updateSession } from "./lib/middleware";

export async function middleware(request: NextRequest, response: NextResponse) {
    const ProtectedRoutes = ["/dashboard", "/dashboard/main"]
    const authroutes = ["/login"]
    const currentPath = new URL(request.url).pathname;
    const {data: { user } } = await getUser(request, response);
    if(currentPath === "/"){
        return NextResponse.redirect(new URL("/main", request.url));
    }
    if(ProtectedRoutes.includes(currentPath) && !user){
        return NextResponse.redirect(new URL("/dashboard/login", request.url));
    }
    if(authroutes.includes(currentPath) && user){
        return NextResponse.redirect(new URL("/main", request.url));
    }
    await updateSession(request);
}