"use client";

import {useEffect, useState} from "react";
import {FaUser, FaChevronDown, FaSearch} from "react-icons/fa";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
// import {getServerSession} from "next-auth";


const Navbar = () => {

    const { data: session } = useSession();
    // const session = await getServerSession();
    console.log(session)

    return (
        <div>
            {
                session && (
                    <span onClick={() => signOut()}>Logout</span>
                )
            }
            {
                !session && (
                    <Link href={"/login"}>Login</Link>
                )
            }
        </div>
    );
};

export default Navbar;