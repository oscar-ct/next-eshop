"use client";

import {useContext, useEffect, useState} from "react";
import GlobalContext from "@/context/GlobalContext";
import toast from "react-hot-toast";
import Btn from "@/components/Btn";
import {fetchUpdateUserCredentials} from "@/utils/apiFetchRequests";
import {signOut, useSession} from "next-auth/react";
import {useRouter} from "next/navigation";


const AccountDetailsForm = ({session}) => {

    const { user, dispatch } = useContext(GlobalContext);
    const router = useRouter();

    const { update } = useSession();
    const [name, setName] = useState(session.user.name.username);
    const [email, setEmail] = useState(session.user.email);
    const [password, setPassword] = useState("");
    const [buttonIsDisabled, setButtonIsDisabled] = useState(true);

    useEffect(() => {
        if (name !== session.user.name.username || email !== session.user.email) {
            setButtonIsDisabled(false);
        } else {
            setButtonIsDisabled(true);
        }
    }, [name, email, session.user.name.username, session.user.email]);


    const submitAccountHandler = async (e) => {
        e.preventDefault();
        setButtonIsDisabled(true);
        const body = {
            id: session.user.image,
            name,
            email,
            password,
        }
        if (session.user.image !== user.id) {
            toast.error("Something went wrong");
            await signOut({ callbackUrl: '/' });
            dispatch({type: "RESET_STATE"});
            return;
        }
        const updatedUser = await fetchUpdateUserCredentials(body);
        if (updatedUser) {
            const hasUpdatedUsername = session.user.name.username !== name;
            const hasUpdatedEmail = session.user.name.username !== name;
            const newSessionObject = {
                ...session,
                user: {
                    ...session.user,
                    name: {
                        ...session.user.name,
                        username: hasUpdatedUsername ? name : session.user.name.username,
                    },
                    email: hasUpdatedEmail ? email : session.user.email,
                }
            }
            await update(newSessionObject);
            dispatch({type: "ADD_USER", payload: updatedUser});
            dispatch({type: "SET_LOCAL_STORAGE"});
            setPassword("");
            toast.success("Account updated");
            setButtonIsDisabled(false);
            router.refresh();
        }
    };


    return (
            <div
                className="bg-white opacity-95 z-20 px-4 py-8 w-full rounded-2xl sm:w-96 sm:px-8 dark:bg-slate-800">
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
                            className="bg-white w-full text-base px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400 dark:bg-slate-800 dark:text-white"
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
                            className="bg-white w-full text-base px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400 dark:bg-slate-800 dark:text-white"
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
                            className="bg-white w-full content-center text-base px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400 dark:bg-slate-800 dark:text-white"
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
                        <Btn isDisabled={buttonIsDisabled} type={"submit"} customClass={"btn-wide"}>
                            Update
                        </Btn>
                    </div>
                </form>
            </div>

    );
};

export default AccountDetailsForm;