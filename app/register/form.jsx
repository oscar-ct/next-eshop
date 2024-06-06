"use client"

import {FaEye, FaEyeSlash} from "react-icons/fa";
import Link from "next/link";
import {useContext, useState} from "react";
import {signIn} from "next-auth/react";
import GlobalContext from "@/context/GlobalContext";
import {useRouter} from "next/navigation";
import {fetchRegister} from "@/utils/api-requests/fetchRequests";
import toast from "react-hot-toast";



const RegisterForm = () => {

    const { dispatch } = useContext(GlobalContext);
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const { email, password, name, confirmPassword } = formData;

    const onCredentialChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }));
    };

    const submitRegister = async (e) => {
        e.preventDefault();
        const emailRegex = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email");
        } else if (password !== confirmPassword) {
            toast.error("Passwords do not match");

        } else if (password.trim().length < 6 || confirmPassword.trim().length < 6) {
            toast.error("Password is too short.  Password must be at least 6 characters");
        } else {
            const body = {
                email: formData.email,
                password: formData.password,
                name: formData.name,
            }
            const newUser = await fetchRegister(body);
            if (newUser) {
                const response = await signIn("credentials", {
                    email: email,
                    password: password,
                    redirect: false,
                });
                if (response.ok) {
                    dispatch({type: "ADD_USER", payload: newUser});
                    dispatch({type: "SET_LOCAL_STORAGE"});
                    router.push("/");
                    router.refresh();
                }
            }
        }
    };


    return (
        <div className="h-max relative">
            <div className="h-full flex flex-row justify-center">
                <div className="sm:mt-10 md:mb-10 w-full flex justify-center self-center">
                    <div className="bg-white border p-12 mx-auto sm:w-96 w-full">
                        <div className="mb-4">
                            <h3 className="font-bold text-2xl">Create an account
                            </h3>
                            <p className="text-gray-500">It&apos;s quick and easy
                            </p>
                        </div>
                        <form onSubmit={submitRegister} className="space-y-3">
                            <div className="space-y-2">
                                <label htmlFor={"name"} className="text-sm font-medium text-gray-600 tracking-wide">Full Name
                                </label>
                                <input
                                    className="bg-white w-full text-base px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400"
                                    autoComplete={"name"}
                                    type={"name"}
                                    id={"name"}
                                    placeholder={"John Doe"}
                                    value={name}
                                    onChange={onCredentialChange}
                                    required
                                />
                            </div>
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
                                    autoComplete={"off"}
                                    type={showPassword ? "text" : "password"}
                                    placeholder={"Enter your password"}
                                    id={"password"}
                                    value={password}
                                    onChange={onCredentialChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor={"confirmPassword"} className="text-sm font-medium text-gray-600 tracking-wide">
                                    Confirm Password
                                </label>

                                <input
                                    className="bg-white w-full content-center text-base px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400"
                                    autoComplete={"off"}
                                    type={showPassword ? "text" : "password"}
                                    placeholder={"Confirm your password"}
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
                                        className="btn btn-neutral normal-case rounded-full btn-wide ibmplex text-base">
                                    Create Account
                                </button>
                            </div>
                        </form>
                        <div className={"flex justify-center text-sm"}>
                            <p className={"pt-6"}>
                                Already have an account?
                            </p>
                            <Link href={"/login"}
                                  className="link text-blue-400 hover:text-blue-500 pt-6 pl-1">
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;