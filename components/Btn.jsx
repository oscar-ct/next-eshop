"use client";

import {motion} from "framer-motion";

const Btn = ({isDisabled = false, customClass="", children, onClick, type="button"}) => {

    const baseClasses = "relative rounded-full px-5 py-2.5 text-base";
    const disabledClasses = "bg-gray-100 text-gray-300";
    const enabledClasses = "overflow-hidden group bg-violet-600 text-white md:hover:bg-gradient-to-r md:hover:from-violet-600 md:hover:to-violet-500 md:hover:ring-2 md:hover:ring-offset-0 md:hover:ring-violet-500 md:transition-all md:ease-out md:duration-300";
    const buttonClasses = `${baseClasses} ${customClass} ${isDisabled ? disabledClasses : enabledClasses}`;

    return (
        <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className={buttonClasses}
            disabled={isDisabled}
            type={type}
        >
            {!isDisabled && (
                <span className="md:absolute md:right-0 md:w-8 md:h-32 md:-mt-12 md:transition-all md:duration-500 md:transform md:translate-x-12 md:bg-white md:opacity-10 md:rotate-12 md:group-hover:-translate-x-40 md:ease"/>
            )}
            <span className="relative">{children}</span>
        </motion.button>
    );
};

export default Btn;