"use client";

import React, {useContext, useEffect, useState} from 'react';
import GlobalContext from "@/context/GlobalContext";
import BackButton from "@/components/BackButton";
import Message from "@/components/Message";
import Link from "next/link";
import CustomBtn from "@/components/CustomBtn";
import CartItem from "@/components/CartItem";

const CartPage = () => {

    const { cartItems, totalPrice } = useContext(GlobalContext);

    const totalNumberOfItems = cartItems.reduce((acc, item) => {
        return acc + item.quantity
    }, 0);

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true)
    }, []);

    const checkoutHandler = () => {

    };


    if (mounted && cartItems.length === 0) {
        return (
            <>
                <BackButton/>
                <div className={"px-2"}>
                    <div className={"pt-16 md:pt-20 px-2"}>
                        <div className={"text-4xl pb-10 flex justify-center"}>
                            Shopping Cart (0)
                        </div>
                        <Message variant={"info"}>
                            You have no items in your cart.  Click <Link href={"/products"} className={"link link-primary"}>here</Link> to continue shopping.
                        </Message>
                    </div>
                </div>
            </>
        )
    }

    if (mounted && cartItems.length !== 0) {
        return (
            <div className={"flex-col flex lg:flex-row w-full md:pl-3 md:pr-3 2xl:container mx-auto"}>
                <div className={"lg:w-full h-min"}>
                    <div className={"px-3 pt-4 flex flex-col items-center"}>
                        <div
                            className={"text-3xl md:text-4xl font-semibold pt-3 md:pt-10 flex justify-center text-center"}>
                            Your cart total is ${totalPrice}
                        </div>
                        <div className={"pt-8 md:pt-10 text-center text-sm"}>
                            Taxes and shipping will be calculated at checkout
                        </div>
                        <div className={"pt-8 md:pt-10"}>
                            <CustomBtn onClick={checkoutHandler}>
                                Proceed To Checkout
                            </CustomBtn>
                        </div>
                    </div>
                    <div className={"pt-8 md:pt-10 px-3 sm:px-0"}>
                        {
                            totalPrice > 100 ? (
                                <div className={"pb-3 w-full"}>
                                    <Message variant={"success"}>
                                        <span className={"text-sm"}>Your order qualifies for FREE shipping!</span>
                                    </Message>
                                </div>
                            ) : (
                                <div className={"pb-3 w-full"}>
                                    <Message variant={"info"}>
                                        <span className={"text-sm"}>Add <span className={"font-bold"}>${(100 - totalPrice).toFixed(2)}</span> to your order to qualify for FREE shipping.</span>
                                    </Message>
                                </div>
                            )
                        }
                    </div>
                    <div>
                        <h1 className={"hidden md:block py-2 text-center text-3xl md:text-2xl ibmplex bg-white md:bg-zinc-700 md:text-white font-semibold"}>
                            Shopping Cart (
                            <span className={"text-2xl md:text-xl md:font-light"}>
                                {totalNumberOfItems}
                                {
                                    totalNumberOfItems === 1 ? (
                                        " Item"
                                    ) : (
                                        " Items"
                                    )
                                }</span>
                            )
                        </h1>
                    </div>
                    <div className={"md:shadow-lg bg-white border pt-10 px-4 sm:px-7 pb-4 sm:pb-7 overflow-y"}>
                        {
                            cartItems.map(function (item) {
                                return (
                                    <CartItem item={item} key={item._id}/>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }


};

export default CartPage;