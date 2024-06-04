import React, {useContext, useEffect, useState} from 'react';
import Link from "next/link";
import {FaSearch} from "react-icons/fa";
import CartIcon from "@/components/CartIcon";
import {signOut, useSession} from "next-auth/react";
import {AnimatePresence, motion, useAnimation} from "framer-motion";
import {useRouter} from "next/navigation";
import GlobalContext from "@/context/GlobalContext";

const NavbarMobile = ({ topRatedLink, latestProductsLink,  myAccountLink, myOrdersLink, cartItems, itemsPrice, shippingAddress, paymentMethod, windowInnerWidth }) => {

    const [openNav, setOpenNav] = useState(false);
    const [searchIsActive, setSearchIsActive] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [shake, setShake] = useState(false);

    const { data: session } = useSession();
    const router = useRouter();

    const totalNumberOfItems = cartItems.reduce((acc, item) => {
        return acc + item.quantity
    }, 0);

    const { dispatch } = useContext(GlobalContext);

    const logoutHandler = async () => {
        dispatch({type: "RESET_STATE"});
        setOpenNav(false);
        await signOut();
    };

    const submitSearch = () => {
        if (keyword.trim()) {
            setKeyword("");
            setSearchIsActive(false);
            router.push(`/search/${keyword}`);
        } else {
            if (!shake) {
                setShake(true);
                setTimeout(function () {
                    setShake(false);
                }, 500);
            }
        }
    };

    const mainControls = useAnimation();
    useEffect(() => {
        openNav ? mainControls.start("visibleNav") :  mainControls.start("hiddenNav");
        searchIsActive ? mainControls.start("visibleSearch") : mainControls.start("hiddenSearch");
    }, [mainControls, openNav, searchIsActive]);

    return (
        <>
            <nav
                className={`fixed inset-0 z-30 block h-max w-full rounded-none py-0 bg-white/70 backdrop-blur-lg text-black  dark:text-white dark:bg-black`}>
                <div className="px-2 flex justify-between items-center">
                    <div className={"lg:hidden flex justify-between items-center w-full"}>
                        <div className={"flex items-center w-full"}>
                            <button className={"pl-1 pr-4 h-[3rem] flex items-center"} onClick={() => router.push("/")}>
                                {/*<Logo className={"w-4 md:w-5 text-black dark:text-white"} fill={"currentColor"}/>*/}
                            </button>

                            <div className={"hidden sm:flex justify-between w-full lg:hidden text-xs md:text-sm"}>
                                <Link href={topRatedLink} className={"antialiased hover:subpixel-antialiased"}>
                                    Top Rated
                                </Link>
                                <Link href={latestProductsLink} className={"antialiased hover:subpixel-antialiased"}>
                                    All Products
                                </Link>
                                <Link href={"/locator"} className={"flex items-center"}>
                                    <button className={"antialiased hover:subpixel-antialiased pr-1"}>
                                        Order Lookup
                                    </button>
                                    <FaSearch className={"pl-[2px]"}/>
                                </Link>
                                {
                                    session ? (
                                        <>
                                            <Link href={myAccountLink}
                                                  className={"antialiased hover:subpixel-antialiased"}>
                                                My Account
                                            </Link>
                                            <Link href={myOrdersLink}
                                                  className={"antialiased hover:subpixel-antialiased"}>
                                                My Orders
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link href={"/login"} className={"antialiased hover:subpixel-antialiased"}>
                                                Login
                                            </Link>
                                            <Link href={"/register"}
                                                  className={"antialiased hover:subpixel-antialiased"}>
                                                Sign Up
                                            </Link>
                                        </>
                                    )
                                }
                                {/*{*/}
                                {/*    session?.user.name.userIsAdmin && (*/}
                                {/*        <Link href={adminOrdersLink} className={"antialiased hover:subpixel-antialiased"}>*/}
                                {/*            Dashboard*/}
                                {/*        </Link>*/}
                                {/*    )*/}
                                {/*}*/}
                                {
                                    session && (
                                        <button onClick={logoutHandler}
                                                className={"antialiased hover:subpixel-antialiased"}>
                                            Logout
                                        </button>
                                    )
                                }
                            </div>
                        </div>
                        <div className={"flex items-center"}>
                            <button
                                className={"h-[3rem] flex items-center pl-4 pr-2"}
                                onClick={() => {
                                    setSearchIsActive(true);
                                }}
                            >
                                <FaSearch className={"w-3.5 md:w-4"}/>
                            </button>
                            <CartIcon onClick={() => setOpenNav(false)}
                                      isValidShippingAddress={Object.keys(shippingAddress).length !== 0}
                                      isValidPaymentMethod={paymentMethod !== null} totalCartItems={totalNumberOfItems}
                                      subtotalPrice={itemsPrice} windowInnerWidth={windowInnerWidth}
                            />
                            <button aria-label="menu"
                                    className="sm:hidden middle pl-2 none relative mr-auto transition-all hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                    onClick={() => setOpenNav(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M4 6h16M4 12h8m-8 6h16"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className={"lg:hidden"}>
                <AnimatePresence>
                    <motion.div
                        className={`z-30 bg-white/80 dark:bg-black/80 backdrop-blur-lg fixed top-0 w-full pt-3 h-screen`}
                        variants={{
                            hiddenSearch: {opacity: 0, y: "calc(-100% - 58px)"},
                            visibleSearch: {opacity: 1, y: 0},
                        }}
                        initial={"hiddenSearch"}
                        animate={mainControls}
                        transition={{
                            ease: "linear",
                            duration: .25,
                            delay: 0.00
                        }}
                    >
                        <div className={"px-2 flex justify-end"}>
                            <button className={"text-black dark:text-white"} onClick={() => setSearchIsActive(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-6 w-6"
                                     viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                        <div className={"flex flex-col justify-start h-full w-full"}>
                            <ul className="flex flex-col font-bold text-xl">
                                <li className="pt-8 px-8">
                                    <div style={shake === true ? {
                                        animation: "shake 0.5s",
                                        animationIterationCount: ".5"
                                    } : {}} className={"flex items-center gap-4 w-full"}>
                                        <FaSearch className={"cursor-pointer text-black dark:text-white"}
                                                  fill={"currentColor"} onClick={submitSearch}/>
                                        <input
                                            id={"searchProducts"}
                                            type={"search"}
                                            autoComplete={"search"}
                                            value={keyword}
                                            onKeyPress={(e) => {
                                                if (e.key === "Enter") {
                                                    submitSearch();
                                                }
                                            }}
                                            onChange={(e) => setKeyword(e.target.value)}
                                            className={"w-full focus:outline-none bg-transparent text-3xl font-bold text-black dark:text-white"}
                                            placeholder={"Search products"}
                                        />
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <nav>
                <AnimatePresence>
                    <motion.div
                        className={`sm:hidden z-30 bg-white/80 dark:bg-black/80 backdrop-blur-lg fixed top-0 w-full pt-3 h-screen`}
                        variants={{
                            hiddenNav: {opacity: 0, y: "calc(-100% - 58px)"},
                            visibleNav: {opacity: 1, y: 0},
                        }}
                        initial={"hiddenNav"}
                        animate={mainControls}
                        transition={{
                            ease: "linear",
                            duration: .25,
                            delay: 0.00
                        }}
                    >
                        <div className={"px-2 flex justify-end"}>
                            <button className={"text-black dark:text-white"} onClick={() => setOpenNav(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-6 w-6"
                                     viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                        <div className={"flex flex-col justify-start h-full w-full"}>
                            <ul className="flex flex-col text-black dark:text-white font-bold text-xl">
                                <li className="pb-2 px-8">
                                    <Link onClick={() => setOpenNav(!openNav)} href={"/"}
                                          className={"w-fit cursor-pointer text-3xl font-bold flex items-center normal-case antialiased hover:subpixel-antialiased"}>
                                        Home
                                    </Link>
                                </li>
                                <li className="py-2 px-8">
                                    <Link onClick={() => setOpenNav(!openNav)} href={latestProductsLink}
                                          className={"w-fit cursor-pointer text-3xl font-bold flex items-center normal-case antialiased hover:subpixel-antialiased"}>
                                        All Products
                                    </Link>
                                </li>
                                <li className="py-2 px-8">
                                    <Link onClick={() => setOpenNav(!openNav)} href={topRatedLink}
                                          className={"w-fit cursor-pointer text-3xl font-bold flex items-center normal-case antialiased hover:subpixel-antialiased"}>
                                        Top Rated Products
                                    </Link>
                                </li>
                                <li className="py-2 px-8">
                                    <div className={"flex items-center"}>
                                        <Link onClick={() => setOpenNav(!openNav)} href={"/locator"}
                                              className={"w-fit cursor-pointer text-3xl font-bold flex items-center normal-case pr-3 antialiased hover:subpixel-antialiased"}>
                                            Order Lookup
                                        </Link>
                                        <FaSearch/>
                                    </div>
                                </li>
                                {
                                    session && (
                                        <>
                                            <li className="py-2 px-8">
                                                <Link onClick={() => setOpenNav(!openNav)} href={myAccountLink}
                                                      className="w-fit cursor-pointer text-3xl font-bold flex items-center normal-case antialiased hover:subpixel-antialiased">
                                                    My Account
                                                </Link>
                                            </li>
                                            <li className="py-2 px-8">
                                                <Link onClick={() => setOpenNav(!openNav)} href={myOrdersLink}
                                                      className={"w-fit cursor-pointer text-3xl font-bold flex items-center normal-case antialiased hover:subpixel-antialiased"}>
                                                    My Orders
                                                </Link>
                                            </li>
                                        </>
                                    )
                                }
                                {/*{*/}
                                {/*    session?.user.name.userIsAdmin && (*/}
                                {/*        <>*/}
                                {/*            <li className="py-2 px-8">*/}
                                {/*                <Link onClick={() => setOpenNav(!openNav)} href={adminOrdersLink} className={"w-fit cursor-pointer text-3xl font-bold text-secondary flex items-center normal-case antialiased hover:subpixel-antialiased"}>*/}
                                {/*                    Dashboard*/}
                                {/*                </Link>*/}
                                {/*            </li>*/}
                                {/*        </>*/}
                                {/*    )*/}
                                {/*}*/}
                                {
                                    session ? (
                                        <li onClick={() => setOpenNav(!openNav)} className="py-2 px-8">
                                            <button
                                                className={"w-fit cursor-pointer text-3xl font-bold text-red-500 flex items-center normal-case antialiased hover:subpixel-antialiased"}
                                                onClick={logoutHandler}>
                                                Logout
                                            </button>
                                        </li>
                                    ) : (
                                        <>
                                            <li className="py-2 px-8">
                                                <Link onClick={() => setOpenNav(!openNav)} href={"/login"}
                                                      className="w-fit cursor-pointer text-3xl font-bold text-info flex items-center normal-case antialiased hover:subpixel-antialiased">
                                                    Login
                                                </Link>
                                            </li>
                                            <li className="py-2 px-8">
                                                <Link onClick={() => setOpenNav(!openNav)} href={"/register"}
                                                      className="cursor-pointer text-3xl font-bold text-primary flex items-center normal-case antialiased hover:subpixel-antialiased">
                                                    Sign up
                                                </Link>
                                            </li>
                                        </>
                                    )
                                }
                            </ul>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </nav>
        </>
    );
};

export default NavbarMobile;