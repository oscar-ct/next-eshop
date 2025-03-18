import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";

export default async function ProductsLayout({children}) {
    const session = await getServerSession();
    if (!session) {
        redirect("/login");
    } else if (!session.user.name.userIsAdmin) {
        redirect("/");
    }

    return (
        <>{children}</>
    );
};
