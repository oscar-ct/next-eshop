import {FaGithub, FaGlobe, FaLinkedin} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import logo from "@/icons/e.svg";

const Footer = () => {
    return (
        <footer className="px-4 mx-auto max-w-screen-2xl bg-zinc-50 footer py-10 relative 2xl:px-0">
            <div className={"w-full flex flex-col items-center justify-center gap-4 lg:justify-start lg:items-start"}>
                <Link href={"/"}>
                    <Image
                        width={36}
                        height={36}
                        priority
                        className={"w-[36px] h-auto"}
                        src={logo}
                        alt="eshopjs.com"
                    />
                </Link>
                <p className={"footer-title"}>Designed and developed by <a aria-label="portfolio" href={"https://oscar-ct.com/"} target="_blank"
                                                rel="noopener noreferrer" className={"link"}>Oscar Castro</a></p>
            </div>
            <div className={"w-full flex flex-col items-center justify-center lg:justify-start lg:items-start"}>
                <span className="footer-title">Social</span>
                <div className="pt-5 grid grid-flow-col gap-4 text-xl">
                    <a aria-label="linkedin" href={"https://www.linkedin.com/in/oscar-ct"} target="_blank"
                       rel="noopener noreferrer">
                        <FaLinkedin/>
                    </a>
                    <a aria-label="github" href={"https://github.com/oscar-ct"} target="_blank"
                       rel="noopener noreferrer">
                        <FaGithub/>
                    </a>
                    <a aria-label="portfolio" href={"https://oscar-ct.com/"} target="_blank"
                       rel="noopener noreferrer">
                        <FaGlobe/>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;