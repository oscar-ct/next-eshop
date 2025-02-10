import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";
import Link from "next/link";
import AccountDetailsForm from "@/components/AccountDetailsForm";
import AccountPasswordForm from "@/components/AccountPasswordForm";

export const metadata = {
    title: "eshopjs | Account",
};

const AccountPage = async () => {
    const session = await getServerSession();
    if (!session) redirect("/");

    return (
        <div className={"flex flex-col"}>
            <div className={"flex justify-center py-6 sm:py-10"}>
                <div role="tablist" className="tabs tabs-bordered !text-white">
                    <Link
                        role="tab"
                        href={"/account"}
                        className={`tab tab-active dark:text-white dark:border-white`}>
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
                    <AccountDetailsForm/>
                    <AccountPasswordForm/>
                </div>
            </div>
        </div>
    );
};

export default AccountPage;