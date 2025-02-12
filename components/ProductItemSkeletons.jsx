import ProductItemSkeleton from "@/components/ProductItemSkeleton";

const ProductItemSkeletons = () => {
    let rows = [];
    for (let i = 0; i < 5; i++) {
        rows.push(<ProductItemSkeleton key={i}/>);
    }
    return (
        <div className={"w-full flex flex-wrap justify-center pt-6"}>
            {rows}
        </div>
    );
};

export default ProductItemSkeletons;