import ExchangePage from "@/app/lib/conversorapi";
import { HTMLAttributes, ReactNode } from "react";
import LandingCard from "../../ui/card";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    icon: ReactNode,
    title: string,
    price_atr: number,
    price_ama: number,
    price_man: number
}

export const PriceCard = ({ icon, title, price_atr, price_ama, price_man }: CardProps) => {
  return (
    <LandingCard>
      {/* Icon - tamaño reducido */}
      <div className="text-5xl flex justify-center items-center text-gray-800 dark:text-slate-100">
        {icon}
      </div>

      {/* Title - tamaño reducido */}
      <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-gray-800 to-gray-600 dark:from-neutral-100 dark:to-neutral-400 text-center">
        {title}
      </div>

      {/* Pricing - tamaños reducidos */}
      <div className="flex flex-col text-gray-700 dark:text-neutral-200 gap-1 mt-1">
        {/* Section I */}
        <div className="space-y-1">
          <div className="text-xl font-bold text-yellow-500 dark:text-amber-300">Atraque</div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold">{price_atr} REF</span>
            <ExchangePage 
              monto={price_atr} 
              className="text-base text-gray-500 dark:text-neutral-400" 
            />
          </div>
        </div>

        {/* Section II */}
        <div className="space-y-1">
          <div className="text-xl font-bold text-yellow-500 dark:text-amber-300">Amarres Extra</div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold">{price_ama} REF</span>
            <ExchangePage 
              monto={price_ama} 
              className="text-base text-gray-500 dark:text-neutral-400" 
            />
          </div>
        </div>

        {/* Section III */}
        <div className="space-y-1">
          <div className="text-xl font-bold text-yellow-500 dark:text-amber-300">Mantenimiento</div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold">{price_man} REF</span>
            <ExchangePage 
              monto={price_man} 
              className="text-base text-gray-500 dark:text-neutral-400" 
            />
          </div>
        </div>
      </div>
    </LandingCard>
  );
};

interface SimplePriceCardProps {
  icon: ReactNode;
  title: string;
  price: number;
  currency?: string;
  className?: string;
}

export const SimplePriceCard: React.FC<SimplePriceCardProps> = ({
  icon,
  title,
  price,
  currency = 'REF',
  className = '',
}) => {
  return (
    <LandingCard className={className}>
      {/* Icon - tamaño reducido */}
      <div className="text-5xl flex justify-center items-center text-gray-800 dark:text-slate-100">
        {icon}
      </div>

      {/* Title - tamaño reducido */}
      <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-gray-800 to-gray-600 dark:from-neutral-100 dark:to-neutral-400 text-center">
        {title}
      </div>

      {/* Pricing - tamaños reducidos */}
      <div className="flex flex-col items-center mt-2">
        <div className="text-xl font-bold text-yellow-500 dark:text-amber-300">
          {price} {currency}
        </div>
        <ExchangePage
          monto={price}
          className="text-base text-gray-500 dark:text-neutral-400 mt-1"
        />
      </div>
    </LandingCard>
  );
};