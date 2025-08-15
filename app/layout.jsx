import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/navbar/Nav";
import {Toaster} from "react-hot-toast";
import AuthProvider from "@/components/AuthProvider";
import {GlobalProvider} from "@/context/GlobalContext";
import Footer from "@/components/footer/Footer";
import AddToCartModal from "@/components/modals/AddToCartModal";
import Theme from "@/app/theme";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    metadataBase: new URL('https://www.shoposcar.com'),
    keywords: "oscar, shop, shoposcar, oscar castro, castro",
    robots: "index, follow, max-image-preview: large",
    verification: {
        google: "pRbvjS8S2iStpZPaHlVrrDkfasIqOOU5",
    },
    description: "ShopOscar.com - A sleek e-commerce site by Oscar Castro, San Antonio developer. Built with Next.js, Prisma, Stripe & PayPal. Discover my web dev craft!",
    alternates: {
        canonical: "https://shoposcar.com",
    },
    applicationName: 'ShopOscar',
    authors: [{ name: 'Oscar Castro' }, { name: 'Oscar Castro', url: 'https://oscarct.com' }],
    creator: 'Oscar Castro',
    publisher: 'Oscar Castro',
    icons: {
        icon: "/icon.ico",
        shortcut: "/icon.ico",
        apple: "/apple-icon.png",
        other: [{ rel: "icon", url: "/icon.png", sizes: "192x192" }],
    },
    openGraph: {
        title: "ShopOscar.com. Shop Online. Shop Oscar.",
        description: "ShopOscar.com - A sleek e-commerce site by Oscar Castro, San Antonio developer. Built with Next.js, Prisma, Stripe & PayPal. Discover my web dev craft!",
        images: [{ url: "/logo.png", width: 1000, height: 600, alt: "shoposcar" }],
        url: "https://shoposcar.com",
        siteName: "ShopOscar",
        locale: "en_US",
        type: "website",
    },
    twitter: {
        title: "ShopOscar.com. Shop Online. Shop Oscar.",
        description: "ShopOscar.com - A sleek e-commerce site by Oscar Castro, San Antonio developer. Built with Next.js, Prisma, Stripe & PayPal. Discover my web dev craft!",
        images: ["/logo.png"],
        card: "summary_large_image",
    },
};

export default async function RootLayout({children}) {
    return (
        <GlobalProvider>
            <AuthProvider>
                <html lang="en" suppressHydrationWarning>
                    <body className={`${inter.className} bg-zinc-50 dark:bg-slate-800 lg:dark:bg-slate-900`}>
                        <Theme>
                            <Toaster/>
                            <Nav/>
                            <main className={"h-full pb-5 pt-12 mx-auto min-h-[calc(100vh-288px)] md:pt-16 md:min-h-[calc(100vh-224px)] relative overflow-x-clip overflow-y-hidden"}>
                                {children}
                                {/*<div className={"z-0 scale-125 -rotate-6 m-auto fixed w-full top-72 h-72 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"}/>*/}
                                <div className={"z-0 fixed w-full top-0 h-full bg-[conic-gradient(var(--tw-gradient-stops))] from-[#fffbf5] via-[#f7efe5] to-[#c3acd0] dark:bg-[conic-gradient(var(--tw-gradient-stops))] dark:from-[#655d8a] dark:via-[#7897ab] dark:to-[#d885a3]"}/>
                            </main>
                            <AddToCartModal/>
                            <Footer/>
                        </Theme>
                        <Analytics/>
                    </body>
                </html>
            </AuthProvider>
        </GlobalProvider>
    );
};
