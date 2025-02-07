"use client";

import React, {useContext, useEffect, useState} from 'react';
import GlobalContext from "@/context/GlobalContext";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import CheckoutItem from "@/components/CheckoutItem";
import StripeCheckout from "@/components/StripeCheckout";
import CheckoutSteps from "@/components/CheckoutSteps";
import Loading from "@/app/loading";
import PaypalCheckout from "@/components/PaypalCheckout";
import {PayPalScriptProvider} from "@paypal/react-paypal-js";
import {fetchDiscountValidity, fetchNewOrder} from "@/utils/api-requests/fetchRequests";
import {convertCentsToUSD} from "@/utils/covertCentsToUSD";
import {LuPartyPopper} from "react-icons/lu";
import {FiEdit} from "react-icons/fi";
import {LiaSave} from "react-icons/lia";


const CheckoutPage = () => {

    const { user: userData, dispatch, discount, discountKey, shippingAddress, paymentMethod, cartItems, taxPrice, shippingPrice, itemsPrice, totalPrice, guestData } = useContext(GlobalContext);
    const router = useRouter();

    const [discountCode, setDiscountCode] = useState("");
    const [discountLabelActive, setDiscountLabelActive] = useState(false);
    const [discountLabelHover, setDiscountLabelHover] = useState(false);
    const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);

    const totalNumberOfItems = cartItems.reduce(function (acc, product) {
        return (acc + product.quantity);
    }, 0);

    useEffect( () => {
        if (cartItems.length === 0) {
            router.push("/cart");
        } else if (!paymentMethod) {
            router.push("/payment");
        } else if (Object.keys(shippingAddress).length === 0 ) {
            router.push("/shipping");
        }
    }, [router, shippingAddress, paymentMethod, cartItems.length]);


    const submitApplyDiscountCode = async () => {
        const res = await fetchDiscountValidity({discountKey: discountCode})
        if (!res.validCode) {
            // dispatch(setLoading(true));
            toast.remove();
            setTimeout(() => {
                // dispatch(setLoading(false));
                toast.error("Invalid discount code :(");
            }, 1000)
        } else {
            toast.success("You are now receiving FREE SHIPPING!");
            dispatch({type: "ADD_DISCOUNT", payload: discountCode});
            dispatch({type: "UPDATE_CART"});
            dispatch({type: "SET_LOCAL_STORAGE"});
        }
    };

    const submitRemoveDiscountCode = () => {
        setDiscountCode("");
        dispatch({type: "REMOVE_DISCOUNT"});
        dispatch({type: "UPDATE_CART"});
        dispatch({type: "SET_LOCAL_STORAGE"});
    };

    const createNewOrder = async () => {
        let user;
        if (userData) {
            user = {
                id: userData.id,
            };
        } else {
            user = {
                email: guestData,
            };
        }
        const res = await fetchDiscountValidity({discountKey})
        const body = {
            user,
            orderItems: cartItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
            validCode: res.validCode,
        }
        const newOrder = await fetchNewOrder(body);
        if (!newOrder) return null;
        return newOrder.id;
    };


    const createNewUnpaidOrder = async () => {
        setLoading(true);
        const orderId = await createNewOrder();
        if (orderId) {
            router.push(`/orders/${orderId}/payment?${paymentMethod === "Stripe / Credit Card" ? "stripe" : "paypal"}=unsuccessful`);
        }
        // dispatch(setLoading(false));
    };

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false);
    }, []);

    const initialOptions = {
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        currency: "USD",
        intent: "capture",
        enableFunding: "venmo",
    };

    if (!loading) {
        return (
            <>
                <CheckoutSteps/>
                <div className={"z-20 px-2 w-full flex-col flex items-center max-w-screen-2xl mx-auto gap-2 sm:gap-8 sm:pt-10 xl:flex-row xl:items-start xl:justify-center"}>
                    <div className={"bg-zinc-50 z-20 px-4 py-8 w-full max-w-3xl rounded-2xl sm:px-8 sm:bg-white sm:shadow-lg sm:border-none"}>
                        <h1 className={"h-16 flex items-start justify-center font-semibold text-3xl"}>
                            Review your order
                        </h1>
                        {
                            !userData && guestData && (
                                <div className={"flex flex-col border-b border-gray-300 py-3 sm:flex-row"}>
                                    <div className={"w-full justify-center flex items-center sm:justify-start sm:w-4/12"}>
                                        <h3 className={"font-semibold"}>
                                            Customer Email
                                        </h3>
                                    </div>
                                    <div className={"w-full sm:w-8/12"}>
                                        <div className={"flex justify-between items-center"}>
                                            <div className={"flex flex-col text-sm"}>
                                                <span>{guestData}</span>
                                            </div>
                                            {
                                                !saveButtonDisabled && (
                                                    <Link href={"/shipping"}>
                                                        <FiEdit/>
                                                    </Link>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        <div className={"flex flex-col border-b border-gray-300 py-3 sm:flex-row"}>
                            <div className={"w-full justify-center flex items-center sm:justify-start sm:w-4/12"}>
                                <h3 className={"font-semibold"}>
                                    Ship To Address
                                </h3>
                            </div>
                            <div className={"w-full sm:w-8/12"}>
                                <div className={"flex justify-between h-full"}>
                                    <div className={"flex flex-col text-sm"}>
                                        <span>{shippingAddress.name}</span>
                                        <span>{shippingAddress.address}</span>
                                        <span>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</span>
                                        <span>{shippingAddress.country}</span>
                                    </div>
                                    {
                                        !saveButtonDisabled && (
                                            <Link href={"/shipping"}>
                                                <FiEdit/>
                                            </Link>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                        <div className={"flex flex-col border-b border-gray-300 py-3 sm:flex-row"}>
                            <div className={"w-full justify-center flex items-center sm:justify-start sm:w-4/12"}>
                                <h3 className={"font-semibold"}>
                                    Payment Method
                                </h3>
                            </div>
                            <div className={"w-full sm:w-8/12"}>
                                <div className={"flex justify-between h-full"}>
                                    <div className={"flex items-center"}>
                                        <div className={"flex flex-col text-sm"}>
                                            {
                                                paymentMethod === "PayPal / Credit Card" ? (
                                                    <>
                                                        <span
                                                            className={"font-semibold"}>Paypal, Inc.</span>
                                                        <span>(includes: Paypal, Venmo, Credit Card, etc.)</span>
                                                    </>
                                                ) : paymentMethod === "Stripe / Credit Card" ? (
                                                    <>
                                                        <span
                                                            className={"font-semibold"}>Stripe, Inc.</span>
                                                        <span>(includes: Cash App, Afterpay, Credit Card, etc.)</span>
                                                    </>
                                                ) : ""
                                            }
                                        </div>
                                    </div>
                                    <div className={"flex items-start"}>
                                        {
                                            !saveButtonDisabled && (
                                                <Link href={"/payment"}>
                                                    <FiEdit/>
                                                </Link>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={"py-3"}>
                            <h3 className={"text-center font-semibold sm:text-start"}>
                                Order Item(s)
                            </h3>
                            <div>
                                {
                                    cartItems.map(function (item) {
                                        return (
                                            <CheckoutItem saveButtonDisabled={saveButtonDisabled} item={item}
                                                          key={item.id}/>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>





                    <div className={"flex flex-col items-center gap-4 w-full sm:max-w-lg"}>
                        <div className={"z-20 px-4 bg-opacity-90 bg-[#7c3cfc] w-full text-white mx-auto h-20 rounded-2xl flex justify-center items-center sm:bg-opacity-90 sm:shadow-lg"}>
                            {
                                itemsPrice > 10000 ? (
                                    <div className={"text-center flex items-center gap-2"}>
                                        Your order qualifies for FREE shipping!
                                        <LuPartyPopper size={30}/>
                                    </div>
                                ) : (
                                    <p className={"text-center flex gap-1 text-wrap"}>
                                        Add<span className={"font-bold"}>{convertCentsToUSD(10000 - itemsPrice)}</span>
                                        to your order to qualify for FREE shipping.
                                    </p>
                                )
                            }
                        </div>
                        <div className={"bg-zinc-50 z-20 px-4 py-8 w-full rounded-2xl sm:px-8 sm:bg-white sm:shadow-lg sm:border-none"}>
                            <h1 className={"h-16 flex items-start justify-center font-semibold text-3xl"}>
                                Place Order
                            </h1>
                            <div className="flex flex-col gap-8">
                                <div className={"flex flex-col text-sm gap-2"}>
                                    <div className={"flex justify-between"}>
                                        <span>Items({totalNumberOfItems}):</span>
                                        <span>{convertCentsToUSD(itemsPrice)}</span>
                                    </div>
                                    <div className={"flex justify-between"}>
                                        <span>Shipping flat rate:</span>
                                        <span>{convertCentsToUSD(shippingPrice)}</span>
                                    </div>
                                    <div className={"self-end w-16 border-b border-grey-700"}/>
                                    <div className={"flex justify-between"}>
                                        <span>Total before tax:</span>
                                        <span>{convertCentsToUSD(itemsPrice + shippingPrice)}</span>
                                    </div>
                                    <div className={"flex justify-between"}>
                                        <span>Estimated tax to be collected:</span>
                                        <span>{convertCentsToUSD(taxPrice)}</span>
                                    </div>
                                </div>
                                <div className={"flex justify-between font-semibold text-lg text-red-600"}>
                                    <span>Order Total:</span>
                                    <span>{convertCentsToUSD(totalPrice)}</span>
                                </div>
                                {
                                    discount && (
                                        <div className={"w-full flex items-center justify-between"}>
                                            <span className={"text-sm font-semibold"}>Discount code applied :D</span>
                                            <div className={"pl-10"}>
                                                <button
                                                    onClick={() => submitRemoveDiscountCode()}
                                                    className={"btn btn-sm text-xs rounded-full px-4 normal-case"}
                                                >
                                                    Remove Discount
                                                </button>
                                            </div>
                                        </div>
                                    )
                                }
                                {
                                    !discount && !saveButtonDisabled && (
                                        <div className={"flex w-full items-end"}>
                                            <div className={`relative h-11 w-full`}>
                                                <input
                                                    id={"discountCode"}
                                                    onMouseEnter={() => setDiscountLabelHover(true)}
                                                    onMouseLeave={() => setDiscountLabelHover(false)}
                                                    onFocus={() => setDiscountLabelActive(true)}
                                                    // onBlur={() => discountCode.length === 0 && setDiscountLabelActive(false)}
                                                    onBlur={() => discountCode.length === 0 && setDiscountLabelActive(false)}
                                                    value={discountCode}
                                                    onChange={(e) => setDiscountCode(e.target.value)}
                                                    placeholder="Enter discount code"
                                                    className={`${!discountLabelActive ? "cursor-pointer" : ""} text-[16px] lg:text-base peer h-full w-full rounded-none border-b border-gray-300 hover:border-gray-400 bg-transparent pt-4 pb-1.5 font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 placeholder-shown:text-[16px] focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100`}/>
                                                <label
                                                    htmlFor={"discountCode"}
                                                    className={`${discountLabelHover ? "text-gray-700" : "text-gray-500"} after:content[''] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-[14px] peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:after:scale-x-100 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500`}>
                                                    {discountLabelActive ? "Discount code" : "Have a discount code?"}
                                                </label>
                                            </div>
                                            <button
                                                onClick={submitApplyDiscountCode}
                                                className={"pl-5 text-xs"}
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    )
                                }
                                {
                                    paymentMethod === "PayPal / Credit Card" && (
                                        <div className={"px-4"}>
                                            <PayPalScriptProvider options={initialOptions}>
                                                <PaypalCheckout createNewOrder={() => createNewOrder()}
                                                                setSaveButtonDisabled={setSaveButtonDisabled}/>
                                            </PayPalScriptProvider>
                                        </div>
                                    )
                                }
                                {
                                    paymentMethod === "Stripe / Credit Card" && (
                                        <StripeCheckout setSaveButtonDisabled={setSaveButtonDisabled}/>
                                    )
                                }
                            </div>
                        </div>
                        {
                            userData && !saveButtonDisabled && (
                                <div className={"z-20 px-4 bg-opacity-90 bg-zinc-500 w-full text-white mx-auto h-20 rounded-2xl flex justify-center items-center sm:bg-opacity-90 sm:shadow-lg"}>
                                    <div className={"text-center flex items-center gap-2"}>
                                        Save this order and pay later?
                                        <button
                                            onClick={createNewUnpaidOrder}
                                            disabled={cartItems.length === 0}
                                            className={"btn btn-sm rounded-full normal-case"}
                                        >
                                            <LiaSave size={24}/>
                                        </button>

                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </>
        );
    }
    return <Loading/>
};

export default CheckoutPage;