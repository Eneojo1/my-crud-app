"use client";

import { useRef, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
// import useUser from "@/hooks/useUser";
import Link from "next/link";

interface Props {
  onHeightChange: (height: number) => void;
  sections: string[];
}

const Header = ({ onHeightChange, sections }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [active, setActive] = useState<string>("home");

  // const { profile } = useUser();
  // const isLoggedIn = !!profile;
  const isLoggedIn = true;

  const headerRef = useRef<HTMLElement | null>(null);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleSetActive = (section: string) => {
    setActive(section);
    setIsOpen(false);
  };

  // Update header height dynamically
  useEffect(() => {
    if (headerRef.current) {
      const updateHeight = () => {
        const height = headerRef.current?.offsetHeight ?? 0;
        onHeightChange?.(height);
        document.documentElement.style.setProperty(
          "--header-height",
          `${height}px`,
        );
      };

      updateHeight();
      window.addEventListener("resize", updateHeight);
      return () => window.removeEventListener("resize", updateHeight);
    }
  }, [onHeightChange]);

  // Smooth scroll to section (for same-page navigation)
  const scrollToSection = (id: string) => {
    if (typeof window === "undefined") return;

    if (window.location.pathname !== "/") {
      window.location.href = "/#" + id;
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 🔥 Automatically update active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { threshold: 0.4 },
    );

    sections.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header ref={headerRef}>
      <div className="flex justify-between items-center w-full">
        {/* Logo */}
        <div className="flex gap-3 items-center">
          <div className="relative w-8 sm:w-10 h-10">
            <img
              src="/logoWhite.svg"
              alt="ky&c logo"
              className="object-contain logo"
            />
          </div>
          <div className="relative w-25 sm:w-30 h-10">
            <img src="/logo2.png" alt="ky&c logo" className="object-contain" />
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <span
          onClick={toggleMenu}
          className="cursor-pointer smd:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X /> : <Menu />}
        </span>
      </div>

      {/* Navigation */}
      <nav
        className={`flex gap-6 menu-transition ${isOpen ? "menu-open" : "menu-closed"}`}
      >
        {sections.map((item) => (
          <span
            key={item}
            onClick={() => {
              scrollToSection(item);
              handleSetActive(item);
            }}
            className={`nav-tab capitalize ${active === item ? " active" : ""}`}
          >
            {item}
          </span>
        ))}

        <Link onClick={() => setIsOpen(false)} href="/blog" className="nav-tab">
          Blog
        </Link>

        {/* Login / Logout */}
        {isLoggedIn ? (
          <Link
            onClick={() => setIsOpen(false)}
            href="/dashboard"
            className="nav-tab"
          >
            Dashboard
          </Link>
        ) : (
          <Link
            onClick={() => setIsOpen(false)}
            href="/login"
            className="text-se2 hover:text-blue-600 transition cursor-pointer"
          >
            Login
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
