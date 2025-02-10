import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import {Toaster} from "react-hot-toast";
import AuthProvider from "@/components/AuthProvider";
import {GlobalProvider} from "@/context/GlobalContext";
import Footer from "@/components/Footer";
import AddToCartModal from "@/components/modals/AddToCartModal";
import Theme from "@/app/theme";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "eshopjs by Oscar Castro",
    description: "eshopjs was developed by Oscar Castro, a software developer based in San Antonio, TX.",
};

export default async function RootLayout({children}) {
    return (
        <GlobalProvider>
            <AuthProvider>
                <html lang="en" suppressHydrationWarning>
                    <body className={`${inter.className} bg-zinc-50 dark:bg-slate-800`}>
                        <Theme>
                            <Toaster/>
                            <Navbar/>
                            <main className={"mt-12 mx-auto min-h-[calc(100vh-336px)] md:mt-16 md:min-h-[calc(100vh-288px)] relative overflow-x-clip overflow-y-hidden"}>
                                {children}
                                <div className={"z-0 scale-125 -rotate-6 m-auto fixed w-full top-72 h-72 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"}/>
                            </main>
                            <AddToCartModal/>
                            <Footer/>
                        </Theme>
                    </body>

                </html>
            </AuthProvider>
        </GlobalProvider>
    );
};
