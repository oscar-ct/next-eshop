"use client";

import {useContext, useState} from "react";
import toast from "react-hot-toast";
import GlobalContext from "@/context/GlobalContext";
import CustomBtn from "@/components/CustomBtn";
import {fetchUpdateUserCredentials} from "@/utils/api-requests/fetchRequests";


const AccountPasswordForm = () => {

    const { user } = useContext(GlobalContext);

    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const clearPasswordFields = () => {
        setPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
    };

    const submitAccountHandler = async (e) => {
        e.preventDefault();
        const body = {
            id: user.id,
            newPassword,
            password,
        }
        if (newPassword !== confirmNewPassword) {
            toast.error("New passwords do not match");
        } else {
            const updatedUser = await fetchUpdateUserCredentials(body);
            if (updatedUser) {
                clearPasswordFields();
                toast.success("Password updated");
            }
        }
    };


    return (

            <div
                className="bg-zinc-50 z-20 px-4 py-8 w-full rounded-2xl sm:w-96 sm:px-8 sm:bg-white sm:shadow-lg sm:border-none dark:bg-slate-800">
                <div className="mb-4 text-center sm:text-start">
                    <h3 className="font-bold text-2xl dark:text-white">
                        Account Password
                    </h3>
                    <p className="text-gray-500 dark:text-gray-300">
                        Edit your account password
                    </p>
                </div>

                <form onSubmit={submitAccountHandler} className="space-y-5">
                    <div className="space-y-2">
                        <label htmlFor={"new-password"} className="text-sm font-medium text-gray-700 tracking-wide dark:text-white">
                            New password
                        </label>
                        <span className={"text-xs pl-1"}>(must be at least 6 characters)</span>
                        <input
                            className="bg-white w-full text-base px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400"
                            autoComplete={"off"}
                            placeholder={"New password"}
                            type={"password"}
                            id={"new-password"}
                            value={newPassword}
                            onChange={(e) => {setNewPassword(e.target.value)}}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor={"confirm-password"} className="mb-5 text-sm font-medium text-gray-700 tracking-wide dark:text-white">
                            Confirm new password
                        </label>

                        <input
                            className="bg-white w-full content-center text-base px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400"
                            autoComplete={"off"}
                            type={"password"}
                            placeholder={"Confirm new password"}
                            id={"confirm-password"}
                            onChange={(e) => {setConfirmNewPassword(e.target.value)}}
                            value={confirmNewPassword}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor={"current-password"} className="text-sm font-medium text-gray-700 tracking-wide dark:text-white">Current password
                        </label>
                        <input
                            className="bg-white w-full text-base px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400"
                            autoComplete={"off"}
                            placeholder={"Current password"}
                            type={"password"}
                            id={"current-password"}
                            value={password}
                            onChange={(e) => {setPassword(e.target.value)}}
                            required
                        />
                    </div>
                    <div className={"pt-5 flex justify-center"}>
                        <CustomBtn isDisabled={newPassword.length < 6 || confirmNewPassword.length < 6} type={"submit"} customClass={"btn-wide"}>
                            Update
                        </CustomBtn>
                    </div>
                </form>
            </div>

    );
};

export default AccountPasswordForm;