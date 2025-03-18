const ProductDollarAmount = ({children, price, fontSize}) => {
    return (
        <div className={"flex items-end dark:text-white"}>
            <div className={"flex"}>
                <span className={"text-xs pt-1"}>{price.substring(0, 1)}</span>
                <span className={`${fontSize} font-bold`}>{price.substring(1, price.indexOf("."))}</span>
                <span className={"text-xs pt-1"}>{price.substring(price.indexOf(".") + 1, price.length).substring(0, 2)}</span>
            </div>
            <span className={"text-xs pb-[2px]"}>{children}</span>
        </div>
    )
};

export default ProductDollarAmount;