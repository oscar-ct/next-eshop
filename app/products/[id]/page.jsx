"use client";

import {useContext, useEffect, useRef, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {Zoom, Navigation, Pagination} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/react";
import 'swiper/css/zoom';
import 'swiper/css';
import {FaPen, FaTrash} from "react-icons/fa";
import ProductDollarAmount from "@/app/products/[id]/components/ProductDollarAmount";
import Btn from "@/components/Btn";
import toast from "react-hot-toast";
import GlobalContext from "@/context/GlobalContext";
import BackButton from "@/components/BackButton";
import BackButtonMessage from "@/components/BackButtonMessage";
import Image from "next/image";
import ReviewModal from "@/components/modals/ReviewModal";
import ConfirmModal from "@/components/modals/ConfirmModal";
import {fetchDeleteProductReview, fetchProduct} from "@/utils/apiFetchRequests";
import NotFound from "@/app/not-found";
import {convertCentsToUSD} from "@/utils/covertCentsToUSD";
import ProductRatingPlaceholder from "@/app/products/[id]/components/ProductRatingPlaceholder";
import {MdOutlineRateReview} from "react-icons/md";
import RevealMotion from "@/components/RevealMotion";
import usaFlag from "@/icons/usa.svg"
import {deliveryDateString} from "@/utils/formatDeliveryDate";
import ProductRating from "@/app/products/[id]/components/ProductRating";


const ProductIdPage = () => {

    const router = useRouter();
    const { dispatch, user } = useContext(GlobalContext);

    const {id} = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingDelete, setLoadingDelete] = useState(false);
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
        window.add_to_cart_modal.showModal();
    };

    const submitDeleteProductReview = async () => {
        setLoadingDelete(true);
        const body = {
            sessionUserId: user.id,
            reviewUserId: reviewData.userId
        }
        const product = await fetchDeleteProductReview(body, id, reviewData.reviewId);
        if (product) {
            setProduct(product);
            // let updatedProduct = {...product}
            // delete updatedProduct.reviews
            // const finalProduct = {...updatedProduct, reviews: updatedProductReviews}
            // setProduct(finalProduct);
            toast.success("Review deleted!");
            setLoadingDelete(false);
        }
    };

    const deleteReviewModal = (reviewId, userId) => {
        setReviewData({reviewId, userId});
        window.confirm_modal.showModal();
    };

    if (!loading && !product) return <NotFound/>

    if (!loading && fullScreen && product) return (
        <div className={"z-50 bg-black h-full fixed top-0 right-0 left-0 bottom-0"}>
            <div className={"h-full relative flex items-center"}>
                <button onClick={() => setFullScreen(false)}
                        className={"z-50 hover:text-blue-500 rounded-full bg-black/50 p-3 text-2xl text-white absolute top-5 right-5"}>
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
                                <div className={"swiper-zoom-container !h-screen"}>
                                    <Image
                                        className={"w-auto h-auto"}
                                        width={600}
                                        height={600}
                                        src={data.length !== 0 ? data.url : "/images/sample.jpg"}
                                        alt={"item"}
                                    />
                                </div>
                            </SwiperSlide>
                        )
                    })}
                </Swiper>
            </div>
        </div>
    );

    return (
        <>
            <div className={"flex w-full"}>
                <div className={"w-2/12 md:w-1/12"}>
                    <BackButton/>
                </div>
                <BackButtonMessage width={"w-10/12 md:w-11/12"}/>
            </div>
            <div className={"px-2 pt-16 flex flex-col items-center gap-4 xl:flex-row xl:justify-center xl:items-start"}>
                <div className={"bg-zinc-50 z-20 px-4 py-8 w-full rounded-2xl sm:px-8 sm:bg-white sm:shadow-lg sm:border-none md:max-w-3xl dark:bg-slate-800"}>
                    {
                        loading && !product ? (
                            <div className="flex w-full flex-col gap-5 h-full">
                                <div className="skeleton h-6 w-full bg-gray-300 dark:bg-gray-200"/>
                                <div className="skeleton h-6 w-full bg-gray-300 dark:bg-gray-200"/>
                                <div className={"flex items-center justify-between"}>
                                    <div className="skeleton h-4 w-3/12 bg-gray-300 dark:bg-gray-200"/>
                                    <div className="skeleton h-4 w-2/12 bg-gray-300 dark:bg-gray-200"/>
                                </div>
                                <div className="skeleton h-96 w-full bg-gray-300 dark:bg-gray-200"/>
                                <div className="skeleton h-16 w-full bg-gray-300 dark:bg-gray-200"/>
                                <div className="skeleton h-4 w-28 bg-gray-300 dark:bg-gray-200"/>
                                <div className="skeleton h-4 w-full bg-gray-300 dark:bg-gray-200"/>
                                <div className="skeleton h-4 w-full bg-gray-300 dark:bg-gray-200"/>
                                <div className="skeleton h-4 w-28 bg-gray-300 dark:bg-gray-200"/>
                                <div className="skeleton h-4 w-full bg-gray-300 dark:bg-gray-200"/>
                                <div className="skeleton h-4 w-full bg-gray-300 dark:bg-gray-200"/>
                                <div className="skeleton h-4 w-28 bg-gray-300 dark:bg-gray-200"/>
                                <div className="skeleton h-4 w-full bg-gray-300 dark:bg-gray-200"/>
                                <div className="skeleton h-4 w-full bg-gray-300 dark:bg-gray-200"/>
                            </div>
                        ) : (
                            <RevealMotion y={25} childClass={"flex flex-col gap-4"}>
                            <div className={"flex flex-col gap-4"}>
                                    <h2 className={"text-2xl text-center sm:text-3xl dark:text-white"}>{product.name}</h2>
                                    <div className={"flex items-center justify-between"}>
                                        <div className={"flex gap-2"}>
                                            <ProductRating rating={product.rating}/>
                                            <div onClick={executeScroll}
                                                 className={"text-sm font-semibold link-primary cursor-pointer"}>
                                                {product.reviews.length !== 0 ? `${product.rating.toFixed(1)} rating` : "0 reviews"}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                user ? window.review_modal.showModal() : router.push("/login")
                                            }}
                                            className={"pb-[1px] flex border-b border-gray-400"}
                                        >
                                            <FaPen className={"w-3"} fill={"gray"}/>
                                            <span className={"text-gray-500 pl-2 text-xs font-semibold"}>Write a review</span>
                                        </button>
                                    </div>
                                </div>
                                <div className={"flex flex-col gap-6 w-full h-full lg:flex-row"}>
                                    <div className={"flex justify-center sm:border-none bg-stone-100 rounded-lg h-96 relative lg:w-10/12"}
                                        onClick={() => setFullScreen(true)}>
                                        <Image
                                            priority
                                            src={product.images.length !== 0 ? product.images[imageIndex]?.url : "/images/sample.jpg"}
                                            alt={"product"}
                                            fill={true}
                                            sizes={"384px"}
                                            className={"cursor-pointer rounded-lg object-scale-down"}
                                        />
                                    </div>
                                    <div className={"flex justify-center gap-3 lg:flex-col lg:items-center lg:w-2/12 lg:max-h-96"}>
                                        {
                                            product.images.map(function (image, index) {
                                                return (
                                                    <div onMouseEnter={() => setImageIndex(index)} key={index}
                                                         onDoubleClick={() => setFullScreen(true)}
                                                         className={"cursor-pointer flex justify-center items-center h-20 w-20 relative"}>
                                                        <Image
                                                            priority
                                                            className={`object-scale-down rounded-sm transform transition duration-300 ${imageIndex === index ? "outline outline-offset-1 outline-blue-500 outline-1 opacity-100" : "opacity-50"}`}
                                                            src={image?.url}
                                                            fill={true}
                                                            alt={"products"}
                                                            sizes={"80px"}
                                                        />
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                <div className={"flex flex-col gap-6 pt-4"}>
                                    <div className={"flex justify-between items-end"}>
                                        <ProductDollarAmount
                                            price={convertCentsToUSD(product.price).toString()}
                                            fontSize={"text-4xl"}
                                        >
                                            /ea.
                                        </ProductDollarAmount>
                                        {
                                            product.countInStock > 0 ? (
                                                <div className={"text-green-500 font-semibold"}>
                                                    Remaining in stock: {product.countInStock}
                                                </div>
                                            ) : (
                                                <div className={"text-red-600 font-semibold"}>
                                                    Out of Stock
                                                </div>
                                            )
                                        }
                                    </div>
                                    {
                                        !product.isDisabled && product.countInStock > 0 && (
                                            <div className={"flex flex-col gap-6 lg:flex-row"}>
                                                <div
                                                    className={"bg-zinc-100 w-full rounded-md h-12 flex justify-start items-center px-2 dark:bg-slate-600 dark:text-white"}>
                                                    <label
                                                        htmlFor={"qty"}
                                                        className={"text-sm font-semibold pr-1"}
                                                    >
                                                        Quantity:
                                                    </label>
                                                    <select
                                                        id={"qty"}
                                                        className="bg-zinc-100 h-full w-full font-semibold !outline-none text-sm dark:bg-slate-600 dark:text-white"
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
                                                <Btn customClass={"w-full"}
                                                     isDisabled={product.countInStock === 0}
                                                     onClick={addToCartHandler}>
                                                    Add To Cart
                                                </Btn>
                                            </div>
                                        )
                                    }
                                    <div className={"h-0.5 bg-slate-400 w-full"}/>
                                    <h6 className={"text-lg font-semibold dark:text-white"}>
                                        Description --
                                    </h6>
                                    <div className={"xl:hidden flex flex-col dark:text-white"}>
                                        <p>
                                            {detailsActive ? product.description : product.description.substring(0, 256) + "..."}
                                        </p>
                                        <div
                                            className={"self-end link link-primary"}
                                            onClick={() => setDetailsActive(prevState => !prevState)}
                                        >
                                            {detailsActive ? "show less" : "show more"}
                                        </div>
                                    </div>
                                    <p className={"hidden xl:block dark:text-white"}>
                                        {product.description}
                                    </p>
                                    <div className={"h-0.5 bg-slate-400 w-full"}/>
                                    {
                                        !product.isDisabled && product.countInStock > 0 && (
                                            <>
                                                <h6 className={"text-lg font-semibold dark:text-white"}>
                                                    Delivery --
                                                </h6>
                                                <div className={"flex gap-4 md:gap-8"}>
                                                    <div className={"flex items-center"}>
                                                        <Image
                                                            src={usaFlag}
                                                            alt={"usa"}
                                                            width={50}
                                                            height={50}
                                                            className={"w-12 h-10"}
                                                        />
                                                    </div>
                                                    <div className={"flex flex-col gap-4"}>
                                                        <div
                                                            className={"flex flex-col md:items-center md:gap-4 md:flex-row"}>
                                                            <span
                                                                className={"dark:text-white line-through"}>Express by {deliveryDateString("express")}</span>
                                                            <span
                                                                className={"text-xs text-red-500"}>(currently unavailable)</span>
                                                        </div>
                                                        <div className={"dark:text-white"}>
                                                            Standard between {deliveryDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={"h-0.5 bg-slate-400 w-full"}/>
                                            </>
                                        )
                                    }
                                    <h6 className={"text-lg font-semibold dark:text-white"}>
                                        Details --
                                    </h6>
                                    <div
                                        className={"text-sm flex flex-col w-full gap-4 sm:gap-0 sm:flex-row dark:text-white"}>
                                        <div className={"flex flex-col w-full gap-4 sm:w-6/12"}>
                                            <div className={"flex"}>
                                                <div className={"w-4/12"}>
                                                    <div className={"font-semibold"}>
                                                        Brand
                                                    </div>
                                                </div>
                                                <div className={"w-8/12"}>
                                                    {product.brand}
                                                </div>
                                            </div>
                                            <div className={"flex"}>
                                                <div className={"w-4/12"}>
                                                    <div className={"font-semibold"}>
                                                        Model
                                                    </div>
                                                </div>
                                                <div className={"w-8/12"}>
                                                    {product.model}
                                                </div>
                                            </div>
                                            <div className={"flex"}>
                                                <div className={"w-4/12"}>
                                                    <div className={"font-semibold"}>
                                                        Color
                                                    </div>
                                                </div>
                                                <div className={"w-8/12"}>
                                                    {product.color}
                                                </div>
                                            </div>
                                            <div className={"flex"}>
                                                <div className={"w-4/12"}>
                                                    <div className={"font-semibold"}>
                                                        Category
                                                    </div>
                                                </div>
                                                <div className={"w-8/12"}>
                                                    {product.category}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={"flex flex-col w-full gap-4 sm:w-6/12"}>
                                            <div className={"flex"}>
                                                <div className={"w-4/12"}>
                                                    <div className={"font-semibold"}>
                                                        Ships from
                                                    </div>
                                                </div>
                                                <div className={"w-8/12"}>
                                                    San Antonio, TX
                                                </div>
                                            </div>
                                            <div className={"flex"}>
                                                <div className={"w-4/12"}>
                                                    <div className={"font-semibold"}>
                                                        Sold by
                                                    </div>
                                                </div>
                                                <div className={"w-8/12"}>
                                                    Oscar Castro
                                                </div>
                                            </div>
                                            <div className={"flex"}>
                                                <div className={"w-4/12"}>
                                                    <div className={"font-semibold"}>
                                                        Listed on
                                                    </div>
                                                </div>
                                                <div className={"w-8/12"}>
                                                    {`${product.createdAt.substring(5, 10)}-${product.createdAt.substring(0, 4)}`}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </RevealMotion>
                        )
                    }
                </div>
                <div className={"flex flex-col w-full md:max-w-3xl xl:max-w-xl"}>
                    <div className={"bg-zinc-50 z-20 px-4 py-8 w-full rounded-2xl sm:px-8 sm:bg-white sm:shadow-lg sm:border-none dark:bg-slate-800"}>
                        {
                            loading && !product ? (
                                <div className="flex w-full flex-col gap-5 h-full">
                                    <div className="skeleton h-4 w-full bg-gray-300 dark:bg-gray-200"/>
                                    <div className="skeleton h-4 w-2/12 bg-gray-300 dark:bg-gray-200"/>
                                    <div className="skeleton h-4 w-full bg-gray-300 dark:bg-gray-200"/>
                                    <div className="skeleton h-4 w-full bg-gray-300 dark:bg-gray-200"/>
                                    <div className="skeleton h-4 w-3/12 bg-gray-300 dark:bg-gray-200"/>
                                    <div className="skeleton h-4 w-full bg-gray-300 dark:bg-gray-200"/>
                                    <div className="skeleton h-4 w-full bg-gray-300 dark:bg-gray-200"/>
                                    <div className="skeleton h-4 w-2/12 bg-gray-300 dark:bg-gray-200"/>
                                    <div className="skeleton h-4 w-full bg-gray-300 dark:bg-gray-200"/>
                                    <div className="skeleton h-4 w-full bg-gray-300 dark:bg-gray-200"/>
                                </div>
                            ) : (
                                <RevealMotion y={25} childClass={"flex flex-col gap-6"}>
                                    <h2 ref={scrollTo} id={"reviews"}
                                        className={"text-3xl text-center dark:text-white"}
                                    >
                                        Customer Reviews
                                        <span className={"pl-2"}>{product.reviews.length !== 0 ? `(${product.reviews.length})` : "(0)"}</span>
                                    </h2>
                                    <div>
                                        {
                                            product.reviews.length !== 0 && (
                                                <div className={"w-full flex justify-center"}>
                                                    <button
                                                        onClick={() => user ? window.review_modal.showModal() : router.push("/login")}
                                                        className={"btn btn-sm btn-neutral rounded-full"}
                                                    >
                                                        <MdOutlineRateReview size={26}/>
                                                        <span>Rate & Review</span>
                                                    </button>
                                                </div>
                                            )
                                        }
                                        {
                                            product.reviews.length === 0 && (
                                                <>
                                                    <div className={"w-full flex justify-center"}>
                                                        <button
                                                            onClick={() => user ? window.review_modal.showModal() : router.push("/login")}
                                                            className={"btn btn-sm btn-neutral rounded-full"}
                                                        >
                                                            <MdOutlineRateReview size={26}/>
                                                            <span>Rate & Review</span>
                                                        </button>
                                                    </div>
                                                    <ProductRatingPlaceholder/>
                                                </>

                                            )
                                        }
                                        {
                                            product.reviews.length !== 0 && (
                                                product.reviews.map(function (review, index) {
                                                    return (
                                                        <div key={index} className={"py-3 border-b"}>
                                                            <div className={"flex flex-col gap-2"}>
                                                                <div className={"flex justify-between"}>
                                                                    <div className={"flex items-center gap-2"}>
                                                                        <div className="avatar placeholder">
                                                                            <div className="bg-neutral-400 text-neutral-content rounded-full w-6">
                                                                            <span className="text-xs">{review.name.substring(0, 1).toUpperCase()}</span>
                                                                        </div>
                                                                    </div>
                                                                    <span className={"text-xs font-bold text-neutral-500 dark:text-white"}>{review.name}</span>
                                                                </div>
                                                                {
                                                                    user?.id === review.userId && !loadingDelete && (
                                                                        <button
                                                                            onClick={() => deleteReviewModal(review.id, review.userId)}>
                                                                            <FaTrash fill={"red"}/>
                                                                        </button>
                                                                    )
                                                                }
                                                                {
                                                                    user?.id === review.userId && loadingDelete && (
                                                                        <span
                                                                            className="loading loading-bars loading-xs"/>
                                                                    )
                                                                }
                                                            </div>
                                                            <ProductRating rating={review.rating}/>
                                                            <div className={"flex flex-col gap-1"}>
                                                                <p className={"text-sm font-bold dark:text-white"}>
                                                                    {review.title}
                                                                </p>
                                                                <div className={"text-xs text-gray-500 flex gap-1"}>
                                                                    <span>Reviewed on</span>
                                                                    {`${review.createdAt.substring(5, 10)}-${review.createdAt.substring(0, 4)}`}
                                                                </div>
                                                                <p className={"text-sm dark:text-white"}>
                                                                    {review.comment}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        )
                                    }
                                </div>
                            </RevealMotion>
                        )
                    }
                    </div>
                </div>
            </div>
            {
                !loading && product && (
                    <>
                        <ReviewModal
                            productId={id}
                            onPage={true}
                            setProduct={setProduct}
                            productImageUrl={product.images[0].url}
                        />
                        <ConfirmModal
                            title={"Are you sure you want to delete this review?"}
                            initiateFunction={submitDeleteProductReview}
                        />
                    </>
                )
            }
        </>
    );
};

export default ProductIdPage;