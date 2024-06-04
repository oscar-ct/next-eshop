"use client";

import {useContext, useState} from "react";
import {toast} from "react-hot-toast";
import CustomBtn from "@/components/CustomBtn";
import GlobalContext from "@/context/GlobalContext";


const fetchReviewProduct = async (body, id) => {
    const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;
    try {
        if (!apiDomain) {
            return null;
        }
        const response = await fetch(`${apiDomain}/products/${id}/review`, {
            method: "POST",
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            const message = await response.text();
            toast.error(message);
            return null;
        }
        return response.json();
    } catch (e) {
        console.log(e);
        return null;
    }
};


const ReviewModal = ({ productId, onPage, setProduct}) => {

    const { user } = useContext(GlobalContext);

    const [rating, setRating] = useState("0");
    const [title, setTitle] = useState("");
    const [reviewBody, setReviewBody] = useState("");
    const [errorReviewMessage, setErrorReviewMessage] = useState("");

    const closeReviewModal = () => {
        setErrorReviewMessage("");
        setReviewBody("");
        setTitle("");
    };

    const submitProductReview = async (e) => {
        e.preventDefault();
        if (rating === "0") {
            setErrorReviewMessage("Please select a rating");
            return
        }
        if (!reviewBody || !title) {
            setErrorReviewMessage("Please fill out all text fields");
            return
        }
        const body = {
            username: user.name,
            userId: user._id,
            rating,
            title,
            comment: reviewBody,
        }
        const res = await fetchReviewProduct(body, productId);
        if (onPage && res) {
            setProduct(res);
            toast.success("Review added!");
        }
        setErrorReviewMessage("");
        setReviewBody("");
        // setRating("0");
        setTitle("");
        window.review_modal.close();
    };

    return (
        <dialog id="review_modal" className="modal modal-bottom sm:modal-middle">
            <form method="dialog" className="modal-box bg-white">
                <div className={"flex justify-between items-center"}>
                    <h3 className="p-4 font-bold text-xl">Review Product</h3>
                    <div className="rating rating-lg">
                        <input type="radio" value={"0"} name="rating-2" className="rating-hidden" defaultChecked onChange={(e) => setRating(e.target.value)}/>
                        <input type="radio"  value={"1"} name="rating-2" className="mask mask-star-2 bg-orange-300" onChange={(e) => setRating(e.target.value)}/>
                        <input type="radio"  value={"2"} name="rating-2" className="mask mask-star-2 bg-orange-300" onChange={(e) => setRating(e.target.value)}/>
                        <input type="radio"  value={"3"} name="rating-2" className="mask mask-star-2 bg-orange-300" onChange={(e) => setRating(e.target.value)}/>
                        <input type="radio"  value={"4"} name="rating-2" className="mask mask-star-2 bg-orange-300" onChange={(e) => setRating(e.target.value)}/>
                        <input type="radio"  value={"5"} name="rating-2" className="mask mask-star-2 bg-orange-300" onChange={(e) => setRating(e.target.value)}/>
                    </div>
                </div>

                <div className="px-4">
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Add a headline</span>
                        </label>
                        <input type="text" placeholder="What's most important to know?" className="bg-white w-full text-base px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400" value={title} onChange={(e) => {
                            setTitle(e.target.value);
                        }}/>
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Add a review</span>
                        </label>
                        <textarea value={reviewBody} placeholder="What did you like or dislike? What did you use this product for?" className="h-20 bg-white w-full text-base px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400" onChange={(e) => {
                            setReviewBody(e.target.value);
                        }}/>
                    </div>
                    {
                        errorReviewMessage && (
                            <h2 className={"pt-2 text-center text-red-600 font-bold"}>
                                {errorReviewMessage}
                            </h2>
                        )

                    }
                </div>
                <div className="modal-action">
                    <button onClick={closeReviewModal} className={"btn btn-neutral rounded-full normal-case"}>Cancel</button>
                    <CustomBtn type={"submit"} onClick={submitProductReview} customClass={"text-sm"}>
                        Submit
                    </CustomBtn>
                </div>
            </form>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    );
};

export default ReviewModal;