"use client"

import {useEffect, useRef} from "react";
import { motion, useCycle } from "framer-motion";
import useDimensions from "@/hooks/useDimensions";
import NavbarMobileMenuToggle from "@/components/NavbarMobileMenuToggle";
import NavbarMobileMenu from "@/components/NavbarMobileMenu";
import useWindowDimensions from "@/hooks/useWindowDimensions";

const NavbarMobile = ({ session, links }) => {
    const sidebar = {
        open: (height = 1000) => ({
            clipPath: `circle(${height * 2 + 200}px at 265px 25px)`,
            transition: {
                type: "spring",
                stiffness: 20,
                restDelta: 2
            },
        }),
        closed: {
            clipPath: "circle(0px at 265px 25px)",
            transition: {
                delay: 0.25,
                type: "spring",
                stiffness: 400,
                damping: 40,
            },
        }
    };

    const [isOpen, toggleOpen] = useCycle(false, true);
    const containerRef = useRef(null);

    const { height } = useDimensions(containerRef);
    const { width } = useWindowDimensions();

    const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
            toggleOpen();
        }
    };

    useEffect(() => {
        const mobile   = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
        const start = mobile ? "touchstart" : "mousedown";
        if (isOpen) {
            document.addEventListener(start, handleClickOutside);
        }

        return () => {
            document.removeEventListener(start, handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        if (width >= 768 && isOpen) {
            toggleOpen();
        }
    }, [width, isOpen]);

    return (
        <motion.nav
            initial={false}
            animate={isOpen ? "open" : "closed"}
            custom={height}
            ref={containerRef}
            className={"w-72"}
        >
            <motion.div className={`fixed top-0 right-0 bottom-0 w-72 bg-zinc-200 bg-opacity-95 dark:bg-opacity-95 dark:bg-neutral-900`} variants={sidebar} />
            <NavbarMobileMenu session={session} links={links} toggle={() => toggleOpen()}/>
            <NavbarMobileMenuToggle toggle={() => toggleOpen()} />
        </motion.nav>
    );
};

export default NavbarMobile;