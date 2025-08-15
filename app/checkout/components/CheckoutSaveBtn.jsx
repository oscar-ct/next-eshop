import RevealMotion from "@/components/RevealMotion";
import {LiaSave} from "react-icons/lia";
import toast from "react-hot-toast";
import {fetchNewOrder} from "@/utils/apiFetchRequests";
import {useRouter} from "next/navigation";
import {getDiscountStatus, getVerifiedTotalPrice} from "@/utils/priceValidation";

const CheckoutSaveBtn = ({ newOrder, setLoading, }) => {

    const router = useRouter();

    const createOrder = async () => {
        const discountResponse = await getDiscountStatus(null, newOrder);
        const totalPriceResponse = await getVerifiedTotalPrice(null, newOrder, discountResponse);
        const orderPayload = {
            user: newOrder.user ? { id: newOrder.user.id } : { email: newOrder.guestEmail },
            orderItems: newOrder.cartItems,
            shippingAddress: newOrder.shippingAddress,
            paymentMethod: newOrder.paymentMethod,
            itemsPrice: newOrder.itemsPrice,
            shippingPrice: newOrder.shippingPrice,
            taxPrice: newOrder.taxPrice,
            totalPrice: totalPriceResponse,
            validCode: discountResponse,
        }
        const orderResponse = await fetchNewOrder(orderPayload);
        return orderResponse ? orderResponse.id : null;
    };


    const submitCreateNewUnpaidOrder = async () => {
        if (!newOrder.user) {
            toast.error("You must be signed in to save an order");
            router.push("/register");
            return;
        }
        setLoading(true);
        const orderId = await createOrder();
        if (orderId) {
            router.push(`/orders/${orderId}/payment?${newOrder.paymentMethod === "Stripe / Credit Card" ? "stripe" : "paypal"}=unsuccessful`);
        }
        setLoading(false);
    };

    return (
        <RevealMotion y={25} parentClass={"w-full z-20"}>
            <div
                className={"px-4 bg-opacity-90 bg-zinc-500 w-full text-white mx-auto h-20 rounded-2xl flex justify-center items-center sm:bg-opacity-90"}>
                <div className={"text-center flex items-center gap-2"}>
                    Save this order and pay later?
                    <button
                        onClick={submitCreateNewUnpaidOrder}
                        disabled={newOrder.cartItems.length === 0}
                        className={"btn btn-sm rounded-full normal-case"}
                    >
                        <LiaSave size={24}/>
                    </button>
                </div>
            </div>
        </RevealMotion>
    );
};

export default CheckoutSaveBtn;