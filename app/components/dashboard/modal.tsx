"use client"
import { AcceptButton, DenyButton } from '@/app/ui/buttons';
import React, { useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { IoCloseCircle } from 'react-icons/io5';

interface ModalLayoutProps {
    title: string
    optionone: string
    optiontwo: string
    children: React.ReactNode;
    onclose: () => void;
    onOK: () => void;

}
const ModalLayout = ({ children, title, optionone, optiontwo, onclose, onOK }: ModalLayoutProps) => {
        const searchParams = useSearchParams();
        const dialogRef = useRef<null | HTMLDialogElement>(null);
        const showDialog = searchParams.get('showDialog');

        useEffect(() => {
            if (showDialog === 'y') {
                dialogRef.current?.showModal();
            } else {
                dialogRef.current?.close();
            }
        }, [showDialog]);

        const closeDialog = () => {
            dialogRef.current?.close();
            onclose();
        }

        const clickOK = () => {
            onOK();
            closeDialog();
        }

        const Dialog: React.ReactElement | null = showDialog === 'y' ? (
            <dialog ref={dialogRef}>
                <div>
                    <div className='flex flex-row justify-around items-center'>
                      <h2>{title}</h2>
                      <button onClick={closeDialog}>
                        <IoCloseCircle/>
                        </button>  
                    </div>
                    <div>
                        {children}
                    </div>
                    <div className='flex flex-row justify-evenly items-center gap-6'>
                        <AcceptButton onClick={clickOK}>{optionone}</AcceptButton>
                        <DenyButton onClick={closeDialog}>{optiontwo}</DenyButton>
                    </div>
                </div>
            </dialog>
        ) : null;


        return Dialog
};

export default ModalLayout;