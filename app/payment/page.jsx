"use client";

import React, {useContext, useEffect, useState} from 'react';
import {useRouter} from "next/navigation";
import GlobalContext from "@/context/GlobalContext";
import paypal from "@/icons/paypal-logo.svg";
import stripe from "@/icons/stripe-logo.svg";
import Image from "next/image";
import Btn from "@/components/Btn";
import CheckoutSteps from "@/components/CheckoutSteps";
import RevealMotion from "@/components/RevealMotion";

const PaymentPage = () => {

    const router = useRouter();
    const { dispatch, shippingAddress, paymentMethod, cartItems } = useContext(GlobalContext);

    const [paymentMeth, setPaymentMeth] = useState(paymentMethod ? paymentMethod : null);

    useEffect(function (){
        const shippingAddressIsInvalid = Object.keys(shippingAddress).length === 0;
        if (cartItems.length === 0) {
            router.push("/");
        } else if (shippingAddressIsInvalid) {
            router.push("/shipping");
        }
    }, [router, shippingAddress, cartItems.length]);

    const submitPaymentMethod = (e) => {
        e.preventDefault();
        if (paymentMeth) {
            dispatch({type: "SET_PAYMENT_METHOD", payload: paymentMeth});
            dispatch({type: "SET_LOCAL_STORAGE"});
            router.push("/checkout");
        }
    };

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
       setMounted(true);
    }, []);

    return (
        <>
            <CheckoutSteps/>
            <div className={"px-2 w-full flex justify-center sm:pt-10"}>
                <div className={"bg-zinc-50 z-20 px-4 py-8 w-full rounded-2xl max-w-xl sm:px-8 sm:bg-white sm:shadow-lg sm:border-none dark:bg-slate-800"}>
                    {
                        !mounted ? (
                            <div className="fadeInEffect flex w-full flex-col gap-6 h-full">
                                <div className="skeleton h-16 w-full bg-gray-300 dark:bg-gray-200"/>
                                <div className="skeleton h-24 w-full bg-gray-300 dark:bg-gray-200"/>
                                <div className="skeleton h-24 w-full bg-gray-300 dark:bg-gray-200"/>
                                <div className={"flex justify-end"}>
                                    <div className="skeleton h-10 w-4/12 bg-gray-300 dark:bg-gray-200"/>
                                </div>
                            </div>
                        ) : (
                            <RevealMotion y={25}>
                                <h1 className={"h-20 flex items-start justify-center font-semibold text-3xl text-center sm:h-16 dark:text-white"}>
                                    Select your payment method
                                </h1>
                                <form onSubmit={submitPaymentMethod} className={"pt-3 space-y-5"}>
                                    <div
                                        className={`w-full border cursor-pointer rounded-md shadow-sm ${paymentMeth === "PayPal / Credit Card" && "ring-2 border-green-500 ring-green-100"}`}
                                        onClick={() => setPaymentMeth("PayPal / Credit Card")}
                                    >
                                        <div className={"w-full flex px-6 py-5"}>
                                            <div className={"w-2/12 flex justify-center"}>
                                                <Image
                                                    className={"w-[50px] h-[50px]"}
                                                    src={paypal}
                                                    alt={"paypal"}
                                                    width={50}
                                                    height={50}
                                                />
                                            </div>
                                            <div className={"w-9/12 flex items-center"}>
                                     <span className={"px-3 dark:text-white"}>
                                        PayPal, Venmo, and Credit Card.
                                    </span>
                                            </div>
                                            <div className={"w-1/12 flex items-center"}>
                                                <input
                                                    onChange={(e) => setPaymentMeth(e.target.value)}
                                                    type="radio"
                                                    name="paymentMethod"
                                                    id={"PayPal / Credit Card"}
                                                    value={"PayPal / Credit Card"}
                                                    className="radio radio-primary"
                                                    checked={paymentMeth === "PayPal / Credit Card"}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className={`w-full border cursor-pointer rounded-md shadow-sm ${paymentMeth === "Stripe / Credit Card" && "ring-2 border-green-500 ring-green-100"}`}
                                        onClick={() => setPaymentMeth("Stripe / Credit Card")}
                                    >
                                        <div className={"w-full flex pr-6 pl-3 py-5"}>
                                            <div className={"w-2/12 flex justify-center"}>
                                                <Image
                                                    className={"w-full h-auto"}
                                                    src={stripe}
                                                    alt={"stripe"}
                                                    width={50}
                                                    height={50}
                                                />
                                            </div>
                                            <div className={"w-9/12 flex items-center"}>
                                    <span className={"px-3 py-4 dark:text-white"}>
                                       Credit Card, Cash App, After Pay, and more.
                                    </span>
                                            </div>
                                            <div className={"w-1/12 flex items-center"}>
                                                <input
                                                    onChange={(e) => setPaymentMeth(e.target.value)}
                                                    type="radio"
                                                    name="paymentMethod"
                                                    id={"Stripe / Credit Card"}
                                                    value={"Stripe / Credit Card"}
                                                    className="radio radio-primary"
                                                    checked={paymentMeth === "Stripe / Credit Card"}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={"pt-5 w-full flex justify-end"}>
                                        <Btn isDisabled={paymentMeth === null} type={"submit"}>
                                            Save and Continue
                                        </Btn>
                                    </div>
                                </form>
                            </RevealMotion>
                        )
                    }
                </div>
            </div>
        </>
    );
};

export default PaymentPage;