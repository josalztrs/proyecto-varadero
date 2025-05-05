import { HTMLAttributes } from 'react';

interface ExchangePageProps extends HTMLAttributes<HTMLDivElement> {
  monto: number;
}

export default async function ExchangePage({ monto, ...props }: ExchangePageProps) {
  const res = await fetch("https://ve.dolarapi.com/v1/dolares/oficial", {
    next: { revalidate: 3600 }, // Cache cada 1 hora
  });
  const data = await res.json();
  const rate = data.promedio;
  const montot = (monto * rate).toFixed(2);
  
  return (
    <div {...props}>
      {montot}VES
    </div>
  );
}