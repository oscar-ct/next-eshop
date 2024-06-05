"use client";

import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import BackButton from "@/components/BackButton";
import {FaChevronDown, FaChevronLeft, FaChevronRight, FaChevronUp} from "react-icons/fa";
import toast from "react-hot-toast";
import ProductItem from "@/components/ProductItem";
import Snake from "@/components/Snake";
import Paginate from "@/components/Paginate";
import Loading from "@/app/loading";


const fetchProductsSearch = async (params) => {
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


const SearchPage = () => {

    const {searchTerm, pageNumber} = useParams();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [windowInnerWidth, setWindowInnerWidth] = useState(typeof window !== "undefined" && window.innerWidth);    const [windowResizing, setWindowResizing] = useState(false);

    useEffect(() => {
        let timeout;
        const handleResize = () => {
            clearTimeout(timeout);
            setWindowResizing(true);
            setWindowInnerWidth(window.innerWidth);
            timeout = setTimeout(() => {
                setWindowResizing(false);
            }, 200);
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    useEffect(function () {
        window.scrollTo(0,0);
    }, [])

    useEffect(() => {
        const fetchProductsSearchData = async () => {
            try {
                const data = await fetchProductsSearch(`search/${searchTerm}/page/${pageNumber}`);
                setData(data);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };
        if (data === null) {
            fetchProductsSearchData();
        }
    }, [data]);


    if (!loading && data.products) {
        return (
            <>
                <BackButton/>
                {
                    data.products.length === 0 ? (
                        <>
                            <h2 className={"text-2xl lg:text-3xl px-2 pt-20 pb-7 md:pt-10 text-center"}>
                                No search results for &quot;{data.searchTerm}&quot;
                            </h2>
                            <div className={"px-10"}>
                                <div className={"m-auto bg-neutral/70 rounded-xl max-w-[830px] shadow-xl"}>
                                    {
                                        !windowResizing && (
                                            <Snake/>
                                        )
                                    }
                                </div>
                            </div>
                            <div className={"py-10 flex justify-center items-center"}>
                                <div className={"w-40 flex flex-col"}>
                                    <div className={"flex justify-center"}>
                                        <button onClick={() => dispatchEvent(new KeyboardEvent('keydown', {
                                            key: 'w',
                                            code: 'KeyW',
                                            keyCode: 87
                                        }))} className={"btn btn-neutral p-3 rounded-lg border-[2px]"}>
                                            <FaChevronUp/>
                                        </button>
                                    </div>
                                    <div className={"flex justify-between"}>
                                        <button onClick={() => dispatchEvent(new KeyboardEvent('keydown', {
                                            key: 'a',
                                            code: 'KeyA',
                                            keyCode: 65
                                        }))} className={"btn btn-neutral p-3 rounded-lg border-[2px]"}>
                                            <FaChevronLeft/>
                                        </button>
                                        <button onClick={() => dispatchEvent(new KeyboardEvent('keydown', {
                                            key: 'd',
                                            code: 'KeyD',
                                            keyCode: 68
                                        }))} className={"btn btn-neutral p-3 rounded-lg border-[2px]"}>
                                            <FaChevronRight/>
                                        </button>
                                    </div>
                                    <div className={"flex justify-center"}>
                                        <button onClick={() => dispatchEvent(new KeyboardEvent('keydown', {
                                            key: 's',
                                            code: 'KeyS',
                                            keyCode: 83
                                        }))} className={"btn btn-neutral p-3 rounded-lg border-[2px]"}>
                                            <FaChevronDown/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className={"pb-10"}>
                            <h2 className={"pt-20 md:pt-10 text-2xl lg:text-3xl text-center px-2 pb-7"}>
                                Search results for &quot;{data.searchTerm}&quot;
                            </h2>
                            <div className={"w-full flex flex-wrap justify-center"}>
                                {
                                    data.products.map(function (product) {
                                        return <ProductItem key={product._id} product={product} windowInnerWidth={windowInnerWidth}/>
                                    })
                                }
                            </div>
                            {
                                data?.pages > 1 && (
                                    <div className={"pt-10 flex justify-center"}>
                                        <div className={"join"}>
                                            <Paginate pages={data.pages} page={data.page} searchTerm={searchTerm}/>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    )
                }
            </>
        );
    }
    return <Loading/>
};

export default SearchPage;