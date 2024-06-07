import Link from "next/link";
import {motion} from "framer-motion";
import Image from "next/image";
import RevealMotion from "@/components/RevealMotion";

const HomePageIntroCategories = ({ productsCategory, windowInnerWidth }) => {
    return (
        <div className={"dark:bg-black/90 bg-transparent w-full flex flex-wrap justify-center py-1 lg:py-6"}>
            {
                productsCategory.slice(0, windowInnerWidth >= 768 && windowInnerWidth < 900 ? 4 : windowInnerWidth >= 900 && windowInnerWidth < 1068 ? 5 : windowInnerWidth >= 1068 && windowInnerWidth < 1250 ? 6 : windowInnerWidth >= 1250 && windowInnerWidth < 1420 ? 7 : 8).map(function (product, index) {
                    return (
                        <Link key={index} href={`/products/sort/latest/select/${product.category.toLowerCase()}/page/1`} className={"w-6/12 sm:w-[175px] p-1 sm:py-3 sm:px-2"}>
                            <RevealMotion
                                y={35}
                                isSmallScreen={false}
                            >
                                <motion.div
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                    whileHover={windowInnerWidth > 640 ? { scale: 1.1} : {scale: 1}}
                                    whileTap={windowInnerWidth > 640 ? { scale: 0.9} : {scale: 1}}
                                    className={`rounded-sm flex flex-col items-center bg-white md:shadow-md h-full w-full`}
                                >
                                    <div className="p-2 flex justify-center">
                                        <Image
                                            priority
                                            width={140}
                                            height={140}
                                            src={product.images[product.images.length > 1 ? 1 : 0].url}
                                            alt="product"
                                            className="bg-zinc-100/20 h-[9em] w-[9em] object-scale-down rounded-tr-lg rounded-tl-lg"
                                        />
                                    </div>
                                    <div className={`card-body p-2 sm:px-4 items-start h-full flex flex-col`}>
                                        <div className={`w-full h-full text-center text-sm font-semibold`}>
                                            {product.category}
                                        </div>
                                    </div>
                                </motion.div>
                            </RevealMotion>
                        </Link>
                    )
                })
            }
        </div>
    );
};

export default HomePageIntroCategories;