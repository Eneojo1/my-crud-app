"use client";

import React, { useState } from "react";
import {
  BarChart,
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  Mail,
  Power,
  Settings,
  SquarePlus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const breadcrumb = parts.slice(1).join(" > "); // skip "dashboard"

  // Mobile drawer
  const [collapsed, setCollapsed] = useState(false);

  return (
    <section className="flex bg-se5">
      {/* Mobile Header */}
      <div
        className={`
          md:hidden fixed top-nh right-0 z-20 bg-se3 shadow p-2 px-4 flex items-center justify-between
          transition-all duration-300 text-white
          ${collapsed ? "w-[calc(100%-12.5rem)]" : "w-full"}
        `}
      >
        <button onClick={() => setCollapsed(!collapsed)} className="text-2xl">
          {collapsed ? <ChevronRight size={30} /> : <ChevronLeft size={30} />}
        </button>
        <h1 className="text-lg font-bold">KY&C</h1>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-30 w-50 bg-pr1 text-white py-4 space-y-6
          transform transition-all duration-300 pt-20 md:pt-0
          ${collapsed ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div>Avatar</div>
        <nav className="space-y-2">
          {menu.map((item, idx) => {
            const active = pathname === item.href;
            return (
              <Link
                key={idx}
                href={item.href}
                className={`${active ? "bg-se2" : ""} flex gap-2 px-7 py-2 hover:bg-se2 transition`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>
        <button className="flex gap-2 px-6">
          <Power size={18} />
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 mt-16 md:mt-0 overflow-auto">{children}</main>
    </section>
  );
}

const menu = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard size={18} />,
    roles: ["developer", "admin"],
  },
  {
    name: "Users",
    href: "/dashboard/users",
    icon: <Users size={18} />,
    roles: ["developer", "admin"],
  },

  {
    name: "Posts",
    href: "/dashboard/posts",
    icon: <FileText size={18} />,
    roles: ["developer", "admin"],
  },
  {
    name: "Analytics",
    href: "/dashboard/post",
    icon: <BarChart size={18} />,
    roles: ["developer", "admin"],
  },
  {
    name: "Add Post",
    href: "/dashboard/posts/add",
    icon: <SquarePlus size={18} />,
    roles: ["developer", "admin"],
  },
  {
    name: "Messages",
    href: "/dashboard/message",
    icon: <Mail size={18} />,
    roles: ["developer", "admin"],
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: <Settings size={18} />,
    roles: ["developer", "admin"],
  },
];
