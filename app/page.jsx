"use client";

import HomePageProducts from "@/components/HomePageProducts";
import HomePageIntro from "@/components/HomePageIntro";
import {useEffect, useState} from "react";
import {motion} from "framer-motion";
import Loading from "@/app/loading";
import {fetchProductCategories, fetchProducts} from "@/utils/api-requests/fetchRequests";


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
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <HomePageIntro windowInnerWidth={windowInnerWidth} productsCategory={productsCategory}/>
                <HomePageProducts products={products} windowInnerWidth={windowInnerWidth}/>
            </motion.div>
        );
    }
    return <Loading/>
};

export default Page;