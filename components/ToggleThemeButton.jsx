"use client";

import {MdOutlineDarkMode, MdOutlineLightMode} from "react-icons/md";
import {useTheme} from "next-themes";
import {useEffect, useState} from "react";

const ToggleThemeButton = () => {
    const { theme, setTheme } = useTheme();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    if (!isMounted) return (
        <div className={"w-full"}>
            <span className="loading loading-bars loading-xs"/>
        </div>

    )

    if (isMounted) return (
        <>
            {
                theme === "dark" ? (
                    <button onClick={() => setTheme("light")} className={"w-full h-full flex flex-col items-center"}>
                        <MdOutlineLightMode size={24} fill={"white"}/>
                        <span className={"hidden text-white text-xs md:block "}>Light</span>
                    </button>

                ) : (
                    <button onClick={() => setTheme("dark")} className={"w-full h-full flex flex-col items-center"}>
                        <MdOutlineDarkMode size={24}/>
                        <span className={"hidden text-xs md:block"}>Dark</span>
                    </button>
                )
            }
        </>
    );
};

export default ToggleThemeButton;