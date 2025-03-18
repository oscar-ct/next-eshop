import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";

export const metadata = {
    title: "eshopjs | Register",
};

export default async function RegisterLayout({children}) {
    const session = await getServerSession();
    if (session) {
        redirect("/");
    }

    return (
        <>{children}</>
    );
};