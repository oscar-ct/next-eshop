"use client";

import {useContext, useEffect, useState} from 'react';
import GlobalContext from "@/context/GlobalContext";
import {useRouter} from "next/navigation";
import Message from "@/components/Message";
import toast from "react-hot-toast";
import Link from "next/link";
import {FaEdit} from "react-icons/fa";
import CheckoutItem from "@/components/CheckoutItem";
import Image from 'next/image';
import stripe from "@/icons/stripe-logo.svg";
import StripeCheckout from "@/components/StripeCheckout";
import CheckoutSteps from "@/components/CheckoutSteps";
import Loading from "@/app/loading";
import PaypalCheckout from "@/components/PaypalCheckout";
import {PayPalScriptProvider} from "@paypal/react-paypal-js";
import {fetchDiscountValidity, fetchNewOrder} from "@/utils/api-requests/fetchRequests";


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
                id: userData._id,
                name: userData.name,
                email: userData.email,
            };
        } else {
            user = {
                name: shippingAddress.name,
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
        return newOrder._id;
    };


    const createNewUnpaidOrder = async () => {
        // dispatch(setLoading(true));
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
                {
                    cartItems.length !== 0 && (Object.keys(shippingAddress).length !== 0 || paymentMethod !== null) && (
                        <div>
                            <div className={`pt-0 flex-col flex lg:flex-row w-full 2xl:container mx-auto`}>
                                <div className={"lg:w-7/12 2xl:w-8/12 h-min md:pl-3 md:pr-3 lg:pr-0"}>
                                    <div className={"pt-3 md:pt-7"}>
                                        <h1 className={"hidden md:block py-2 text-center font-semibold text-2xl ibmplex bg-zinc-700 text-white"}>
                                            Review your Order Information
                                        </h1>
                                        <h1 className={"md:hidden pt-4 text-center font-semibold text-3xl bg-white px-2"}>
                                            Review your Order Information
                                        </h1>
                                    </div>
                                    <div className={"md:shadow-lg bg-white md:border px-4 sm:px-7 py-4"}>
                                        {
                                            !userData && guestData && (
                                                <div className={"flex border-b-[1px] border-gray-300 py-3"}>
                                                    <div className={"w-3/12 sm:w-4/12 flex items-center"}>
                                                        <h3 className={"font-semibold"}>
                                                            Customer Email:
                                                        </h3>
                                                    </div>
                                                    <div className={"w-9/12 sm:w-8/12"}>
                                                        <div className={"flex justify-between items-center"}>
                                                            <div className={"flex flex-col text-sm"}>
                                                                <span>{guestData}</span>
                                                            </div>
                                                            <div>
                                                                <Link href={"/shipping"}>
                                                                    <FaEdit className={"w-3"}/>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        <div className={"2xl:flex"}>
                                            <div
                                                className={"flex border-b-[1px] border-gray-300 py-3 w-full 2xl:w-6/12 2xl:h-32"}>
                                                <div className={"w-3/12 sm:w-4/12"}>
                                                    <h3 className={"font-semibold"}>
                                                        Ship To:
                                                    </h3>
                                                </div>
                                                <div className={"w-9/12 sm:w-8/12"}>
                                                    <div className={"flex justify-between h-full"}>
                                                        <div className={"flex flex-col text-sm"}>
                                                            <span>{shippingAddress.name}</span>
                                                            <span>{shippingAddress.address}</span>
                                                            <span>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</span>
                                                            <span>{shippingAddress.country}</span>
                                                        </div>
                                                        <div className={"2xl:self-end 2xl:pr-3"}>
                                                            {
                                                                !saveButtonDisabled && (
                                                                    <Link href={"/shipping"}>
                                                                        <FaEdit className={"w-3"}/>
                                                                    </Link>
                                                                )
                                                            }

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className={"flex border-b-[1px] border-gray-300 py-3 w-full 2xl:w-6/12 2xl:h-32"}>
                                                <div
                                                    className={"w-3/12 sm:w-4/12 xl:w-4/12 flex items-center 2xl:items-start"}>
                                                    <h3 className={"font-semibold pr-5"}>
                                                        Payment Service:
                                                    </h3>
                                                </div>
                                                <div className={"w-9/12 sm:w-8/12 xl:w-8/12"}>
                                                    <div className={"flex justify-between h-full"}>
                                                        <div className={"flex items-center 2xl:items-start"}>
                                                            <div className={"flex flex-col text-sm"}>
                                                                {
                                                                    paymentMethod === "PayPal / Credit Card" ? (
                                                                        <>
                                                                            <span className={"font-semibold"}>Paypal, Inc.</span>
                                                                            <span>(includes: Paypal, Venmo, Credit Card, etc.)</span>
                                                                        </>
                                                                    ) : paymentMethod === "Stripe / Credit Card" ? (
                                                                        <>
                                                                            <span className={"font-semibold"}>Stripe, Inc.</span>
                                                                            <span>(includes: Cash App, Afterpay, Credit Card, etc.)</span>
                                                                        </>
                                                                    ) : ""
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className={"flex items-start 2xl:items-end"}>
                                                            {
                                                                !saveButtonDisabled && (
                                                                    <Link href={"/payment"}>
                                                                        <FaEdit className={"w-3"}/>
                                                                    </Link>
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={"py-5"}>
                                            <h3 className={"font-semibold"}>
                                                Order Item(s):
                                            </h3>
                                            <div>
                                                {
                                                    cartItems.map(function (item) {
                                                        return (
                                                            <CheckoutItem saveButtonDisabled={saveButtonDisabled} item={item} key={item._id}/>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={"pb-2 sm:p-3 lg:pt-7 lg:pl-5 lg:w-5/12 2xl:w-4/12"}>
                                    {
                                        totalPrice > 100 || discount ? (
                                            <div className={"pb-3 px-2 sm:px-0"}>
                                                <Message variant={"success"}>
                                                    <span
                                                        className={"text-sm"}>Your order qualifies for FREE shipping!</span>
                                                </Message>
                                            </div>
                                        ) : (
                                            <div className={"pb-3 px-2 sm:px-0"}>
                                                <Message variant={"info"}>
                                                    <span className={"text-sm"}>Add <span
                                                        className={"font-bold"}>${(100 - totalPrice).toFixed(2)}</span> to your order to qualify for FREE shipping.
                                                    </span>
                                                </Message>
                                            </div>
                                        )
                                    }
                                    <div className={""}>
                                        <h3 className={"md:hidden pt-5 pb-0 md:py-2 text-3xl font-semibold text-center"}>
                                            Place Order
                                        </h3>
                                        <h3 className={"hidden md:block py-2 ibmplex text-2xl bg-zinc-700 text-white font-semibold text-center"}>
                                            Place Order
                                        </h3>
                                        <div className={"md:border md:shadow-lg bg-white"}>
                                            <div className="pt-0 px-6">
                                                <div className={"flex flex-col md:pt-6"}>
                                                    <div className={"md:hidden mt-5 mb-3"}/>
                                                    <div className={"flex justify-between text-sm my-1"}>
                                                        <span>Items({totalNumberOfItems}):</span>
                                                        <span className="pl-2">${itemsPrice}</span>
                                                    </div>
                                                    <div className={"flex justify-between text-sm my-1"}>
                                                        <span>Shipping flat rate:</span>
                                                        <span className="pl-2">${shippingPrice}</span>
                                                    </div>
                                                    <span className={"self-end w-16 my-1 border-b-[1px] border-grey-500"}/>
                                                    <div className={"flex justify-between text-sm my-1"}>
                                                        <span>Total before tax:</span>
                                                        <span
                                                            className="pl-2">${Number(itemsPrice + shippingPrice).toFixed(2)}</span>
                                                    </div>
                                                    <div className={"flex justify-between text-sm my-1"}>
                                                        <span>Estimated tax to be collected:</span>
                                                        <span className="pl-2">${taxPrice}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={"flex justify-between font-semibold text-lg px-6 pt-5 pb-6"}>
                                                <span className="text-red-600">Order Total:</span>
                                                <span className="text-red-600">${totalPrice}</span>
                                            </div>
                                            <div className={"px-6 pb-4"}>
                                                {
                                                    discount && (
                                                        <div className={"pb-10 w-full flex items-center justify-between"}>
                                                            <span className={"text-sm font-semibold"}>Discount code applied :D</span>
                                                            <div className={"pl-10"}>
                                                                <button onClick={() => submitRemoveDiscountCode()}
                                                                        className={"btn btn-sm text-xs rounded-full px-4 normal-case"}>
                                                                    Remove Discount
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                {
                                                    !discount && !saveButtonDisabled && (
                                                        <div className={"pb-10"}>
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
                                                        </div>
                                                    )
                                                }

                                                {
                                                    paymentMethod === "PayPal / Credit Card" && (
                                                        <div className={"px-4"}>
                                                            <PayPalScriptProvider options={initialOptions}>
                                                                <PaypalCheckout createNewOrder={() => createNewOrder()} setSaveButtonDisabled={setSaveButtonDisabled}/>
                                                            </PayPalScriptProvider>
                                                        </div>
                                                    )
                                                }
                                                {
                                                    paymentMethod === "Stripe / Credit Card" && (
                                                        <>
                                                            <div className={"pb-3 flex w-full justify-center items-center"}>
                                                                <div
                                                                    className={"flex justify-center items-center px-3 rounded-lg border-2 border-[#4f3cff]"}>
                                                                    <span className={"ibmplex text-sm text-[#4f3cff]"}>Powered by</span>
                                                                    <Image
                                                                        priority
                                                                        className={"w-16 h-auto"}
                                                                        src={stripe}
                                                                        alt={"stripe"}
                                                                        width={64}
                                                                        height={30}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <StripeCheckout setSaveButtonDisabled={setSaveButtonDisabled}/>
                                                        </>

                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        userData && !saveButtonDisabled && (
                                            <div className={"pt-3 px-2 sm:px-0"}>
                                                <div className={"alert flex rounded-sm w-full"}>
                                                    <div className={"flex items-center justify-start w-full"}>
                                                        <div className={"mr-1"}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                 viewBox="0 0 24 24"
                                                                 className="stroke-current shrink-0 w-6 h-6">
                                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                                      strokeWidth="2"
                                                                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                            </svg>
                                                        </div>
                                                        <div className={"w-full flex justify-between items-center"}>
                                                            <span className={"text-sm"}>Save order and pay later?</span>
                                                            <button
                                                                onClick={createNewUnpaidOrder}
                                                                disabled={cartItems.length === 0}
                                                                className={"btn btn-xs btn-neutral rounded-full !px-4 normal-case"}
                                                            >
                                                                Save Order
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    )
                }
            </>
        );
    }
    return <Loading/>
};

export default CheckoutPage;