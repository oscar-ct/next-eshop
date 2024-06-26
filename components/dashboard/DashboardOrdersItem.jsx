import Link from "next/link";
import Image from "next/image";
import {convertCentsToUSD} from "@/utils/covertCentsToUSD";
import {useEffect, useRef, useState} from "react";
import {FaCheckCircle, FaDollarSign, FaMinusCircle, FaTruck} from "react-icons/fa";
import {
    FaBuildingColumns,
    FaHandHoldingDollar,
    FaHouseCircleCheck,
    FaSackXmark
} from "react-icons/fa6";
import paypal from "@/icons/paypal-logo.svg";
import stripe from "@/icons/stripe-logo.svg";

const DashboardOrdersItem = ({ order, setOrderData, successfullyUpdatedOrder, setSuccessfullyUpdatedOrder }) => {

    const ref = useRef(null);
    const [isDelivered, setIsDelivered] = useState(order.isDelivered.toString());
    const [isShipped, setIsShipped] = useState(order.isShipped.toString());
    const [isReimbursed, setIsReimbursed] = useState(order.isReimbursed.toString());
    const [reimbursedAmount, setReimbursedAmount] = useState(order.reimbursedAmount ? (order.reimbursedAmount / 100).toFixed(2) : order.reimbursedAmount);
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

    return (
        <details ref={ref} className={`collapse my-3 ${order.isPaid && !order.isCanceled ? "bg-green-200" : !order.isPaid ? "bg-orange-200" : order.isCanceled && "bg-red-200"}`}>
            <summary className="collapse-title pe-4">
                <div className={"flex justify-between"}>
                    <div className={"flex gap-4"}>
                        <div className={"flex flex-col md:flex-row gap-4 text-sm md:text-base"}>
                            <h3 className="text-gray-500">
                                <span className="font-semibold ml-1 badge badge-md">{order.createdAt.substring(5, 10) + "-" + order.createdAt.substring(2, 4)}</span>
                            </h3>
                            <h3 className="text-gray-500">
                                <span className="font-semibold ml-1 badge badge-md">{convertCentsToUSD(order.totalPrice)}</span>
                            </h3>
                        </div>
                        <div className={"flex flex-col md:flex-row gap-4 text-sm md:text-base"}>
                            <h3 className="text-gray-500">
                            <span className="font-semibold ml-1 badge badge-md">{order.user.name}</span>
                            </h3>
                            <h3 className="text-gray-500">
                                <Link href={`/orders/${order.id}`}
                                      className="link link-primary font-semibold ml-1 badge badge-md">{order.id.substring(order.id.length - 6, order.id.length)}</Link>
                            </h3>
                        </div>
                    </div>
                    <div className={"flex items-center gap-2"}>
                        {!order.isPaid && <div><FaSackXmark className={"w-4 h-4"}/></div>}
                        {order.isPaid && order.paymentMethod === "Stripe / Credit Card" && <div><Image src={stripe} alt={"stripe"} className={"w-9 h-6"}/></div>}
                        {order.isPaid && order.paymentMethod === "PayPal / Credit Card" && <div><Image src={paypal} alt={"paypal"} className={"w-6 h-6"}/></div>}
                        {order.isPaid && <div><FaDollarSign className={"w-5 h-5"}/></div>}
                        {order.isPaid && !order.isReimbursed && (order.isCanceled || canceledItemsThatRequireRefund.length > 0) && <div><FaHandHoldingDollar className={"w-5 h-5"}/></div>}
                        {(order.isReimbursed) && <div><FaBuildingColumns className={"w-4 h-4"}/></div>}
                        {order.isShipped && <div><FaTruck className={"w-5 h-5"}/></div>}
                        {order.isDelivered && <div><FaHouseCircleCheck className={"w-5 h-5"}/></div>}
                    </div>

                </div>

            </summary>
            <div className="collapse-content">
                <div className="w-full stats text-primary-content">
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
                        <div className="stat-actions flex flex-col md:flex-row gap-2">
                            <button
                                className="bg-base-200 text-black font-semibold px-3 py-2 text-sm rounded-lg leading-none h-14 flex flex-col md:flex-row items-center justify-between md:h-10 ">
                                <span className={"text-neutral-500"}>Shipped: </span>
                                <select
                                    name={"isShipped"}
                                    value={isShipped}
                                    onChange={(e) => {
                                        setIsShipped(e.target.value);
                                        !editActive && setEditActive(true);
                                    }}
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
                                className="bg-base-200 text-black font-semibold p-2 text-sm rounded-lg leading-none h-14 flex flex-col md:flex-row items-center justify-between md:h-10 ">
                                <span className={"text-neutral-500"}>Delivered: </span>
                                <select
                                    name={"isDelivered"}
                                    value={isDelivered}
                                    onChange={(e) => {
                                        setIsDelivered(e.target.value);
                                        !editActive && setEditActive(true);
                                    }}
                                    className="bg-transparent text-neutral-500 dark:text-neutral-300 focus:outline-none focus:shadow-primary">
                                    <option value={"true"}>
                                        yes
                                    </option>
                                    <option value={"false"}>
                                        no
                                    </option>
                                </select>
                            </button>
                            <button onClick={() => setTrackingInputVisible(prevState => !prevState)} className="btn btn-sm h-14 md:h-10 whitespace-normal dark:text-neutral-300">Edit Tracking</button>
                        </div>
                    </div>
                    <div className="stat">
                        <div className="stat-title">Refund amount
                            {
                                order.isPaid && !order.isReimbursed && (order.isCanceled || canceledItemsThatRequireRefund.length > 0) && (
                                    <span
                                        className="font-semibold pl-1 text-red-500 whitespace-normal">(requires refund)</span>
                                )
                            }
                        </div>

                        <div className={"stat-value dark:text-neutral-300"}>
                            $
                            <input
                                name={"reimbursedAmount"}
                                autoComplete={"off"}
                                disabled={!order?.isPaid}
                                placeholder={"0"}
                                type={"number"}
                                className={" w-36 xl:w-56"}
                                onChange={(e) => onChangeReimbursedAmount(e.target.value)}
                                value={reimbursedAmount}
                            />
                        </div>
                        {/*<div className="stat-value">$0</div>*/}
                        <div className="stat-actions flex flex-col md:flex-row gap-2">
                            <button
                                className="bg-base-200 text-black font-semibold p-2 text-sm rounded-lg leading-none h-14 flex flex-col md:flex-row items-center justify-between md:h-10 ">
                                <span className={"text-neutral-500"}>Reimbursed: </span>
                                <select
                                    name={"isReimbursed"}
                                    value={isReimbursed}
                                    onChange={(e) => {
                                        setIsReimbursed(e.target.value);
                                        !editActive && setEditActive(true);
                                    }}
                                    className="bg-transparent text-neutral-500 dark:text-neutral-300 focus:outline-none focus:shadow-primary">
                                    <option value={"true"}>
                                        yes
                                    </option>
                                    <option value={"false"}>
                                        no
                                    </option>
                                </select>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={`${editActive || trackingInputVisible ? "pt-2" : "pt-0"} flex items-end ${trackingInputVisible ? "justify-between" : "justify-end"}`}>
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
                                placeholder="Enter tracking number here"
                                className="input input-bordered input-sm w-full md:max-w-96"
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