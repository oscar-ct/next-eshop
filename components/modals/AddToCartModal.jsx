"use client";

import Image from "next/image";
import {useContext, useEffect, useState} from "react";
import GlobalContext from "@/context/GlobalContext";
import Btn from "@/components/Btn";
import {FaCheck} from "react-icons/fa";
import {useRouter} from "next/navigation";

const AddToCartModal = () => {

    const router = useRouter();
    const {cartItems, addToCartId} = useContext(GlobalContext);
    const lastCartItem = cartItems?.find((item) => {
        if (addToCartId === item.id) return item;
    });
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (mounted) return (
        <dialog id="add_to_cart_modal" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box bg-white dark:bg-slate-800">
                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 dark:text-white">✕</button>
                </form>
                <div className={"flex items-center pb-3 border-b"}>
                    <h3 className="font-bold text-lg dark:text-white">Item has been added to your cart </h3>
                    <div className={"ml-2 bg-green-500 rounded-full h-5 w-5 flex items-center justify-center"}>
                        <FaCheck className={"text-white w-2.5"}/>
                    </div>
                </div>

                <div className={"py-6 flex justify-center gap-3"}>
                    {
                        cartItems.length !== 0 && (
                            <Image
                                className={"w-20 h-20 object-scale-down"}
                                width={100}
                                height={100}
                                src={lastCartItem?.images[0].url}
                                alt={"cart item"}
                            />
                        )
                    }
                    <div className={"flex flex-col gap-3"}>
                        <span className={"dark:text-white"}>{lastCartItem?.name}</span>
                    </div>
                </div>
                <div className={"flex flex-col sm:flex-row sm:justify-between gap-3"}>
                    <Btn onClick={() => window.add_to_cart_modal.close()} customClass={"!bg-neutral text-sm"}>
                        Continue Shopping
                    </Btn>
                    <Btn onClick={() => {
                        window.add_to_cart_modal.close()
                        router.push("/cart")
                    }}
                         customClass={"text-sm"}>
                        View My Cart
                    </Btn>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    );
};

export default AddToCartModal;