import { motion } from "framer-motion";


const NavMobileMenuItem = ({ children }) => {
    const variants = {
        open: {
            y: 0,
            opacity: 1,
            transition: {
                y: { stiffness: 1000, velocity: -100 }
            }
        },
        closed: {
            y: 50,
            opacity: 0,
            transition: {
                y: { stiffness: 1000 }
            }
        }
    };

    return (
        <motion.li
            className={`px-5 mb-4 w-full font-semibold text-slate-700 cursor-pointer text-xl antialiased hover:subpixel-antialiased dark:text-white`}
            variants={variants}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
        >
            {children}
        </motion.li>
    );
};

export default NavMobileMenuItem;