import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Footer from "./footer";
import { AnimatePresence, motion } from "framer-motion";
import { FaLinkedin, FaGithub, FaCar, FaUsers } from "react-icons/fa";
import { IoInformationCircleOutline } from "react-icons/io5";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="h-screen relative w-screen bg-neutral-100 overflow-y-auto no-scrollbar overflow-x-hidden">
      {process.env.NODE_ENV == "development" && (
        <div className="fixed left-0 top-0 z-[60]">
          <div className="block sm:hidden">sm</div>
          <div className="hidden sm:block md:hidden">md</div>
          <div className="hidden md:block lg:hidden">lg</div>
          <div className="hidden lg:block xl:hidden">xl</div>
          <div className="hidden xl:block">2xl</div>
        </div>
      )}
      <div className="flex shrink-0 z-30 relative items-center justify-center h-16 bg-white w-screen shadow-lg">
        <div className="xl:max-w-6xl w-full mx-auto h-full flex items-center justify-between   px-4">
          <div className="opacity-100  flex sm:hidden w-5 h-5" />

          <Link href="/">
            <Image src="/logo.svg" alt="logo" width={468.78} height={67.23} className="h-10 w-fit object-contain" />
          </Link>

          <div className="hidden sm:flex items-center justify-end h-full w-full">
            <NavItem href="/" title={"Users"} icon={<FaUsers className="text-2xl" />} />
            <NavItem href="/cars" title={"Cars"} icon={<FaCar className="text-2xl" />} />
            <NavItem href="/about" title={"About"} icon={<IoInformationCircleOutline className="text-2xl" />} />
          </div>

          <div className="sm:hidden">
            <AnimatedMenuButton isClosed={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)} />
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  key="menu"
                  animate={{ height: isMenuOpen ? "auto" : 0 }}
                  initial={{ height: 0 }}
                  exit={{ height: 0 }}
                  className="absolute top-16 right-0 left-0 z-90 overflow-hidden flex flex-col items-center justify-center w-full h-fit shadow-2xl bg-white"
                >
                  <div className="flex flex-col items-left gap-y-3 justify-center my-4">
                    <NavItem href="/" title={"Users"} icon={<FaUsers className="text-2xl" />} />
                    <NavItem href="/cars" title={"Cars"} icon={<FaCar className="text-2xl" />} />
                    <NavItem href="/about" title={"About"} icon={<IoInformationCircleOutline className="text-2xl" />} />

                    <div className="flex items-center justify-center gap-4 text-neutral-600 border-t border-neutral-200 pt-4">
                      <Link className="mx-2 text-2xl" href={"https://www.linkedin.com/in/ilia-nozdrachev/"}>
                        <FaLinkedin />
                      </Link>
                      <Link className="mx-2 text-2xl" href={"https://github.com/nozsavsev"}>
                        <FaGithub />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
              {isMenuOpen && (
                <motion.div
                  onClick={() => setIsMenuOpen(false)}
                  animate={{ opacity: isMenuOpen ? 1 : 0 }}
                  initial={{ opacity: 0 }}
                  exit={{ opacity: 0 }}
                  key="menu-overlay"
                  className="absolute top-16 right-0 left-0 bottom-0 z-80 overflow-hidden backdrop-blur-xs bg-black/40"
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className={`${router.pathname === "/about" ? "max-w-full" : "max-w-6xl"} mx-auto flex w-full shrink-0 min-h-[calc(100vh-4rem)]`}>
        {children}
      </div>
      <Footer />
    </div>
  );
}

const NavItem = ({ href, title, icon }: { href: string; title: string; icon?: React.ReactNode }) => {
  const router = useRouter();
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 hover:text-neutral-800 mx-2 ${
        router.pathname === href ? "text-blue-800 font-bold sm:border-b-2 border-blue-800" : "text-gray-500"
      }`}
    >
      {icon}
      {title}
    </Link>
  );
};

function AnimatedMenuButton({ isClosed, onClick }: { isClosed: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className="relative h-6 w-6 flex items-center justify-center"
    >
      <motion.span
        animate={{
          rotate: isClosed ? 45 : 0,
          y: isClosed ? 0 : -6,
        }}
        className="absolute w-5 h-0.5 bg-black"
      />
      <motion.span
        animate={{
          opacity: isClosed ? 0 : 1,
          scaleX: isClosed ? 0 : 1,
        }}
        className="absolute w-5 h-0.5 bg-black"
      />
      <motion.span
        animate={{
          rotate: isClosed ? -45 : 0,
          y: isClosed ? 0 : 6,
        }}
        className="absolute w-5 h-0.5 bg-black"
      />
    </motion.button>
  );
}
