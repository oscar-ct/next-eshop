"use client";

import {useContext, useState} from "react";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import Link from "next/link";
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import GlobalContext from "@/context/GlobalContext";
import {fetchUser} from "@/utils/api-requests/fetchRequests";


const LoginForm = () => {

    // const [passwordRecoveryEmail, setPasswordRecoveryEmail] = useState("");
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
            <div className="h-max relative">
                <div className="h-full flex flex-row justify-center">
                    <div className="sm:mt-10 md:mb-10 w-full flex justify-center self-center">
                        <div className="bg-white border p-12 mx-auto sm:w-96 w-full">
                            <div className="mb-4">
                                <h3 className="font-bold text-2xl">Login
                                </h3>
                                <p className="text-gray-500">Please sign in to your account
                                </p>
                            </div>
                            <form onSubmit={submitLogin} className="space-y-5">
                                <div className="space-y-2">
                                    <label htmlFor={"email"} className="text-sm font-medium text-gray-600 tracking-wide">Email
                                    </label>
                                    <input
                                        className="bg-white w-full text-base px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400"
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
                                    <label htmlFor={"password"} className="mb-5 text-sm font-medium text-gray-600 tracking-wide">
                                        Password
                                    </label>

                                    <input
                                        className="bg-white w-full content-center text-base px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400"
                                        autoComplete={"current-password"}
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
                                                    className={"show-password-img"}
                                                />
                                            ) : (
                                                <FaEyeSlash
                                                    onClick={() => setShowPassword(prevState => !prevState)}
                                                    className={"show-password-img"}
                                                />
                                            )
                                        }

                                        <div className="flex justify-end">
                                            <div className="text-sm">
                                                <button
                                                    type={"button"}
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        // window.password_modal.showModal()
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
                            <div className={"flex justify-center items-center text-sm"}>
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
            </div>
            {/*<dialog id="password_modal" className="modal modal-bottom sm:modal-middle">*/}
            {/*    <form method="dialog" className="modal-box bg-white">*/}
            {/*        <div className={"flex justify-between items-center"}>*/}
            {/*            <h3 className="p-3 font-bold text-xl">Reset Password</h3>*/}
            {/*        </div>*/}
            {/*        <div className="px-3">*/}
            {/*            <div className="form-control w-full">*/}
            {/*                <label className="pb-2 text-sm font-medium text-gray-600 tracking-wide">*/}
            {/*                    Send password reset link*/}
            {/*                </label>*/}
            {/*                <input type="email" placeholder="Enter your email" className="bg-white w-full text-base px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400" value={passwordRecoveryEmail} onChange={(e) => {*/}
            {/*                    setPasswordRecoveryEmail(e.target.value);*/}
            {/*                }}/>*/}
            {/*            </div>*/}
            {/*            <div className="modal-action">*/}
            {/*                <button*/}
            {/*                    onClick={(e) => {*/}
            {/*                        e.preventDefault();*/}
            {/*                        window.password_modal.close();*/}
            {/*                    }}*/}
            {/*                    className={"btn btn-neutral rounded-full normal-case"}>Cancel</button>*/}
            {/*                <CustomBtn type={"submit"} isDisabled={!isValidEmail} onClick={submitResetPassword} customClass={"text-sm"}>*/}
            {/*                    Send Link*/}
            {/*                </CustomBtn>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </form>*/}
            {/*    <form method="dialog" className="modal-backdrop">*/}
            {/*        <button>close</button>*/}
            {/*    </form>*/}
            {/*</dialog>*/}
        </>
    )

};

export default LoginForm;