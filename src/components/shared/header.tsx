"use client";

import { FC } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LayoutGrid, LogOut, User } from "lucide-react";
import { cn } from "@/lib";
import Image from "next/image";

export const Header: FC = () => {
    const pathname = usePathname();
    const { data } = useSession()
    const user = data?.user as {
        id?: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
    }

    return (
        <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto flex items-center justify-between h-14 px-4">
                <div className="flex items-center gap-6">
                    <Link
                        href="/boards"
                        className="flex items-center gap-2 text-white font-bold"
                    >
                        <LayoutGrid className="w-5 h-5 text-blue-400" />
                        Interactive Kanban Board
                    </Link>
                    <nav className="hidden sm:flex items-center gap-1">
                        <Link
                            href="/boards"
                            className={cn(
                                "px-3 py-1.5 rounded-md text-sm transition-colors",
                                pathname.startsWith("/boards")
                                    ? "bg-slate-800 text-white"
                                    : "text-slate-400 hover:text-white"
                            )}
                        >
                            Мої дошки
                        </Link>
                        <Link
                            href="/profile"
                            className={cn(
                                "px-3 py-1.5 rounded-md text-sm transition-colors",
                                pathname.startsWith("/profile")
                                    ? "bg-slate-800 text-white"
                                    : "text-slate-400 hover:text-white"
                            )}
                        >
                            Мій профіль
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/profile"
                        className="flex items-center gap-2 text-slate-300 text-sm"
                    >
                        {user.image ? (
                            <Image
                                src={decodeURIComponent(user.image)}
                                alt={user.name ?? user.id ?? "Avatar"}
                                className="rounded-full"
                                width={36}
                                height={36}
                            />
                        ) : (
                            <User className="w-4 h-4" />
                        )}
                        <span className="hidden sm:block">
                            {user.name ?? user.id}
                        </span>
                    </Link>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-black cursor-pointer"
                        onClick={() => signOut({ callbackUrl: "/login" })}
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:block ml-1">Вийти</span>
                    </Button>
                </div>
            </div>
        </header>
    );
};
