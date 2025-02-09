import {useContext, useEffect, useState} from "react";
import GlobalContext from "@/context/GlobalContext";

const QuantitySelect = ({quantity, products, item}) => {

    const { dispatch } = useContext(GlobalContext);

    const [width, setWidth] = useState(window.innerWidth);
    const [quantityText, setQuantityText] = useState(window.innerWidth > 500 ? "Quantity:" : "Qty:");

    useEffect(() => {
        const adjustWidth = () => {
            setWidth(window.innerWidth)
        };
        window.addEventListener("resize", adjustWidth)
        return () => removeEventListener("resize", adjustWidth)
    }, []);


    useEffect(() => {
        width > 500 && width < 768 && setQuantityText("Qty:");
        width >= 768 && setQuantityText("Quantity:");
    }, [width]);

    const addToCartHandler = async (product, quantity) => {
        dispatch({
            type: "ADD_TO_CART",
            payload: {...product, quantity},
        });
        dispatch({type: "UPDATE_CART"});
        dispatch({type: "SET_LOCAL_STORAGE"});
    };

    return (
        <div className={"bg-zinc-100 rounded-md border-gray-200 border h-12 flex justify-start items-center px-2"}>
            <label htmlFor={`${item.id}`} className={"text-sm font-semibold pr-1"}>{quantityText}</label>
            <select
                id={`${item.id}`}
                className="bg-zinc-100 h-full w-full md:w-16 !outline-none text-sm cursor-pointer font-bold"
                value={quantity}
                onChange={(e) => addToCartHandler(item, Number(e.target.value))}
            >
                {
                    [...Array(products).keys()].map(function (x) {
                        return (
                            <option key={x+1} value={x+1}>
                                {x+1}
                            </option>
                        )
                    })
                }
            </select>
        </div>
    );
};

export default QuantitySelect;