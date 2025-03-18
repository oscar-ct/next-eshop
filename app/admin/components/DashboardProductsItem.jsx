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
} from "@/utils/apiFetchRequests";
import toast from "react-hot-toast";
import {RiImageAddLine} from "react-icons/ri";


const DashboardProductsItem = ({ product, successfullyUpdatedOrder, setSuccessfullyUpdatedOrder, setProductData }) => {

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
        const updatedProperty = confirmChanges();
        if (updatedProperty) {
            setProductData({
                ...updatedProperty,
                productId: product.id,
                message: convertToString(updatedProperty),
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
        const updatedImages = await fetchAdminUpdateProduct(product.id, {image});
        if (updatedImages) {
            setImages(updatedImages);
            setSuccessfullyUpdatedOrder(true);
        }
    };

    const submitProductImageDelete = async (imageId, handle) => {
        const confirm = window.confirm("Are you sure you want to delete this image?");
        if (!confirm) return;
        setLoading(true);
        const updatedImages = await fetchAdminDeleteProductImage(product.id, imageId);
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
        const res = await fetchAdminDeleteProduct(product.id);
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
        <details ref={ref} className={`collapse my-3 ${product.isDisabled ? "bg-zinc-500" : "bg-zinc-300"} ${loading ? "opacity-30" : ""}`}>
            <summary className="collapse-title p-2">
                <div className={"flex justify-start gap-4 items-between"}>
                    {
                        images.length !== 0 ? (
                            <div className={"w-2/12 flex justify-center items-center md:w-1/12"}>
                            <Image
                                src={images[0]?.url}
                                alt={"product"}
                                width={50}
                                height={50}
                                className={"w-16 h-16 object-scale-down rounded-md"}
                            />
                            </div>
                        ) : (
                            <div className="w-1/12 avatar placeholder">
                                <div className="bg-white text-neutral-content rounded-full w-14">
                                    <span className="text-xl text-black font-bold">?</span>
                                </div>
                            </div>
                        )
                    }
                    <div className={"w-10/12 flex flex-col gap-1 text-sm md:text-base md:flex-row md:gap-4 md:w-11/12"}>
                        <div className="w-20 h-full flex justify-center items-center rounded-xl bg-white md:w-[12%]">
                            <div className="px-1 text-xs text-gray-700 font-semibold md:text-sm">
                                {product.createdAt.substring(5, 10) + "-" + product.createdAt.substring(2, 4)}
                            </div>
                        </div>
                        <div className="px-1 w-full h-full flex items-center rounded-xl bg-white md:px-6 md:w-[84%]">
                            <Link
                                href={`/products/${product.id}`}
                                className="text-xs font-semibold link link-primary md:text-sm text-wrap"
                            >
                                {product.name}
                            </Link>
                        </div>
                    </div>

                </div>
            </summary>
            <div className="collapse-content p-2">
                <div className="bg-zinc-50 w-full stats dark:bg-slate-700">
                    <div className="stat">
                        <div className={"flex flex-wrap gap-2"}>
                            {
                                images.length !== 0 ? images.map((item, index) => {
                                    return (
                                        <div className="indicator" key={index}>
                                            <span onClick={() => submitProductImageDelete(item.id, item.handle)}
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
                                    <div className={"text-neutral-700 font-bold dark:text-white"}>No Images Found</div>
                                )
                            }
                        </div>
                        <div className="stat-actions flex flex-col gap-1">
                            <div className={"w-full flex flex-col justify-evenly md:flex-row"}>
                                <div className={"w-full flex flex-col md:pr-2"}>
                                    <div className="stat-title font-semibold text-xs md:text-base dark:text-white">
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
                                        className={"px-2 py-1 rounded text-neutral-700 text-sm w-full dark:text-neutral-300 dark:bg-slate-500"}
                                        type={"number"}
                                    />
                                </div>
                                <div className={"w-full flex flex-col md:pl-2"}>
                                    <div className="stat-title font-semibold text-xs md:text-base dark:text-white">
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
                                        className={"px-2 py-1 rounded text-neutral-700 text-sm w-full dark:text-neutral-300 dark:bg-slate-500"}
                                        type={"number"}
                                    />
                                </div>
                            </div>
                            <div className={"w-full flex flex-col justify-evenly md:flex-row md:justify-start"}>
                                <div className={"w-full flex flex-col md:pr-2"}>
                                    <div className="stat-title font-semibold text-xs md:text-base dark:text-white">
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
                                        className={"px-2 py-1 rounded text-neutral-700 text-sm w-full dark:text-neutral-300 dark:bg-slate-500"}
                                        type={"text"}
                                    />
                                </div>
                                <div className={"w-full flex flex-col md:pl-2"}>
                                    <div className="stat-title font-semibold text-xs md:text-base dark:text-white">
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
                                        className={"px-2 py-1 rounded text-neutral-700 text-sm w-full dark:text-neutral-300 dark:bg-slate-500"}
                                        type={"text"}
                                    />
                                </div>
                            </div>
                            <div className={"w-full flex flex-col justify-evenly md:flex-row md:justify-start"}>
                                <div className={"w-full flex flex-col md:pr-2"}>
                                    <div className="stat-title font-semibold text-xs md:text-base dark:text-white">
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
                                        className={"px-2 py-1 rounded text-neutral-700 text-sm w-full dark:text-neutral-300 dark:bg-slate-500"}
                                        type={"text"}
                                    />
                                </div>
                                <div className={"w-full flex flex-col md:pl-2"}>
                                    <div className="stat-title font-semibold text-xs md:text-base dark:text-white">
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
                                        className={"px-2 py-1 rounded text-neutral-700 text-sm w-full dark:text-neutral-300 dark:bg-slate-500"}
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
                            <div className="stat-title font-semibold text-xs md:text-base dark:text-white">
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
                                className={"px-2 py-1 rounded text-neutral-700 text-sm w-full dark:text-neutral-300 dark:bg-slate-500"}
                                rows={6}
                            />
                        </div>
                        <div>
                            <div className="stat-title font-semibold text-xs md:text-base dark:text-white">
                                Title
                            </div>
                            <textarea
                                name={"name"}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    !editActive && setEditActive(true);
                                }}
                                value={name}
                                autoComplete={"off"}
                                className={"px-2 py-1 rounded text-neutral-700 text-sm w-full dark:text-neutral-300 dark:bg-slate-500"}
                                rows={6}
                            />

                        </div>
                        <div className={"flex justify-between gap-2"}>
                            <div className="text-black font-semibold text-sm rounded-lg leading-none flex flex-col items-end gap-2 md:flex-row">
                                <div className={"h-full flex items-end dark:text-white md:items-center"}>
                                    Disabled:
                                </div>
                                <select
                                    name={"isDisabled"}
                                    onChange={(e) => {
                                        setIsDisabled(e.target.value);
                                        !editActive && setEditActive(true);
                                    }}
                                    value={isDisabled}
                                    className={`p-2 rounded-lg focus:outline-none focus:shadow-primary bg-zinc-200 hover:bg-zinc-300`}
                                >
                                    <option value={"true"}>
                                        yes
                                    </option>
                                    <option value={"false"}>
                                        no
                                    </option>
                                </select>
                            </div>
                            <div className={"flex items-end"}>
                                <button
                                    onClick={openPicker}
                                    className={`py-1 px-2 rounded-lg bg-zinc-200 hover:bg-zinc-300`}
                                >
                                    <RiImageAddLine size={28} fill={"black"}/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`${editActive ? "pt-2" : "pt-0"} flex items-end justify-end`}>
                    {
                        editActive && (
                            <div className={"pl-5 flex gap-3"}>
                                <button
                                    onClick={onCancel}
                                    className={"flex font-semibold items-center text-sm"}
                                >
                                    Cancel
                                    <FaMinusCircle className={"ml-1 text-red-500"}/>
                                </button>
                                <button
                                    onClick={onSave}
                                    className={"flex font-semibold items-center text-sm"}
                                >
                                    Save
                                    <FaCheckCircle className={"ml-1 text-green-500"}/>
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