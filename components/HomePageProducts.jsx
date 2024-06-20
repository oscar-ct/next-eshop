import ProductItem from "@/components/ProductItem";

const HomePageProducts = ({ products, windowInnerWidth }) => {
    return (
        <div className={`pb-1 md:px-3 md:pb-10 pt-14 md:pt-0 bg-black dark:bg-black md:bg-transparent 2xl:container 2xl:mx-auto`}>
            <div className={"h-12 md:bg-zinc-700"}>
                <div className={"flex justify-center items-center h-full w-full"}>
                    <h2 className={"hidden lg:block pl-3 font-bold text-2xl text-white"}>
                        Latest Products
                    </h2>
                    <h2 className={"lg:hidden text-3xl font-bold text-white px-5"}>
                        Latest Products
                    </h2>
                </div>
            </div>
            <div className={"bg-black dark:bg-black md:bg-white pt-14 lg:pt-10 md:border md:py-8 w-full flex flex-wrap justify-center"}>
            {
                    products.products.map(function (product) {
                        return <ProductItem key={product.id} product={product} windowInnerWidth={windowInnerWidth}/>
                    })
                }
            </div>
        </div>
    );
};

export default HomePageProducts;