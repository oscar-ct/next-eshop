"use client";

import {useContext, useEffect, useState} from 'react';
import GlobalContext from "@/context/GlobalContext";
import CustomBtn from "@/components/CustomBtn";
import CartItem from "@/components/CartItem";
import {useRouter} from "next/navigation";
import CheckoutSteps from "@/components/CheckoutSteps";
import {convertCentsToUSD} from "@/utils/covertCentsToUSD";
import {LuPartyPopper} from "react-icons/lu";

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

    if (mounted) {
        return (
            <>
                <CheckoutSteps/>
                {
                    cartItems.length === 0 ? (
                        <div className={"px-2 flex m-auto max-w-screen-2xl sm:pt-10 lg:px-8"}>
                            <div className={"z-20 bg-zinc-50 mx-auto w-96 h-72 rounded-2xl px-3 pt-3 flex flex-col items-center justify-evenly sm:bg-white sm:shadow-lg"}>
                                <div className={"text-4xl md:text-4xl font-semibold flex justify-center text-center"}>
                                    Your cart is empty.
                                </div>
                                <CustomBtn onClick={() =>  router.push("/")}>
                                    Continue Shopping
                                </CustomBtn>
                            </div>
                        </div>
                    ) : (
                        <div className={"px-2 flex flex-col gap-6 m-auto max-w-screen-2xl sm:pt-10 lg:px-8"}>
                            <div className={"z-20 bg-zinc-50 mx-auto w-96 h-72 rounded-2xl px-3 pt-3 flex flex-col items-center justify-evenly sm:bg-white sm:shadow-lg"}>
                                <div className={"text-4xl md:text-4xl font-semibold flex justify-center text-center"}>
                                    Your cart total is {convertCentsToUSD(itemsPrice)}
                                </div>
                                <div className={"text-center text-sm"}>
                                    Taxes and shipping will be calculated at checkout
                                </div>
                                <CustomBtn onClick={checkoutHandler}>
                                    Proceed To Checkout
                                </CustomBtn>
                            </div>
                            <div className={"z-20 bg-opacity-70 bg-zinc-50 sm:bg-opacity-70 mx-auto w-full h-20 rounded-2xl flex justify-center items-center sm:bg-white sm:shadow-lg"}>
                                {
                                    itemsPrice > 10000 ? (
                                        <div className={"text-center flex items-center gap-2"}>
                                            Your order qualifies for FREE shipping!
                                            <LuPartyPopper size={30}/>
                                        </div>
                                    ) : (
                                        <p className={"text-center flex gap-1"}>
                                            Add
                                            <span className={"font-bold"}>
                                                {convertCentsToUSD(10000 - itemsPrice)}
                                            </span>
                                            to your order to qualify for FREE shipping.
                                        </p>
                                    )
                                }
                            </div>
                            <div
                                className={"z-20 bg-zinc-50 border p-8 rounded-2xl overflow-y sm:border-none sm:bg-white sm:shadow-lg"}>
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