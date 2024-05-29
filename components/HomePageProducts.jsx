"use client";

import {useEffect, useState} from "react";
import ProductItem from "@/components/ProductItem";
import {useParams, } from "next/navigation";

const fetchProducts = async () => {
    const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;
    try {
        if (!apiDomain) {
            return [];
        }
        const res = await fetch(`${apiDomain}/products`);
        // if (!res.ok) {
        //     throw new Error("Failed to fetch products data");
        // }
        return res.json()
    } catch (e) {
        console.log(e);
        return [];
    }
};

const HomePageProducts = () => {

    const {pageNumber} = useParams();
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [windowInnerWidth, setWindowInnerWidth] = useState(typeof window !== "undefined" && window.innerWidth);


    useEffect(() => {
        const fetchProductsData = async () => {
            try {
                const products = await fetchProducts({pageNumber});
                setProducts(products);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };
        if (products === null) {
            fetchProductsData();
        }
    }, [products]);



    // set window width on resize
    useEffect( () => {
        const adjustWidth = () => {
            setWindowInnerWidth(window.innerWidth);
        }
        window.addEventListener("resize", adjustWidth);
        return () => window.removeEventListener("resize", adjustWidth);
    });

    if (!loading) {
        return (
            <div className={`pb-1 md:px-3 md:pb-10 pt-14 md:pt-0 bg-black/90 md:bg-transparent`}>
                <div className={"h-12 md:bg-zinc-700"}>
                    <div className={"flex justify-center items-center h-full w-full"}>
                        <h2 className={"lg:pl-3 text-3xl md:text-2xl text-white ibmplex"}>
                            Latest Products
                        </h2>
                    </div>
                </div>
                <div className={"md:bg-white pt-10 md:border md:py-8 w-full flex flex-wrap justify-center"}>
                    {
                        products.products.map(function (product) {
                            return <ProductItem key={product._id} product={product} windowInnerWidth={windowInnerWidth}/>
                        })
                    }
                </div>
            </div>
        );
    }
};

export default HomePageProducts;