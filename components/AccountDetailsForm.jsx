"use client";

import {useContext, useEffect, useState} from "react";
import GlobalContext from "@/context/GlobalContext";
import {signOut} from "next-auth/react";
import toast from "react-hot-toast";
import CustomBtn from "@/components/CustomBtn";


const fetchUpdateUserCredentials = async (body) => {
    const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;
    try {
        if (!apiDomain) {
            return null;
        }
        const res = await fetch(`${apiDomain}/auth/credentials`, {
            method: "PUT",
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            const message = await res.text();
            toast.error(message);
            return null;
        }
        return res.json();
    } catch (e) {
        // console.log(e);
        return null;
    }
};


const AccountDetailsForm = () => {

    const { user, dispatch } = useContext(GlobalContext);

    const [name, setName] = useState(user ? user.name : "");
    const [email, setEmail] = useState(user ? user.email : "");
    const [password, setPassword] = useState("");
    const [buttonIsDisabled, setButtonIsDisabled] = useState(true);

    useEffect(() => {
        if (name !== user?.name || email !== user?.email) {
            setButtonIsDisabled(false);
        } else {
            setButtonIsDisabled(true);
        }
    }, [name, email, user?.name, user?.email]);

    const logoutUser = async () => {
        await signOut();
        dispatch({type: "RESET_STATE"});
    };

    const submitAccountHandler = async (e) => {
        e.preventDefault();
        // dispatch(setLoading(true));
        const body = {
            _id: user._id,
            name,
            email,
            password,
        }
        const updatedUser = await fetchUpdateUserCredentials(body);
        if (updatedUser) {
            dispatch({type: "ADD_USER", payload: updatedUser});
            dispatch({type: "SET_LOCAL_STORAGE"});
            setPassword("");
            toast.success("Account updated");
        }
    };


    return (
        <div className="h-max sm:pt-4 mx-auto sm:w-96 w-full">
            <div className="py-2 sm:bg-zinc-700">
                <div className="hidden sm:block pl-3 text-xl text-white ibmplex text-center">User Information
                </div>
                <div className="sm:hidden text-3xl text-center">User Information
                </div>
            </div>
            <div className={"md:shadow-lg sm:border bg-white"}>
                <div className={"p-10"}>
                    <form onSubmit={submitAccountHandler} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 tracking-wide">Name
                            </label>
                            <input
                                className="bg-white w-full text-base px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400"
                                autoComplete={"name"}
                                type={"name"}
                                id={"name"}
                                value={name}
                                onChange={(e) => {setName(e.target.value)}}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 tracking-wide">Email
                            </label>
                            <input
                                className="bg-white w-full text-base px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400"
                                autoComplete={"email"}
                                type={"email"}
                                id={"email"}
                                value={email}
                                onChange={(e) => {setEmail(e.target.value)}}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="mb-5 text-sm font-medium text-gray-700 tracking-wide">
                                Enter your password to update name and/or email
                            </label>
                            <input
                                className="bg-white w-full content-center text-base px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400"
                                autoComplete={"current-password"}
                                type={"password"}
                                placeholder={"Current password"}
                                id={"password"}
                                onChange={(e) => {setPassword(e.target.value)}}
                                value={password}
                                required
                            />
                        </div>

                        <div className={"pt-5 flex justify-center"}>
                            <CustomBtn isDisabled={buttonIsDisabled} type={"submit"} customClass={"btn-wide"}>
                                Update
                            </CustomBtn>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AccountDetailsForm;