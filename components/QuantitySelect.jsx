import {useContext} from "react";
import GlobalContext from "@/context/GlobalContext";
import useWindowDimensions from "@/hooks/useWindowDimensions";

const QuantitySelect = ({quantity, products, item}) => {

    const { dispatch } = useContext(GlobalContext);
    const {width} = useWindowDimensions();

    const addToCartHandler = async (product, quantity) => {
        dispatch({
            type: "ADD_TO_CART",
            payload: {...product, quantity},
        });
        dispatch({type: "UPDATE_CART"});
        dispatch({type: "SET_LOCAL_STORAGE"});
    };

    return (
        <div className={"bg-zinc-50 rounded-md border-gray-200 border h-12 flex justify-start items-center px-1 sm:px-2"}>
            <label htmlFor={`${item.id}`} className={"text-sm font-semibold pr-1"}>{width < 768 ? "Qty:" : "Quantity:"}</label>
            <select
                id={`${item.id}`}
                className="bg-zinc-50 h-full w-full max-w-16 !outline-none text-sm cursor-pointer font-bold"
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