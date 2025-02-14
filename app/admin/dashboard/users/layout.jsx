import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";

export const metadata = {
    title: "eshopjs | Dashboard: Users",
};

export default async function RootLayout({children}) {
    const session = await getServerSession();
    if (!session) {
        redirect("/login");
    } else if (!session.user.name.userIsAdmin) {
        redirect("/");
    }
    return (
        <div className={"relative z-10 bg-zinc-50 dark:bg-slate-800"}>
            {children}
        </div>
    );
};