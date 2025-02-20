"use client";

import {motion} from "framer-motion";
import HomePageIntroCategories from "@/components/HomePageIntroCategories";
import HomePageSwiper from "@/components/HomePageSwiper";

const HomePageIntro = ({session}) => {

    // const openModal = () => {
    //     window.oscar_modal.showModal();
    // };

    return (
    <>
        {/*MOBILE*/}
        {/*|*/}
        {/*|*/}
        {/*V*/}

        {/*<motion.div*/}
        {/*    className={"lg:hidden bg-white dark:bg-black w-full h-[37em] relative"}*/}
        {/*    initial={{opacity: 0}}*/}
        {/*    animate={{opacity: 1}}*/}
        {/*    exit={{opacity: 0}}*/}
        {/*>*/}
        {/*    <div className={"z-10 absolute h-full w-full flex flex-col items-center justify-between"}>*/}
        {/*        <div className={"pt-20"}>*/}
        {/*            <div className={"flex px-3 md:px-10"}>*/}
        {/*                <div className={"w-2/3 flex flex-col"}>*/}
        {/*                    <h1 className={"font-bold text-3xl dark:text-white"}>Welcome to eshopjs.com</h1>*/}
        {/*                    <p className={"pt-16 dark:text-white"}>*/}
        {/*                        eshopjs.com is an online ecommerce store built and designed by <span onClick={openModal} className={"cursor-pointer text-violet-700"} >Oscar Castro</span>, a web*/}
        {/*                        developer based in San Antonio, TX.*/}
        {/*                    </p>*/}
        {/*                </div>*/}
        {/*                <div className={"w-1/3 flex justify-center"}>*/}
        {/*                    <Image*/}
        {/*                        priority*/}
        {/*                        className={"w-20 h-auto dark:invert"}*/}
        {/*                        src={logo}*/}
        {/*                        alt="e-shop-us.com"*/}
        {/*                    />*/}
        {/*                </div>*/}
        {/*            </div>*/}
        {/*        </div>*/}
        {/*        <div className={"pt-16 z-10"}>*/}
        {/*            <Link href={"/products/sort/latest/select/all/page/1"}>*/}
        {/*                <CustomBtn customClass={"!px-12 bg-zinc-700 text-lg"}>*/}
        {/*                    Shop Now*/}
        {/*                </CustomBtn>*/}
        {/*            </Link>*/}
        {/*        </div>*/}
        {/*        <h1 className={"pt-16 pb-8 font-bold text-3xl dark:text-white"}>What do we sell?</h1>*/}
        {/*    </div>*/}

        {/*    <Image*/}
        {/*        priority*/}
        {/*        className={"dark:rotate-180 absolute object-cover h-full w-full"}*/}
        {/*        width={500}*/}
        {/*        height={800}*/}
        {/*        src={"/images/bg.png"}*/}
        {/*        alt="colorful-art"*/}
        {/*    />*/}
        {/*</motion.div>*/}

        {/*<div className={"lg:hidden"}>*/}
        {/*    <HomePageIntroCategories/>*/}
        {/*</div>*/}

        {/*DESKTOP*/}
        {/*|*/}
        {/*|*/}
        {/*V*/}

        <div className={"bg-opacity-85 sm:mt-10 rounded-2xl bg-zinc-50 sm:bg-white sm:shadow-lg dark:bg-slate-800"}>
            <div className={"h-full relative lg:pb-10"}>
                {
                    session ? (
                        <h1 className={"py-14 font-extrabold text-center text-5xl sm:pt-24 2xl:text-6xl dark:text-white"}>
                            Welcome, {session.user.name.username}!
                        </h1>
                    ) : (
                        <h1 className={"py-14 font-extrabold text-center text-5xl sm:pt-24 2xl:text-6xl dark:text-white"}>
                            Welcome to eshopjs.com
                        </h1>
                    )
                }

                <div className={"w-full h-min"}>
                    <HomePageSwiper/>
                </div>
                {/*<motion.div*/}
                {/*    initial={{opacity: 0, x: -300}}*/}
                {/*    exit={{opacity: 0}}*/}
                {/*    animate={{opacity: 1, x: 0}}*/}
                {/*    transition={{delay: .0, duration: .1}}*/}
                {/*    className={"hidden h-36 w-full absolute justify-center top-[33%] lg:flex lg:top-[35%]"}*/}
                {/*>*/}
                {/*<Image*/}
                {/*    priority*/}
                {/*    src={divider}*/}
                {/*    alt={"divider"}*/}
                {/*    width={800}*/}
                {/*    height={110}*/}
                {/*    className={"w-full object-cover dark:invert"}*/}
                {/*/>*/}
                {/*</motion.div>*/}
                <h2 className={"py-10 text-center text-xl text-gray-600 font-semibold translate-y-5 lg:py-0 dark:text-white"}>
                    What do we sell?
                </h2>
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
    </>
    );
};

export default HomePageIntro