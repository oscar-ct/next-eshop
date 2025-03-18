"use client";

import Link from "next/link";
import {motion} from "framer-motion";
import Image from "next/image";
import RevealMotion from "@/components/RevealMotion";
import {useEffect, useState} from "react";
import {fetchProductCategoriesWithOrWithoutImages} from "@/utils/apiFetchRequests";

const HomePageIntroCategories = () => {

    const [productsCategory, setProductsCategory] = useState(null);
    const [loadingCategory, setLoadingCategory] = useState(true);
    const [windowInnerWidth, setWindowInnerWidth] = useState(typeof window !== "undefined" && window.innerWidth);

    useEffect( () => {
        const adjustWidth = () =>  {
            setWindowInnerWidth(window.innerWidth);
        }
        window.addEventListener("resize", adjustWidth);
        return () => window.removeEventListener("resize", adjustWidth);
    });
    useEffect(() => {
        const fetchProductsCategoryData = async () => {
            try {
                // params controls object response to include images array or not
                const products = await fetchProductCategoriesWithOrWithoutImages("yes");
                setProductsCategory(products);
            } catch (e) {
                console.log(e);
            } finally {
                setLoadingCategory(false);
            }
        };
        if (productsCategory === null) fetchProductsCategoryData();
    }, [productsCategory]);


     if (!productsCategory && loadingCategory) return (
         <div className={"z-10 w-full flex flex-wrap justify-center lg:flex-nowrap 2xl:container"}>
             <div className={"w-6/12 p-1 sm:w-[175px] sm:py-3 sm:px-2"}>
                 <div
                     className={"bg-white rounded-lg flex flex-col items-center border sm:shadow-md sm:border-none dark:bg-slate-600 dark:border-none"}>
                     <div className="p-2 flex justify-center rounded-xl dark:bg-slate-600">
                         <div className="skeleton h-36 w-36 bg-gray-300 dark:bg-gray-200"/>
                     </div>
                     <div className={"p-2 h-full sm:px-4"}>
                         <div className="skeleton h-4 w-36 bg-gray-300 dark:bg-gray-200"/>
                     </div>
                 </div>
             </div>
             <div className={"w-6/12 p-1 sm:w-[175px] sm:py-3 sm:px-2"}>
                 <div
                     className={"bg-white rounded-lg flex flex-col items-center border sm:shadow-md sm:border-none dark:bg-slate-600 dark:border-none"}>
                     <div className="p-2 flex justify-center rounded-xl dark:bg-slate-600">
                         <div className="skeleton h-36 w-36 bg-gray-300 dark:bg-gray-200"/>
                     </div>
                     <div className={"p-2 h-full sm:px-4"}>
                         <div className="skeleton h-4 w-36 bg-gray-300 dark:bg-gray-200"/>
                     </div>
                 </div>
             </div>
             <div className={"w-6/12 p-1 sm:w-[175px] sm:py-3 sm:px-2"}>
                 <div
                     className={"bg-white rounded-lg flex flex-col items-center border sm:shadow-md sm:border-none dark:bg-slate-600 dark:border-none"}>
                     <div className="p-2 flex justify-center rounded-xl dark:bg-slate-600">
                         <div className="skeleton h-36 w-36 bg-gray-300 dark:bg-gray-200"/>
                     </div>
                     <div className={"p-2 h-full sm:px-4"}>
                         <div className="skeleton h-4 w-36 bg-gray-300 dark:bg-gray-200"/>
                     </div>
                 </div>
             </div>
             <div className={"w-6/12 p-1 sm:w-[175px] sm:py-3 sm:px-2"}>
                 <div
                     className={"bg-white rounded-lg flex flex-col items-center border sm:shadow-md sm:border-none dark:bg-slate-600 dark:border-none"}>
                     <div className="p-2 flex justify-center rounded-xl dark:bg-slate-600">
                         <div className="skeleton h-36 w-36 bg-gray-300 dark:bg-gray-200"/>
                     </div>
                     <div className={"p-2 h-full sm:px-4"}>
                         <div className="skeleton h-4 w-36 bg-gray-300 dark:bg-gray-200"/>
                     </div>
                 </div>
             </div>
             <div className={"w-6/12 p-1 sm:w-[175px] sm:py-3 sm:px-2"}>
                 <div
                     className={"bg-white rounded-lg flex flex-col items-center border sm:shadow-md sm:border-none dark:bg-slate-600 dark:border-none"}>
                     <div className="p-2 flex justify-center rounded-xl dark:bg-slate-600">
                         <div className="skeleton h-36 w-36 bg-gray-300 dark:bg-gray-200"/>
                     </div>
                     <div className={"p-2 h-full sm:px-4"}>
                         <div className="skeleton h-4 w-36 bg-gray-300 dark:bg-gray-200"/>
                     </div>
                 </div>
             </div>
             <div className={"w-6/12 p-1 sm:w-[175px] sm:py-3 sm:px-2"}>
                 <div
                     className={"bg-white rounded-lg flex flex-col items-center border sm:shadow-md sm:border-none dark:bg-slate-600 dark:border-none"}>
                     <div className="p-2 flex justify-center rounded-xl dark:bg-slate-600">
                         <div className="skeleton h-36 w-36 bg-gray-300 dark:bg-gray-200"/>
                     </div>
                     <div className={"p-2 h-full sm:px-4"}>
                         <div className="skeleton h-4 w-36 bg-gray-300 dark:bg-gray-200"/>
                     </div>
                 </div>
             </div>
             <div className={"w-6/12 p-1 sm:w-[175px] sm:py-3 sm:px-2"}>
                 <div
                     className={"bg-white rounded-lg flex flex-col items-center border sm:shadow-md sm:border-none dark:bg-slate-600 dark:border-none"}>
                     <div className="p-2 flex justify-center rounded-xl dark:bg-slate-600">
                         <div className="skeleton h-36 w-36 bg-gray-300 dark:bg-gray-200"/>
                     </div>
                     <div className={"p-2 h-full sm:px-4"}>
                         <div className="skeleton h-4 w-36 bg-gray-300 dark:bg-gray-200"/>
                     </div>
                 </div>
             </div>
             <div className={"w-6/12 p-1 sm:w-[175px] sm:py-3 sm:px-2"}>
                 <div
                     className={"bg-white rounded-lg flex flex-col items-center border sm:shadow-md sm:border-none dark:bg-slate-600 dark:border-none"}>
                     <div className="p-2 flex justify-center rounded-xl dark:bg-slate-600">
                         <div className="skeleton h-36 w-36 bg-gray-300 dark:bg-gray-200"/>
                     </div>
                     <div className={"p-2 h-full sm:px-4"}>
                         <div className="skeleton h-4 w-36 bg-gray-300 dark:bg-gray-200"/>
                     </div>
                 </div>
             </div>
         </div>
     )

    return (
        <div className={"z-10 w-full flex flex-wrap justify-center lg:flex-nowrap 2xl:container"}>
            {
                productsCategory.slice(0, 8).map(function (product, index) {
                    return (
                        <Link key={index} href={`/products/sort/latest/select/${product.category.toLowerCase()}/page/1`}
                              className={"w-6/12 p-1 sm:w-[175px] sm:py-3 sm:px-2"}>
                            <RevealMotion
                                y={35}
                                isSmallScreen={false}
                            >
                                <motion.div
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                    whileHover={windowInnerWidth > 640 ? { scale: 1.1} : {scale: 1}}
                                    whileTap={windowInnerWidth > 640 ? { scale: 0.9} : {scale: 1}}
                                    className={"bg-white rounded-lg flex flex-col items-center border sm:shadow-md sm:border-none dark:bg-slate-600 dark:border-none"}
                                >
                                    <div className="p-2 flex justify-center rounded-xl dark:bg-slate-600">
                                        <Image
                                            priority
                                            width={140}
                                            height={140}
                                            src={product.images[product.images.length > 1 ? 1 : 0].url}
                                            alt="product"
                                            className="h-36 w-36 object-scale-down rounded-tr-lg rounded-tl-lg"
                                        />
                                    </div>
                                    <div className={`card-body p-2 items-start h-full flex flex-col sm:px-4`}>
                                        <div className={`w-full h-full text-center text-sm font-semibold dark:text-white`}>
                                            {product.category}
                                        </div>
                                    </div>
                                </motion.div>
                            </RevealMotion>
                        </Link>
                    );
                })
            }
        </div>
    );
};

export default HomePageIntroCategories;