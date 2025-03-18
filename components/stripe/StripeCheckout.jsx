"use client";

import {Elements} from "@stripe/react-stripe-js";
import StripeCheckoutForm from "./StripeCheckoutForm";
import {useState} from "react";
import {loadStripe} from "@stripe/stripe-js/pure";
import {useTheme} from "next-themes";


const StripeCheckout = ({ existingOrder , setSaveButtonDisabled, setOrder }) => {

    const [stripePromise] = useState(() => loadStripe(process.env.NEXT_PUBLIC_STRIPE_API_PUBLISHABLE_KEY));
    const { theme} = useTheme();
    const appearance = {
        theme: theme === "dark" ? "night" : 'stripe',
        // variables: {
            // fontFamily: 'Ideal Sans, system-ui, sans-serif',
            // spacingUnit: '3px',
            // borderRadius: '4px',
            // gridRowSpacing: "4px"
        // }
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
                <StripeCheckoutForm setOrder={setOrder} existingOrder={existingOrder} setSaveButtonDisabled={setSaveButtonDisabled}/>
            </Elements>
        ) : (
            "Loading Stripe..."
        )
    );
};

export default StripeCheckout;