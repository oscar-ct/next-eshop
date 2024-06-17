"use client";

import {useRouter} from "next/navigation";
import {useContext, useState} from "react";
import GlobalContext from "@/context/GlobalContext";
import Message from "@/components/Message";
import Link from "next/link";
import {FaChevronDown, FaChevronUp, FaRegCopy} from "react-icons/fa";
import AccountOrdersItemProduct from "@/components/AccountOrdersItemProduct";
import {convertCentsToUSD} from "@/utils/covertCentsToUSD";
import RevealMotion from "@/components/RevealMotion";


const AccountOrdersItem = ({order, index}) => {

    const router = useRouter();
    const { dispatch } = useContext(GlobalContext);

    const [sliceLength, setSliceLength] = useState(2);
    const [maskEnabled, setMaskEnabled] = useState(true);
    const [copyMessage, setCopyMessage] = useState("copy to clipboard");

    const cancelOrderItemHandler = async (productId) => {
        const data = {orderId: order._id, canceledItems: order.canceledItems, orderItemsLength: order.orderItems.length, isCanceled: order.isCanceled, productId: productId};
        // router.push(`/account/orders?id=${order._id}&product=${productId}`, {scroll: false})
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


    return (
        <RevealMotion y={-50}>
            <div className={`mb-5 sm:mb-0 px-3 sm:px-8 lg:px-14 xl:px-24 ${index !== 0 && "pt-16"}`}>
                <div className={"md:shadow-lg bg-white w-full flex flex-col"}>
                    <div className={"p-6 flex flex-row bg-zinc-700"}>
                        <div className={"w-full flex justify-between"}>
                            <div className={"flex text-white"}>
                                <div className={"flex flex-col lg:pr-3"}>
                                    <span className={"text-xs font-bold"}>ORDER PLACED</span>
                                    <span className={"text-sm"}>{order.createdAt.substring(0, 10)}</span>
                                </div>
                                <div className={"flex flex-col pl-3 lg:pr-3"}>
                                    <span className={"text-xs font-bold"}>TOTAL</span>
                                    <span className={"text-sm"}>{convertCentsToUSD(order.totalPrice)}</span>
                                </div>
                                <div className={"flex flex-col pl-3 lg:pr-3"}>
                                    <span className={"text-xs font-bold text-center sm:text-start"}>SHIP TO</span>
                                    <div className="tooltip tooltip-bottom"
                                         data-tip={`${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}`}>
                                        <span className={"cursor-default text-info text-sm"}>{order.user.name}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={"flex flex-col pl-3 lg:pr-3 text-white"}>
                                <span className={"hidden md:flex text-xs font-bold text-end"}>ORDER # {order._id}</span>
                                <Link href={`/orders/${order._id}`} className={"text-end link link-info text-sm"}>
                                    View order details
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className={"border"}>
                        {
                            !order.isPaid && (!order.isCanceled || order.orderItems.length !== order.canceledItems.length) && (
                                <div className={"pt-3 px-10"}>
                                    <div className={"w-full"}>
                                        <Message variant={"warning"}>
                                            Awaiting payment, please
                                            <Link
                                                href={`/orders/${order._id}`}
                                                className={"pl-1 link link-primary"}
                                            >
                                                pay now.
                                            </Link>
                                        </Message>
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
                                        key={product.productId}>
                                        <div className={"w-full lg:w-8/12 flex flex-col"}>
                                            {
                                                order.isPaid && order.isShipped && order.isDelivered && !order.isCanceled ? (
                                                    <div className={"py-5 px-5"}>
                                                        <span
                                                            className={"text-2xl text-green-500 font-bold"}>Delivered</span>
                                                    </div>
                                                ) : order.canceledItems.some(e => e.productId === product.productId) || order.isCanceled ? (
                                                    <div className={"py-5 px-5"}>
                                                        <span className={"text-red-500 text-2xl font-bold"}>Canceled</span>
                                                    </div>
                                                ) : order.isPaid && !order.isShipped && !order.canceledItems.some(e => e.productId === product.productId) && !order.isCanceled ? (
                                                    <div className={"py-5 px-5"}>
                                                        <span className={"text-2xl font-bold"}>Processing</span>
                                                    </div>
                                                ) : order.isPaid && order.isShipped && !order.isCanceled ? (
                                                    <div className={"py-5 px-5"}>
                                                        <span className={"text-2xl font-bold"}>On the way</span>
                                                    </div>
                                                ) : (
                                                    <div className={"py-5 px-5"}>
                                                        <span className={"text-2xl font-bold"}>Awaiting Payment</span>
                                                    </div>
                                                )
                                            }
                                            <AccountOrdersItemProduct product={product} orderSize={order.orderItems.length} index={index}/>
                                        </div>

                                        <div
                                            className={`px-4 w-full lg:w-4/12 flex items-start py-5 ${index + 1 !== order.orderItems.length && "border-b-[1px] border-gray-300 mr-4"}`}>
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
                                                    !order.isShipped && !order.isDelivered && !order.isCanceled && !order.canceledItems.some(e => e.productId === product.productId) && (
                                                        <div className={"py-2 px-1 w-full"}>
                                                            <button onClick={() => cancelOrderItemHandler(product.productId)}
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
            </div>
        </RevealMotion>
    );
};

export default AccountOrdersItem;