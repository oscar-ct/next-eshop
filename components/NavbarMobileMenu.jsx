import { motion } from "framer-motion";
import NavbarMobileMenuItem from "@/components/NavbarMobileMenuItem";
import Link from "next/link";
import NavbarSearchBox from "@/components/NavbarSearchBox";
import {signOut} from "next-auth/react";
import {useContext} from "react";
import GlobalContext from "@/context/GlobalContext";

const NavbarMobileMenu = ({ toggle, links, session }) => {

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
            <NavbarMobileMenuItem>
                <NavbarSearchBox toggle={toggle}/>
            </NavbarMobileMenuItem>
            <NavbarMobileMenuItem>
                <Link href={"/"} onClick={() => toggle()}>Home</Link>
            </NavbarMobileMenuItem>
            <NavbarMobileMenuItem>
                <Link href={latestProductsLink} onClick={() => toggle()}>
                    Latest Products
                </Link>
            </NavbarMobileMenuItem>
            <NavbarMobileMenuItem>
                <Link href={topRatedLink} onClick={() => toggle()}>
                    Top Rated Products
                </Link>
            </NavbarMobileMenuItem>
            <NavbarMobileMenuItem>
                <Link href={"/locator"} onClick={() => toggle()}>
                    Order Lookup
                </Link>
            </NavbarMobileMenuItem>
            {
                session ? (
                    <>
                        <NavbarMobileMenuItem>
                            <Link href={myAccountLink} onClick={() => toggle()}>
                                My Account
                            </Link>
                        </NavbarMobileMenuItem>
                        <NavbarMobileMenuItem>
                            <Link href={myOrdersLink} onClick={() => toggle()}>
                                My Orders
                            </Link>
                        </NavbarMobileMenuItem>
                    </>
                ) : (
                    <>
                        <NavbarMobileMenuItem>
                            <Link href={"/login"} onClick={() => toggle()}>
                                Login
                            </Link>
                        </NavbarMobileMenuItem>
                        <NavbarMobileMenuItem>
                            <Link href={"/register"} onClick={() => toggle()}>
                                Create Account
                            </Link>
                        </NavbarMobileMenuItem>
                    </>
                )
            }
            {
                session?.user.name.userIsAdmin && (
                    <NavbarMobileMenuItem>
                        <Link href={dashboardLink} onClick={() => toggle()}>
                            Dashboard
                        </Link>
                    </NavbarMobileMenuItem>
                )
            }
            {
                session && (
                    <NavbarMobileMenuItem>
                        <button onClick={logoutHandler}>
                            Logout
                        </button>
                    </NavbarMobileMenuItem>
                )
            }
        </motion.ul>
    );
};

export default NavbarMobileMenu;