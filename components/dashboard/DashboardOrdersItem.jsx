import Link from "next/link";
import Image from "next/image";
import {convertCentsToUSD} from "@/utils/covertCentsToUSD";
import {useEffect, useRef, useState} from "react";
import {FaCheckCircle, FaMinusCircle, FaStripe} from "react-icons/fa";
import {MdMoneyOff, MdOutlineLocalShipping} from "react-icons/md";
import {TbHomeCheck, TbInfoCircle} from "react-icons/tb";
import {PiPaypalLogoFill} from "react-icons/pi";
import {FcCancel} from "react-icons/fc";
import {RiRefund2Line} from "react-icons/ri";

const DashboardOrdersItem = ({ order, setOrderData, successfullyUpdatedOrder, setSuccessfullyUpdatedOrder }) => {

    const ref = useRef(null);
    const [isDelivered, setIsDelivered] = useState(order.isDelivered.toString());
    const [isShipped, setIsShipped] = useState(order.isShipped.toString());
    const [isReimbursed, setIsReimbursed] = useState(order.isReimbursed.toString());
    const [reimbursedAmount, setReimbursedAmount] = useState(order.reimbursedAmount ? (order.reimbursedAmount / 100).toFixed(2) : 0);
    const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber.toString());
    const [trackingInputVisible, setTrackingInputVisible] = useState(false);
    const [editActive, setEditActive] = useState(false);

    useEffect(() => {
        if (successfullyUpdatedOrder) {
            setTrackingInputVisible(false);
            setEditActive(false);
            setSuccessfullyUpdatedOrder(false);
        }
    }, [successfullyUpdatedOrder]);

    const canceledItemsThatRequireRefund = order?.orderItems.filter(function (item) {
        return item.isPaid & item.isCanceled;
    });

    const confirmChanges = () => {
        const b = {
            isShipped,
            isDelivered,
            isReimbursed,
            trackingNumber,
            reimbursedAmount,

        };
        const a = {
            isShipped: order.isShipped.toString(),
            isDelivered: order.isDelivered.toString(),
            isReimbursed: order.isReimbursed.toString(),
            trackingNumber: order.trackingNumber,
            reimbursedAmount: order.reimbursedAmount ? (order.reimbursedAmount / 100).toFixed(2) : order.reimbursedAmount,

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
        const updatedOrderData = confirmChanges();
        if (updatedOrderData) {
            setOrderData({
                ...updatedOrderData,
                message: convertToString(updatedOrderData),
                orderId: order.id,
            });
            window.confirm_modal.showModal();
        } else {
            setTrackingInputVisible(false);
            setEditActive(false);
            ref.current.open = false;
        }
    };

    const onCancel = () => {
        setIsDelivered(order.isDelivered.toString());
        setIsShipped(order.isShipped.toString());
        setTrackingNumber(order.trackingNumber.toString());
        setIsReimbursed(order.isReimbursed.toString());
        setReimbursedAmount(order.isReimbursed ? (order.reimbursedAmount/100).toFixed(2) : "0.00");
        setEditActive(false);
        setTrackingInputVisible(false);
        ref.current.open = false;
    };

    const onChangeReimbursedAmount = (value) => {
        setReimbursedAmount(value);
        !editActive && setEditActive(true);
    };

    const canceledItems = order?.orderItems.filter((item) => {
        return item.isCanceled;
    });

    const canceledItemsPercentage = () => {
        const whole = order.orderItems.length;
        const part = canceledItems.length;
        if (whole === part) return 100;
        return (part / whole) * 100
    };


    return (
        <details ref={ref} className={`collapse ${order.isPaid && !order.isReimbursed && (order.isCanceled || canceledItemsThatRequireRefund.length > 0) ? "bg-purple-400" : "bg-zinc-300"}`}>
            <summary className="collapse-title p-2">
                <div className={"h-full flex justify-between"}>
                    <div className={"flex gap-2 md:gap-4"}>
                        <div className={"flex flex-col gap-1 md:flex-row md:gap-4"}>
                            <div className="h-full flex items-center rounded-xl bg-white">
                                <div className="px-1 text-xs text-gray-700 font-semibold md:text-sm">
                                    {order.createdAt.substring(5, 10) + "-" + order.createdAt.substring(2, 4)}
                                </div>
                            </div>
                            <div className="h-full flex items-center rounded-xl bg-white">
                                <div className="px-1 text-xs text-gray-700 font-semibold md:text-sm sm:px-2">
                                    {convertCentsToUSD(order.totalPrice)}
                                </div>
                            </div>
                        </div>
                        <div className={"flex flex-col gap-1 md:flex-row md:gap-4"}>
                            <div className="h-full flex items-center rounded-xl bg-white">
                                <div className="px-1 text-xs text-gray-700 font-semibold md:text-sm sm:px-2">
                                    {order.user.name}
                                </div>
                            </div>
                            <div className="h-full flex items-center rounded-xl bg-white">
                                <Link
                                    href={`/orders/${order.id}`}
                                    className="px-1 text-xs font-semibold link link-primary md:text-sm sm:px-2"
                                >
                                    {order.id.substring(order.id.length - 6, order.id.length)}
                                </Link>
                            </div>
                        </div>
                        {
                            order.isPaid && order.paymentMethod === "PayPal / Credit Card" && (
                                <div className="h-full flex items-center rounded-xl bg-green-300">
                                    <div className="px-1 text-xs text-gray-700 font-semibold md:text-sm sm:px-2">
                                        <PiPaypalLogoFill fill={"blue"} size={24}/>
                                    </div>
                                </div>
                            )
                        }
                        {
                            order.isPaid && order.paymentMethod === "Stripe / Credit Card" && (
                                <div className="h-full flex items-center rounded-xl bg-green-300">
                                    <div className="px-1 text-xs text-gray-700 font-semibold md:text-sm sm:px-2">
                                        <FaStripe fill={"blue"} size={24}/>
                                    </div>
                                </div>
                            )
                        }
                        {
                            order.isShipped && (
                                <div className="h-full flex items-center rounded-xl bg-green-300">
                                    <div className="px-1 text-xs text-gray-700 font-semibold md:text-sm sm:px-2">
                                        <MdOutlineLocalShipping size={24}/>
                                    </div>
                                </div>
                            )
                        }
                        {
                            order.isDelivered && (
                                <div className="h-full flex items-center rounded-xl bg-green-300">
                                    <div className="px-1 text-xs text-gray-700 font-semibold md:text-sm sm:px-2">
                                        <TbHomeCheck size={24}/>
                                    </div>
                                </div>
                            )
                        }
                        {
                            !order.isPaid && (
                                <div className="h-full flex items-center rounded-xl bg-red-300">
                                    <div className="px-1 text-xs text-gray-700 font-semibold md:text-sm sm:px-2">
                                        <MdMoneyOff size={24}/>
                                    </div>
                                </div>
                            )
                        }
                        {
                            (order.isCanceled || canceledItems.length !== 0) && (
                                <div className="h-full flex items-center rounded-xl bg-white">
                                    <div className="px-1 text-xs text-red-700 flex items-center font-semibold md:text-sm sm:px-2">
                                        <FcCancel size={24}/>
                                        <span className={"text-xs"}>{canceledItemsPercentage()}%</span>
                                    </div>
                                </div>
                            )
                        }
                        {
                            order.isReimbursed && (
                                <div className="h-full flex items-center rounded-xl bg-purple-300">
                                    <div className="px-1 text-xs text-gray-700 font-semibold md:text-sm sm:px-2">
                                        <RiRefund2Line size={24}/>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </summary>
            <div className="collapse-content p-2">
                <div className="bg-zinc-50 w-full stats dark:bg-slate-700">
                    <div className="stat">
                        <div className={"flex flex-wrap gap-2"}>
                            {
                                order.orderItems.map((item, index) => {
                                    return (
                                        <Image
                                            key={index}
                                            src={item.imageUrl}
                                            alt={"product"}
                                            width={50}
                                            height={50}
                                            className={"w-12 h-12 object-scale-down"}
                                        />
                                    )
                                })
                            }
                        </div>
                        <div className="stat-actions flex flex-col gap-2 md:flex-row">
                            <div
                                className="text-black font-semibold p-1 text-sm rounded-lg leading-none flex flex-col justify-between gap-1">
                                <span className={"dark:text-white"}>Shipped: </span>
                                <select
                                    name={"isShipped"}
                                    value={isShipped}
                                    onChange={(e) => {
                                        setIsShipped(e.target.value);
                                        !editActive && setEditActive(true);
                                    }}
                                    className={`p-2 rounded-lg focus:outline-none focus:shadow-primary ${isShipped === "true" ? "bg-green-300 hover:bg-green-400" : "bg-red-300 hover:bg-red-400"}`}>
                                    <option value={"true"}>
                                        yes
                                    </option>
                                    <option value={"false"}>
                                        no
                                    </option>
                                </select>
                            </div>
                            <div
                                className="text-black font-semibold p-1 text-sm rounded-lg leading-none flex flex-col justify-between gap-1">
                                <span className={"dark:text-white"}>Delivered: </span>
                                <select
                                    name={"isDelivered"}
                                    value={isDelivered}
                                    onChange={(e) => {
                                        setIsDelivered(e.target.value);
                                        !editActive && setEditActive(true);
                                    }}
                                    className={`p-2 rounded-lg focus:outline-none focus:shadow-primary ${isDelivered === "true" ? "bg-green-300 hover:bg-green-400" : "bg-red-300 hover:bg-red-400"}`}>
                                    <option value={"true"}>
                                        yes
                                    </option>
                                    <option value={"false"}>
                                        no
                                    </option>
                                </select>
                            </div>
                            <div className={"flex items-end p-1"}>
                                <button
                                    onClick={() => setTrackingInputVisible(prevState => !prevState)}
                                    className={`px-2 py-1 rounded-lg ${trackingNumber.length !== 0 ? "bg-green-300 hover:bg-green-400" : "bg-red-300 hover:bg-red-400"}`}
                                >
                                    <MdOutlineLocalShipping size={28} fill={"black"}/>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="stat">
                        <div className="stat-title flex flex-col md:flex-row md:gap-2 dark:text-white">
                            Refund amount
                            {
                                order.isPaid && !order.isReimbursed && (order.isCanceled || canceledItemsThatRequireRefund.length > 0) && (
                                    <div
                                        className="text-sm font-semibold text-red-500 whitespace-normal flex items-center gap-0.5">
                                        <TbInfoCircle size={20}/> requires refund
                                    </div>
                                )
                            }
                        </div>
                        <div className={"stat-value text-primary-content"}>
                            $
                            <input
                                name={"reimbursedAmount"}
                                autoComplete={"off"}
                                disabled={!order?.isPaid}
                                placeholder={"0"}
                                type={"number"}
                                className={"bg-transparent w-full max-w-56"}
                                onChange={(e) => onChangeReimbursedAmount(e.target.value)}
                                value={reimbursedAmount}
                            />
                        </div>
                        <div className="flex justify-end items-end">
                            <div className="text-black font-semibold p-1 text-sm rounded-lg leading-none flex flex-col justify-between gap-1">
                                <span className={"dark:text-white"}>Reimbursed: </span>
                                <select
                                    name={"isReimbursed"}
                                    value={isReimbursed}
                                    onChange={(e) => {
                                        setIsReimbursed(e.target.value);
                                        !editActive && setEditActive(true);
                                    }}
                                    className={`p-2 rounded-lg focus:outline-none focus:shadow-primary ${isReimbursed === "true" ? "bg-green-300 hover:bg-green-400" : "bg-red-300 hover:bg-red-400"}`}>
                                    <option value={"true"}>
                                        yes
                                    </option>
                                    <option value={"false"}>
                                        no
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className={`${editActive || trackingInputVisible ? "pt-2" : "pt-0"} flex items-end ${trackingInputVisible ? "justify-between" : "justify-end"}`}>
                    {
                        trackingInputVisible && (
                            <input
                                name={"trackingNumber"}
                                autoComplete={"off"}
                                value={trackingNumber}
                                onChange={(e) => {
                                    setTrackingNumber(e.target.value);
                                    !editActive && setEditActive(true);
                                }}
                                type="text"
                                placeholder="Add tracking number"
                                className="input input-sm w-full placeholder:text-zinc-500 focus:outline-none md:max-w-96"
                            />

                        )
                    }
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

            export default DashboardOrdersItem;