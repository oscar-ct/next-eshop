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

    const [productsDropdownActive, setProductsDropdownActive] = useState(false);
    const [userDropdownActive, setUserDropdownActive] = useState(false);


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
            <div className={"z-40 fixed right-0 top-0 flex md:hidden"}>
                <NavbarMobile
                    user={user}
                    links={{latestProductsLink, myAccountLink, myOrdersLink, topRatedLink, dashboardLink}}
                />
            </div>
            <nav className={"fixed h-12 inset-0 border-b bg-zinc-50 z-30 w-full md:h-16"}>
                <div className="h-full w-full flex justify-between items-center relative">
                    <div className={"flex cursor-pointer px-3"}>
                        <motion.div
                            onClick={() => router.push("/")}
                            className={"text-xl flex items-center"}
                            whileHover={{scale: 1.1}}
                            whileTap={{scale: 1.0}}
                        >
                            <Image
                                priority
                                className={"w-6 h-6"}
                                src={logo}
                                alt="e-shop-us.com"
                            />
                        </motion.div>
                    </div>


                    <div className={"absolute right-12 md:hidden"}>
                        <CartIcon
                            isValidShippingAddress={Object.keys(shippingAddress).length !== 0}
                            isValidPaymentMethod={paymentMethod !== null}
                            totalCartItems={totalCartItems}
                            subtotalPrice={itemsPrice}
                        />
                    </div>


                    <div className={"hidden md:flex justify-end"}>
                        <div className={"pr-3"}>
                            <div className="flex items-center gap-6">
                                <NavbarSearchBox/>
                                <CartIcon
                                    isValidShippingAddress={Object.keys(shippingAddress).length !== 0}
                                    isValidPaymentMethod={paymentMethod !== null}
                                    totalCartItems={totalCartItems}
                                    subtotalPrice={itemsPrice}
                                />
                                <div className={"relative h-16"}
                                     onMouseEnter={() => setProductsDropdownActive(true)}
                                     onMouseLeave={() => setProductsDropdownActive(false)}>
                                    <div className={"cursor-pointer h-16 flex items-center"}>
                                        <span className={"font-semibold pr-1.5"}>Shop</span>
                                        <div className={`${rotateChevron(productsDropdownActive)}`}>
                                            <FaChevronDown className={"w-2.5"}/>
                                        </div>
                                    </div>
                                    {
                                        productsDropdownActive && (
                                            <div className="absolute right-0 z-10 origin-top-right">
                                                <div
                                                    className="bg-slate-800/70 rounded-b-md text-white font-bold flex flex-col justify-between w-full">
                                                    <div className={"flex-col w-full"}>
                                                        <Link href={latestProductsLink}
                                                              className={"block px-10 py-5 hover:bg-white/70 text-white hover:text-black"}>
                                                            <span className={"w-full text-xl whitespace-nowrap"}>Latest Products</span>
                                                        </Link>
                                                        <Link href={topRatedLink}
                                                              className={"block px-10 py-5 hover:bg-white/70 text-white hover:text-black"}>
                                                            <span
                                                                className={"w-full text-xl whitespace-nowrap"}>Top Rated</span>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                                {
                                    user ? (
                                        <div
                                            className="relative h-16"
                                            onMouseEnter={() => setUserDropdownActive(true)}
                                            onMouseLeave={() => setUserDropdownActive(false)}
                                        >
                                            <div className={"cursor-pointer h-16 flex items-center"}>
                                                <span
                                                    className={"font-semibold pr-1.5"}>{user?.name.substring(0, 12)}</span>
                                                <div className={`${rotateChevron(userDropdownActive)}`}>
                                                    <FaChevronDown className={"w-2.5"}/>
                                                </div>
                                            </div>
                                            {
                                                userDropdownActive && (
                                                    <div className="absolute right-0 z-10 origin-top-right">
                                                        <div
                                                            className="bg-slate-800/70 rounded-b-md text-white font-bold flex flex-col justify-between w-full">
                                                            <div className={"flex-col w-full"}>
                                                                <Link
                                                                    href={myAccountLink}
                                                                    className={"block px-10 py-5 text-white text-xl whitespace-nowrap hover:bg-white/70 hover:text-black"}
                                                                >
                                                                    Account
                                                                </Link>
                                                                <Link
                                                                    href={myOrdersLink}
                                                                    className={"block px-10 py-5 text-white text-xl whitespace-nowrap hover:bg-white/70 hover:text-black"}
                                                                >
                                                                    My Orders
                                                                </Link>
                                                                <Link
                                                                    href={"/locator"}
                                                                    className={"flex items-center px-10 py-5 hover:bg-white/70 text-white hover:text-black text-xl whitespace-nowrap"}
                                                                >
                                                                    <span className={"pr-2"}>Order Lookup</span>
                                                                    <FaSearch size={14}/>
                                                                </Link>
                                                                <button
                                                                    onClick={logoutHandler}
                                                                    className={"text-start w-full px-10 py-5 text-white text-xl whitespace-nowrap rounded-b-md hover:bg-white/70 hover:text-black"}
                                                                >
                                                                    Logout
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    ) : (
                                        <div
                                            className="relative h-16"
                                            onMouseEnter={() => setUserDropdownActive(true)}
                                            onMouseLeave={() => setUserDropdownActive(false)}
                                        >
                                            <div className={"cursor-pointer h-16 flex items-center"}>
                                                <Link href={"/login"}>
                                                    <div
                                                        className="flex items-center"
                                                    >
                                                        <FaUser/>
                                                        <span className={"px-1.5 font-semibold"}>Login</span>
                                                    </div>
                                                </Link>
                                                <div className={`${rotateChevron(userDropdownActive)}`}>
                                                    <FaChevronDown className={"w-2.5"}/>
                                                </div>
                                            </div>
                                            {
                                                userDropdownActive && (
                                                    <div className="absolute right-0 z-10 origin-top-right">
                                                        <div
                                                            className="bg-slate-800/70 rounded-b-md text-white font-bold flex flex-col justify-between w-full">
                                                            <div className={"flex-col w-full"}>
                                                                <Link
                                                                    href={"/login"}
                                                                    className={"block px-10 py-5 text-white text-xl whitespace-nowrap hover:bg-white/70 hover:text-black"}
                                                                >
                                                                    Login
                                                                </Link>
                                                                <Link
                                                                    href={"/register"}
                                                                    className={"block px-10 py-5 text-white text-xl whitespace-nowrap hover:bg-white/70 hover:text-black"}
                                                                >
                                                                    Create Account
                                                                </Link>
                                                                <Link
                                                                    href={"/locator"}
                                                                    className={"flex items-center px-10 py-5 text-white text-xl whitespace-nowrap rounded-b-md hover:bg-white/70 hover:text-black"}
                                                                >
                                                                    <span className={"pr-2"}>Order Lookup</span>
                                                                    <FaSearch size={14}/>
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

                                        <Link
                                            href={dashboardLink}
                                            className={"cursor-pointer btn rounded-full btn-secondary normal-case flex items-center"}
                                        >
                                            Dashboard
                                        </Link>

                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

        </>
    )
};

export default Navbar;