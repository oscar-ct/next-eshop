"use client"

import {useState, useEffect, useCallback, useContext} from "react";
import {PaymentElement, LinkAuthenticationElement, useStripe, useElements} from "@stripe/react-stripe-js";
import CustomBtn from "./CustomBtn";
import {toast} from "react-hot-toast";
import GlobalContext from "@/context/GlobalContext";
import {useRouter} from "next/navigation";
import {
    fetchDiscountValidity,
    fetchNewOrder,
    fetchPayOrder, fetchStripePaymentIntent,
    fetchVerifiedOrderDollarAmount
} from "@/utils/api-requests/fetchRequests";
import Image from "next/image";
import stripelogo from "@/icons/stripe-logo.svg";
import {motion} from "framer-motion";
import {convertCentsToUSD} from "@/utils/covertCentsToUSD";



const StripeCheckoutForm = ({ existingOrder, setSaveButtonDisabled, setOrder }) => {

    const stripe = useStripe();
    const elements = useElements();

    const { user: userData, dispatch, discountKey, cartItems, totalPrice, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, guestData, token } = useContext(GlobalContext);

    const router = useRouter();

    const [message, setMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState();
    const [loadingBtn, setLoadingBtn] = useState(false);
    const [clientHasSecret, setClientHasSecret] = useState(false);
    const [paymentFailed, setPaymentFailed] = useState(false);

    const placeNewOrder = useCallback(async (clientSecret, token) => {
        const res = await fetchDiscountValidity({discountKey: discountKey});
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
        const body = {
            user,
            orderItems: cartItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
            validCode: res ? res.validCode : false,
            clientSecret: clientSecret || "invalid",
            token: token || "invalid",
        }
        const newOrder = await fetchNewOrder(body);
        if (!newOrder) return null;
        return newOrder.id;
    }, [cartItems, discountKey, itemsPrice, paymentMethod, shippingAddress, shippingPrice, taxPrice, totalPrice, userData, guestData]);

    useEffect( () => {
        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );
        if (!clientSecret) {
            setSaveButtonDisabled(false);
            return;
        } else {
            setSaveButtonDisabled(true);
            setClientHasSecret(true);
        }
        if (!stripe) {
            return;
        }
        if (clientSecret) {
            stripe.retrievePaymentIntent(clientSecret).then(async ({paymentIntent}) => {
                switch (paymentIntent.status) {
                    case "succeeded": {
                        const details = {
                            id: paymentIntent.id,
                            status: paymentIntent.status,
                            update_time: paymentIntent.created.toString(),
                        };
                        if (!existingOrder) {
                            const orderId = await placeNewOrder(clientSecret, token);
                            if (!orderId) return router.push("/");
                            setMessage("Your payment is processing...");
                            const order = await fetchPayOrder({orderId: orderId, details, clientSecret, token});
                            if (order) {
                                setMessage("Payment succeeded! 🎉");
                                router.push(`/orders/${order.id}/payment?stripe=successful`);
                            }
                        } else {
                            if (!existingOrder.isPaid) {
                                const order = await fetchPayOrder({orderId: existingOrder.id, details, clientSecret, token});
                                if (order) {
                                    setOrder(order);
                                }
                            }

                        }
                        break;
                    }
                    case "processing": {
                        setMessage("Your payment is processing.");
                        break;
                    }
                    case "requires_payment_method": {
                        setPaymentFailed(true);
                        setMessage("Your payment was not successful, please try again.");
                        break;
                    }

                    default: {
                        setMessage("Something went wrong.");
                        setPaymentFailed(true);
                        break;
                    }
                }
            });
        }
    }, [stripe, dispatch, placeNewOrder, existingOrder, router]);

    const handleError = (error) => {
        setLoadingBtn(false);
        setErrorMessage(error.message);
        setSaveButtonDisabled(false);
    };

    const handlePriceError = () => {
        toast.error("Something went wrong, please try again later.");
        setLoadingBtn(false);
        setSaveButtonDisabled(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }
        setLoadingBtn(true);
        setSaveButtonDisabled(true);
        // Trigger form validation and wallet collection
        const {error: submitError} = await elements.submit();
        if (submitError) {
            handleError(submitError);
            return;
        }
        // Create the PaymentIntent and obtain clientSecret
        let isDiscounted;
        if (!existingOrder) {
            const discount = await fetchDiscountValidity({discountKey: discountKey});
            isDiscounted = discount.validCode;
        }

        const totalPriceFromBackend = await fetchVerifiedOrderDollarAmount({
            orderItems: existingOrder ? existingOrder.orderItems.filter((item) => !item.isCanceled) : cartItems,
            validCode : existingOrder ? existingOrder.freeShipping : isDiscounted,
            isNewOrder: !existingOrder
        });
        if (!existingOrder) {
            if (totalPriceFromBackend !== totalPrice) {
                handlePriceError();
                return;
            }
        } else {
            if (totalPriceFromBackend !== existingOrder.totalPrice) {
                handlePriceError();
                return;
            }
        }
        const {clientSecret, token} = await fetchStripePaymentIntent({totalPriceFromBackend});

        dispatch({type: "SET_TOKEN", payload: token});
        dispatch({type: "SET_LOCAL_STORAGE"});

        // Confirm the PaymentIntent using the details collected by the Payment Element
        const {error} = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: existingOrder ? `${window.location.origin}/orders/${existingOrder.id}` : `${window.location.origin}/checkout`,
            },
        });
        if (error) {
            // This point is only reached if there's an immediate error when
            // confirming the payment. Show the error to your customer (for example, payment details incomplete)
            handleError(error);
        } else {
            console.log("This is active")
            // Your customer is redirected to your `return_url`. For some payment
            // methods like iDEAL, your customer is redirected to an intermediate
            // site first to authorize the payment, then redirected to the `return_url`.
        }
    };

    const paymentElementOptions = {
        layout: "tabs",
    };

    const linkAuthenticationElementOptions = {
        defaultValues: {
            email: userData ? userData.email : ""
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {
                !clientHasSecret && (
                    <>
                        <motion.div className={"pb-3 flex w-full justify-center items-center"}
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    transition={{delay: 1}}
                                    exit={{opacity: 0}}
                        >
                            <div
                                className={"flex justify-center items-center px-3 rounded-lg border-2 border-[#4f3cff]"}>
                                <span className={"ibmplex text-sm text-[#4f3cff]"}>Powered by</span>
                                <Image
                                    priority
                                    className={"w-16 h-auto"}
                                    src={stripelogo}
                                    alt={"stripe"}
                                    width={40}
                                    height={10}
                                />
                            </div>
                        </motion.div>
                        <LinkAuthenticationElement options={linkAuthenticationElementOptions} className={"pb-5"}/>
                        <PaymentElement className={"pb-3"} options={paymentElementOptions}/>
                        <div className={"flex justify-center"}>
                            <CustomBtn customClass={"w-full flex justify-center items-center my-3"} type={"submit"}
                                       isDisabled={loadingBtn || !stripe || !elements}>
                                {
                                    loadingBtn ? <span
                                        className="flex items-center loading loading-bars loading-sm"/> : `Pay Now - (${existingOrder ? convertCentsToUSD(existingOrder.totalPrice) : convertCentsToUSD(totalPrice)})`
                                }
                            </CustomBtn>
                        </div>
                    </>
                )
            }
            {
                (errorMessage || message) && (
                    <div
                        className={`text-center leading-[20px] text-lg py-4 ${errorMessage ? "text-red-600" : "font-bold"}`}>
                        {errorMessage || message}
                    </div>
                )
            }
            {
                paymentFailed && (
                    <div className={"pt-6"}>
                        <CustomBtn customClass={"w-full"} type={"button"} onClick={(e) => {
                            e.preventDefault();
                            window.location.href = existingOrder ? `${window.location.origin}/order/${existingOrder.id}` : `${window.location.origin}/checkout`
                        }}>
                            Try Again
                        </CustomBtn>
                    </div>
                )
            }
        </form>
    );
};

export default StripeCheckoutForm;