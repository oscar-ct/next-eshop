"use client";

import {Elements} from "@stripe/react-stripe-js";
import StripeCheckoutForm from "./StripeCheckoutForm";
import {useContext, useEffect, useState} from "react";
import {loadStripe} from "@stripe/stripe-js/pure";
import GlobalContext from "@/context/GlobalContext";

const fetchStripeClientId = async () => {
    const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;
    if (!apiDomain) {
        return null;
    }
    const res = await fetch(`${apiDomain}/stripe/config`);
    return res.json();
}

const StripeCheckout = ({existingOrder}) => {

    const { dispatch, publishableKey } = useContext(GlobalContext);

    useEffect(() => {
        const fetchStripeClientIdData = async () => {
            const response = await fetchStripeClientId();
            setStripePromise(loadStripe(response.clientId));
            dispatch({type: "SET_PUBLISHABLE_KEY", payload: response.clientId});
            dispatch({type: "SET_LOCAL_STORAGE"});
        };
        if (!publishableKey) {
            fetchStripeClientIdData();
        }
    }, [publishableKey, dispatch]);


    const [stripePromise, setStripePromise] = useState(() => publishableKey ? loadStripe(publishableKey) : null);

    /// Stripe Options ////
    const appearance = {
        theme: 'stripe',
    };
    const options = {
        mode: 'payment',
        amount: 100,
        currency: 'usd',
        appearance,
    };

    return (
        stripePromise ? (
            <Elements stripe={stripePromise} options={options}>
                <StripeCheckoutForm existingOrder={existingOrder}/>
            </Elements>
        ) : (
            "Loading..."
        )
    );
};

export default StripeCheckout;