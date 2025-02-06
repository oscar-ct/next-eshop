"use client"

import Link from "next/link";
import {useState} from "react";
import CustomBtn from "./CustomBtn";
import {useRouter} from "next/navigation";
import {convertCentsToUSD} from "@/utils/covertCentsToUSD";
import {GrCart} from "react-icons/gr";


const CartIcon = ({ isValidShippingAddress, isValidPaymentMethod, totalCartItems, subtotalPrice }) => {

    const [cartDropdownActive, setCartDropdownActive] = useState(false);
    const router = useRouter();

    return (
        <>
            <Link href={"/cart"} className={"px-2 h-12 flex items-center md:hidden"}>
                <div className="indicator">
                    <GrCart size={25}/>
                    {
                        totalCartItems !== 0 && (
                            <span className="badge text-white bg-violet-600 badge-sm indicator-item border-none">{totalCartItems}</span>
                        )
                    }
                </div>
            </Link>

            <div
                onMouseEnter={() => setCartDropdownActive(true)}
                onMouseLeave={() => setCartDropdownActive(false)}
                className={"hidden relative h-16 md:block"}
            >
                <Link href={"/cart"} className="h-16 flex items-center">
                    <div className="indicator">
                        <GrCart size={25}/>
                        {
                            totalCartItems !== 0 && (
                                <span className="badge text-white bg-violet-600 badge-sm indicator-item border-none">{totalCartItems}</span>
                            )
                        }
                    </div>
                </Link>
                {
                    cartDropdownActive && (
                        <div className="z-10 absolute right-0 origin-top-right w-52 bg-slate-800/70 shadow rounded-b-md">
                            <div className="p-5 font-bold text-white">
                                {
                                    totalCartItems !== 0 ? (
                                        <>
                                            <span className="text-xl">({totalCartItems}) {totalCartItems > 1 ? "Items" : "Item"}</span>
                                            <div className="text-info py-3">
                                                Subtotal:<span className={"pl-2 text-white"}>{convertCentsToUSD(subtotalPrice)}</span>
                                            </div>
                                            <CustomBtn customClass={"w-full"} onClick={() => router.push(isValidShippingAddress && isValidPaymentMethod ? "/checkout" : "/cart")}>
                                                {isValidShippingAddress && isValidPaymentMethod ? "Checkout" : "View Cart"}
                                            </CustomBtn>
                                        </>
                                    ) : (
                                        <span className={"text-center text-xl"}>Your cart is empty...</span>
                                    )
                                }
                            </div>
                        </div>
                    )
                }
            </div>
        </>
    );
};

export default CartIcon;