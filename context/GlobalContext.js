"use client";

import {createContext, useReducer} from "react";
import globalReducer from "@/context/GlobalReducer";

const GlobalContext = createContext();

export function GlobalProvider({ children }) {

    const initialState = typeof window !== "undefined" && localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : {
        cartItems: [],
        itemsPrice: 0,
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: 0,
        shippingAddress: {},
        paymentMethod: null,
        discount: false,
        discountKey: "",
        publishableKey: "",
        guestData: "",
        user: null
    };

    const [state, dispatch] = useReducer(globalReducer, initialState);


    return (
        <GlobalContext.Provider value={{
            dispatch,
            itemsPrice: state.itemsPrice,
            shippingPrice: state.shippingPrice,
            taxPrice: state.taxPrice,
            totalPrice: state.totalPrice,
            cartItems: state.cartItems,
            shippingAddress: state.shippingAddress,
            paymentMethod: state.paymentMethod,
            discount: state.discount,
            discountKey: state.discountKey,
            publishableKey: state.publishableKey,
            guestData: state.guestData,
            user: state.user
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalContext;

// export function useGlobalContext() {
//     return useContext(GlobalContext);
// }