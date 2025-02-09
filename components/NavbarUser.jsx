"use client";

import {useContext, useState} from 'react';
import {FaChevronDown, FaSearch, FaUser} from "react-icons/fa";
import Link from "next/link";
import GlobalContext from "@/context/GlobalContext";
import {signOut} from "next-auth/react";

const NavbarUser = ({ session, myAccountLink, myOrdersLink, dashboardLink }) => {

    const { dispatch } = useContext(GlobalContext);
    const [userDropdownActive, setUserDropdownActive] = useState(false);

    // todo
    // const { data: session, status } = useSession();
    // useEffect(() => {
    //     const fetchUserData = async (email) => {
    //         return await fetchUser(email);
    //     };
    //     if (status !== "loading") {
    //         if (user) {
    //             if (status === "unauthenticated") {
    //                 dispatch({type: "RESET_STATE"})
    //             }
    //         } else {
    //             if (status === "authenticated") {
    //                 fetchUserData(session.user.email).then((user) => {
    //                     dispatch({type: "ADD_USER", payload: user});
    //                     dispatch({type: "SET_LOCAL_STORAGE"});
    //                 });
    //             }
    //         }
    //     }
    // }, [user, status, dispatch]);
    // useEffect(() => {
    //     if (session && !user) {
    //         console.log(session)
    //         console.log(user)
    //         console.log("SETTING UP USER!!")
    //     }
    // }, [session, user])

    const logoutHandler = async () => {
        await signOut({ callbackUrl: '/' });
        dispatch({type: "RESET_STATE"});
        setUserDropdownActive(false);
    };

    const rotateChevron = (action) => {
        return action ? "open" : "closed";
    };

    return (
        <>
            {
                session ? (
                    <div
                        className="relative h-16"
                        onMouseEnter={() => setUserDropdownActive(true)}
                        onMouseLeave={() => setUserDropdownActive(false)}
                    >
                        <div className={"cursor-pointer h-16 flex items-center"}>
                            <h5 className={"font-semibold pr-1.5 dark:text-white"}>{session?.user.name.username.substring(0, 12)}</h5>
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
                                    <h5 className={"px-1.5 font-semibold dark:text-white"}>Login</h5>
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
                session?.user.name.userIsAdmin && (
                    <Link
                        href={dashboardLink}
                        className={"cursor-pointer btn rounded-full btn-secondary normal-case flex items-center"}
                    >
                        Dashboard
                    </Link>

                )
            }
        </>
    );
};

export default NavbarUser;