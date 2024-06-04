import ProductItem from "@/components/ProductItem";

const HomePageProducts = ({ products, windowInnerWidth }) => {
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
};

export default HomePageProducts;