"use client";

import {useContext, useEffect, useState} from "react";
import GlobalContext from "@/context/GlobalContext";
import AccountOrdersItem from "@/components/AccountOrdersItem";
import ConfirmModal from "@/components/modals/ConfirmModal";
import toast from "react-hot-toast";
import Loading from "@/app/loading";
import {fetchCancelOrder, fetchCancelProduct, fetchUserOrders} from "@/utils/api-requests/fetchRequests";


const AccountOrders = () => {

    const { user, cancelIntentData } = useContext(GlobalContext);
    const [orders, setOrders] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserOrdersData = async () => {
            try {
                const orders = await fetchUserOrders(user._id);
                setOrders(orders);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        }
        if (orders === null) fetchUserOrdersData();
    }, [orders]);


    const submitCancel = async () => {
        if (cancelIntentData) {
            if (cancelIntentData.orderItemsLength === 1 && !cancelIntentData.isCanceled) {
                const updatedOrder = await fetchCancelOrder(cancelIntentData.orderId);
                if (updatedOrder) {
                    const updatedOrders = orders.map((order) => {
                        return order._id === cancelIntentData.orderId ? updatedOrder : order;
                    });
                    setOrders(updatedOrders);
                    return;
                }
            } else {
                const updatedOrder = await fetchCancelProduct(cancelIntentData.orderId, cancelIntentData.productId);
                if (updatedOrder) {
                    const updatedOrders = orders.map((order) => {
                        return order._id === cancelIntentData.orderId ? updatedOrder : order;
                    });
                    setOrders(updatedOrders);
                    return;
                }
            }
        }
        toast.error("Please try again later");
    };


    if (!loading && orders) return (
        orders.length > 0 ? (
            <div className="mt-5 mx-auto">
                {
                    orders.map(function (order, index) {
                        return <AccountOrdersItem key={index} order={order} index={index} orderLength={orders.length}/>
                    })
                }
                <ConfirmModal title={"Are you sure you want to cancel this entire order? This cannot be undone."} initiateFunction={() => submitCancel()}/>
            </div>
        ) : (
            <h1 className={"mt-5 text-2xl font-bold text-center mx-auto"}>No Orders Found</h1>
        )
    );
    return <Loading/>
};

export default AccountOrders;