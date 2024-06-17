"use client";

import HomePageProducts from "@/components/HomePageProducts";
import HomePageIntro from "@/components/HomePageIntro";
import {useEffect, useState} from "react";
import {motion} from "framer-motion";
import Loading from "@/app/loading";
import {fetchProductCategories, fetchProducts} from "@/utils/api-requests/fetchRequests";
import CustomBtn from "@/components/CustomBtn";
import Image from "next/image";



const Page = () => {

    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [productsCategory, setProductsCategory] = useState(null);
    const [loadingCategory, setLoadingCategory] = useState(true);
    const [windowInnerWidth, setWindowInnerWidth] = useState(typeof window !== "undefined" && window.innerWidth);


    useEffect(() => {
        const fetchProductsData = async () => {
            try {
                const products = await fetchProducts();
                setProducts(products);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };
        if (products === null) fetchProductsData();
    }, [products]);

    useEffect(() => {
        const fetchProductsCategoryData = async () => {
            try {
                const products = await fetchProductCategories();
                setProductsCategory(products);
            } catch (e) {
                console.log(e);
            } finally {
                setLoadingCategory(false);
            }
        };
        if (productsCategory === null) fetchProductsCategoryData();
    }, [productsCategory]);


    useEffect( () => {
        const adjustWidth = () => setWindowInnerWidth(window.innerWidth);
        window.addEventListener("resize", adjustWidth);
        return () => window.removeEventListener("resize", adjustWidth);
    });

    if (!loading && products && !loadingCategory && productsCategory) {
        return (
            <>
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                >
                    <HomePageIntro windowInnerWidth={windowInnerWidth} productsCategory={productsCategory}/>
                    <HomePageProducts products={products} windowInnerWidth={windowInnerWidth}/>
                </motion.div>
                <dialog id="oscar_modal" className="modal">
                    <div className="modal-box">
                        <div
                            className={"w-full h-[28em] flex flex-col items-center justify-evenly"}>
                            <div className={"pt-3 w-full flex flex-col justify-center items-center"}>
                                <div
                                    className={"text-3xl font-bold text-center dark:text-white"}>
                                    Oscar Castro
                                </div>
                                <div className={"text-sm text-gray-500 font-semibold"}>
                                    Full Stack Web Developer
                                </div>
                            </div>
                            <div className="avatar">
                                <div className="w-48 mask mask-squircle">
                                    <Image
                                        alt={"headshot"}
                                        src={"/images/codeup-final.webp"}
                                        width={150}
                                        height={150}
                                    />
                                </div>
                            </div>
                            <div
                                className={"flex w-full flex-col items-center"}>
                                <a className={"link link-white hover:text-primary pb-5 dark:text-white"}
                                   href={"mailto:oscar.a.castro818@gmail.com"}>oscar.a.castro818@gmail.com</a>
                                <a aria-label="portfolio" href={"https://oscar-ct.com/"}
                                   target="_blank"
                                   rel="noopener noreferrer">
                                    <CustomBtn customClass={"bg-zinc-700"}>
                                        Visit Portfolio
                                    </CustomBtn>
                                </a>
                            </div>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>
            </>


        )
            ;
    }
    return <Loading/>
};

export default Page;