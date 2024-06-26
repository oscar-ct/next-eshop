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
        <div className={"pt-10 sm:pb-5 flex justify-center"}>
            <div className={"grow max-w-[72rem] flex flex-col"}>
                <div className={"pb-5 flex justify-center"}>
                    <div role="tablist" className="tabs tabs-bordered">
                        <Link
                            role="tab"
                            href={"/account"}
                            className={`tab tab-active`}>
                            Account
                        </Link>
                        <Link
                            role="tab"
                            href={"/account/orders"}
                            className={`tab`}>
                            Your Orders
                        </Link>
                    </div>
                </div>

                <div className="mt-5">
                    <div className={"flex flex-col lg:flex-row"}>
                        <AccountDetailsForm/>
                        <AccountPasswordForm/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountPage;