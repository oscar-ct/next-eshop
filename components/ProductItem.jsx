"use client";

import {useCallback, useContext, useEffect, useRef, useState} from "react";
import {motion} from "framer-motion";
import CustomBtn from "@/components/CustomBtn";
import ProductItemRating from "@/components/ProductItemRating";
import Image from "next/image";
import GlobalContext from "@/context/GlobalContext";
import {useRouter} from "next/navigation";
import RevealMotion from "@/components/RevealMotion";
import {convertCentsToUSD} from "@/utils/covertCentsToUSD";


const ProductItem = ({product, smallSize = false, cardWidth = "", windowInnerWidth}) => {

    const { dispatch } = useContext(GlobalContext);
    const [imgIndex, setImageIndex] = useState(0);
    const quantity = 1;

    const router = useRouter();
    const buttonRef = useRef();
    const cardRef = useRef();

    const addToCartHandler = useCallback(() => {
        dispatch({
            type: "ADD_TO_CART",
            payload: {...product, quantity},
        });
        dispatch({type:"UPDATE_CART"});
        dispatch({type: "SET_LOCAL_STORAGE"});
        window.add_to_cart_modal.showModal();
    }, [dispatch, product, quantity]);


    useEffect(() => {
        const handleAddToCartButtonClick = (event) => {
            if (buttonRef?.current?.contains(event.target)) {
                if (product.countInStock !== 0) {
                    addToCartHandler();
                }
            }
        };
        window.addEventListener("click", handleAddToCartButtonClick);
        return () => window.removeEventListener("click", handleAddToCartButtonClick);
    }, [addToCartHandler, product.countInStock]);

    useEffect(() => {
        const handleCardClick = (event) => {
            if (!buttonRef?.current?.contains(event.target) && cardRef?.current?.contains(event.target)) {
                router.push(`/products/${product.id}`);
            }
        };
        window.addEventListener("click", handleCardClick);
        return () => window.removeEventListener("click", handleCardClick);
    }, [router, product.id]);


    return (
        <div ref={cardRef} className={"w-6/12 p-1 sm:p-3 sm:w-72"}>
            <RevealMotion
                y={windowInnerWidth <= 768 ? 0 : 35}
                isSmallScreen={windowInnerWidth <= 768}
            >
                <motion.div
                    transition={{duration: 0.25}}
                    whileHover={windowInnerWidth >= 768 ? {scale: 1.05} : {scale: 1}}
                    className={`${cardWidth} cursor-pointer rounded-xl border border-gray-300 flex flex-col bg-white h-full sm:shadow-md dark:bg-slate-600 dark:border-none`}
                >
                    <div
                        onMouseEnter={() => (windowInnerWidth >= 500 && product.images.length > 1) && setImageIndex(product.images.length - (product.images.length - 1))}
                        onMouseLeave={() => (windowInnerWidth >= 500 && product.images.length > 1) && setImageIndex(0)}
                    >
                        <figure className="p-2">
                            <Image
                                src={product.images.length !== 0 ? product.images[imgIndex].url : "/images/sample.jpg"}
                                alt="product"
                                className="w-full bg-zinc-50 h-[197px] object-scale-down rounded-tr-xl rounded-tl-xl dark:bg-white"
                                width={246}
                                height={197}
                                priority={true}
                            />
                        </figure>
                    </div>
                    <div className={`card-body p-2 items-start h-full flex flex-col sm:px-4 ${!smallSize ? "justify-between" : "justify-start"}`}>
                        <div className={`w-full h-14 text-concat text-sm font-semibold dark:text-white ${smallSize ? "max-height-2" : ""} `}>
                            {product.name}
                        </div>
                        <div className={`w-full text-xs dark:text-white ${!smallSize ? "sm:text-base" : " flex justify-between items-center"}`}>
                            <ProductItemRating rating={product.rating} text={`(${product.reviews.length})`}/>
                            {
                                smallSize && (
                                    <span className={"text-sm font-bold text-slate-500"}>
                                        {convertCentsToUSD(product.price)}
                                    </span>
                                )
                            }
                        </div>
                        {
                            !smallSize && (
                                <div className={"w-full flex flex-col justify-around sm:pt-2"}>
                                    <span
                                        className={"font-bold text-slate-500 sm:text-xl dark:text-white"}>{convertCentsToUSD(product.price)}</span>
                                    <div ref={buttonRef} className={"my-2 w-10/12 h-full self-center"}>
                                        {
                                            product.countInStock !== 0 ? (
                                                <motion.button
                                                    whileTap={{scale: 0.9}}
                                                    className={`w-full relative rounded-full px-5 py-2 text-base overflow-hidden group bg-slate-800 text-white sm:hover:bg-gradient-to-r sm:hover:from-violet-600 sm:hover:to-violet-500 sm:hover:ring-2 sm:hover:ring-offset-0 sm:hover:ring-violet-500 sm:transition-all sm:ease-out sm:duration-300"}`}
                                                    type={"button"}
                                                >
                                                    <span className={"sm:absolute sm:right-0 sm:w-8 sm:h-32 sm:-mt-12 sm:transition-all sm:duration-500 sm:transform sm:translate-x-12 sm:bg-white sm:opacity-10 sm:rotate-12 sm:group-hover:-translate-x-40 sm:ease"}/>
                                                    <span className={"text-sm"}>Add To Cart</span>
                                                </motion.button>
                                            ) : (
                                                <CustomBtn isDisabled={true} customClass={"py-2 text-sm w-full"}>
                                                    Out Of Stock
                                                </CustomBtn>
                                            )
                                        }
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </motion.div>
            </RevealMotion>
        </div>
    );
};

export default ProductItem;