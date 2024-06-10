"use client";

import {useContext, useEffect, useRef, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {Zoom, Navigation, Pagination} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/react";
import 'swiper/css/zoom';
import 'swiper/css';
import ProductItemRating from "@/components/ProductItemRating";
import {FaPen, FaTrash} from "react-icons/fa";
import {useSession} from "next-auth/react";
import FormatPrice from "@/components/FormatPrice";
import CustomBtn from "@/components/CustomBtn";
import toast from "react-hot-toast";
import GlobalContext from "@/context/GlobalContext";
import BackButton from "@/components/BackButton";
import BackButtonMessage from "@/components/BackButtonMessage";
import Image from "next/image";
import Loading from "@/app/loading";
import ProductItem from "@/components/ProductItem";
import ReviewModal from "@/components/modals/ReviewModal";
import ConfirmModal from "@/components/modals/ConfirmModal";
import {fetchProduct, fetchTopRatedProducts} from "@/utils/api-requests/fetchRequests";
import NotFound from "@/app/not-found";
import {motion} from "framer-motion";
import {convertCentsToUSD} from "@/utils/covertCentsToUSD";


const fetchDeleteProductReview = async (body, id, reviewId) => {
    const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;
    try {
        if (!apiDomain) {
            return null;
        }
        const response = await fetch(`${apiDomain}/products/${id}/review/${reviewId}/delete`, {
            method: "DELETE",
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


const ProductPage = () => {

    const { data: session } = useSession();
    const router = useRouter();

    const { dispatch, user } = useContext(GlobalContext);

    const {id} = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [productsTopRated, setProductsTopRated] = useState(null);
    const [loadingTopRated, setLoadingTopRated] = useState(true);
    const [imageIndex, setImageIndex] = useState(0);
    const [fullScreen, setFullScreen] =  useState(false);
    const [reviewData, setReviewData] = useState({});
    const [detailsActive, setDetailsActive] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const scrollTo = useRef(null);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const product = await fetchProduct(id);
                setProduct(product);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };
        if (product === null) fetchProductData();
    }, [product]);

    useEffect(() => {
        const fetchProductsTopRatedData = async () => {
            try {
                const products = await fetchTopRatedProducts();
                setProductsTopRated(products);
            } catch (e) {
                console.log(e);
            } finally {
                setLoadingTopRated(false);
            }
        };
        if (productsTopRated === null) fetchProductsTopRatedData();
    }, [productsTopRated]);


    const executeScroll = () => {
        scrollTo.current.scrollIntoView({behavior: "smooth", block: "start"})
    };

    const addToCartHandler = () => {
        dispatch({
            type: "ADD_TO_CART",
            payload: {...product, quantity},

        });
        dispatch({type: "UPDATE_CART"});
        dispatch({type: "SET_LOCAL_STORAGE"});
        toast.success(() => {
            return <span>Added To Cart</span>
        });
    };

    const submitDeleteProductReview = async () => {
        const body = {
            sessionUserId: user._id,
            reviewUserId: reviewData.reviewUserId
        }
        const res = await fetchDeleteProductReview(body, id, reviewData.reviewId);
        if (res) {
            setProduct(res);
            // const productReviews = [...product.reviews];
            // const updatedProductReviews = productReviews.filter((review) => {
            //     return review._id !== reviewData.reviewId;
            // });
            // let updatedProduct = {...product}
            // delete updatedProduct.reviews
            // const finalProduct = {...updatedProduct, reviews: updatedProductReviews}
            // setProduct(finalProduct);
            toast.success("Review deleted!");
        }
    };

    const openConfirmModalAndSetReviewData = (reviewId, reviewUserId) => {
        setReviewData({reviewId, reviewUserId});
        window.confirm_modal.showModal();
    };

    if (!loading && fullScreen && product) {
        return (
            <div className={"z-30 h-max bg-black absolute top-0 right-0 left-0 bottom-0"}>
                <div className={"relative"}>
                    <button onClick={() => setFullScreen(false)}
                            className={"z-10 hover:text-blue-500 rounded-full bg-black/50 p-3 text-2xl text-white absolute top-5 right-5"}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="h-7 w-7" viewBox="0 0 24 24"
                             stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                    <Swiper
                        zoom={true}
                        initialSlide={imageIndex}
                        spaceBetween={0}
                        centeredSlides={true}
                        modules={[Zoom, Navigation, Pagination]}
                        slidesPerView={1}
                        pagination
                        navigation>
                        {product.images.map(function (data, index) {
                            return (
                                <SwiperSlide key={index}>
                                    <div className={"h-screen flex justify-center items-center"}>
                                        <div className={"swiper-zoom-container"}>
                                            <Image
                                                className={"h-[600px] w-[600px]"}
                                                width={600}
                                                height={600}
                                                src={data.length !== 0 ? data.url : "/images/sample.jpg"}
                                                alt={"item"}
                                            />
                                        </div>
                                    </div>
                                </SwiperSlide>
                            )
                        })}
                    </Swiper>
                </div>
            </div>
        )
    }

    if (!loading && product && !loadingTopRated && productsTopRated) {
        return (
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
            >
                <div className={"flex w-full"}>
                    <div className={"w-2/12 md:w-1/12"}>
                        <BackButton/>
                    </div>
                    <BackButtonMessage width={"w-10/12 md:w-11/12"}/>
                </div>
                <div className={"flex flex-col"}>
                    <div className={"pt-14 sm:pt-20 lg:pt-4 flex flex-col lg:flex-row"}>
                        <div className={"lg:w-9/12 flex flex-col lg:pl-3"}>
                            <div className={"sm:hidden px-3 py-3 flex flex-col"}>
                                <span className={"text-2xl font-semibold"}>{product.name}</span>
                                <div className={"flex"}>

                                    <div className={"flex items-center pt-3"}>
                                        <div>
                                            <ProductItemRating rating={product.rating}/>
                                        </div>
                                        <div onClick={executeScroll}
                                             className={"pl-4 text-sm font-semibold link-primary cursor-pointer"}>
                                            {product.numReviews !== 0 ? `${product.rating.toFixed(1)} rating` : "0 reviews"}
                                        </div>
                                        <div className={"pl-6 flex"}>
                                            <button
                                                onClick={() => {
                                                    session ? window.review_modal.showModal() : router.push("/login")
                                                }}
                                                className={"pb-[1px] flex border-b border-gray-400"}
                                            >
                                                <FaPen className={"w-3"} fill={"gray"}/>
                                                <span
                                                    className={"text-gray-500 pl-2 text-xs font-semibold"}>Write a review</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/*<button onClick={executeScroll} className={"text-sm link link-primary"}><Rating rating={product.rating} text={`${product.numReviews} ${product.numReviews === 1 ? "review" : "reviews"}`}/>*/}
                                    {/*</button>*/}
                                </div>
                            </div>
                            {/*<div className={"w-full flex flex-col lg:flex-row flex-wrap bg-white md:border px-5 xl:px-7 pt-3 md:pt-10 sm:pb-5"}>*/}
                            <div className={"w-full flex flex-col lg:flex-row flex-wrap"}>
                                <div className={"flex flex-col lg:w-6/12 xl:w-5/12 2xl:w-4/12"}>
                                    <div className={"w-full flex justify-center sm:border-none bg-stone-100"}
                                         onClick={() => setFullScreen(true)}>
                                        <Image
                                            priority
                                            src={product.images.length !== 0 ? product.images[imageIndex]?.url : "/images/sample.jpg"}
                                            alt={"product"}
                                            height={448}
                                            width={448}
                                            className={"w-auto cursor-pointer rounded-sm object-scale-down h-[28em] lg:h-[20em] xl:h-[24em] 2xl:h-[28em]"}
                                        />
                                    </div>
                                    <div className={"w-full flex justify-center pt-7 px-5"}>
                                        {
                                            product.images.map(function (image, index) {
                                                return (
                                                    <div onMouseEnter={() => setImageIndex(index)} key={index}
                                                         onDoubleClick={() => setFullScreen(true)}
                                                         className={"px-1 cursor-pointer"}>
                                                        <Image
                                                            priority
                                                            className={`w-full h-full max-h-20 object-cover rounded-sm transform transition duration-300 ${imageIndex === index ? "outline outline-offset-1 outline-blue-500 outline-1 opacity-100" : "opacity-50"}`}
                                                            src={image?.url}
                                                            height={80}
                                                            width={80}
                                                            alt={"products"}
                                                        />
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                <div
                                    className={"px-2 lg:px-0 lg:w-6/12 xl:w-7/12 2xl:w-8/12 flex flex-col lg:flex-row py-7 lg:py-0"}>

                                    <div
                                        className={"bg-white lg:bg-transparent px-2 md:px-6 2xl:px-10 pt-5 lg:pt-0 w-full h-min"}>

                                        <div className={"hidden sm:block pb-3"}>
                                        <span
                                            className={"text-2xl lg:text-xl 2xl:text-2xl font-semibold"}>{product.name}</span>
                                            <div className={"flex items-center pt-2"}>
                                                <div>
                                                    <ProductItemRating rating={product.rating}/>
                                                </div>
                                                <div className={"pl-4 text-sm font-semibold"}>
                                                    {product.numReviews !== 0 ? `${product.rating.toFixed(1)} rating` : "0 reviews"}
                                                </div>
                                                <div className={"pl-6 flex lg:hidden"}>
                                                    <button
                                                        onClick={() => {
                                                            session ? window.review_modal.showModal() : router.push("/login")
                                                        }}
                                                        className={"pb-[1px] flex border-b border-gray-400"}
                                                    >
                                                        <FaPen className={"w-3"} fill={"gray"}/>
                                                        <span className={"text-gray-500 pl-2 text-xs font-semibold"}>Write a review</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={"pb-4 sm:pt-4 flex justify-between"}>
                                            <FormatPrice price={convertCentsToUSD(product.price).toString()} fontSize={"text-3xl"}>
                                                /ea.
                                            </FormatPrice>
                                            <div className={"flex pt-2 md:hidden text-lg"}>
                                                {
                                                    product.countInStock > 0 ? (
                                                        <span
                                                            className={"font-semibold"}>Remaining in stock: {product.countInStock}</span>
                                                    ) : (
                                                        <span
                                                            className={"text-red-600 w-full font-semibold flex justify-start"}>Out of stock</span>
                                                    )
                                                }
                                            </div>
                                        </div>
                                        <div>
                                            <h6 className={"text-lg lg:text-sm text-start pt-5 pb-5 font-bold lg:pb-2"}>Specifications
                                                --</h6>
                                        </div>
                                        <div className={"lg:text-sm py-1 w-full flex"}>
                                            <div className={"w-4/12"}>
                                                <span className={"font-semibold pr-3"}>Brand:</span>
                                            </div>
                                            <div className={"w-8/12"}>
                                                <span className={"font-normal w-8/12"}>{product.brand}</span>
                                            </div>
                                        </div>
                                        <div className={"lg:text-sm py-1 flex"}>
                                            <div className={"w-4/12"}>
                                                <span className={"font-semibold pr-2"}>Model:</span>
                                            </div>
                                            <div className={"w-8/12"}>
                                                <span className={"font-normal"}>{product.model}</span>
                                            </div>
                                        </div>
                                        <div className={"lg:text-sm py-1 flex"}>
                                            <div className={"w-4/12"}>
                                                <span className={"font-semibold pr-2"}>Color:</span>
                                            </div>
                                            <div className={"w-8/12"}>
                                                <span className={"font-normal"}>{product.color}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <h6 className={"text-lg lg:text-sm text-start pt-5 pb-5 font-bold lg:pb-2"}>About
                                                this product --</h6>
                                        </div>
                                        <div className={"xl:hidden lg:text-sm pt-1 pb-5 flex flex-col"}>
                                            <p className={"font-normal"}>{detailsActive ? product.description : product.description.substring(0, 138) + "..."}</p>
                                            <span className={"self-end link link-primary"}
                                                  onClick={() => setDetailsActive(prevState => !prevState)}>{detailsActive ? "show less" : "show more"}</span>
                                        </div>
                                        <p className={"text-sm font-normal hidden xl:block"}>{product.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            !product.isDisabled && (
                                <div className={"px-2 lg:px-0 lg:pr-3 pt-0 lg:w-3/12"}>
                                    <div className={"h-full p-7 text-lg lg:text-sm bg-white border sm:mx-0"}>
                                        <div className={"py-2 sm:hidden"}>Buy Now</div>
                                        <div className={"flex py-2"}>
                                            <div className={"w-full flex justify-start items-start"}>
                                                <FormatPrice price={convertCentsToUSD(product.price).toString()} fontSize={"text-2xl"}/>
                                            </div>
                                        </div>
                                        {
                                            product.price > 100 && (
                                                <div className={"flex py-2"}>
                                                    <span><span
                                                        className={"pr-1 text-lg font-semibold text-green-400"}>FREE</span>3-day shipping </span>
                                                </div>
                                            )
                                        }
                                        <div className={"flex pb-5 pt-3"}>
                                            {
                                                product.countInStock > 0 ? (
                                                    <span
                                                        className={"font-semibold text-lg"}>Only {product.countInStock} left in stock - order soon</span>
                                                ) : (
                                                    <span
                                                        className={"text-red-600 w-full font-semibold flex justify-start"}>Out of stock</span>
                                                )
                                            }
                                        </div>
                                        <div className={"flex justify-center"}>
                                            <div className={"w-full text-sm font-semibold "}>
                                                <div className={"flex pt-2 pb-2 text-gray-500"}>
                                                    <span className={"w-5/12 text-start"}>Ships from:</span>
                                                    <span className={"w-7/12 text-start"}>San Antonio, TX</span>
                                                </div>
                                                <div className={"flex pb-2 text-gray-500"}>
                                                    <span className={"w-5/12 text-start"}>Sold by:</span>
                                                    <span className={"w-7/12 text-start"}>Oscar Castro</span>
                                                </div>
                                                <div className={"flex pb-2 text-gray-500"}>
                                                    <span className={"w-5/12 text-start"}>Listed on:</span>
                                                    <span
                                                        className={"w-7/12 text-start"}>{`${product.createdAt.substring(5, 10)}-${product.createdAt.substring(0, 4)}`}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={"w-full flex flex-col justify-between pt-3"}>
                                            <div className={"flex pb-5"}>
                                                {
                                                    product.countInStock > 0 && (
                                                        <div
                                                            className={"py-3 flex justify-end lg:justify-start items-center w-full"}>
                                                            <div
                                                                className={"w-6/12 lg:w-8/12 rounded-md border-gray-200 border h-12 flex justify-start items-center px-2"}>
                                                                <label htmlFor={"qty"}
                                                                       className={"text-sm font-semibold pr-1"}>Quantity:</label>
                                                                <select
                                                                    id={"qty"}
                                                                    className="h-full w-full !outline-none text-sm bg-white"
                                                                    value={quantity}
                                                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                                                >
                                                                    {
                                                                        [...Array(product.countInStock).keys()].map(function (x) {
                                                                            return (
                                                                                <option key={x} value={x + 1}>
                                                                                    {x + 1}
                                                                                </option>
                                                                            )
                                                                        })
                                                                    }
                                                                </select>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            <CustomBtn isDisabled={product.countInStock === 0} onClick={addToCartHandler}>
                                                Add To Cart
                                            </CustomBtn>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    <div ref={scrollTo} className={"w-full pl-2 lg:pl-3"}>
                        {/*//////////////*/}
                        <div id="reviews"
                             className={"pt-10 lg:pt-6 xl:pt-15 flex flex-col lg:flex-row lg:justify-start pb-10"}>
                            <div className={"w-full lg:w-6/12 pr-2 lg:pr-3"}>
                                <div className={"h-full"}>
                                    <div
                                        className={`py-2 lg:pl-3 pl-5 flex justify-center md:justify-between items-center text-3xl md:text-2xl ibmplex md:bg-zinc-700 md:text-white`}>
                                        <h2>Customer Reviews
                                            <span
                                                className={"text-2xl md:text-xl md:text-white pl-2"}>{product.reviews.length !== 0 ? `(${product.numReviews})` : "(0)"}</span>
                                        </h2>
                                        <div className={"hidden md:flex pr-3"}>
                                            <button
                                                onClick={() => {
                                                    session ? window.review_modal.showModal() : router.push("/login")
                                                }}
                                                className={"pb-[1px] flex items-center border-b border-gray-400"}
                                            >
                                                <FaPen className={"w-3"} fill={"white"}/>
                                                <span
                                                    className={"text-white pl-2 text-xs font-semibold"}>Write a review</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div
                                        className={"lg:max-h-[28em] lg:overflow-y-auto md:shadow-lg bg-white px-2 md:px-5 lg:px-8 lg:pb-8 py-4 lg:py-6 md:border"}>
                                        {
                                            product.reviews.length !== 0 && (
                                                <div className={"md:hidden w-full flex justify-center"}>
                                                    <button
                                                        onClick={() => session ? window.review_modal.showModal() : router.push("/login")}
                                                        className={"btn btn-neutral btn-sm rounded-full normal-case"}>
                                                        Write a review
                                                    </button>
                                                </div>
                                            )
                                        }

                                        {
                                            product.reviews.length === 0 && (
                                                <>
                                                    <div className={"py-8 md:pt-4 md:pb-8 px-4 flex justify-center"}>
                                                        <span className={"text-2xl font-light text-center"}>This product does not have any reviews yet</span>
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

                                                    <div className={"md:hidden w-full flex justify-center pb-8"}>
                                                        <button
                                                            onClick={() => session ? window.review_modal.showModal() : router.push("/login")}
                                                            className={"btn btn-neutral btn-sm rounded-full normal-case"}>
                                                            Write a review
                                                        </button>
                                                    </div>

                                                </>
                                            )
                                        }
                                        {
                                            product.reviews.length !== 0 && (
                                                product.reviews.map(function (review, index) {
                                                    return (
                                                        <div key={index} className={"py-3 border-b"}>
                                                            <div className={"flex flex-col"}>
                                                                <div className={"flex justify-between"}>
                                                                    <div className={"flex items-center"}>
                                                                        <div className="avatar placeholder">
                                                                            <div
                                                                                className="bg-neutral-400 text-neutral-content rounded-full w-6">
                                                                            <span
                                                                                className="text-xs">{review.name.substring(0, 1).toUpperCase()}</span>
                                                                            </div>
                                                                        </div>
                                                                        <span
                                                                            className={"pl-2 text-xs font-bold text-neutral-500"}>{review.name}</span>
                                                                    </div>
                                                                    <div
                                                                        className={"pb-2 text-xs text-neutral-500 flex items-center"}>
                                                                        {
                                                                            user?._id === review.user && (
                                                                                <button
                                                                                    onClick={() => openConfirmModalAndSetReviewData(review._id, review.user)}
                                                                                    className={"pl-2"}>
                                                                                    <FaTrash fill={"red"}/>
                                                                                </button>
                                                                            )
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className={"pt-2 flex items-start"}>
                                                                    <ProductItemRating rating={review.rating}/>
                                                                </div>
                                                            </div>
                                                            <p className={"pt-2 text-sm font-bold"}>
                                                                {review.title}
                                                            </p>
                                                            <div className={"pt-1 text-xs text-gray-500"}>
                                                                <span className={"pr-1"}>Reviewed on</span>
                                                                {`${review.createdAt.substring(5, 10)}-${review.createdAt.substring(0, 4)}`}
                                                            </div>
                                                            <p className={"pt-1 text-sm font-normal"}>
                                                                {review.comment}
                                                            </p>
                                                        </div>
                                                    )
                                                })
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className={"hidden lg:pr-3 lg:block w-full lg:w-6/12 pt-0 sm:pt-10 lg:pt-0 lg:pl-3 "}>
                                <div className={"flex flex-col"}>
                                    <div className={"py-2 px-5 pl-3 bg-zinc-700"}>
                                        <h2 className={"text-2xl ibmplex text-white"}>You might also like</h2>
                                    </div>
                                    <div
                                        className={"shadow-lg bg-white sm:px-3 sm:pb-2 flex overflow-x-auto h-full border"}>
                                        {
                                            productsTopRated.map(function (product, index) {
                                                return <ProductItem
                                                    key={index}
                                                    product={product}
                                                    smallSize={true}
                                                    cardWidth={"w-[12em] sm:w-56"}
                                                    windowInnerWidth={768}/>
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ReviewModal productId={id} onPage={true} setProduct={setProduct}/>
                <ConfirmModal title={"Are you sure you want to delete this review?"}
                              initiateFunction={submitDeleteProductReview}/>
            </motion.div>
        )
    }
    if (!product && !loading) return <NotFound/>
    return <Loading/>
};

export default ProductPage;