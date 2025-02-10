import Link from "next/link";
import logo from "../icons/e.svg";
import CartIcon from "@/components/CartIcon";
import NavbarMobile from "@/components/NavbarMobile";
import Image from 'next/image';
import NavbarSearchBox from "@/components/NavbarSearchBox";
import NavbarProducts from "@/components/NavbarProducts";
import NavbarUser from "@/components/NavbarUser";
import {getServerSession} from "next-auth";
import ToggleThemeButton from "@/components/ToggleThemeButton";


const Navbar = async () => {

    const session = await getServerSession();

    const dashboardLink = "/admin/dashboard/orders";
    const myOrdersLink = "/account/orders";
    const myAccountLink = "/account";
    const topRatedLink = "/products/sort/toprated/select/all/page/1";
    const latestProductsLink = "/products/sort/latest/select/all/page/1";

    return (
        <>
            <div className={"z-50 fixed right-0 top-0 flex md:hidden"}>
                <NavbarMobile
                    session={session}
                    links={{latestProductsLink,
                    myAccountLink,
                    myOrdersLink,
                    topRatedLink,
                    dashboardLink}}
                />
            </div>
            <div className={"z-40 fixed h-12 inset-0 bg-zinc-50 w-full md:h-16 sm:shadow dark:bg-slate-800"}>
                <div className="h-full w-full flex justify-between items-center relative">
                    <div className={"flex cursor-pointer px-3"}>
                        <Link
                            href={"/"}
                            className={"text-xl flex items-center hover:scale-110"}
                        >
                            <Image
                                priority
                                className={"w-6 h-6 dark:invert"}
                                src={logo}
                                alt="e-shop-us.com"
                            />
                        </Link>
                    </div>
                    <div className={"absolute right-24 md:hidden"}>
                        <ToggleThemeButton/>
                    </div>
                    <div className={"absolute right-12 md:hidden"}>
                        <CartIcon/>
                    </div>
                    <div className={"hidden md:flex justify-end"}>
                        <div className={"pr-3"}>
                            <div className="flex items-center gap-3 lg:gap-6">
                                <ToggleThemeButton/>
                                <NavbarSearchBox/>
                                <CartIcon/>
                                <NavbarProducts
                                    latestProductsLink={latestProductsLink}
                                    topRatedLink={topRatedLink}/>
                                <NavbarUser
                                    session={session}
                                    dashboardLink={dashboardLink}
                                    myAccountLink={myAccountLink}
                                    myOrdersLink={myOrdersLink}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default Navbar;