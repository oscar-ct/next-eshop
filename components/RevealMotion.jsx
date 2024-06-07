import {motion, useAnimation, useInView} from "framer-motion";
import {useEffect, useRef} from "react";

const RevealMotion = ({children, childClass = "w-full", delay = 0.10, once = true, y = 0, parentClass = "w-full", isSmallScreen = false}) => {

    const ref = useRef(null);
    const isInView = useInView(ref, {once: once});
    const mainControls = useAnimation();

    useEffect(() => {
        if (isInView) {
            mainControls.start("visible")
        }
        if (!once && !isInView) {
            mainControls.start("hidden")
        }
    }, [isInView, mainControls, once]);



    return (
        <div ref={ref} className={`${parentClass}`}>
            <motion.div
                variants={{
                    hidden: { opacity: 0, y: y, scale: isSmallScreen ? .5 : 1 },
                    visible: { opacity: 1, y: 0, scale: 1 },
                }}
                initial={"hidden"}
                animate={mainControls}
                transition={{
                    duration: isSmallScreen ? .15 : .35,
                    delay: delay
                }}
                className={`${childClass}`}
            >
                {children}
            </motion.div>
        </div>
    );
};


export default RevealMotion;