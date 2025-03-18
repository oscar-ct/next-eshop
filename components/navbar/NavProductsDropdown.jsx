"use client";

import {FaChevronDown} from "react-icons/fa";
import Link from "next/link";
import {useState} from "react";

const NavProductsDropdown = ({ latestProductsLink, topRatedLink }) => {

    const rotateChevron = (action) => {
        return action ? "open" : "closed";
    };
    const [productsDropdownActive, setProductsDropdownActive] = useState(false);

    return (
        <div className={"relative h-16"}
             onMouseEnter={() => setProductsDropdownActive(true)}
             onMouseLeave={() => setProductsDropdownActive(false)}>
            <div className={"cursor-pointer h-16 flex items-center"}>
                <h5 className={"font-semibold pr-1.5 dark:text-white"}>Shop</h5>
                <div className={`dark:text-white ${rotateChevron(productsDropdownActive)}`}>
                    <FaChevronDown className={"w-2.5"}/>
                </div>
            </div>
            {
                productsDropdownActive && (
                    <div className="absolute right-0 z-10 origin-top-right">
                        <div className="bg-slate-800/70 rounded-b-md text-white font-bold flex flex-col justify-between w-full dark:bg-slate-600/70">
                            <div className={"flex-col w-full"}>
                                <Link href={latestProductsLink}
                                      className={"block px-10 py-5 hover:bg-white/70 text-white hover:text-black"}
                                >
                                    <span className={"w-full text-xl whitespace-nowrap"}>Latest Products</span>
                                </Link>
                                <Link href={topRatedLink}
                                      className={"block px-10 py-5 hover:bg-white/70 text-white hover:text-black"}
                                >
                                    <span className={"w-full text-xl whitespace-nowrap"}>Top Rated</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default NavProductsDropdown;