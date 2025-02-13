// "use client";
//
// import {useContext, useEffect, useState} from 'react';
// import Link from "next/link";
// import {FaSearch} from "react-icons/fa";
// import CartIcon from "@/components/CartIcon";
// import {signOut} from "next-auth/react";
// import {AnimatePresence, motion, useAnimation} from "framer-motion";
// import {useRouter} from "next/navigation";
// import GlobalContext from "@/context/GlobalContext";
// import RevealMotion from "@/components/RevealMotion";
// import Image from "next/image";
// import logo from "@/icons/e.svg";
//
// const NavbarMobileOld = ({ user, topRatedLink, latestProductsLink,  myAccountLink, myOrdersLink, cartItems, itemsPrice, shippingAddress, paymentMethod, windowInnerWidth, dashboardLink }) => {
//
//     const [openNav, setOpenNav] = useState(false);
//     const [searchIsActive, setSearchIsActive] = useState(false);
//     const [keyword, setKeyword] = useState("");
//     const [shake, setShake] = useState(false);
//
//     const router = useRouter();
//
//     const totalNumberOfItems = cartItems.reduce((acc, item) => {
//         return acc + item.quantity
//     }, 0);
//
//     const { dispatch } = useContext(GlobalContext);
//
//     const logoutHandler = async () => {
//         await signOut({ callbackUrl: '/' });
//         dispatch({type: "RESET_STATE"});
//         setOpenNav(false);
//
//     };
//
//     const submitSearch = () => {
//         if (keyword.trim()) {
//             setKeyword("");
//             setSearchIsActive(false);
//             router.push(`/products/search/${keyword}/page/1`);
//         } else {
//             if (!shake) {
//                 setShake(true);
//                 setTimeout(function () {
//                     setShake(false);
//                 }, 500);
//             }
//         }
//     };
//
//     const mainControls = useAnimation();
//     useEffect(() => {
//         openNav ? mainControls.start("visibleNav") :  mainControls.start("hiddenNav");
//         searchIsActive ? mainControls.start("visibleSearch") : mainControls.start("hiddenSearch");
//     }, [mainControls, openNav, searchIsActive]);
//
//     return (
//         <>
//             <nav
//                 className={`fixed inset-0 z-30 block h-max w-full rounded-none py-0 bg-white/70 mobileBlur text-black dark:text-white dark:bg-black sm:border-b`}>
//                 <div className="px-2 flex justify-between items-center">
//                     <div className={"lg:hidden flex justify-between items-center w-full"}>
//                         <div className={"flex items-center w-full"}>
//                             <button className={"pl-1 pr-4 h-[3rem] flex items-center"} onClick={() => router.push("/")}>
//                                 <Image
//                                     width={32}
//                                     height={32}
//                                     priority
//                                     className={"w-4 md:w-5 h-auto mr-1 dark:invert"}
//                                     src={logo}
//                                     alt="eshopjs.com"
//                                 />
//                             </button>
//                             <div className={"hidden sm:flex justify-between w-full lg:hidden text-xs md:text-sm font-semibold"}>
//                                 <Link href={latestProductsLink} className={"antialiased hover:subpixel-antialiased"}>
//                                     Latest Products
//                                 </Link>
//                                 <Link href={"/locator"} className={"flex items-center"}>
//                                     <button className={"antialiased hover:subpixel-antialiased pr-1"}>
//                                         Order Lookup
//                                     </button>
//                                     <FaSearch className={"pl-[2px]"}/>
//                                 </Link>
//                                 {
//                                     user ? (
//                                         <>
//                                             <Link href={myAccountLink}
//                                                   className={"antialiased hover:subpixel-antialiased"}>
//                                                 My Account
//                                             </Link>
//                                             <Link href={myOrdersLink}
//                                                   className={"antialiased hover:subpixel-antialiased"}>
//                                                 My Orders
//                                             </Link>
//                                         </>
//                                     ) : (
//                                         <>
//                                             <Link href={"/login"} className={"antialiased hover:subpixel-antialiased"}>
//                                                 Login
//                                             </Link>
//                                             <Link href={"/register"}
//                                                   className={"antialiased hover:subpixel-antialiased"}>
//                                                 Sign Up
//                                             </Link>
//                                         </>
//                                     )
//                                 }
//                                 {
//                                     user?.isAdmin && (
//                                         <Link href={dashboardLink} className={"antialiased hover:subpixel-antialiased"}>
//                                             Dashboard
//                                         </Link>
//                                     )
//                                 }
//                                 {
//                                     user && (
//                                         <button onClick={logoutHandler}
//                                                 className={"antialiased hover:subpixel-antialiased"}>
//                                             Logout
//                                         </button>
//                                     )
//                                 }
//                             </div>
//                             {/*<div className={"w-full flex justify-center sm:hidden"}>*/}
//                             {/*    Dashboard*/}
//                             {/*</div>*/}
//                         </div>
//                         <div className={"flex items-center"}>
//                             <button
//                                 className={"h-[3rem] flex items-center pl-4 pr-2"}
//                                 onClick={() => {
//                                     setSearchIsActive(true);
//                                 }}
//                             >
//                                 <FaSearch className={"w-3.5 md:w-4"}/>
//                             </button>
//                             <CartIcon onClick={() => setOpenNav(false)}
//                                       isValidShippingAddress={Object.keys(shippingAddress).length !== 0}
//                                       isValidPaymentMethod={paymentMethod !== null} totalCartItems={totalNumberOfItems}
//                                       subtotalPrice={itemsPrice} windowInnerWidth={windowInnerWidth}
//                             />
//                             <button aria-label="menu"
//                                     className="sm:hidden middle pl-2 none relative mr-auto transition-all hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
//                                     onClick={() => setOpenNav(true)}>
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor"
//                                      viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
//                                           d="M4 6h16M4 12h8m-8 6h16"/>
//                                 </svg>
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </nav>
//
//             <div className={"lg:hidden"}>
//                 <AnimatePresence>
//                     <motion.div
//                         className={`z-30 bg-white/80 dark:bg-black/80 mobileBlur fixed top-0 w-full pt-3 h-screen`}
//                         variants={{
//                             hiddenSearch: {opacity: 0, y: "calc(-100% - 58px)"},
//                             visibleSearch: {opacity: 1, y: 0},
//                         }}
//                         initial={"hiddenSearch"}
//                         animate={mainControls}
//                         transition={{
//                             ease: "linear",
//                             duration: .25,
//                             delay: 0.00
//                         }}
//                     >
//                         <RevealMotion once={false} y={-50}>
//                             <div className={"px-2 flex justify-end"}>
//                                 <button className={"text-black dark:text-white"} onClick={() => setSearchIsActive(false)}>
//                                     <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-6 w-6"
//                                          viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                                         <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
//                                     </svg>
//                                 </button>
//                             </div>
//                         </RevealMotion>
//                         <div className={"flex flex-col justify-start h-full w-full"}>
//                             <ul className="flex flex-col font-bold text-xl">
//                                 <li className="pt-3 px-8">
//                                     <RevealMotion once={false} y={-50}>
//                                         <div style={shake === true ? {
//                                             animation: "shake 0.5s",
//                                             animationIterationCount: ".5"
//                                         } : {}} className={"flex items-center gap-4 w-full"}>
//                                             <FaSearch className={"cursor-pointer text-black dark:text-white"}
//                                                       fill={"currentColor"} onClick={submitSearch}/>
//                                             <input
//                                                 id={"searchProducts"}
//                                                 type={"search"}
//                                                 autoComplete={"search"}
//                                                 value={keyword}
//                                                 onKeyPress={(e) => {
//                                                     if (e.key === "Enter") {
//                                                         submitSearch();
//                                                     }
//                                                 }}
//                                                 onChange={(e) => setKeyword(e.target.value)}
//                                                 className={"w-full focus:outline-none bg-transparent text-3xl font-bold text-black dark:text-white"}
//                                                 placeholder={"Search products"}
//                                             />
//                                         </div>
//                                     </RevealMotion>
//                                 </li>
//                             </ul>
//                         </div>
//                     </motion.div>
//                 </AnimatePresence>
//             </div>
//
//             <nav>
//                 <AnimatePresence>
//                     <motion.div
//                         className={`sm:hidden z-30 bg-white/80 dark:bg-black/80 mobileBlur fixed top-0 w-full pt-3 h-screen`}
//                         variants={{
//                             hiddenNav: {opacity: 0, y: "calc(-100% - 58px)"},
//                             visibleNav: {opacity: 1, y: 0},
//                         }}
//                         initial={"hiddenNav"}
//                         animate={mainControls}
//                         transition={{
//                             ease: "linear",
//                             duration: .25,
//                             delay: 0.00
//                         }}
//                     >
//                         <div className={"px-2 flex justify-end"}>
//                             <button className={"text-black dark:text-white"} onClick={() => setOpenNav(false)}>
//                                 <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-6 w-6"
//                                      viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
//                                 </svg>
//                             </button>
//                         </div>
//                         <div className={"flex flex-col justify-start h-full w-full"}>
//                             <ul className="flex flex-col text-black dark:text-white font-bold text-xl">
//                                 <li className="pb-2 px-8">
//                                     <RevealMotion once={false} y={-50}>
//                                         <Link onClick={() => setOpenNav(!openNav)} href={"/"}
//                                               className={"w-fit cursor-pointer text-3xl font-bold flex items-center normal-case antialiased hover:subpixel-antialiased"}>
//                                             Home
//                                         </Link>
//                                     </RevealMotion>
//                                 </li>
//                                 <li className="py-2 px-8">
//                                     <RevealMotion once={false} y={-50} delay={0.15}>
//                                         <Link onClick={() => setOpenNav(!openNav)} href={latestProductsLink}
//                                               className={"w-fit cursor-pointer text-3xl font-bold flex items-center normal-case antialiased hover:subpixel-antialiased"}>
//                                             All Products
//                                         </Link>
//                                     </RevealMotion>
//                                 </li>
//                                 <li className="py-2 px-8">
//                                     <RevealMotion once={false} y={-50} delay={0.20}>
//                                         <Link onClick={() => setOpenNav(!openNav)} href={topRatedLink}
//                                               className={"w-fit cursor-pointer text-3xl font-bold flex items-center normal-case antialiased hover:subpixel-antialiased"}>
//                                             Top Rated Products
//                                         </Link>
//                                     </RevealMotion>
//                                 </li>
//                                 <li className="py-2 px-8">
//                                     <RevealMotion once={false} y={-50} delay={0.25}>
//                                         <div className={"flex items-center"}>
//                                             <Link onClick={() => setOpenNav(!openNav)} href={"/locator"}
//                                                   className={"w-fit cursor-pointer text-3xl font-bold flex items-center normal-case pr-3 antialiased hover:subpixel-antialiased"}>
//                                                 Order Lookup
//                                             </Link>
//                                             <FaSearch/>
//                                         </div>
//                                     </RevealMotion>
//                                 </li>
//                                 {
//                                     user && (
//                                         <>
//                                             <li className="py-2 px-8">
//                                                 <RevealMotion once={false} y={-50} delay={0.30}>
//                                                     <Link onClick={() => setOpenNav(!openNav)} href={myAccountLink}
//                                                           className="w-fit cursor-pointer text-3xl font-bold flex items-center normal-case antialiased hover:subpixel-antialiased">
//                                                         My Account
//                                                     </Link>
//                                                 </RevealMotion>
//                                             </li>
//                                             <li className="py-2 px-8">
//                                                 <RevealMotion once={false} y={-50} delay={0.35}>
//                                                     <Link onClick={() => setOpenNav(!openNav)} href={myOrdersLink}
//                                                           className={"w-fit cursor-pointer text-3xl font-bold flex items-center normal-case antialiased hover:subpixel-antialiased"}>
//                                                         My Orders
//                                                     </Link>
//                                                 </RevealMotion>
//                                             </li>
//                                         </>
//                                     )
//                                 }
//                                 {
//                                     user?.isAdmin && (
//                                         <RevealMotion once={false} y={-50} delay={0.35}>
//                                             <li className="py-2 px-8">
//                                                 <Link onClick={() => setOpenNav(!openNav)} href={dashboardLink} className={"w-fit cursor-pointer text-3xl font-bold text-secondary flex items-center normal-case antialiased hover:subpixel-antialiased"}>
//                                                     Dashboard
//                                                 </Link>
//                                             </li>
//                                         </RevealMotion>
//                                     )
//                                 }
//                                 {
//                                     user ? (
//                                         <li onClick={() => setOpenNav(!openNav)} className="py-2 px-8">
//                                             <RevealMotion once={false} y={-50} delay={0.40}>
//                                                 <button
//                                                     className={"w-fit cursor-pointer text-3xl font-bold text-red-500 flex items-center normal-case antialiased hover:subpixel-antialiased"}
//                                                     onClick={logoutHandler}>
//                                                     Logout
//                                                 </button>
//                                             </RevealMotion>
//                                         </li>
//                                     ) : (
//                                         <>
//                                             <li className="py-2 px-8">
//                                                 <RevealMotion once={false} y={-50} delay={0.30}>
//                                                     <Link onClick={() => setOpenNav(!openNav)} href={"/login"}
//                                                           className="w-fit cursor-pointer text-3xl font-bold text-info flex items-center normal-case antialiased hover:subpixel-antialiased">
//                                                         Login
//                                                     </Link>
//                                                 </RevealMotion>
//                                             </li>
//                                             <li className="py-2 px-8">
//                                                 <RevealMotion once={false} y={-50} delay={0.30}>
//                                                     <Link onClick={() => setOpenNav(!openNav)} href={"/register"}
//                                                           className="cursor-pointer text-3xl font-bold text-primary flex items-center normal-case antialiased hover:subpixel-antialiased">
//                                                         Sign up
//                                                     </Link>
//                                                 </RevealMotion>
//                                             </li>
//                                         </>
//                                     )
//                                 }
//                             </ul>
//                         </div>
//                     </motion.div>
//                 </AnimatePresence>
//             </nav>
//         </>
//     );
// };
//
// export default NavbarMobileOld;