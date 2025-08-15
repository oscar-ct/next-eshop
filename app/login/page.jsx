"use client";

import {useRouter} from "next/navigation";
import {useContext, useState} from "react";
import GlobalContext from "@/context/GlobalContext";
import {signIn} from "next-auth/react";
import {fetchUser} from "@/utils/apiFetchRequests";
import toast from "react-hot-toast";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import Link from "next/link";
import ForgotPasswordModal from "@/components/modals/ForgotPasswordModal";

const LoginPage = () => {

    const router = useRouter();
    const { dispatch } = useContext(GlobalContext);

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const { email, password } = formData;

    const onCredentialChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }));
    };

    const submitLogin = async (e) => {
        e.preventDefault();
        const response = await signIn("credentials", {
            email: email,
            password: password,
            redirect: false,
        });
        if (!response?.error) {
            const user = await fetchUser(email);
            if (user) {
                dispatch({type: "ADD_USER", payload: user})
                dispatch({type: "SET_LOCAL_STORAGE"});
                router.push("/");
                router.refresh();
            }
        }
        if (!response.ok) {
            toast.error("Invalid Credentials");
        }
    };

    return (
        <>
            <div className="h-full flex flex-row justify-center px-2 pt-10 sm:px-0">
                <div className="w-full flex justify-center self-center">
                    <div className="bg-white opacity-95 z-20 px-4 py-8 w-full rounded-2xl sm:w-96 sm:px-8 dark:bg-slate-800">
                        <div className="mb-4 text-center sm:text-start">
                            <h3 className="font-bold text-2xl dark:text-white">Login
                            </h3>
                            <p className="text-gray-500 dark:text-gray-300">Please sign in to your account
                            </p>
                        </div>
                        <form onSubmit={submitLogin} className="space-y-5">
                            <div className="space-y-2">
                                <label htmlFor={"email"} className="text-sm font-medium text-gray-600 tracking-wide dark:text-white">Email
                                </label>
                                <input
                                    className="bg-white w-full text-base px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400 dark:text-white dark:bg-slate-800"
                                    autoComplete={"email"}
                                    type={"email"}
                                    placeholder={"mail@gmail.com"}
                                    id={"email"}
                                    value={email}
                                    onChange={onCredentialChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor={"password"} className="mb-5 text-sm font-medium text-gray-600 tracking-wide dark:text-white">
                                    Password
                                </label>

                                <input
                                    className="bg-white w-full content-center text-base px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400 dark:text-white dark:bg-slate-800"
                                    autoComplete={"off"}
                                    type={ showPassword ? "text" : "password"}
                                    placeholder={"Enter your password"}
                                    id={"password"}
                                    value={password}
                                    onChange={onCredentialChange}
                                    required
                                />
                                <div className={"flex justify-start flex-row-reverse"}>
                                    {
                                        showPassword ? (
                                            <FaEye
                                                onClick={() => setShowPassword(prevState => !prevState)}
                                                className={"show-password-img dark:text-white"}
                                            />
                                        ) : (
                                            <FaEyeSlash
                                                onClick={() => setShowPassword(prevState => !prevState)}
                                                className={"show-password-img dark:text-white"}
                                            />
                                        )
                                    }

                                    <div className="flex justify-end">
                                        <div className="text-sm">
                                            <button
                                                type={"button"}
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    window.password_modal.showModal()
                                                }
                                                }
                                                className="text-blue-400 hover:text-blue-500">
                                                Forgot your password?
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={"flex justify-center"}>
                                <button type="submit" className="rounded-full btn btn-neutral btn-wide normal-case ibmplex text-base">
                                    Login
                                </button>
                            </div>
                        </form>
                        <div className={"flex justify-center items-center text-sm dark:text-white"}>
                            <p className={"pt-6"}>
                                Don&apos;t have an account?
                            </p>
                            <Link href={"/register"} className="link text-blue-400 hover:text-blue-500 pt-6 pl-1">
                                Create new account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <ForgotPasswordModal setFormData={setFormData}/>
        </>
    )
};

export default LoginPage;