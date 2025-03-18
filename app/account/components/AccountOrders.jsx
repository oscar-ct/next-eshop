"use client";

import {useContext, useEffect, useState} from "react";
import GlobalContext from "@/context/GlobalContext";
import AccountOrdersItem from "@/app/account/components/AccountOrdersItem";
import ConfirmModal from "@/components/modals/ConfirmModal";
import toast from "react-hot-toast";
import Loading from "@/app/loading";
import {fetchCancelProduct, fetchUserOrders} from "@/utils/apiFetchRequests";


const AccountOrders = ({session}) => {

    const { cancelIntentData } = useContext(GlobalContext);
    const [orders, setOrders] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserOrdersData = async () => {
            try {
                const orders = await fetchUserOrders(session.user.image);
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
            const updatedOrder = await fetchCancelProduct(cancelIntentData.orderId, cancelIntentData.productId);
            if (updatedOrder) {
                const updatedOrders = orders.map((order) => {
                    return order.id === cancelIntentData.orderId ? updatedOrder : order;
                });
                setOrders(updatedOrders);
                return;
            }

        }
        toast.error("Please try again later");
    };


    if (!loading && orders) return (
        orders.length > 0 ? (
            <div className={"flex flex-col gap-4 sm:gap-8"}>
                {
                    orders.map(function (order, index) {
                        return (
                            <AccountOrdersItem key={index} order={order}/>
                        )
                    })
                }
                <ConfirmModal title={"Are you sure you want to cancel? This cannot be undone."} initiateFunction={() => submitCancel()}/>
            </div>
        ) : (
            <h1 className={"mt-5 text-3xl sm:text-2xl sm:font-bold text-center mx-auto dark:text-white"}>No Orders Found</h1>
        )
    );
    return <Loading/>
};

export default AccountOrders;