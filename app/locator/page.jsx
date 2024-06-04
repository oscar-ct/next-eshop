"use client";

import {useEffect, useState} from 'react';
import CustomBtn from "@/components/CustomBtn";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import Loading from "@/app/loading";

const fetchVerifyEmail = async (body) => {
    const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;
    try {
        if (!apiDomain) {
            return null;
        }
        const res = await fetch(`${apiDomain}/auth/verify/email`, {
            method: "POST",
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            const message = await res.text();
            toast.error(message);
            return null;
        }
        return res.json();
    } catch (e) {
        console.log(e);
        return null;
    }
};

const fetchVerifyOrder = async (body) => {
    const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;
    try {
        if (!apiDomain) {
            return null;
        }
        const res = await fetch(`${apiDomain}/orders/validate`, {
            method: "POST",
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            const message = await res.text();
            toast.error(message);
            return null;
        }
        return res.json();
    } catch (e) {
        console.log(e);
        return null;
    }
};


const OrderLocatorPage = () => {

    const router = useRouter();
    const [isVerifiedEmail, setIsVerifiedEmail] = useState(false);
    const [email, setEmail] = useState("");
    const [orderId, setOrderId] = useState("");
    const [orderErrorMessage, setOrderErrorMessage] = useState("");
    const [emailErrorMessage, setEmailErrorMessage] = useState("");
    const [emailInputIsFocused, setEmailInputIsFocused] = useState(false);
    const [orderInputIsFocused, setOrderInputIsFocused] = useState(false);
    const [loading, setLoading] = useState(true);


    const verifyEmailHandler = async (e) => {
        e.preventDefault();
        setEmailErrorMessage("");
        setLoading(true);
        const res = await fetchVerifyEmail({email: email});
        setTimeout(() => {
            if (res.isValidEmail) {
                setIsVerifiedEmail(true);
            } else {
                setEmailErrorMessage("Sorry, we couldn't find an order with this email, please try another email.");
            }
           setLoading(false);
        }, 300);
    };

    const locateOrderHandler = async (e) => {
        e.preventDefault();
        setOrderErrorMessage("");
        const res = await fetchVerifyOrder({email, orderId});
        if (res.isValidOrder) {
            router.push(`/orders/${orderId}`);
        } else {
            setLoading(true);
            setTimeout(() => {
                setOrderErrorMessage("Sorry, we couldn't find this order, please try again.");
                setLoading(false);
            }, 300);
        }
    };

    useEffect(() => {
        setLoading(false);
    }, []);

    if (!loading) {
        return (
            <div className={"min-h-[calc(100vh-292px)] md:min-h-[calc(100vh-224px)] flex justify-center items-center"}>
                <div className="bg-white p-6 sm:p-14 sm:border">
                    <div className="text-start font-bold text-4xl">
                        Let&apos;s find your e-shop order
                    </div>
                    {
                        !isVerifiedEmail ? (
                            <form onSubmit={verifyEmailHandler}>
                                <p className="mx-auto font-normal text-sm my-6 max-w-lg">
                                    Please enter your email address that you used to place your order.  We will need your order number in the next step.
                                </p>
                                <div className={`${emailInputIsFocused ? "ring-2 ring-blue-200 border-blue-400" : "border-gray-300"} flex items-center border bg-white shadow-sm rounded-md overflow-hidden px-2 h-14 justify-between`}>
                                    <label className="text-sm font-medium text-gray-600 tracking-wide border-r border-gray-300 pr-2 h-full w-min flex items-center">Email
                                    </label>
                                    <input
                                        onFocus={() => setEmailInputIsFocused(true)}
                                        onBlur={() => setEmailInputIsFocused(false)}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-white text-base text-gray-600 flex-grow outline-none px-2 "
                                        type="email"
                                        placeholder="Enter your email address"
                                        autoComplete={"email"}
                                        required
                                    />
                                    <div className="hidden sm:flex ms:flex items-center px-2 rounded-lg space-x-4 mx-auto ">
                                        <CustomBtn type={"submit"}>
                                            Search
                                        </CustomBtn>
                                    </div>
                                </div>
                                <div className="pt-3 flex sm:hidden justify-end items-center px-2 rounded-lg space-x-4 mx-auto ">
                                    <CustomBtn type={"submit"}>
                                        Search
                                    </CustomBtn>
                                </div>
                                {
                                    emailErrorMessage && (
                                        <p className="text-center mx-auto font-normal text-sm pt-6 max-w-lg text-red-500">
                                            {emailErrorMessage}
                                        </p>
                                    )
                                }
                            </form>
                        ) : (
                            <form onSubmit={locateOrderHandler}>
                                <p className="mx-auto font-normal text-sm my-6 max-w-lg">
                                    Email found! Please enter your order number now. If you are having trouble locating your order number, feel free to <span className={"link link-primary"}>contact us</span> for further assistance.
                                </p>
                                <div className={`${orderInputIsFocused ? "ring-2 ring-blue-200 border-blue-400" : "border-gray-300"} flex items-center border bg-white shadow-sm rounded-md overflow-hidden px-2 h-14 justify-between `}>
                                    <label className="w-fit text-sm font-medium text-gray-600 tracking-wide border-r border-gray-300 pr-2 h-full flex items-center">Order #
                                    </label>
                                    <input
                                        onFocus={() => setOrderInputIsFocused(true)}
                                        onBlur={() => setOrderInputIsFocused(false)}
                                        value={orderId}
                                        onChange={(e) => setOrderId(e.target.value)}
                                        className="bg-white text-base text-gray-600 flex-grow outline-none px-2 "
                                        type="text"
                                        placeholder="Enter your order number"
                                        required
                                    />
                                    <div className="hidden sm:flex ms:flex items-center px-2 rounded-lg space-x-4 mx-auto ">
                                        <CustomBtn type={"submit"}>
                                            Find Order
                                        </CustomBtn>
                                    </div>
                                </div>
                                <div className="pt-3 flex sm:hidden justify-end items-center px-2 rounded-lg space-x-4 mx-auto ">
                                    <CustomBtn type={"submit"}>
                                        Find Order
                                    </CustomBtn>
                                </div>
                                {
                                    orderErrorMessage && (
                                        <p className="text-center mx-auto font-normal text-sm pt-6 max-w-lg text-red-500">
                                            {orderErrorMessage}
                                        </p>
                                    )
                                }
                            </form>
                        )
                    }
                </div>
            </div>
        );
    }
    return <Loading/>
};

export default OrderLocatorPage;