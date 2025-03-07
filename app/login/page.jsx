import LoginForm from "@/app/login/form";
import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";

export const metadata = {
    title: "eshopjs | Login",
};

const LoginPage = async () => {
    const session = await getServerSession();
    if (session) {
        redirect("/");
    }
    return (
        <><LoginForm/></>
    );
};

export default LoginPage;