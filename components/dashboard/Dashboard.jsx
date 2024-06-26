import {FaBox, FaDollarSign, FaPlus, FaTags, FaUsers} from "react-icons/fa";
import Link from "next/link";
import {usePathname} from "next/navigation";
import DashboardOrders from "@/components/dashboard/DashboardOrders";
import DashboardUsers from "@/components/dashboard/DashboardUsers";
import DashboardProducts from "@/components/dashboard/DashboardProducts";
import DashboardProductsAdd from "@/components/dashboard/DashboardProductsAdd";
import {useEffect, useState} from "react";
import {FaTruck} from "react-icons/fa";
import {
    FaBuildingColumns,
    FaHandHoldingDollar,
    FaHouseCircleCheck,
    FaSackXmark
} from "react-icons/fa6";

const Dashboard = () => {
    const pathname = usePathname();

    const ordersLink = "/admin/dashboard/orders";
    const productsLink = "/admin/dashboard/products";
    const usersLink = "/admin/dashboard/users";
    const productsAddLink = "/admin/dashboard/products/add";

    const [mounted, setMounted] = useState(false);
    const [width, setWidth] = useState(typeof window !== "undefined" && window.innerWidth);

    useEffect(() => {
        setMounted(true);
        const setInnerWindowWidth = () => {
            setWidth(window.innerWidth);
        };
        window.addEventListener("resize", setInnerWindowWidth);
        return () => {
            window.removeEventListener("resize", setInnerWindowWidth)
        }
    }, []);

    const LINKS = [
        { label: "Orders", href: ordersLink, icon: <FaBox className="h-4 w-4" /> },
        { label: "Users", href: usersLink, icon: <FaUsers className="h-4 w-4" /> },
        { label: "Products", href: productsLink, icon: <FaTags className="h-4 w-4" /> },
        { label: "Add Product", href: productsAddLink, icon: <FaPlus className="h-4 w-4" /> }
    ]

    if (mounted) return (
        <div className="grid w-full lg:min-h-[calc(100vh-224px)] lg:grid-cols-[240px_1fr]">
            <div className="border-r bg-gray-100/40 dark:bg-gray-800/40">
                <div className="h-full flex flex-col justify-between py-2">
                    {/*<div className="flex-1 overflow-auto py-2">*/}
                    <nav className="flex justify-around lg:flex-col px-4 text-sm font-medium">
                        {LINKS.map(({href, label, icon}) => (
                            <Link
                                key={label}
                                className=
                                    {
                                    `flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-50 ${pathname === href && "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-50"}`
                                    }
                                href={href}
                            >
                                {icon}
                                {width > 768 && label}
                            </Link>
                        ))}
                    </nav>
                    {
                        pathname === ordersLink && (
                            <div className={"hidden lg:flex flex-col px-5"}>
                                <h3 className={"text-gray-500 font-semibold border-b-2 py-2 my-2"}>
                                    Key
                                </h3>
                                <div className={"flex flex-col gap-3.5 text-sm font-semibold text-gray-800 py-3"}>
                                    <div className={"flex items-center"}>
                                        <FaDollarSign className={"w-5 h-5"}/><span
                                        className={"pl-2"}>Payment verified</span>
                                    </div>
                                    <div className={"flex items-center"}>
                                        <FaSackXmark className={"w-5 h-5"}/><span className={"pl-2"}>Pending payment</span>
                                    </div>
                                    <div className={"flex items-center"}>
                                        <FaTruck className={"w-5 h-5"}/><span className={"pl-2"}>Order shipped</span>
                                    </div>
                                    <div className={"flex items-center"}>
                                        <FaHouseCircleCheck className={"w-5 h-5"}/><span
                                        className={"pl-2"}>Order delivered</span>
                                    </div>
                                    <div className={"flex items-center"}>
                                        <FaHandHoldingDollar className={"w-5 h-5"}/><span className={"pl-2"}>Pending reimbursement</span>
                                    </div>
                                    <div className={"flex items-center"}>
                                        <FaBuildingColumns className={"w-5 h-5"}/><span className={"pl-2"}>Reimbursed</span>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                </div>
            </div>
            <div className="flex flex-col">
                {/*<Header/>*/}
                <section className="flex flex-1 flex-col p-1 sm:p-4 md:gap-8 md:p-6">
                    {
                        pathname === ordersLink ? <DashboardOrders/> :
                            pathname === usersLink ? <DashboardUsers/> :
                                pathname === productsLink ? <DashboardProducts width={width}/> :
                                    pathname === productsAddLink && <DashboardProductsAdd/>
                    }
                </section>
            </div>
        </div>
    );
};

export default Dashboard;