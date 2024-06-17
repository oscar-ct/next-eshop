"use client";

import {useContext, useEffect, useState} from 'react';
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
    const totalNumberOfCanceledItems = order?.canceledItems.length > 0 ? order?.canceledItems.reduce(function (acc, item) {
        return (acc + item.productQuantity);
    }, 0) : 0;
    const canceledItemsThatRequireRefund = order?.canceledItems.filter(function (item) {
        return item.canceledAt > order.paidAt;
    });
    const totalNumberOfCanceledItemsThatRequireRefund = order && canceledItemsThatRequireRefund.length > 0 ? canceledItemsThatRequireRefund.reduce(function (acc, item) {
        return (acc + item.productQuantity);
    }, 0) : 0;

    const totalDollarAmountOfCanceledItemsThatRequireRefund = order && canceledItemsThatRequireRefund.length > 0 ? canceledItemsThatRequireRefund.reduce(function (acc, item) {
        return (acc + item.productPrice * item.productQuantity);
    }, 0) : 0;

    const totalDollarAmountOfShippingRefund = order && canceledItemsThatRequireRefund.length > 0 && (order?.freeShipping || totalDollarAmountOfCanceledItemsThatRequireRefund > 10000) ? 0 : 1000;

    const totalTaxDollarAmountThatRequiresRefund = order?.isCanceled ? Math.round( TAX_PERCENTAGE * (totalDollarAmountOfCanceledItemsThatRequireRefund + totalDollarAmountOfShippingRefund)) : Math.round( TAX_PERCENTAGE * totalDollarAmountOfCanceledItemsThatRequireRefund);

    const subtotalDollarAmountThatRequiresRefund = order?.isCanceled ? totalDollarAmountOfCanceledItemsThatRequireRefund + order?.shippingPrice + totalTaxDollarAmountThatRequiresRefund : totalDollarAmountOfCanceledItemsThatRequireRefund + totalTaxDollarAmountThatRequiresRefund;

    const orderItemsPaidAndNotCanceled = order?.orderItems.filter((item) => !item.isCanceled && item.isPaid);

    const totalDollarAmountOfOrderItemsPaidAndNotCanceled = orderItemsPaidAndNotCanceled?.reduce((acc, item) => {
        return (acc + item.price * item.quantity);
    }, 0);
    const totalDollarAmountOfFees =
        order?.canceledItems.length > 0 && !order?.freeShipping && totalDollarAmountOfOrderItemsPaidAndNotCanceled >= 10000 ? 0 : order?.freeShipping || order?.isCanceled || order?.shippingPrice === 1000 ? 0 : 1000;


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
                <div className={"p-5 lg:pt-10 lg:pb-5"}>
                    {
                        order.isPaid && !order.isShipped && !order.isDelivered && !order.isCanceled && order.canceledItems.length !== order.orderItems.length ? (
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
                        ) : (order.isCanceled || order.canceledItems?.length === order.orderItems.length) && order.isPaid && !order.isShipped && !order.isDelivered && !order.isReimbursed ? (
                            <h1 className={"text-4xl font-bold"}>
                                Your order has been canceled and your refund process has begun.
                            </h1>
                        ) : (order.isCanceled || order.canceledItems?.length === order.orderItems.length) && order.isPaid && !order.isShipped && !order.isDelivered && order.isReimbursed ? (
                            <h1 className={"text-4xl font-bold"}>
                                Your order has been canceled and your refund has been issued.
                            </h1>
                        ) : (order.isCanceled || order.canceledItems?.length === order.orderItems.length) && !order.isShipped && !order.isDelivered ? (
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
                <div className={"lg:pt-5 flex-col flex lg:flex-row w-full md:px-3 lg:pr-0 2xl:container mx-auto"}>

                    {/*ORDER DETAILS*/}
                    <div className={"lg:w-7/12 bg-white md:border h-min px-4 md:p-7"}>
                        <div className={"pt-5 md:pt-0 pb-5 lg:pb-5 lg:flex"}>

                            <h1 className={"lg:mx-auto text-2xl font-semibold text-center"}>
                                Order # {order._id}
                            </h1>
                        </div>
                        <div className={"pb-3"}>
                            <Message variant={"warning"}>
                                Please save this order number, you can use it to locate and track your order using our order locator<span className={"link link-primary pl-1"} onClick={() => router.push("/locator")}>tool.</span>
                            </Message>
                        </div>
                        <div className={"flex border-b-[1px] border-gray-300 py-3"}>
                            <div className={"w-3/12 sm:w-5/12 lg:w-4/12 flex items-center"}>
                                <h3 className={"font-semibold"}>
                                    Customer Email:
                                </h3>
                            </div>
                            <div className={"w-9/12 sm:w-7/12 lg:w-8/12 flex items-center"}>
                                <div className={"flex flex-col text-sm"}>
                                    <span>{order.user.email}</span>
                                </div>
                            </div>
                        </div>
                        <div className={"flex border-b-[1px] border-gray-300 py-3"}>
                            <div className={"w-3/12 sm:w-5/12 lg:w-4/12"}>
                                <h3 className={"font-semibold"}>
                                    Ship To:
                                </h3>
                            </div>
                            <div className={"w-9/12 sm:w-7/12 lg:w-8/12"}>
                                <div className={"flex flex-col text-sm"}>
                                    <span>{order.shippingAddress.name}</span>
                                    <span>{order.shippingAddress.address}</span>
                                    <span>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</span>
                                    <span>{order.shippingAddress.country}</span>
                                </div>
                            </div>
                        </div>
                        <div className={"flex border-b-[1px] border-gray-300 py-3"}>
                            <div className={"w-3/12 sm:w-5/12 lg:w-4/12 flex items-center"}>
                                <h3 className={"font-semibold pr-5"}>
                                    Payment Method:
                                </h3>
                            </div>
                            <div className={"w-9/12 sm:w-7/12 lg:w-8/12"}>
                                <div className={"flex items-center xl:items-start"}>
                                    <div className={"flex flex-col text-sm"}>
                                        {
                                            order.paymentMethod === "PayPal / Credit Card" ? (
                                                <>
                                                    <span className={"font-semibold"}>Paypal, Inc.</span>
                                                    <span>(includes: Paypal, Venmo, Credit Card, etc.)</span>
                                                </>
                                            ) :  order.paymentMethod === "Stripe / Credit Card" ? (
                                                <>
                                                    <span className={"font-semibold"}>Stripe, Inc.</span>
                                                    <span>(includes: Cash App, Afterpay, Credit Card, etc.)</span>
                                                </>
                                            ) : ""
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            order.paymentResult && (
                                <div className={"flex border-b-[1px] border-gray-300 py-4"}>
                                    <div className={"w-4/12 sm:w-5/12 lg:w-4/12 flex items-center"}>
                                        <h3 className={"font-semibold"}>
                                            Transaction #
                                        </h3>
                                    </div>
                                    <div className={"w-8/12 sm:w-7/12 lg:w-8/12 lex items-center"}>
                                <span className={"text-xs sm:text-sm px-1"}>
                                    {order.paymentResult.id}
                                </span>
                                    </div>
                                </div>
                            )
                        }
                        <div className={"flex border-b-[1px] border-gray-300 py-3"}>
                            <div className={"w-3/12 sm:w-5/12 lg:w-4/12 flex items-start"}>
                                <h3 className={"font-semibold pr-2"}>
                                    Order Position:
                                </h3>
                            </div>
                            <div className={"w-9/12 sm:w-7/12 lg:w-8/12"}>
                                <div className={"flex flex-col text-sm pb-3"}>
                                    {
                                        order.isPaid && !order.isShipped && !order.isCanceled && order.orderItems.length !== order.canceledItems?.length ? (
                                            <Message variant={"info"}>
                                                <span className={"text-start"}>Processing order</span>
                                            </Message>
                                        ) : order.isPaid && order.isShipped && order.isDelivered && !order.isCanceled && order.orderItems.length !== order.canceledItems?.length ? (
                                            <Message variant={"success"}>
                                                <div className={"flex"}>
                                                    <span className={"text-start truncate"}>Delivered on</span>
                                                    <span className={"font-bold pl-1"}>{order.deliveredAt.substring(0, 10)}</span>
                                                </div>
                                            </Message>
                                        ) : order.isPaid && order.isShipped && !order.isCanceled && order.orderItems.length !== order.canceledItems?.length ? (
                                            <Message variant={"info"}>
                                                <div className={"flex flex-col"}>
                                                    <span className={"text-start"}>Shipped</span>
                                                </div>
                                            </Message>
                                        ) : order.isCanceled || order.orderItems.length === order.canceledItems?.length ? (
                                            <Message variant={"error"}>
                                                <div className={"flex"}>
                                                    <span className={"text-start"}>Canceled on</span>
                                                    <span className={"font-bold pl-1"}>{order.canceledAt.substring(0, 10)}</span>
                                                </div>
                                            </Message>
                                        ) : (
                                            <Message variant={"warning"}>
                                                <span className={"text-start"}>Order is awaiting payment, please pay now.</span>
                                            </Message>
                                        )
                                    }
                                </div>
                                <div className={"flex items-center text-sm pb-3"}>
                                    {
                                        order.isPaid ? (
                                            <Message variant={"success"}>
                                                <div className={"flex flex-wrap items-center"}>
                                                    <span className={"pr-1"}>Paid</span>
                                                    <span className={"pr-1 font-bold"}>{convertCentsToUSD(order.paidAmount)}</span>
                                                    <span className={"pr-1"}>on </span>
                                                    <span className={"font-bold"}>{order.paidAt.substring(0, 10)}</span>
                                                </div>
                                            </Message>
                                        ) : (
                                            <Message variant={"error"}>
                                                <span className={"text-start"}>Not Paid</span>
                                            </Message>
                                        )
                                    }
                                </div>

                                {
                                    order.isPaid && (totalNumberOfCanceledItemsThatRequireRefund > 0) && (order.isCanceled || order.canceledItems.length > 0) &&
                                    (
                                        <div className={"flex items-center text-sm"}>
                                            {
                                                order.isReimbursed ? (
                                                    <Message variant={"success"}>
                                                        <div className={"flex flex-wrap items-center"}>
                                                            <span className={"pr-1"}>Refunded</span>
                                                            <span className={"font-bold pr-1"}>{convertCentsToUSD(order.reimbursedAmount)}</span>
                                                            <span className={"pr-1"}>on </span>
                                                            <span className={"font-bold"}>{order.reimbursedAt.substring(0, 10)}</span>
                                                        </div>
                                                    </Message>
                                                ) : (
                                                    <Message variant={"info"}>
                                                        <span className={"text-start"}>Processing refund</span>
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
                                <div className={"flex border-b-[1px] border-gray-300 py-3"}>
                                    <div className={"w-3/12 sm:w-5/12 lg:w-4/12 flex items-center"}>
                                        <h3 className={"font-semibold pr-2"}>
                                            Tracking #
                                        </h3>
                                    </div>
                                    <div className={"w-9/12 sm:w-7/12 lg:w-8/12 flex items-center"}>
                                        <span className={"text-sm"}>{order.trackingNumber}</span>
                                    </div>
                                </div>
                            )
                        }
                        <div className={"py-3"}>
                            <h3 className={"font-semibold"}>
                                Order Item(s):
                            </h3>
                            <div>
                                {
                                    order.orderItems.map(function (item) {
                                        return (
                                            <OrderItem canceledItems={order.canceledItems} item={item} isCanceled={order.isCanceled} paidAt={order.paidAt} key={item.productId}/>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>

                    <div className={"pt-5 lg:pt-0 px-3 pb-5 lg:pl-5 lg:w-5/12 flex flex-col-reverse md:flex-col"}>

                        <div className={"pt-5 lg:pt-0 pb-5"}>
                            {/*CANCEL OPTIONS*/}
                            {
                                !order.isShipped && !order.isDelivered && !order.isCanceled && order.canceledItems.length !== order.orderItems.length ? (
                                    <div className={"px-3 w-full flex justify-end"}>
                                        <button
                                            onClick={() => window.confirm_modal.showModal()}
                                            className={"btn btn-outline bg-white btn-error normal-case btn-sm w-40 md:w-full rounded-full"}
                                        >
                                            Cancel This Order
                                        </button>
                                    </div>
                                ) : (order.isCanceled || totalNumberOfCanceledItemsThatRequireRefund > 0) && order.isPaid && !order.isReimbursed ? (
                                    <h5 className={"text-center"}>
                                        Refunds can take up 5-7 business to process.
                                    </h5>
                                ) : (order.isCanceled || order.canceledItems?.length === order.orderItems.length) || order.isDelivered  ? (
                                    ""
                                ) : (
                                    <h5 className={"text-center"}>
                                        This order has shipped and can no longer be canceled.
                                    </h5>
                                )
                            }
                            {/*CANCEL OPTIONS*/}

                        </div>

                        <div className={"flex flex-col md:shadow-lg"}>

                            {/*ORDER SUMMARY*/}
                            {
                                order.totalPrice !== 0 && (
                                    <>
                                        <h3 className={"hidden md:block py-2 ibmplex text-2xl bg-zinc-700 text-white font-semibold text-center"}>
                                            {
                                                order.isPaid ? (
                                                    "Payment Summary"
                                                ) : (
                                                    "Pay Order"
                                                )
                                            }
                                        </h3>
                                        <h1 className={"md:hidden text-center pt-3 font-semibold text-3xl bg-white px-2"}>
                                            {
                                                order.isPaid ? (
                                                    "Payment Summary"
                                                ) : (
                                                    "Pay Order"
                                                )
                                            }
                                        </h1>
                                        <div className="bg-white md:border">
                                            <div className="pt-0 px-3 md:px-6">
                                                <div className={"flex flex-col md:pt-6"}>
                                                    <div className={"md:hidden mt-5 mb-3"}/>
                                                    <div className={"flex justify-between text-sm my-1"}>
                                                        <span>Items ({totalNumberOfItems - totalNumberOfCanceledItems}):</span>
                                                        <span className="pl-2">{convertCentsToUSD(order.itemsPrice)}</span>
                                                    </div>
                                                    <div className={"flex justify-between text-sm my-1"}>
                                                        <span>Shipping & handling:</span>
                                                        <span className="pl-2">{convertCentsToUSD(order.shippingPrice)}</span>
                                                    </div>
                                                    <span className={"self-end w-16 my-1 border-b-[1px] border-grey-500"}/>
                                                    <div className={"flex justify-between text-sm my-1"}>
                                                        <span>Total before tax:</span>
                                                        <span className="pl-2">{convertCentsToUSD(order.itemsPrice + order.shippingPrice)}</span>
                                                    </div>
                                                    <div className={"flex justify-between text-sm my-1"}>
                                                        <span>Estimated tax to be collected:</span>
                                                        <span className="pl-2">{convertCentsToUSD(order.taxPrice)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={"flex justify-between font-semibold text-lg px-3 md:px-6 pt-6 pb-8"}>
                                                <span className="text-red-600">Order Total:</span>
                                                <span className="text-red-600">{convertCentsToUSD(order.taxPrice + order.shippingPrice + order.itemsPrice)}</span>
                                            </div>

                                            {/*PAYMENT OPTIONS*/}
                                            {
                                                !order.isPaid && (!order.isCanceled || order.orderItems.length !== order.canceledItems.length) && (
                                                    <div className={"px-3 md:px-6 pb-5"}>

                                                        <div className={"border-t-[1px] pb-10"}/>

                                                        {
                                                            order.paymentMethod === "PayPal / Credit Card" && (
                                                                <div className={"px-4"}>
                                                                    <PayPalScriptProvider options={initialOptions}>
                                                                        <PaypalCheckout createNewOrder={() => createNewOrder()} setSaveButtonDisabled={() => null} existingOrder={order}/>
                                                                    </PayPalScriptProvider>
                                                                </div>
                                                            )
                                                        }
                                                        {
                                                            order.paymentMethod === "Stripe / Credit Card" && (
                                                                <StripeCheckout existingOrder={order} setSaveButtonDisabled={() => null} setOrder={setOrder}/>
                                                            )
                                                        }
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </>
                                )
                            }
                            {/*REFUND SUMMARY*/}
                            {
                                order.isPaid && (totalNumberOfCanceledItemsThatRequireRefund > 0) && (order.isCanceled || order.canceledItems.length > 0) && (

                                    <div className={"mt-5"}>
                                        <h3 className={"hidden md:block py-2 ibmplex text-2xl bg-zinc-700 text-white font-semibold text-center"}>
                                            Refund Summary
                                        </h3>
                                        <h1 className={"md:hidden pt-5 text-center font-semibold text-3xl bg-white px-2"}>
                                            Refund Summary
                                        </h1>
                                        <div className="bg-white md:border pt-0 px-3 md:px-6">
                                            <div className={"flex flex-col md:pt-6"}>
                                                <div className={"md:hidden mt-5 mb-3"}/>
                                                <div className={"flex justify-between text-sm my-1"}>
                                                    <span>Items ({totalNumberOfCanceledItemsThatRequireRefund}):</span>
                                                    <span className="pl-2">{convertCentsToUSD(totalDollarAmountOfCanceledItemsThatRequireRefund)}</span>
                                                </div>
                                                {
                                                    order.isCanceled && (
                                                        <div className={"flex justify-between text-sm my-1"}>
                                                            <span>Shipping & handling:</span>
                                                            <span className="pl-2">{convertCentsToUSD(totalDollarAmountOfShippingRefund)}</span>
                                                        </div>
                                                    )
                                                }
                                                <div className={"flex justify-between text-sm my-1"}>
                                                    <span>Tax collected:</span>
                                                    <span className="pl-2">{convertCentsToUSD(totalTaxDollarAmountThatRequiresRefund)}</span>
                                                </div>
                                                <span className={"self-end w-16 my-1 border-b-2 border-grey-500"}/>
                                                <div className={"flex justify-between text-sm my-1"}>
                                                    <span>Refund subtotal:</span>
                                                    <span className="pl-2">
                                                        {convertCentsToUSD(subtotalDollarAmountThatRequiresRefund)}
                                                    </span>
                                                </div>
                                                {
                                                    totalDollarAmountOfFees !== 0 && (
                                                        <div className={"flex text-red-700 justify-between text-sm my-1"}>
                                                            <div className={"flex items-center"}>
                                                                <div className="tooltip tooltip-right" data-tip="
                                                        Non-fundable shipping fee on orders under $100 USD">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                         viewBox="0 0 24 24"
                                                                         className="stroke-current shrink-0 w-4 h-4">
                                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                                              strokeWidth="2"
                                                                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                                    </svg>
                                                                </div>
                                                                <span className={"pl-1 "}>Shipping Fee:</span>
                                                            </div>
                                                            <span
                                                                className="pl-2">- {convertCentsToUSD(totalDollarAmountOfFees)}</span>
                                                        </div>
                                                    )
                                                }
                                                <div className={"flex justify-between font-semibold text-lg pt-6 pb-8"}>
                                                    <span className="text-green-500">Total Estimated Refund:</span>
                                                    <span
                                                        className="text-green-500">{convertCentsToUSD(subtotalDollarAmountThatRequiresRefund - totalDollarAmountOfFees)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
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