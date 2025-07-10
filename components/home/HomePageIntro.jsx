"use client";

import {motion} from "framer-motion";
import HomePageIntroCategories from "@/components/home/HomePageIntroCategories";
import HomePageSwiper from "@/components/home/HomePageSwiper";
import Image from "next/image";
import newLogo from "@/public/images/so.com-high-resolution-logo-grayscale-transparent.png";

const HomePageIntro = ({session}) => {
    return (
        <div className={"bg-opacity-85 sm:mt-10 rounded-2xl bg-zinc-50 sm:bg-white sm:shadow-lg dark:bg-slate-800"}>
            <div className={"h-full relative mx-auto lg:pb-10"}>
                {
                    session ? (
                        <h1 className={"pb-10 pt-8 font-extrabold text-center text-5xl sm:pb-12 sm:pt-20 dark:text-white"}>
                            Welcome, {session.user.name.username}!
                        </h1>
                    ) : (
                        <h1 className={"pb-10 pt-8 flex justify-center items-center gap-3 sm:pb-12 sm:pt-20 "}>
                            <Image
                                priority
                                width={375}
                                height={40}
                                className={"max-h-[40px] w-auto dark:invert"}
                                src={newLogo}
                                alt="shoposcar.com"
                            />
                        </h1>
                    )
                }
                <div className={"w-full h-min"}>
                    <HomePageSwiper/>
                </div>
                <div className={"text-xl py-10 text-center text-gray-600 font-semibold translate-y-5 lg:py-0 dark:text-white"}>
                    What do we sell?
                </div>
            </div>
            <div className={"pt-5 pb-12 w-full flex flex-col items-center justify-center relative lg:h-64 lg:py-0"}>
                <HomePageIntroCategories/>
                <motion.div
                    className={"z-0 absolute h-full w-full categoriesBg dark:invert"}
                    initial={{opacity: 0, x: -300}}
                    exit={{opacity: 0}}
                    animate={{opacity: 1, x: 0}}
                    transition={{delay: .0, duration: .1}}
                >
                </motion.div>
            </div>
        </div>
    );
};

export default HomePageIntro