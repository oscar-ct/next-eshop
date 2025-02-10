import {IoStar, IoStarHalfOutline, IoStarOutline} from "react-icons/io5";

const ProductItemRating = ({rating, text} ) => {
    return (
        <div className={"flex items-center gap-1 text-yellow-400"}>
            <div>
                {rating >= 1 ? <IoStar/> : rating >= 0.5 ? <IoStarHalfOutline/> : <IoStarOutline/>}
            </div>
            <div>
                {rating >= 2 ? <IoStar/> : rating >= 1.5 ? <IoStarHalfOutline/> : <IoStarOutline/>}
            </div>
            <div>
                {rating >= 3 ? <IoStar/>  : rating >= 2.5 ? <IoStarHalfOutline/> : <IoStarOutline/>}
            </div>
            <div>
                {rating >= 4 ? <IoStar/> : rating >= 3.5 ? <IoStarHalfOutline/> : <IoStarOutline/>}
            </div>
            <div>
                {rating >= 5 ? <IoStar/> : rating >= 4.5 ? <IoStarHalfOutline/> : <IoStarOutline/>}
            </div>
            {
                text && (
                    <span className={"text-gray-700 dark:text-gray-300"}>{text}</span>
                )
            }
        </div>
    );
};

export default ProductItemRating;