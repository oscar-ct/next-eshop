import Link from "next/link";
import {FaTrash} from "react-icons/fa";
import QuantitySelect from "@/components/QuantitySelect";
import FormatPrice from "@/components/FormatPrice";
import Image from 'next/image';
import {useContext} from "react";
import GlobalContext from "@/context/GlobalContext";


const CartItem = ( {item} ) => {

    const { dispatch } = useContext(GlobalContext);

    const removeFromCartHandler = async (product) => {
        dispatch({
            type: "REMOVE_FROM_CART",
            payload: product,
        });
        dispatch({type: "UPDATE_CART"});
        dispatch({type: "SET_LOCAL_STORAGE"});
    };

    return (
        <>
            <div className={"flex w-full"}>
                <div className={"w-3/12 flex justify-center items-center"}>
                    <Link className={"bg-zinc-100/70 rounded-md max-w-[175px] max-h-[160px]"} href={`/products/${item._id}`}>
                        <Image
                            priority
                            src={item.images.length !== 0 ? item.images[0].url : "/images/sample.jpg"}
                            alt={"cartItem"}
                            width={0}
                            height={0}
                            className={"rounded-md w-full h-auto"}
                            sizes="100vw"
                        />
                    </Link>
                </div>

                <div className={"w-7/12"}>
                    <div className={"flex flex-col px-5"}>
                        <Link href={`/products/${item._id}`} className={"lg:text-lg font-bold hover:link hover:link-primary"}>
                            {item.name}
                        </Link>

                        <div className={"flex flex-col lg:pt-3"}>
                            <div className={"flex flex-col text-xs sm:text-sm"}>
                                <div className={"pb-1"}>
                                    <span className={"text-xs font-bold text-gray-500"}>Brand:</span>
                                    <span className={"ml-1"}>{item.brand}</span>
                                </div>
                                <div className={"pb-1"}>
                                    <span className={"text-xs font-bold text-gray-500"}>Model:</span>
                                    <span className={"ml-1 "}>{item.model}</span>
                                </div>
                            </div>
                            <div className={"flex flex-col text-xs sm:text-sm"}>
                                <div className={"flex items-center pb-1"}>
                                     <span className={"text-xs font-bold text-gray-500"}>Remaining In Stock:</span>
                                    <span className={"ml-1"}>{item.countInStock}</span>
                                </div>
                                <div>
                                    <span className={"text-xs font-bold text-gray-500"}>List Price:</span>
                                    <span className={"ml-1"}>${item.price}/ea.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={"w-2/12 flex flex-col items-end justify-between"}>
                    <FormatPrice price={item.price * item.quantity} fontSize={"text-xl"}/>
                    <QuantitySelect products={item.countInStock} quantity={item.quantity} item={item}/>
                    <div>
                        <button
                            onClick={() => removeFromCartHandler(item._id)}
                            className={"btn-glass btn-xs rounded-full"}
                        >
                            <FaTrash className={"text-sm text-red-500"}/>
                        </button>
                    </div>
                </div>
            </div>
            <div className={"my-5 border-b-[1px] border-gray-300"}/>
        </>
    );
};

export default CartItem;