import CustomBtn from "./CustomBtn";
import {motion} from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import logo from "../icons/e.svg";
import HomePageIntroCategories from "@/components/HomePageIntroCategories";
import { Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, EffectFade} from "swiper/modules";
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';
import divider from "@/icons/divider.svg";
import CreditCards from "@/components/CreditCards";
import paypal from "@/icons/paypal-logo.svg";
import stripe from "@/icons/stripe-logo.svg";


const HomePageIntro = ({ productsCategory, windowInnerWidth }) => {

    const openModal = () => {
        window.oscar_modal.showModal();
    };

    return (
    <div className={"md:pb-14 bg-white dark:bg-black md:bg-transparent"}>
        {/*MOBILE*/}
        <motion.div
            className={"lg:hidden w-full h-[37em] relative"}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
        >
            <div className={"z-10 absolute h-full w-full flex flex-col items-center justify-between"}>
                <div className={"pt-20"}>
                    <div className={"flex px-3 md:px-10"}>
                        <div className={"w-2/3 flex flex-col"}>
                            <span className={"font-bold text-3xl dark:text-white"}>Welcome to eshopjs.com</span>
                            <p className={"pt-16 dark:text-white"}>
                                eshopjs.com is an online ecommerce store built and designed by <span onClick={openModal} className={"cursor-pointer text-violet-700"} >Oscar Castro</span>, a software
                                developer based in San Antonio, TX.
                            </p>
                        </div>
                        <div className={"w-1/3 flex justify-center"}>
                            <Image
                                priority
                                className={"w-20 h-auto dark:invert"}
                                src={logo}
                                alt="e-shop-us.com"
                            />
                        </div>
                    </div>
                </div>
                <div className={"pt-16 z-10"}>
                    <Link href={"products/sort/latest/select/all/page/1"}>
                        <CustomBtn customClass={"!px-12 bg-zinc-700 text-lg"}>
                            Shop Now
                        </CustomBtn>
                    </Link>
                </div>
                <span className={"pt-16 pb-8 font-bold text-3xl dark:text-white"}>What do we sell?</span>
            </div>

            <Image
                priority
                className={"dark:rotate-180 absolute object-cover h-full w-full"}
                width={500}
                height={800}
                src={"/images/bg.png"}
                alt="colorful-art"
            />
        </motion.div>

        <div className={"lg:hidden"}>
            <HomePageIntroCategories
                productsCategory={productsCategory}
                windowInnerWidth={windowInnerWidth}
            />
        </div>

        <div className={"hidden lg:block w-full"}>
            <div className={"flex h-[48em] w-full relative"}>
                <div className={"w-full h-full flex flex-col items-center justify-between"}>
                    <div className={"flex h-[32em] w-full pt-10 px-3 xl:px-10 2xl:px-28"}>
                        <div className={"w-full h-full flex"}>
                            <div className={"w-full h-full bg-transparent"}>
                                <div className={"w-full h-full flex flex-col items-center justify-center relative"}>
                                    <div className={"h-28 font-extrabold text-5xl 2xl:text-6xl 2xl:h-32 text-center"}>
                                        Welcome to eshopjs.com
                                    </div>
                                    <div className={"w-full h-min"}>

                                    <Swiper
                                        slidesPerView={1}
                                        autoplay={{
                                            delay: 10500,
                                            disableOnInteraction: false
                                        }}
                                        modules={[EffectFade, Autoplay]}
                                        effect={"fade"}
                                        fadeEffect={{crossFade: true}}
                                    >
                                        <SwiperSlide>
                                            <div className={"px-3 w-full flex flex-col justify-center items-center text-xl text-gray-600 font-semibold"}>
                                                <p className={"h-[78px] 2xl:h-20 font-light"}> eshopjs.com
                                                    is an online ecommerce store built and designed by <span className={"font-extrabold text-violet-700 cursor-pointer"} onClick={openModal}>Oscar Castro</span>, a
                                                    software
                                                    developer based in San Antonio, TX.</p>
                                                <div className={"flex w-full justify-evenly items-center"}>
                                                    <p className={"py-5 text-3xl text-black font-bold flex flex-col"}>
                                                        Enjoy online shopping with free shipping!
                                                        <span className={"text-center text-gray-500 text-sm font-light"}>when you spend over $100</span>
                                                    </p>
                                                    <CreditCards/>
                                                </div>
                                            </div>
                                        </SwiperSlide>

                                        <SwiperSlide>
                                            <div
                                                className={"px-3 w-full flex flex-col justify-center items-center text-xl text-gray-600 font-light"}>
                                            <p className={"h-[78px] 2xl:h-20 font-light text-center"}>eshopjs has partnered with reputable internet financial service providers to handle credit card transactions, and we do not store credit card information on eshopjs servers.
                                                </p>
                                                <div className={"flex w-full justify-evenly items-center"}>
                                                    <div className={"flex"}>
                                                        <p className={"py-6 text-3xl text-black font-bold text-nowrap"}>Shop
                                                            securely with
                                                        </p>
                                                        <div
                                                            className={"w-full flex items-center justify-start"}>
                                                            <Image priority src={stripe} alt={"stripe"} width={80}
                                                                   height={40} className={"h-[40px] w-[80px]"}/>
                                                            <div className={"text-3xl font-bold text-black pl-1 pr-3"}>
                                                                &
                                                            </div>
                                                            <Image src={paypal} alt={"paypal"} height={40} width={40} className={"h-[40px] w-[40px]"}/>
                                                        </div>
                                                    </div>

                                                    <CreditCards/>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    </Swiper>
                                    </div>
                                    <motion.div
                                        initial={{opacity: 0, x: -300}}
                                        exit={{opacity: 0}}
                                        animate={{opacity: 1, x: 0}}
                                        transition={{delay: .0, duration: 1}}
                                        className={"w-full absolute flex justify-center"}
                                    >
                                        <Image priority src={divider} alt={"divider"} width={800} height={110}
                                               className={"w-min max-w-7xl"}/>
                                    </motion.div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={"z-10 w-full flex flex-col items-center justify-center"}>
                        <span className={"text-xl text-gray-600 font-semibold pb-2"}>What do we sell?</span>
                        <HomePageIntroCategories
                            productsCategory={productsCategory}
                            windowInnerWidth={windowInnerWidth}
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
        ;
};

export default HomePageIntro