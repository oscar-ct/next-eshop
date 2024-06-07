import RegisterForm from "@/app/register/form";
import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";

export const metadata = {
    title: "e-shop | Register",
};

const RegisterPage = async () => {
    const session = await getServerSession();
    if (session) {
        redirect("/");
    }
    return (
        <RegisterForm/>
    );
};

export default RegisterPage;