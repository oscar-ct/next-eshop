"use client"

import {useState, useEffect, useCallback, useContext} from "react";
import {PaymentElement, LinkAuthenticationElement, useStripe, useElements} from "@stripe/react-stripe-js";
import Btn from "../Btn";
import GlobalContext from "@/context/GlobalContext";
import {useRouter} from "next/navigation";
import {fetchNewOrder, fetchPayOrder, fetchStripePaymentIntent} from "@/utils/apiFetchRequests";
import Image from "next/image";
import stripeLogo from "@/icons/stripe-logo.svg";
import {motion} from "framer-motion";
import {convertCentsToUSD} from "@/utils/covertCentsToUSD";
import {getDiscountStatus, getVerifiedTotalPrice} from "@/utils/priceValidation";



const StripeCheckoutForm = ({ newOrder, existingOrder, setSaveButtonDisabled, setOrder }) => {

    const stripe = useStripe();
    const elements = useElements();
    const { dispatch, authToken } = useContext(GlobalContext);
    const router = useRouter();

    const [statusMessage, setStatusMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isClientSecretPresent, setIsClientSecretPresent] = useState(false);
    const [isPaymentFailed, setIsPaymentFailed] = useState(false);


    const createNewOrder = useCallback(async (stripeClientSecret, authToken) => {
        const discountResponse = await getDiscountStatus(existingOrder, newOrder);
        const totalPriceResponse = await getVerifiedTotalPrice(existingOrder, newOrder, discountResponse);
        if (!totalPriceResponse) {
            setSaveButtonDisabled(false);
            return;
        }
        const orderPayload = {
            user: newOrder.userId ? { id: newOrder.userId } : { email: newOrder.guestEmail },
            orderItems: newOrder.cartItems,
            shippingAddress: newOrder.shippingAddress,
            paymentMethod: newOrder.paymentMethod,
            itemsPrice: newOrder.itemsPrice,
            shippingPrice: newOrder.shippingPrice,
            taxPrice: newOrder.taxPrice,
            totalPrice: totalPriceResponse,
            validCode: discountResponse,
            stripeClientSecret: stripeClientSecret || "invalid",
            authToken: authToken || "invalid",
        }
        const orderResponse = await fetchNewOrder(orderPayload);
        return orderResponse ? orderResponse.id : null;
    }, [existingOrder, newOrder, getDiscountStatus, getVerifiedTotalPrice, setSaveButtonDisabled, fetchNewOrder]);


    // Effect to handle payment intent status on page load
    useEffect( () => {
        // Extract client secret from URL query params
        const stripeClientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );
        if (!stripeClientSecret) {
            setSaveButtonDisabled(false);
            return;
        } else {
            setSaveButtonDisabled(true);
            setIsClientSecretPresent(true);
        }
        if (!stripe) {
            return;
        }
        if (stripeClientSecret) {
            stripe.retrievePaymentIntent(stripeClientSecret).then(async ({paymentIntent}) => {
                switch (paymentIntent.status) {
                    case "succeeded": {
                        const paymentDetails = {
                            id: paymentIntent.id,
                            status: paymentIntent.status,
                            update_time: paymentIntent.created.toString(),
                        };
                        if (!existingOrder) {
                            // Create new order if none exists
                            const orderId = await createNewOrder(stripeClientSecret, authToken);
                            if (!orderId) return router.push("/");

                            setStatusMessage("Your payment is processing...");
                            const updatedOrder = await fetchPayOrder({orderId: orderId, paymentDetails, stripeClientSecret, authToken});
                            if (updatedOrder) {
                                setStatusMessage("Payment succeeded! 🎉");
                                router.push(`/orders/${updatedOrder.id}/payment?stripe=successful`);
                            }
                        } else if (!existingOrder.isPaid) {
                            // Update existing unpaid order
                            const updatedOrder = await fetchPayOrder({orderId: existingOrder.id, paymentDetails, stripeClientSecret, authToken});
                            if (updatedOrder) setOrder(updatedOrder);
                        }
                        break;
                    }
                    case "processing": {
                        setStatusMessage("Your payment is processing.");
                        break;
                    }
                    case "requires_payment_method": {
                        setIsPaymentFailed(true);
                        setStatusMessage("Your payment was not successful, please try again.");
                        break;
                    }

                    default: {
                        setStatusMessage("Something went wrong.");
                        setIsPaymentFailed(true);
                        break;
                    }
                }
            });
        }
    }, [stripe, existingOrder, router, authToken, createNewOrder]);


    const handlePaymentError = (error) => {
        setIsLoading(false);
        setErrorMessage(error.message);
        setSaveButtonDisabled(false);
    };


    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        if (!stripe) return; // Exit if Stripe.js hasn't loaded
        setIsLoading(true); // Show loading state
        setSaveButtonDisabled(true); // Disable save button
        // Validate and collect payment details
        const {error: submitError} = await elements.submit();
        if (submitError) {
            handlePaymentError(submitError);
            return;
        }
        // Create PaymentIntent
        const discountResponse = await getDiscountStatus(existingOrder, newOrder);
        const totalPriceResponse = await getVerifiedTotalPrice(existingOrder, newOrder, discountResponse);
        if (!totalPriceResponse) {
            setIsLoading(false);
            setSaveButtonDisabled(false);
            return;
        }
        const { stripeClientSecret, authToken } = await fetchStripePaymentIntent({verifiedTotalPrice: totalPriceResponse});
        // Update global state with new token
        dispatch({type: "SET_AUTH_TOKEN", payload: authToken});
        dispatch({type: "SET_LOCAL_STORAGE"});
        // Confirm payment with Stripe
        const {error} = await stripe.confirmPayment({
            elements,
            clientSecret: stripeClientSecret,
            confirmParams: {
                return_url: existingOrder ? `${window.location.origin}/orders/${existingOrder.id}` : `${window.location.origin}/checkout`,
            },
        });
        if (error) {
            // This point is only reached if there's an immediate error when confirming the payment.
            handlePaymentError(error);
        } else {
            console.log("Payment confirmation initiated"); // Log for debugging
        }
    };


    // Configuration for Stripe elements
    const paymentElementConfig = { layout: "tabs" };
    let emailDefaultValue = "";
    if (existingOrder) {
        emailDefaultValue = existingOrder.user?.email || (!existingOrder.user && existingOrder.email) || "";
    } else if (newOrder) {
        emailDefaultValue = newOrder.user?.email || newOrder.guestEmail || "";
    }
    const linkAuthElementConfig = { defaultValues: { email: emailDefaultValue} };

    return (
        <form onSubmit={handlePaymentSubmit} aria-busy={isLoading}>
            {
                !isClientSecretPresent && (
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
                                    src={stripeLogo}
                                    alt={"stripe"}
                                    width={40}
                                    height={10}
                                />
                            </div>
                        </motion.div>
                        <LinkAuthenticationElement options={linkAuthElementConfig} className={"pb-5"}/>
                        <PaymentElement className={"pb-3"} options={paymentElementConfig}/>
                        <div className={"flex justify-center"}>
                            <Btn customClass={"w-full flex justify-center items-center my-3"} type={"submit"}
                                 isDisabled={isLoading || !stripe || !elements}>
                                {
                                    isLoading ? <span
                                        className="flex items-center loading loading-bars loading-sm"/> : `Pay Now - (${existingOrder ? convertCentsToUSD(existingOrder.totalPrice) : convertCentsToUSD(newOrder.totalPrice)})`
                                }
                            </Btn>
                        </div>
                    </>
                )
            }
            {
                (errorMessage || statusMessage) && (
                    <div
                        className={`text-center leading-[20px] text-lg py-4 ${errorMessage ? "text-red-600" : "font-bold"}`}>
                        {errorMessage || statusMessage}
                    </div>
                )
            }
            {
                isPaymentFailed && (
                    <div className={"pt-6"}>
                        <Btn customClass={"w-full"} type={"button"} onClick={(e) => {
                            e.preventDefault();
                            window.location.href = existingOrder ? `${window.location.origin}/order/${existingOrder.id}` : `${window.location.origin}/checkout`
                        }}>
                            Try Again
                        </Btn>
                    </div>
                )
            }
        </form>
    );
};

export default StripeCheckoutForm;