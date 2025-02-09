"use client";

import {useEffect, useState} from 'react';
import CustomBtn from "@/components/CustomBtn";
import {useRouter} from "next/navigation";
import Loading from "@/app/loading";
import {fetchVerifyEmail, fetchVerifyOrder} from "@/utils/api-requests/fetchRequests";


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
            <div className="h-full flex flex-row justify-center px-2 py-10 sm:px-0">
                <div className="sm:mt-10 md:mb-10 w-full flex justify-center self-center">
                    <div
                        className="bg-zinc-50 z-20 px-4 py-8 w-full rounded-2xl sm:max-w-2xl sm:px-8 sm:bg-white sm:shadow-lg sm:border-none dark:bg-slate-800">
                        <div className="font-bold text-3xl text-center sm:text-start">
                            Find your e-shop order
                        </div>
                        {
                            !isVerifiedEmail ? (
                                <form onSubmit={verifyEmailHandler}>
                                    <p className="my-6 max-w-lg text-center sm:text-start dark:text-white">
                                        Please enter your email address that you used to place your order. We will need
                                        your order number in the next step.
                                    </p>
                                    <div
                                        className={`${emailInputIsFocused ? "ring-2 ring-blue-200 border-blue-400" : "border-gray-300"} flex items-center border bg-white shadow-sm rounded-md overflow-hidden px-2 h-14 justify-between`}>
                                        <label htmlFor={"email"}
                                               className="text-sm font-medium text-gray-600 tracking-wide border-r border-gray-300 pr-2 h-full w-min flex items-center">Email
                                        </label>
                                        <input
                                            id={"email"}
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
                                        <div
                                            className="hidden sm:flex ms:flex items-center px-2 rounded-lg space-x-4 mx-auto ">
                                            <CustomBtn type={"submit"}>
                                                Search
                                            </CustomBtn>
                                        </div>
                                    </div>
                                    <div
                                        className="pt-8 flex sm:hidden justify-end items-center px-2 rounded-lg space-x-4 mx-auto ">
                                        <CustomBtn type={"submit"}>
                                            Search
                                        </CustomBtn>
                                    </div>
                                    {
                                        emailErrorMessage && (
                                            <p className="text-center mx-auto font-normal pt-6 max-w-lg text-red-500">
                                                {emailErrorMessage}
                                            </p>
                                        )
                                    }
                                </form>
                            ) : (
                                <form onSubmit={locateOrderHandler}>
                                    <p className="my-6 max-w-lg text-center sm:text-start dark:text-white">
                                        Email found! Please enter your order number now. If you are having trouble
                                        locating your order number, feel free to <span className={"link link-primary"}>contact us</span> for
                                        further assistance.
                                    </p>
                                    <div
                                        className={`${orderInputIsFocused ? "ring-2 ring-blue-200 border-blue-400" : "border-gray-300"} flex items-center border bg-white shadow-sm rounded-md overflow-hidden px-2 h-14 justify-between `}>
                                        <label htmlFor={"order"}
                                               className="w-fit text-sm font-medium text-gray-600 tracking-wide border-r border-gray-300 pr-2 h-full flex items-center">Order
                                            #
                                        </label>
                                        <input
                                            id={"order"}
                                            onFocus={() => setOrderInputIsFocused(true)}
                                            onBlur={() => setOrderInputIsFocused(false)}
                                            value={orderId}
                                            onChange={(e) => setOrderId(e.target.value)}
                                            className="bg-white text-base text-gray-600 flex-grow outline-none px-2 "
                                            type="text"
                                            placeholder="Enter your order number"
                                            required
                                        />
                                        <div
                                            className="hidden sm:flex ms:flex items-center px-2 rounded-lg space-x-4 mx-auto ">
                                            <CustomBtn type={"submit"}>
                                                Find Order
                                            </CustomBtn>
                                        </div>
                                    </div>
                                    <div
                                        className="pt-8 flex sm:hidden justify-end items-center px-2 rounded-lg space-x-4 mx-auto ">
                                        <CustomBtn type={"submit"}>
                                            Find Order
                                        </CustomBtn>
                                    </div>
                                    {
                                        orderErrorMessage && (
                                            <p className="text-center mx-auto font-normal pt-6 max-w-lg text-red-500">
                                                {orderErrorMessage}
                                            </p>
                                        )
                                    }
                                </form>
                            )
                        }
                    </div>
                </div>
            </div>
            );
        }
            return <Loading/>
        };

export default OrderLocatorPage;