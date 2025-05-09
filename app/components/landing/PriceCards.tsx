import ExchangePage from "@/app/lib/conversorapi";
import { HTMLAttributes, ReactNode } from "react";
import CardContainer from "../../ui/card";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    icon: ReactNode,
    title: string,
    price_atr: number,
    price_ama: number,
    price_man: number
  }

export const PriceCard = ({ icon, title, price_atr, price_ama, price_man }: CardProps) => {
  return (
    <CardContainer>
      {/* Icon */}
      <div className="text-7xl flex justify-center items-center text-gray-800 dark:text-slate-100">
        {icon}
      </div>

      {/* Title */}
      <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-gray-800 to-gray-600 dark:from-neutral-100 dark:to-neutral-400 text-center">
        {title}
      </div>

      {/* Pricing */}
      <div className="flex flex-col text-gray-700 dark:text-neutral-200 gap-2 mt-2">
        {/* Section I */}
        <div className="space-y-1">
          <div className="text-2xl font-bold text-yellow-500 dark:text-amber-300">Atraque</div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-semibold">{price_atr} REF</span>
            <ExchangePage 
              monto={price_atr} 
              className="text-lg text-gray-500 dark:text-neutral-400" 
            />
          </div>
        </div>

        {/* Section II */}
        <div className="space-y-1">
          <div className="text-2xl font-bold text-yellow-500 dark:text-amber-300">Amarres Extra</div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-semibold">{price_ama} REF</span>
            <ExchangePage 
              monto={price_ama} 
              className="text-lg text-gray-500 dark:text-neutral-400" 
            />
          </div>
        </div>

        {/* Section III */}
        <div className="space-y-1">
          <div className="text-2xl font-bold text-yellow-500 dark:text-amber-300">Mantenimiento</div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-semibold">{price_man} REF</span>
            <ExchangePage 
              monto={price_man} 
              className="text-lg text-gray-500 dark:text-neutral-400" 
            />
          </div>
        </div>
      </div>
    </CardContainer>
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
    <CardContainer className={className}>
      {/* Icon */}
      <div className="text-7xl flex justify-center items-center text-gray-800 dark:text-slate-100">
        {icon}
      </div>

      {/* Title */}
      <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-gray-800 to-gray-600 dark:from-neutral-100 dark:to-neutral-400 text-center">
        {title}
      </div>

      {/* Pricing */}
      <div className="flex flex-col items-center mt-4">
        <div className="text-4xl font-bold text-yellow-500 dark:text-amber-300">
          {price} {currency}
        </div>
        <ExchangePage
          monto={price}
          className="text-lg text-gray-500 dark:text-neutral-400 mt-2"
        />
      </div>
    </CardContainer>
  );
};