"use client";

import {FaTrash} from "react-icons/fa";
import FormatPrice from "./FormatPrice";
import QuantitySelect from "./QuantitySelect";
import Link from "next/link";
import {useContext} from "react";
import GlobalContext from "@/context/GlobalContext";
import Image from 'next/image';
import {convertCentsToUSD} from "@/utils/covertCentsToUSD";

const CheckoutItem = ({ item, saveButtonDisabled }) => {

    const { dispatch } = useContext(GlobalContext);

    const removeFromCartHandler = async (product) => {
        dispatch({
            type: "REMOVE_FROM_CART",
            payload: product,
        });
        dispatch({type: "UPDATE_CART"});
        dispatch({type: "SET_LOCAL_STORAGE"});
    };

    return (
        <>
            <div className={"flex w-full mt-5"}>
                <div className={"w-2/12"}>
                    <Link className={"bg-zinc-100/70 rounded-md w-full h-full flex justify-center items-center"} href={`/products/${item.id}`}>
                        <Image
                            priority
                            src={item.images.length !== 0 ? item.images[0].url : ""}
                            alt={"checkoutItem"}
                            width={0}
                            height={0}
                            className={"rounded-md w-full h-auto"}
                            sizes="100vw"
                        />
                    </Link>
                </div>
                <div className={"w-9/12 flex flex-col px-3 sm:px-5"}>
                    <Link href={`/products/${item.id}`} className={"sm:text-lg font-bold hover:link hover:link-primary"}>
                        {item.name}
                    </Link>
                    <div className={"flex w-full"}>
                        <div className={"flex flex-col w-6/12"}>
                            <div>
                                <span className={"text-gray-500 font-bold text-xs"}>Brand:</span>
                                <span className={"ml-1 text-sm"}>{item.brand}</span>
                            </div>
                            <div>
                                <span className={"text-gray-500 font-bold text-xs"}>Remaining In Stock:</span>
                                <span className={"ml-1 text-sm"}>{item.countInStock}</span>
                            </div>
                            <div>
                                <span className={"text-gray-500 font-bold text-xs"}>Price:</span>
                                <span className={"ml-1 text-sm"}>{convertCentsToUSD(item.price)}/ea.</span>
                            </div>
                        </div>
                        <div className={"w-6/12 flex justify-center items-end"}>
                            {
                                !saveButtonDisabled && (
                                    <QuantitySelect quantity={item.quantity} products={item.countInStock} item={item}/>
                                )
                            }

                        </div>
                    </div>
                </div>
                <div className={"w-1/12 flex flex-col items-end justify-between"}>
                    <FormatPrice price={convertCentsToUSD(item.price * item.quantity).toString()} fontSize={"text-xl"}/>
                    <div>
                        {
                            !saveButtonDisabled && (
                                <button
                                    onClick={() => removeFromCartHandler(item.id)}
                                    className={"btn-glass btn-xs rounded-full"}
                                >
                                    <FaTrash className={"text-red-500 text-md"}/>
                                </button>
                            )
                        }
                    </div>
                </div>
            </div>
            <div className={"mt-5 border-b-[1px] border-gray-300"}/>
        </>

    );
};

export default CheckoutItem;