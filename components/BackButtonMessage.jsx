import {useContext, useEffect, useState} from "react";
import GlobalContext from "@/context/GlobalContext";
import {convertCentsToUSD} from "@/utils/covertCentsToUSD";
import {LuPartyPopper} from "react-icons/lu";

const BackButtonMessage = ({width = ""}) => {

    const { cartItems, itemsPrice } = useContext(GlobalContext);
    const [mounted, setMounted] = useState(false);
    useEffect(() => {setMounted(true)}, [])

    return (
        <div className={`absolute right-0 pl-2 pr-3 pt-3 ${width}`}>
            <div className={"z-20 bg-opacity-80 bg-[#7c3cfc] text-white mx-auto w-full h-12 rounded-2xl flex justify-center items-center text-xs sm:text-base sm:shadow-md"}>
                {
                    !mounted ? (
                        <span className="z-30 loading loading-bars loading-sm"/>
                    ) : (
                        <>
                        {
                                cartItems.length === 0 && (
                                    <span>Spend $100 or more to qualify for FREE shipping</span>
                                )
                            }
                            {
                                cartItems.length !== 0 && itemsPrice < 10000 && (
                                    <div className={"text-center"}>
                                        <span>Add <span className={"font-bold"}>{convertCentsToUSD(10000 - itemsPrice)}</span> to your order to qualify for FREE shipping.</span>
                                    </div>
                                )
                            }
                            {
                                cartItems.length !== 0 && itemsPrice >= 10000 && (
                                    (
                                        <div className={"text-center flex items-center gap-2"}>
                                            Your order qualifies for FREE shipping!
                                            <LuPartyPopper size={30}/>
                                        </div>
                                    )
                                )
                            }
                        </>
                    )
                }
            </div>
        </div>
    );
};

export default BackButtonMessage;