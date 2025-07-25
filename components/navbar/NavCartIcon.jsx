"use client";

import Link from "next/link";
import {useContext, useEffect, useState} from "react";
import Btn from "../Btn";
import {useRouter} from "next/navigation";
import {convertCentsToUSD} from "@/utils/covertCentsToUSD";
import {GrCart} from "react-icons/gr";
import GlobalContext from "@/context/GlobalContext";


const NavCartIcon = () => {

    const { cartItems, itemsPrice, shippingAddress, paymentMethod } = useContext(GlobalContext);

    const totalCartItems = cartItems.reduce((acc, item) => {
        return acc + item.quantity
    }, 0);

    const [cartDropdownActive, setCartDropdownActive] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {{
        if (!isMounted) {
            setIsMounted(true);
        }
    }}, [isMounted]);

    if (!isMounted) return (
        <Link href={"/cart"} className="pr-2.5 w-full h-12 flex items-center md:h-16">
            <div className="indicator dark:text-white">
                <div className="badge text-white bg-violet-600 badge-sm indicator-item border-none">
                    <span className="loading loading-bars w-2"/>
                </div>
                <GrCart size={24}/>
            </div>
        </Link>
    );
    if (isMounted) return (
        <>
            <Link href={"/cart"} className={"pr-2.5 w-full h-12 flex items-center md:hidden"}>
                <div className="indicator dark:text-white">
                    {
                        totalCartItems !== 0 && (
                            <div className="badge text-white bg-violet-600 badge-sm indicator-item border-none">
                                {totalCartItems}
                            </div>
                        )
                    }
                    <GrCart size={24}/>
                </div>
            </Link>
            <div
                onMouseEnter={() => setCartDropdownActive(true)}
                onMouseLeave={() => setCartDropdownActive(false)}
                className={"hidden relative h-16 md:block"}
            >
                <Link href={"/cart"} className="pr-2.5 w-full h-16 flex items-center">
                    <div className="indicator dark:text-white">
                        {
                            totalCartItems !== 0 && (
                                <div className="badge text-white bg-violet-600 badge-sm indicator-item border-none">
                                    {totalCartItems}
                                </div>
                            )
                        }
                        <GrCart size={24}/>
                    </div>
                </Link>
                {
                    cartDropdownActive && (
                        <div className="z-10 absolute right-0 origin-top-right w-52 bg-slate-800/70 shadow rounded-b-md dark:bg-slate-600/70">
                            <div className="p-5 font-bold text-white">
                                {
                                    totalCartItems !== 0 ? (
                                        <>
                                            <div className="text-xl">({totalCartItems}) {totalCartItems > 1 ? "Items" : "Item"}</div>
                                            <div className="text-info py-3">
                                                Subtotal:<span className={"pl-2 text-white"}>{convertCentsToUSD(itemsPrice)}</span>
                                            </div>
                                            <Btn customClass={"w-full"} onClick={() => router.push(Object.keys(shippingAddress).length !== 0 && paymentMethod !== null ? "/checkout" : "/cart")}>
                                                {Object.keys(shippingAddress).length !== 0 && paymentMethod !== null ? "Checkout" : "View Cart"}
                                            </Btn>
                                        </>
                                    ) : (
                                        <div className={"text-center text-xl"}>Your cart is empty...</div>
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

export default NavCartIcon;