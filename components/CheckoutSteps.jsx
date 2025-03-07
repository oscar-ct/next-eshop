"use client";

import GlobalContext from "@/context/GlobalContext";
import {useContext, useEffect, useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";

const CheckoutSteps = () => {

    const {cartItems, shippingAddress, paymentMethod} = useContext(GlobalContext);
    const pathname = usePathname();

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const [clientSecretExists, setClientSecretExists] = useState(false);
    useEffect(() => {
        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );
        if (clientSecret && !clientSecretExists) setClientSecretExists(true);
    }, [clientSecretExists]);

    const step1name = "Cart"
    const step2name = "Shipping"
    const step3name = "Payment"
    const step4name = "Checkout";

    const isCartPage = pathname.includes(step1name.toLowerCase());
    const isShippingPage = pathname.includes(step2name.toLowerCase());
    const isPaymentPage = pathname.includes(step3name.toLowerCase());
    const isPlaceOrderPage = pathname.includes(step4name.toLowerCase());

    return (
        !mounted ? (
            <div className={"flex justify-center pt-5 text-xs sm:text-sm font-semibold"}>
                <div className={"steps w-full"}>
                    <button data-content="?"
                            className={`cursor-default step ${isCartPage ? "text-lg sm:text-xl dark:text-white" : "text-gray-400"}`}>
                        {step1name}
                    </button>
                    <button data-content="?"
                            className={`cursor-default step ${isShippingPage ? "text-lg sm:text-xl dark:text-white" : "text-gray-400"}`}>
                        {step2name}
                    </button>
                    <button data-content="?"
                            className={`cursor-default step ${isPaymentPage ? "text-lg sm:text-xl dark:text-white" : "text-gray-400"}`}>
                        {step3name}
                    </button>
                    <button data-content="?"
                            className={`cursor-default step ${isPlaceOrderPage ? "text-lg sm:text-xl dark:text-white" : "text-gray-400"}`}>
                        {step4name}
                    </button>
                </div>
            </div>
        ) : (
            <div className={"flex justify-center pt-5 text-xs sm:text-sm font-semibold"}>
                <div className={"steps w-full"}>
                    {
                        cartItems.length !== 0 ? (
                            <Link href={"/cart"} data-content="✓"
                                  className={`step step-success ${isCartPage ? "text-lg sm:text-xl dark:text-white" : "text-gray-400"}`}>
                                {step1name}
                            </Link>
                        ) : (
                            <button data-content="✕"
                                    className={`cursor-default step ${isCartPage ? "text-lg sm:text-xl dark:text-white" : "text-gray-400"}`}>
                                {step1name}
                            </button>
                        )
                    }
                    {
                        cartItems.length !== 0 && Object.keys(shippingAddress).length !== 0 ? (
                            <Link data-content="✓" href={"/shipping"}
                                  className={`step step-success ${isShippingPage ? "text-lg sm:text-xl dark:text-white" : "text-gray-400"}`}>
                                {step2name}
                            </Link>
                        ) : cartItems.length !== 0 && Object.keys(shippingAddress).length === 0 ? (
                            <Link data-content="✕" href={"/shipping"}
                                  className={`step ${isShippingPage ? "text-lg sm:text-xl dark:text-white" : "text-gray-400"}`}>
                                {step2name}
                            </Link>
                        ) : (
                            <button data-content="✕"
                                    className={`cursor-default step ${isShippingPage ? "text-lg sm:text-xl dark:text-white" : "text-gray-400"}`}>
                                {step2name}
                            </button>
                        )
                    }
                    {
                        !paymentMethod && Object.keys(shippingAddress).length !== 0 ? (
                            <Link data-content="✕" href={"/payment"}
                                  className={`step ${isPaymentPage ? "text-lg sm:text-xl dark:text-white" : "text-gray-400"}`}>
                                {step3name}
                            </Link>
                        ) : paymentMethod ? (
                            <Link data-content="✓" href={"/payment"}
                                  className={`step step-success ${isPaymentPage ? "text-lg sm:text-xl dark:text-white" : "text-gray-400"}`}>
                                {step3name}
                            </Link>
                        ) : (
                            <button data-content="✕"
                                    className={`cursor-default step ${isPaymentPage ? "text-lg sm:text-xl dark:text-white" : "text-gray-400"}`}>
                                {step3name}
                            </button>
                        )
                    }
                    {
                        paymentMethod && Object.keys(shippingAddress).length !== 0 && !clientSecretExists ? (
                            <Link data-content="✕" href={"/checkout"}
                                  className={`step  ${isPlaceOrderPage ? "text-lg sm:text-xl dark:text-white" : "text-gray-400"}`}>
                                {step4name}
                            </Link>
                        ) : paymentMethod && Object.keys(shippingAddress).length !== 0 && clientSecretExists ? (
                            <Link data-content="✓" href={"/checkout"}
                                  className={`step step-success ${isPlaceOrderPage ? "text-lg sm:text-xl dark:text-white" : "text-gray-400"}`}>
                                {step4name}
                            </Link>
                        ) : (
                            <button data-content="✕"
                                    className={`cursor-default step ${isPlaceOrderPage ? "text-lg sm:text-xl dark:text-white" : "text-gray-400"}`}>
                                {step4name}
                            </button>
                        )
                    }
                </div>
            </div>
        )
    );
};

export default CheckoutSteps;