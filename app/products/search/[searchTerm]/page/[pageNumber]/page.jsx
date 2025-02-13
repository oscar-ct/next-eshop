"use client";

import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import BackButton from "@/components/BackButton";
import toast from "react-hot-toast";
import ProductItem from "@/components/ProductItem";
import Snake from "@/components/Snake";
import Paginate from "@/components/Paginate";
import {BiJoystickButton} from "react-icons/bi";
import ProductItemSkeletons from "@/components/ProductItemSkeletons";


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
    const [windowInnerWidth, setWindowInnerWidth] = useState(typeof window !== "undefined" && window.innerWidth);
    const [windowResizing, setWindowResizing] = useState(false);

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



    return (
        <>
            <BackButton/>
            {
                loading && !data ? (
                    <>
                        <h2 className={"pt-20 px-2 pb-7 text-2xl text-center md:pt-10 lg:text-3xl dark:text-white"}>
                           Searching for &quot;{searchTerm}&quot;. . .
                        </h2>
                        <ProductItemSkeletons length={3}/>
                    </>
                ) : (
                    <>
                        {
                            data.products.length > 0 ? (
                                <>
                                    <h2 className={"pt-20 px-2 pb-7 text-2xl text-center md:pt-10 lg:text-3xl dark:text-white"}>
                                        Search results for &quot;{data.searchTerm}&quot;
                                    </h2>
                                    <div className={"w-full flex flex-wrap justify-center"}>
                                        {
                                            data.products.map(function (product, index) {
                                                return <ProductItem key={index} product={product} windowInnerWidth={windowInnerWidth}/>
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
                                </>
                            ) : (
                                <div className={"flex flex-col"}>
                                    <div
                                        className={"pt-20 px-2 pb-7 flex flex-col text-2xl text-center md:pt-10 lg:text-3xl dark:text-white"}>
                                        <h2>Sorry, no search results for &quot;{data.searchTerm}&quot;</h2>
                                        <h5 className={"text-base"}>Enjoy a game of snake!</h5>
                                    </div>
                                    <div className={"z-10 px-2"}>
                                        <div className={"z-30 m-auto bg-neutral/70 rounded-xl max-w-[830px] shadow-xl"}>
                                            {
                                                !windowResizing && (
                                                    <Snake/>
                                                )
                                            }
                                        </div>
                                    </div>
                                    <div className={"z-10 flex justify-center items-center"}>
                                        <div className={"relative dark:text-white"}>
                                            <BiJoystickButton size={200}/>
                                            <button
                                                className={"rounded-2xl absolute bottom-2 left-0 right-0 mx-auto w-20 h-16"}
                                                onClick={() => dispatchEvent(new KeyboardEvent('keydown', {
                                                    key: 's',
                                                    code: 'KeyS',
                                                    keyCode: 83
                                                }))}
                                            />
                                            <button
                                                className={"rounded-2xl absolute top-2 left-0 right-0 mx-auto w-20 h-16"}
                                                onClick={() => dispatchEvent(new KeyboardEvent('keydown', {
                                                    key: 'w',
                                                    code: 'KeyW',
                                                    keyCode: 87
                                                }))}
                                            />
                                            <button
                                                className={"rounded-2xl absolute bottom-0 top-0 left-2 my-auto w-16 h-20"}
                                                onClick={() => dispatchEvent(new KeyboardEvent('keydown', {
                                                    key: 'a',
                                                    code: 'KeyA',
                                                    keyCode: 65
                                                }))}
                                            />
                                            <button
                                                className={"rounded-2xl absolute bottom-0 top-0 right-2 my-auto w-16 h-20"}
                                                onClick={() => dispatchEvent(new KeyboardEvent('keydown', {
                                                    key: 'd',
                                                    code: 'KeyD',
                                                    keyCode: 68
                                                }))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </>
                )
            }
        </>
    );
};

export default SearchPage