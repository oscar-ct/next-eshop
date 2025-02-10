"use client";

import {FaEye, FaEyeSlash} from "react-icons/fa";
import {useEffect, useState} from "react";
import {toast} from "react-hot-toast";
import {useParams, useRouter} from "next/navigation";
import Loading from "@/app/loading";
import NotFound from "@/app/not-found";
import Link from "next/link";

const fetchValidToken = async (id, token) => {
    const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;
    try {
        if (!apiDomain) {
            return null;
        }
        const res = await fetch(`${apiDomain}/users/forgotpassword/auth/${id}/${token}`);
        if (!res.ok) {
            const message = await res.text();
            toast.error(message);
            return null;
        }
        return res;
    } catch (e) {
        console.log(e);
        return null;
    }
};

const fetchResetPassword = async (id, token, body) => {
    const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;
    try {
        if (!apiDomain) {
            return null;
        }
        const res = await fetch(`${apiDomain}/users/forgotpassword/auth/${id}/${token}/reset`, {
            method: "POST",
            body: JSON.stringify(body)
        });
        if (!res.ok) {
            const message = await res.text();
            toast.error(message);
            return null;
        }
        return res.text();
    } catch (e) {
        console.log(e);
        return null;
    }
};

const ForgotPasswordPage = () => {

    const params = useParams();
    const { id, token} = params;
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [validJwt, setValidJwt] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });
    const {password, confirmPassword } = formData;

    const onCredentialChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }));
    };

    const submitResetPassword = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
        } else if (password.trim().length < 6 || confirmPassword.trim().length < 6) {
            toast.error("Password is too short.  Password must be at least 6 characters");
        } else {
            const res = await fetchResetPassword(id, token, {newPassword: password})
            if (res) {
                toast.success(res);
            }
            setFormData({
                password: "",
                confirmPassword: "",
            });
            setTimeout(function () {
                router.push("/login");
                router.refresh();
            }, 1800);
        }
    };

    useEffect(() => {
        const fetchValidTokenData = async () => {
            const res = await fetchValidToken(id, token);
            if (res?.ok) {
                setValidJwt(true);
            }
            setLoading(false);
        }
        if (!validJwt) fetchValidTokenData();
    }, [validJwt]);


    if (!loading && validJwt) {
        return (

            <>
                <div className="h-full flex flex-row justify-center px-2 sm:py-10 sm:px-0">
                    <div className="w-full flex justify-center self-center">
                        <div className="bg-zinc-50 z-20 px-4 py-8 w-full rounded-2xl sm:w-96 sm:px-8 sm:bg-white sm:shadow-lg sm:border-none dark:bg-slate-800">
                            <div className="mb-4 text-center sm:text-start">
                                <h3 className="font-bold text-2xl dark:text-white">Reset your password
                                </h3>
                                <p className="text-gray-500 text-sm dark:text-gray-300">Password must be at least 6 characters
                                </p>
                            </div>
                            <form onSubmit={submitResetPassword} className="space-y-5">
                                <div className="space-y-2">
                                    <label htmlFor={"password"}
                                           className="text-sm font-medium text-gray-600 tracking-wide dark:text-white">New Password
                                    </label>
                                    <input
                                        className="bg-white w-full text-base px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400"
                                        autoComplete={"off"}
                                        type={showPassword ? "text" : "password"}
                                        placeholder={"New password"}
                                        id={"password"}
                                        value={password}
                                        onChange={onCredentialChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor={"confirmPassword"}
                                           className="mb-5 text-sm font-medium text-gray-600 tracking-wide dark:text-white">
                                        Confirm New Password
                                    </label>

                                    <input
                                        className="bg-white w-full content-center text-base px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400"
                                        autoComplete={"off"}
                                        type={showPassword ? "text" : "password"}
                                        placeholder={"Enter your password"}
                                        id={"confirmPassword"}
                                        value={confirmPassword}
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

                                    </div>
                                </div>

                                <div className={"flex justify-center"}>
                                    <button type="submit"
                                            className="rounded-full btn btn-neutral btn-wide normal-case text-base">
                                        Reset Password
                                    </button>
                                </div>
                            </form>
                            <div className={"flex justify-center items-center text-sm dark:text-white"}>
                                <p className={"pt-6"}>
                                    Remembered your password?
                                </p>
                                <Link href={"/login"} className="link text-blue-400 hover:text-blue-500 pt-6 pl-1">
                                   Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
    if (loading) return <Loading/>
    if (!loading && !validJwt) return <NotFound/>
};

export default ForgotPasswordPage;