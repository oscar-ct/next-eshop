import Link from "next/link";
import AccountDetailsForm from "@/app/account/components/AccountDetailsForm";
import AccountPasswordForm from "@/app/account/components/AccountPasswordForm";
import {getServerSession} from "next-auth";

export const metadata = {
    title: "ShopOscar.com | My Account",
};

const AccountPage = async () => {
    const session = await getServerSession();
    return (
        <div className={"flex flex-col"}>
            <div className={"z-10 flex justify-center py-6 sm:py-10"}>
                <div role="tablist" className="tabs tabs-bordered !text-white">
                    <Link
                        role="tab"
                        href={"/account"}
                        className={`tab tab-active dark:text-white dark:!border-white`}>
                        Account
                    </Link>
                    <Link
                        role="tab"
                        href={"/account/orders"}
                        className={`tab dark:text-white dark:border-white/50`}>
                        Your Orders
                    </Link>
                </div>
            </div>
            <div className={"mx-auto"}>
                <div className={"px-2 flex flex-col gap-4 sm:gap-8 lg:flex-row"}>
                    <AccountDetailsForm session={session}/>
                    <AccountPasswordForm session={session}/>
                </div>
            </div>
        </div>
    );
};

export default AccountPage;