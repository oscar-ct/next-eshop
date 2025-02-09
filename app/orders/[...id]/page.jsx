"use client";

import React, {useContext, useEffect, useState} from 'react';
import {useParams, useRouter, useSearchParams} from "next/navigation";
import GlobalContext from "@/context/GlobalContext";
import Message from "@/components/Message";
import OrderItem from "@/components/OrderItem";
import StripeCheckout from "@/components/StripeCheckout";
import ConfirmModal from "@/components/modals/ConfirmModal";
import Loading from "@/app/loading";
import {toast} from "react-hot-toast";
import {fetchCancelOrder, fetchOrder} from "@/utils/api-requests/fetchRequests";
import NotFound from "@/app/not-found";
import {PayPalScriptProvider} from "@paypal/react-paypal-js";
import PaypalCheckout from "@/components/PaypalCheckout";
import {convertCentsToUSD} from "@/utils/covertCentsToUSD";
import {IoInformationCircleOutline} from "react-icons/io5";
import {FcDeleteDatabase} from "react-icons/fc";


const OrderPage = () => {
    const searchParams = useSearchParams();
    const { id: orderId } = useParams();

    const router = useRouter();
    const { dispatch } = useContext(GlobalContext);

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const TAX_PERCENTAGE = 0.0825;

    const totalNumberOfItems = order?.orderItems.reduce(function (acc, product) {
        return (acc + product.quantity);
    }, 0);
    const canceledItems = order?.orderItems.filter((item) => {
        return item.isCanceled;
    });
    // const notCanceledItems = order?.orderItems.filter((item) => {
    //     return !item.isCanceled;
    // });
    const totalNumberOfCanceledItems = canceledItems?.reduce(function (acc, item) {
        return (acc + item.quantity);
    }, 0);
    // const totalNumberOfNotCanceledItems = notCanceledItems?.reduce(function (acc, item) {
    //     return (acc + item.quantity);
    // }, 0);
    const canceledItemsThatRequireRefund = canceledItems?.filter(function (item) {
        return item.canceledAt > order.paidAt;
    });
    const totalNumberOfCanceledItemsThatRequireRefund = canceledItemsThatRequireRefund?.length > 0 ? canceledItemsThatRequireRefund.reduce(function (acc, item) {
        return (acc + item.quantity);
    }, 0) : 0;

    const totalDollarAmountOfCanceledItemsThatRequireRefund = canceledItemsThatRequireRefund?.length > 0 ? canceledItemsThatRequireRefund.reduce(function (acc, item) {
        return (acc + item.price * item.quantity);
    }, 0) : 0;

    const totalDollarAmountOfShippingRefund = canceledItemsThatRequireRefund?.length > 0 && (order?.freeShipping || totalDollarAmountOfCanceledItemsThatRequireRefund > 10000) ? 0 : 1000;

    const totalTaxDollarAmountThatRequiresRefund = order?.isCanceled ? Math.round( TAX_PERCENTAGE * (totalDollarAmountOfCanceledItemsThatRequireRefund + totalDollarAmountOfShippingRefund)) : Math.round( TAX_PERCENTAGE * totalDollarAmountOfCanceledItemsThatRequireRefund);

    const subtotalDollarAmountThatRequiresRefund = order?.isCanceled ? totalDollarAmountOfCanceledItemsThatRequireRefund + order?.shippingPrice + totalTaxDollarAmountThatRequiresRefund : totalDollarAmountOfCanceledItemsThatRequireRefund + totalTaxDollarAmountThatRequiresRefund;

    const orderItemsPaidAndNotCanceled = order?.orderItems.filter((item) => !item.isCanceled && item.isPaid);

    const totalDollarAmountOfOrderItemsPaidAndNotCanceled = orderItemsPaidAndNotCanceled?.reduce((acc, item) => {
        return (acc + item.price * item.quantity);
    }, 0);
    const totalDollarAmountOfFees =
        totalNumberOfCanceledItems > 0 && !order?.freeShipping && totalDollarAmountOfOrderItemsPaidAndNotCanceled >= 10000 ? 0 : order?.freeShipping || order?.isCanceled || order?.shippingPrice === 1000 ? 0 : 1000;


    useEffect(() => {
        if (searchParams.get("stripe") || searchParams.get("paypal")) {
            dispatch({type: "CLEAR_CART"});
            dispatch({type: "SET_LOCAL_STORAGE"});
            router.push(`/orders/${orderId[0]}`);
        }
    }, [dispatch, searchParams, orderId, router]);


    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const order = await fetchOrder(orderId[0]);
                setOrder(order);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };
        if (order === null && !searchParams.get("stripe") && !searchParams.get("paypal")) {
            fetchOrderData();
        }
    }, [order, searchParams]);

    const submitCancel = async () => {
        const updatedOrder = await fetchCancelOrder(orderId[0]);
        if (updatedOrder) {
            setOrder(updatedOrder);
            return;
        }
        toast.error("Please try again later");
    };

    const initialOptions = {
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        currency: "USD",
        intent: "capture",
        enableFunding: "venmo",
    };


    if (!loading && order) {
        return  (
            <>
                <div className={"p-5 lg:pt-10 lg:pb-5 dark:text-white"}>
                    {
                        order.isPaid && !order.isShipped && !order.isDelivered && !order.isCanceled && totalNumberOfCanceledItems !== totalNumberOfItems ? (
                            <h1 className={"text-4xl font-bold"}>
                                Payment successful! Order is now being processed. You can come back to this page to view future order updates.
                            </h1>
                        ) : order.isPaid && order.isShipped && !order.isDelivered ? (
                            <h1 className={"text-4xl font-bold"}>
                                Your order is on the way.
                            </h1>
                        ) : order.isPaid && order.isShipped && order.isDelivered ? (
                            <h1 className={"text-4xl font-bold "}>
                                Your order has been delivered, thank you!
                            </h1>
                        ) : (order.isCanceled || totalNumberOfCanceledItems === totalNumberOfItems) && order.isPaid && !order.isShipped && !order.isDelivered && !order.isReimbursed ? (
                            <h1 className={"text-4xl font-bold"}>
                                Your order has been canceled and your refund process has begun.
                            </h1>
                        ) : (order.isCanceled || totalNumberOfCanceledItems === totalNumberOfItems) && order.isPaid && !order.isShipped && !order.isDelivered && order.isReimbursed ? (
                            <h1 className={"text-4xl font-bold"}>
                                Your order has been canceled and your refund has been issued.
                            </h1>
                        ) : (order.isCanceled || totalNumberOfCanceledItems === totalNumberOfItems) && !order.isShipped && !order.isDelivered ? (
                            <h1 className={"text-4xl font-bold"}>
                                Your order has been canceled.
                            </h1>
                        ) : (
                            <h1  className={"text-4xl font-bold"}>
                                Please pay order below to begin shipment process.
                            </h1>
                        )
                    }
                </div>
                {/*TITLE*/}
                <div className={"z-20 px-2 w-full flex-col flex items-center max-w-screen-2xl mx-auto gap-2 sm:gap-4 sm:pt-10 xl:flex-row xl:items-start xl:justify-center"}>

                    {/*ORDER DETAILS*/}
                    <div
                        className={"bg-zinc-50 z-20 px-4 py-8 w-full max-w-3xl rounded-2xl sm:px-8 sm:bg-white sm:shadow-lg sm:border-none dark:bg-slate-800"}>
                        <h1 className={"w-full h-16 flex items-start text-center justify-center font-semibold text-3xl dark:text-white"}>
                            Order Details
                        </h1>

                        {/*<Message variant={"warning"}>*/}
                        {/*    Please save this order number, you can use it to locate and track your order using our order locator<span className={"link link-primary pl-1"} onClick={() => router.push("/locator")}>tool.</span>*/}
                        {/*</Message>*/}
                        <div className={"flex flex-col border-b border-gray-300 py-3 sm:flex-row dark:text-white"}>
                            <div className={"w-full justify-center flex items-center sm:justify-start sm:w-4/12"}>
                                <h3 className={"font-semibold"}>
                                    Order #
                                </h3>
                            </div>
                            <div className={"w-full sm:w-8/12"}>
                                <span className={"text-sm"}>{order.id}</span>
                            </div>
                        </div>
                        <div className={"flex flex-col border-b border-gray-300 py-3 sm:flex-row dark:text-white"}>
                            <div className={"w-full justify-center flex items-center sm:justify-start sm:w-4/12"}>
                                <h3 className={"font-semibold"}>
                                    Customer Email
                                </h3>
                            </div>
                            <div className={"w-full sm:w-8/12"}>
                                <div className={"flex flex-col text-sm"}>
                                    <span>{order.email || order.user?.email}</span>
                                </div>
                            </div>
                        </div>
                        <div className={"flex flex-col border-b border-gray-300 py-3 sm:flex-row dark:text-white"}>
                            <div className={"w-full justify-center flex items-center sm:justify-start sm:w-4/12"}>
                                <h3 className={"font-semibold"}>
                                    Ship To Address
                                </h3>
                            </div>
                            <div className={"w-full sm:w-8/12"}>
                                <div className={"flex flex-col text-sm"}>
                                    <span>{order.name}</span>
                                    <span>{order.address}</span>
                                    <span>{order.city}, {order.state} {order.postalCode}</span>
                                    <span>{order.country}</span>
                                </div>
                            </div>
                        </div>
                        <div className={"flex flex-col border-b border-gray-300 py-3 sm:flex-row dark:text-white"}>
                            <div className={"w-full justify-center flex items-center sm:justify-start sm:w-4/12"}>
                                <h3 className={"font-semibold"}>
                                    Payment Method
                                </h3>
                            </div>
                            <div className={"w-full sm:w-8/12"}>
                                <div className={"flex items-center"}>
                                    <div className={"flex flex-col text-sm"}>
                                        {
                                            order.paymentMethod === "PayPal / Credit Card" ? (
                                                <>
                                                    <span className={"font-semibold"}>Paypal, Inc.</span>
                                                    <span>(includes: Paypal, Venmo, Credit Card, etc.)</span>
                                                </>
                                            ) : order.paymentMethod === "Stripe / Credit Card" && (
                                                <>
                                                    <span className={"font-semibold"}>Stripe, Inc.</span>
                                                    <span>(includes: Cash App, Afterpay, Credit Card, etc.)</span>
                                                </>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            order.orderPayment && (
                                <div className={"flex flex-col border-b border-gray-300 py-3 sm:flex-row dark:text-white"}>
                                    <div className={"w-full justify-center flex items-center sm:justify-start sm:w-4/12"}>
                                        <h3 className={"font-semibold"}>
                                            Transaction #
                                        </h3>
                                    </div>
                                    <div className={"w-full sm:w-8/12"}>
                                        <span className={"text-sm"}>
                                            {order.orderPayment.transaction_id}
                                        </span>
                                    </div>
                                </div>
                            )
                        }
                        <div className={"flex flex-col border-b border-gray-300 py-3 sm:flex-row"}>
                            <div className={"w-full justify-center flex items-center sm:justify-start sm:w-4/12"}>
                                <h3 className={"font-semibold dark:text-white"}>
                                    Order Position
                                </h3>
                            </div>
                            <div className={"w-full sm:w-8/12"}>
                                <div className={"flex flex-col text-sm py-3"}>
                                    {
                                        order.isPaid && !order.isShipped && !order.isCanceled && order.orderItems.length !== canceledItems?.length ? (
                                            <Message variant={"info"}>
                                                Processing order
                                            </Message>
                                        ) : order.isPaid && order.isShipped && order.isDelivered && !order.isCanceled && order.orderItems.length !== canceledItems?.length ? (
                                            <Message variant={"success"}>
                                                <div className={"flex gap-1"}>
                                                    <span>Delivered on</span>
                                                    <span>{order.deliveredAt.substring(0, 10)}</span>
                                                </div>
                                            </Message>
                                        ) : order.isPaid && order.isShipped && !order.isCanceled && order.orderItems.length !== canceledItems?.length ? (
                                            <Message variant={"info"}>
                                                <div className={"flex flex-col"}>
                                                    Shipped
                                                </div>
                                            </Message>
                                        ) : order.isCanceled || order.orderItems.length === canceledItems?.length ? (
                                            <Message variant={"error"}>
                                                <div className={"flex gap-1"}>
                                                    <span>Canceled on</span>
                                                    <span>{order.canceledAt.substring(0, 10)}</span>
                                                </div>
                                            </Message>
                                        ) : (
                                            <Message variant={"warning"}>
                                                Order is awaiting payment, please pay now.
                                            </Message>
                                        )
                                    }
                                </div>
                                <div className={"flex items-center text-sm pb-3"}>
                                    {
                                        order.isPaid ? (
                                            <Message variant={"success"}>
                                                <div className={"flex flex-wrap items-center gap-1"}>
                                                    <span>Paid</span>
                                                    <span>{convertCentsToUSD(order.paidAmount)}</span>
                                                    <span>on</span>
                                                    <span>{order.paidAt.substring(0, 10)}</span>
                                                </div>
                                            </Message>
                                        ) : (
                                            <Message variant={"error"}>
                                                Not Paid
                                            </Message>
                                        )
                                    }
                                </div>

                                {
                                    order.isPaid && (totalNumberOfCanceledItemsThatRequireRefund > 0) && (order.isCanceled || canceledItems.length > 0) &&
                                    (
                                        <div className={"flex items-center text-sm pb-3"}>
                                            {
                                                order.isReimbursed ? (
                                                    <Message variant={"success"}>
                                                        <div className={"flex flex-wrap items-center gap-1"}>
                                                            <span>Refunded</span>
                                                            <span>{convertCentsToUSD(order.reimbursedAmount)}</span>
                                                            <span>on </span>
                                                            <span>{order.reimbursedAt.substring(0, 10)}</span>
                                                        </div>
                                                    </Message>
                                                ) : (
                                                    <Message variant={"info"}>
                                                        Processing refund
                                                    </Message>
                                                )
                                            }
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                        {
                            order.isShipped && (
                                <div className={"flex flex-col border-b border-gray-300 py-3 sm:flex-row dark:text-white"}>
                                    <div className={"w-full justify-center flex items-center sm:justify-start sm:w-4/12"}>
                                        <h3 className={"font-semibold"}>
                                            Tracking #
                                        </h3>
                                    </div>
                                    <div className={"w-full sm:w-8/12"}>
                                        <span className={"text-sm"}>{order.trackingNumber}</span>
                                    </div>
                                </div>
                            )
                        }
                        <div className={"py-3"}>
                            <h3 className={"text-center font-semibold sm:text-start dark:text-white"}>
                                Order Item(s)
                            </h3>
                            <div>
                                {
                                    order.orderItems.map(function (item) {
                                        return (
                                            <OrderItem canceledItems={canceledItems} item={item}
                                                       isCanceled={order.isCanceled} paidAt={order.paidAt}
                                                       key={item.productId}/>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>

                    <div className={"flex flex-col items-center gap-4 w-full sm:max-w-lg"}>
                        <div
                            className={"z-20 px-4 bg-opacity-90 bg-[#7c3cfc] w-full text-white mx-auto h-20 rounded-2xl flex justify-center items-center sm:bg-opacity-90 sm:shadow-lg"}>
                            {
                                !order.isShipped && !order.isDelivered && !order.isCanceled && canceledItems.length !== order.orderItems.length ? (
                                    <div className={"text-center flex items-center gap-2"}>
                                        Cancel order
                                        <button
                                            onClick={() => window.confirm_modal.showModal()}
                                            className={"btn btn-sm rounded-full normal-case"}
                                        >
                                            <FcDeleteDatabase size={24}/>
                                        </button>

                                    </div>
                                ) : (order.isCanceled || totalNumberOfCanceledItemsThatRequireRefund > 0) && order.isPaid && !order.isReimbursed ? (
                                    <p className={"text-center text-wrap"}>
                                        Refunds can take up 5-7 business to process.
                                    </p>
                                ) : (order.isCanceled || canceledItems?.length === order.orderItems.length) || order.isDelivered ? (
                                    <p className={"text-center text-wrap"}>
                                        Thank you for checking out eshopjs.com
                                    </p>
                                ) : (
                                    <p className={"text-center text-wrap"}>
                                        This order has shipped and can no longer be canceled.
                                    </p>
                                )
                            }
                        </div>


                            {/*ORDER SUMMARY*/}
                            {
                                order.totalPrice !== 0 && (
                                    <div className={"bg-zinc-50 z-20 px-4 py-8 w-full rounded-2xl sm:px-8 sm:bg-white sm:shadow-lg sm:border-none dark:bg-slate-800"}>
                                        <h1 className={"h-16 flex items-start justify-center font-semibold text-3xl dark:text-white"}>
                                            {order.isPaid ? "Payment Summary" : "Place Order"}
                                        </h1>

                                        <div className="flex flex-col gap-8 dark:text-white">
                                            <div className={"flex flex-col text-sm gap-2"}>
                                                <div className={"flex justify-between"}>
                                                    <span>Items ({totalNumberOfItems - totalNumberOfCanceledItems}):</span>
                                                    <span>{convertCentsToUSD(order.itemsPrice)}</span>
                                                </div>
                                                <div className={"flex justify-between"}>
                                                    <span>Shipping & handling:</span>
                                                    <span>{convertCentsToUSD(order.shippingPrice)}</span>
                                                </div>
                                                <span className={"self-end w-16 my-1 border-b border-grey-700"}/>
                                                <div className={"flex justify-between"}>
                                                    <span>Total before tax:</span>
                                                    <span>{convertCentsToUSD(order.itemsPrice + order.shippingPrice)}</span>
                                                </div>
                                                <div className={"flex justify-between"}>
                                                    <span>Estimated tax to be collected:</span>
                                                    <span>{convertCentsToUSD(order.taxPrice)}</span>
                                                </div>
                                            </div>
                                            <div className={"flex justify-between font-semibold text-lg text-red-600"}>
                                                <span>Order Total:</span>
                                                <span>{convertCentsToUSD(order.taxPrice + order.shippingPrice + order.itemsPrice)}</span>
                                            </div>

                                            {/*PAYMENT OPTIONS*/}
                                            {
                                                !order.isPaid && (!order.isCanceled || order.orderItems.length !== canceledItems.length) && (
                                                    <>
                                                        {
                                                            order.paymentMethod === "PayPal / Credit Card" && (
                                                                <div className={"px-4"}>
                                                                    <PayPalScriptProvider options={initialOptions}>
                                                                        <PaypalCheckout createNewOrder={() => createNewOrder()}
                                                                                        setSaveButtonDisabled={() => null}
                                                                                        existingOrder={order}/>
                                                                    </PayPalScriptProvider>
                                                                </div>
                                                            )
                                                        }
                                                        {
                                                            order.paymentMethod === "Stripe / Credit Card" && (
                                                                <StripeCheckout existingOrder={order}
                                                                                setSaveButtonDisabled={() => null}
                                                                                setOrder={setOrder}/>
                                                            )
                                                        }
                                                    </>
                                                )
                                            }
                                        </div>
                                    </div>
                                )
                            }



                        {/*REFUND SUMMARY*/}
                        {
                            order.isPaid && (totalNumberOfCanceledItemsThatRequireRefund > 0) && (order.isCanceled || canceledItems.length > 0) && (
                                <div
                                    className={"bg-zinc-50 z-20 px-4 py-8 w-full rounded-2xl sm:px-8 sm:bg-white sm:shadow-lg sm:border-none dark:bg-slate-800"}>
                                    <h1 className={"h-16 flex items-start justify-center font-semibold text-3xl dark:text-white"}>
                                        Refund Summary
                                    </h1>
                                    <div className="flex flex-col gap-8 dark:text-white">
                                        <div className={"flex flex-col text-sm gap-2"}>
                                            <div className={"flex justify-between"}>
                                                <span>Items ({totalNumberOfCanceledItemsThatRequireRefund}):</span>
                                                <span>{convertCentsToUSD(totalDollarAmountOfCanceledItemsThatRequireRefund)}</span>
                                            </div>
                                            {
                                                order.isCanceled && (
                                                    <div className={"flex justify-between"}>
                                                        <span>Shipping & handling:</span>
                                                        <span>{convertCentsToUSD(totalDollarAmountOfShippingRefund)}</span>
                                                    </div>
                                                )
                                            }
                                            <span className={"self-end w-16 my-1 border-b border-grey-700"}/>
                                            <div className={"flex justify-between"}>
                                                <span>Tax collected:</span>
                                                <span>{convertCentsToUSD(totalTaxDollarAmountThatRequiresRefund)}</span>
                                            </div>
                                            <div className={"flex justify-between"}>
                                                <span>Refund subtotal:</span>
                                                <span>{convertCentsToUSD(subtotalDollarAmountThatRequiresRefund)}</span>
                                            </div>
                                            {
                                                totalDollarAmountOfFees !== 0 && (
                                                    <div className={"flex text-red-700 justify-between"}>
                                                        <div className={"flex gap-1 items-center"}>
                                                            <div
                                                                className="tooltip tooltip-right"
                                                                data-tip="Non-fundable shipping fee on orders under $100 USD"
                                                            >
                                                                <IoInformationCircleOutline size={16}/>
                                                            </div>
                                                            <span>Shipping Fee:</span>
                                                        </div>
                                                        <span>- {convertCentsToUSD(totalDollarAmountOfFees)}</span>
                                                    </div>
                                                )
                                            }
                                        </div>
                                        <div
                                            className={"flex justify-between font-semibold text-lg text-green-500"}>
                                            <span>Estimated Refund:</span>
                                            <span>{convertCentsToUSD(subtotalDollarAmountThatRequiresRefund - totalDollarAmountOfFees)}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
                <ConfirmModal
                    title={"Are you sure you want to cancel? This cannot be undone."}
                    initiateFunction={submitCancel}
                />
            </>
        )
    }
    if (!loading && !order) return <NotFound/>
    return <Loading/>
};

export default OrderPage;