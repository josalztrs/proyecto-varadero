"use server"

import { redirect } from "next/navigation";
import { createClient } from "./supabase/supabaseserver"
import { revalidatePath } from "next/cache";

export async function LogIn(formData: FormData){
    const supabase = await createClient();
    const credentials = {
        email: formData.get("email") as string,
        password: formData.get("password") as string
    } 
    const { error } = await supabase.auth.signInWithPassword({...credentials})
    if (error){
        alert("Error al iniciar sesión: " + error.message)
        return;
    }
    revalidatePath("/", "layout")
    redirect("/dashboard/main")
}

export async function signOut() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut()
    if (error){
        alert("Error al cerrar sesión: " + error.message)
        return;
    }
    revalidatePath("/", "layout")
    redirect("/")

}