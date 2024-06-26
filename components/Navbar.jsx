"use client";

import {useContext, useEffect, useState} from "react";
import {FaChevronDown, FaSearch, FaUser} from "react-icons/fa";
import {signOut, useSession} from "next-auth/react";
import Link from "next/link";
import {motion} from "framer-motion";
import logo from "../icons/e.svg";
import {useRouter} from "next/navigation";
import CartIcon from "@/components/CartIcon";
import GlobalContext from "@/context/GlobalContext";
import NavbarMobile from "@/components/NavbarMobile";
import Image from 'next/image';
import NavbarSearchBox from "@/components/NavbarSearchBox";
import {fetchUser} from "@/utils/api-requests/fetchRequests";


const Navbar = () => {

    const { data: session, status } = useSession();
    const router = useRouter();
    const { user, cartItems, itemsPrice, shippingAddress, paymentMethod, dispatch } = useContext(GlobalContext);

    const totalCartItems = cartItems.reduce((acc, item) => {
        return acc + item.quantity
    }, 0);

    const [searchIsActive, setSearchIsActive] = useState(false);
    const [openNav, setOpenNav] = useState(false);
    const [productsDropdownActive, setProductsDropdownActive] = useState(false);
    const [userDropdownActive, setUserDropdownActive] = useState(false);
    const [windowInnerWidth, setWindowInnerWidth] = useState(typeof window !== "undefined" && window.innerWidth);

    useEffect(function () {
        const setInnerWindowWidth = () => {
            setWindowInnerWidth(window.innerWidth);
            if (window.innerWidth >= 768 && openNav) {
                setOpenNav(false);
            }
            if (window.innerWidth >= 768 && searchIsActive) {
                setSearchIsActive(false);
            }
        };
        window.addEventListener("resize", setInnerWindowWidth);
        return () => {
            window.removeEventListener("resize", setInnerWindowWidth)
        }
    }, [openNav, searchIsActive]);


    useEffect(() => {
        const fetchUserData = async (email) => {
            return await fetchUser(email);
        };
        if (status !== "loading") {
            if (user) {
                if (status === "unauthenticated") {
                    dispatch({type: "RESET_STATE"})
                }
            } else {
                if (status === "authenticated") {
                    fetchUserData(session.user.email).then((user) => {
                        dispatch({type: "ADD_USER", payload: user});
                        dispatch({type: "SET_LOCAL_STORAGE"});
                    });
                }
            }
        }
    }, [user, status, dispatch]);



    const rotateChevron = (action) => {
        return action ? "open" : "closed";
    };

    const logoutHandler = async () => {
        await signOut({ callbackUrl: '/' });
        dispatch({type: "RESET_STATE"})
        setUserDropdownActive(false);
    };

    const dashboardLink = "/admin/dashboard/orders"
    const myOrdersLink = "/account/orders";
    const myAccountLink = "/account";
    const topRatedLink = "/products/sort/toprated/select/all/page/1";
    const latestProductsLink = "/products/sort/latest/select/all/page/1";


    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    return mounted && (
        <>
            <nav
                className={`fixed inset-0 z-30 block h-max w-full rounded-none py-0 bg-white/70 mobileBlur dark:bg-black text-black border-b dark:text-white`}
            >
                <div className="px-2 flex justify-between items-center">
                    <div className={"hidden lg:flex md:items-center cursor-pointer rounded-xl py-2 px-3"}>
                        <motion.div
                            onClick={() => router.push("/")}
                            className={"text-xl flex items-center"}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 1.0 }}
                        >
                            <Image
                                priority
                                className={"w-6 h-6 mr-1"}
                                src={logo}
                                alt="e-shop-us.com"
                            />
                        </motion.div>
                    </div>
                    <div className={"hidden lg:flex justify-end"}>
                        <div className={"flex justify-end"}>
                            <div className="ml-auto flex items-center gap-1 lg:gap-2">
                                <NavbarSearchBox/>
                                <div className="flex-none">
                                    <CartIcon isValidShippingAddress={Object.keys(shippingAddress).length !== 0} isValidPaymentMethod={paymentMethod !== null} totalCartItems={totalCartItems} subtotalPrice={itemsPrice} windowInnerWidth={windowInnerWidth}/>
                                </div>
                                <div
                                    className="relative inline-block text-left py-2.5"
                                    onMouseEnter={() => setProductsDropdownActive(true)}
                                    onMouseLeave={() => setProductsDropdownActive(false)}>
                                    <div className={"cursor-pointer px-2 h-[3rem] flex items-center"}>
                                        <span className={"font-normal text-sm pr-1.5"}>Shop</span>
                                        <div className={`${rotateChevron(productsDropdownActive)}`}>
                                            <FaChevronDown className={"w-2.5"}/>
                                        </div>
                                    </div>
                                    {
                                        productsDropdownActive && (
                                            <div className="absolute right-0 z-10 mt-2.5 origin-top-right">
                                                <div className="menu p-0 bg-neutral/70 rounded-b-md text-white font-bold flex flex-col justify-between w-full">
                                                    <div className={"flex-col w-full"}>
                                                        <Link href={latestProductsLink} className={"block px-10 py-5 hover:bg-white/70 text-white hover:text-black"}>
                                                            <span className={"w-full text-xl whitespace-nowrap"}>Latest Products</span>
                                                        </Link>
                                                        <Link href={topRatedLink} className={"block px-10 py-5 hover:bg-white/70 text-white hover:text-black"}>
                                                            <span className={"w-full text-xl whitespace-nowrap"}>Top Rated</span>
                                                        </Link>
                                                        {/*<Link href={latestProductsLink} className={"block px-10 py-5 rounded-b-md hover:bg-neutral/70"}>*/}
                                                        {/*    <span className={"w-full text-xl text-white whitespace-nowrap"}>All Categories</span>*/}
                                                        {/*</Link>*/}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                                {
                                    user ? (
                                        <div
                                            className="relative inline-block text-left py-2.5"
                                            onMouseEnter={() => setUserDropdownActive(true)}
                                            onMouseLeave={() => setUserDropdownActive(false)}
                                        >
                                            <div className={"cursor-pointer pl-2 pr-4 h-[3rem] flex items-center"}>
                                                <span className={"font-normal text-sm pr-1.5"}>{user?.name.substring(0, 32)}</span>
                                                <div className={`${rotateChevron(userDropdownActive)}`}>
                                                    <FaChevronDown className={"w-2.5"}/>
                                                </div>
                                            </div>
                                            {
                                                userDropdownActive && (
                                                    <div className="absolute right-0 z-10 mt-2.5 origin-top-right">
                                                        <div className="menu p-0 bg-neutral/70 rounded-b-md text-white font-bold flex flex-col justify-between w-full">
                                                            <div className={"flex-col w-full"}>
                                                                <Link href={myAccountLink} className={"block px-10 py-5 hover:bg-white/70 text-white hover:text-black"}>
                                                                    <span className={"w-full text-xl whitespace-nowrap"}>Account</span>
                                                                </Link>
                                                                <Link href={myOrdersLink} className={"block px-10 py-5 hover:bg-white/70 text-white hover:text-black"}>
                                                                    <span className={"w-full text-xl whitespace-nowrap"}>My Orders</span>
                                                                </Link>
                                                                <Link href={"/locator"} className={"flex items-center px-10 py-5 hover:bg-white/70 text-white hover:text-black"}>
                                                                    <span className={"w-full text-xl whitespace-nowrap pr-2"}>Order Lookup</span>
                                                                    <FaSearch/>
                                                                </Link>
                                                                <button onClick={logoutHandler} className={"w-full text-start block px-10 py-5 rounded-b-md hover:bg-white/70 text-white hover:text-black"}>
                                                                    <span className={"w-full text-xl whitespace-nowrap"} >Logout</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    ) : (
                                        <div
                                            className="relative inline-block text-left py-2.5"
                                            onMouseEnter={() => setUserDropdownActive(true)}
                                            onMouseLeave={() => setUserDropdownActive(false)}
                                        >
                                            <div className={"cursor-pointer px-2 h-[3rem] flex items-center"}>
                                                <Link href={"/login"}>
                                                    <div
                                                        className="flex items-center"
                                                    >
                                                        <FaUser/>
                                                        <span className={"px-1.5 font-normal text-sm"}>Login</span>
                                                    </div>
                                                </Link>
                                                <div className={`${rotateChevron(userDropdownActive)}`}>
                                                    <FaChevronDown className={"w-2.5"}/>
                                                </div>
                                            </div>
                                            {
                                                userDropdownActive && (
                                                    <div className="absolute right-0 z-10 mt-2.5 origin-top-right">
                                                        <div className="menu p-0 bg-neutral/70 rounded-b-md text-white font-bold flex flex-col justify-between w-full">
                                                            <div className={"flex-col w-full"}>
                                                                <Link href={"/login"} className={"block px-10 py-5 hover:bg-white/70 text-white hover:text-black"}>
                                                                    <span className={"w-full text-xl whitespace-nowrap"}>Login</span>
                                                                </Link>
                                                                <Link href={"/register"} className={"block px-10 py-5 hover:bg-white/70 text-white hover:text-black"}>
                                                                    <span className={"w-full text-xl whitespace-nowrap"}>Create Account</span>
                                                                </Link>
                                                                <Link href={"/locator"} className={"flex items-center px-10 py-5 rounded-b-md hover:bg-white/70 text-white hover:text-black"}>
                                                                    <span className={"w-full text-xl whitespace-nowrap pr-2"}>Order Lookup</span>
                                                                    <FaSearch/>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    )
                                }
                                {
                                    user?.isAdmin && (
                                        <div className="relative inline-block text-left">
                                            <div
                                                onClick={() => router.push(dashboardLink)}
                                                className={"cursor-pointer btn rounded-full btn-secondary normal-case flex items-center"}
                                            >
                                                <div className={"flex flex-col"}>
                                                    <span>Dashboard</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <NavbarMobile user={user} latestProductsLink={latestProductsLink} myAccountLink={myAccountLink} myOrdersLink={myOrdersLink} topRatedLink={topRatedLink} windowInnerWidth={windowInnerWidth} cartItems={cartItems} itemsPrice={itemsPrice} paymentMethod={paymentMethod} shippingAddress={shippingAddress} dashboardLink={dashboardLink}/>
        </>
    )
};

export default Navbar;