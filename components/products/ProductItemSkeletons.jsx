import ProductItemSkeleton from "@/components/products/ProductItemSkeleton";

const ProductItemSkeletons = ({length = 5}) => {
    let rows = [];
    for (let i = 0; i < length; i++) {
        rows.push(<ProductItemSkeleton key={i}/>);
    }
    return (
        <div className={"w-full flex flex-wrap justify-center"}>
            {rows}
        </div>
    );
};

export default ProductItemSkeletons;