import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";

export const metadata = {
    title: "eshopjs | Login",
};

export default async function LoginLayout({children}) {
    const session = await getServerSession();
    if (session) {
        redirect("/");
    }

    return (
        <>{children}</>
    );
};