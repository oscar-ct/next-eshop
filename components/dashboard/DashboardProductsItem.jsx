import {useEffect, useRef, useState} from "react";
import Link from "next/link";
import {FaCheckCircle, FaMinusCircle} from "react-icons/fa";
import Image from "next/image";
import {FaXmark} from "react-icons/fa6";
import * as filestack from "filestack-js";
import {
    fetchAdminDeleteProduct,
    fetchAdminDeleteProductImage,
    fetchAdminEncodeProductImg,
    fetchAdminUpdateProduct
} from "@/utils/api-requests/fetchRequests";
import toast from "react-hot-toast";


const DashboardProductsItem = ({ product, width, successfullyUpdatedOrder, setSuccessfullyUpdatedOrder, setProductData }) => {

    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState(product.images || []);
    const ref = useRef(null);
    const [editActive, setEditActive] = useState(false);
    const [name, setName] = useState(product.name.toString());
    const [model, setModel] = useState(product.model.toString());
    const [brand, setBrand] = useState(product.brand.toString());
    const [color, setColor] = useState(product.color.toString());
    const [price, setPrice] = useState(product.price.toString());
    const [countInStock, setCountInStock] = useState(product.countInStock.toString());
    const [category, setCategory] = useState(product.category.toString());
    const [description, setDescription] = useState(product.description.toString());
    const [isDisabled, setIsDisabled] = useState(product.isDisabled.toString());
    const [isDeleted, setIsDeleted] = useState(false);

    const confirmChanges = () => {
        const b = {
            name,
            model,
            brand,
            color,
            countInStock,
            category,
            description,
            isDisabled,
            price,
        };
        const a = {
            name: product.name.toString(),
            model: product.model.toString(),
            brand: product.brand.toString(),
            color: product.color.toString(),
            countInStock: product.countInStock.toString(),
            category: product.category.toString(),
            description: product.description.toString(),
            isDisabled: product.isDisabled.toString(),
            price: product.price.toString(),
        };
        return Object.entries(b).filter(([key, val]) => a[key] !== val && key in a).reduce((a, [key, v]) => ({
            ...a,
            [key]: v
        }), null);
    };

    const convertToString = () => {
        let message = "";
        const updates = confirmChanges();
        if (updates) {
            for (const key in updates) {
                message += `${key}: ${updates[key]}&`;
            }
        }
        return message;
    };

    const onSave = () => {
        const updated = confirmChanges();
        if (updated) {
            setProductData({
                productId: product._id,
                message: convertToString(updated),
                name,
                model,
                brand,
                color,
                countInStock,
                category,
                description,
                isDisabled,
                price
            });
            window.confirm_modal.showModal();
        } else {
            setEditActive(false);
            ref.current.open = false;
        }
    };

    const onCancel = () => {
        setName(product.name.toString());
        setModel(product.model.toString());
        setBrand(product.brand.toString());
        setColor(product.color.toString());
        setCountInStock(product.countInStock.toString());
        setCategory(product.category.toString());
        setDescription(product.description.toString());
        setIsDisabled(product.isDisabled.toString());
        setPrice(product.price.toString());
        setEditActive(false);
        ref.current.open = false;
    };

    useEffect(() => {
        if (successfullyUpdatedOrder) {
            setEditActive(false);
            setSuccessfullyUpdatedOrder(false);
        }
    }, [successfullyUpdatedOrder]);

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
        const updatedProduct = await fetchAdminUpdateProduct(product._id, {image});
        if (updatedProduct) {
            setImages(updatedProduct.images);
            setSuccessfullyUpdatedOrder(true);
        }
    };

    const submitProductImageDelete = async (imageId, handle) => {
        const confirm = window.confirm("Are you sure you want to delete this image?");
        if (!confirm) return;
        setLoading(true);
        const updatedImages = await fetchAdminDeleteProductImage(product._id, imageId);
        if (updatedImages) {
            setImages(updatedImages);
            setSuccessfullyUpdatedOrder(true);
            const policyAndSignature = await fetchAdminEncodeProductImg({handle});
            if (policyAndSignature) {
                const {policy, signature} = policyAndSignature;
                const res = await fetch(`https://www.filestackapi.com/api/file/${handle}?key=${process.env.NEXT_PUBLIC_FILESTACK_TOKEN}&policy=${policy}&signature=${signature}`, {
                    method: "DELETE"
                });
            }
        }
        setLoading(false);
    };

    const submitProductDelete = async () => {
        const confirm = window.confirm("Are you sure you want to delete this product?");
        if (!confirm) return;
        setLoading(true);
        const res = await fetchAdminDeleteProduct(product._id);
        if (res && product.images.length !== 0) {
            await Promise.all(product.images.map(async (img) => {
                const policyAndSignature = await fetchAdminEncodeProductImg({handle: img.handle});
                if (policyAndSignature) {
                    try {
                        const {policy, signature} = policyAndSignature;
                        await fetch(`https://www.filestackapi.com/api/file/${img.handle}?key=${process.env.NEXT_PUBLIC_FILESTACK_TOKEN}&policy=${policy}&signature=${signature}`, {
                            method: "DELETE"
                        });
                    } catch (e) {
                        console.log(e);
                        toast.error("A filestack error has occurred");
                    }
                }
            }));
        }
        if (res) setIsDeleted(true);
        setLoading(false);
    };

    if (!isDeleted) return (
        <details ref={ref} className={`collapse my-3 ${product.isDisabled ? "bg-neutral-400" : "bg-base-200"} ${loading ? "opacity-30" : ""}`}>
            <summary className="collapse-title pe-4">
                <div className={"flex justify-start items-center"}>
                    {
                        images.length !== 0 ? (
                            <Image
                                src={images[0]?.url}
                                alt={"product"}
                                width={50}
                                height={50}
                                className={"w-16 h-16 object-scale-down rounded-md"}
                            />
                        ) : (
                            <div className="avatar placeholder">
                                <div className="bg-white text-neutral-content rounded-full w-14">
                                    <span className="text-xl text-black font-bold">?</span>
                                </div>
                            </div>
                        )
                    }

                    <div className={"pl-2"}>
                        <div className={"flex flex-col gap-1 text-sm md:text-base"}>
                            <h3 className="text-gray-500">
                                <span
                                    className="font-semibold ml-1 badge badge-md">{product.createdAt.substring(5, 10) + "-" + product.createdAt.substring(2, 4)}</span>
                            </h3>
                            <h3 className="text-gray-500">
                                <Link href={`/products/${product._id}`}
                                      className="link link-primary font-semibold ml-1 badge badge-md">{product.name.substring(0, width < 500 ? 26 : width >= 500 && width < 640 ? 32 : width >= 640 && width < 768 ? 52 : width >= 768 && width < 1024 ? 72 : width >= 1024 && width < 1280 ? 72 : width >= 1280 && width < 1536 ? 96 : product.name.length)}...
                                </Link>
                            </h3>
                        </div>
                    </div>
                </div>
            </summary>
            <div className="collapse-content">
                <div className="w-full stats text-primary-content">
                    <div className="stat">
                        <div className={"flex flex-wrap gap-2"}>
                            {
                                images.length !== 0 ? images.map((item, index) => {
                                    return (
                                        <div className="indicator" key={index}>
                                            <span onClick={() => submitProductImageDelete(item._id, item.handle)}
                                                  className="cursor-pointer indicator-item badge badge-error px-1 hover:bg-red-800"><FaXmark
                                                className={"w-3 text-white"}/></span>
                                            <Image
                                                src={item?.url}
                                                alt={"product"}
                                                width={50}
                                                height={50}
                                                className={"w-16 h-16 lg:w-20 lg:h-20 object-scale-down rounded-md"}
                                            />
                                        </div>

                                    )
                                }) : (
                                    <span className={"text-neutral-700 font-bold"}>No Images...</span>
                                )
                            }
                        </div>
                        <div className="stat-actions flex flex-col gap-1">
                            <div className={"w-full flex flex-col justify-evenly md:flex-row md:justify-start"}>
                                <div className={"flex flex-col"}>
                                    <div className="stat-title font-semibold text-xs md:text-base">
                                        Price In Cents
                                    </div>
                                    <input
                                        name={"price"}
                                        onChange={(e) => {
                                            setPrice(e.target.value);
                                            !editActive && setEditActive(true);
                                        }}
                                        value={price}
                                        autoComplete={"off"}
                                        className={"text-neutral-700 text-sm w-full"}
                                        type={"number"}
                                    />
                                </div>
                                <div className={"flex flex-col"}>
                                    <div className="stat-title font-semibold text-xs md:text-base">
                                        Stock
                                    </div>
                                    <input
                                        name={"countInStock"}
                                        onChange={(e) => {
                                            setCountInStock(e.target.value)
                                            !editActive && setEditActive(true);
                                        }}

                                        value={countInStock}
                                        autoComplete={"off"}
                                        className={"text-neutral-700 text-sm w-full"}
                                        type={"number"}
                                    />
                                </div>
                            </div>
                            <div className={"w-full flex flex-col justify-evenly md:flex-row md:justify-start"}>
                                <div className={"flex flex-col"}>
                                    <div className="stat-title font-semibold text-xs md:text-base">
                                        Brand
                                    </div>
                                    <input
                                        name={"brand"}
                                        onChange={(e) => {
                                            setBrand(e.target.value);
                                            !editActive && setEditActive(true);
                                        }}
                                        value={brand}
                                        autoComplete={"off"}
                                        className={"text-neutral-700 text-sm w-full"}
                                        type={"text"}
                                    />
                                </div>
                                <div className={"flex flex-col"}>
                                    <div className="stat-title font-semibold text-xs md:text-base">
                                        Model
                                    </div>
                                    <input
                                        name={"model"}
                                        onChange={(e) => {
                                            setModel(e.target.value);
                                            !editActive && setEditActive(true);
                                        }}
                                        value={model}
                                        autoComplete={"off"}
                                        className={"text-neutral-700 text-sm w-full"}
                                        type={"text"}
                                    />
                                </div>
                            </div>
                            <div className={"w-full flex flex-col justify-evenly md:flex-row md:justify-start"}>
                                <div className={"flex flex-col"}>
                                    <div className="stat-title font-semibold text-xs md:text-base">
                                        Category
                                    </div>
                                    <input
                                        name={"category"}
                                        onChange={(e) => {
                                            setCategory(e.target.value);
                                            !editActive && setEditActive(true);
                                        }}
                                        value={category}
                                        autoComplete={"off"}
                                        className={"text-neutral-700 text-sm w-full"}
                                        type={"text"}
                                    />
                                </div>
                                <div className={"flex flex-col"}>
                                    <div className="stat-title font-semibold text-xs md:text-base">
                                        Color
                                    </div>
                                    <input
                                        name={"color"}
                                        onChange={(e) => {
                                            setColor(e.target.value);
                                            !editActive && setEditActive(true);
                                        }}
                                        value={color}
                                        autoComplete={"off"}
                                        className={"text-neutral-700 text-sm w-full"}
                                        type={"text"}
                                    />
                                </div>
                            </div>
                            {
                                product.isDisabled && (
                                    <div onClick={() => submitProductDelete()}
                                         className={"cursor-pointer w-full h-min flex items-end justify-end text-red-600"}>
                                        delete
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div className="stat">
                        <div className={"h-min"}>
                            <div className="stat-title font-semibold text-xs md:text-base h-5 md:h-7">
                                Description
                            </div>
                            <textarea
                                name={"description"}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                    !editActive && setEditActive(true);
                                }}
                                value={description}
                                autoComplete={"off"}
                                className={"text-neutral-700 text-sm w-full"}
                                rows={width < 768 ? 6 : 4}
                            />
                        </div>
                        <div>
                            <div className="stat-title font-semibold text-xs md:text-base">
                                Name
                            </div>
                            <textarea
                                name={"name"}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    !editActive && setEditActive(true);
                                }}
                                value={name}
                                autoComplete={"off"}
                                className={"text-neutral-700 text-sm w-full"}
                                rows={width < 768 ? 4 : 2}
                            />

                        </div>
                        <div className={"flex justify-between gap-2"}>
                            <button
                                className="w-full md:w-40 bg-base-200 font-semibold p-2 text-sm rounded-lg leading-none h-14 flex flex-col md:flex-row items-center justify-between md:h-10 ">
                                <span className={"text-neutral-500"}>Disabled: </span>
                                <select
                                    name={"isDisabled"}
                                    onChange={(e) => {
                                        setIsDisabled(e.target.value);
                                        !editActive && setEditActive(true);
                                    }}
                                    value={isDisabled}
                                    className="bg-transparent text-neutral-500 dark:text-neutral-300 focus:outline-none focus:shadow-primary">
                                    <option value={"true"}>
                                        yes
                                    </option>
                                    <option value={"false"}>
                                        no
                                    </option>
                                </select>
                            </button>
                            <button
                                onClick={openPicker}
                                className="btn btn-sm h-14 md:h-10 whitespace-normal w-min md:w-40">
                                Add Image
                            </button>
                        </div>
                    </div>
                </div>
                <div className={`${editActive ? "pt-2" : "pt-0"} flex items-end justify-end`}>
                    {
                        editActive && (
                            <div className={"pl-5 flex gap-3"}>
                                <button onClick={onCancel} className={"flex font-semibold items-center text-sm"}>
                                    Cancel <FaMinusCircle className={"ml-1 text-red-500"}/>
                                </button>
                                <button onClick={onSave} className={"flex font-semibold items-center text-sm"}>
                                    Save <FaCheckCircle className={"ml-1 text-green-500"}/>
                                </button>
                            </div>
                        )
                    }
                </div>
            </div>
        </details>
    );
};

export default DashboardProductsItem;