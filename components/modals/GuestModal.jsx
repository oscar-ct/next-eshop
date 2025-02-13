"use client";

import CustomBtn from "@/components/CustomBtn";
import {useRouter} from "next/navigation";

const GuestModal = () => {
    const router = useRouter();
    return (
        <dialog id="checkout_modal" className="modal modal-bottom sm:modal-middle">
            <form method="dialog" className="modal-box dark:bg-slate-800">
                <div className="p-3">
                    <div className="form-control w-full">
                        <div className={"flex justify-between items-center"}>
                            <div className="pb-3 font text-lg dark:text-white">
                                You are currently not logged in, we<span
                                className={"px-1 font-bold"}>recommend</span>you login prior to placing any
                                orders. This will allow you to seamlessly view and manage all your orders.
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-action w-full flex justify-center">
                    <button
                        onClick={() => router.push("/shipping")}
                        className={"btn btn-neutral rounded-full normal-case"}
                    >
                        Continue As Guest
                    </button>
                    <CustomBtn onClick={() => router.push('/login?redirect=/shipping')} type={"submit"}
                               customClass={"text-sm font-semibold"}>
                        Login / Sign Up
                    </CustomBtn>
                </div>
            </form>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    );
};

export default GuestModal;