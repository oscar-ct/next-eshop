import Link from "next/link";
import AccountOrders from "@/app/account/components/AccountOrders";
import {getServerSession} from "next-auth";

export const metadata = {
    title: "Shoposcar.com | My Orders",
};

const AccountOrdersPage = async () => {
    const session = await getServerSession();
    return (
        <div className={"flex flex-col"}>
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
                        className={`tab tab-active dark:text-white dark:!border-white`}>
                        Your Orders
                    </Link>
                </div>
            </div>
            <div className={"mx-auto"}>
                <div className={"px-2"}>
                    <AccountOrders session={session}/>
                </div>
            </div>
        </div>
    );
};

export default AccountOrdersPage;