import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import {Toaster} from "react-hot-toast";
import AuthProvider from "@/components/AuthProvider";
import {GlobalProvider} from "@/context/GlobalContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "e-shop by Next.js",
  description: "e-shop rebuilt with Next.js",
};

export default async function RootLayout({children}) {
    return (
        <GlobalProvider>
            <AuthProvider>
                <html lang="en">
                    <body className={inter.className}>
                        <Toaster/>
                        <Navbar/>
                        <main>
                            {children}
                        </main>
                    </body>
                </html>
            </AuthProvider>
        </GlobalProvider>
    );
};
