import {FaGithub, FaGlobe, FaLinkedin} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import logo from "@/icons/e.svg";

const Footer = () => {
    return (
        <footer className="bg-zinc-50 h-72 px-4 mx-auto max-w-screen-2xl md:h-56 dark:bg-slate-800 lg:dark:bg-slate-900">
            <div className={"h-full flex flex-col items-center justify-evenly opacity-60 md:flex-row dark:text-white"}>
                <div className={"h-28 w-full md:w-7/12 lg:w-6/12 flex flex-col items-center justify-between md:items-start md:h-20"}>
                    <Link href={"/public"}>
                        <Image
                            width={36}
                            height={36}
                            priority
                            className={"w-9 h-auto dark:invert"}
                            src={logo}
                            alt="eshopjs.com"
                        />
                    </Link>
                    <div className={"uppercase font-bold flex flex-col justify-center items-center  md:flex-row gap-1"}>
                        Designed and developed by
                        <a
                            aria-label="portfolio"
                            href={"https://oscar-ct.com/"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={"link"}>
                            Oscar Castro
                        </a>
                    </div>
                </div>
                <div className={"h-20 w-full md:w-5/12 lg:w-6/12 flex flex-col justify-between items-center md:items-start"}>
                    <span className="uppercase font-bold">Social</span>
                    <div className="grid grid-flow-col gap-4">
                        <a aria-label="linkedin" href={"https://www.linkedin.com/in/oscar-ct"} target="_blank"
                           rel="noopener noreferrer">
                            <FaLinkedin size={22}/>
                        </a>
                        <a aria-label="github" href={"https://github.com/oscar-ct"} target="_blank"
                           rel="noopener noreferrer">
                            <FaGithub size={22}/>
                        </a>
                        <a aria-label="portfolio" href={"https://oscar-ct.com/"} target="_blank"
                           rel="noopener noreferrer">
                            <FaGlobe size={22}/>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;