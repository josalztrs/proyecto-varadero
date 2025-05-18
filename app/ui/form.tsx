import { AcceptButton, DenyButton } from '@/app/ui/buttons';
import React, { ReactNode } from 'react';

interface BDFormProps {
    children: ReactNode
}
const FormLayout = ({children}: BDFormProps) => {
    return (
        <div className='flex flex-col items-center justify-center bg-neutral-200 dark:bg-slate-600 blackdrop-blur-sm rounded-2xl shadow-xl shadow-gray-600 dark:shadow-neutral-400'>
            {children}
            <div className='flex flex-row items-center justify-evenly'>
                <AcceptButton>Guardar</AcceptButton>
                <DenyButton>Cancelar</DenyButton>
            </div>
        </div>
    );
};

export default FormLayout;