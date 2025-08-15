"use client";

import {useContext, useEffect, useState} from 'react';
import GlobalContext from "@/context/GlobalContext";
import Btn from "@/components/Btn";
import CartItem from "@/app/cart/components/CartItem";
import {useRouter} from "next/navigation";
import CheckoutSteps from "@/components/CheckoutSteps";
import {convertCentsToUSD} from "@/utils/covertCentsToUSD";
import {LuPartyPopper} from "react-icons/lu";
import GuestModal from "@/components/modals/GuestModal";
import RevealMotion from "@/components/RevealMotion";

const CartPage = () => {

    const { user, guestData, cartItems, itemsPrice } = useContext(GlobalContext);
    const router = useRouter();

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const checkoutHandler = () => {
        if (user) {
            router.push("/shipping");
        }  else if (!user && guestData) {
            router.push("/shipping");
        } else {
            window.checkout_modal.showModal();
        }
    };

    return (
        <>
            <CheckoutSteps/>
            {
                !mounted ? (
                    <div className={"px-2 flex m-auto max-w-screen-2xl lg:px-8"}>
                        <div
                            className={"z-20 bg-white opacity-95 mx-auto w-96 h-72 rounded-2xl px-3 pt-3 dark:bg-slate-800"}>
                            <div className={"fadeInEffect h-full gap-4 flex flex-col items-center justify-evenly"}>
                                <div className="skeleton h-24 w-full bg-gray-300 dark:bg-gray-200"></div>
                                <div className="skeleton h-4 w-28 bg-gray-300 dark:bg-gray-200"></div>
                                <div className="skeleton h-4 w-full bg-gray-300 dark:bg-gray-200"></div>
                                <div className="skeleton h-4 w-full bg-gray-300 dark:bg-gray-200"></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <RevealMotion y={25} childClass={"w-full z-20"} parentClass={"flex"}>
                        {
                            cartItems.length === 0 ? (
                                <RevealMotion y={25}>
                                <div className={"px-2 flex m-auto max-w-screen-2xl lg:px-8"}>
                                    <div className={"z-20 bg-white opacity-95 mx-auto w-96 h-72 rounded-2xl px-3 pt-3 flex flex-col items-center justify-evenly dark:bg-slate-800"}>
                                        <div className={"text-4xl md:text-4xl font-semibold flex justify-center text-center dark:text-white"}>
                                            Your cart is empty.
                                        </div>
                                        <Btn onClick={() =>  router.push("/")}>
                                            Continue Shopping
                                        </Btn>
                                    </div>
                                </div>
                                </RevealMotion>
                            ) : (
                                <div className={"px-2 flex flex-col gap-3 m-auto max-w-screen-2xl sm:gap-4 lg:px-8"}>
                                    <div className={"z-20 bg-white opacity-95 mx-auto max-w-96 h-72 rounded-2xl px-3 pt-3 flex flex-col items-center justify-evenly dark:text-white dark:bg-slate-800"}>
                                        <div className={"text-4xl md:text-4xl font-semibold flex justify-center text-center"}>
                                            Your cart total is {convertCentsToUSD(itemsPrice)}
                                        </div>
                                        <div className={"text-center text-sm"}>
                                            Taxes and shipping will be calculated at checkout
                                        </div>
                                        <Btn onClick={checkoutHandler}>
                                            Proceed To Checkout
                                        </Btn>
                                    </div>
                                    <div className={"z-20 opacity-70 bg-[#7c3cfc] mx-auto w-full h-20 rounded-2xl flex justify-center items-center text-white"}>
                                        {
                                            itemsPrice > 10000 ? (
                                                <div className={"text-center flex items-center gap-2"}>
                                                    Your order qualifies for FREE shipping!
                                                    <LuPartyPopper size={30}/>
                                                </div>
                                            ) : (
                                                <div className={"text-center"}>
                                                    <span>Add <span className={"font-bold"}>{convertCentsToUSD(10000 - itemsPrice)}</span> to your order to qualify for FREE shipping.</span>
                                                </div>
                                            )
                                        }
                                    </div>
                                    <div
                                        className={"z-20 bg-white opacity-95 rounded-2xl overflow-y py-8 px-4 sm:px-8 dark:bg-slate-800"}>
                                        {
                                            cartItems.map(function (item) {
                                                return (
                                                    <CartItem item={item} key={item.id}/>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        }
                    </RevealMotion>
                )
            }
            <GuestModal/>
        </>
    )
};

export default CartPage;