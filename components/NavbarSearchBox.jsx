"use client";

import {useState} from "react";
import {useParams, useRouter} from "next/navigation";
import useWindowDimensions from "@/hooks/useWindowDimensions";

const SearchBox = ({ toggle }) => {

    const router = useRouter();
    const {searchTerm} = useParams();
    const [shake, setShake] = useState(false);
    const [keyword, setKeyword] = useState(searchTerm || "");

    const {width} = useWindowDimensions();

    const submitSearch = () => {
        if (keyword.trim()) {
            router.push(`/products/search/${keyword}/page/1`);
            if (width < 768) {
                toggle();
            }
        } else {
            if (!shake) {
                setShake(true);
                setTimeout(function () {
                    setShake(false);
                }, 500);
            }
        }
    };
    return (
        <div className="relative" style={shake === true ? {animation: "shake 0.5s", animationIterationCount: ".5"} : {}}>
            <input
                autoComplete={"off"}
                className="w-full bg-slate-500/70 h-10 pl-5 rounded-full text-base text-white placeholder-white/70 focus:outline-none md:w-72"
                type="search"
                name="search"
                placeholder="Search products"
                value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyPress={(e) => {
                    e.key === "Enter" && submitSearch()
                }}
            />
            <button aria-label="search" onClick={submitSearch} type="button" className="absolute right-0 top-0 flex justify-center items-center h-full w-10 rounded-tr-full rounded-br-full">
                <svg className="text-white h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg"
                      version="1.1" id="SearchTerm" x="0px" y="0px"
                     viewBox="0 0 56.966 56.966"
                     width="512px" height="512px">
                <path
                d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                </svg>
            </button>
        </div>
    );
};

export default SearchBox;