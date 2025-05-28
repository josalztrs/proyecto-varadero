"use client"
import { AcceptButton, DenyButton } from '@/app/ui/buttons';
import React, { useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
    const router = useRouter();
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
        // Remove showDialog from the URL
        const params = new URLSearchParams(window.location.search);
        params.delete('showDialog');
        const newUrl =
            window.location.pathname +
            (params.toString() ? `?${params.toString()}` : '');
        router.replace(newUrl, { scroll: false });
        onclose();
    }

    const clickOK = () => {
        onOK();
        closeDialog();
    }

    const Dialog: React.ReactElement | null = showDialog === 'y' ? (
    <dialog
        ref={dialogRef}
        className="backdrop:bg-black/40 rounded-xl p-0 border-none shadow-2xl w-full max-w-md mx-auto"
    >
        <div className="relative bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-lg justify-center items-center">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-amber-100/80 to-amber-200/80 dark:from-cyan-900/60 dark:to-blue-900/60">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-neutral-100">{title}</h2>
                <button
                    onClick={closeDialog}
                    className="text-2xl text-gray-400 hover:text-amber-500 dark:hover:text-cyan-400 transition-colors"
                    aria-label="Cerrar"
                >
                    <IoCloseCircle />
                </button>
            </div>
            {/* Content */}
            <div className="px-6 py-5 text-gray-700 dark:text-neutral-200">
                {children}
            </div>
            {/* Footer */}
            <div className="flex justify-end gap-4 px-6 py-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800">
                <AcceptButton onClick={clickOK}>{optionone}</AcceptButton>
                <DenyButton onClick={closeDialog}>{optiontwo}</DenyButton>
            </div>
        </div>
    </dialog>
    ) : null;


    return Dialog
};

export default ModalLayout;