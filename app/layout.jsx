import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/navbar/Nav";
import {Toaster} from "react-hot-toast";
import AuthProvider from "@/components/AuthProvider";
import {GlobalProvider} from "@/context/GlobalContext";
import Footer from "@/components/footer/Footer";
import AddToCartModal from "@/components/modals/AddToCartModal";
import Theme from "@/app/theme";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    keywords: "oscar, shop, shoposcar, oscar castro, castro",
    robots: "index, follow, max-image-preview: large",
    // verification: {
    //     google: "JKNPelzYqvq4H9cuv_31abNyv84JS7GDY_3F5oXQPVE",
    // },
    description: "Built by Oscar Castro. Enjoy great deals on everyday essentials.",
    alternates: {
        canonical: "https://shoposcar.com",
    },
    icons: {
        icon: "/icon.ico",
        shortcut: "/icon.ico",
        apple: "/apple-icon.png",
        other: [{ rel: "icon", url: "/icon.png", sizes: "192x192" }],
    },
    openGraph: {
        title: "Shoposcar.com. Shop Online. Shop Oscar.",
        description: "Built by Oscar Castro. Enjoy great deals on everyday essentials.",
        images: [{ url: "/logo.png", width: 1000, height: 600, alt: "shoposcar" }],
        url: "https://shoposcar.com",
        siteName: "Shop Oscar",
        locale: "en_US",
        type: "website",
    },
    twitter: {
        title: "Shoposcar.com. Shop Online. Shop Oscar.",
        description: "Built by Oscar Castro. Enjoy great deals on everyday essentials.",
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
