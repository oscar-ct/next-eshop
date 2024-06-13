import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";
export const fetchCache = 'force-no-store';

export const metadata = {
    title: "eshopjs | Dashboard: Products",
};

export default async function RootLayout({children}) {
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