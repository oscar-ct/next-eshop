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
                <div className="text-center hero-content">
                    <div className="max-w-lg">
                        <h1 className="text-8xl font-bold mb-8"> 404
                        </h1>
                        <p className="text-3xl mb-8">
                            Sorry, the page you were looking for doesn&apos;t seem to exist anymore
                        </p>
                        <div className={"pt-10 flex justify-center"}>
                            <div>
                                <Image
                                    priority
                                    width={800}
                                    height={600}
                                    src={"/images/lazy-cat.webp"}
                                    alt={"Not found"}
                                    className={""}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default NotFoundPage;