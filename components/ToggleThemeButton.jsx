"use client";

import {useContext} from "react";
import {MdOutlineDarkMode, MdOutlineLightMode} from "react-icons/md";
import ThemeContext from "@/context/ThemeContext";

const ToggleThemeButton = () => {

    const { isDarkMode, dispatch } = useContext(ThemeContext);

    const toggleTheme = () => {
        document.documentElement.classList.toggle('dark');
        dispatch({type: "TOGGLE_THEME"});
    };

    return (
        <button className={"w-full h-full flex items-center"} onClick={toggleTheme}>
            {
                isDarkMode ? (
                    <div className={"flex flex-col items-center"}>
                        <MdOutlineLightMode size={24} fill={"white"}/>
                        <span className={"hidden text-white text-xs md:block "}>Light</span>
                    </div>

                ) : (
                    <div className={"flex flex-col items-center"}>
                        <MdOutlineDarkMode size={24}/>
                        <span className={"hidden text-xs md:block"}>Dark</span>
                    </div>
                )
            }
        </button>
    );
};

export default ToggleThemeButton;