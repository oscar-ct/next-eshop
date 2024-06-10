import Message from "./Message";
import {useContext} from "react";
import GlobalContext from "@/context/GlobalContext";
import {convertCentsToUSD} from "@/utils/covertCentsToUSD";

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
                cartItems.length !== 0 && itemsPrice < 10000 && (
                    <Message variant={"info"} border={"h-12"}>
                        <span className={"text-xs sm:text-sm"}>Add <span className={"font-bold"}>{convertCentsToUSD(10000 - itemsPrice)}</span> to your order to qualify for FREE shipping.</span>
                    </Message>
                )
            }
            {
                cartItems.length !== 0 && itemsPrice >= 10000 && (
                    <Message variant={"success"} border={"h-12"}>
                        <span className={"text-xs sm:text-sm"}>Congratulations! Your order qualifies for FREE shipping.</span>
                    </Message>
                )
            }
        </div>
    );
};

export default BackButtonMessage;