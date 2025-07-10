import Dashboard from "@/app/admin/components/Dashboard";
import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";

export const metadata = {
    title: "ShopOscar.com | My Dashboard",
};

const AdminOrdersPage = async () => {
    const session = await getServerSession();
    if (!session) {
        redirect("/login");
    } else if (!session.user.name.userIsAdmin) {
        redirect("/");
    }
    return <Dashboard/>;
};

export default AdminOrdersPage;