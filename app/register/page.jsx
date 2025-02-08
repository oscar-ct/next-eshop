import RegisterForm from "@/app/register/form";
import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";

export const metadata = {
    title: "eshopjs | Register",
};

const RegisterPage = async () => {
    const session = await getServerSession();
    if (session) {
        redirect("/");
    }
    return (
        <div className={"overflow-x-clip relative"}>
            <RegisterForm/>
            <div className={"z-0 scale-125 -rotate-6 m-auto absolute w-full top-72 h-72 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"}/>
        </div>
    );
};

export default RegisterPage;