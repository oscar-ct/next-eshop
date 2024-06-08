import {FaGithub, FaGlobe, FaLinkedin} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import logo from "@/icons/e.svg";

const Footer = () => {
    return (
        <footer className="footer p-10 bg-black text-neutral-content">
            <div>
                <Link href={"/"}>
                    <Image
                        width={36}
                        height={36}
                        priority
                        className={"w-[36px] h-auto invert"}
                        src={logo}
                        alt="eshopjs.com"
                    />
                </Link>
                <p>Designed and developed by <a aria-label="portfolio" href={"https://oscar-ct.com/"} target="_blank" rel="noopener noreferrer" className={"link"}>Oscar Castro</a></p>
            </div>
            <div className={"w-full flex justify-between"}>
                <div>
                    <span className="footer-title">Social</span>
                    <div className="pt-5 grid grid-flow-col gap-4 text-xl">
                        <a aria-label="linkedin" href={"https://www.linkedin.com/in/oscar-ct"} target="_blank" rel="noopener noreferrer">
                            <FaLinkedin/>
                        </a>
                        <a aria-label="github" href={"https://github.com/oscar-ct"} target="_blank" rel="noopener noreferrer">
                            <FaGithub/>
                        </a>
                        <a aria-label="portfolio" href={"https://oscar-ct.com/"} target="_blank" rel="noopener noreferrer">
                            <FaGlobe/>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;