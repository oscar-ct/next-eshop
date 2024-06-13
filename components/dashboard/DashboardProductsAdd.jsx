import {useState} from "react";
import * as filestack from "filestack-js";
import DashboardProductsCategorySelect from "@/components/dashboard/DashboardProductsCategorySelect";
import CustomBtn from "@/components/CustomBtn";
import toast from "react-hot-toast";
import {
    fetchAdminCreateProduct,
    fetchAdminDeleteProductImage, fetchAdminEncodeProductImg,
    fetchAdminUpdateProduct
} from "@/utils/api-requests/fetchRequests";
import {FaXmark} from "react-icons/fa6";
import Image from "next/image";
import ConfirmModal from "@/components/modals/ConfirmModal";

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
            toast.success("Successfully created new listing!")
            setProductCreated(true);
            setProductId(product._id);
            setProductImages(product.images);
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
        const updatedProduct = await fetchAdminUpdateProduct(productId, {image});
        if (updatedProduct) {
            setProductImages(updatedProduct.images);
        }
    };

    return (
        <>
        <div className={"bg-white h-full w-full px-5 lg:px-0"}>
            <h2 className={"pt-5 lg:pt-0 text-2xl font-bold flex items-center"}>
                Step 1.
                {
                    !productCreated ? (
                        <span className="pl-3 text-base text-gray-500 font-semibold">Create a new listing</span>
                    ) : (
                        <span className={"pl-3 text-green-500"}><svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg></span>
                    )
                }
            </h2>
            <form onSubmit={submitNewProduct} className={"w-full pb-5 pt-3 border-neutral-400 border-b-2"}>
                <div className={"flex flex-col lg:flex-row"}>
                    <div className={"w-full flex flex-col lg:w-7/12"}>
                        <div className={"space-y-2 pb-2"}>
                            <label htmlFor={"name"} className="text-sm font-medium text-gray-700 tracking-wide">
                                Title
                            </label>
                            <textarea
                                className={`w-full text-base px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400 ${productCreated ? "bg-gray-100 font-semibold text-gray-300" : "bg-gray-100/40 "}`}
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
                            <label htmlFor={"description"} className="text-sm font-medium text-gray-700 tracking-wide">
                                Description
                            </label>
                            <textarea
                                className={`w-full text-base px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400 ${productCreated ? "bg-gray-100 font-semibold text-gray-300" : "bg-gray-100/40 "}`}
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
                                    <label htmlFor={"brand"} className="text-sm font-medium text-gray-700 tracking-wide">
                                        Brand
                                    </label>
                                    <input
                                        className={`w-full text-base px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400 ${productCreated ? "bg-gray-100 font-semibold text-gray-300" : "bg-gray-100/40 "}`}
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
                                    <label htmlFor={"model"} className="text-sm font-medium text-gray-700 tracking-wide">
                                        Model Number
                                    </label>
                                    <input
                                        className={`w-full text-base px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400 ${productCreated ? "bg-gray-100 font-semibold text-gray-300" : "bg-gray-100/40 "}`}
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
                                    <label htmlFor={"category"} className="text-sm font-medium text-gray-700 tracking-wide">
                                        Category
                                    </label>
                                    <select
                                        className={`w-full text-base px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400 ${productCreated ? "bg-gray-100 font-semibold text-gray-300" : "bg-gray-100/40 "}`}
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
                                    <div className={"bg-white w-full space-y-2 pb-2"}>
                                        <label htmlFor={"countInStock"} className="text-sm font-medium text-gray-700 tracking-wide">
                                            Qty In Stock
                                        </label>
                                        <input
                                            className={`w-full text-base px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400 ${productCreated ? "bg-gray-100 font-semibold text-gray-300" : "bg-gray-100/40 "}`}
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
                                    <div className={"bg-white w-full pl-5 lg:pl-0 space-y-2 pb-2"}>
                                        <label htmlFor={"price"} className="text-sm font-medium text-gray-700 tracking-wide">List Price
                                        </label>
                                        <input
                                            className={`w-full text-base px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400 ${productCreated ? "bg-gray-100 font-semibold text-gray-300" : "bg-gray-100/40 "}`}
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
                                <div className={"bg-white w-full space-y-2 pb-2"}>
                                    <label htmlFor={"color"} className="text-sm font-medium text-gray-700 tracking-wide">Color
                                    </label>
                                    <input
                                        className={`w-full text-base px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400 ${productCreated ? "bg-gray-100 font-semibold text-gray-300" : "bg-gray-100/40 "}`}
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
                    <CustomBtn isDisabled={productCreated || !formIsComplete} type={"submit"} customClass={"w-full lg:w-48 self-end"}>
                        Create Listing
                    </CustomBtn>
                </div>
            </form>
            <h2 className={"py-5 text-2xl font-bold flex items-center"}>
                Step 2.
                {
                    !productCreated ? (
                        <div className={"pl-3 text-gray-500 text-base font-semibold"}>
                            Add images to your listing
                        </div>
                    ) : (
                        <div className={"pl-3 text-gray-500 text-base font-semibold"}>
                            Add more images ({productImages.length}/7)
                        </div>
                    )
                }
            </h2>
            <div className={"flex justify-center flex-wrap"}>
                {
                    productCreated && productImages.length !== 0 && productImages.map(function (img, index) {
                        return (
                            <div key={index} className={"p-3"}>
                                <div onClick={() => submitProductImageDelete(img._id, img.handle)} className="indicator">
                                    <span className="cursor-pointer indicator-item badge badge-error px-1 hover:bg-red-800"><FaXmark
                                        className={"w-3 text-white"}/></span>
                                    <Image
                                        src={img.url}
                                        alt={"product"}
                                        width={160}
                                        height={160}
                                        className={"w-40 h-40 object-cover rounded-md"}
                                    />
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <div className={"px-5 sm:px-0 py-5 w-full flex flex-col lg:flex-row lg:justify-between lg:items-end"}>
                <p className={"text-xs text-gray-500 font-normal pb-2 text-center"}>
                    Note: the first uploaded image will be the cover image
                </p>
                <CustomBtn isDisabled={!productCreated || productImages.length >= 7} onClick={openPicker} customClass={"w-full lg:w-48"}>
                    Add Image
                </CustomBtn>
            </div>
        </div>
            <ConfirmModal title={"Delete Image"} initiateFunction={submitProductImageDelete}>
                Are you sure you want to delete this image?
            </ConfirmModal>
        </>
    );
};

export default DashboardProductsAdd;