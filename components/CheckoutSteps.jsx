"use client";

import GlobalContext from "@/context/GlobalContext";
import {useContext, useEffect, useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";

const CheckoutSteps = () => {
    const { cartItems, shippingAddress, paymentMethod } = useContext(GlobalContext);
    const pathname = usePathname();

    const [mounted, setMounted] = useState(false);
    const [clientSecretExists, setClientSecretExists] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);


    useEffect(() => {
        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );
        if (clientSecret && !clientSecretExists) {
            setClientSecretExists(true);
        }
    }, [clientSecretExists]);


    const steps = [
        {
            name: "Cart",
            route: "/cart",
            isCompleted: cartItems.length > 0,
            isClickable: true, // Always clickable
        },
        {
            name: "Shipping",
            route: "/shipping",
            isCompleted: cartItems.length > 0 && Object.keys(shippingAddress).length > 0,
            isClickable: cartItems.length > 0,
        },
        {
            name: "Payment",
            route: "/payment",
            isCompleted: paymentMethod && Object.keys(shippingAddress).length > 0,
            isClickable: Object.keys(shippingAddress).length > 0,
        },
        {
            name: "Checkout",
            route: "/checkout",
            isCompleted:
                paymentMethod &&
                Object.keys(shippingAddress).length > 0 &&
                clientSecretExists,
            isClickable: paymentMethod && Object.keys(shippingAddress).length > 0,
        },
    ];


    const getStepClasses = (isCurrentPage) => `step ${isCurrentPage ? "text-lg sm:text-xl dark:text-white" : "text-gray-400"}`;

    const renderStep = ({ name, route, isCompleted, isClickable }) => {
        const isCurrentPage = pathname.includes(name.toLowerCase());
        const stepClasses = `step ${getStepClasses(isCurrentPage)}`;
        if (isClickable) {
            return (
                <Link
                    key={name}
                    href={route}
                    data-content={isCompleted ? "✓" : "✕"}
                    className={`${stepClasses} ${isCompleted ? "step-success" : ""}`}
                >
                    {name}
                </Link>
            );
        }
        return (
            <button
                key={name}
                data-content="✕"
                className={`${stepClasses} cursor-default`}
                disabled
            >
                {name}
            </button>
        );
    };

    return (
        <div className="flex justify-center pt-5 text-xs sm:text-sm font-semibold">
            <div className="steps w-full">
                {
                    !mounted ? steps.map((step) => (
                        <button
                            key={step.name}
                            data-content="?"
                            className={`cursor-default ${getStepClasses(pathname.includes(step.name.toLowerCase()))}`}
                        >
                            {step.name}
                        </button>
                    )) : steps.map((step) => renderStep(step))
                }
            </div>
        </div>
    );
};

export default CheckoutSteps;