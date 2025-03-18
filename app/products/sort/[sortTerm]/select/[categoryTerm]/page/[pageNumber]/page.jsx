"use client";

import BackButton from "@/components/BackButton";
import BackButtonMessage from "@/components/BackButtonMessage";
import {customStyles} from "@/utils/selectCustomStyles";
import {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import SelectMenuCategory from "@/app/products/sort/components/SelectMenuCategory";
import SelectMenuSort from "@/app/products/sort/components/SelectMenuSort";
import ProductItem from "@/components/products/ProductItem";
import AlertMessage from "@/components/AlertMessage";
import ProductsPagination from "@/components/products/ProductsPagination";
import useWindowDimensions from "@/hooks/useWindowDimensions";
import ProductItemSkeletons from "@/components/products/ProductItemSkeletons";
import {IoIosArrowDown} from "react-icons/io";
import {fetchProductCategoriesWithOrWithoutImages, fetchProducts} from "@/utils/apiFetchRequests";


const FilterProductsPage = () => {

    const params = useParams();
    const {sortTerm, categoryTerm, pageNumber} = params;

    const [products, setProducts] = useState(null);
    const [selectMenuCategoryOptions, setSelectMenuCategoryOptions] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductsData = async () => {
            try {
                const products = await fetchProducts(`sort/${sortTerm}/select/${categoryTerm}/page/${pageNumber}`);
                setProducts(products);
                // params controls object response to include images array or not
                const categories = await fetchProductCategoriesWithOrWithoutImages("no");
                const options = categories.map((item) => {
                    return {value: item.category.toLowerCase(), label: item.category};
                });
                setSelectMenuCategoryOptions(options);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };
        if (products === null && selectMenuCategoryOptions === null) {
            fetchProductsData();
        }
    }, [products, selectMenuCategoryOptions]);

    const {width} = useWindowDimensions();

    return (
        <>
            <div className={"flex w-full"}>
                <div className={"w-2/12 md:w-1/12"}>
                    <BackButton/>
                </div>
                <BackButtonMessage width={"w-10/12 md:w-11/12"}/>
            </div>
            <div className={"pt-20 lg:pt-14"}>
                <div className={"z-30 flex justify-between"}>
                    <div className={"z-30 w-full p-1 flex items-center"}>
                        <div className={"z-30 flex w-full"}>
                            <div className={"z-30 flex flex-col justify-between items-center w-6/12"}>
                                <p className={"z-30 flex p-1 text-sm dark:text-white"}>Category</p>
                                <div className={"flex px-2 w-full lg:w-96"}>
                                    {
                                        loading && !products && !selectMenuCategoryOptions ? (
                                            <div className={"w-full z-20"}>
                                                <div
                                                    className={"h-[42px] bg-zinc-50 border flex justify-between items-center px-3 py-2.5 text-gray-400"}>
                                                    <span className="z-30 loading loading-bars loading-sm"/>
                                                    <div className={"flex h-full items-center gap-2"}>
                                                        <span className={"w-[1px] h-full bg-gray-300"}></span>
                                                        <IoIosArrowDown size={17}/>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <SelectMenuCategory
                                                sortTerm={sortTerm}
                                                categoryTerm={categoryTerm}
                                                pageNumber={pageNumber}
                                                customStyles={customStyles}
                                                options={selectMenuCategoryOptions}
                                            />
                                        )
                                    }
                                </div>
                            </div>
                            <div className={"z-30 flex flex-col justify-between items-center w-6/12"}>
                                <p className={"z-30 flex p-1 text-sm dark:text-white"}>Sort By</p>
                                <div className={"flex px-2 w-full lg:w-96"}>
                                    {
                                        loading && !products ? (
                                            <div className={"w-full z-20"}>
                                                <div
                                                    className={"w-full h-[42px] bg-zinc-50 border flex justify-between items-center px-3 py-2.5 text-gray-400"}>
                                                    <span className="z-30 loading loading-bars loading-sm"/>
                                                    <div className={"flex h-full items-center gap-2"}>
                                                        <span className={"w-[1px] h-full bg-gray-300"}></span>
                                                        <IoIosArrowDown size={17}/>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <SelectMenuSort
                                                sortTerm={sortTerm}
                                                categoryTerm={categoryTerm}
                                                pageNumber={pageNumber}
                                                customStyles={customStyles}
                                            />
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                loading && !products ? (
                    <div className={"pt-6"}>
                        <ProductItemSkeletons/>
                    </div>

                ) : (
                    <>

                        <div className={"w-full flex flex-wrap justify-center pt-6"}>
                            {
                                products.products.length !== 0 ? (
                                    products.products.map(function (product) {
                                        return (
                                            <ProductItem
                                                key={product.id}
                                                product={product}
                                                windowInnerWidth={width}
                                            />
                                        )
                                    })
                                ) : (
                                    <div className={"z-10 p-4"}>
                                        <AlertMessage variant={"warning"}>
                                            It appears we dont have what you are looking for at the moment :(
                                        </AlertMessage>
                                    </div>
                                )
                            }
                        </div>
                        <div className={"pt-10 flex justify-center"}>
                            <div className={"join"}>
                                <ProductsPagination
                                    pages={products.pages}
                                    page={products.page}
                                    sortTerm={sortTerm}
                                    categoryTerm={categoryTerm}
                                />
                            </div>
                        </div>
                    </>
                )
            }
      </>
    );
};

export default FilterProductsPage;