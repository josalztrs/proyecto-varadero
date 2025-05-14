"use client";

import { useState, useEffect } from 'react';

function LocalTime({...props}) {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div {...props}>
      {time}
    </div>
  );
}

const FechaLocal = ({...props}) => {
  const [fechaLocal, setFechaLocal] = useState<string>(new Date().toLocaleDateString());

  useEffect(() => {
    const intervalId = setInterval(() => {
      const ahora = new Date();
      setFechaLocal(ahora.toLocaleDateString());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div {...props}>
      {fechaLocal}
    </div>
  );
};

export default LocalTime;
export { FechaLocal };