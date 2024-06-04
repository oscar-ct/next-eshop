"use client";

import HomePageProducts from "@/components/HomePageProducts";
import HomePageIntro from "@/components/HomePageIntro";
import toast from "react-hot-toast";
import {useEffect, useState} from "react";
import {motion} from "framer-motion";
import Loading from "@/app/loading";

const fetchProducts = async () => {
    const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;
    try {
        if (!apiDomain) {
            return null;
        }
        const res = await fetch(`${apiDomain}/products/sort/latest/select/all/page/1`);
        if (!res.ok) {
            const message = await res.text();
            toast.error(message);
            return null;
        }
        return res.json()
    } catch (e) {
        console.log(e);
        return null;
    }
};

const fetchProductCategories = async () => {
    const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;
    try {
        if (!apiDomain) {
            return null;
        }
        const res = await fetch(`${apiDomain}/products/categories`);
        if (!res.ok) {
            const message = await res.text();
            toast.error(message);
            return null;
        }
        return res.json()
    } catch (e) {
        console.log(e);
        return null;
    }
};


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