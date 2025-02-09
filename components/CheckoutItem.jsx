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
                <div className={"w-3/12 flex justify-center items-center"}>
                    <Link className={"bg-zinc-100/70 rounded-md max-w-[175px] max-h-[160px]"} href={`/products/${item.id}`}>
                        <Image
                            priority
                            src={item.images.length !== 0 ? item.images[0].url : ""}
                            alt={"item"}
                            width={100}
                            height={100}
                            className={"rounded-md w-full h-auto"}
                        />
                    </Link>
                </div>
                <div className={"w-6/12 sm:w-7/12"}>
                    <div className={"flex flex-col pl-4 pr-0 sm:pr-5 sm:pl-5"}>
                        <Link href={`/products/${item.id}`}
                              className={"sm:text-lg font-bold hover:link hover:link-primary dark:text-white"}>
                            {item.name}
                        </Link>
                        <div className={"flex flex-col lg:pt-3"}>
                            <div className={"flex flex-col text-xs sm:text-sm"}>
                                <div className={"pb-1"}>
                                    <span className={"text-gray-500 font-bold text-xs"}>Brand:</span>
                                    <span className={"ml-1 text-sm dark:text-white"}>{item.brand}</span>
                                </div>
                                <div className={"pb-1"}>
                                    <span className={"text-gray-500 font-bold text-xs"}>Remaining In Stock:</span>
                                    <span className={"ml-1 text-sm dark:text-white"}>{item.countInStock}</span>
                                </div>
                                <div>
                                    <span className={"text-gray-500 font-bold text-xs"}>List Price:</span>
                                    <span
                                        className={"ml-1 text-sm dark:text-white"}>{convertCentsToUSD(item.price)}/ea.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"w-3/12 sm:w-2/12 flex flex-col items-end justify-between"}>
                    <FormatPrice price={convertCentsToUSD(item.price * item.quantity).toString()} fontSize={"text-xl"}/>
                    {
                        !saveButtonDisabled && (
                            <QuantitySelect quantity={item.quantity} products={item.countInStock} item={item}/>
                        )
                    }
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
            <div className={"mt-5 border-b border-gray-300"}/>
        </>

    );
};

export default CheckoutItem;