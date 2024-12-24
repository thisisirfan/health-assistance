"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const sidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { name: "Food Logging", href: "/dashboard/logging", icon: "Utensils" },
  {
    name: "Nutrition Calculator",
    href: "/dashboard/calculator",
    icon: "Calculator",
  },
  { name: "Food Explorer", href: "/dashboard/explorer", icon: "Search" },
  { name: "Meal Planner", href: "/dashboard/planner", icon: "Calendar" },
];

const queryClient = new QueryClient();

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <div className="min-h-screen bg-gray-100 flex">
        {/* Sidebar */}
        <Card className="w-64 m-4 p-4 flex flex-col rounded-xl">
          {/* Logo */}
          <div className="mb-8">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Icons.ActivitySquare className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Food Intelligence</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-4">
            {sidebarItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  )}
                >
                  {item.icon &&
                    Icons[item.icon as keyof typeof Icons] &&
                    React.createElement(
                      Icons[item.icon as keyof typeof Icons],
                      {
                        className: "h-5 w-5",
                      }
                    )}
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
              </Link>
            ))}
          </nav>

          {/* Bottom section */}
          <div className="space-y-3 mt-8 pt-8 border-t">
            <Link href="/dashboard/profile">
              <div
                className={cn(
                  "flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors",
                  pathname === "/dashboard/profile"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                )}
              >
                <Icons.UserCog className="h-5 w-5" />
                <span className="text-sm font-medium">Manage Profile</span>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg hover:bg-accent transition-colors"
            >
              <Icons.LogOut className="h-5 w-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </Card>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Mobile header */}
          <Card className="md:hidden m-4 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <Icons.ActivitySquare className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">Food Intelligence</span>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-lg">
                    <Icons.Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {sidebarItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="flex items-center">
                        {item.icon &&
                          Icons[item.icon as keyof typeof Icons] &&
                          React.createElement(
                            Icons[item.icon as keyof typeof Icons],
                            { className: "mr-2 h-4 w-4" }
                          )}
                        <span>{item.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center"
                    >
                      <Icons.UserCog className="mr-2 h-4 w-4" />
                      <span>Manage Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <Icons.LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>

          {/* Page content */}
          <Card className="flex-1 m-4 p-6 rounded-xl overflow-y-auto">
            {children}
          </Card>
        </div>
      </div>
    </QueryClientProvider>
  );
}
