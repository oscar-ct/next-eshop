import {useState} from "react";
import * as filestack from "filestack-js";
import DashboardProductsCategorySelect from "@/components/dashboard/DashboardProductsCategorySelect";
import CustomBtn from "@/components/CustomBtn";
import {
    fetchAdminCreateProduct,
    fetchAdminDeleteProductImage, fetchAdminEncodeProductImg,
    fetchAdminUpdateProduct
} from "@/utils/api-requests/fetchRequests";
import {FaXmark} from "react-icons/fa6";
import Image from "next/image";
import ConfirmModal from "@/components/modals/ConfirmModal";
import Message from "@/components/Message";
import Link from "next/link";

const DashboardProductsAdd = () => {

    const initialState = {
        name: "",
        brand: "",
        model: "",
        description: "",
        countInStock: "0",
        price: "0",
        category: "",
        color: "",
    };
    const [productCreated, setProductCreated] = useState(false);
    const [productImages, setProductImages] = useState([]);
    const [productId, setProductId] = useState(null);
    const [formData, setFormData] = useState(initialState);

    const formIsComplete = formData.name !== "" && formData.brand !== "" && formData.model !== "" && formData.description !== "" && formData.category !== "" && formData.color !== "" && formData.countInStock !== "0" && formData.price !== "0";


    const submitProductImageDelete = async (imageId, handle) => {
        const confirm = window.confirm("Are you sure you want to delete this image?");
        if (!confirm) return;
        const updatedImages = await fetchAdminDeleteProductImage(productId, imageId);
        if (updatedImages) {
            setProductImages(updatedImages);
            const policyAndSignature = await fetchAdminEncodeProductImg({handle});
            if (policyAndSignature) {
                const {policy, signature} = policyAndSignature;
                const res = await fetch(`https://www.filestackapi.com/api/file/${handle}?key=${process.env.NEXT_PUBLIC_FILESTACK_TOKEN}&policy=${policy}&signature=${signature}`, {
                    method: "DELETE"
                });
            }
        }
    };

    const onMutate = (e) => {
        setFormData(prevState => {
            return {
                ...prevState,
                [e.target.id]: e.target.value,
            };
        });
    };
    const submitNewProduct = async (e) => {
        e.preventDefault();
        const body = {
            name: formData.name,
            brand: formData.brand,
            model: formData.model,
            description: formData.description,
            countInStock: formData.countInStock,
            price: formData.price,
            category: formData.category,
            color: formData.color,
        }
        const product = await fetchAdminCreateProduct(body);
        if (product) {
            setProductCreated(true);
            setProductId(product.id);
            // setProductImages(product.images);
        }
    };
    const filePickerOptions = {
        accept: 'image/*',
        maxSize: 1024 * 1024,
        maxFiles: 1,
        onUploadDone: async (res) => {
            await submitProductImage(res.filesUploaded[0]);
        },
    };
    const openPicker = async () => {
        const client = filestack.init(process.env.NEXT_PUBLIC_FILESTACK_TOKEN, filePickerOptions);
        await client.picker(filePickerOptions).open();
    };
    const submitProductImage = async (object) => {
        const {handle, url} = object;
        const image = {
            url,
            handle,
        };
        const updatedImages = await fetchAdminUpdateProduct(productId, {image});
        if (updatedImages) {
            setProductImages(updatedImages);
        }
    };

    return (
        <>
            <div className={"h-full w-full px-5 lg:px-0"}>
                <div className={"pt-5 h-12 lg:pt-0 flex items-center w-full"}>
                    <div className={"text-2xl font-bold w-4/12 sm:w-28 dark:text-white"}>Step 1.</div>
                    {
                        !productCreated ? (
                            <div className="w-8/12 sm:w-full text-start text-base text-gray-500 font-semibold dark:text-gray-300">Complete all the text fields</div>
                        ) : (
                            <Message variant={"success"} border={"h-12 w-8/12 sm:w-full"}>
                                <span className={"text-xs sm:text-sm"}>You successfully created a new product listing!</span>
                            </Message>
                        )
                    }
                </div>
                <form onSubmit={submitNewProduct} className={"w-full pb-5 pt-3 border-neutral-400 border-b-2"}>
                    <div className={"flex flex-col lg:flex-row"}>
                        <div className={"w-full flex flex-col lg:w-7/12"}>
                            <div className={"space-y-2 pb-2"}>
                                <label
                                    htmlFor={"name"}
                                    className="text-sm font-medium text-gray-700 tracking-wide dark:text-white"
                                >
                                    Title
                                </label>
                                <textarea
                                    className={`w-full text-base px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400 dark:text-zinc-300 ${productCreated ? "bg-zinc-50 dark:bg-slate-800" : "bg-zinc-200 dark:bg-slate-700"}`}
                                    autoComplete={"off"}
                                    placeholder={"e.g. Brand, model name, color, and size"}
                                    id={"name"}
                                    value={formData.name}
                                    onChange={onMutate}
                                    disabled={productCreated}
                                    required
                                />
                            </div>
                            <div className={"space-y-2 pb-2"}>
                                <label
                                    htmlFor={"description"}
                                    className="text-sm font-medium text-gray-700 tracking-wide dark:text-white"
                                >
                                    Description
                                </label>
                                <textarea
                                    className={`w-full text-base px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400 dark:text-zinc-300 ${productCreated ? "bg-zinc-50 dark:bg-slate-800" : "bg-zinc-200 dark:bg-slate-700"}`}
                                    autoComplete={"off"}
                                    placeholder={"Tell customers more details about the product"}
                                    id={"description"}
                                    value={formData.description}
                                    required
                                    rows={5}
                                    disabled={productCreated}
                                    onChange={onMutate}
                                />
                            </div>
                        </div>
                        <div className={"w-full flex flex-col lg:w-5/12 lg:pl-5"}>
                            <div className={"flex flex-col lg:flex-row"}>
                                <div className={"w-full flex flex-col lg:w-6/12 lg:px-2"}>
                                    <div className={"space-y-2 pb-2"}>
                                        <label
                                            htmlFor={"brand"}
                                            className="text-sm font-medium text-gray-700 tracking-wide dark:text-white"
                                        >
                                            Brand
                                        </label>
                                        <input
                                            className={`w-full text-base px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400 dark:text-zinc-300 ${productCreated ? "bg-zinc-50 dark:bg-slate-800" : "bg-zinc-200 dark:bg-slate-700"}`}
                                            autoComplete={"off"}
                                            type={"text"}
                                            placeholder={"e.g. Sony"}
                                            id={"brand"}
                                            value={formData.brand}
                                            onChange={onMutate}
                                            disabled={productCreated}
                                            required
                                        />
                                    </div>
                                    <div className={"space-y-2 pb-2"}>
                                        <label
                                            htmlFor={"model"}
                                            className="text-sm font-medium text-gray-700 tracking-wide dark:text-white"
                                        >
                                            Model Number
                                        </label>
                                        <input
                                            className={`w-full text-base px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400 dark:text-zinc-300 ${productCreated ? "bg-zinc-50 dark:bg-slate-800" : "bg-zinc-200 dark:bg-slate-700"}`}
                                            autoComplete={"off"}
                                            type={"text"}
                                            placeholder={"e.g. KDL-32BX330"}
                                            id={"model"}
                                            value={formData.model}
                                            onChange={onMutate}
                                            disabled={productCreated}
                                            required
                                        />
                                    </div>
                                    <div className={"space-y-2 pb-2"}>
                                        <label
                                            htmlFor={"category"}
                                            className="text-sm font-medium text-gray-700 tracking-wide dark:text-white"
                                        >
                                            Category
                                        </label>
                                        <select
                                            className={`w-full text-base pl-2 py-2 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400 dark:text-zinc-300 ${productCreated ? "bg-zinc-50 dark:bg-slate-800" : "bg-zinc-200 dark:bg-slate-700"}`}
                                            autoComplete={"off"}
                                            id={"category"}
                                            onChange={onMutate}
                                            disabled={productCreated}
                                            required
                                        >
                                            <DashboardProductsCategorySelect disabled={formData.category !== ""}/>
                                        </select>
                                    </div>
                                </div>
                                <div className={"w-full flex flex-col lg:w-6/12 lg:px-2"}>
                                    <div className={"w-full flex flex-row lg:flex-col"}>
                                        <div className={"w-full space-y-2 pb-2"}>
                                            <label
                                                htmlFor={"countInStock"}
                                                className="text-sm font-medium text-gray-700 tracking-wide dark:text-white"
                                            >
                                                Qty In Stock
                                            </label>
                                            <input
                                                className={`w-full text-base px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400 dark:text-zinc-300 ${productCreated ? "bg-zinc-50 dark:bg-slate-800" : "bg-zinc-200 dark:bg-slate-700"}`}
                                                autoComplete={"off"}
                                                type={"number"}
                                                id={"countInStock"}
                                                value={formData.countInStock}
                                                onChange={onMutate}
                                                disabled={productCreated}
                                                required
                                                min={0}
                                            />
                                        </div>
                                        <div className={"w-full pl-5 lg:pl-0 space-y-2 pb-2"}>
                                            <label
                                                htmlFor={"price"}
                                                className="text-sm font-medium text-gray-700 tracking-wide dark:text-white"
                                            >
                                                Price In Cents
                                            </label>
                                            <input
                                                className={`w-full text-base px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400 dark:text-zinc-300 ${productCreated ? "bg-zinc-50 dark:bg-slate-800" : "bg-zinc-200 dark:bg-slate-700"}`}
                                                autoComplete={"off"}
                                                type={"number"}
                                                id={"price"}
                                                value={formData.price}
                                                onChange={onMutate}
                                                disabled={productCreated}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className={"w-full space-y-2 pb-2"}>
                                        <label htmlFor={"color"}
                                               className="text-sm font-medium text-gray-700 tracking-wide dark:text-white">Color
                                        </label>
                                        <input
                                            className={`w-full text-base px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400 dark:text-zinc-300 ${productCreated ? "bg-zinc-50 dark:bg-slate-800" : "bg-zinc-200 dark:bg-slate-700"}`}
                                            autoComplete={"off"}
                                            type={"text"}
                                            placeholder={"e.g. Silver"}
                                            id={"color"}
                                            value={formData.color}
                                            onChange={onMutate}
                                            disabled={productCreated}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`px-5 sm:px-0 pt-3 w-full flex flex-col lg:flex-row lg:justify-end items-center`}>
                        <CustomBtn
                            isDisabled={productCreated || !formIsComplete}
                            type={"submit"}
                            customClass={"w-full lg:w-48 self-end"}
                        >
                            Create Listing
                        </CustomBtn>
                    </div>
                </form>
                <div className={"py-5 flex items-center"}>
                    <div className={"text-2xl font-bold w-4/12 sm:w-28 dark:text-white"}>
                        Step 2.
                    </div>
                    {
                        productImages.length === 0 ? (
                            <div className={"w-8/12 sm:w-full text-start text-base text-gray-500 font-semibold dark:text-gray-300"}>
                                Add images to your listing
                            </div>
                        ) : productImages.length > 0 && productImages.length <= 6 ? (
                            <div className={"w-8/12 sm:w-full text-start text-base text-gray-500 font-semibold dark:text-gray-300"}>
                                Add more images ({productImages.length}/7)
                            </div>
                        ) : productImages.length === 7 && (
                            <div className={"w-8/12 sm:w-full text-start text-base text-gray-500 font-semibold dark:text-gray-300"}>
                                <span className={"text-red-500 font-bold"}>You have reach the max limit of images</span>
                                ({productImages.length}/7)
                            </div>
                        )
                    }
                </div>
                <div className={"flex justify-center flex-wrap gap-4"}>
                    {
                        productCreated && productImages.length !== 0 && productImages.map(function (img, index) {
                            return (
                                <div key={index} className={"flex flex-col items-center"}>
                                    <div
                                        className={`border-2 rounded-lg ${index === 0 ? "border-green-400" : "border-gray-300"}`}>
                                        <div onClick={() => submitProductImageDelete(img.id, img.handle)}
                                             className="indicator">
                                        <span className="cursor-pointer indicator-item badge badge-error px-1 hover:bg-red-800">
                                            <FaXmark className={"w-3 text-white"}/>
                                        </span>
                                            <div className={"flex flex-col items-center"}>
                                                <Image
                                                    src={img.url}
                                                    alt={"product"}
                                                    width={160}
                                                    height={160}
                                                    className={"w-40 h-40 object-scale-down rounded-md"}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        index === 0 && (
                                            <span className={"text-sm font-semibold dark:text-white"}>Cover Image</span>
                                        )
                                    }
                                </div>
                            )
                        })
                    }
                </div>
                <div className={"px-5 sm:px-0 py-5 w-full flex flex-col lg:flex-row lg:justify-between lg:items-end"}>
                    <p className={"text-xs text-gray-500 font-normal py-2 text-center"}>
                        Note: the first uploaded image will be the cover image
                    </p>
                    <CustomBtn
                        isDisabled={!productCreated || productImages.length >= 7}
                        onClick={openPicker}
                        customClass={"w-full lg:w-48"}
                    >
                        Add Image
                    </CustomBtn>
                </div>
                {
                    productCreated && productImages.length !== 0 && (
                        <div className={"pt-10 text-center text-2xl"}>
                            <span className={"dark:text-white"}>Live link: </span>
                            <Link
                                className={"link link-primary"}
                                href={`/products/${productId}`}
                            >
                                https://eshopjs.com/products/{productId}
                            </Link>
                        </div>
                    )
                }
            </div>
            <ConfirmModal title={"Delete Image"} initiateFunction={submitProductImageDelete}>
                Are you sure you want to delete this image?
            </ConfirmModal>
        </>
    );
};

export default DashboardProductsAdd;