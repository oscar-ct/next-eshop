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
                    <div className={"flex flex-col w-full h-36 md:h-24 relative rainbow"}>
                        <div className={"px-4 flex items-center bg-zinc-50 rounded-lg absolute top-0 left-0 right-0 bottom-0 m-auto h-[calc(100%-4px)] w-[calc(100%-4px)] dark:text-white dark:bg-slate-700"}>
                            <h3 className={"mx-auto text-center sm:text-lg"}>
                                ShopOscar.com is a custom-built e-commerce platform, meticulously designed and developed from the ground up by <span
                                className={"font-bold text-violet-700 cursor-pointer"} onClick={openModal}>Oscar Castro</span>,
                                a Web Developer based in San Antonio, Texas.
                            </h3>
                        </div>
                    </div>
                    <div className={"flex flex-col w-full justify-evenly items-center gap-2 lg:flex-row"}>
                        <p className={"text-center py-5 text-xl text-black font-bold flex flex-col lg:text-start dark:text-white"}>
                            Enjoy free shipping on every order!
                            <span className={"text-center text-gray-500 text-sm font-light"}>when you spend over $100</span>
                        </p>
                        <HomePageCreditCards/>
                    </div>
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div className={"px-4 w-full flex flex-col justify-center items-center text-gray-600 gap-4 lg:gap-0 lg:px-8 dark:text-white"}>
                    <div className={"flex flex-col w-full h-36 md:h-24 relative rainbow"}>
                        <div className={"px-4 flex items-center bg-zinc-50 rounded-lg absolute top-0 left-0 right-0 bottom-0 m-auto h-[calc(100%-4px)] w-[calc(100%-4px)] focus:outline-none focus:ring-4 focus:ring-offset-1 dark:text-white dark:bg-slate-700"}>
                            <h3 className={"mx-auto text-center sm:text-lg"}>
                                ShopOscar.com uses <span className={"font-semibold text-blue-600"}>Stripe</span> and <span
                                className={"font-bold text-blue-600"}>PayPal</span> to handle credit card transactions, and we
                                do not store any credit card information.
                            </h3>
                        </div>
                    </div>
                    <div className={"flex flex-col w-full justify-evenly items-center gap-4 lg:flex-row"}>
                        <p className={"text-center py-5 text-xl text-black font-bold flex flex-col lg:text-start dark:text-white"}>
                            CashApp & Afterpay services available at checkout.
                            <span className={"text-center text-gray-500 text-sm font-light"}>when use select Stripe at payment</span>
                        </p>
                        <HomePageCreditCards/>
                    </div>
                </div>
            </SwiperSlide>
        </Swiper>
    );
};

export default HomePageSwiper;