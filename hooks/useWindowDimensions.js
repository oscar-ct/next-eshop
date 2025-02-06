import {useEffect, useState} from "react";

const UseDimensions = () => {
    const [width, setWidth] = useState(typeof window !== "undefined" && window.innerWidth);
    useEffect(() => {
        const setWindowDimensions = () => {
            setWidth(window.innerWidth);
        };
        window.addEventListener("resize", setWindowDimensions);
        return () => {
            window.removeEventListener("resize", setWindowDimensions)
        }
    }, []);

    return { width };
};

export default UseDimensions;