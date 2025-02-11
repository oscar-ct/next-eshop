"use client";

import BackButton from "@/components/BackButton";
import BackButtonMessage from "@/components/BackButtonMessage";
import {customStyles} from "@/utils/selectCustomStyles";
import {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import SelectMenuCategory from "@/components/SelectMenuCategory";
import SelectMenuSort from "@/components/SelectMenuSort";
import ProductItem from "@/components/ProductItem";
import Message from "@/components/Message";
import Paginate from "@/components/Paginate";
import toast from "react-hot-toast";
import Loading from "@/app/loading";


const fetchProducts = async (params) => {
    const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;
    try {
        if (!apiDomain) {
            return null;
        }
        const res = await fetch(`${apiDomain}/products/${params}`);
        if (!res.ok) {
            const message = await res.text();
            toast.error(message);
            return null;
        }
        return res.json();
    } catch (e) {
        console.log(e);
        return null;
    }
};

const ProductsPage = () => {

    const params = useParams();
    const { sortTerm, categoryTerm, pageNumber } = params;

    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [windowInnerWidth, setWindowInnerWidth] = useState(typeof window !== "undefined" && window.innerWidth);


    useEffect(() => {
        const fetchProductsData = async () => {
            try {
                const products = await fetchProducts(`sort/${sortTerm}/select/${categoryTerm}/page/${pageNumber}`);
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

    useEffect( () => {
        const adjustWidth = () => {
            setWindowInnerWidth(window.innerWidth);
        }
        window.addEventListener("resize", adjustWidth);
        return () => window.removeEventListener("resize", adjustWidth);
    });


    if (!loading && products) {
        return (
            <>
                <div className={"flex w-full"}>
                    <div className={"w-2/12 md:w-1/12"}>
                        <BackButton/>
                    </div>
                    <BackButtonMessage width={"w-10/12 md:w-11/12"}/>
                </div>
                <div className={"pt-20 lg:pt-14"}>
                    <div className={"flex justify-between"}>
                        <div className={"w-full p-1 flex items-center"}>
                            <div className={"flex w-full"}>
                                <div className={"flex flex-col justify-between items-center w-6/12"}>
                                    <p className={"p-1 text-sm dark:text-white"}>Category</p>
                                    <div className={"px-2 w-full lg:w-96"}>
                                        <SelectMenuCategory sortTerm={sortTerm} categoryTerm={categoryTerm} pageNumber={pageNumber} customStyles={customStyles}/>
                                    </div>
                                </div>
                                <div className={"flex flex-col justify-between items-center w-6/12"}>
                                    <p className={"p-1 text-sm dark:text-white"}>Sort By</p>
                                    <div className={"px-2 w-full lg:w-96"}>
                                        <SelectMenuSort sortTerm={sortTerm} categoryTerm={categoryTerm} pageNumber={pageNumber} customStyles={customStyles}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"w-full flex flex-wrap justify-center pt-6"}>
                    {
                        products.products.length !== 0 ? (
                            products.products.map(function (product) {
                                return (
                                    <ProductItem key={product.id} product={product}
                                                 windowInnerWidth={windowInnerWidth}/>
                                )
                            })
                        ) : (
                            <div className={"p-4"}>
                                <Message variant={"warning"}>It appears we dont have what you are looking for at the
                                    moment :(</Message>
                            </div>
                        )
                    }
                </div>
                <div className={"pt-10 flex justify-center"}>
                    <div className={"join"}>
                        <Paginate pages={products.pages} page={products.page} sortTerm={sortTerm} categoryTerm={categoryTerm} />
                    </div>
                </div>
            </>
        );
    }
    return <Loading/>
};

export default ProductsPage;