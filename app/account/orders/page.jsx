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
        <div className={"pt-10 sm:pb-5 flex justify-center"}>
            <div className={"grow max-w-[72rem] flex flex-col"}>
                <div className={"pb-5 flex justify-center"}>
                    <div className="bg-zinc-100 tabs tabs-boxed">
                        <Link
                            href={"/account"}
                            className={`tab text-black`}>
                            Account
                        </Link>
                        <Link
                            href={"/account/orders"}
                            className={`tab tab-active !bg-zinc-700 !text-white}`}>
                            Your Orders
                        </Link>
                    </div>
                </div>

                <div className="mt-5">
                    <div className={"flex flex-col lg:flex-row"}>
                        <AccountOrders/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountOrdersPage;