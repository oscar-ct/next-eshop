"use client";

import ProductItem from "@/components/ProductItem";
import {useEffect, useState} from "react";
import {fetchProducts} from "@/utils/api-requests/fetchRequests";

const HomePageProducts = () => {

    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [windowInnerWidth, setWindowInnerWidth] = useState(typeof window !== "undefined" && window.innerWidth);

    useEffect( () => {
        const adjustWidth = () => setWindowInnerWidth(window.innerWidth);
        window.addEventListener("resize", adjustWidth);
        return () => window.removeEventListener("resize", adjustWidth);
    });

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


    return (
        <div className={"pb-14 rounded-2xl bg-zinc-50 sm:bg-white sm:shadow-lg dark:bg-slate-800"}>
            <div className={"py-10 flex justify-center items-center h-full w-full md:py-12"}>
                <h2 className={"font-bold text-3xl dark:text-white"}>
                    Latest Products
                </h2>
            </div>
            {
                !products && loading ? (
                    <div className={"h-64 flex items-center justify-center"}>
                        <span className="loading loading-bars loading-lg"/>
                    </div>
                ) : (
                    <div className={"w-full flex flex-wrap justify-center"}>
                        {
                            products.products.map(function (product) {
                                return <ProductItem key={product.id} product={product} windowInnerWidth={windowInnerWidth}/>
                            })
                        }
                    </div>
                )
            }
        </div>
    );
};

export default HomePageProducts;