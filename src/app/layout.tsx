import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { getSession } from "@/lib/get-session";
import { Providers } from "@/components/shared";

const montserrat = Montserrat({
    variable: "--font-montserrat",
    subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
    title: "Interactive Kanban Board",
    description: "Kanban",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getSession();

    return (
        <html lang="en">
            <body
                className={`${montserrat.variable} antialiased min-h-screen bg-slate-900`}
            >
                <Providers session={session}>{children}</Providers>
            </body>
        </html>
    );
}
