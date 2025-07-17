import {Autoplay, EffectFade} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/react";
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';
import HomePageCreditCards from "@/components/home/HomePageCreditCards";

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
                <div className={"px-4 w-full flex flex-col justify-center items-center text-gray-600 gap-4 lg:px-8 lg:gap-0 dark:text-white"}>
                    <div className={"flex flex-col w-full h-52 md:h-44 lg:h-36 xl:h-28 relative rainbow"}>
                        <div className={"px-4 flex items-center bg-zinc-50 rounded-lg absolute top-0 left-0 right-0 bottom-0 m-auto h-[calc(100%-4px)] w-[calc(100%-4px)] dark:text-white dark:bg-slate-700"}>
                            <h3 className={"mx-auto text-center sm:text-lg"}>
                                ShopOscar.com is a precision engineered e-commerce website, designed and built from the
                                ground up by <span
                                className={"font-bold text-violet-700 cursor-pointer"}
                                onClick={openModal}>Oscar Castro</span> a web developer based in San Antonio, Texas.
                                Harnessing modern technologies like Next.js, Prisma, and seamless Stripe and PayPal
                                integrations, this platform delivers an exceptional user experience with robust performance.
                            </h3>
                        </div>
                    </div>
                    <div className={"flex flex-col w-full justify-evenly items-center gap-4 lg:flex-row"}>
                        <p className={"text-center py-5 text-xl text-black font-bold dark:text-white"}>
                            Unlock free shipping on every order when you spend $100 or more
                        </p>
                        <HomePageCreditCards/>
                    </div>
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div className={"px-4 w-full flex flex-col justify-center items-center text-gray-600 gap-4 lg:gap-0 lg:px-8 dark:text-white"}>
                    <div className={"flex flex-col w-full h-52 md:h-44 lg:h-36 xl:h-28 relative rainbow"}>
                        <div className={"px-4 flex items-center bg-zinc-50 rounded-lg absolute top-0 left-0 right-0 bottom-0 m-auto h-[calc(100%-4px)] w-[calc(100%-4px)] focus:outline-none focus:ring-4 focus:ring-offset-1 dark:text-white dark:bg-slate-700"}>
                            <h3 className={"mx-auto text-center sm:text-lg"}>
                                ShopOscar.com ensures safe and seamless transactions through trusted payment gateways, Stripe and PayPal. For your peace of mind, we do not store any credit card information, prioritizing your security and privacy with every purchase.
                            </h3>
                        </div>
                    </div>
                    <div className={"flex flex-col w-full justify-evenly items-center gap-4 lg:flex-row"}>
                        <p className={"text-center py-5 text-xl text-black font-bold dark:text-white"}>
                            Pay effortlessly with CashApp, Afterpay, and other secure, convenient payment options.
                        </p>
                        <HomePageCreditCards/>
                    </div>
                </div>
            </SwiperSlide>
        </Swiper>
    );
};

export default HomePageSwiper;