import {FaBox, FaPlus, FaTags, FaUsers} from "react-icons/fa";
import Link from "next/link";
import {usePathname} from "next/navigation";
import DashboardOrders from "@/components/dashboard/DashboardOrders";
import DashboardUsers from "@/components/dashboard/DashboardUsers";
import DashboardProducts from "@/components/dashboard/DashboardProducts";
import DashboardProductsAdd from "@/components/dashboard/DashboardProductsAdd";
import {useEffect, useState} from "react";
import useWindowDimensions from "@/hooks/useWindowDimensions";
import {FcCancel} from "react-icons/fc";
import {MdMoneyOff, MdOutlineLocalShipping} from "react-icons/md";
import {TbHomeCheck} from "react-icons/tb";
import {RiRefund2Line} from "react-icons/ri";

const Dashboard = () => {
    const pathname = usePathname();

    const ordersLink = "/admin/dashboard/orders";
    const productsLink = "/admin/dashboard/products";
    const usersLink = "/admin/dashboard/users";
    const productsAddLink = "/admin/dashboard/products/add";

    const [mounted, setMounted] = useState(false);
    useEffect(() => {setMounted(true);}, []);

    const LINKS = [
        { label: "Orders", href: ordersLink, icon: <FaBox className="h-4 w-4" /> },
        { label: "Users", href: usersLink, icon: <FaUsers className="h-4 w-4" /> },
        { label: "Products", href: productsLink, icon: <FaTags className="h-4 w-4" /> },
        { label: "Add Product", href: productsAddLink, icon: <FaPlus className="h-4 w-4" /> }
    ];

    const {width} = useWindowDimensions();

    return (
        <div className="w-full min-h-[calc(100vh-356px)] lg:min-h-[calc(100vh-324px)] lg:grid lg:grid-cols-[240px_1fr]">
            <div className="border-r">
                <div className="h-full flex flex-col justify-between py-3">
                    {
                        !mounted ? (
                            <div className={"flex justify-center"}>
                                <span className="z-30 loading loading-bars loading-sm"/>
                            </div>
                        ) : (
                            <nav className="flex justify-around lg:flex-col px-4 text-sm font-medium">
                                {LINKS.map(({href, label, icon}) => (
                                    <Link
                                        key={label}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-50 ${pathname === href && "bg-gray-200 text-gray-900 dark:bg-slate-700 dark:text-gray-50"}`}
                                        href={href}
                                    >
                                        {icon}
                                        {width > 768 && label}
                                    </Link>
                                ))}
                            </nav>
                        )
                    }
                    {
                        pathname === ordersLink && (
                            <div className={"hidden lg:flex flex-col px-5"}>
                                <h3 className={"text-gray-800 font-semibold border-b-2 py-2 dark:text-gray-300"}>
                                    Order Key
                                </h3>
                                <div
                                    className={"flex flex-col gap-3.5 text-sm font-semibold text-gray-700 pt-5 dark:text-gray-200"}>
                                    <div className={"flex items-center gap-3"}>
                                        <FcCancel className={"w-5 h-5"}/>
                                        <span>% Canceled</span>
                                    </div>
                                    <div className={"flex items-center gap-3"}>
                                        <MdMoneyOff className={"w-5 h-5"}/>
                                        <span>Unpaid</span>
                                    </div>
                                    <div className={"flex items-center gap-3"}>
                                        <MdOutlineLocalShipping className={"w-5 h-5"}/>
                                        <span>Shipped</span>
                                    </div>
                                    <div className={"flex items-center gap-3"}>
                                        <TbHomeCheck className={"w-5 h-5"}/>
                                        <span>Delivered</span>
                                    </div>
                                    {/*<div className={"flex items-center gap-3"}>*/}
                                    {/*    <FaHandHoldingDollar className={"w-5 h-5"}/>*/}
                                    {/*    <span>Pending reimbursement</span>*/}
                                    {/*</div>*/}
                                    <div className={"flex items-center gap-3"}>
                                        <RiRefund2Line className={"w-5 h-5"}/>
                                        <span>Reimbursed</span>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
            <section className="flex flex-1 flex-col p-1 gap-4 sm:p-4 md:gap-8 md:p-6">
                {
                    pathname === ordersLink ? <DashboardOrders/> :
                        pathname === usersLink ? <DashboardUsers/> :
                            pathname === productsLink ? <DashboardProducts/> :
                                pathname === productsAddLink && <DashboardProductsAdd/>
                }
            </section>
        </div>
    );
};

export default Dashboard;