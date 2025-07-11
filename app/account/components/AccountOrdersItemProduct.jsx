"use client";

import {useContext} from "react";
import GlobalContext from "@/context/GlobalContext";
import toast from "react-hot-toast";
import Link from "next/link";
import Btn from "@/components/Btn";
import Image from "next/image";
import {fetchProduct} from "@/utils/apiFetchRequests";
import {convertCentsToUSD} from "@/utils/covertCentsToUSD";


const AccountOrdersItemProduct = ({product, index, orderSize}) => {

    const {dispatch} = useContext(GlobalContext);
    const quantity = 1;
    const addToCartHandler = async () => {
        const item  = await fetchProduct(product.productId);
        if (item) {
            toast.success("Added To Cart");
            dispatch({
                type: "ADD_TO_CART",
                payload: {...item, quantity},
            });
            dispatch({type:"UPDATE_CART"});
            dispatch({type: "SET_LOCAL_STORAGE"});
        }
    };

    return (
        <>
            <div className={"py-3 px-4"}>
                <div className={"flex flex-col lg:flex-row"}>
                    <div className={"w-full"}>
                        <div className={"flex pb-2"}>
                            <div className="w-3/12">
                                <Link href={`/products/${product.productId}`} className="bg-zinc-100/20 rounded-md w-full h-full flex items-center justify-center dark:bg-slate-600">
                                    <Image
                                        priority
                                        src={product.imageUrl}
                                        alt={"order item"}
                                        width={0}
                                        height={0}
                                        className={"rounded-md w-full h-auto"}
                                        sizes="100vw"
                                    />
                                </Link>
                            </div>
                            <div className={"flex flex-col w-9/12 pl-5"}>
                                <Link href={`/products/${product.productId}`} className={"hover:link hover:link-primary font-bold dark:text-white"}>
                                    {product.name}
                                </Link>
                                <div className={"flex pt-2 dark:text-white"}>
                                    <span className={"text-xs"}>{convertCentsToUSD(product.price)}/ea</span>
                                    <span className={"pl-10 text-xs"}>Qty: {product.quantity}</span>
                                </div>
                                <div className={"pt-4"}>
                                    <Btn customClass={"!text-[14px] !px-6 !py-1"} onClick={addToCartHandler}>
                                        Buy It Again
                                    </Btn>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                index+1 !== orderSize && (
                    <div className={"lg:border-b lg:border-gray-300 mx-4"}/>
                )
            }
        </>
    );
};

export default AccountOrdersItemProduct;