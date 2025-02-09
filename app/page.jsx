"use client"

import HomePageProducts from "@/components/HomePageProducts";
import HomePageIntro from "@/components/HomePageIntro";
import OscarModal from "@/components/modals/OscarModal";


const Page = () => {

    return (
        <>
            <div className={"pb-10 relative overflow-hidden px-2 lg:px-4 2xl:px-0"}>
                <div className={"z-10 m-auto max-w-screen-2xl flex flex-col relative gap-4 sm:gap-8"}>
                    <HomePageIntro/>
                    {/*HomePageIntro includes: swiper slide, product categories*/}
                    <HomePageProducts/>
                </div>
            </div>
            <OscarModal/>
        </>
    )
}


export default Page;