import { IoBoat } from "react-icons/io5";
import { PriceCard, SimplePriceCard } from "./PriceCards";
import { GiKnifeFork, GiSpeedBoat } from "react-icons/gi";
import { FaMotorcycle } from "react-icons/fa";
import { BiSolidHotel } from "react-icons/bi";
import { MdAddLocation } from "react-icons/md";
import CardContainer from "../../ui/card";
import PrimaryButton from "../../ui/buttons";
import ModalLayout from "../dashboard/modal";
import Link from "next/link";

const PricingPage: React.FC = () => {

  async function onClose() {
    "use server";
    console.log("Modal closed");
  }
  async function onOK() {
    "use server";
    console.log("Modal OK clicked");
  }
  
  return (
    <>
    <ModalLayout
      title="Resevacion"
      optionone="Reservar"
      optiontwo="Cancelar"
      onclose={onClose}
      onOK={onOK}>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis expedita dicta eos nostrum inventore molestiae, repudiandae incidunt itaque unde! Quam laudantium exercitationem aperiam nobis eum ullam sunt maxime tempora tempore.
      </p>
    </ModalLayout>



    <main id="reserva" className='flex flex-col min-h-screen w-full bg-white dark:bg-slate-900 transition-colors duration-500'>
      {/* Contenedor principal ajustado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mt-8 max-w-6xl mx-auto justify-center items-center pb-16">
        {/* Título */}
        <div className="md:col-span-3 flex justify-center mb-4">
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent text-center leading-snug bg-gradient-to-br from-amber-500 to-amber-600 dark:from-yellow-200 via-yellow-400 dark:to-amber-500">
            Nuestros precios
          </h1>
        </div>

        {/* Tarjetas en grid responsive */}
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          <PriceCard
            icon={<IoBoat />}
            title="Peñeros y Lanchas"
            price_atr={25}
            price_ama={10}
            price_man={50}
          />

          <PriceCard
            icon={<GiSpeedBoat/>}
            title="Yates"
            price_atr={50}
            price_ama={15}
            price_man={75}
          />

          <PriceCard
            icon={<FaMotorcycle/>}
            title="Motos Acuáticas"
            price_atr={10}
            price_ama={5}
            price_man={25}
          />

          <SimplePriceCard
            icon={<BiSolidHotel/>}
            title="Alojamiento"
            price={50}
          />

          <CardContainer className="flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-800 rounded-md shadow-md p-6">
            <MdAddLocation className="text-8xl text-gray-800 dark:text-slate-100 gap-4"/>
            <Link
              href="/?showDialog=y">
                <PrimaryButton>
                  Reserva Ya!
                </PrimaryButton>
            </Link>
          </CardContainer>

          <SimplePriceCard
            icon={<GiKnifeFork/>}
            title="Comida y Bebida"
            price={30}
          />
        </div>
      </div>
    </main>
    </>
  );
};

export default PricingPage;