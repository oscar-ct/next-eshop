import ProductDollarAmount from "../../products/[id]/components/ProductDollarAmount";
import Link from "next/link";
import Image from "next/image";
import {convertCentsToUSD} from "@/utils/covertCentsToUSD";

const OrderItem = ( {item, canceledItems, isCanceled} ) => {

    const strikethrough = function () {
        if (canceledItems.some(e => e.productId === item.productId) || isCanceled) {
            return "line-through";
        }
    };

    return (
        <>
            <div
                className={`flex w-full mt-5 ${(canceledItems.some(e => e.productId === item.productId) || isCanceled) && "opacity-70"}`}
            >
                <div className={"w-2/12 flex justify-center items-center"}>
                    <Link className={"rounded-md bg-zinc-100/70 max-w-[175px] max-h-[160px]"} href={`/product/${item.productId}`}>
                        <Image
                            priority
                            src={item.imageUrl}
                            alt={"item"}
                            width={100}
                            height={100}
                            className={"rounded-md w-full h-auto object-scale-down"}
                        />
                    </Link>
                </div>
                <div className={"w-8/12 flex flex-col px-3 sm:px-5"}>
                    <Link href={`/products/${item.productId}`} className={`sm:text-lg font-bold hover:link-primary dark:text-white ${strikethrough()}`}>
                        {item.name}
                    </Link>
                    <div className={"flex w-full justify-between items-end"}>
                        <div className={"flex flex-col"}>
                            <div>
                                <span className={`text-gray-500 font-bold text-xs`}>Qty:</span>
                                <span className={`ml-1 text-sm dark:text-white ${strikethrough()}`}>{item.quantity}</span>
                            </div>
                            <div>
                                <span className={"text-gray-500 font-bold text-xs"}>Price:</span>
                                <span className={`ml-1 text-sm dark:text-white ${strikethrough()}`}>{convertCentsToUSD(item.price)}/ea.</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"w-2/12 flex flex-col items-end justify-between"}>
                    <div className={strikethrough()}>
                        <ProductDollarAmount price={convertCentsToUSD(item.price * item.quantity).toString()} fontSize={"text-xl"}/>
                    </div>
                </div>
            </div>
            {
                (canceledItems.some(e => e.productId === item.productId) || isCanceled) && (
                    <h3 className={"text-end text-xs font-semibold text-red-500"}>
                        <span>Canceled on </span>
                        {
                            canceledItems.map(function (x) {
                                if (x.productId === item.productId) {
                                    return x.canceledAt;
                                } else {
                                    return ""
                                }
                            })
                        }
                    </h3>
                )
            }
            <div className={"mt-5 border-b border-gray-300"}/>
        </>
    );
};

export default OrderItem;