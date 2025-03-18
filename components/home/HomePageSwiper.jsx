import {Autoplay, EffectFade} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/react";
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';
import CreditCards from "@/components/home/CreditCards";
import {SiAfterpay, SiCashapp} from "react-icons/si";

const HomePageSwiper = () => {

    const openModal = () => {
        window.oscar_modal.showModal();
    };

    return (
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
                <div className={"px-4 w-full flex flex-col justify-center items-center text-xl text-gray-600 gap-4 lg:px-8 lg:gap-0 dark:text-white"}>
                    <div className={"flex flex-col w-full h-52 sm:h-32 lg:h-24 relative rainbow"}>
                        <div className={"px-4 flex items-center bg-zinc-50 rounded-lg absolute top-0 left-0 right-0 bottom-0 m-auto h-[calc(100%-6px)] w-[calc(100%-6px)] focus:outline-none focus:ring-4 focus:ring-offset-1 dark:text-white dark:bg-slate-700"}>
                            <h3 className={"text-center"}>
                                eshopjs.com is an online e-commerce store built and designed from the ground up by <span
                                className={"font-bold text-violet-700 cursor-pointer"} onClick={openModal}>Oscar Castro</span>,
                                a Web
                                Developer based in San Antonio, Texas.
                            </h3>
                        </div>
                    </div>
                    <div className={"flex flex-col w-full justify-evenly items-center gap-2 lg:flex-row"}>
                        <p className={"text-center py-5 text-3xl text-black font-bold flex flex-col lg:text-start dark:text-white"}>
                            Enjoy online shopping with free shipping!
                            <span className={"text-center text-gray-500 text-sm font-light"}>when you spend over $100</span>
                        </p>
                        <CreditCards/>
                    </div>
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div className={"px-4 w-full flex flex-col justify-center items-center text-xl text-gray-600 gap-4 lg:gap-0 lg:px-8 dark:text-white"}>
                    <div className={"flex flex-col w-full h-48 sm:h-32 lg:h-24 relative rainbow"}>
                        <div
                            className={"px-4 flex items-center bg-zinc-50 rounded-lg absolute top-0 left-0 right-0 bottom-0 m-auto h-[calc(100%-6px)] w-[calc(100%-6px)] focus:outline-none focus:ring-4 focus:ring-offset-1 dark:text-white dark:bg-slate-700"}>
                            <h3 className={"mx-auto text-center"}>
                                eshopjs.com uses <span className={"font-semibold text-blue-600"}>Stripe</span> and <span
                                className={"font-bold text-blue-600"}>PayPal</span> to handle credit card transactions, and we
                                do not
                                store any credit card information.
                            </h3>
                        </div>
                    </div>
                    <div className={"flex flex-col w-full justify-evenly items-center gap-4 lg:flex-row"}>
                        <div className={"font-bold py-5 text-black text-3xl flex flex-col gap-2 sm:flex-row lg:text-start dark:text-white"}>
                            <div className={"flex flex-col items-center gap-1 lg:flex-row lg:gap-2"}>
                                <div className={"flex gap-2"}>
                                    <div className={"flex items-center gap-2"}>
                                        Cash App Pay
                                        <SiCashapp fill={"#58DA14"}/>
                                    </div>
                                    <h5>and</h5>
                                </div>
                                <div className={"flex gap-2"}>
                                    <div className={"flex items-center gap-2"}>
                                        Afterpay
                                        <SiAfterpay fill={"#9FF5D6"}/>
                                    </div>
                                    <h5>available.</h5>
                                </div>
                            </div>
                        </div>
                        <CreditCards/>
                    </div>
                </div>
            </SwiperSlide>
        </Swiper>
    );
};

export default HomePageSwiper;