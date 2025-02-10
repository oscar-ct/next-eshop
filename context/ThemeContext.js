// "use client";
//
// import {createContext, useReducer} from "react";
// import themeReducer from "@/context/ThemeReducer";
//
// const ThemeContext = createContext();
//
// export function ThemeProvider({ children }) {
//
//     const initialState = {
//         isDarkMode: typeof window !== "undefined" && !window.matchMedia('(prefers-color-scheme: light)').matches,
//         isInitialRender: true,
//     };
//
//     const [state, dispatch] = useReducer(themeReducer, initialState);
//
//
//     return (
//         <ThemeContext.Provider value={{
//             dispatch,
//             isDarkMode: state.isDarkMode,
//             isInitialRender: state.isInitialRender,
//         }}>
//             {children}
//         </ThemeContext.Provider>
//     )
// }
//
// export default ThemeContext;