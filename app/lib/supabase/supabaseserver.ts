import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient(){
    const cookiesStore = await cookies();
    return createServerClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ANON_KEY!,
        { cookies:{
            getAll(){
                return cookiesStore.getAll();
            },
            setAll(cookiesToSet){
                try {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        cookiesStore.set(name, value, options);
                    });
                } catch (error) {   }
            }
        } }
    )
}