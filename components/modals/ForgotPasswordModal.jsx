import {useEffect, useState} from 'react';
import Btn from "@/components/Btn";
import toast from "react-hot-toast";

const fetchAccountRecoveryLink = async (body) => {
    const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;
    try {
        if (!apiDomain) {
            return null;
        }
        const res = await fetch(`${apiDomain}/users/forgotpassword`, {
            method: "POST",
            body: JSON.stringify(body),
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

const ForgotPasswordModal = ({setFormData}) => {

    const [recoveryEmail, setRecoveryEmail] = useState("");
    const [loadingBtn, setLoadingBtn] = useState(false);
    const [emailIsValid, setEmailIsValid] = useState(false);

    useEffect(function () {
        const checkRecoveryEmail = () => {
            const reg = /\S+@\S+\.\S+/;
            if (reg.test(recoveryEmail)) {
                setEmailIsValid(true);
            } else {
                setEmailIsValid(false);
            }
        }
        checkRecoveryEmail();
    }, [recoveryEmail]);

    const submitResetPassword = async (e) => {
        e.preventDefault();
        setLoadingBtn(true);
        if (emailIsValid) {
            const status = await fetchAccountRecoveryLink({email: recoveryEmail});
            if (status) {
                window.password_modal.close();
                toast.success(status);
            }
            setRecoveryEmail("");
            setLoadingBtn(false);
            setFormData({
                email: "",
                password: "",
            })
        }
    };

    return (
        <dialog id="password_modal" className="modal modal-bottom sm:modal-middle">
            <form method="dialog" className="modal-box bg-white dark:bg-slate-800">
                <div className={"flex justify-between items-center"}>
                    <h3 className="p-3 font-bold text-xl dark:text-white">Forgot your password?</h3>
                </div>
                <div className="px-3">
                    <div className="form-control w-full">
                        <label htmlFor={"email2"}
                               className="pb-2 text-sm font-medium text-gray-600 tracking-wide dark:text-gray-300">
                            Send a reset password link to your email
                        </label>
                        <input id={"email2"} autoComplete={"email"} name="email" type="email"
                               placeholder="Enter your email"
                               className="bg-white w-full text-base px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-400 dark:bg-slate-800"
                               value={recoveryEmail} onChange={(e) => {
                            setRecoveryEmail(e.target.value);
                        }}/>
                    </div>
                    <div className="modal-action">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                window.password_modal.close();
                            }}
                            className={"btn btn-neutral rounded-full normal-case"}>Cancel
                        </button>
                        <Btn type={"submit"} isDisabled={!emailIsValid || loadingBtn}
                             onClick={submitResetPassword}
                             customClass={"text-sm w-28 flex justify-center items-center"}>
                            {
                                loadingBtn ?
                                    <span className="flex items-center loading loading-bars loading-sm"/> : `Send Link`
                            }
                        </Btn>
                    </div>
                </div>
            </form>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    );
};

export default ForgotPasswordModal;