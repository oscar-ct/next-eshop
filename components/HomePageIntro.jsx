import CustomBtn from "./CustomBtn";
import {motion} from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import logo from "../icons/e.svg";
import HomePageIntroCategories from "@/components/HomePageIntroCategories";
// import paypal from "@/icons/paypal-logo.svg";
// import stripe from "@/icons/stripe-logo.svg";


const HomePageIntro = ({ productsCategory, windowInnerWidth }) => {

    return (
        <div className={"lg:pb-14 bg-white dark:bg-black md:bg-transparent"}>
            {/*MOBILE*/}
            <motion.div
                className={"lg:hidden w-full h-full relative"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className={"z-10 absolute h-full w-full flex flex-col items-center justify-start ibmplex"}>
                    {/*<Logo fill={"currentColor"} className={"pt-20 w-[10em] text-black dark:text-white"}/>*/}
                    <div className={"pt-20"}>
                        <Image
                            priority
                            className={"w-[10em] h-[10em]"}
                            src={logo}
                            alt="e-shop-us.com"
                        />
                    </div>

                    <span className={"pt-20 text-3xl font-semibold text-black dark:text-white"}>Shop, Ship, & Enjoy.</span>
                    <div className={"pt-20 z-10"}>
                        <Link href={"products/sort/latest/select/all/page/1"}>
                            <CustomBtn customClass={"!px-12 bg-zinc-700 text-lg"}>
                                Shop Now
                            </CustomBtn>
                        </Link>
                    </div>
                </div>
                <img className={"fadeInEffect dark:rotate-180 object-cover h-[40em] w-full"} src={"/images/bg.png"} alt="colorful-art"/>
            </motion.div>


            {/*DESKTOP*/}
            <div className={"hidden lg:block w-full"}>
                <div className={"flex h-[55em] w-full ibmplex"}>
                    <div
                        style={{
                            backgroundImage: `url(/images/bg.png)`,
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                        }}
                        className={"h-full w-full bg-zinc-800"}
                    >
                        <div className={"backdrop-blur-sm w-full h-full flex flex-col items-center justify-between"}>
                            <div className={"flex h-[32em] w-full ibmplex"}>

                                <div className={"w-1/3 2xl:w-3/12 h-full"}></div>

                                <div className={"w-1/3 2xl:w-6/12 h-full"}>
                                    <div className={"w-full h-full flex flex-col items-center justify-center"}>
                                        <div className={"relative py-10 px-3 w-full flex flex-col justify-center items-center"}>
                                            <div className={"font-bold text-white/80 text-3xl text-center pt-16"}>
                                                Enjoy online shopping with <span className={"font-bold text-violet-600"}>FREE</span> shipping!
                                            </div>
                                            <div className={"text-xs text-zinc-500 font-light"}>
                                                when you spend over $100
                                            </div>
                                        </div>
                                        <Link className={"pt-6"} href={"/products/sort/latest/select/all/page/1"}>
                                            <CustomBtn customClass={""}>
                                                Shop Now
                                            </CustomBtn>
                                        </Link>
                                    </div>
                                </div>

                                <div className={"w-1/3 2xl:w-3/12 h-full"}></div>

                            </div>

                            <div className={"w-full flex flex-col items-center justify-center pb-8"}>
                                <span className={"text-2xl font-bold py-1 text-white/80"}>Popular Categories</span>
                                <HomePageIntroCategories
                                    productsCategory={productsCategory}
                                    windowInnerWidth={windowInnerWidth}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );


};

export default HomePageIntro