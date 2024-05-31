import Message from "./Message";
import {useContext} from "react";
import GlobalContext from "@/context/GlobalContext";

const BackButtonMessage = ({width = ""}) => {

    const { cartItems, itemsPrice } = useContext(GlobalContext);

    return (
        <div className={`absolute right-0 pl-2 pr-3 pt-3 ${width}`}>
            {
                cartItems.length === 0 && (
                    <Message variant={"info"} border={"h-12"}>
                        <span className={"text-xs sm:text-sm"}>FREE shipping on qualifying orders over $100.</span>
                    </Message>
                )
            }
            {
                cartItems.length !== 0 && itemsPrice < 100 && (
                    <Message variant={"info"} border={"h-12"}>
                        <span className={"text-xs sm:text-sm"}>Add <span className={"font-bold"}>${(100 - itemsPrice).toFixed(2)}</span> to your order to qualify for FREE shipping.</span>
                    </Message>
                )
            }
            {
                cartItems.length !== 0 && itemsPrice >= 100 && (
                    <Message variant={"success"} border={"h-12"}>
                        <span className={"text-xs sm:text-sm"}>Congratulations! Your order qualifies for FREE shipping.</span>
                    </Message>
                )
            }
        </div>
    );
};

export default BackButtonMessage;