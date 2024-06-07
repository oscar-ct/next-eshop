import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import {Toaster} from "react-hot-toast";
import AuthProvider from "@/components/AuthProvider";
import {GlobalProvider} from "@/context/GlobalContext";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "e-shop by Oscar Castro",
    description: "e-shop was developed by Oscar Castro, a software developer based in San Antonio, TX.",
};

export default async function RootLayout({children}) {
    return (
        <GlobalProvider>
            <AuthProvider>
                <html lang="en">
                    <body className={`${inter.className} bg-white dark:bg-black`}>
                        <Toaster/>
                        <Navbar/>
                        <main className={"bg-white mt-[48px] md:mt-[80px] mx-auto min-h-[calc(100vh-292px)] md:min-h-[calc(100vh-224px)]"}>
                            {children}
                        </main>
                        <Footer/>
                    </body>
                </html>
            </AuthProvider>
        </GlobalProvider>
    );
};
