import Image from "next/image";
import CustomBtn from "@/components/CustomBtn";

const OscarModal = () => {
    return (
        <dialog id="oscar_modal" className="modal">
            <div className="modal-box">
                <div
                    className={"w-full h-[28em] flex flex-col items-center justify-evenly"}>
                    <div className={"pt-3 w-full flex flex-col justify-center items-center"}>
                        <div
                            className={"text-3xl font-bold text-center dark:text-white"}>
                            Oscar Castro
                        </div>
                        <div className={"text-sm text-gray-500 font-semibold"}>
                            Full Stack Web Developer
                        </div>
                    </div>
                    <div className="avatar">
                        <div className="w-48 mask mask-squircle">
                            <Image
                                alt={"headshot"}
                                src={"/images/codeup-final.webp"}
                                width={150}
                                height={150}
                            />
                        </div>
                    </div>
                    <div
                        className={"flex w-full flex-col items-center"}>
                        <a className={"link link-white hover:text-primary pb-5 dark:text-white"}
                           href={"mailto:oscar.a.castro818@gmail.com"}>oscar.a.castro818@gmail.com</a>
                        <a aria-label="portfolio" href={"https://oscar-ct.com/"}
                           target="_blank"
                           rel="noopener noreferrer">
                            <CustomBtn customClass={"bg-zinc-700"}>
                                Visit Portfolio
                            </CustomBtn>
                        </a>
                    </div>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    );
};

export default OscarModal;