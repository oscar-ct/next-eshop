"use client";

import BackButton from "@/components/BackButton";
import Image from "next/image";


const NotFoundPage = () => {
    return (
        <div className={"px-2"}>
            <div className={"flex justify-start h-min"}>
                <BackButton/>
            </div>
            <div className="hero">
                <div className="z-30 text-center hero-content">
                    <div className="max-w-lg">
                        <h1 className="text-8xl font-bold mb-8 dark:text-white">
                            404
                        </h1>
                        <p className="text-3xl mb-8 dark:text-white">
                            Purr... I&apos;m sorry, I couldn&apos;t find that page
                        </p>
                        <div className={"!z-30 pt-10 flex justify-center"}>
                            <Image
                                priority
                                width={800}
                                height={600}
                                src={"/images/lazy-cat.webp"}
                                alt={"Not found"}
                                className={"!z-30"}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default NotFoundPage;