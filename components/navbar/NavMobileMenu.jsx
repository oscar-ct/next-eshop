import { motion } from "framer-motion";
import NavMobileMenuItem from "@/components/navbar/NavMobileMenuItem";
import Link from "next/link";
import NavbarSearchBox from "@/components/navbar/NavSearchBox";
import {signOut} from "next-auth/react";
import {useContext} from "react";
import GlobalContext from "@/context/GlobalContext";

const NavMobileMenu = ({ toggle, links, session }) => {

    const variants = {
        open: {
            visibility: "visible",
            transition: { staggerChildren: 0.07, delayChildren: 0.2 }
        },
        closed: {
            visibility: "hidden",
            transition: { staggerChildren: 0.05, staggerDirection: -1 }
        }
    };

    const { dispatch } = useContext(GlobalContext);
    const { latestProductsLink, myOrdersLink, myAccountLink, dashboardLink, topRatedLink } = links;

    const logoutHandler = async () => {
        await signOut({ callbackUrl: '/' });
        dispatch({type: "RESET_STATE"});
        toggle();
    };

    return (
        <motion.ul className={"z-50 absolute top-14 w-72"} variants={variants}>
            <NavMobileMenuItem>
                <NavbarSearchBox toggle={toggle}/>
            </NavMobileMenuItem>
            <NavMobileMenuItem>
                <Link className={"block"} href={"/"} onClick={() => toggle()}>Home</Link>
            </NavMobileMenuItem>
            <NavMobileMenuItem>
                <Link className={"block"} href={latestProductsLink} onClick={() => toggle()}>
                    Latest Products
                </Link>
            </NavMobileMenuItem>
            <NavMobileMenuItem>
                <Link className={"block"} href={topRatedLink} onClick={() => toggle()}>
                    Top Rated Products
                </Link>
            </NavMobileMenuItem>
            <NavMobileMenuItem>
                <Link className={"block"} href={"/locator"} onClick={() => toggle()}>
                    Lookup Order
                </Link>
            </NavMobileMenuItem>
            {
                session ? (
                    <>
                        <NavMobileMenuItem>
                            <Link className={"block"} href={myAccountLink} onClick={() => toggle()}>
                                My Account
                            </Link>
                        </NavMobileMenuItem>
                        <NavMobileMenuItem>
                            <Link className={"block"} href={myOrdersLink} onClick={() => toggle()}>
                                My Orders
                            </Link>
                        </NavMobileMenuItem>
                    </>
                ) : (
                    <>
                        <NavMobileMenuItem>
                            <Link className={"block font-bold text-blue-400"} href={"/login"} onClick={() => toggle()}>
                                Login
                            </Link>
                        </NavMobileMenuItem>
                        <NavMobileMenuItem>
                            <Link className={"block font-bold text-blue-400"} href={"/register"} onClick={() => toggle()}>
                                Create Account
                            </Link>
                        </NavMobileMenuItem>
                    </>
                )
            }
            {
                session?.user.name.userIsAdmin && (
                    <NavMobileMenuItem>
                        <Link className={"block text-pink-500"} href={dashboardLink} onClick={() => toggle()}>
                            Dashboard
                        </Link>
                    </NavMobileMenuItem>
                )
            }
            {
                session && (
                    <NavMobileMenuItem>
                        <button className={"w-full font-bold text-start text-red-600"} onClick={logoutHandler}>
                            Logout
                        </button>
                    </NavMobileMenuItem>
                )
            }
        </motion.ul>
    );
};

export default NavMobileMenu;