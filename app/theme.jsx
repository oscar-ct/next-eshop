"use client";

import {ThemeProvider} from "next-themes";

const Theme = ({children}) => {
    return (
        <ThemeProvider attribute={"class"} defaultTheme={"light"}>
            {children}
        </ThemeProvider>
    );
};

export default Theme;