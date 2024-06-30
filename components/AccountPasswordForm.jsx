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
        <div className="pt-10 sm:pt-12 lg:pt-4 mx-auto sm:w-96 w-full">
            <div className="py-2 sm:bg-zinc-700">
                <div className="hidden sm:block pl-3 text-2xl text-white font-semibold text-center">Update Password
                </div>
                <div className="sm:hidden text-3xl text-center">Update Password
                </div>
            </div>
            <div className={"md:shadow-lg bg-white sm:border"}>
                <div className={"p-10"}>
                    <form onSubmit={submitAccountHandler} className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor={"new-password"} className="text-sm font-medium text-gray-700 tracking-wide">
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
                            <label htmlFor={"confirm-password"} className="mb-5 text-sm font-medium text-gray-700 tracking-wide">
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
                            <label htmlFor={"current-password"} className="text-sm font-medium text-gray-700 tracking-wide">Current password
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
            </div>
        </div>
    );
};

export default AccountPasswordForm;