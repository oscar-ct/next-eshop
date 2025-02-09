"use client";

import {useContext, useEffect, useState} from "react";
import GlobalContext from "@/context/GlobalContext";
import toast from "react-hot-toast";
import CustomBtn from "@/components/CustomBtn";
import {fetchUpdateUserCredentials} from "@/utils/api-requests/fetchRequests"


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


    const submitAccountHandler = async (e) => {
        e.preventDefault();
        const body = {
            id: user.id,
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

            <div
                className="bg-zinc-50 z-20 px-4 py-8 w-full rounded-2xl sm:w-96 sm:px-8 sm:bg-white sm:shadow-lg sm:border-none dark:bg-slate-800">
                <div className="mb-4 text-center sm:text-start">
                    <h3 className="font-bold text-2xl dark:text-white">
                        Account Details
                    </h3>
                    <p className="text-gray-500 dark:text-gray-300">
                        Edit your account details
                    </p>
                </div>
                <form onSubmit={submitAccountHandler} className="space-y-5">
                    <div className="space-y-2">
                        <label htmlFor={"name"} className="text-sm font-medium text-gray-700 tracking-wide dark:text-white">Username
                        </label>
                        <input
                            className="bg-white w-full text-base px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400"
                            autoComplete={"name"}
                            type={"name"}
                            id={"name"}
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value)
                            }}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor={"email"} className="text-sm font-medium text-gray-700 tracking-wide dark:text-white">Email
                        </label>
                        <input
                            className="bg-white w-full text-base px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400"
                            autoComplete={"email"}
                            type={"email"}
                            id={"email"}
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                            }}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor={"password"}
                               className="mb-5 text-sm font-medium text-gray-700 tracking-wide dark:text-white">
                            Confirm password to apply updates
                        </label>
                        <input
                            className="bg-white w-full content-center text-base px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400"
                            autoComplete={"current-password"}
                            type={"password"}
                            placeholder={"Current password"}
                            id={"password"}
                            onChange={(e) => {
                                setPassword(e.target.value)
                            }}
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

    );
};

export default AccountDetailsForm;