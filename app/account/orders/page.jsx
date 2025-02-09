import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";
import Link from "next/link";
import AccountOrders from "@/components/AccountOrders";

export const metadata = {
    title: "eshopjs | Orders",
};

const AccountOrdersPage = async () => {
    const session = await getServerSession();
    if (!session) redirect("/");

    return (
        <div className={"flex flex-col overflow-x-clip relative"}>
            <div className={"flex justify-center py-6 sm:py-10"}>
                <div role="tablist" className="tabs tabs-bordered">
                    <Link
                        role="tab"
                        href={"/account"}
                        className={`tab dark:text-white dark:border-white/50`}>
                        Account
                    </Link>
                    <Link
                        role="tab"
                        href={"/account/orders"}
                        className={`tab tab-active dark:text-white dark:border-white`}>
                        Your Orders
                    </Link>
                </div>
            </div>
            <div className={"mx-auto"}>
                <div className={"px-2"}>
                    <AccountOrders/>
                </div>
            </div>
            <div
                className={"z-0 scale-125 -rotate-6 m-auto absolute w-full top-72 h-72 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"}/>
        </div>
    );
};

export default AccountOrdersPage;