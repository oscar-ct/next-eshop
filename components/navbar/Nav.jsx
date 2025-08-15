import Link from "next/link";
import NavCartIcon from "@/components/navbar/NavCartIcon";
import NavMobile from "@/components/navbar/NavMobile";
import NavbarSearchBox from "@/components/navbar/NavSearchBox";
import NavProductsDropdown from "@/components/navbar/NavProductsDropdown";
import NavUserDropdown from "@/components/navbar/NavUserDropdown";
import {getServerSession} from "next-auth";
import NavThemeToggle from "@/components/navbar/NavThemeToggle";
import {BiHomeSmile} from "react-icons/bi";
import NavBar from "@/components/navbar/NavBar";


const Nav = async () => {

    const session = await getServerSession();

    const dashboardLink = "/admin/dashboard/orders";
    const myOrdersLink = "/account/orders";
    const myAccountLink = "/account";
    const topRatedLink = "/products/sort/toprated/select/all/page/1";
    const latestProductsLink = "/products/sort/latest/select/all/page/1";


    return (
        <>
            <div className={"z-50 fixed right-0 top-0 flex md:hidden"}>
                <NavMobile
                    session={session}
                    links={{latestProductsLink,
                    myAccountLink,
                    myOrdersLink,
                    topRatedLink,
                    dashboardLink}}
                />
            </div>
            <NavBar>
                <div className="h-full w-full flex justify-between items-center relative">
                    <div className={"flex cursor-pointer px-3"}>
                        <Link
                            href={"/"}
                            className={"text-xl flex items-center hover:scale-110 transition duration-150"}
                        >
                            <BiHomeSmile size={26} className={"dark:invert"}/>
                        </Link>
                    </div>
                    <div className={"absolute right-24 md:hidden"}>
                        <NavThemeToggle/>
                    </div>
                    <div className={"absolute right-12 md:hidden"}>
                        <NavCartIcon/>
                    </div>
                    <div className={"hidden md:flex justify-end"}>
                        <div className={"pr-3"}>
                            <div className="flex items-center gap-3 lg:gap-6">
                                <NavThemeToggle/>
                                <NavbarSearchBox/>
                                <NavCartIcon/>
                                <NavProductsDropdown
                                    latestProductsLink={latestProductsLink}
                                    topRatedLink={topRatedLink}/>
                                <NavUserDropdown
                                    session={session}
                                    dashboardLink={dashboardLink}
                                    myAccountLink={myAccountLink}
                                    myOrdersLink={myOrdersLink}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </NavBar>
        </>
    )
};

export default Nav;