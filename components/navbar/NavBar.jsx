"use client";

import {useEffect, useState} from "react";

const NavBar = ({children}) => {

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return (
        <div
            className={`${isScrolled ? "backdrop-blur-lg" : "bg-transparent"} z-40 fixed h-12 inset-0 w-full transition-all duration-1000 md:h-16`}>
            {children}
        </div>
    );
};

export default NavBar;