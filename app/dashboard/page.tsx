import Image from "next/image";
import { LoginForm } from "../components/dashboard/loginform";
import loginimg from "../../public/boat.jpg"

const AdminLogin = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-slate-900 p-4 transition-colors duration-500">
      <Image
        src={loginimg}
        alt=""
        fill
        className='object-cover object-right blur-sm'
        priority
        quality={50}
      />
      <LoginForm/>
    </main>
  );
};

export default AdminLogin;

