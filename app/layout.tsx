import { FC, PropsWithChildren } from "react";
import "@/app/ui/globals.css"
import { nunito } from "./ui/fonts";
const RootLayout: FC<PropsWithChildren> = ({children}) => {
    return (
        <html>
            <body className={`${nunito.className}  antialiased`}>
                {children}
            </body>
        </html>
    );
};

export default RootLayout;