"use client";

import React, {useContext, useEffect, useState} from 'react';
import GlobalContext from "@/context/GlobalContext";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import CheckoutItem from "@/app/checkout/components/CheckoutItem";
import StripeCheckout from "@/components/stripe/StripeCheckout";
import CheckoutSteps from "@/components/CheckoutSteps";
import PaypalCheckout from "@/components/paypal/PaypalCheckout";
import {PayPalScriptProvider} from "@paypal/react-paypal-js";
import {fetchDiscountValidity} from "@/utils/apiFetchRequests";
import {convertCentsToUSD} from "@/utils/covertCentsToUSD";
import {LuPartyPopper} from "react-icons/lu";
import {FiEdit} from "react-icons/fi";
import RevealMotion from "@/components/RevealMotion";
import Loading from "@/app/loading";
import Image from "next/image";
import usaFlag from "@/icons/usa.svg";
import {deliveryDateString} from "@/utils/formatDeliveryDate";
import CheckoutSaveBtn from "@/app/checkout/components/CheckoutSaveBtn";


const CheckoutPage = () => {

    const { user, dispatch, discountKey, discount, shippingAddress, paymentMethod, cartItems, taxPrice, shippingPrice, itemsPrice, totalPrice, guestEmail } = useContext(GlobalContext);
    const newOrder = { discountKey, user, guestEmail, cartItems, totalPrice, taxPrice, shippingPrice, itemsPrice, paymentMethod, shippingAddress }
    const router = useRouter();

    const [discountCode, setDiscountCode] = useState("");
    const [discountLabelActive, setDiscountLabelActive] = useState(false);
    const [discountLabelHover, setDiscountLabelHover] = useState(false);
    const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

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

    useEffect(() => {
        setMounted(true);
    }, []);


    const submitApplyDiscountCode = async () => {
        if (!discountCode.trim()) {
            toast.error("Blank code invalid!");
            return;
        }
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
        setDiscountLabelActive(false);
        setDiscountCode("");
        dispatch({type: "REMOVE_DISCOUNT"});
        dispatch({type: "UPDATE_CART"});
        dispatch({type: "SET_LOCAL_STORAGE"});
    };

    const initialOptions = {
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        currency: "USD",
        intent: "capture",
        enableFunding: "venmo",
    };

    if (loading) return <Loading/>;

    return (
        <>
            <CheckoutSteps/>
            <div className={"z-20 px-2 w-full flex-col flex items-center max-w-screen-2xl mx-auto gap-2 sm:gap-4 xl:flex-row xl:items-start xl:justify-center"}>
                <div className={"bg-white opacity-95 z-20 px-4 py-8 w-full max-w-3xl rounded-2xl sm:px-8 dark:bg-slate-800"}>
                    {
                        !mounted ? (
                            <div className="fadeInEffect flex w-full flex-col gap-5 h-full">
                                <div className="skeleton h-16 w-full bg-gray-300 dark:bg-gray-200"/>
                                <div className={"flex justify-between"}>
                                    <div className="skeleton h-4 w-3/12 bg-gray-300 dark:bg-gray-200"/>
                                    <div className="skeleton h-4 w-7/12 bg-gray-300 dark:bg-gray-200"/>
                                </div>
                                <div className="skeleton h-4 w-full bg-gray-300 dark:bg-gray-200"/>
                                <div className={"flex justify-between"}>
                                    <div className="skeleton h-4 w-3/12 bg-gray-300 dark:bg-gray-200"/>
                                    <div className="skeleton h-4 w-7/12 bg-gray-300 dark:bg-gray-200"/>
                                </div>
                                <div className="skeleton h-4 w-full bg-gray-300 dark:bg-gray-200"/>
                                <div className={"flex justify-between"}>
                                    <div className="skeleton h-4 w-3/12 bg-gray-300 dark:bg-gray-200"/>
                                    <div className="skeleton h-4 w-7/12 bg-gray-300 dark:bg-gray-200"/>
                                </div>
                                <div className="skeleton h-4 w-full bg-gray-300 dark:bg-gray-200"/>
                                <div className={"flex justify-between"}>
                                    <div className="skeleton h-4 w-3/12 bg-gray-300 dark:bg-gray-200"/>
                                    <div className="skeleton h-4 w-7/12 bg-gray-300 dark:bg-gray-200"/>
                                </div>
                                <div className="skeleton h-4 w-28 bg-gray-300 dark:bg-gray-200"/>
                                <div className="skeleton h-40 w-full bg-gray-300 dark:bg-gray-200"/>
                            </div>
                        ) : (
                            <RevealMotion y={25}>
                                <h1 className={"h-16 flex items-start justify-center font-semibold text-3xl dark:text-white"}>
                                    Review your order
                                </h1>
                                {
                                    !user && guestEmail && (
                                        <div className={"flex flex-col border-b border-gray-300 py-3 gap-2 sm:gap-0 sm:flex-row dark:text-white"}>
                                            <div className={"w-full justify-center flex items-center sm:justify-start sm:w-4/12"}>
                                                <h3 className={"font-semibold"}>
                                                    Customer Email
                                                </h3>
                                            </div>
                                            <div className={"w-full sm:w-8/12"}>
                                                <div className={"flex justify-between items-center"}>
                                                    <div className={"flex flex-col text-sm"}>
                                                        <span>{guestEmail}</span>
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
                                <div
                                    className={"flex flex-col border-b border-gray-300 py-3 sm:flex-row dark:text-white"}>
                                    <div
                                        className={"w-full justify-center flex items-center sm:justify-start sm:w-4/12"}>
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
                                <div
                                    className={"flex flex-col border-b border-gray-300 py-3 gap-2 sm:gap-0 sm:flex-row dark:text-white"}>
                                    <div
                                        className={"w-full justify-center flex items-center sm:justify-start sm:w-4/12"}>
                                        <h3 className={"font-semibold"}>
                                            Delivery Service
                                        </h3>
                                    </div>
                                    <div className={"w-full sm:w-8/12"}>
                                        <div className={"flex justify-between gap-4"}>
                                            <div className={"flex flex-col text-sm dark:text-white"}>
                                                <span>United States Postal Service</span>
                                                <span>Standard, between {deliveryDateString()}</span>
                                            </div>
                                            <div className={"flex items-center"}>
                                                <Image
                                                    src={usaFlag}
                                                    alt={"usa"}
                                                    width={50}
                                                    height={50}
                                                    className={"w-10 h-8"}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className={"flex flex-col border-b border-gray-300 py-3 sm:flex-row dark:text-white"}>
                                    <div
                                        className={"w-full justify-center flex items-center sm:justify-start sm:w-4/12"}>
                                        <h3 className={"font-semibold"}>
                                            Payment Authorizer
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
                                    <h3 className={"text-center font-semibold sm:text-start dark:text-white"}>
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
                            </RevealMotion>
                        )
                    }
                </div>

                <div className={"flex flex-col items-center gap-2 w-full sm:gap-4 sm:max-w-lg"}>
                    <div
                        className={"z-20 px-4 bg-opacity-80 bg-[#7c3cfc] w-full text-white mx-auto h-20 rounded-2xl flex justify-center items-center sm:bg-opacity-90"}>
                        {
                            !mounted ? (
                                <div className="fadeInEffect gap-3 flex w-full flex-col justify-center h-full">
                                    <div className="skeleton h-6 w-full bg-gray-300 dark:bg-gray-200"/>
                                </div>
                            ) : (
                                <RevealMotion y={25} childClass={"w-full flex justify-center"}>
                                    {
                                        itemsPrice > 10000 ? (
                                            <div className={"text-center flex items-center gap-2"}>
                                                Your order qualifies for FREE shipping!
                                                <LuPartyPopper size={30}/>
                                            </div>
                                        ) : (
                                            <div className={"text-center"}>
                                                <span>Add <span
                                                    className={"font-bold"}>{convertCentsToUSD(10000 - itemsPrice)}</span> to your order to qualify for FREE shipping.</span>
                                            </div>
                                        )
                                    }
                                </RevealMotion>
                            )
                        }
                    </div>
                    <div
                        className={"bg-white opacity-95 z-20 px-4 py-8 w-full rounded-2xl sm:px-8 dark:bg-slate-800"}>
                        {
                            !mounted ? (
                                <div className="fadeInEffect flex w-full flex-col gap-5 h-full">
                                    <div className="skeleton h-16 w-full bg-gray-300 dark:bg-gray-200"/>
                                    <div className={"flex justify-between"}>
                                        <div className="skeleton h-4 w-3/12 bg-gray-300 dark:bg-gray-200"/>
                                        <div className="skeleton h-4 w-7/12 bg-gray-300 dark:bg-gray-200"/>
                                    </div>
                                    <div className="skeleton h-4 w-full bg-gray-300 dark:bg-gray-200"/>
                                    <div className={"flex justify-between"}>
                                        <div className="skeleton h-4 w-3/12 bg-gray-300 dark:bg-gray-200"/>
                                        <div className="skeleton h-4 w-7/12 bg-gray-300 dark:bg-gray-200"/>
                                    </div>
                                    <div className="skeleton h-4 w-full bg-gray-300 dark:bg-gray-200"/>
                                    <div className={"flex justify-between"}>
                                        <div className="skeleton h-4 w-3/12 bg-gray-300 dark:bg-gray-200"/>
                                        <div className="skeleton h-4 w-7/12 bg-gray-300 dark:bg-gray-200"/>
                                    </div>
                                    <div className="skeleton h-4 w-full bg-gray-300 dark:bg-gray-200"/>
                                    <div className={"flex justify-between"}>
                                        <div className="skeleton h-4 w-3/12 bg-gray-300 dark:bg-gray-200"/>
                                        <div className="skeleton h-4 w-7/12 bg-gray-300 dark:bg-gray-200"/>
                                    </div>
                                    <div className="skeleton h-4 w-6/12 bg-gray-300 dark:bg-gray-200"/>
                                    <div className="skeleton h-10 w-full bg-gray-300 dark:bg-gray-200"/>
                                    <div className="skeleton h-10 w-full bg-gray-300 dark:bg-gray-200"/>
                                    <div className="skeleton h-10 w-full bg-gray-300 dark:bg-gray-200"/>
                                    <div className="skeleton h-10 w-full bg-gray-300 dark:bg-gray-200"/>
                                </div>
                            ) : (
                                <RevealMotion y={25}>
                                    <h1 className={"h-16 flex items-start justify-center font-semibold text-3xl dark:text-white"}>
                                        Place Order
                                    </h1>
                                    <div className="flex flex-col gap-8 dark:text-white">
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
                                                    <div className={"font-semibold text-xs sm:text-sm"}>Discount code applied!</div>
                                                    <button
                                                        onClick={() => submitRemoveDiscountCode()}
                                                        className={"btn btn-sm rounded-full px-4 normal-case text-xs sm:text-sm"}
                                                    >
                                                        Remove Discount
                                                    </button>
                                                </div>
                                            )
                                        }
                                        {
                                            !discount && !saveButtonDisabled && (
                                                <div className={"flex w-full items-end gap-6 lg:gap-10"}>
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
                                                            className={`${discountLabelHover ? "text-gray-700" : "text-gray-500"} after:content[''] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-[14px] peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:after:scale-x-100 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 dark:peer-focus:text-indigo-500 dark:peer-focus:after:border-indigo-500`}>
                                                            {discountLabelActive ? "Discount code" : "Have a discount code?"}
                                                        </label>
                                                    </div>
                                                    <button
                                                        onClick={submitApplyDiscountCode}
                                                        className={"font-semibold text-xs sm:text-sm"}
                                                    >
                                                        Apply
                                                    </button>
                                                </div>
                                            )
                                        }
                                        {
                                            paymentMethod === "PayPal / Credit Card" && (
                                                <div style={{colorScheme: 'none'}} className={"px-4"}>
                                                    <PayPalScriptProvider options={initialOptions}>
                                                        <PaypalCheckout
                                                            newOrder={newOrder}
                                                            existingOrder={null}
                                                            setSaveButtonDisabled={setSaveButtonDisabled}
                                                        />
                                                    </PayPalScriptProvider>
                                                </div>
                                            )
                                        }
                                        {
                                            paymentMethod === "Stripe / Credit Card" && (
                                                <StripeCheckout
                                                    newOrder={newOrder}
                                                    existingOrder={null}
                                                    setSaveButtonDisabled={setSaveButtonDisabled}
                                                    setOrder={() => null}
                                                />
                                            )
                                        }
                                    </div>
                                </RevealMotion>
                            )
                        }
                    </div>
                    {
                        mounted && !saveButtonDisabled && (
                            <CheckoutSaveBtn
                                newOrder={newOrder}
                                setLoading={setLoading}
                            />
                        )
                    }
                </div>
            </div>
        </>
    );
};

export default CheckoutPage;

