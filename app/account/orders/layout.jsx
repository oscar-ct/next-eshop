import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";

export default async function RootLayout({children}) {
    const session = await getServerSession();
    if (!session) {
        redirect("/login");
    }
    return (
        <>{children}</>
    );
};
