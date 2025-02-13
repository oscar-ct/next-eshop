const ProductItemSkeleton = () => {
    return (
        <div className={"z-20 w-6/12 p-1 sm:p-3 sm:w-72"}>
            <div
                className={`px-2 pt-2 pb-3.5 rounded-xl border border-gray-300 flex flex-col gap-4 bg-white h-full sm:shadow-md dark:bg-slate-600 dark:border-none`}>
                <div className="skeleton h-48 w-full bg-gray-300 dark:bg-gray-200"/>
                <div className="skeleton h-4 w-full bg-gray-300 dark:bg-gray-200"/>
                <div className="skeleton h-4 w-full bg-gray-300 dark:bg-gray-200"/>
                <div className="skeleton h-4 w-28 bg-gray-300 dark:bg-gray-200"/>
                <div className="skeleton h-4 w-2/3 bg-gray-300 dark:bg-gray-200"/>
                <div className="skeleton h-4 w-full bg-gray-300 dark:bg-gray-200"/>
                <div className="skeleton h-4 w-28 bg-gray-300 dark:bg-gray-200"/>
            </div>
        </div>
    );
};

export default ProductItemSkeleton;