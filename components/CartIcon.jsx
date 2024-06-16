"use client"

import Link from "next/link";
import {useState} from "react";
import CustomBtn from "./CustomBtn";
import {useRouter} from "next/navigation";
import {convertCentsToUSD} from "@/utils/covertCentsToUSD";


const CartIcon = ({ isValidShippingAddress, isValidPaymentMethod, totalCartItems, subtotalPrice, onClick, windowInnerWidth }) => {

    const [cartDropdownActive, setCartDropdownActive] = useState(false);
    const router = useRouter();

    return (
        <>
            {
                windowInnerWidth <= 768 ? (
                    <Link onClick={onClick} href={"/cart"} className="px-2 h-[3rem] flex items-center">
                        <div className="indicator">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            {
                                totalCartItems !== 0 && (
                                    <span className="badge text-white bg-violet-600 badge-sm indicator-item border-none">{totalCartItems}</span>
                                )
                            }
                        </div>
                    </Link>
                ) : (
                    <div
                        onMouseEnter={() => setCartDropdownActive(true)}
                        onMouseLeave={() => setCartDropdownActive(false)}
                        className="dropdown dropdown-end py-2.5"
                    >
                        <Link href={"/cart"} className="pl-4 pr-2 h-[3rem] flex items-center">
                            <div className="indicator">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                {
                                    totalCartItems !== 0 && (
                                        <span className="badge text-white bg-violet-600 badge-sm indicator-item border-none">{totalCartItems}</span>
                                    )
                                }

                            </div>
                            <span className={"hidden lg:block normal-case pl-1 text-sm"}>Cart</span>
                        </Link>
                        {
                            cartDropdownActive && (
                                <div className="mt-2.5 z-10 absolute right-0 origin-top-right w-52 bg-neutral/70 shadow rounded-b-md">
                                    <div className="p-5">
                                        {
                                            totalCartItems !== 0 ? (
                                                <>
                                                    <span className="font-bold text-white text-xl">({totalCartItems}) {totalCartItems > 1 ? "Items" : "Item"}</span>
                                                    <div className="font-bold text-info py-3">
                                                        Subtotal:<span className={"pl-2 text-white"}>{convertCentsToUSD(subtotalPrice)}</span>
                                                    </div>
                                                    <CustomBtn customClass={"w-full"} onClick={() => router.push(isValidShippingAddress && isValidPaymentMethod ? "/checkout" : "/cart")}>
                                                        {isValidShippingAddress && isValidPaymentMethod ? "Checkout" : "View Cart"}
                                                    </CustomBtn>
                                                </>
                                            ) : (
                                                <span className={"font-bold text-white text-center text-xl"}>Your cart is empty...</span>
                                            )
                                        }
                                    </div>
                                </div>
                            )
                        }
                    </div>
                )
            }
        </>
    );
};

export default CartIcon;