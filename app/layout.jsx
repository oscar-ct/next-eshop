import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "e-shop by Next.js",
  description: "e-shop rebuilt with Next.js",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
            <Navbar/>
                <main>
                    {children}
                </main>
            </body>
        </html>
    );
};
