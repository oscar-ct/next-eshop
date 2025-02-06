import { motion } from "framer-motion";
import NavbarMobileMenuItem from "@/components/NavbarMobileMenuItem";
import Link from "next/link";
import NavbarSearchBox from "@/components/NavbarSearchBox";

const NavbarMobileMenu = ({ toggle, links, user }) => {

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

    const { latestProductsLink, myOrdersLink, myAccountLink, dashboardLink, topRatedLink } = links;

    return (
        <motion.ul className={"z-50 absolute top-14 w-72"} variants={variants}>
            <NavbarMobileMenuItem>
                <NavbarSearchBox/>
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
                user ? (
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
                user?.isAdmin && (
                    <NavbarMobileMenuItem>
                        <Link href={dashboardLink} onClick={() => toggle()}>
                            Dashboard
                        </Link>
                    </NavbarMobileMenuItem>
                )
            }
            {
                user && (
                    <NavbarMobileMenuItem>
                        <button onClick={() => toggle()}>
                            Logout
                        </button>
                    </NavbarMobileMenuItem>
                )
            }
        </motion.ul>
    );
};

export default NavbarMobileMenu;