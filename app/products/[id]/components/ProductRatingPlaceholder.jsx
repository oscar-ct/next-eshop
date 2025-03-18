import {IoStarSharp} from "react-icons/io5";

const ProductRatingPlaceholder = () => {

    const fill = "gold";
    const size = 20;
    const opacity = 0.4;

    return (
        <>
            <h2 className={"py-4 text-xl font-light text-center dark:text-white"}>This product does not have any reviews yet</h2>
            <div
                className={"flex w-full px-4 flex-col gap-4 justify-center items-center"}>
                <div className={"w-full flex items-center gap-4"}>
                    <div className="flex gap-0.5">
                        <IoStarSharp fill={fill} size={size}/>
                        <IoStarSharp fill={fill} size={size}/>
                        <IoStarSharp fill={fill} size={size}/>
                        <IoStarSharp fill={fill} size={size}/>
                        <IoStarSharp fill={fill} size={size}/>
                    </div>
                    <progress
                        className="progress bg-gray-300/90 w-full"
                        value={0} max="100"
                    />
                </div>
                <div className={"w-full flex items-center gap-4"}>
                    <div className="flex gap-0.5">
                        <IoStarSharp fill={fill} size={size}/>
                        <IoStarSharp fill={fill} size={size}/>
                        <IoStarSharp fill={fill} size={size}/>
                        <IoStarSharp fill={fill} size={size}/>
                        <IoStarSharp fill={fill} size={size} opacity={opacity}/>
                    </div>
                    <progress
                        className="progress bg-gray-300/90 w-full"
                        value={0} max="100"
                    />
                </div>
                <div className={"w-full flex items-center gap-4"}>
                    <div className="flex gap-0.5">
                        <IoStarSharp fill={fill} size={size}/>
                        <IoStarSharp fill={fill} size={size}/>
                        <IoStarSharp fill={fill} size={size}/>
                        <IoStarSharp fill={fill} size={size} opacity={opacity}/>
                        <IoStarSharp fill={fill} size={size} opacity={opacity}/>
                    </div>
                    <progress
                        className="progress bg-gray-300/90 w-full"
                        value={0} max="100"
                    />
                </div>
                <div className={"w-full flex items-center gap-4"}>
                    <div className="flex gap-0.5">
                        <IoStarSharp fill={fill} size={size}/>
                        <IoStarSharp fill={fill} size={size}/>
                        <IoStarSharp fill={fill} size={size} opacity={opacity}/>
                        <IoStarSharp fill={fill} size={size} opacity={opacity}/>
                        <IoStarSharp fill={fill} size={size} opacity={opacity}/>
                    </div>
                    <progress
                        className="progress bg-gray-300/90 w-full"
                        value={0} max="100"
                    />
                </div>
                <div className={"w-full flex items-center gap-4"}>
                    <div className="flex gap-0.5">
                        <IoStarSharp fill={fill} size={size}/>
                        <IoStarSharp fill={fill} size={size} opacity={opacity}/>
                        <IoStarSharp fill={fill} size={size} opacity={opacity}/>
                        <IoStarSharp fill={fill} size={size} opacity={opacity}/>
                        <IoStarSharp fill={fill} size={size} opacity={opacity}/>
                    </div>
                    <progress
                        className="progress bg-gray-300/90 w-full"
                        value={0} max="100"
                    />
                </div>
            </div>
        </>
    );
};

export default ProductRatingPlaceholder;