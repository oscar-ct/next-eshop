"use client";

import {useContext, useEffect, useState} from 'react';
import GlobalContext from "@/context/GlobalContext";
import BackButton from "@/components/BackButton";
import Message from "@/components/Message";
import Link from "next/link";
import CustomBtn from "@/components/CustomBtn";
import CartItem from "@/components/CartItem";
import {useRouter} from "next/navigation";
import CheckoutSteps from "@/components/CheckoutSteps";
import {convertCentsToUSD} from "@/utils/covertCentsToUSD";

const CartPage = () => {

    const { user, guestData, cartItems, itemsPrice } = useContext(GlobalContext);
    const router = useRouter();

    const totalNumberOfItems = cartItems.reduce((acc, item) => {
        return acc + item.quantity
    }, 0);

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true)
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
                            You have no items in your cart.  Click <Link href={"/products/sort/latest/select/all/page/1"} className={"link link-primary"}>here</Link> to continue shopping.
                        </Message>
                    </div>
                </div>
            </>
        )
    }

    if (mounted && cartItems.length !== 0) {
        return (
            <>
                <CheckoutSteps/>
                <div className={"flex-col flex lg:flex-row w-full md:pl-3 md:pr-3 2xl:container mx-auto"}>
                    <div className={"lg:w-full h-min"}>
                        <div className={"px-3 pt-4 flex flex-col items-center"}>
                            <div
                                className={"text-3xl md:text-4xl font-semibold pt-3 md:pt-10 flex justify-center text-center"}>
                                Your cart total is {convertCentsToUSD(itemsPrice)}
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
                                itemsPrice > 10000 ? (
                                    <div className={"pb-3 w-full"}>
                                        <Message variant={"success"}>
                                            <span className={"text-sm"}>Your order qualifies for FREE shipping!</span>
                                        </Message>
                                    </div>
                                ) : (
                                    <div className={"pb-3 w-full"}>
                                        <Message variant={"info"}>
                                            <span className={"text-sm"}>Add <span
                                                className={"font-bold"}>{convertCentsToUSD(10000 - itemsPrice)}</span> to your order to qualify for FREE shipping.</span>
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
                                        <CartItem item={item} key={item.id}/>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <dialog id="checkout_modal" className="modal modal-bottom sm:modal-middle">
                    <form method="dialog" className="modal-box bg-white">
                        <div className="p-3">
                            <div className="form-control w-full">
                                <div className={"flex justify-between items-center"}>
                                    <div className="pb-3 font text-lg">
                                        You are currently not logged in, we<span
                                        className={"px-1 font-bold"}>recommend</span>you login prior to placing any
                                        orders. This will allow you to seamlessly view and manage all your orders.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-action w-full flex justify-center">
                            <button
                                onClick={() => router.push("/shipping")}
                                className={"btn btn-neutral rounded-full normal-case"}
                            >
                                Continue As Guest
                            </button>
                            <CustomBtn onClick={() => router.push('/login?redirect=/shipping')} type={"submit"}
                                       customClass={"text-sm font-semibold"}>
                                Login / Sign Up
                            </CustomBtn>
                        </div>
                    </form>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>
            </>
        )
    }


};

export default CartPage;