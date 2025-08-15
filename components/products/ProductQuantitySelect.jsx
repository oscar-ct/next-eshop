import {useContext} from "react";
import GlobalContext from "@/context/GlobalContext";

const ProductQuantitySelect = ({quantity, products, item}) => {

    const { dispatch } = useContext(GlobalContext);

    const addToCartHandler = async (product, quantity) => {
        dispatch({
            type: "ADD_TO_CART",
            payload: {...product, quantity},
        });
        dispatch({type: "UPDATE_CART"});
        dispatch({type: "SET_LOCAL_STORAGE"});
    };

    return (
        <div className={"bg-zinc-100 rounded-md h-10 flex justify-start items-center px-1 sm:px-2 dark:bg-slate-600 dark:text-white"}>
            <label htmlFor={`${item.id}`} className={"text-sm font-semibold pr-1"}>Qty:</label>
            <select
                id={`${item.id}`}
                className="bg-zinc-100 h-full w-full max-w-16 !outline-none text-sm cursor-pointer font-semibold dark:bg-slate-600 dark:text-white"
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

export default ProductQuantitySelect;