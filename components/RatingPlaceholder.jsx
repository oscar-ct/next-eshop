
const RatingPlaceholder = () => {
    return (
        <>
            <div className={"py-8 md:pt-4 md:pb-8 px-4 flex justify-center"}>
                <span className={"text-xl font-light text-center"}>This product does not have any reviews</span>
            </div>
            <div
                className={"hidden md:flex w-full px-4 flex-col gap-4 justify-center items-center"}>
                <div className={"flex items-center"}>
                    <div className="rating rating-sm pr-5">
                        <input disabled type="radio" name="rating-5"
                               className="mask mask-star-2 bg-warning"/>
                        <input disabled type="radio" name="rating-5"
                               className="mask mask-star-2 bg-warning"/>
                        <input disabled type="radio" name="rating-5"
                               className="mask mask-star-2 bg-warning"/>
                        <input disabled type="radio" name="rating-5"
                               className="mask mask-star-2 bg-warning"/>
                        <input disabled checked type="radio" name="rating-5"
                               className="mask mask-star-2 bg-warning"/>
                    </div>
                    <progress
                        className="progress progress-warning w-[15em] sm:w-[25em] lg:w-[20em] 2xl:w-[25em]"
                        value={0} max="100"/>
                </div>
                <div className={"flex items-center"}>
                    <div className="rating rating-sm pr-5">
                        <input disabled type="radio" name="rating-4"
                               className="mask mask-star-2 bg-warning"/>
                        <input disabled type="radio" name="rating-4"
                               className="mask mask-star-2 bg-warning"/>
                        <input disabled type="radio" name="rating-4"
                               className="mask mask-star-2 bg-warning"/>
                        <input disabled checked type="radio" name="rating-4"
                               className="mask mask-star-2 bg-warning"/>
                        <input disabled type="radio" name="rating-4"
                               className="mask mask-star-2 bg-warning"/>
                    </div>
                    <progress
                        className="progress progress-warning w-[15em] sm:w-[25em] lg:w-[20em] 2xl:w-[25em]"
                        value={0} max="100"/>
                </div>
                <div className={"flex items-center"}>
                    <div className="rating rating-sm pr-5">
                        <input disabled type="radio" name="rating-3"
                               className="mask mask-star-2 bg-warning"/>
                        <input disabled type="radio" name="rating-3"
                               className="mask mask-star-2 bg-warning"/>
                        <input disabled checked type="radio" name="rating-3"
                               className="mask mask-star-2 bg-warning"/>
                        <input disabled type="radio" name="rating-3"
                               className="mask mask-star-2 bg-warning"/>
                        <input disabled type="radio" name="rating-3"
                               className="mask mask-star-2 bg-warning"/>
                    </div>
                    <progress
                        className="progress progress-warning w-[15em] sm:w-[25em] lg:w-[20em] 2xl:w-[25em]"
                        value={0} max="100"/>
                </div>
                <div className={"flex items-center"}>
                    <div className="rating rating-sm pr-5">
                        <input disabled type="radio" name="rating-2"
                               className="mask mask-star-2 bg-warning"/>
                        <input disabled checked type="radio" name="rating-2"
                               className="mask mask-star-2 bg-warning"/>
                        <input disabled type="radio" name="rating-2"
                               className="mask mask-star-2 bg-warning"/>
                        <input disabled type="radio" name="rating-2"
                               className="mask mask-star-2 bg-warning"/>
                        <input disabled type="radio" name="rating-2"
                               className="mask mask-star-2 bg-warning"/>
                    </div>
                    <progress
                        className="progress progress-warning w-[15em] sm:w-[25em] lg:w-[20em] 2xl:w-[25em]"
                        value={0} max="100"/>
                </div>
                <div className={"flex items-center"}>
                    <div className="rating rating-sm pr-5">
                        <input disabled checked type="radio" name="rating-1"
                               className="mask mask-star-2 bg-warning"/>
                        <input disabled type="radio" name="rating-1"
                               className="mask mask-star-2 bg-warning"/>
                        <input disabled type="radio" name="rating-1"
                               className="mask mask-star-2 bg-warning"/>
                        <input disabled type="radio" name="rating-1"
                               className="mask mask-star-2 bg-warning"/>
                        <input disabled type="radio" name="rating-1"
                               className="mask mask-star-2 bg-warning"/>
                    </div>
                    <progress
                        className="progress progress-warning w-[15em] sm:w-[25em] lg:w-[20em] 2xl:w-[25em]"
                        value={0} max="100"/>
                </div>
            </div>
        </>
    );
};

export default RatingPlaceholder;