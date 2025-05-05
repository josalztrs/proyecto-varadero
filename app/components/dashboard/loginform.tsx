import { MdPassword } from "react-icons/md";
import { BiUser } from "react-icons/bi";
import { FiLock } from "react-icons/fi";
import CardContainer from "../card"
import PrimaryButton from "../buttons";

export const LoginForm=()=>{
    return(
        <CardContainer className="w-full max-w-md bg-gray-100 dark:bg-slate-800 shadow-md rounded-lg">
                <div className="flex flex-col items-center p-8">
                
                <div className="flex items-center mb-8">
                    <FiLock className="text-cyan-500 dark:text-cyan-400 text-2xl mr-3" />
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-cyan-500 to-blue-600 dark:from-cyan-200 dark:via-cyan-400 dark:to-blue-500 text-center">
                    Iniciar Sesión
                    </h1>
                </div>

                <form className="w-full space-y-6">

                    <div className="space-y-2">
                    <label htmlFor="user" className="flex items-center text-gray-700 dark:text-neutral-300 font-bold">
                        <BiUser className="text-3xl mr-2 text-cyan-500 dark:text-cyan-400" />
                        Usuario
                    </label>
                    <input
                        type="text"
                        id="user"
                        className="w-full px-4 py-3 bg-gray-200 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-800 dark:text-neutral-200 placeholder-gray-500 dark:placeholder-slate-500"
                        placeholder="Tu nombre de usuario"
                    />
                    </div>


                    <div className="space-y-2">
                    <label htmlFor="pwd" className="flex items-center text-gray-700 dark:text-neutral-300 font-bold">
                        <MdPassword className="text-3xl mr-2 text-cyan-500 dark:text-cyan-400" />
                        Contraseña
                    </label>
                    <input
                        type="password"
                        id="pwd"
                        className="w-full px-4 py-3 bg-gray-200 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-800 dark:text-neutral-200 placeholder-gray-500 dark:placeholder-slate-500"
                        placeholder="••••••••"
                    />
                    </div>


                    <PrimaryButton href="#">Iniciar Sesion</PrimaryButton>
                </form>
                </div>
            </CardContainer>
    );
}

