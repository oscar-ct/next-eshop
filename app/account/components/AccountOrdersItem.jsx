"use client";

import {useRouter} from "next/navigation";
import {useContext, useState} from "react";
import GlobalContext from "@/context/GlobalContext";
import AlertMessage from "@/components/AlertMessage";
import Link from "next/link";
import {FaChevronDown, FaChevronUp, FaRegCopy} from "react-icons/fa";
import AccountOrdersItemProduct from "@/app/account/components/AccountOrdersItemProduct";
import {convertCentsToUSD} from "@/utils/covertCentsToUSD";
import RevealMotion from "@/components/RevealMotion";


const AccountOrdersItem = ({order}) => {

    const router = useRouter();
    const { dispatch } = useContext(GlobalContext);

    const [sliceLength, setSliceLength] = useState(2);
    const [maskEnabled, setMaskEnabled] = useState(true);
    const [copyMessage, setCopyMessage] = useState("copy to clipboard");

    const cancelOrderItemHandler = async (productId) => {
        const data = {orderId: order.id, productId: productId};
        dispatch({type: "UPDATE_CANCEL_INTENT_DATA", payload: data});
        // dispatch({type: "SET_LOCAL_STORAGE"});
        window.confirm_modal.showModal();
    };
    const copyToClipboard = async () => {
        setCopyMessage("copied!");
        await navigator.clipboard.writeText(order.trackingNumber);
        setTimeout(function () {
            setCopyMessage("copy to clipboard");
        }, 1500);
    };
    const onClickShowMore = () => {
        setSliceLength(order.orderItems.length);
        setMaskEnabled(false);
    };
    const onClickShowLess = () => {
        setSliceLength(2);
        setMaskEnabled(true);
    };

    const canceledItems = order.orderItems.filter((item) => {
        return item.isCanceled
    });


    return (
        <RevealMotion y={-50} parentClass={"z-30"}>
            <div className={"z-30 flex flex-col rounded-2xl max-w-5xl sm:shadow-lg"}>
                <div className={"z-30 px-4 py-6 sm:px-6 flex flex-row bg-slate-600 rounded-tr-2xl rounded-tl-2xl"}>
                    <div className={"w-full flex justify-between gap-2 sm:gap-4"}>
                        <div className={"flex text-white gap-2 sm:gap-8"}>
                            <div className={"flex flex-col"}>
                                <span className={"text-xs font-bold"}>ORDER PLACED</span>
                                <span className={"text-xs sm:text-sm"}>{order.createdAt.substring(0, 10)}</span>
                            </div>
                            <div className={"flex flex-col"}>
                                <span className={"text-xs font-bold"}>TOTAL</span>
                                <span className={"text-xs sm:text-sm"}>{convertCentsToUSD(order.totalPrice)}</span>
                            </div>
                            <div className={"flex flex-col"}>
                                <span className={"text-xs font-bold text-center sm:text-start"}>SHIP TO</span>
                                <div className="tooltip tooltip-top"
                                     data-tip={`${order.address}, ${order.city}, ${order.state} ${order.postalCode}`}>
                                    <span className={"cursor-default text-info text-xs sm:text-sm"}>{order.name}</span>
                                </div>
                            </div>
                        </div>
                        <div className={"flex flex-col text-white"}>
                            <span className={"hidden md:flex text-xs font-bold text-end"}>ORDER # {order.id}</span>
                            <Link href={`/orders/${order.id}`} className={"text-end link link-info text-xs sm:text-sm"}>
                                View order details
                            </Link>
                        </div>
                    </div>
                </div>
                <div className={"z-30 border bg-zinc-50 rounded-br-2xl rounded-bl-2xl sm:bg-white sm:border-none dark:border-none dark:bg-slate-600"}>
                    {
                        !order.isPaid && (!order.isCanceled || order.orderItems.length !== canceledItems.length) && (
                            <div className={"pt-3 px-10"}>
                                <div className={"w-full"}>
                                    <AlertMessage variant={"warning"}>
                                        Awaiting payment, please
                                        <Link
                                            href={`/orders/${order._id}`}
                                            className={"pl-1 link link-primary"}
                                        >
                                            pay now.
                                        </Link>
                                    </AlertMessage>
                                </div>
                            </div>
                        )
                    }
                    {
                        order.orderItems.slice(0, sliceLength).map(function (product, index) {
                            return (
                                // <AccountOrderItemParent order={order} product={product} key={product.id} index={index}/>

                                <div
                                    className={`flex flex-col lg:flex-row ${order.orderItems.length > 2 && index + 1 === 2 && maskEnabled ? "mask1" : ""}`}
                                    key={product.id}>
                                    <div className={"w-full lg:w-8/12 flex flex-col"}>
                                        {
                                            order.isPaid && order.isShipped && order.isDelivered && !order.isCanceled ? (
                                                <div className={"py-5 px-5"}>
                                                    <span className={"text-2xl text-green-500 font-bold"}>Delivered</span>
                                                </div>
                                            ) : canceledItems.some(e => e.id === product.id) || order.isCanceled ? (
                                                <div className={"py-5 px-5"}>
                                                    <span className={"text-red-500 text-2xl font-bold"}>Canceled</span>
                                                </div>
                                            ) : order.isPaid && !order.isShipped && !canceledItems.some(e => e.id === product.id) && !order.isCanceled ? (
                                                <div className={"py-5 px-5"}>
                                                    <span className={"text-2xl font-bold dark:text-white"}>Processing</span>
                                                </div>
                                            ) : order.isPaid && order.isShipped && !order.isCanceled ? (
                                                <div className={"py-5 px-5"}>
                                                    <span className={"text-2xl font-bold dark:text-white"}>On the way</span>
                                                </div>
                                            ) : (
                                                <div className={"py-5 px-5"}>
                                                    <span className={"text-2xl font-bold dark:text-white"}>Awaiting Payment</span>
                                                </div>
                                            )
                                        }
                                        <AccountOrdersItemProduct product={product} orderSize={order.orderItems.length} index={index}/>
                                    </div>
                                    <div
                                        className={`px-4 w-full lg:w-4/12 flex items-start py-5 ${index + 1 !== order.orderItems.length && "border-b border-gray-300 mr-4"}`}>
                                        <div className={"w-full flex flex-col md:flex-row lg:flex-col"}>
                                            {
                                                order.trackingNumber && order.isShipped && (
                                                    <div className={"py-2 px-1 w-full"}>
                                                        <div className={`w-full tooltip tooltip-top`}
                                                             data-tip={copyMessage}>
                                                            <button
                                                                onClick={copyToClipboard}
                                                                className={"btn h-fit normal-case text-xs btn-sm w-full rounded-full"}
                                                            >
                                                                <FaRegCopy/>
                                                                Tracking Number
                                                            </button>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            {
                                                order.isDelivered && (
                                                    <div className={"py-2 px-1 w-full"}>
                                                        <button
                                                            onClick={() => router.push(`/products/${product.productId}?review=true`)}
                                                            className={"btn normal-case text-xs btn-sm w-full rounded-full"}
                                                        >
                                                            Write a product review
                                                        </button>
                                                    </div>
                                                )
                                            }
                                            {
                                                !order.isShipped && !order.isDelivered && !order.isCanceled && !canceledItems.some(e => e.id === product.id) && (
                                                    <div className={"py-2 px-1 w-full"}>
                                                        <button onClick={() => cancelOrderItemHandler(product.id)}
                                                                className={"btn normal-case text-xs btn-sm w-full rounded-full"}>
                                                            Cancel Item
                                                        </button>
                                                    </div>
                                                )
                                            }

                                            {/*Todo*/}
                                            {/*<div className={"py-2 w-full"}>*/}
                                            {/*    <button disabled={!order.isDelivered} className={"btn normal-case text-xs btn-sm w-full"}>*/}
                                            {/*        Return or replace*/}
                                            {/*    </button>*/}
                                            {/*</div>*/}

                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            {
                order.orderItems.length > 2 && maskEnabled && (
                    <div className={"pt-4 flex justify-center"}>
                        <button className={"rounded-full w-56 btn btn-neutral bg-zinc-700 flex h-9 min-h-9"} onClick={onClickShowMore}>
                            Show more
                            <span className={"pl-2"}><FaChevronDown/></span>
                        </button>
                    </div>
                )

            }
            {
                !maskEnabled && (
                    <div className={"pt-4 flex justify-center"}>
                        <button className={"rounded-full w-56 btn btn-neutral bg-zinc-700 flex h-9 min-h-9"} onClick={(onClickShowLess)}>
                            Show less
                            <span className={"pl-2"}><FaChevronUp/></span>
                        </button>
                    </div>
                )
            }
        </RevealMotion>
    );
};

export default AccountOrdersItem;