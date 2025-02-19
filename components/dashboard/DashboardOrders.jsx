import {useEffect, useState} from "react";
import {fetchAdminOrders, fetchAdminUpdateOrder} from "@/utils/api-requests/fetchRequests";
import DashboardOrdersItem from "@/components/dashboard/DashboardOrdersItem";
import {convertCentsToUSD} from "@/utils/covertCentsToUSD";
import ConfirmModal from "@/components/modals/ConfirmModal";
import toast from "react-hot-toast";
import DashboardLoading from "@/components/dashboard/DashboardLoading";
import {TiFilter} from "react-icons/ti";


const DashboardOrders = () => {

    const [orderData, setOrderData] = useState(null);
    const [orders, setOrders] = useState(null);
    const [filteredOrders, setFilteredOrders] = useState(null);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("Total");
    const [successfullyUpdatedOrder, setSuccessfullyUpdatedOrder] = useState(false);


    useEffect(() => {
        const fetchOrdersData = async () => {
            try {
                const orders = await fetchAdminOrders();
                setOrders(orders);
                setFilteredOrders(orders);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };
        if (orders === null) fetchOrdersData();
    }, [orders]);


    const submitOrderUpdate = async () => {
        const {orderId} = orderData;
        const body = {...orderData}
        delete body.message;
        delete body.orderId;
        const updatedOrder = await fetchAdminUpdateOrder(orderId, body);
        if (updatedOrder) {
            setSuccessfullyUpdatedOrder(true);
            const updatedOrders = filteredOrders.map((order) => {
                return order.id === updatedOrder.id ? updatedOrder : order
            });
            const updatedOrders2 = orders.map((order) => {
                return order.id === updatedOrder.id ? updatedOrder : order
            });
            setFilteredOrders(updatedOrders);
            setOrders(updatedOrders2);
            toast.success("Order updated!");
        }
    };

    const totalSalesCentAmount = orders?.reduce((acc, order) => {return order.paidAmount + acc}, 0);
    const totalReimbursedCentAmount = orders?.reduce((acc, order) => {return order.reimbursedAmount + acc}, 0);
    let pretaxTotalPendingReimbursementCentAmount = 0;
    //     if (orders) {
    //         for (let i = 0; i < orders?.length; i++) {
    //             for (let j = 0; j < orders[i].orderItems.length; j++) {
    //                 if (!orders[i].isReimbursed && !orders[i].isCanceled && orders[i].orderItems[j].isPaid && orders[i].orderItems[j].isCanceled) {
    //                     totalPendingReimbursementCentAmount += orders[i].orderItems[j].price
    //                 }
    //             }
    //         }
    //     }
    // totalPendingReimbursementCentAmount = totalPendingReimbursementCentAmount + Math.round(totalPendingReimbursementCentAmount * 0.0825)
    if (orders) {
        for (let order of orders) {
            for (let item of order.orderItems) {
                if (!order.isCanceled && !order.isReimbursed && item.isPaid && item.isCanceled) {
                    pretaxTotalPendingReimbursementCentAmount += (item.price * item.quantity);
                }
            }
        }
    }
    const totalPendingReimbursementCentAmount = pretaxTotalPendingReimbursementCentAmount + Math.round(pretaxTotalPendingReimbursementCentAmount * 0.0825);

    const totalOrdersPaid = orders?.reduce((acc, order) => {return (order.isPaid && !order.isCanceled) + acc}, 0);
    const totalOrdersUnpaid = orders?.reduce((acc, order) => {return !order.isPaid + acc}, 0);
    const totalOrdersCanceled = orders?.reduce((acc, order) => {return order.isCanceled + acc}, 0);

    const filterCanceledOrders = () => {
        const filtered = orders.filter((order) => {
            return order.isCanceled;
        });
        setTitle("Canceled");
        setFilteredOrders(filtered);
    };
    const filterPaidOrders = () => {
        const filtered = orders.filter((order) => {
            return order.isPaid && !order.isCanceled;
        });
        setTitle("Paid");
        setFilteredOrders(filtered);
    };
    const filtersUnpaidOrders = () => {
        const filtered = orders.filter((order) => {
            return !order.isPaid;
        });
        setTitle("Unpaid");
        setFilteredOrders(filtered);
    };
    const setAllOrders = () => {
        setFilteredOrders(orders);
        setTitle("Total");
    };

    if (loading && !orders) return <DashboardLoading/>;
    return (
        <>
            <section className={"flex flex-col gap-2 items-center"}>
                <div className={"w-full flex mx-auto lg:w-min"}>
                    <div className={"flex flex-col w-full items-center gap-2.5 pr-1.5 sm:pl-0 md:items-end lg:items-center lg:gap-1.5 lg:flex-row"}>
                        <div className={"w-full md:w-64 lg:w-44 flex justify-center"}>
                            <div className="w-full stats shadow-md dark:bg-slate-500">
                                <div className="stat">
                                    <div className="stat-title h-14 whitespace-normal dark:text-gray-300">
                                        Total Sales
                                    </div>
                                    <div className="stat-value text-2xl dark:text-white">
                                        {convertCentsToUSD(totalSalesCentAmount)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={"w-full md:w-64 lg:w-44 flex justify-center"}>
                            <div className="w-full stats shadow-md dark:bg-slate-500">
                                <div className="stat">
                                    <div className="stat-title h-14 whitespace-normal dark:text-gray-300">
                                        Total Reimbursed
                                    </div>
                                    <div className="stat-value text-red-500 text-2xl">
                                        -{convertCentsToUSD(totalReimbursedCentAmount)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={"flex flex-col w-full items-center gap-2.5 pl-1.5 sm:pl-0 md:items-start lg:items-center lg:gap-1.5 lg:flex-row"}>
                        <div className={"w-full md:w-64 lg:w-44 flex justify-center"}>
                            <div className="w-full stats shadow-md dark:bg-slate-500">
                                <div className="stat">
                                    <div className="stat-title h-14 whitespace-normal dark:text-gray-300">
                                        Est. Pending Reimbursement
                                    </div>
                                    <div className="stat-value text-red-500 text-2xl">
                                        -{convertCentsToUSD(totalPendingReimbursementCentAmount)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={"w-full md:w-64 lg:w-44 flex justify-center"}>
                            <div className="w-full stats shadow-md dark:bg-slate-500">
                                <div className="stat">
                                    <div className="stat-title h-14 whitespace-normal dark:text-gray-300">
                                        Total Commission
                                    </div>
                                    <div className="stat-value text-green-600 text-2xl">
                                        {convertCentsToUSD(totalSalesCentAmount - totalReimbursedCentAmount - totalPendingReimbursementCentAmount)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <section className={"w-full flex mx-auto lg:w-min"}>
                    <div className={"flex flex-col w-full items-center gap-2.5 pr-1.5 sm:pl-0 md:items-end lg:items-center lg:gap-1.5 lg:flex-row"}>
                        <div className={"w-full md:w-64 lg:w-44 flex justify-center"}>
                            <div onClick={setAllOrders} className={`cursor-pointer w-full stats shadow-md ${title === "Total" ? "bg-zinc-200 dark:bg-slate-700" : "dark:bg-slate-500"}`}>
                                <div className="stat">
                                    <div className="stat-title h-14 whitespace-normal dark:text-gray-300">
                                        Total Orders
                                        <TiFilter size={24}/>
                                    </div>
                                    <div className="stat-value text-2xl dark:text-white">
                                        {orders.length}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={"w-full md:w-64 lg:w-44 flex justify-center"}>
                            <div onClick={filterPaidOrders} className={`cursor-pointer w-full stats shadow-md ${title === "Paid" ? "bg-zinc-200 dark:bg-slate-700" : "dark:bg-slate-500"}`}>
                                <div className="stat">
                                    <div className="stat-title h-14 whitespace-normal dark:text-gray-300">
                                        Paid Orders
                                        <TiFilter size={24}/>
                                    </div>
                                    <div className="stat-value text-2xl dark:text-white">
                                        {totalOrdersPaid}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={"flex flex-col w-full items-center gap-2.5 pl-1.5 sm:pl-0 md:items-start lg:items-center lg:gap-1.5 lg:flex-row"}>
                        <div className={"w-full md:w-64 lg:w-44 flex justify-center"}>
                            <div onClick={filtersUnpaidOrders} className={`cursor-pointer w-full stats shadow-md ${title === "Unpaid" ? "bg-zinc-200 dark:bg-slate-700" : "dark:bg-slate-500"}`}>
                                <div className="stat">
                                    <div className="stat-title h-14 whitespace-normal dark:text-gray-300">
                                        Unpaid Orders
                                        <TiFilter size={24}/>
                                    </div>
                                    <div className="stat-value text-2xl dark:text-white">
                                        {totalOrdersUnpaid}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={"w-full md:w-64 lg:w-44 flex justify-center"}>
                            <div onClick={filterCanceledOrders} className={`cursor-pointer w-full stats shadow-md ${title === "Canceled" ? "bg-zinc-200 dark:bg-slate-700" : "dark:bg-slate-500"}`}>
                                <div className="stat">
                                    <div className="stat-title h-14 whitespace-normal dark:text-gray-300">
                                        Canceled Orders
                                        <TiFilter size={24}/>
                                    </div>
                                    <div className="stat-value text-2xl dark:text-white">
                                        {totalOrdersCanceled}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
            <section className={"flex flex-col gap-3"}>
                {
                    filteredOrders.map((order) => {
                        return <DashboardOrdersItem
                            successfullyUpdatedOrder={successfullyUpdatedOrder}
                            setSuccessfullyUpdatedOrder={setSuccessfullyUpdatedOrder}
                            setOrderData={setOrderData}
                            order={order}
                            key={order.id}
                        />
                    })
                }
            </section>
            <ConfirmModal title={"Confirm Changes"} initiateFunction={submitOrderUpdate}>
                <h3 className="font-semibold text-lg">Please confirm these are the changes you wish to make --</h3>
                {
                    orderData?.message !== "" && (
                        orderData?.message.split("&").map(function (sentence, index) {
                            return (
                                <p className={"pt-3"} key={index}>{sentence}</p>
                            )
                        })
                    )
                }
            </ConfirmModal>
        </>
    );
};


export default DashboardOrders;